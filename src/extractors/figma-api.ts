/**
 * src/extractors/figma-api.ts
 *
 * Extracts design tokens from BrightChamps Figma files via REST API.
 *
 * Strategy: this file has no named styles, no variables, no components.
 * Designers applied every fill / typography / effect as a raw value directly
 * on nodes. So we walk the document tree across an allowlist of pages,
 * count every distinct value, and emit frequency-ranked tokens.
 *
 *   1. GET /v1/files/{id}?depth=1           → list page ids
 *   2. For each allowed page:
 *      GET /v1/files/{id}/nodes?ids=<pageId>  → full subtree for that page
 *      Walk every node, collect fills / text styles / effects
 *   3. Dedupe by value, count occurrences + pages, rank by usage, emit tokens
 *
 * Usage: npm run extract:figma [-- --surface=student]
 */

import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import 'dotenv/config'
import { surfaces, figmaApiBase, figmaTokenEnvKey } from '../../surfaces.config.js'
import type { DesignToken, ExtractionError, ExtractionResult, Surface, TokenType } from '../types/index.js'

const EXTRACTIONS_DIR = 'ledger/.extractions'
const RATE_LIMIT_DELAY_MS = 700  // ~85 req/min, under the 100 limit
const MIN_OPACITY = 0.1          // skip fills below this threshold (masks, invisible layers)

// Pages we extract from (per strategy doc). Names must match Figma page names exactly.
// Per-surface allowlists keyed by Surface.
const PAGE_ALLOWLIST: Partial<Record<Surface, string[]>> = {
  student: [
    'Student Dashboard',
    'Onboarding and login flows',
    'Badges New 2025',
    "Parent's Corner",
    'Diamond popup',
    'Payment notification',
    'Payment Flows',
    'Module_cards',
    'Feed Design',
    'Gurukul Design Files',
    'Showcase Final',
  ],
}

// ─── Figma API helpers ────────────────────────────────────────────────────────

async function figmaGet<T>(endpoint: string): Promise<T> {
  const token = process.env[figmaTokenEnvKey]
  if (!token) throw new Error(`${figmaTokenEnvKey} not set in .env`)

  const res = await fetch(`${figmaApiBase}${endpoint}`, {
    headers: { 'X-Figma-Token': token },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Figma API ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Figma response shapes (minimal) ──────────────────────────────────────────

interface FigmaColor { r: number; g: number; b: number; a?: number }
interface FigmaPaint {
  type: string
  visible?: boolean
  color?: FigmaColor
  opacity?: number
}
interface FigmaTextStyle {
  fontFamily?: string
  fontPostScriptName?: string
  fontWeight?: number
  fontSize?: number
  lineHeightPx?: number
  letterSpacing?: number
}
interface FigmaEffect {
  type: string
  visible?: boolean
  color?: FigmaColor
  offset?: { x: number; y: number }
  radius?: number
  spread?: number
}
interface FigmaNode {
  id: string
  name: string
  type: string
  visible?: boolean
  fills?: FigmaPaint[]
  strokes?: FigmaPaint[]
  backgroundColor?: FigmaColor
  style?: FigmaTextStyle
  effects?: FigmaEffect[]
  children?: FigmaNode[]
}
interface FigmaFileShallow {
  name: string
  document: { children: FigmaNode[] }
}
interface FigmaNodesResponse {
  nodes: Record<string, { document: FigmaNode } | null>
}

// ─── Value formatters ─────────────────────────────────────────────────────────

function rgbToHex(c: FigmaColor, paintOpacity?: number): string {
  const toHex = (v: number): string => Math.round(v * 255).toString(16).padStart(2, '0')
  const r = toHex(c.r)
  const g = toHex(c.g)
  const b = toHex(c.b)
  const alpha = paintOpacity !== undefined ? paintOpacity : (c.a ?? 1)
  if (alpha >= 1) return `#${r}${g}${b}`
  const a = toHex(alpha)
  return `#${r}${g}${b}${a}`
}

function effectiveAlpha(paint: FigmaPaint): number {
  const colorAlpha = paint.color?.a ?? 1
  const paintAlpha = paint.opacity ?? 1
  return colorAlpha * paintAlpha
}

function effectToShadow(effect: FigmaEffect): string | null {
  if (effect.type !== 'DROP_SHADOW' && effect.type !== 'INNER_SHADOW') return null
  if (!effect.color || !effect.offset) return null
  const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : ''
  const x = effect.offset.x
  const y = effect.offset.y
  const blur = effect.radius ?? 0
  const spread = effect.spread ?? 0
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${rgbToHex(effect.color)}`
}

function typographySignature(s: FigmaTextStyle): string {
  return JSON.stringify({
    fontFamily: s.fontFamily ?? null,
    fontWeight: s.fontWeight ?? null,
    fontSize: s.fontSize ?? null,
    lineHeightPx: s.lineHeightPx ?? null,
    letterSpacing: s.letterSpacing ?? null,
  })
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

interface ValueAgg {
  value: string
  count: number
  pages: Set<string>
}

class Aggregator {
  private readonly buckets = new Map<TokenType, Map<string, ValueAgg>>()

  record(type: TokenType, value: string, page: string): void {
    let bucket = this.buckets.get(type)
    if (!bucket) { bucket = new Map(); this.buckets.set(type, bucket) }
    const existing = bucket.get(value)
    if (existing) {
      existing.count++
      existing.pages.add(page)
    } else {
      bucket.set(value, { value, count: 1, pages: new Set([page]) })
    }
  }

  ranked(type: TokenType): ValueAgg[] {
    const bucket = this.buckets.get(type)
    if (!bucket) return []
    return [...bucket.values()].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.value.localeCompare(b.value)
    })
  }

  countOf(type: TokenType): number {
    return this.buckets.get(type)?.size ?? 0
  }
}

// ─── Tree walker ──────────────────────────────────────────────────────────────

function walkNode(node: FigmaNode, pageName: string, agg: Aggregator): void {
  if (node.visible === false) return

  const fills: FigmaPaint[] = [...(node.fills ?? []), ...(node.strokes ?? [])]
  for (const paint of fills) {
    if (paint.visible === false) continue
    if (paint.type !== 'SOLID' || !paint.color) continue
    if (effectiveAlpha(paint) < MIN_OPACITY) continue
    agg.record('color', rgbToHex(paint.color, paint.opacity), pageName)
  }

  if (node.type === 'TEXT' && node.style) {
    agg.record('typography', typographySignature(node.style), pageName)
  }

  for (const effect of node.effects ?? []) {
    if (effect.visible === false) continue
    const s = effectToShadow(effect)
    if (s) agg.record('shadow', s, pageName)
  }

  for (const child of node.children ?? []) {
    walkNode(child, pageName, agg)
  }
}

// ─── Main extraction per surface ──────────────────────────────────────────────

interface PageStatus {
  name: string
  status: 'ok' | 'empty' | 'not-found' | 'error'
  nodesWalked?: number
  error?: string
}

async function extractFromFile(fileId: string, surface: Surface): Promise<{
  tokens: DesignToken[]
  pageStatuses: PageStatus[]
  topColors: Array<{ value: string; count: number }>
}> {
  const allowlist = PAGE_ALLOWLIST[surface]
  if (!allowlist) throw new Error(`No page allowlist defined for surface: ${surface}`)

  console.log(`  [figma] Fetching page list for file: ${fileId}`)
  const shallow = await figmaGet<FigmaFileShallow>(`/files/${fileId}?depth=1`)
  const allPages = shallow.document.children
  console.log(`  [figma] File "${shallow.name}" has ${allPages.length} pages`)

  // Map allowlist → page IDs (loose match: trim + case-insensitive)
  const normalize = (s: string): string => s.trim().toLowerCase()
  const pageById = new Map<string, FigmaNode>()
  const allowedById = new Map<string, string>()  // id → display name
  for (const p of allPages) pageById.set(normalize(p.name), p)

  const pageStatuses: PageStatus[] = []
  for (const allowedName of allowlist) {
    const match = pageById.get(normalize(allowedName))
    if (match) {
      allowedById.set(match.id, match.name)
    } else {
      pageStatuses.push({ name: allowedName, status: 'not-found' })
    }
  }

  console.log(`  [figma] Matched ${allowedById.size}/${allowlist.length} allowed pages`)

  const agg = new Aggregator()
  let pageIndex = 0

  for (const [pageId, pageName] of allowedById) {
    pageIndex++
    console.log(`  [figma] [${pageIndex}/${allowedById.size}] Fetching page: "${pageName}" (${pageId})`)
    await sleep(RATE_LIMIT_DELAY_MS)

    try {
      const res = await figmaGet<FigmaNodesResponse>(
        `/files/${fileId}/nodes?ids=${encodeURIComponent(pageId)}`
      )
      const entry = res.nodes[pageId]
      if (!entry) {
        pageStatuses.push({ name: pageName, status: 'not-found' })
        continue
      }

      const beforeCounts = agg.countOf('color') + agg.countOf('typography') + agg.countOf('shadow')
      let nodesWalked = 0
      const countingWalk = (node: FigmaNode): void => {
        nodesWalked++
        if (node.visible === false) return
        walkNode(node, pageName, agg)
        // walkNode already recurses, so avoid double recursion
      }
      countingWalk(entry.document)
      const afterCounts = agg.countOf('color') + agg.countOf('typography') + agg.countOf('shadow')

      if (afterCounts === beforeCounts) {
        pageStatuses.push({ name: pageName, status: 'empty', nodesWalked })
      } else {
        pageStatuses.push({ name: pageName, status: 'ok', nodesWalked })
      }
      console.log(`    ✓ walked, distinct values so far: ${afterCounts}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      pageStatuses.push({ name: pageName, status: 'error', error: message })
      console.error(`    ✗ Error: ${message}`)
    }
  }

  // Emit ranked tokens
  const now = new Date().toISOString()
  const mkTokens = (type: TokenType, label: string): DesignToken[] => {
    const ranked = agg.ranked(type)
    return ranked.map((agg, i) => {
      const rank = String(i + 1).padStart(2, '0')
      const token: DesignToken = {
        name: `${label}.${rank}`,
        value: agg.value,
        type,
        source: 'figma',
        surface,
        confidence: 0.9,
        extractedAt: now,
        usageCount: agg.count,
        elements: agg.count,
        pages: [...agg.pages].sort(),
      }
      return token
    })
  }

  const tokens = [
    ...mkTokens('color', 'color'),
    ...mkTokens('typography', 'typography'),
    ...mkTokens('shadow', 'shadow'),
  ]

  const topColors = agg.ranked('color').slice(0, 5).map(a => ({ value: a.value, count: a.count }))

  return { tokens, pageStatuses, topColors }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

const VALID_SURFACE_NAMES: Surface[] = ['landing', 'student', 'teacher', 'admin']

async function main(): Promise<void> {
  const surfaceArg = process.argv.find(a => a.startsWith('--surface='))?.split('=')[1]
  if (surfaceArg && !(VALID_SURFACE_NAMES as string[]).includes(surfaceArg)) {
    console.error(`[figma-api] Invalid --surface value: "${surfaceArg}"`)
    console.error(`[figma-api] Valid surfaces: ${VALID_SURFACE_NAMES.join(', ')}`)
    console.error(`[figma-api] Raw argv: ${JSON.stringify(process.argv)}`)
    console.error(`[figma-api] Hint: check for shell expansions like $$ (PID) or $! (last bg job)`)
    process.exit(1)
  }
  const targetSurfaces = surfaces.filter(s => {
    if (!s.hasFigma || !s.figmaFileId) return false
    if (s.figmaFileId.startsWith('REPLACE_WITH_')) return false
    if (surfaceArg) return s.name === surfaceArg
    return true
  })

  if (targetSurfaces.length === 0) {
    console.log('[figma-api] No Figma-enabled surfaces to extract. Done.')
    return
  }

  mkdirSync(EXTRACTIONS_DIR, { recursive: true })

  for (const surface of targetSurfaces) {
    console.log(`\n[figma-api] Extracting: ${surface.displayName} (${surface.figmaFileId})`)
    const errors: ExtractionError[] = []
    let allTokens: DesignToken[] = []
    let pageStatuses: PageStatus[] = []
    let topColors: Array<{ value: string; count: number }> = []

    if (!surface.figmaFileId) continue

    try {
      const result = await extractFromFile(surface.figmaFileId, surface.name)
      allTokens = result.tokens
      pageStatuses = result.pageStatuses
      topColors = result.topColors
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ Error: ${message}`)
      errors.push({ url: `figma://${surface.figmaFileId}`, message, fatal: true })
    }

    const distinctColors = allTokens.filter(t => t.type === 'color').length
    const distinctText = allTokens.filter(t => t.type === 'typography').length
    const distinctShadow = allTokens.filter(t => t.type === 'shadow').length

    const result: ExtractionResult = {
      surface: surface.name,
      source: 'figma',
      figmaFileId: surface.figmaFileId,
      tokens: allTokens,
      extractedAt: new Date().toISOString(),
      errors,
    }

    const outputPath = path.join(EXTRACTIONS_DIR, `${surface.name}-figma.json`)
    writeFileSync(outputPath, JSON.stringify(result, null, 2))

    console.log(`\n  ✓ Saved → ${outputPath}`)
    console.log(`\n  === Extraction Report — ${surface.displayName} ===`)
    console.log(`  Distinct colors:     ${distinctColors}`)
    console.log(`  Distinct text styles: ${distinctText}`)
    console.log(`  Distinct shadows:    ${distinctShadow}`)
    console.log(`\n  Top 5 colors by usage:`)
    if (topColors.length === 0) {
      console.log(`    (none)`)
    } else {
      for (let i = 0; i < topColors.length; i++) {
        const c = topColors[i]!
        console.log(`    ${String(i + 1).padStart(2, '0')}. ${c.value.padEnd(12)}  (${c.count} uses)`)
      }
    }
    console.log(`\n  Page status:`)
    const ok = pageStatuses.filter(p => p.status === 'ok')
    const empty = pageStatuses.filter(p => p.status === 'empty')
    const notFound = pageStatuses.filter(p => p.status === 'not-found')
    const errored = pageStatuses.filter(p => p.status === 'error')
    console.log(`    ok:        ${ok.length}`)
    console.log(`    empty:     ${empty.length}${empty.length ? '  → ' + empty.map(p => `"${p.name}"`).join(', ') : ''}`)
    console.log(`    not found: ${notFound.length}${notFound.length ? '  → ' + notFound.map(p => `"${p.name}"`).join(', ') : ''}`)
    console.log(`    errored:   ${errored.length}${errored.length ? '  → ' + errored.map(p => `"${p.name}": ${p.error}`).join(', ') : ''}`)
  }

  console.log('\n[figma-api] Done.')
}

main().catch(err => {
  console.error('[figma-api] Fatal:', err)
  process.exit(1)
})
