/**
 * scripts/migrate-tokens.ts
 *
 * DRY-RUN ONLY. Proposes the TDR-0001 taxonomy migration from the current
 * frequency-ranked flat token names to a semantic, hierarchical, DTCG-compliant
 * structure. Produces three artifacts for design + engineering review:
 *
 *   1. ledger/tokens.proposed.json        — the full proposed ledger (DTCG 2025.10)
 *   2. ledger/deprecated.proposed.json    — flat legacy → new mapping
 *   3. console report                     — counts + 20 representative samples
 *
 * Never writes to ledger/tokens.json. Never deletes anything. Safe to run.
 *
 * Usage: npm run migrate:tokens
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { LedgerState, LedgerToken } from '../src/types/index.js'

const LEDGER_PATH = 'ledger/tokens.json'
const PROPOSED_PATH = 'ledger/tokens.proposed.json'
const DEPRECATED_PATH = 'ledger/deprecated.proposed.json'

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

// Luminance floor / ceiling: at the perceptual extremes, hue classification
// is meaningless because the human eye perceives the color as black or white.
// Anything below 5% L is effectively black regardless of hue; anything above
// 97% L is effectively white. Route both to the neutral ramp.
const NEUTRAL_L_FLOOR = 5     // L% below this → always neutral
const NEUTRAL_L_CEILING = 97  // L% above this (with low-to-mid saturation) → always neutral

function classifyColor(t: LedgerToken): ColorGroup {
  if (t.name.startsWith('color/interactive/')) return 'interactive'
  if (t.name.startsWith('color/overlay/')) return 'overlay'
  if (t.name.startsWith('color/surface/')) return 'surface'
  const v = t.value.toLowerCase()
  if (isAlphaHex(v)) return 'overlay'
  if (BRAND_HEXES.has(v)) return 'brand'
  const hsl = hexToHsl(v)
  // Perceptual-extreme floor/ceiling — runs BEFORE hue-based classification
  // so that near-black and near-white don't accidentally land in chromatic ramps.
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

function hueBucket(hex: string): string {
  const { h } = hexToHsl(solidOf(hex))
  if (h >= 340 || h < 20) return 'red'
  if (h >= 20 && h < 50) return 'orange'
  if (h >= 50 && h < 70) return 'yellow'
  if (h >= 70 && h < 170) return 'green'
  if (h >= 170 && h < 200) return 'teal'
  if (h >= 200 && h < 240) return 'blue'
  if (h >= 240 && h < 290) return 'purple'
  return 'pink'
}

// ─── Typography role mapping ──────────────────────────────────────────────────

interface TypoSig { fontFamily: string | null; fontSize: number | null; fontWeight: number | null; lineHeightPx: number | null; letterSpacing: number | null }
function parseTypo(v: string): TypoSig | null { try { return JSON.parse(v) as TypoSig } catch { return null } }

// Assign a role bucket from size + weight. Higher size + heavier weight → heading.
// Based on the student app scale: 10/12/14/16/18/20 × 400/500/600/700/800.
function typographyRoleName(size: number, weight: number): string {
  // Weight first: 400/500 = body registers; 600+ = display/heading/emphasis
  if (weight <= 500) {
    if (size <= 10) return 'font/body/xxsmall'
    if (size <= 12) return 'font/body/xsmall'
    if (size <= 14) return 'font/body/small'
    if (size <= 16) return 'font/body/medium'
    if (size <= 18) return 'font/body/large'
    return 'font/body/xlarge'
  }
  // weight 600+ → heading track
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
  0: 'space/000', 2: 'space/050', 4: 'space/100', 6: 'space/150',
  8: 'space/200', 10: 'space/250', 12: 'space/300', 14: 'space/350',
  16: 'space/400', 20: 'space/500', 24: 'space/600', 28: 'space/700',
  32: 'space/800', 40: 'space/1000', 48: 'space/1200', 56: 'space/1400',
  64: 'space/1600', 72: 'space/1800', 80: 'space/2000', 120: 'space/3000',
}
function spacingName(v: string): string {
  // Accept single px values only; shorthand stays uncategorized
  const m = v.match(/^(-?\d+\.?\d*)px$/)
  if (!m) return ''
  const n = parseFloat(m[1]!)
  if (SPACING_MAP[n]) return SPACING_MAP[n]!
  if (n < 0) {
    const abs = Math.abs(n)
    if (SPACING_MAP[abs]) return SPACING_MAP[abs]!.replace('space/', 'space-negative/')
  }
  return ''  // no canonical name; will be preserved but flagged
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

// ─── Build proposed taxonomy ──────────────────────────────────────────────────

interface Mapping {
  oldName: string
  oldValue: string
  newPath: string
  reason: string
  group?: string
}

interface DtcgLeaf {
  $value: string
  $type: string
  $description?: string
  $extensions?: Record<string, unknown>
}
interface DtcgNode { [key: string]: DtcgNode | DtcgLeaf | string }

function setNested(root: DtcgNode, pathSegs: string[], leaf: DtcgLeaf): boolean {
  let cur = root
  for (let i = 0; i < pathSegs.length - 1; i++) {
    const seg = pathSegs[i]!
    const next = cur[seg]
    if (!next || typeof next !== 'object' || '$value' in next) {
      cur[seg] = {}
    }
    cur = cur[seg] as DtcgNode
  }
  const last = pathSegs[pathSegs.length - 1]!
  if (last in cur) return false
  cur[last] = leaf
  return true
}

// Alphanumeric rank suffix that's stable: sort by luminance or usage as the caller
// sees fit; we just append a 2-digit index.
function rankSuffix(i: number): string { return String(i + 1).padStart(2, '0') }

// Map a 0-based luminance-sorted index to a Radix/Tailwind shade scale (50–900).
// Distributes items across the scale based on count. If there are ≤10 items, maps
// directly to [50,100,200,300,400,500,600,700,800,900]. If more, uses rank suffix.
const SHADE_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
function indexToShade(index: number, total: number): string {
  if (total <= SHADE_SCALE.length) {
    // Distribute evenly across the scale
    const step = Math.round((index / Math.max(total - 1, 1)) * (SHADE_SCALE.length - 1))
    return String(SHADE_SCALE[step])
  }
  // More items than scale positions — use padded index
  return String((index + 1) * 100).padStart(3, '0')
}

function buildProposal(ledger: LedgerState): {
  proposed: DtcgNode
  mappings: Mapping[]
  counts: {
    total: number
    migrated: number
    preserved: number
    dropped: number
    byCategory: Record<string, number>
    byNewGroup: Record<string, number>
    uncategorizedSpacing: number
    uncategorizedRadius: number
  }
} {
  const root: DtcgNode = {
    $schema: 'https://design-tokens.github.io/community-group/format/2025-10',
  }
  const mappings: Mapping[] = []
  const counts = {
    total: ledger.tokens.length,
    migrated: 0,
    preserved: 0,
    dropped: 0,
    byCategory: {} as Record<string, number>,
    byNewGroup: {} as Record<string, number>,
    uncategorizedSpacing: 0,
    uncategorizedRadius: 0,
  }
  const bump = (map: Record<string, number>, k: string): void => { map[k] = (map[k] ?? 0) + 1 }

  // Only migrate canonical + candidate tokens. Deprecated tokens stay as-is in a
  // `_deprecated` tree (preserved, never consumed).
  const live = ledger.tokens.filter(t => !t.deprecated)
  const dead = ledger.tokens.filter(t => t.deprecated)

  // ── Colors ──
  const colors = live.filter(t => t.type === 'color')
  bump(counts.byCategory, 'color')
  counts.byCategory['color'] = colors.length
  const colorsByGroup: Record<ColorGroup, LedgerToken[]> = { brand: [], neutral: [], feedback: [], overlay: [], surface: [], interactive: [] }
  for (const t of colors) {
    // Course vertical tokens pass through unchanged — they already use semantic names
    if (t.name.startsWith('color/course/')) {
      const leaf: DtcgLeaf = {
        $value: t.value, $type: 'color',
        $description: t.description ?? `Course vertical color. Migrated from ${t.name}.`,
        $extensions: { bc: { legacyName: t.name, group: 'course', usageCount: t.usageCount ?? 0 } },
      }
      setNested(root, t.name.split('/'), leaf)
      mappings.push({ oldName: t.name, oldValue: t.value, newPath: t.name, reason: 'course-passthrough', group: 'course' })
      counts.migrated++
      bump(counts.byNewGroup, 'color/course')
      continue
    }
    colorsByGroup[classifyColor(t)].push(t)
  }

  // Brand — use semantic role names (primary/secondary) instead of hue buckets.
  // Sort by luminance ascending (darkest shade = highest number, e.g., 900).
  // A3 amendment: naming is color/primary/{shade} not color/brand/purple/{step}.
  {
    // All brand tokens go into the "primary" ramp (since BrightChamps has one brand hue).
    const list = colorsByGroup.brand.slice()
    list.sort((a, b) => luminance(b.value) - luminance(a.value))  // lightest first = lowest shade
    list.forEach((t, i) => {
      const shade = indexToShade(i, list.length)
      const newPath = `color/primary/${shade}`
      const leaf: DtcgLeaf = {
        $value: t.value, $type: 'color',
        $description: `Primary ${shade}. Migrated from ${t.name}.`,
        $extensions: { bc: { legacyName: t.name, group: 'brand', usageCount: t.usageCount ?? 0, luminance: Number(luminance(t.value).toFixed(3)), sourceConfidence: t.confidence } },
      }
      setNested(root, newPath.split('/'), leaf)
      mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: 'primary-ramp', group: 'brand' })
      counts.migrated++
      bump(counts.byNewGroup, 'color/primary')
    })
    // Semantic alias: primary/default → the most-used shade
    if (list.length > 0) {
      const primary = list.slice().sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))[0]!
      const idx = list.findIndex(t => t.value.toLowerCase() === primary.value.toLowerCase())
      const shade = indexToShade(idx, list.length)
      setNested(root, ['color', 'primary', 'default'], {
        $value: `{color.primary.${shade}}`, $type: 'color',
        $description: 'Semantic alias for BrightChamps brand primary.',
      })
    }
  }

  // Neutral — by luminance desc (lightest = 1 = near white, darkest = N = near black). Radix-adjacent.
  {
    const list = colorsByGroup.neutral.slice()
    list.sort((a, b) => luminance(b.value) - luminance(a.value))
    list.forEach((t, i) => {
      const step = rankSuffix(i)
      const newPath = `color/neutral/${step}`
      const leaf: DtcgLeaf = {
        $value: t.value, $type: 'color',
        $description: `Neutral step ${step}. Luminance ${luminance(t.value).toFixed(2)}.`,
        $extensions: { bc: { legacyName: t.name, group: 'neutral', usageCount: t.usageCount ?? 0, luminance: Number(luminance(t.value).toFixed(3)) } },
      }
      setNested(root, newPath.split('/'), leaf)
      mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: 'neutral-ramp', group: 'neutral' })
      counts.migrated++
      bump(counts.byNewGroup, 'color/neutral')
    })
  }

  // Feedback — sub-group by role, sort within role by usage, number 01..NN
  {
    const byRole: Record<FeedbackRole, LedgerToken[]> = { danger: [], warning: [], success: [], info: [] }
    for (const t of colorsByGroup.feedback) byRole[feedbackRole(solidOf(t.value))].push(t)
    for (const role of Object.keys(byRole) as FeedbackRole[]) {
      const list = byRole[role].slice()
      list.sort((a, b) => luminance(a.value) - luminance(b.value))
      list.forEach((t, i) => {
        const step = rankSuffix(i)
        const newPath = `color/feedback/${role}/${step}`
        const leaf: DtcgLeaf = {
          $value: t.value, $type: 'color',
          $description: `${role[0]!.toUpperCase() + role.slice(1)} step ${step}.`,
          $extensions: { bc: { legacyName: t.name, group: 'feedback', role, usageCount: t.usageCount ?? 0 } },
        }
        setNested(root, newPath.split('/'), leaf)
        mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: `feedback-${role}`, group: 'feedback' })
        counts.migrated++
        bump(counts.byNewGroup, 'color/feedback')
      })
      // Semantic default alias for each role = the most-used within the role
      if (list.length > 0) {
        const def = list.slice().sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))[0]!
        const idx = list.findIndex(t => t.value.toLowerCase() === def.value.toLowerCase())
        const step = rankSuffix(idx)
        setNested(root, ['color', 'feedback', role, 'default'], {
          $value: `{color.feedback.${role}.${step}}`, $type: 'color',
          $description: `Default ${role} color — most-used step in the ramp.`,
        })
      }
    }
  }

  // Surface — by luminance desc (lightest first)
  {
    const list = colorsByGroup.surface.slice()
    list.sort((a, b) => luminance(b.value) - luminance(a.value))
    list.forEach((t, i) => {
      // Preserve semantic names where they already exist (color/surface/lavender-70 stays)
      const isNamed = t.name.startsWith('color/surface/')
      const newPath = isNamed ? t.name : `color/surface/${rankSuffix(i)}`
      const leaf: DtcgLeaf = {
        $value: t.value, $type: 'color',
        $description: isNamed ? `Preserved semantic name from prior review.` : `Surface step ${rankSuffix(i)}.`,
        $extensions: { bc: { legacyName: t.name, group: 'surface', preserved: isNamed, usageCount: t.usageCount ?? 0 } },
      }
      setNested(root, newPath.split('/'), leaf)
      mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: isNamed ? 'surface-preserved' : 'surface-ramp', group: 'surface' })
      counts.migrated++
      bump(counts.byNewGroup, 'color/surface')
    })
  }

  // Overlay — preserve named, rank unnamed by alpha value
  {
    const list = colorsByGroup.overlay.slice()
    for (const t of list) {
      const isNamed = t.name.startsWith('color/overlay/')
      const newPath = isNamed ? t.name : (() => {
        const alpha = isAlphaHex(t.value) ? parseInt(t.value.slice(-2), 16) : 255
        const pct = Math.round((alpha / 255) * 100)
        return `color/overlay/generic-${pct}`
      })()
      const leaf: DtcgLeaf = {
        $value: t.value, $type: 'color',
        $description: isNamed ? 'Preserved semantic name.' : `Generic overlay at ${isAlphaHex(t.value) ? parseInt(t.value.slice(-2), 16) : 255}/255 alpha.`,
        $extensions: { bc: { legacyName: t.name, group: 'overlay', preserved: isNamed, usageCount: t.usageCount ?? 0 } },
      }
      setNested(root, newPath.split('/'), leaf)
      mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: isNamed ? 'overlay-preserved' : 'overlay-generic', group: 'overlay' })
      counts.migrated++
      bump(counts.byNewGroup, 'color/overlay')
    }
  }

  // Interactive — preserve all names (they're already semantic)
  for (const t of colorsByGroup.interactive) {
    const newPath = t.name  // already semantic
    const leaf: DtcgLeaf = {
      $value: t.value, $type: 'color',
      $description: 'Interactive-state color. Preserved from prior review.',
      $extensions: { bc: { legacyName: t.name, group: 'interactive', preserved: true, usageCount: t.usageCount ?? 0 } },
    }
    setNested(root, newPath.split('/'), leaf)
    mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: 'interactive-preserved', group: 'interactive' })
    counts.migrated++
    bump(counts.byNewGroup, 'color/interactive')
  }

  // ── Semantic role aliases (fgColor / bgColor / borderColor) ──
  // Only emit aliases where we have a credible source token.
  const aliasIfExists = (aliasPath: string, refPath: string, description: string): void => {
    // Walk root to check refPath exists
    const segs = refPath.split('/')
    let cur: unknown = root
    for (const s of segs) {
      if (!cur || typeof cur !== 'object' || !(s in (cur as Record<string, unknown>))) return
      cur = (cur as Record<string, unknown>)[s]
    }
    setNested(root, aliasPath.split('/'), {
      $value: `{${refPath.split('/').join('.')}}`, $type: 'color', $description: description,
    })
  }
  aliasIfExists('fgColor/brand', 'color/brand/primary', 'Foreground in brand context.')
  aliasIfExists('fgColor/default', 'color/neutral/12', 'Primary body text on neutral surface.')
  aliasIfExists('fgColor/subtle', 'color/neutral/09', 'Secondary text.')
  aliasIfExists('fgColor/danger', 'color/feedback/danger/default', 'Error messaging.')
  aliasIfExists('fgColor/warning', 'color/feedback/warning/default', 'Cautionary text.')
  aliasIfExists('fgColor/success', 'color/feedback/success/default', 'Success messaging.')
  aliasIfExists('bgColor/default', 'color/neutral/01', 'Page background.')
  aliasIfExists('bgColor/brand/emphasis', 'color/brand/primary', 'Brand-bold backgrounds (primary buttons, selected nav).')
  aliasIfExists('borderColor/focused', 'color/brand/primary', 'Focus ring color.')

  // ── Typography ──
  const typos = live.filter(t => t.type === 'typography')
  counts.byCategory['typography'] = typos.length
  // Group by (family, size, weight) — keep most-used if duplicate
  const typoGroups = new Map<string, { rep: LedgerToken; sig: TypoSig; total: number }>()
  for (const t of typos) {
    const sig = parseTypo(t.value)
    if (!sig || sig.fontFamily === null || sig.fontSize === null || sig.fontWeight === null) continue
    const key = `${sig.fontFamily}|${sig.fontSize}|${sig.fontWeight}`
    const existing = typoGroups.get(key)
    if (existing) {
      existing.total += (t.usageCount ?? 0)
      if ((t.usageCount ?? 0) > (existing.rep.usageCount ?? 0)) existing.rep = t
    } else typoGroups.set(key, { rep: t, sig, total: t.usageCount ?? 0 })
  }
  // Bucket into roles; if >1 group lands in the same role, keep the most-used and
  // suffix the rest with the original size/weight for disambiguation.
  const roleBuckets = new Map<string, Array<{ rep: LedgerToken; sig: TypoSig; total: number }>>()
  for (const entry of typoGroups.values()) {
    const role = typographyRoleName(entry.sig.fontSize!, entry.sig.fontWeight!)
    const list = roleBuckets.get(role) ?? []
    list.push(entry)
    roleBuckets.set(role, list)
  }
  for (const [role, list] of roleBuckets) {
    list.sort((a, b) => b.total - a.total)
    list.forEach((entry, i) => {
      const suffix = i === 0 ? '' : `/${entry.sig.fontSize}-${entry.sig.fontWeight}`
      const newPath = role + suffix
      const leaf: DtcgLeaf = {
        $value: entry.rep.value, $type: 'typography',
        $description: `${entry.sig.fontFamily} ${entry.sig.fontSize}px / ${entry.sig.fontWeight}${entry.sig.lineHeightPx ? ` · line-height ${entry.sig.lineHeightPx.toFixed(1)}px` : ''}`,
        $extensions: { bc: { legacyName: entry.rep.name, family: entry.sig.fontFamily, size: entry.sig.fontSize, weight: entry.sig.fontWeight, lineHeightPx: entry.sig.lineHeightPx, letterSpacing: entry.sig.letterSpacing, usageCount: entry.total } },
      }
      setNested(root, newPath.split('/'), leaf)
      mappings.push({ oldName: entry.rep.name, oldValue: entry.rep.value, newPath, reason: suffix ? 'typography-collision' : 'typography-primary', group: 'typography' })
      counts.migrated++
      bump(counts.byNewGroup, 'font')
    })
  }

  // ── Spacing ──
  const spacing = live.filter(t => t.type === 'spacing')
  counts.byCategory['spacing'] = spacing.length
  for (const t of spacing) {
    const name = spacingName(t.value)
    if (!name) {
      counts.uncategorizedSpacing++
      mappings.push({ oldName: t.name, oldValue: t.value, newPath: '(uncategorized)', reason: 'spacing-shorthand-or-unknown', group: 'spacing' })
      counts.preserved++
      continue
    }
    const leaf: DtcgLeaf = {
      $value: t.value, $type: 'dimension',
      $description: `Spacing token. Migrated from ${t.name}.`,
      $extensions: { bc: { legacyName: t.name, usageCount: t.usageCount ?? 0 } },
    }
    setNested(root, name.split('/'), leaf)
    mappings.push({ oldName: t.name, oldValue: t.value, newPath: name, reason: 'spacing-ramp', group: 'spacing' })
    counts.migrated++
    bump(counts.byNewGroup, 'space')
  }

  // ── Radius ──
  const radii = live.filter(t => t.type === 'radius')
  counts.byCategory['radius'] = radii.length
  for (const t of radii) {
    const name = t.name.startsWith('radius/') ? t.name : radiusName(t.value)
    if (!name) {
      counts.uncategorizedRadius++
      mappings.push({ oldName: t.name, oldValue: t.value, newPath: '(uncategorized)', reason: 'radius-shorthand-or-unknown', group: 'radius' })
      counts.preserved++
      continue
    }
    const leaf: DtcgLeaf = {
      $value: t.value, $type: 'dimension',
      $description: `Radius token. Migrated from ${t.name}.`,
      $extensions: { bc: { legacyName: t.name, usageCount: t.usageCount ?? 0 } },
    }
    setNested(root, name.split('/'), leaf)
    mappings.push({ oldName: t.name, oldValue: t.value, newPath: name, reason: 'radius-ramp', group: 'radius' })
    counts.migrated++
    bump(counts.byNewGroup, 'radius')
  }

  // ── Shadow ──
  const shadows = live.filter(t => t.type === 'shadow')
  counts.byCategory['shadow'] = shadows.length
  shadows.sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  shadows.forEach((t, i) => {
    const newPath = `shadow/${rankSuffix(i)}`
    const leaf: DtcgLeaf = {
      $value: t.value, $type: 'shadow',
      $description: `Shadow rank ${rankSuffix(i)} by usage.`,
      $extensions: { bc: { legacyName: t.name, usageCount: t.usageCount ?? 0 } },
    }
    setNested(root, newPath.split('/'), leaf)
    mappings.push({ oldName: t.name, oldValue: t.value, newPath, reason: 'shadow-rank', group: 'shadow' })
    counts.migrated++
    bump(counts.byNewGroup, 'shadow')
  })

  // ── Deprecated tokens preserved under _deprecated ──
  counts.dropped = 0
  const deprecatedRoot: DtcgNode = {}
  for (const t of dead) {
    deprecatedRoot[t.id] = {
      $value: t.value, $type: (t.type === 'typography' ? 'typography' : t.type === 'shadow' ? 'shadow' : t.type === 'color' ? 'color' : 'dimension'),
      $description: `Deprecated — preserved for audit trail. Legacy name: ${t.name}`,
      $extensions: { bc: { legacyName: t.name, deprecated: true, mergedInto: t.raw?.['mergedInto'] ?? null } },
    } as DtcgLeaf
    counts.preserved++
  }
  root._deprecated = deprecatedRoot

  return { proposed: root, mappings, counts }
}

// ─── Report ───────────────────────────────────────────────────────────────────

function printReport(counts: ReturnType<typeof buildProposal>['counts'], mappings: Mapping[]): void {
  const line = (s: string): void => console.log(s)
  line('')
  line('═══════════════════════════════════════════════════════════════════════════════')
  line('  TDR-0001 · TAXONOMY MIGRATION · DRY-RUN REPORT')
  line('═══════════════════════════════════════════════════════════════════════════════')
  line('')
  line('  Source: ledger/tokens.json')
  line(`  Total tokens in ledger:    ${counts.total.toLocaleString()}`)
  line(`  Migrated (new path):       ${counts.migrated.toLocaleString()}`)
  line(`  Preserved (no clean name): ${counts.preserved.toLocaleString()}`)
  line('')
  line('  Source breakdown by type:')
  for (const [k, v] of Object.entries(counts.byCategory).sort((a, b) => b[1] - a[1])) {
    line(`    ${k.padEnd(14)} ${v.toLocaleString()}`)
  }
  line('')
  line('  Proposed taxonomy group counts:')
  for (const [k, v] of Object.entries(counts.byNewGroup).sort((a, b) => b[1] - a[1])) {
    line(`    ${k.padEnd(14)} ${v.toLocaleString()}`)
  }
  line('')
  line('  Uncategorized (preserved, flagged for review):')
  line(`    spacing shorthands:  ${counts.uncategorizedSpacing}`)
  line(`    radius shorthands:   ${counts.uncategorizedRadius}`)
  line('')
  line('  Representative samples (one per group, up to 20):')
  const byGroup = new Map<string, Mapping[]>()
  for (const m of mappings) {
    const g = m.group ?? 'other'
    const list = byGroup.get(g) ?? []
    list.push(m)
    byGroup.set(g, list)
  }
  const samples: Mapping[] = []
  for (const [, list] of byGroup) {
    samples.push(...list.slice(0, 4))   // up to 4 per group
    if (samples.length >= 20) break
  }
  for (const s of samples.slice(0, 20)) {
    line(`    ${s.oldName.padEnd(30)} → ${s.newPath.padEnd(42)} [${s.reason}]`)
  }
  line('')
  line('  Artifacts written:')
  line(`    ${PROPOSED_PATH}          (proposed ledger, DTCG 2025.10)`)
  line(`    ${DEPRECATED_PATH}        (legacy → new mapping)`)
  line('')
  line('  This run did NOT modify ledger/tokens.json.')
  line('  Review with design + eng; promote to ADR when ready.')
  line('═══════════════════════════════════════════════════════════════════════════════')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('[migrate:tokens] Loading ledger...')
  const ledger = JSON.parse(readFileSync(LEDGER_PATH, 'utf-8')) as LedgerState
  console.log(`[migrate:tokens] ${ledger.tokens.length.toLocaleString()} tokens loaded`)

  const { proposed, mappings, counts } = buildProposal(ledger)

  writeFileSync(path.resolve(PROPOSED_PATH), JSON.stringify(proposed, null, 2))
  const mappingOnly: Record<string, string> = {}
  for (const m of mappings) mappingOnly[m.oldName] = m.newPath
  writeFileSync(path.resolve(DEPRECATED_PATH), JSON.stringify(mappingOnly, null, 2))

  printReport(counts, mappings)
}

main()
