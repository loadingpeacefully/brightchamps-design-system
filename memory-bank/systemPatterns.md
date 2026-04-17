# System Patterns

## Core architecture: two-source extraction

```
Figma REST API → figma-api.ts ─────┐
                                    ├→ normalize.ts → DesignToken[] → ledger/
Playwright DOM → playwright-crawler.ts ┘
```

The fundamental insight: both Figma and DOM are machine-readable.
No screenshots needed. No manual inspection.

## The DesignToken schema (the universal language)
Every token from every source normalizes to this:
```ts
{
  id: string          // stable, never changes
  name: string        // dot-notation: color.primary.default
  value: string       // always px for sizes, hex for colors
  type: TokenType     // color | typography | spacing | radius | shadow | motion
  source: 'figma' | 'dom'
  surface: SurfaceId  // landing | student-app | teacher-app | admin-dashboard
  confidence: number  // 0–1
  status: 'active' | 'deprecated'
  extractedAt: string // ISO date
}
```

## The drift model
Drift = a token that exists in both Figma and DOM with different values.
Drift is FLAGGED, never auto-resolved. Humans decide canonical value.
Once decided → written to ledger → published to Figma + CSS.

## Admin dashboard is special
No Figma file exists. DOM extraction produces tokens with:
- `source: 'dom'`
- `confidence: 0.8` (slightly lower because no design backing)
- These tokens ARE the source of truth for admin surface

## Data flow
```
extract → normalize → [ledger build + drift detect] → [human review] → publish
```
Each step writes to `ledger/` directory. The ledger is the single source of truth.
Nothing reads from raw extractions after normalization.

## Publish targets
1. **Figma variables** — pushes to Figma REST API, creates/updates variable collections
2. **CSS custom properties** — writes `tokens.css` for engineering team
3. **Design system site** — Next.js site structured as: Foundations / Components / Patterns
