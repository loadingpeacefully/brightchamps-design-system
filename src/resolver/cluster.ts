/**
 * src/resolver/cluster.ts
 *
 * Perceptual-distance clustering for color tokens (CIE76 ΔE*ab) and
 * tolerance-based clustering for shadow tokens. Used by the resolver
 * when synthesizing the canonical ledger.
 */

import type { DesignToken } from '../types/index.js'

// ─── Color math: hex → Lab, ΔE*ab (CIE76) ─────────────────────────────────────

export interface Lab { L: number; a: number; b: number }

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

export function hexToLab(hex: string): Lab {
  const { r, g, b } = hexToRgb(hex)
  const { x, y, z } = rgbToXyz(r, g, b)
  return xyzToLab(x, y, z)
}

export function deltaE76(a: Lab, b: Lab): number {
  const dL = a.L - b.L
  const da = a.a - b.a
  const db = a.b - b.b
  return Math.sqrt(dL * dL + da * da + db * db)
}

// ─── Color clustering ─────────────────────────────────────────────────────────

export interface ColorCluster {
  canonical: DesignToken          // most-used member
  members: DesignToken[]          // all members (includes canonical)
  totalCount: number              // combined usageCount
  mergedPages: string[]           // union of member pages
}

export function clusterColors(tokens: DesignToken[], threshold: number): ColorCluster[] {
  // Only solid hex (#rrggbb) eligible — alpha variants stay standalone
  const solid = tokens.filter(t => /^#[0-9a-f]{6}$/i.test(t.value))
  const alpha = tokens.filter(t => /^#[0-9a-f]{8}$/i.test(t.value))
  const sorted = [...solid].sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  const labs = sorted.map(t => ({ token: t, lab: hexToLab(t.value) }))

  const assigned = new Set<number>()
  const clusters: ColorCluster[] = []

  for (let i = 0; i < labs.length; i++) {
    if (assigned.has(i)) continue
    const canonical = labs[i]!
    const members: DesignToken[] = [canonical.token]
    const pages = new Set<string>(canonical.token.pages ?? [])
    assigned.add(i)
    for (let j = i + 1; j < labs.length; j++) {
      if (assigned.has(j)) continue
      const other = labs[j]!
      if (deltaE76(canonical.lab, other.lab) < threshold) {
        members.push(other.token)
        for (const p of other.token.pages ?? []) pages.add(p)
        assigned.add(j)
      }
    }
    clusters.push({
      canonical: canonical.token,
      members,
      totalCount: members.reduce((s, m) => s + (m.usageCount ?? 0), 0),
      mergedPages: [...pages].sort(),
    })
  }

  // Alpha-hex tokens become single-member clusters
  for (const t of alpha) {
    clusters.push({
      canonical: t,
      members: [t],
      totalCount: t.usageCount ?? 0,
      mergedPages: [...(t.pages ?? [])].sort(),
    })
  }

  return clusters.sort((a, b) => b.totalCount - a.totalCount)
}

// ─── Shadow clustering (±N px tolerance, exact color) ─────────────────────────

export interface ShadowCluster {
  canonical: DesignToken
  members: DesignToken[]
  totalCount: number
  mergedPages: string[]
}

interface ParsedShadow {
  inset: boolean
  x: number
  y: number
  blur: number
  spread: number
  color: string
}

function parseShadow(s: string): ParsedShadow | null {
  const first = s.trim().split(/,\s*/)[0]
  if (!first) return null
  const m = first.match(/^(inset\s+)?(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(#[0-9a-fA-F]+)$/)
  if (!m) return null
  return {
    inset: !!m[1],
    x: parseFloat(m[2]!), y: parseFloat(m[3]!),
    blur: parseFloat(m[4]!), spread: parseFloat(m[5]!),
    color: m[6]!.toLowerCase(),
  }
}

export function clusterShadows(tokens: DesignToken[], tolerancePx: number): ShadowCluster[] {
  const parsed: Array<{ token: DesignToken; s: ParsedShadow }> = []
  const unparsable: DesignToken[] = []
  for (const t of tokens) {
    const p = parseShadow(t.value)
    if (p) parsed.push({ token: t, s: p })
    else unparsable.push(t)
  }

  const sorted = [...parsed].sort((a, b) => (b.token.usageCount ?? 0) - (a.token.usageCount ?? 0))
  const assigned = new Set<number>()
  const clusters: ShadowCluster[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (assigned.has(i)) continue
    const canon = sorted[i]!
    const members: DesignToken[] = [canon.token]
    const pages = new Set<string>(canon.token.pages ?? [])
    assigned.add(i)
    for (let j = i + 1; j < sorted.length; j++) {
      if (assigned.has(j)) continue
      const other = sorted[j]!
      const sameColor = canon.s.color === other.s.color
      const sameInset = canon.s.inset === other.s.inset
      const blurClose = Math.abs(canon.s.blur - other.s.blur) <= tolerancePx
      const offsetClose =
        Math.abs(canon.s.x - other.s.x) <= tolerancePx &&
        Math.abs(canon.s.y - other.s.y) <= tolerancePx
      const spreadClose = Math.abs(canon.s.spread - other.s.spread) <= tolerancePx
      if (sameColor && sameInset && blurClose && offsetClose && spreadClose) {
        members.push(other.token)
        for (const p of other.token.pages ?? []) pages.add(p)
        assigned.add(j)
      }
    }
    clusters.push({
      canonical: canon.token,
      members,
      totalCount: members.reduce((s, m) => s + (m.usageCount ?? 0), 0),
      mergedPages: [...pages].sort(),
    })
  }

  // Unparsable shadows become single-member clusters
  for (const t of unparsable) {
    clusters.push({
      canonical: t,
      members: [t],
      totalCount: t.usageCount ?? 0,
      mergedPages: [...(t.pages ?? [])].sort(),
    })
  }

  return clusters.sort((a, b) => b.totalCount - a.totalCount)
}

// ─── Typography grouping (family + size + weight) ─────────────────────────────

export interface TypographyGroup {
  key: string
  representative: DesignToken    // most-used member (keeps its full signature)
  members: DesignToken[]
  totalCount: number
  mergedPages: string[]
  family: string
  size: number | null
  weight: number | null
}

function typographyGroupKey(value: string): { key: string; family: string; size: number | null; weight: number | null } | null {
  try {
    const parsed = JSON.parse(value) as {
      fontFamily?: string | null
      fontSize?: number | null
      fontWeight?: number | null
    }
    const family = parsed.fontFamily ?? '(none)'
    const size = parsed.fontSize ?? null
    const weight = parsed.fontWeight ?? null
    return { key: `${family}|${size}|${weight}`, family, size, weight }
  } catch {
    return null
  }
}

export function groupTypography(tokens: DesignToken[]): TypographyGroup[] {
  const groups = new Map<string, TypographyGroup>()
  for (const t of tokens) {
    const parsed = typographyGroupKey(t.value)
    if (!parsed) continue
    const existing = groups.get(parsed.key)
    if (existing) {
      existing.members.push(t)
      existing.totalCount += t.usageCount ?? 0
      for (const p of t.pages ?? []) {
        if (!existing.mergedPages.includes(p)) existing.mergedPages.push(p)
      }
      if ((t.usageCount ?? 0) > (existing.representative.usageCount ?? 0)) {
        existing.representative = t
      }
    } else {
      groups.set(parsed.key, {
        key: parsed.key,
        representative: t,
        members: [t],
        totalCount: t.usageCount ?? 0,
        mergedPages: [...(t.pages ?? [])],
        family: parsed.family,
        size: parsed.size,
        weight: parsed.weight,
      })
    }
  }
  return [...groups.values()].sort((a, b) => b.totalCount - a.totalCount)
}
