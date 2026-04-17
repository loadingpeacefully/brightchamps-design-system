# System Architecture

See @memory-bank/systemPatterns.md for full architecture details.

## Quick reference

```
surfaces.config.ts          ← ALL URLs and Figma file IDs (edit here first)
src/extractors/
  figma-api.ts              ← Figma REST API → raw styles + variables
  playwright-crawler.ts     ← Playwright DOM → computed CSS
  normalize.ts              ← Both sources → DesignToken[]
src/resolver/
  index.ts                  ← Synthesizes ledger, flags conflicts
src/drift/
  detect.ts                 ← Diffs Figma vs DOM tokens
  report.ts                 ← Generates structured drift report
src/publish/
  figma-variables.ts        ← Pushes to Figma Variables API
  css-tokens.ts             ← Writes tokens.css
  ds-site/                  ← Next.js: brightchamps.design
ledger/
  tokens.json               ← Canonical token store (git-tracked)
  drift/                    ← Drift reports (git-tracked)
dashboard/                  ← Drift review UI (Next.js, localhost:3001)
```

## Data flow

```
EXTRACT → NORMALIZE → LEDGER BUILD → DRIFT DETECT → HUMAN REVIEW → PUBLISH
```

Each stage writes to `ledger/`. Nothing writes to ledger directly except the scripts.
