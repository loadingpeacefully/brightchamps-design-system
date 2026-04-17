/**
 * src/drift/detect.ts
 *
 * Value-based drift detection between DOM tokens (live app) and the canonical
 * ledger (design intent). Each DOM token is matched to its closest Figma
 * canonical by perceptual distance / tolerance; each Figma canonical is checked
 * for presence in DOM.
 *
 * Status classification per item:
 *   match       — DOM value is within the "same as canonical" threshold
 *   drift       — DOM value is close but off (needs a decision)
 *   unknown     — DOM value has no close canonical (not in design system)
 *   system-gap  — DOM value has no close canonical but SHOULD be in the system
 *                 (currently heuristic: alpha-hex colors with no match are
 *                 typically overlays/scrims that the Figma source never captured)
 *   missing     — canonical exists but no DOM token maps to it
 *
 * Usage: npm run drift:detect [-- --surface=student]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { hexToLab, deltaE76 } from '../resolver/cluster.js'
import type {
  DesignToken,
  DriftItem,
  DriftReport,
  DriftSeverity,
  DriftStatus,
  ExtractionResult,
  LedgerState,
  LedgerToken,
  MatchMethod,
  Surface,
  TokenType,
} from '../types/index.js'

const LEDGER_DIR = 'ledger'
const EXTRACTIONS_DIR = 'ledger/.extractions'

// ─── Thresholds (align with ADR-0008 clustering) ──────────────────────────────

const COLOR_MATCH_DELTA_E = 2      // < 2 = match
const COLOR_DRIFT_DELTA_E = 10     // 2–10 = drift; > 10 = unknown
const SIZE_TOLERANCE_PX = 2        // spacing / radius exact-match window
const SIZE_DRIFT_MAX_PX = 8        // > 8 px off = unknown (not in system)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function severityForColor(delta: number): DriftSeverity {
  if (delta < 2) return 'low'
  if (delta < 5) return 'medium'
  if (delta < 10) return 'high'
  return 'critical'
}

function severityForSize(deltaPx: number): DriftSeverity {
  const d = Math.abs(deltaPx)
  if (d <= SIZE_TOLERANCE_PX) return 'low'
  if (d <= 5) return 'medium'
  if (d <= SIZE_DRIFT_MAX_PX) return 'high'
  return 'critical'
}

function severityForMissing(rank: number): DriftSeverity {
  if (rank <= 10) return 'critical'
  if (rank <= 30) return 'high'
  if (rank <= 60) return 'medium'
  return 'low'
}

function newDriftItem(overrides: Omit<Partial<DriftItem>, 'domPages'> & {
  tokenType: TokenType
  surface: Surface
  status: DriftStatus
  severity: DriftSeverity
  domPages?: string[] | undefined
}): DriftItem {
  const item: DriftItem = {
    id: randomUUID(),
    tokenName: overrides.tokenName ?? '(unnamed)',
    tokenType: overrides.tokenType,
    surface: overrides.surface,
    figmaValue: overrides.figmaValue ?? null,
    domValue: overrides.domValue ?? null,
    figmaToken: overrides.figmaToken ?? null,
    matchMethod: overrides.matchMethod ?? 'none',
    delta: overrides.delta ?? 0,
    status: overrides.status,
    severity: overrides.severity,
    detectedAt: new Date().toISOString(),
  }
  if (overrides.domPages && overrides.domPages.length > 0) item.domPages = overrides.domPages
  return item
}

// ─── Color matching ───────────────────────────────────────────────────────────

interface ClosestColor {
  canonical: LedgerToken
  delta: number
}

function findClosestColor(domHex: string, canonicals: LedgerToken[]): ClosestColor | null {
  const solid = domHex.match(/^#[0-9a-f]{6}$/i)
  if (!solid) {
    // alpha variant — only match exactly (no Lab distance for alpha)
    const exact = canonicals.find(c => c.value.toLowerCase() === domHex.toLowerCase())
    return exact ? { canonical: exact, delta: 0 } : null
  }
  const domLab = hexToLab(domHex)
  let best: ClosestColor | null = null
  for (const c of canonicals) {
    if (!/^#[0-9a-f]{6}$/i.test(c.value)) continue
    const d = deltaE76(domLab, hexToLab(c.value))
    if (!best || d < best.delta) best = { canonical: c, delta: d }
  }
  return best
}

function detectColorDrift(
  domTokens: DesignToken[],
  canonicals: LedgerToken[],
  surface: Surface,
): { items: DriftItem[]; matchedCanonicalIds: Set<string> } {
  const items: DriftItem[] = []
  const matchedCanonicalIds = new Set<string>()

  const isAlphaHex = (v: string): boolean => /^#[0-9a-f]{8}$/i.test(v)

  for (const dom of domTokens) {
    const closest = findClosestColor(dom.value, canonicals)
    if (!closest) {
      // No canonical at all. Alpha-hex with no match → likely overlay/scrim
      // that's missing from the system, not drift. Mark as system-gap.
      const gapStatus: DriftStatus = isAlphaHex(dom.value) ? 'system-gap' : 'unknown'
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: 'color',
        surface,
        domValue: dom.value,
        status: gapStatus,
        severity: gapStatus === 'system-gap' ? 'medium' : 'critical',
        matchMethod: 'none',
        domPages: dom.pages,
      }))
      continue
    }
    const { canonical, delta } = closest
    let status: DriftStatus
    let matchMethod: MatchMethod
    if (delta < COLOR_MATCH_DELTA_E) {
      status = 'match'
      matchMethod = delta === 0 ? 'exact' : 'delta-e'
      matchedCanonicalIds.add(canonical.id)
    } else if (delta < COLOR_DRIFT_DELTA_E) {
      status = 'drift'
      matchMethod = 'delta-e'
      matchedCanonicalIds.add(canonical.id)
    } else if (isAlphaHex(dom.value)) {
      status = 'system-gap'
      matchMethod = 'none'
    } else {
      status = 'unknown'
      matchMethod = 'none'
    }
    items.push(newDriftItem({
      tokenName: dom.name,
      tokenType: 'color',
      surface,
      figmaValue: canonical.value,
      domValue: dom.value,
      figmaToken: canonical,
      matchMethod,
      delta: Number(delta.toFixed(3)),
      status,
      severity: severityForColor(delta),
      domPages: dom.pages,
    }))
  }

  return { items, matchedCanonicalIds }
}

// ─── Typography matching ──────────────────────────────────────────────────────

interface TypoSig {
  fontFamily: string | null
  fontSize: number | null
  fontWeight: number | null
}

function parseTypoSig(value: string): TypoSig | null {
  try {
    const p = JSON.parse(value) as { fontFamily?: string | null; fontSize?: number | null; fontWeight?: number | null }
    return {
      fontFamily: p.fontFamily ?? null,
      fontSize: p.fontSize ?? null,
      fontWeight: p.fontWeight ?? null,
    }
  } catch { return null }
}

function detectTypographyDrift(
  domTokens: DesignToken[],
  canonicals: LedgerToken[],
  surface: Surface,
): { items: DriftItem[]; matchedCanonicalIds: Set<string> } {
  const items: DriftItem[] = []
  const matchedCanonicalIds = new Set<string>()

  const canonicalSigs = canonicals.map(c => ({ token: c, sig: parseTypoSig(c.value) })).filter(c => c.sig !== null)

  for (const dom of domTokens) {
    const domSig = parseTypoSig(dom.value)
    if (!domSig) continue
    const exact = canonicalSigs.find(c =>
      c.sig!.fontFamily === domSig.fontFamily &&
      c.sig!.fontSize === domSig.fontSize &&
      c.sig!.fontWeight === domSig.fontWeight,
    )
    if (exact) {
      matchedCanonicalIds.add(exact.token.id)
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: 'typography',
        surface,
        figmaValue: exact.token.value,
        domValue: dom.value,
        figmaToken: exact.token,
        matchMethod: 'exact',
        delta: 0,
        status: 'match',
        severity: 'low',
        domPages: dom.pages,
      }))
      continue
    }
    // Family matches — drift on size/weight
    const sameFamily = canonicalSigs.find(c => c.sig!.fontFamily === domSig.fontFamily)
    if (sameFamily) {
      matchedCanonicalIds.add(sameFamily.token.id)
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: 'typography',
        surface,
        figmaValue: sameFamily.token.value,
        domValue: dom.value,
        figmaToken: sameFamily.token,
        matchMethod: 'none',
        delta: 0,
        status: 'drift',
        severity: 'medium',
        domPages: dom.pages,
      }))
      continue
    }
    // Wrong family entirely
    items.push(newDriftItem({
      tokenName: dom.name,
      tokenType: 'typography',
      surface,
      domValue: dom.value,
      matchMethod: 'none',
      status: 'unknown',
      severity: 'critical',
      domPages: dom.pages,
    }))
  }

  return { items, matchedCanonicalIds }
}

// ─── Size matching (spacing / radius) — Figma has no canonicals currently ────

function detectSizeDrift(
  type: 'spacing' | 'radius',
  domTokens: DesignToken[],
  canonicals: LedgerToken[],
  surface: Surface,
): { items: DriftItem[]; matchedCanonicalIds: Set<string> } {
  const items: DriftItem[] = []
  const matchedCanonicalIds = new Set<string>()

  if (canonicals.length === 0) {
    // No Figma canonicals of this type — every DOM value is 'unknown' (not in system).
    // Degrade severity: these are expected gaps, not drift.
    for (const dom of domTokens) {
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: type,
        surface,
        domValue: dom.value,
        status: 'unknown',
        severity: 'low',
        matchMethod: 'none',
        domPages: dom.pages,
      }))
    }
    return { items, matchedCanonicalIds }
  }

  const parsePx = (v: string): number | null => {
    const m = v.match(/^(-?\d+\.?\d*)(px)?$/)
    return m ? parseFloat(m[1]!) : null
  }

  for (const dom of domTokens) {
    const domPx = parsePx(dom.value)
    if (domPx === null) {
      // shorthand like "8px 16px" — can't compare numerically
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: type,
        surface,
        domValue: dom.value,
        status: 'unknown',
        severity: 'low',
        matchMethod: 'none',
        domPages: dom.pages,
      }))
      continue
    }
    let best: { canonical: LedgerToken; delta: number } | null = null
    for (const c of canonicals) {
      const cPx = parsePx(c.value)
      if (cPx === null) continue
      const d = Math.abs(domPx - cPx)
      if (!best || d < best.delta) best = { canonical: c, delta: d }
    }
    if (!best) {
      items.push(newDriftItem({
        tokenName: dom.name,
        tokenType: type,
        surface,
        domValue: dom.value,
        status: 'unknown',
        severity: 'low',
        matchMethod: 'none',
        domPages: dom.pages,
      }))
      continue
    }
    let status: DriftStatus
    let matchMethod: MatchMethod
    if (best.delta <= SIZE_TOLERANCE_PX) {
      status = 'match'
      matchMethod = best.delta === 0 ? 'exact' : 'tolerance'
      matchedCanonicalIds.add(best.canonical.id)
    } else if (best.delta <= SIZE_DRIFT_MAX_PX) {
      status = 'drift'
      matchMethod = 'tolerance'
      matchedCanonicalIds.add(best.canonical.id)
    } else {
      status = 'unknown'
      matchMethod = 'none'
    }
    items.push(newDriftItem({
      tokenName: dom.name,
      tokenType: type,
      surface,
      figmaValue: best.canonical.value,
      domValue: dom.value,
      figmaToken: best.canonical,
      matchMethod,
      delta: Number(best.delta.toFixed(2)),
      status,
      severity: severityForSize(best.delta),
      domPages: dom.pages,
    }))
  }

  return { items, matchedCanonicalIds }
}

// ─── Missing-from-dom detection ───────────────────────────────────────────────

function detectMissing(
  canonicals: LedgerToken[],
  matchedIds: Set<string>,
  surface: Surface,
): DriftItem[] {
  const items: DriftItem[] = []
  canonicals.forEach((c, idx) => {
    if (matchedIds.has(c.id)) return
    const rank = idx + 1
    items.push(newDriftItem({
      tokenName: c.name,
      tokenType: c.type,
      surface,
      figmaValue: c.value,
      domValue: null,
      figmaToken: c,
      matchMethod: 'none',
      status: 'missing',
      severity: severityForMissing(rank),
    }))
  })
  return items
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const VALID_SURFACES: Surface[] = ['landing', 'student', 'teacher', 'admin']

function parseSurfaceArg(): Surface | undefined {
  const raw = process.argv.find(a => a.startsWith('--surface='))?.split('=')[1]
  if (!raw) return undefined
  if (!(VALID_SURFACES as string[]).includes(raw)) {
    console.error(`[drift:detect] Invalid --surface value: "${raw}"`)
    console.error(`[drift:detect] Valid surfaces: ${VALID_SURFACES.join(', ')}`)
    console.error(`[drift:detect] Raw argv: ${JSON.stringify(process.argv)}`)
    console.error(`[drift:detect] Hint: check for shell expansions like $$ (PID) or $! (last bg job) in your command`)
    process.exit(1)
  }
  return raw as Surface
}

async function main(): Promise<void> {
  const surfaceArg = parseSurfaceArg()

  console.log('[drift:detect] Loading ledger...')
  let ledger: LedgerState
  try {
    ledger = JSON.parse(readFileSync(path.join(LEDGER_DIR, 'tokens.json'), 'utf-8')) as LedgerState
  } catch {
    console.error('[drift:detect] Ledger not found. Run npm run ledger:build first.')
    process.exit(1)
  }

  const canonicals = ledger.tokens.filter(t => t.canonical)
  const canonicalsByType: Record<TokenType, LedgerToken[]> = {
    color: [], typography: [], spacing: [], radius: [], shadow: [],
    border: [], opacity: [], zIndex: [], motion: [],
  }
  for (const t of canonicals) canonicalsByType[t.type].push(t)

  const targetSurfaces: Surface[] = surfaceArg ? [surfaceArg] : ['landing', 'student', 'teacher', 'admin']
  const allItems: DriftItem[] = []
  const perSurface: Record<string, { matches: number; drifted: number; missing: number; unknown: number }> = {}

  for (const surface of targetSurfaces) {
    const domPath = path.join(EXTRACTIONS_DIR, `${surface}-dom.json`)
    let domResult: ExtractionResult
    try {
      domResult = JSON.parse(readFileSync(domPath, 'utf-8')) as ExtractionResult
    } catch {
      console.warn(`[drift:detect] No DOM extraction for surface=${surface} — skipping`)
      continue
    }
    const domByType: Record<TokenType, DesignToken[]> = {
      color: [], typography: [], spacing: [], radius: [], shadow: [],
      border: [], opacity: [], zIndex: [], motion: [],
    }
    for (const t of domResult.tokens) domByType[t.type].push(t)

    const colorResult = detectColorDrift(domByType.color, canonicalsByType.color, surface)
    const typoResult = detectTypographyDrift(domByType.typography, canonicalsByType.typography, surface)
    const spacingResult = detectSizeDrift('spacing', domByType.spacing, canonicalsByType.spacing, surface)
    const radiusResult = detectSizeDrift('radius', domByType.radius, canonicalsByType.radius, surface)

    const allMatchedColor = colorResult.matchedCanonicalIds
    const allMatchedTypo = typoResult.matchedCanonicalIds

    const missingColor = detectMissing(canonicalsByType.color, allMatchedColor, surface)
    const missingTypo = detectMissing(canonicalsByType.typography, allMatchedTypo, surface)

    const surfaceItems: DriftItem[] = [
      ...colorResult.items, ...missingColor,
      ...typoResult.items, ...missingTypo,
      ...spacingResult.items, ...radiusResult.items,
    ]
    allItems.push(...surfaceItems)

    const counts = { matches: 0, drifted: 0, missing: 0, unknown: 0 }
    for (const it of surfaceItems) {
      if (it.status === 'match') counts.matches++
      else if (it.status === 'drift') counts.drifted++
      else if (it.status === 'missing') counts.missing++
      else if (it.status === 'unknown' || it.status === 'system-gap') counts.unknown++
    }
    perSurface[surface] = counts
  }

  // Summary tables
  const bySeverity: Record<DriftSeverity, number> = { critical: 0, high: 0, medium: 0, low: 0 }
  const byType: Record<TokenType, number> = {
    color: 0, typography: 0, spacing: 0, radius: 0, shadow: 0,
    border: 0, opacity: 0, zIndex: 0, motion: 0,
  }
  const byStatus: Record<DriftStatus, number> = { match: 0, drift: 0, missing: 0, unknown: 0, 'system-gap': 0 }
  for (const it of allItems) {
    bySeverity[it.severity]++
    byType[it.tokenType]++
    if (it.status) byStatus[it.status]++
  }

  const reportSurfaces: Surface[] = surfaceArg ? [surfaceArg] : (targetSurfaces as Surface[])
  const report: DriftReport = {
    id: randomUUID(),
    generatedAt: new Date().toISOString(),
    surfaces: reportSurfaces,
    totalItems: allItems.length,
    bySeverity,
    byType,
    byStatus,
    items: allItems,
  }

  mkdirSync(path.join(LEDGER_DIR, 'drift'), { recursive: true })
  const dateStr = new Date().toISOString().split('T')[0]
  const reportPath = path.join(LEDGER_DIR, 'drift', `${dateStr}.json`)
  writeFileSync(reportPath, JSON.stringify(report, null, 2))

  // Console table
  console.log('\n[drift:detect] Drift report — value-based comparison')
  console.log('  (DOM tokens vs canonical ledger)\n')
  const pad = (s: string, n: number): string => s.padEnd(n)
  console.log(`  ${pad('Surface', 10)} ${pad('Type', 12)} ${pad('Match', 7)} ${pad('Drift', 7)} ${pad('Missing', 9)} ${pad('Unknown', 9)} ${pad('Sys-gap', 8)}`)
  console.log(`  ${'─'.repeat(78)}`)

  for (const surface of targetSurfaces) {
    if (!perSurface[surface]) continue
    for (const type of ['color', 'typography', 'spacing', 'radius'] as TokenType[]) {
      const items = allItems.filter(i => i.surface === surface && i.tokenType === type)
      if (items.length === 0) continue
      const m = items.filter(i => i.status === 'match').length
      const d = items.filter(i => i.status === 'drift').length
      const ms = items.filter(i => i.status === 'missing').length
      const u = items.filter(i => i.status === 'unknown').length
      const sg = items.filter(i => i.status === 'system-gap').length
      console.log(`  ${pad(surface, 10)} ${pad(type, 12)} ${pad(String(m), 7)} ${pad(String(d), 7)} ${pad(String(ms), 9)} ${pad(String(u), 9)} ${pad(String(sg), 8)}`)
    }
  }

  console.log(`\n  TOTAL items: ${allItems.length}`)
  console.log(`    match:       ${byStatus.match}`)
  console.log(`    drift:       ${byStatus.drift}`)
  console.log(`    missing:     ${byStatus.missing}`)
  console.log(`    unknown:     ${byStatus.unknown}`)
  console.log(`    system-gap:  ${byStatus['system-gap']}`)
  console.log(`\n  By severity:`)
  console.log(`    critical: ${bySeverity.critical}`)
  console.log(`    high:     ${bySeverity.high}`)
  console.log(`    medium:   ${bySeverity.medium}`)
  console.log(`    low:      ${bySeverity.low}`)
  console.log(`\n  Written to: ${reportPath}`)
}

main().catch(err => {
  console.error('[drift:detect] Fatal:', err)
  process.exit(1)
})
