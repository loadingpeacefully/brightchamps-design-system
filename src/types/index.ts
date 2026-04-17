// src/types/index.ts
// Central type definitions for the BrightChamps Design System pipeline

export type Surface = 'landing' | 'student' | 'teacher' | 'admin'

export type TokenType =
  | 'color'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'border'
  | 'opacity'
  | 'zIndex'
  | 'motion'

export type TokenSource = 'figma' | 'dom'

export type DriftSeverity = 'critical' | 'high' | 'medium' | 'low'

export type DriftStatus = 'match' | 'drift' | 'missing' | 'unknown' | 'system-gap'
// system-gap: DOM value has no close canonical, but should be ADDED to the
//             system rather than removed from DOM (e.g. translucent overlays
//             missing from Figma because it had no effect styles).
export type MatchMethod = 'exact' | 'delta-e' | 'tolerance' | 'none'

export interface DesignToken {
  name: string              // e.g. "color/primary/500"
  value: string             // e.g. "#2462EA" or "16px" or "500"
  type: TokenType
  source: TokenSource
  surface: Surface
  confidence: number        // 0.0–1.0
  deprecated?: boolean
  raw?: Record<string, unknown>
  extractedAt?: string      // ISO timestamp
  // Figma tree-walk metadata (optional; populated when extractor counts occurrences)
  usageCount?: number       // total node instances using this value
  elements?: number         // count of distinct elements that used this value
  pages?: string[]          // page names where this value appeared
  // DOM interactive-mode provenance
  discoveredIn?: 'static' | 'interaction'
  trigger?: string          // e.g. 'click:course-card'
}

export interface LedgerToken extends DesignToken {
  id: string                // stable UUID for this token
  firstSeen: string         // ISO timestamp
  lastSeen: string          // ISO timestamp
  sources: TokenSource[]    // all sources that confirmed this token
  surfaces: Surface[]       // all surfaces where this token appears
  // Persisted at build time from confidence tier (see isCanonical below).
  // Confidence tiers: >= 0.9 canonical · 0.4–0.89 candidate · < 0.4 deprecated.
  canonical: boolean
}

export function isCanonical(t: Pick<LedgerToken, 'confidence'>): boolean {
  return t.confidence >= 0.9
}

export function isCandidate(t: Pick<LedgerToken, 'confidence'>): boolean {
  return t.confidence >= 0.4 && t.confidence < 0.9
}

export function isDeprecatedTier(t: Pick<LedgerToken, 'confidence'>): boolean {
  return t.confidence < 0.4
}

export interface DriftItem {
  id: string
  tokenName: string
  tokenType: TokenType
  surface: Surface
  figmaValue: string | null
  domValue: string | null
  figmaToken?: LedgerToken | null      // closest Figma canonical (value-based match)
  matchMethod?: MatchMethod
  delta?: number                        // ΔE for colors, px difference for sizes
  status?: DriftStatus                  // match / drift / missing / unknown / system-gap
  severity: DriftSeverity
  detectedAt: string        // ISO timestamp
  domPages?: string[]        // pages where the DOM value appeared (populated for non-missing items)
  resolution?: DriftResolution
}

export interface DriftResolution {
  decision: 'use-figma' | 'use-dom' | 'set-new' | 'skip'
  canonicalValue?: string   // for 'set-new' decisions
  decidedBy: string         // 'human' | 'auto'
  decidedAt: string         // ISO timestamp
  notes?: string
}

export interface DriftReport {
  id: string
  generatedAt: string
  surfaces: Surface[]
  totalItems: number
  bySeverity: Record<DriftSeverity, number>
  byType: Record<TokenType, number>
  byStatus?: Record<DriftStatus, number>
  items: DriftItem[]
}

export interface LedgerState {
  version: string
  lastBuilt: string
  tokenCount: number
  componentCount: number
  tokens: LedgerToken[]
}

export interface ComponentDefinition {
  id: string
  name: string              // e.g. "Button/Primary"
  surfaces: Surface[]
  variants: ComponentVariant[]
  tokens: string[]          // token names used by this component
  notes?: string
}

export interface ComponentVariant {
  name: string
  properties: Record<string, string>
}

export interface ExtractionResult {
  surface: Surface
  source: TokenSource
  url?: string
  figmaFileId?: string
  extractedAt: string
  tokens: DesignToken[]
  errors: ExtractionError[]
  interactionsSummary?: {
    attempted: number
    succeeded: number
    failed: string[]             // trigger names that couldn't find an element
    newTokensDiscovered: number  // values first seen during an interaction
    discoveredUrls?: string[]    // URLs the interactions navigated to
  }
}

export class AuthenticationError extends Error {
  constructor(public readonly landedUrl: string) {
    super(`Authentication failed — page redirected to login: ${landedUrl}`)
    this.name = 'AuthenticationError'
  }
}

export interface ExtractionError {
  url?: string
  message: string
  code?: string
  fatal?: boolean
}
