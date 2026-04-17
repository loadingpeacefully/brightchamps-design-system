# ADR-0002: Use Two-Source Extraction (Figma + DOM)

## Status
Accepted

## Date
2026-04-15

## Context
We need to build a canonical design system from an existing product with no
prior design system. We have two machine-readable sources: Figma design files
and live DOM pages. Screenshots were considered but rejected — they require
vision models and introduce OCR errors. Manual extraction is too slow.

## Decision
Extract design tokens programmatically from both Figma (REST API) and
live DOM (Playwright computed styles). Normalize both to the same DesignToken
schema. The diff between the two sources IS the drift report.

## Options considered
| Option | Pros | Cons |
|--------|------|------|
| Figma + DOM (chosen) | Exact values, no OCR, fully automated | Requires auth for protected routes |
| Screenshots only | Simple, visual | Lossy, needs vision model, error-prone |
| Manual audit | High fidelity | Impossibly slow at scale |
| DOM only | No Figma access needed | Misses design intent |

## Consequences
- Extraction is fully automated — no manual work per surface
- Drift = mathematically defined (not subjective)
- Admin dashboard (no Figma) uses DOM as canonical — clearly documented
- Auth setup required for protected surfaces

## Confidence
High.
