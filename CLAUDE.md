# BrightChamps Design System

## What this project does
Extracts design tokens from live surfaces (DOM) and Figma files, detects drift
between them, synthesizes a canonical design system, and publishes it as:
1. A Figma variables file
2. A CSS token file (tokens.css)
3. A live design system site (brightchamps.design — like atlassian.design)

## Surfaces
See @surfaces.config.ts for all URLs and Figma file IDs.

## Commands
```
npm run extract:dom        # Playwright crawls all surface URLs
npm run extract:figma      # Figma REST API pulls styles + variables
npm run extract:all        # Both extractors in sequence
npm run ledger:build       # Claude resolver synthesizes canonical DS
npm run ledger:status      # Show current token counts + last build date
npm run drift:detect       # Diff Figma vs DOM, write ledger/drift/
npm run drift:review       # Open localhost:3001 drift review dashboard
npm run publish:figma      # Push canonical tokens → Figma variables
npm run publish:css        # Write src/publish/output/tokens.css
npm run publish:site       # Build the brightchamps.design site
```

## Architecture
See @docs/architecture.md for full system design.
See @docs/decisions/README.md before making significant architectural changes.

## Token Schema (DesignToken)
```ts
{
  name: string           // e.g. "color/primary/500"
  value: string          // e.g. "#2462EA"
  type: TokenType        // color | typography | spacing | radius | shadow | border
  source: 'figma'|'dom'  // where this was extracted from
  surface: Surface       // landing | student | teacher | admin
  confidence: number     // 0–1. figma+dom match = 1.0, dom-only admin = 0.8
  raw?: Record<string, unknown>  // original extracted data
}
```

## Resolution Rules
- figma.value === dom.value → confidence 1.0, no drift
- values differ → flag as drift, NEVER auto-resolve, add to ledger/drift/
- dom-only surface (admin) → treat as canonical for that surface, confidence 0.8
- Never delete a token — mark as `deprecated: true` instead
- Admin dashboard has NO Figma → DOM is source of truth for admin tokens

## Code Style
- TypeScript strict mode — no `any`, use `unknown` with type guards
- ES modules only (import/export)
- 2-space indent, single quotes, trailing commas
- All async functions must have explicit error handling (try/catch + typed errors)
- Log with structured objects: `console.log({ event: 'extract:start', surface, url })`

## Prohibited
- Never commit `.env` or any file containing API keys
- Never commit `.playwright-auth/` — live session state
- Never auto-push to Figma without explicit user confirmation
- Never delete from ledger/tokens.json — only append or deprecate
- Never run Playwright in headful mode in CI

## Auth for protected surfaces
Student, teacher, and admin apps are auth-gated. Playwright uses
**storageState** (cookies + localStorage + sessionStorage) captured from a
real logged-in browser session. The file lives at `.playwright-auth/<surface>.json`
and is gitignored.

**Student app** uses `storageState` auth via `.playwright-auth/student.json`.
To refresh when the session expires:

```bash
npx playwright codegen --save-storage=.playwright-auth/student.json https://champ.brightchamps.com/login/
```

Log in manually in the browser window that opens, close the window, file is
saved automatically. Cookie-header auth (`cookieEnvKey` / `cookieFormat` in
`surfaces.config.ts`) is a fallback for surfaces that don't use localStorage
tokens — storageState is preferred because it captures everything a real
browser session has.

## Current Phase
Phase 0 — Project bootstrap. See @memory-bank/activeContext.md for current focus.
See @docs/PRD.md for full requirements.

## Before Making Significant Changes
Read relevant ADRs in @docs/decisions/README.md first.
