/**
 * src/extractors/playwright-crawler.ts
 *
 * Walks every visible element in each page and extracts design tokens
 * from computed styles. Emits frequency-ranked tokens with usage counts.
 *
 * Modes (per SurfaceConfig.extractionMode):
 *   - 'static' (default): navigate → hydrate → extract.
 *   - 'interactive': after static extract, run a narrow set of click-through
 *     probes to reach state that isn't visible on the landing URL. Each probed
 *     round tags newly-discovered values with `discoveredIn: 'interaction'`
 *     and a `trigger` label (e.g. 'click:course-card').
 *
 * Auth:
 *   Prefers storageStatePath. Falls back to cookieEnvKey+cookieFormat.
 *   After every navigation, asserts the URL is NOT `/login/` — throws
 *   AuthenticationError if the session expired.
 *
 * Usage: npm run extract:dom [-- --surface=student]
 */

import { chromium } from 'playwright'
import type { Page } from 'playwright'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import 'dotenv/config'
import { surfaces } from '../../surfaces.config.js'
import { AuthenticationError } from '../types/index.js'
import type { DesignToken, ExtractionResult, Surface, TokenType } from '../types/index.js'

const EXTRACTIONS_DIR = 'ledger/.extractions'
const MIN_OPACITY = 0.1
const MAX_ELEMENTS = 50_000

// ─── Color parsing: rgb()/rgba()/hex → #rrggbb or #rrggbbaa ───────────────────

function parseCssColorToHex(raw: string): string | null {
  const v = raw.trim().toLowerCase()
  if (!v || v === 'transparent' || v === 'none' || v === 'currentcolor') return null

  const hexMatch = v.match(/^#([0-9a-f]{3,8})$/)
  if (hexMatch) {
    const h = hexMatch[1]!
    if (h.length === 3) {
      const [r, g, b] = h.split('')
      return `#${r}${r}${g}${g}${b}${b}`
    }
    if (h.length === 6 || h.length === 8) return `#${h}`
    return null
  }

  const rgbMatch = v.match(/^rgba?\(([^)]+)\)$/)
  if (rgbMatch) {
    const parts = rgbMatch[1]!.split(',').map(s => s.trim())
    if (parts.length < 3) return null
    const r = Math.round(parseFloat(parts[0]!))
    const g = Math.round(parseFloat(parts[1]!))
    const b = Math.round(parseFloat(parts[2]!))
    const a = parts[3] !== undefined ? parseFloat(parts[3]!) : 1
    if ([r, g, b].some(n => Number.isNaN(n))) return null
    const toHex = (n: number): string => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')
    if (a >= 1) return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    if (a < MIN_OPACITY) return null
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`
  }
  return null
}

// ─── Typography signature normalization ───────────────────────────────────────

interface TypoSig {
  fontFamily: string | null
  fontSize: number | null
  fontWeight: number | null
  lineHeightPx: number | null
  letterSpacing: number | null
}

function parseFirstFontFamily(raw: string): string | null {
  if (!raw) return null
  const first = raw.split(',')[0]
  if (!first) return null
  return first.trim().replace(/^['"]|['"]$/g, '')
}

function parsePxOrNumber(raw: string): number | null {
  if (!raw) return null
  const v = raw.trim()
  if (v === 'normal' || v === 'none' || v === '') return null
  const m = v.match(/^(-?\d+\.?\d*)(px)?$/)
  if (!m) return null
  return parseFloat(m[1]!)
}

function normalizeTypographySig(raw: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; letterSpacing: string }): string | null {
  const family = parseFirstFontFamily(raw.fontFamily)
  const size = parsePxOrNumber(raw.fontSize)
  const weightNum = parseInt(raw.fontWeight, 10)
  const weight = Number.isFinite(weightNum) ? weightNum : null
  let lh = parsePxOrNumber(raw.lineHeight)
  if (lh !== null && lh < 10 && size !== null) lh = Math.round(lh * size * 100) / 100
  const ls = parsePxOrNumber(raw.letterSpacing)
  if (!family && size === null && weight === null) return null
  const sig: TypoSig = {
    fontFamily: family,
    fontSize: size,
    fontWeight: weight,
    lineHeightPx: lh,
    letterSpacing: ls,
  }
  return JSON.stringify(sig)
}

// ─── Browser-side dump ────────────────────────────────────────────────────────

interface RawPageDump {
  colors: Record<string, number>
  typography: Array<{ raw: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; letterSpacing: string }; count: number }>
  spacing: Record<string, number>
  radius: Record<string, number>
  shadows: Record<string, number>
  elementsWalked: number
  elementsVisible: number
  truncated: boolean
}

async function navigateAndHydrate(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })

  try {
    await page.waitForSelector(
      '[class*="feed"], [class*="dashboard"], [class*="course"], main, #root > div > div',
      { timeout: 10_000 },
    )
  } catch { /* proceed */ }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(2000)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)

  try {
    await page.waitForLoadState('networkidle', { timeout: 10_000 })
  } catch { /* ok */ }
}

function assertAuthenticated(page: Page): void {
  const landed = page.url()
  if (landed.includes('/login')) {
    throw new AuthenticationError(landed)
  }
}

async function extractComputedStyles(page: Page): Promise<RawPageDump> {
  return page.evaluate(({ MIN_OPACITY, MAX_ELEMENTS }) => {
    const colors: Record<string, number> = {}
    const typoMap = new Map<string, { raw: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; letterSpacing: string }; count: number }>()
    const spacing: Record<string, number> = {}
    const radius: Record<string, number> = {}
    const shadows: Record<string, number> = {}

    const all = document.querySelectorAll('*')
    let elementsWalked = 0
    let elementsVisible = 0
    const limit = Math.min(all.length, MAX_ELEMENTS)
    const truncated = all.length > MAX_ELEMENTS

    for (let i = 0; i < limit; i++) {
      const el = all[i]
      if (!el) continue
      elementsWalked++
      const s = getComputedStyle(el)

      if (s.visibility === 'hidden') continue
      if (s.display === 'none') continue
      if (parseFloat(s.opacity) <= MIN_OPACITY) continue
      const he = el as HTMLElement
      if (he.offsetWidth === 0 || he.offsetHeight === 0) continue
      elementsVisible++

      const colorProps = [
        'color', 'background-color',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
        'outline-color',
      ]
      for (const prop of colorProps) {
        const v = s.getPropertyValue(prop)
        if (v && v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent' && v !== 'currentcolor') {
          colors[v] = (colors[v] ?? 0) + 1
        }
      }

      // Skip typography collection for zero-size text (sr-only, layout placeholders,
      // or UI with font-size: 0 to suppress whitespace). Other tokens still count.
      const fontSizePx = parseFloat(s.fontSize)
      if (fontSizePx > 0) {
        const typoRaw = {
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
        }
        const typoKey = JSON.stringify(typoRaw)
        const existing = typoMap.get(typoKey)
        if (existing) existing.count++
        else typoMap.set(typoKey, { raw: typoRaw, count: 1 })
      }

      for (const prop of ['padding', 'margin', 'gap']) {
        const v = s.getPropertyValue(prop)
        if (v && v !== '0px' && v !== '') {
          spacing[v] = (spacing[v] ?? 0) + 1
        }
      }

      const r = s.getPropertyValue('border-radius')
      if (r && r !== '0px' && r !== '') radius[r] = (radius[r] ?? 0) + 1

      const sh = s.getPropertyValue('box-shadow')
      if (sh && sh !== 'none') shadows[sh] = (shadows[sh] ?? 0) + 1
    }

    return {
      colors, typography: [...typoMap.values()], spacing, radius, shadows,
      elementsWalked, elementsVisible, truncated,
    }
  }, { MIN_OPACITY, MAX_ELEMENTS })
}

// ─── Course card interaction (only interaction we actively implement) ─────────

async function clickFirstCourseCard(page: Page): Promise<string | null> {
  const selectors = [
    'a[href*="/courses/"][href*="/learn/"]',
    'a[href*="/course-detail/"]',
    '[class*="courseCard"] a',
  ]
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first()
      await loc.waitFor({ state: 'visible', timeout: 2000 })
      await loc.click()
      return sel
    } catch { continue }
  }
  return null
}

// ─── Aggregation + first-seen tracking ───────────────────────────────────────

interface FirstSeenInfo { discoveredIn: 'static' | 'interaction'; trigger?: string }

function markFirstSeen(
  seen: Map<string, FirstSeenInfo>,
  keys: Iterable<string>,
  context: FirstSeenInfo,
): number {
  let newCount = 0
  for (const k of keys) {
    if (!seen.has(k)) {
      seen.set(k, context)
      newCount++
    }
  }
  return newCount
}

function mergeCounts(into: Map<string, number>, from: Record<string, number>): void {
  for (const [k, v] of Object.entries(from)) into.set(k, (into.get(k) ?? 0) + v)
}

function rankedTokens(
  counts: Map<string, number>,
  type: TokenType,
  surface: Surface,
  label: string,
  valueNormalizer: (raw: string) => string | null,
  pageOf: (raw: string) => string[],
  firstSeenOfRaw: (raw: string) => FirstSeenInfo | undefined,
): DesignToken[] {
  interface Bucket { count: number; pages: Set<string>; firstSeen?: FirstSeenInfo }
  const dedup = new Map<string, Bucket>()
  for (const [raw, count] of counts) {
    const normalized = valueNormalizer(raw)
    if (!normalized) continue
    const existing = dedup.get(normalized)
    const pages = pageOf(raw)
    const fs = firstSeenOfRaw(raw)
    if (existing) {
      existing.count += count
      for (const p of pages) existing.pages.add(p)
      // firstSeen: keep the earliest ('static' wins over 'interaction')
      if (existing.firstSeen?.discoveredIn === 'interaction' && fs?.discoveredIn === 'static') {
        existing.firstSeen = fs
      }
    } else {
      const bucket: Bucket = { count, pages: new Set(pages) }
      if (fs) bucket.firstSeen = fs
      dedup.set(normalized, bucket)
    }
  }
  const sorted = [...dedup.entries()].sort((a, b) => {
    if (b[1].count !== a[1].count) return b[1].count - a[1].count
    return a[0].localeCompare(b[0])
  })
  const now = new Date().toISOString()
  return sorted.map(([value, b], i) => {
    const rank = String(i + 1).padStart(2, '0')
    const token: DesignToken = {
      name: `${label}.${rank}`,
      value,
      type,
      source: 'dom',
      surface,
      confidence: surface === 'admin' ? 0.8 : 0.9,
      extractedAt: now,
      usageCount: b.count,
      elements: b.count,
      pages: [...b.pages].sort(),
    }
    if (b.firstSeen) {
      token.discoveredIn = b.firstSeen.discoveredIn
      if (b.firstSeen.trigger) token.trigger = b.firstSeen.trigger
    }
    return token
  })
}

// ─── Per-surface aggregator (holds all maps) ──────────────────────────────────

interface SurfaceAgg {
  colorCounts: Map<string, number>
  typoCounts: Map<string, { raw: { fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; letterSpacing: string }; count: number }>
  spacingCounts: Map<string, number>
  radiusCounts: Map<string, number>
  shadowCounts: Map<string, number>
  colorPages: Map<string, Set<string>>
  typoPages: Map<string, Set<string>>
  spacingPages: Map<string, Set<string>>
  radiusPages: Map<string, Set<string>>
  shadowPages: Map<string, Set<string>>
  colorFirstSeen: Map<string, FirstSeenInfo>
  typoFirstSeen: Map<string, FirstSeenInfo>
  spacingFirstSeen: Map<string, FirstSeenInfo>
  radiusFirstSeen: Map<string, FirstSeenInfo>
  shadowFirstSeen: Map<string, FirstSeenInfo>
  totalWalked: number
  totalVisible: number
}

function newAgg(): SurfaceAgg {
  return {
    colorCounts: new Map(), typoCounts: new Map(),
    spacingCounts: new Map(), radiusCounts: new Map(), shadowCounts: new Map(),
    colorPages: new Map(), typoPages: new Map(),
    spacingPages: new Map(), radiusPages: new Map(), shadowPages: new Map(),
    colorFirstSeen: new Map(), typoFirstSeen: new Map(),
    spacingFirstSeen: new Map(), radiusFirstSeen: new Map(), shadowFirstSeen: new Map(),
    totalWalked: 0, totalVisible: 0,
  }
}

function mergeDump(agg: SurfaceAgg, dump: RawPageDump, pageLabel: string, context: FirstSeenInfo): number {
  agg.totalWalked += dump.elementsWalked
  agg.totalVisible += dump.elementsVisible

  let newThisRound = 0
  newThisRound += markFirstSeen(agg.colorFirstSeen, Object.keys(dump.colors), context)
  mergeCounts(agg.colorCounts, dump.colors)
  for (const k of Object.keys(dump.colors)) {
    const set = agg.colorPages.get(k) ?? new Set(); set.add(pageLabel); agg.colorPages.set(k, set)
  }

  const typoKeys = dump.typography.map(t => JSON.stringify(t.raw))
  newThisRound += markFirstSeen(agg.typoFirstSeen, typoKeys, context)
  for (const { raw, count } of dump.typography) {
    const key = JSON.stringify(raw)
    const existing = agg.typoCounts.get(key)
    if (existing) existing.count += count
    else agg.typoCounts.set(key, { raw, count })
    const set = agg.typoPages.get(key) ?? new Set(); set.add(pageLabel); agg.typoPages.set(key, set)
  }

  newThisRound += markFirstSeen(agg.spacingFirstSeen, Object.keys(dump.spacing), context)
  mergeCounts(agg.spacingCounts, dump.spacing)
  for (const k of Object.keys(dump.spacing)) {
    const set = agg.spacingPages.get(k) ?? new Set(); set.add(pageLabel); agg.spacingPages.set(k, set)
  }

  newThisRound += markFirstSeen(agg.radiusFirstSeen, Object.keys(dump.radius), context)
  mergeCounts(agg.radiusCounts, dump.radius)
  for (const k of Object.keys(dump.radius)) {
    const set = agg.radiusPages.get(k) ?? new Set(); set.add(pageLabel); agg.radiusPages.set(k, set)
  }

  newThisRound += markFirstSeen(agg.shadowFirstSeen, Object.keys(dump.shadows), context)
  mergeCounts(agg.shadowCounts, dump.shadows)
  for (const k of Object.keys(dump.shadows)) {
    const set = agg.shadowPages.get(k) ?? new Set(); set.add(pageLabel); agg.shadowPages.set(k, set)
  }

  return newThisRound
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

const VALID_SURFACE_NAMES: Surface[] = ['landing', 'student', 'teacher', 'admin']

async function main(): Promise<void> {
  const surfaceArg = process.argv.find(a => a.startsWith('--surface='))?.split('=')[1]
  const modeArg = process.argv.find(a => a.startsWith('--mode='))?.split('=')[1] as 'static' | 'interactive' | undefined

  if (surfaceArg && !(VALID_SURFACE_NAMES as string[]).includes(surfaceArg)) {
    console.error(`[playwright-crawler] Invalid --surface value: "${surfaceArg}"`)
    console.error(`[playwright-crawler] Valid surfaces: ${VALID_SURFACE_NAMES.join(', ')}`)
    console.error(`[playwright-crawler] Raw argv: ${JSON.stringify(process.argv)}`)
    console.error(`[playwright-crawler] Hint: check for shell expansions like $$ (PID) or $! (last bg job)`)
    process.exit(1)
  }

  const targetSurfaces = surfaceArg
    ? surfaces.filter(s => s.name === surfaceArg)
    : surfaces

  if (targetSurfaces.length === 0) {
    console.error(`[playwright-crawler] No surface found for: ${surfaceArg}`)
    process.exit(1)
  }

  mkdirSync(EXTRACTIONS_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: process.env['PLAYWRIGHT_HEADED'] !== 'true',
  })

  for (const surface of targetSurfaces) {
    const mode = modeArg ?? surface.extractionMode ?? 'static'
    console.log(`\n[playwright-crawler] Extracting: ${surface.displayName} (mode=${mode})`)
    const errors: ExtractionResult['errors'] = []

    const contextOptions: Parameters<typeof browser.newContext>[0] = {}
    if (surface.storageStatePath) {
      if (!existsSync(surface.storageStatePath)) {
        console.warn(`  ⚠  storageState file not found at ${surface.storageStatePath} — requests will be unauthenticated`)
        console.warn(`     Refresh with: npx playwright codegen --save-storage=${surface.storageStatePath} <login-url>`)
      } else {
        contextOptions.storageState = surface.storageStatePath
        console.log(`  🔑 auth: storageState from ${surface.storageStatePath}`)
      }
    } else if (surface.cookieEnvKey && surface.cookieFormat === 'header') {
      const cookieValue = process.env[surface.cookieEnvKey]
      if (!cookieValue) {
        console.warn(`  ⚠  ${surface.cookieEnvKey} not set in .env — requests will be unauthenticated`)
      } else {
        contextOptions.extraHTTPHeaders = { Cookie: cookieValue }
        console.log(`  🔑 auth: Cookie header from ${surface.cookieEnvKey}`)
      }
    }

    const context = await browser.newContext(contextOptions)
    const page = await context.newPage()
    const agg = newAgg()

    const perUrlStats: Array<{ url: string; walked: number; visible: number; distinctColors: number }> = []
    const interactionsAttempted: string[] = []
    const interactionsSucceeded: string[] = []
    const interactionsFailed: string[] = []
    const discoveredUrls: string[] = []
    let interactionNewTokens = 0

    for (const url of surface.urls) {
      console.log(`  → ${url}`)
      try {
        await navigateAndHydrate(page, url)
        assertAuthenticated(page)
        const staticDump = await extractComputedStyles(page)
        mergeDump(agg, staticDump, url, { discoveredIn: 'static' })
        const distinctColors = Object.keys(staticDump.colors).length
        perUrlStats.push({ url, walked: staticDump.elementsWalked, visible: staticDump.elementsVisible, distinctColors })
        console.log(`    ✓ static: walked ${staticDump.elementsWalked}, visible ${staticDump.elementsVisible}, distinct colors ${distinctColors}`)

        // Only one real interaction: course-card click on /my-feed/
        if (mode === 'interactive' && url.includes('/my-feed')) {
          const trigger = 'click:course-card'
          interactionsAttempted.push(trigger)
          const matched = await clickFirstCourseCard(page)
          if (!matched) {
            console.warn(`    ⚠  interaction ${trigger}: no selector matched; skipping`)
            interactionsFailed.push(trigger)
          } else {
            try {
              await page.waitForLoadState('networkidle', { timeout: 10_000 })
            } catch { /* ok */ }
            try {
              assertAuthenticated(page)
              const landed = page.url()
              discoveredUrls.push(landed)
              const interactionDump = await extractComputedStyles(page)
              const newThisRound = mergeDump(agg, interactionDump, landed, { discoveredIn: 'interaction', trigger })
              interactionNewTokens += newThisRound
              interactionsSucceeded.push(trigger)
              console.log(`    ✓ interaction ${trigger}: matched ${matched}, landed ${landed}, new tokens ${newThisRound}`)
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e)
              interactionsFailed.push(trigger)
              console.warn(`    ⚠  interaction ${trigger} extraction failed: ${msg}`)
            }
          }
        }
      } catch (err) {
        if (err instanceof AuthenticationError) {
          console.error(`    ✗ Auth failed on ${url} — landed on ${err.landedUrl}`)
          console.error(`       Refresh with: npx playwright codegen --save-storage=${surface.storageStatePath ?? '.playwright-auth/<surface>.json'} <login-url>`)
          errors.push({ url, message: err.message, fatal: true })
          break   // don't continue if auth is broken
        }
        const message = err instanceof Error ? err.message : String(err)
        console.error(`    ✗ Error: ${message}`)
        errors.push({ url, message })
      }
    }

    await context.close()

    // Build tokens from aggregator
    const colorPageOf = (raw: string): string[] => [...(agg.colorPages.get(raw) ?? [])]
    const typoPageOf = (raw: string): string[] => [...(agg.typoPages.get(raw) ?? [])]
    const spacingPageOf = (raw: string): string[] => [...(agg.spacingPages.get(raw) ?? [])]
    const radiusPageOf = (raw: string): string[] => [...(agg.radiusPages.get(raw) ?? [])]
    const shadowPageOf = (raw: string): string[] => [...(agg.shadowPages.get(raw) ?? [])]

    const colorTokens = rankedTokens(
      agg.colorCounts, 'color', surface.name, 'color',
      parseCssColorToHex, colorPageOf,
      raw => agg.colorFirstSeen.get(raw),
    )

    // Typography: normalize sigs, rank; preserve firstSeen from raw key
    const typoNormalizedCounts = new Map<string, number>()
    const typoNormalizedFirstSeen = new Map<string, FirstSeenInfo>()
    const typoNormalizedPages = new Map<string, Set<string>>()
    for (const [rawKey, { count }] of agg.typoCounts) {
      const { raw } = agg.typoCounts.get(rawKey)!
      const sig = normalizeTypographySig(raw)
      if (!sig) continue
      typoNormalizedCounts.set(sig, (typoNormalizedCounts.get(sig) ?? 0) + count)
      const fs = agg.typoFirstSeen.get(rawKey)
      if (fs) {
        const existing = typoNormalizedFirstSeen.get(sig)
        if (!existing || (existing.discoveredIn === 'interaction' && fs.discoveredIn === 'static')) {
          typoNormalizedFirstSeen.set(sig, fs)
        }
      }
      const pagesSet = agg.typoPages.get(rawKey)
      if (pagesSet) {
        const existing = typoNormalizedPages.get(sig) ?? new Set()
        for (const p of pagesSet) existing.add(p)
        typoNormalizedPages.set(sig, existing)
      }
    }
    const typographyTokens = rankedTokens(
      typoNormalizedCounts, 'typography', surface.name, 'typography',
      v => v, raw => [...(typoNormalizedPages.get(raw) ?? [])],
      raw => typoNormalizedFirstSeen.get(raw),
    )

    const spacingTokens = rankedTokens(
      agg.spacingCounts, 'spacing', surface.name, 'spacing',
      v => v.trim(), spacingPageOf,
      raw => agg.spacingFirstSeen.get(raw),
    )
    const radiusTokens = rankedTokens(
      agg.radiusCounts, 'radius', surface.name, 'radius',
      v => v.trim(), radiusPageOf,
      raw => agg.radiusFirstSeen.get(raw),
    )
    const shadowTokens = rankedTokens(
      agg.shadowCounts, 'shadow', surface.name, 'shadow',
      v => v.trim(), shadowPageOf,
      raw => agg.shadowFirstSeen.get(raw),
    )

    const allTokens: DesignToken[] = [
      ...colorTokens, ...typographyTokens, ...spacingTokens, ...radiusTokens, ...shadowTokens,
    ]

    const result: ExtractionResult = {
      surface: surface.name,
      source: 'dom',
      tokens: allTokens,
      extractedAt: new Date().toISOString(),
      errors,
    }
    if (mode === 'interactive') {
      result.interactionsSummary = {
        attempted: interactionsAttempted.length,
        succeeded: interactionsSucceeded.length,
        failed: interactionsFailed,
        newTokensDiscovered: interactionNewTokens,
        discoveredUrls,
      }
    }

    const outputPath = path.join(EXTRACTIONS_DIR, `${surface.name}-dom.json`)
    writeFileSync(outputPath, JSON.stringify(result, null, 2))

    console.log(`\n  === Extraction Report — ${surface.displayName} (DOM, mode=${mode}) ===`)
    console.log(`  Elements walked:     ${agg.totalWalked}`)
    console.log(`  Elements visible:    ${agg.totalVisible}`)
    console.log(`  Distinct colors:     ${colorTokens.length}`)
    console.log(`  Distinct typography: ${typographyTokens.length}`)
    console.log(`  Distinct spacing:    ${spacingTokens.length}`)
    console.log(`  Distinct radius:     ${radiusTokens.length}`)
    console.log(`  Distinct shadows:    ${shadowTokens.length}`)
    console.log(`  Saved ${allTokens.length} tokens → ${outputPath}`)

    console.log(`\n  Per-URL element counts:`)
    const pad = (s: string, n: number): string => s.padEnd(n)
    console.log(`    ${pad('URL', 60)} ${pad('Walked', 8)} ${pad('Visible', 9)} ${pad('Colors', 7)}`)
    for (const s of perUrlStats) {
      console.log(`    ${pad(s.url, 60)} ${pad(String(s.walked), 8)} ${pad(String(s.visible), 9)} ${pad(String(s.distinctColors), 7)}`)
    }

    if (mode === 'interactive') {
      console.log(`\n  Interaction summary:`)
      console.log(`    attempted:            ${interactionsAttempted.length}`)
      console.log(`    succeeded:            ${interactionsSucceeded.length}`)
      console.log(`    failed:               ${interactionsFailed.length}${interactionsFailed.length ? ' → ' + interactionsFailed.join(', ') : ''}`)
      console.log(`    new tokens via click: ${interactionNewTokens}`)
      if (discoveredUrls.length) console.log(`    discovered URLs:      ${discoveredUrls.join(', ')}`)
    }
  }

  await browser.close()
  console.log('\n[playwright-crawler] Done.')
}

main().catch(err => {
  console.error('[playwright-crawler] Fatal:', err)
  process.exit(1)
})
