// src/extractors/normalize.ts
// Normalizes raw extraction data from both Figma and DOM into the DesignToken schema.
// Both extractors pipe through here before anything else sees the data.

import type { DesignToken, TokenType, Surface, TokenSource } from '../types/index.js'

// ─── Color normalization ────────────────────────────────────────────────────

/** Normalize any color string to lowercase 6-digit hex (#rrggbb) */
export function normalizeColor(raw: string): string {
  const s = raw.trim().toLowerCase()

  // Already hex
  if (/^#[0-9a-f]{6}$/.test(s)) return s
  if (/^#[0-9a-f]{3}$/.test(s)) {
    const [, r, g, b] = s.match(/^#(.)(.)(.)$/) ?? []
    return `#${r}${r}${g}${g}${b}${b}`
  }

  // rgb() or rgba()
  const rgbMatch = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch
    return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`
  }

  // Return as-is if we can't normalize (will be flagged in review)
  return s
}

/** Normalize px values to number strings: "16px" → "16" */
export function normalizePx(raw: string): string {
  return raw.replace(/px$/, '').trim()
}

/** Normalize font weight to numeric string */
export function normalizeFontWeight(raw: string): string {
  const map: Record<string, string> = {
    thin: '100', extralight: '200', light: '300', regular: '400',
    normal: '400', medium: '500', semibold: '600', bold: '700',
    extrabold: '800', black: '900',
  }
  const lower = raw.toLowerCase().trim()
  return map[lower] ?? raw.trim()
}

// ─── Token naming convention ─────────────────────────────────────────────────
// Pattern: {type}/{category}/{scale} — e.g. color/primary/500, spacing/layout/md

export function buildTokenName(
  type: TokenType,
  category: string,
  scale?: string | number,
): string {
  const parts = [type, category.toLowerCase().replace(/\s+/g, '-')]
  if (scale !== undefined) parts.push(String(scale))
  return parts.join('/')
}

// ─── Main normalize function ─────────────────────────────────────────────────

export interface RawToken {
  name: string
  value: string
  type: TokenType
  surface: Surface
  source: TokenSource
  raw?: Record<string, unknown>
}

export function normalizeToken(raw: RawToken): DesignToken {
  let value = raw.value

  switch (raw.type) {
    case 'color':
      value = normalizeColor(raw.value)
      break
    case 'spacing':
    case 'radius':
    case 'border':
      value = normalizePx(raw.value)
      break
    case 'typography':
      // Typography values are objects — keep as JSON string for now
      break
  }

  // Confidence: figma tokens from surfaces that also have DOM extraction
  // get confidence 1.0 if they match, 0.8 if dom-only (admin)
  const confidence = raw.source === 'dom' && raw.surface === 'admin' ? 0.8 : 0.9

  const token: DesignToken = {
    name: raw.name,
    value,
    type: raw.type,
    source: raw.source,
    surface: raw.surface,
    confidence,
    extractedAt: new Date().toISOString(),
  }
  if (raw.raw !== undefined) token.raw = raw.raw
  return token
}

export function deduplicateTokens(tokens: DesignToken[]): DesignToken[] {
  const seen = new Map<string, DesignToken>()
  for (const token of tokens) {
    const key = `${token.name}::${token.surface}::${token.source}`
    const existing = seen.get(key)
    if (!existing || token.confidence > existing.confidence) {
      seen.set(key, token)
    }
  }
  return Array.from(seen.values())
}
