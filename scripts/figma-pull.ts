/**
 * scripts/figma-pull.ts
 *
 * Pulls the current state of the Figma file via REST API and compares
 * against the canonical ledger. If deltas exist, writes a drift report.
 *
 * Figma endpoints used:
 *   GET /v1/files/:key/variables/local    — variables (may 403 without editor access)
 *   GET /v1/files/:key/styles             — published styles
 *   GET /v1/files/:key?depth=1            — file metadata + page list + top-level styles map
 *
 * Exit codes:
 *   0 — no deltas found (or Figma returned no usable data)
 *   1 — deltas written to ledger/drift/
 *
 * Requires: FIGMA_ACCESS_TOKEN env var (or FIGMA_API_TOKEN as fallback)
 *
 * Usage: FIGMA_ACCESS_TOKEN=xxx npm run figma:pull
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import 'dotenv/config'
import { randomUUID } from 'crypto'
import type { LedgerState, LedgerToken } from '../src/types/index.js'

const FILE_KEY = 'EznPshYN5XVc49fQSUOSEQ'
const FIGMA_BASE = 'https://api.figma.com/v1'
const LEDGER_PATH = 'ledger/tokens.json'
const DRIFT_DIR = 'ledger/drift'
const BASELINE_DIR = 'ledger/baselines'

const TOKEN = process.env['FIGMA_ACCESS_TOKEN'] ?? process.env['FIGMA_API_TOKEN'] ?? ''
if (!TOKEN) {
  console.error('[figma-pull] FIGMA_ACCESS_TOKEN not set. Set it in .env or pass via environment.')
  process.exit(2)
}

// ─── Figma API helpers ────────────────────────────────────────────────────────

async function figmaGet<T>(endpoint: string): Promise<T> {
  const url = `${FIGMA_BASE}${endpoint}`
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Figma API ${res.status} on ${endpoint}: ${body.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── Color conversion ─────────────────────────────────────────────────────────

function figmaColorToHex(c: { r: number; g: number; b: number; a?: number }): string {
  const toHex = (v: number): string => Math.round(v * 255).toString(16).padStart(2, '0')
  const hex = `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`
  if (c.a !== undefined && c.a < 1) return `${hex}${toHex(c.a)}`
  return hex
}

// ─── Pull strategies ──────────────────────────────────────────────────────────

interface FigmaToken {
  name: string
  value: string
  type: 'color' | 'float' | 'string' | 'boolean'
  source: 'variables' | 'styles' | 'file-styles'
  raw: Record<string, unknown>
}

async function pullVariables(): Promise<FigmaToken[]> {
  console.log('[figma-pull] Fetching local variables...')
  try {
    const res = await figmaGet<{
      meta: {
        variables: Record<string, {
          id: string
          name: string
          resolvedType: string
          valuesByMode: Record<string, unknown>
        }>
        variableCollections: Record<string, {
          id: string
          name: string
          modes: Array<{ modeId: string; name: string }>
        }>
      }
    }>(`/files/${FILE_KEY}/variables/local`)

    const vars = Object.values(res.meta.variables)
    console.log(`[figma-pull]   ${vars.length} variables found`)
    const tokens: FigmaToken[] = []

    for (const v of vars) {
      const name = v.name.replace(/\//g, '-').toLowerCase()
      const modeValues = Object.values(v.valuesByMode)
      const firstValue = modeValues[0]
      if (!firstValue) continue

      let value = String(firstValue)
      let type: FigmaToken['type'] = 'string'

      if (v.resolvedType === 'COLOR') {
        type = 'color'
        const c = firstValue as { r?: number; g?: number; b?: number; a?: number }
        if (c.r !== undefined) value = figmaColorToHex(c as { r: number; g: number; b: number; a?: number })
      } else if (v.resolvedType === 'FLOAT') {
        type = 'float'
        value = `${firstValue}px`
      } else if (v.resolvedType === 'BOOLEAN') {
        type = 'boolean'
      }

      tokens.push({ name, value, type, source: 'variables', raw: { id: v.id, resolvedType: v.resolvedType, valuesByMode: v.valuesByMode } })
    }
    return tokens
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('403') || msg.includes('forbidden')) {
      console.warn('[figma-pull]   Variables API returned 403 — need editor access. Falling back to styles.')
      return []
    }
    throw err
  }
}

async function pullPublishedStyles(): Promise<FigmaToken[]> {
  console.log('[figma-pull] Fetching published styles...')
  const res = await figmaGet<{
    meta: { styles: Array<{ key: string; name: string; style_type: string; node_id: string; description: string }> }
  }>(`/files/${FILE_KEY}/styles`)

  const styles = res.meta.styles
  console.log(`[figma-pull]   ${styles.length} published styles found`)
  return styles.map(s => ({
    name: s.name.replace(/\//g, '-').toLowerCase().replace(/\s+/g, '-'),
    value: `(style:${s.style_type}:${s.key})`,
    type: (s.style_type === 'FILL' ? 'color' : 'string') as FigmaToken['type'],
    source: 'styles' as const,
    raw: { key: s.key, nodeId: s.node_id, styleType: s.style_type, description: s.description },
  }))
}

async function pullFileMetadata(): Promise<{ name: string; lastModified: string; stylesCount: number; pagesCount: number; figmaTokens: FigmaToken[] }> {
  console.log('[figma-pull] Fetching file metadata...')
  const res = await figmaGet<{
    name: string
    lastModified: string
    document: { children: Array<{ name: string }> }
    styles: Record<string, { key: string; name: string; styleType: string; description: string }>
  }>(`/files/${FILE_KEY}?depth=1`)

  const styles = Object.values(res.styles ?? {})
  console.log(`[figma-pull]   File: "${res.name}" · last modified: ${res.lastModified}`)
  console.log(`[figma-pull]   ${res.document.children.length} pages · ${styles.length} file-level styles`)

  const tokens: FigmaToken[] = styles.map(s => ({
    name: `file-style-${s.name.replace(/\//g, '-').toLowerCase().replace(/\s+/g, '-')}`,
    value: `(file-style:${s.styleType}:${s.key})`,
    type: (s.styleType === 'FILL' ? 'color' : 'string') as FigmaToken['type'],
    source: 'file-styles' as const,
    raw: { key: s.key, name: s.name, styleType: s.styleType, description: s.description },
  }))

  return {
    name: res.name,
    lastModified: res.lastModified,
    stylesCount: styles.length,
    pagesCount: res.document.children.length,
    figmaTokens: tokens,
  }
}

// ─── Comparison against ledger ────────────────────────────────────────────────

interface Delta {
  id: string
  kind: 'added' | 'removed' | 'value_changed'
  tokenName: string
  figmaValue: string | null
  ledgerValue: string | null
  source: string
  severity: 'patch' | 'minor' | 'breaking'
}

function compareToLedger(figmaTokens: FigmaToken[], ledger: LedgerState): Delta[] {
  const deltas: Delta[] = []
  const ledgerByValue = new Map<string, LedgerToken>()
  const canonicals = ledger.tokens.filter(t => t.canonical)

  for (const t of canonicals) {
    ledgerByValue.set(t.value.toLowerCase(), t)
  }

  // Check figma tokens against ledger
  for (const ft of figmaTokens) {
    if (ft.type !== 'color') continue
    const val = ft.value.toLowerCase()
    if (!ledgerByValue.has(val)) {
      deltas.push({
        id: randomUUID(),
        kind: 'added',
        tokenName: ft.name,
        figmaValue: ft.value,
        ledgerValue: null,
        source: ft.source,
        severity: 'minor',
      })
    }
  }

  return deltas
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('[figma-pull] Starting Figma pull for file:', FILE_KEY)

  // Load ledger
  let ledger: LedgerState
  try {
    ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf-8')) as LedgerState
    console.log(`[figma-pull] Ledger loaded: ${ledger.tokens.length} tokens (${ledger.tokens.filter(t => t.canonical).length} canonical)`)
  } catch {
    console.error('[figma-pull] Cannot load ledger at', LEDGER_PATH)
    process.exit(2)
  }

  // Pull from Figma (try variables first, fall back to styles + metadata)
  const allFigmaTokens: FigmaToken[] = []

  const variables = await pullVariables()
  allFigmaTokens.push(...variables)
  await sleep(700)

  const publishedStyles = await pullPublishedStyles()
  allFigmaTokens.push(...publishedStyles)
  await sleep(700)

  const fileMeta = await pullFileMetadata()
  allFigmaTokens.push(...fileMeta.figmaTokens)

  console.log(`\n[figma-pull] Total Figma tokens pulled: ${allFigmaTokens.length}`)
  console.log(`  Variables:        ${variables.length}`)
  console.log(`  Published styles: ${publishedStyles.length}`)
  console.log(`  File-level styles: ${fileMeta.figmaTokens.length}`)

  // Save baseline snapshot
  mkdirSync(BASELINE_DIR, { recursive: true })
  const baselineFile = path.join(BASELINE_DIR, `figma-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(baselineFile, JSON.stringify({
    fileKey: FILE_KEY,
    fileName: fileMeta.name,
    lastModified: fileMeta.lastModified,
    pulledAt: new Date().toISOString(),
    variablesCount: variables.length,
    publishedStylesCount: publishedStyles.length,
    fileStylesCount: fileMeta.figmaTokens.length,
    pagesCount: fileMeta.pagesCount,
    tokens: allFigmaTokens,
  }, null, 2))
  console.log(`[figma-pull] Baseline saved: ${path.relative('.', baselineFile)}`)

  // Compare against ledger
  const deltas = compareToLedger(allFigmaTokens, ledger)

  console.log(`\n═══════════════════════════════════════════════════════════════`)
  console.log(`  FIGMA PULL REPORT`)
  console.log(`═══════════════════════════════════════════════════════════════`)
  console.log(`  File:              ${fileMeta.name}`)
  console.log(`  Last modified:     ${fileMeta.lastModified}`)
  console.log(`  Variables:         ${variables.length}`)
  console.log(`  Published styles:  ${publishedStyles.length}`)
  console.log(`  File-level styles: ${fileMeta.figmaTokens.length}`)
  console.log(`  Total pulled:      ${allFigmaTokens.length}`)
  console.log(`  Ledger canonical:  ${ledger.tokens.filter(t => t.canonical).length}`)
  console.log(`  ─────────────────────────────────────────────────────────────`)
  console.log(`  Deltas found:      ${deltas.length}`)

  if (deltas.length > 0) {
    const added = deltas.filter(d => d.kind === 'added')
    const removed = deltas.filter(d => d.kind === 'removed')
    const changed = deltas.filter(d => d.kind === 'value_changed')

    console.log(`    Added:           ${added.length}`)
    console.log(`    Removed:         ${removed.length}`)
    console.log(`    Value changed:   ${changed.length}`)
    console.log(``)

    // Show first 20 deltas
    const show = deltas.slice(0, 20)
    for (const d of show) {
      const arrow = d.kind === 'added' ? '+' : d.kind === 'removed' ? '-' : '~'
      console.log(`    ${arrow} ${d.tokenName.padEnd(40)} ${d.figmaValue ?? '(none)'}`)
    }
    if (deltas.length > 20) console.log(`    ... and ${deltas.length - 20} more`)

    // Write drift report
    mkdirSync(DRIFT_DIR, { recursive: true })
    const dateStr = new Date().toISOString().split('T')[0]
    const driftPath = path.join(DRIFT_DIR, `figma-${dateStr}.json`)
    writeFileSync(driftPath, JSON.stringify({
      id: randomUUID(),
      type: 'figma_update',
      generatedAt: new Date().toISOString(),
      fileKey: FILE_KEY,
      fileName: fileMeta.name,
      lastModified: fileMeta.lastModified,
      summary: {
        total: deltas.length,
        added: added.length,
        removed: removed.length,
        valueChanged: changed.length,
      },
      deltas,
    }, null, 2))
    console.log(`\n  Drift report written: ${path.relative('.', driftPath)}`)
    console.log(`═══════════════════════════════════════════════════════════════`)
    process.exit(1)
  } else {
    console.log(`    No actionable deltas.`)
    console.log(`═══════════════════════════════════════════════════════════════`)
    process.exit(0)
  }
}

main().catch(err => {
  console.error('[figma-pull] Fatal:', err)
  process.exit(2)
})
