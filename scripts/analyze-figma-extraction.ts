/**
 * scripts/analyze-figma-extraction.ts
 *
 * Read-only analysis of ledger/.extractions/<surface>-figma.json.
 * Produces a human-readable report for calibrating ledger-build thresholds.
 *
 * Usage: tsx scripts/analyze-figma-extraction.ts [--surface=student]
 */

import { readFileSync } from 'fs'
import path from 'path'
import type { DesignToken, ExtractionResult } from '../src/types/index.js'

const EXTRACTIONS_DIR = 'ledger/.extractions'

// ─── Color math: sRGB hex → CIE Lab → ΔE*ab (CIE76) ───────────────────────────

interface Lab { L: number; a: number; b: number }

function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return { r, g, b, a }
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function rgbToXyz(r: number, g: number, b: number): { x: number; y: number; z: number } {
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  // D65
  const x = R * 0.4124564 + G * 0.3575761 + B * 0.1804375
  const y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750
  const z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041
  return { x, y, z }
}

function xyzToLab(x: number, y: number, z: number): Lab {
  const Xn = 0.95047, Yn = 1.00000, Zn = 1.08883
  const f = (t: number): number => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116)
  const fx = f(x / Xn), fy = f(y / Yn), fz = f(z / Zn)
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) }
}

function hexToLab(hex: string): Lab {
  const { r, g, b } = hexToRgb(hex)
  const { x, y, z } = rgbToXyz(r, g, b)
  return xyzToLab(x, y, z)
}

function deltaE76(a: Lab, b: Lab): number {
  const dL = a.L - b.L
  const da = a.a - b.a
  const db = a.b - b.b
  return Math.sqrt(dL * dL + da * da + db * db)
}

// ─── Load extraction ──────────────────────────────────────────────────────────

function loadExtraction(surface: string): ExtractionResult {
  const file = path.join(EXTRACTIONS_DIR, `${surface}-figma.json`)
  const raw = readFileSync(file, 'utf-8')
  return JSON.parse(raw) as ExtractionResult
}

// ─── 1. Cumulative coverage table ─────────────────────────────────────────────

function coverageTable(colors: DesignToken[]): string[] {
  const sorted = [...colors].sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  const totalUses = sorted.reduce((sum, t) => sum + (t.usageCount ?? 0), 0)
  const cutoffs = [5, 10, 20, 50, 100, 200, 500, 1000, sorted.length]
  const uniqueCutoffs = [...new Set(cutoffs.filter(n => n <= sorted.length))]

  const rows: string[] = []
  rows.push('| Rank cutoff | Distinct colors | Uses covered | % of total |')
  rows.push('|------------:|----------------:|-------------:|-----------:|')
  for (const n of uniqueCutoffs) {
    const slice = sorted.slice(0, n)
    const uses = slice.reduce((sum, t) => sum + (t.usageCount ?? 0), 0)
    const pct = ((uses / totalUses) * 100).toFixed(2)
    rows.push(`| Top ${String(n).padEnd(4)} | ${String(n).padStart(15)} | ${String(uses).padStart(12)} | ${pct.padStart(9)}% |`)
  }
  rows.push('')
  rows.push(`Total color uses across all 2039 distinct colors: ${totalUses.toLocaleString()}`)
  return rows
}

// ─── 2. Color cluster candidates ──────────────────────────────────────────────

interface Cluster {
  canonical: { value: string; count: number }
  members: Array<{ value: string; count: number }>
  totalCount: number
}

function clusterColors(colors: DesignToken[], threshold: number): Cluster[] {
  // Only solid hex (#rrggbb) — skip alpha variants; alpha changes ΔE calc meaningfully
  const solidOnly = colors.filter(t => /^#[0-9a-f]{6}$/i.test(t.value))
  const sorted = [...solidOnly].sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  const labs = sorted.map(t => ({ token: t, lab: hexToLab(t.value) }))

  const assigned = new Set<number>()
  const clusters: Cluster[] = []

  for (let i = 0; i < labs.length; i++) {
    if (assigned.has(i)) continue
    const canonical = labs[i]!
    const members: Array<{ value: string; count: number; idx: number }> = [
      { value: canonical.token.value, count: canonical.token.usageCount ?? 0, idx: i },
    ]
    assigned.add(i)
    for (let j = i + 1; j < labs.length; j++) {
      if (assigned.has(j)) continue
      const other = labs[j]!
      if (deltaE76(canonical.lab, other.lab) < threshold) {
        members.push({ value: other.token.value, count: other.token.usageCount ?? 0, idx: j })
        assigned.add(j)
      }
    }
    if (members.length >= 2) {
      clusters.push({
        canonical: { value: canonical.token.value, count: canonical.token.usageCount ?? 0 },
        members: members.map(m => ({ value: m.value, count: m.count })),
        totalCount: members.reduce((s, m) => s + m.count, 0),
      })
    }
  }

  return clusters.sort((a, b) => b.totalCount - a.totalCount)
}

function clusterSummary(clusters: Cluster[], label: string): string[] {
  const rows: string[] = []
  const mergedAway = clusters.reduce((s, c) => s + (c.members.length - 1), 0)
  const combinedCoverage = clusters.reduce((s, c) => s + c.totalCount, 0)
  rows.push(`### ${label}`)
  rows.push(`- Clusters formed (2+ colors each): **${clusters.length}**`)
  rows.push(`- Colors that would merge away: **${mergedAway}**`)
  rows.push(`- Combined uses inside clusters: **${combinedCoverage.toLocaleString()}**`)
  rows.push('')
  rows.push('Top 10 clusters by combined usage:')
  rows.push('')
  rows.push('| Canonical | Members | Combined uses | Member hex values |')
  rows.push('|-----------|--------:|--------------:|-------------------|')
  for (const c of clusters.slice(0, 10)) {
    const members = c.members.map(m => `${m.value}(${m.count})`).join(', ')
    rows.push(`| \`${c.canonical.value}\` (${c.canonical.count}) | ${c.members.length} | ${c.totalCount.toLocaleString()} | ${members} |`)
  }
  rows.push('')
  return rows
}

// ─── 3. Typography frequency table ────────────────────────────────────────────

interface TypeCombo {
  family: string
  size: number | null
  weight: number | null
  count: number
  pages: Set<string>
}

function typographyTable(typography: DesignToken[]): string[] {
  const byKey = new Map<string, TypeCombo>()

  for (const t of typography) {
    let parsed: { fontFamily?: string | null; fontSize?: number | null; fontWeight?: number | null } = {}
    try { parsed = JSON.parse(t.value) as typeof parsed } catch { continue }
    const family = parsed.fontFamily ?? '(none)'
    const size = parsed.fontSize ?? null
    const weight = parsed.fontWeight ?? null
    const key = `${family}|${size}|${weight}`
    const existing = byKey.get(key)
    const count = t.usageCount ?? 0
    const pagesSet = new Set(t.pages ?? [])
    if (existing) {
      existing.count += count
      for (const p of pagesSet) existing.pages.add(p)
    } else {
      byKey.set(key, { family, size, weight, count, pages: pagesSet })
    }
  }

  const combos = [...byKey.values()].sort((a, b) => b.count - a.count)
  const totalUses = combos.reduce((s, c) => s + c.count, 0)

  const rows: string[] = []
  rows.push(`Total text uses: **${totalUses.toLocaleString()}**`)
  rows.push(`Distinct (family + size + weight) combos: **${combos.length}** (collapsed from ${typography.length} raw styles when line-height + letter-spacing varied)`)
  rows.push('')
  rows.push('Top 20 combos by usage:')
  rows.push('')
  rows.push('| # | Family | Size | Weight | Uses | % of total |')
  rows.push('|--:|--------|-----:|-------:|-----:|-----------:|')
  for (let i = 0; i < Math.min(20, combos.length); i++) {
    const c = combos[i]!
    const pct = ((c.count / totalUses) * 100).toFixed(2)
    rows.push(`| ${String(i + 1).padStart(2, '0')} | ${c.family} | ${c.size ?? '—'} | ${c.weight ?? '—'} | ${c.count.toLocaleString()} | ${pct}% |`)
  }
  rows.push('')

  // How many combos to reach 80% of total uses?
  let cumulative = 0
  let n80 = 0
  for (let i = 0; i < combos.length; i++) {
    cumulative += combos[i]!.count
    if (cumulative >= totalUses * 0.8) { n80 = i + 1; break }
  }
  rows.push(`**${n80}** combos account for 80% of all text uses.`)

  // Also report 95% and 99%
  let n95 = 0, n99 = 0, running = 0
  for (let i = 0; i < combos.length; i++) {
    running += combos[i]!.count
    if (!n95 && running >= totalUses * 0.95) n95 = i + 1
    if (!n99 && running >= totalUses * 0.99) n99 = i + 1
  }
  rows.push(`**${n95}** combos account for 95% of all text uses.`)
  rows.push(`**${n99}** combos account for 99% of all text uses.`)

  return rows
}

// ─── 4. Shadow dedup ──────────────────────────────────────────────────────────

interface ParsedShadow {
  inset: boolean
  x: number
  y: number
  blur: number
  spread: number
  color: string  // hex
}

function parseShadow(s: string): ParsedShadow | null {
  // Format: "[inset ]Xpx Ypx Bpx Spx #rrggbb" possibly with alpha hex
  const parts = s.trim().split(/,\s*/)  // multi-layer shadows: take first layer for dedup
  const first = parts[0]
  if (!first) return null
  const m = first.match(/^(inset\s+)?(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(#[0-9a-fA-F]+)$/)
  if (!m) return null
  const [, insetTok, x, y, blur, spread, color] = m
  return {
    inset: !!insetTok,
    x: parseFloat(x!), y: parseFloat(y!),
    blur: parseFloat(blur!), spread: parseFloat(spread!),
    color: color!.toLowerCase(),
  }
}

function shadowDedup(shadows: DesignToken[]): string[] {
  const parsed: Array<{ token: DesignToken; shadow: ParsedShadow }> = []
  let unparsable = 0
  for (const t of shadows) {
    const p = parseShadow(t.value)
    if (p) parsed.push({ token: t, shadow: p })
    else unparsable++
  }

  const sorted = [...parsed].sort((a, b) => (b.token.usageCount ?? 0) - (a.token.usageCount ?? 0))
  const assigned = new Set<number>()
  const clusters: Array<{ canonical: string; members: string[]; totalCount: number }> = []

  const blurTolerance = 2
  for (let i = 0; i < sorted.length; i++) {
    if (assigned.has(i)) continue
    const canonical = sorted[i]!
    const members: Array<{ value: string; count: number }> = [
      { value: canonical.token.value, count: canonical.token.usageCount ?? 0 },
    ]
    assigned.add(i)
    for (let j = i + 1; j < sorted.length; j++) {
      if (assigned.has(j)) continue
      const other = sorted[j]!
      const sameColor = canonical.shadow.color === other.shadow.color
      const sameInset = canonical.shadow.inset === other.shadow.inset
      const blurClose = Math.abs(canonical.shadow.blur - other.shadow.blur) <= blurTolerance
      const offsetClose =
        Math.abs(canonical.shadow.x - other.shadow.x) <= blurTolerance &&
        Math.abs(canonical.shadow.y - other.shadow.y) <= blurTolerance
      if (sameColor && sameInset && blurClose && offsetClose) {
        members.push({ value: other.token.value, count: other.token.usageCount ?? 0 })
        assigned.add(j)
      }
    }
    clusters.push({
      canonical: canonical.token.value,
      members: members.map(m => m.value),
      totalCount: members.reduce((s, m) => s + m.count, 0),
    })
  }

  clusters.sort((a, b) => b.totalCount - a.totalCount)

  const rows: string[] = []
  const mergedAway = clusters.reduce((s, c) => s + (c.members.length - 1), 0)
  const multiMember = clusters.filter(c => c.members.length >= 2)
  rows.push(`- Raw shadows in extraction: **${shadows.length}**`)
  rows.push(`- Parsed successfully: **${parsed.length}** (unparsable: ${unparsable})`)
  rows.push(`- Canonical shadows after dedup (blur/offset tolerance ±${blurTolerance}px, exact color match): **${clusters.length}**`)
  rows.push(`- Shadows that would merge away: **${mergedAway}**`)
  rows.push(`- Clusters with 2+ members: **${multiMember.length}**`)
  rows.push('')
  if (multiMember.length > 0) {
    rows.push('Top 10 shadow clusters by combined usage:')
    rows.push('')
    rows.push('| Canonical | Members | Combined uses |')
    rows.push('|-----------|--------:|--------------:|')
    for (const c of multiMember.slice(0, 10)) {
      rows.push(`| \`${c.canonical}\` | ${c.members.length} | ${c.totalCount.toLocaleString()} |`)
    }
  }
  return rows
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const surfaceArg = process.argv.find(a => a.startsWith('--surface='))?.split('=')[1] ?? 'student'
  const extraction = loadExtraction(surfaceArg)
  const colors = extraction.tokens.filter(t => t.type === 'color')
  const typography = extraction.tokens.filter(t => t.type === 'typography')
  const shadows = extraction.tokens.filter(t => t.type === 'shadow')

  const lines: string[] = []

  lines.push(`# Figma Extraction Analysis — ${surfaceArg}`)
  lines.push('')
  lines.push(`File: ${extraction.figmaFileId}`)
  lines.push(`Extracted at: ${extraction.extractedAt}`)
  lines.push('')
  lines.push(`- Distinct colors: **${colors.length}**`)
  lines.push(`- Distinct text styles: **${typography.length}**`)
  lines.push(`- Distinct shadows: **${shadows.length}**`)
  lines.push('')

  lines.push('## 1. Cumulative coverage — colors')
  lines.push('')
  lines.push(...coverageTable(colors))
  lines.push('')

  lines.push('## 2. Color cluster candidates (CIE76 ΔE)')
  lines.push('')
  lines.push('_Solid-hex colors only (8-digit alpha hex excluded from clustering)._')
  lines.push('')
  lines.push(...clusterSummary(clusterColors(colors, 2), 'ΔE < 2 — near-identical'))
  lines.push(...clusterSummary(clusterColors(colors, 5), 'ΔE < 5 — same family'))
  lines.push(...clusterSummary(clusterColors(colors, 10), 'ΔE < 10 — intentional variant'))

  lines.push('## 3. Typography combos (family + size + weight)')
  lines.push('')
  lines.push(...typographyTable(typography))
  lines.push('')

  lines.push('## 4. Shadow dedup')
  lines.push('')
  lines.push(...shadowDedup(shadows))
  lines.push('')

  console.log(lines.join('\n'))
}

main()
