# ADR-0005: DesignToken Schema Design

## Status
Accepted

## Date
2026-04-15

## Context
Tokens extracted from Figma and DOM need to be normalized into the same
structure so they can be compared, diffed, and stored in the ledger.

## Decision
Use this schema:
```ts
{
  id: string          // stable UUID, assigned once, never changes
  name: string        // dot-notation: color.primary.default
  value: string       // canonical: px for sizes, hex for colors
  type: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'motion' | 'z-index'
  source: 'figma' | 'dom'
  surface: 'landing' | 'student-app' | 'teacher-app' | 'admin-dashboard'
  confidence: number  // 0.0–1.0
  status: 'active' | 'deprecated'
  extractedAt: string // ISO 8601
}
```

## Key decisions within this schema
- Values normalized to px (not rem) and hex (not rgba) for portability
- Confidence encodes how certain we are this is the right value
- IDs are stable — re-extraction updates value but never changes ID
- Deprecated not deleted — preserves history

## Confidence
High — schema is conservative and easy to extend.
