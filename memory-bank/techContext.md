# Tech Context

## Stack
- **Runtime:** Node.js 20+ (ESM)
- **Language:** TypeScript 5.6, strict mode
- **DOM extraction:** Playwright (headless Chromium)
- **Figma:** Figma REST API v1 (direct HTTP, no SDK)
- **AI resolution:** Anthropic SDK (claude-haiku-4-5 for speed/cost)
- **Dashboard:** Next.js 15, React 19, Tailwind CSS
- **Validation:** Zod schemas
- **Testing:** Vitest

## Key files
- `surfaces.config.ts` — ALL surface URLs and Figma file IDs (fill this first)
- `.env` — FIGMA_TOKEN, ANTHROPIC_API_KEY (copy from .env.example)
- `ledger/tokens.json` — canonical token store (never edit manually)
- `ledger/drift/` — drift reports (one JSON per run, timestamped)
- `src/types/index.ts` — DesignToken schema and all shared types

## Dev setup
```bash
npm install
npx playwright install chromium
cp .env.example .env
# Fill in .env and surfaces.config.ts
npm run extract:dom    # Test with landing page first
npm run ledger:build   # Build ledger from extractions
npm run drift:review   # Open review dashboard
```

## Figma API
- Base URL: `https://api.figma.com/v1`
- Auth: `X-Figma-Token: {token}` header
- Key endpoints:
  - `GET /files/{fileId}` — full file tree
  - `GET /files/{fileId}/styles` — published styles
  - `GET /files/{fileId}/variables/local` — local variables (requires editor access)

## Authentication for protected pages
Some surfaces require login (student app, teacher app, admin).
Use Playwright's `storageState` to save auth cookies:
```bash
npx playwright codegen https://app.brightchamps.com/login
```
Save auth state to `.playwright-auth/` (gitignored).

## Constraints
- Figma REST API: rate limited at 100 req/min
- Playwright: runs headless by default, set PLAYWRIGHT_HEADED=true to debug
- Claude SDK: use Haiku for extraction (fast + cheap), Sonnet only for complex resolution
