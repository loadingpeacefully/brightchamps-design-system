/**
 * scripts/migrate-tokens.ts
 *
 * DESTRUCTIVE. Applies the TDR-0001 taxonomy migration to ledger/tokens.json
 * in place. Backs up the pre-migration state to ledger/tokens.legacy.json.
 *
 * Renames flat frequency-ranked names (color.008, typography.01, spacing.04)
 * to semantic hybrid names (color/primary/500, font/heading/xl, space/4)
 * per TDR-0001 Amendment A3. Also writes the legacy → new mapping to
 * ledger/deprecated.json (with CSS variable mapping).
 *
 * Preserves: id, value, type, source, surface, confidence, sources, surfaces,
 * canonical, deprecated, raw, description, usageCount, pages, etc. Only the
 * `name` field changes. Tokens that already have semantic names (anything
 * starting with `color/`, `font/heading/*`, etc. from manual-canonicals) pass
 * through unchanged.
 *
 * KNOWN LIMITATION: `ledger:build` regenerates names from scratch via the
 * resolver's nameOverride logic. Running ledger:build after this script will
 * undo the rename. The architecturally-correct fix is to integrate the rename
 * mapping into src/resolver/index.ts so ledger:build produces semantic names
 * natively. That refactor is tracked as a follow-up.
 *
 * Usage: npm run migrate:tokens
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs'
import path from 'path'
import type { LedgerState, LedgerToken } from '../src/types/index.js'

const LEDGER_PATH = 'ledger/tokens.json'
const LEGACY_BACKUP_PATH = 'ledger/tokens.legacy.json'
const DEPRECATED_PATH = 'ledger/deprecated.json'

// ─── Color math ───────────────────────────────────────────────────────────────

function isAlphaHex(v: string): boolean { return /^#[0-9a-f]{8}$/i.test(v) }
function solidOf(v: string): string { return isAlphaHex(v) ? '#' + v.slice(1, 7) : v }

interface HSL { h: number; s: number; l: number }
function hexToHsl(hex: string): HSL {
  const h = hex.replace('#', '').slice(0, 6)
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  const L = (max + min) / 2
  const S = d === 0 ? 0 : (L > 0.5 ? d / (2 - max - min) : d / (max + min))
  let H = 0
  if (d) {
    if (max === r) H = ((g - b) / d) % 6
    else if (max === g) H = (b - r) / d + 2
    else H = (r - g) / d + 4
    H = H * 60
    if (H < 0) H += 360
  }
  return { h: H, s: S * 100, l: L * 100 }
}
function luminance(hex: string): number {
  const h = solidOf(hex).replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// ─── Color classification ────────────────────────────────────────────────────

type ColorGroup = 'brand' | 'neutral' | 'feedback' | 'overlay' | 'surface' | 'interactive'
type FeedbackRole = 'danger' | 'warning' | 'success' | 'info'

const BRAND_HEXES = new Set(['#4e3bc2', '#6651e4', '#4d3bc2', '#1a237e', '#0d47a1'])
const NEUTRAL_L_FLOOR = 5
const NEUTRAL_L_CEILING = 97

function classifyColor(t: LedgerToken): ColorGroup {
  if (t.name.startsWith('color/interactive/')) return 'interactive'
  if (t.name.startsWith('color/overlay/')) return 'overlay'
  if (t.name.startsWith('color/surface/')) return 'surface'
  const v = t.value.toLowerCase()
  if (isAlphaHex(v)) return 'overlay'
  if (BRAND_HEXES.has(v)) return 'brand'
  const hsl = hexToHsl(v)
  if (hsl.l < NEUTRAL_L_FLOOR) return 'neutral'
  if (hsl.l > NEUTRAL_L_CEILING) return 'neutral'
  if (hsl.s < 15) return 'neutral'
  if (hsl.l > 92) return 'surface'
  if (hsl.h >= 240 && hsl.h <= 280 && hsl.s >= 35) return 'brand'
  return 'feedback'
}

function feedbackRole(hex: string): FeedbackRole {
  const { h } = hexToHsl(solidOf(hex))
  if (h >= 340 || h < 20) return 'danger'
  if (h >= 20 && h < 70) return 'warning'
  if (h >= 70 && h < 170) return 'success'
  return 'info'
}

// ─── Shade-scale assignment ───────────────────────────────────────────────────

const SHADE_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
function indexToShade(index: number, total: number): string {
  if (total <= SHADE_SCALE.length) {
    const step = Math.round((index / Math.max(total - 1, 1)) * (SHADE_SCALE.length - 1))
    return String(SHADE_SCALE[step])
  }
  return String((index + 1) * 100).padStart(3, '0')
}

// ─── Typography role mapping ──────────────────────────────────────────────────

interface TypoSig { fontFamily: string | null; fontSize: number | null; fontWeight: number | null; lineHeightPx: number | null; letterSpacing: number | null }
function parseTypo(v: string): TypoSig | null { try { return JSON.parse(v) as TypoSig } catch { return null } }

function typographyRoleName(size: number, weight: number): string {
  if (weight <= 500) {
    if (size <= 10) return 'font/body/xxsmall'
    if (size <= 12) return 'font/body/xsmall'
    if (size <= 14) return 'font/body/small'
    if (size <= 16) return 'font/body/medium'
    if (size <= 18) return 'font/body/large'
    return 'font/body/xlarge'
  }
  if (size <= 10) return 'font/heading/xxsmall'
  if (size <= 12) return 'font/heading/xsmall'
  if (size <= 14) return 'font/heading/small'
  if (size <= 16) return 'font/heading/medium'
  if (size <= 18) return 'font/heading/large'
  if (size <= 20) return 'font/heading/xlarge'
  return 'font/heading/xxlarge'
}

// ─── Spacing + radius mappings ────────────────────────────────────────────────

const SPACING_MAP: Record<number, string> = {
  0: 'space/0',  2: 'space/0-5', 4: 'space/1',  6: 'space/1-5',
  8: 'space/2', 10: 'space/2-5', 12: 'space/3', 14: 'space/3-5',
  16: 'space/4', 20: 'space/5',  24: 'space/6', 28: 'space/7',
  32: 'space/8', 40: 'space/10', 48: 'space/12', 56: 'space/14',
  64: 'space/16', 72: 'space/18', 80: 'space/20', 96: 'space/24', 120: 'space/30',
}
function spacingName(v: string): string {
  const m = v.match(/^(-?\d+\.?\d*)px$/)
  if (!m) return ''
  const n = parseFloat(m[1]!)
  return SPACING_MAP[n] ?? ''
}

function radiusName(v: string): string {
  const m = v.match(/^(-?\d+\.?\d*)px$/)
  if (!m) return ''
  const n = parseFloat(m[1]!)
  const map: Record<number, string> = {
    0: 'radius/none', 2: 'radius/xs', 4: 'radius/sm', 6: 'radius/md',
    8: 'radius/md', 10: 'radius/lg', 12: 'radius/lg', 16: 'radius/xl',
    20: 'radius/xl', 24: 'radius/2xl', 32: 'radius/3xl', 30: 'radius/pill',
    50: 'radius/pill', 100: 'radius/full', 9999: 'radius/full',
  }
  return map[n] ?? ''
}

// ─── CSS variable name generator (mirrors build-tokens.ts cssVarName) ────────

function cssVarName(tokenName: string): string {
  return '--' + tokenName.replace(/[./]/g, '-')
}
function legacyCssVarName(tokenName: string): string {
  return '--bc-' + tokenName.replace(/[./]/g, '-')
}

// ─── Build the rename map ─────────────────────────────────────────────────────

interface RenameEntry {
  oldName: string
  newName: string
  reason: string
}

function buildRenameMap(tokens: LedgerToken[]): { renames: Map<string, string>; entries: RenameEntry[] } {
  const renames = new Map<string, string>()
  const entries: RenameEntry[] = []
  const usedNames = new Set<string>()
  const live = tokens.filter(t => !t.deprecated)

  const claim = (oldName: string, newName: string, reason: string): void => {
    if (oldName === newName) return
    if (usedNames.has(newName)) {
      // collision — keep first-claim, suffix the loser with -dup-N
      let n = 2
      while (usedNames.has(`${newName}-dup-${n}`)) n++
      newName = `${newName}-dup-${n}`
    }
    usedNames.add(newName)
    renames.set(oldName, newName)
    entries.push({ oldName, newName, reason })
  }

  // ── Colors ──
  const colors = live.filter(t => t.type === 'color')
  const byGroup: Record<ColorGroup, LedgerToken[]> = { brand: [], neutral: [], feedback: [], overlay: [], surface: [], interactive: [] }
  for (const t of colors) {
    // Anything that already starts with color/ (and isn't a flat color.NN) keeps its name —
    // course verticals, manual canonicals, surface/overlay/interactive, brand/primary aliases.
    if (t.name.startsWith('color/')) {
      usedNames.add(t.name)  // reserve so we don't collide with it
      continue
    }
    byGroup[classifyColor(t)].push(t)
  }

  // Brand → color/primary/{shade} (luminance-sorted, lightest = lowest shade)
  {
    const list = byGroup.brand.slice().sort((a, b) => luminance(b.value) - luminance(a.value))
    list.forEach((t, i) => {
      const shade = indexToShade(i, list.length)
      claim(t.name, `color/primary/${shade}`, 'brand-primary-ramp')
    })
  }

  // Neutral → color/neutral/{shade}
  {
    const list = byGroup.neutral.slice().sort((a, b) => luminance(b.value) - luminance(a.value))
    list.forEach((t, i) => {
      const shade = indexToShade(i, list.length)
      claim(t.name, `color/neutral/${shade}`, 'neutral-ramp')
    })
  }

  // Feedback → split by role, color/{role}/{shade}
  {
    const byRole: Record<FeedbackRole, LedgerToken[]> = { danger: [], warning: [], success: [], info: [] }
    for (const t of byGroup.feedback) byRole[feedbackRole(solidOf(t.value))].push(t)
    const ROLE_TO_NAME: Record<FeedbackRole, string> = { danger: 'error', warning: 'warning', success: 'success', info: 'info' }
    for (const role of Object.keys(byRole) as FeedbackRole[]) {
      const list = byRole[role].slice().sort((a, b) => luminance(b.value) - luminance(a.value))
      list.forEach((t, i) => {
        const shade = indexToShade(i, list.length)
        claim(t.name, `color/${ROLE_TO_NAME[role]}/${shade}`, `feedback-${role}-ramp`)
      })
    }
  }

  // Surface → color/surface/{shade} (only flat-named ones; semantic ones already kept)
  {
    const list = byGroup.surface.slice().sort((a, b) => luminance(b.value) - luminance(a.value))
    list.forEach((t, i) => {
      const shade = indexToShade(i, list.length)
      claim(t.name, `color/surface/${shade}`, 'surface-ramp')
    })
  }

  // Overlay (rare — flat-named overlays); rank by alpha
  {
    const list = byGroup.overlay.slice().sort((a, b) => {
      const aA = isAlphaHex(a.value) ? parseInt(a.value.slice(-2), 16) : 255
      const bA = isAlphaHex(b.value) ? parseInt(b.value.slice(-2), 16) : 255
      return aA - bA
    })
    list.forEach((t) => {
      const alpha = isAlphaHex(t.value) ? parseInt(t.value.slice(-2), 16) : 255
      const pct = Math.round((alpha / 255) * 100)
      claim(t.name, `color/overlay/generic-${pct}`, 'overlay-generic')
    })
  }

  // Interactive — already semantic (color/interactive/*); claim() is a no-op for matching names.
  for (const t of byGroup.interactive) claim(t.name, t.name, 'interactive-preserved')

  // ── Typography ──
  const typos = live.filter(t => t.type === 'typography')
  const typoEntries: Array<{ token: LedgerToken; sig: TypoSig }> = []
  for (const t of typos) {
    if (t.name.startsWith('font/')) { usedNames.add(t.name); continue }
    const sig = parseTypo(t.value)
    if (!sig || sig.fontSize === null || sig.fontWeight === null) continue
    typoEntries.push({ token: t, sig })
  }
  // Group by role; if collision, keep most-used and disambiguate the rest by size-weight
  const typoByRole = new Map<string, Array<{ token: LedgerToken; sig: TypoSig }>>()
  for (const e of typoEntries) {
    const role = typographyRoleName(e.sig.fontSize!, e.sig.fontWeight!)
    const list = typoByRole.get(role) ?? []
    list.push(e)
    typoByRole.set(role, list)
  }
  for (const [role, list] of typoByRole) {
    list.sort((a, b) => (b.token.usageCount ?? 0) - (a.token.usageCount ?? 0))
    list.forEach((e, i) => {
      const newName = i === 0 ? role : `${role}/${e.sig.fontSize}-${e.sig.fontWeight}`
      claim(e.token.name, newName, i === 0 ? 'typography-primary' : 'typography-collision')
    })
  }

  // ── Spacing ──
  const spacing = live.filter(t => t.type === 'spacing')
  for (const t of spacing) {
    if (t.name.startsWith('space/')) { usedNames.add(t.name); continue }
    const newName = spacingName(t.value)
    if (newName) claim(t.name, newName, 'spacing-ramp')
    // unmapped spacing (shorthands, odd values) stays under its old name
  }

  // ── Radius ──
  const radii = live.filter(t => t.type === 'radius')
  for (const t of radii) {
    if (t.name.startsWith('radius/')) { usedNames.add(t.name); continue }
    const newName = radiusName(t.value)
    if (newName) claim(t.name, newName, 'radius-ramp')
  }

  // ── Shadow ──
  const shadows = live.filter(t => t.type === 'shadow').sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  shadows.forEach((t, i) => {
    if (t.name.startsWith('shadow/')) { usedNames.add(t.name); return }
    const rank = String(i + 1).padStart(2, '0')
    claim(t.name, `shadow/${rank}`, 'shadow-rank')
  })

  return { renames, entries }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('[migrate:tokens] DESTRUCTIVE in-place rename.')
  console.log('[migrate:tokens] Loading ledger:', LEDGER_PATH)
  const raw = readFileSync(LEDGER_PATH, 'utf-8')
  const ledger = JSON.parse(raw) as LedgerState

  // Backup pre-migration state
  if (existsSync(LEGACY_BACKUP_PATH)) {
    console.log('[migrate:tokens] Backup exists at', LEGACY_BACKUP_PATH, '— overwriting')
  }
  copyFileSync(LEDGER_PATH, LEGACY_BACKUP_PATH)
  console.log('[migrate:tokens] Backup written:', LEGACY_BACKUP_PATH)

  const { renames, entries } = buildRenameMap(ledger.tokens)

  // Apply renames in place
  let renamed = 0
  for (const t of ledger.tokens) {
    const next = renames.get(t.name)
    if (next && next !== t.name) {
      t.name = next
      renamed++
    }
  }

  writeFileSync(path.resolve(LEDGER_PATH), JSON.stringify(ledger, null, 2))

  // Write deprecated.json (legacy → new mapping with CSS vars)
  const mapping = entries
    .filter(e => e.oldName !== e.newName)
    .map(e => ({
      from: e.oldName,
      to: e.newName,
      cssFrom: legacyCssVarName(e.oldName),
      cssTo: cssVarName(e.newName),
      reason: e.reason,
    }))
  writeFileSync(path.resolve(DEPRECATED_PATH), JSON.stringify(mapping, null, 2))

  // Report
  console.log('')
  console.log('═══════════════════════════════════════════════════════════════════════════════')
  console.log('  TDR-0001 · DESTRUCTIVE TOKEN RENAME · COMPLETE')
  console.log('═══════════════════════════════════════════════════════════════════════════════')
  console.log(`  Total tokens in ledger:    ${ledger.tokens.length.toLocaleString()}`)
  console.log(`  Renamed:                   ${renamed.toLocaleString()}`)
  console.log(`  Mapping entries written:   ${mapping.length.toLocaleString()}`)
  console.log('')
  console.log('  Sample renames (first 12):')
  for (const e of entries.filter(x => x.oldName !== x.newName).slice(0, 12)) {
    console.log(`    ${e.oldName.padEnd(30)} → ${e.newName.padEnd(40)} [${e.reason}]`)
  }
  console.log('')
  console.log('  Artifacts:')
  console.log(`    ${LEDGER_PATH}             (renamed in place)`)
  console.log(`    ${LEGACY_BACKUP_PATH}      (pre-migration backup)`)
  console.log(`    ${DEPRECATED_PATH}        (legacy → new mapping)`)
  console.log('')
  console.log('  WARNING: do NOT run `npm run ledger:build` — the resolver still')
  console.log('  generates names from scratch (color.NN, typography.NN, etc.) and')
  console.log('  would undo this migration. The architectural follow-up is to')
  console.log('  integrate this rename map into src/resolver/index.ts.')
  console.log('═══════════════════════════════════════════════════════════════════════════════')
}

main()
