# Extractor module rules

- All extractors must return `ExtractionResult` from @src/types/index.ts
- Never throw — catch all errors and push to `result.errors[]`
- Mark errors with `fatal: true` only if the entire extraction is unusable
- Log every extraction event with structured format: `{ event, surface, url, tokenCount }`
- Playwright must use `headless: true` always
- CSS extraction uses `window.getComputedStyle` — never parse stylesheets directly
- Figma extractor must paginate — files can have thousands of styles
- Both extractors write output to `src/extractors/output/{surface}-{source}-{timestamp}.json`
- Output files are gitignored (large) — ledger/tokens.json is the committed artifact
