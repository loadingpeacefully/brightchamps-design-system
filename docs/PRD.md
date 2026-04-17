# BrightChamps Design System — Product Requirements Document

**Stage:** Product Spec (Stage 2 of 3)
**Owner:** Suneet Jagdev
**Status:** Active
**Last updated:** 2026-04-15

---

## Change log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-15 | Initial PRD written from architecture conversations | Suneet |

---

## 1. Problem statement

BrightChamps has four live surfaces (landing pages, student app, teacher app,
admin dashboard) built without a shared design system. The result is visual
inconsistency, slower development, and a design team unable to maintain quality
across surfaces. There is no single source of truth.

## 2. Strategic context

This is foundational infrastructure. Without it, every new feature ships with
inconsistent UI. With it, the design team ships faster, engineers build with
confidence, and the product looks intentional and professional. This is table
stakes for a company preparing for scale.

## 3. Success metrics

| Metric | Target |
|--------|--------|
| Surfaces fully extracted | 4/4 |
| Critical drift items resolved | 100% before first publish |
| Time to run full drift check | < 5 minutes |
| Figma variables file published | Yes |
| Design system site live | Yes |
| Time for designer to find any token | < 30 seconds |

## 4. Scope

### In scope
- Token extraction from Figma (3 surfaces with Figma files)
- Token extraction from live DOM (all 4 surfaces via Playwright)
- Drift detection between Figma and DOM values
- Human review dashboard for drift resolution
- Canonical ledger of approved tokens
- Publish pipeline: Figma variables + CSS custom properties file
- Design system site (brightchamps.design) with Foundations / Components / Patterns
- Audit report per surface (what needs fixing + priority)

### Out of scope
- Redesigning any surface (we document, not redesign)
- Implementing design changes in code (we flag, engineers implement)
- Dark mode support (Phase 2)
- Design tokens for email/native apps (Phase 2)
- Component code library (Phase 2)

## 5. User stories

### Extraction
- As Claude Code, I can crawl any BrightChamps URL with Playwright and extract
  all CSS tokens in use (colors, fonts, spacing, radius, shadows) without manual work
- As Claude Code, I can read a Figma file via the REST API and extract all
  published styles and local variables without manual work
- As Claude Code, I can normalize tokens from both sources into the same
  DesignToken schema so they can be compared

### Drift
- As Suneet, I can run `npm run drift:detect` and get a complete list of every
  token that differs between Figma and DOM, grouped by severity
- As a designer, I can open the review dashboard and see each conflict with the
  Figma value, DOM value, and affected surfaces — and approve or reject each one
- As the system, I never auto-resolve drift — every decision requires a human

### Ledger
- As the system, I maintain a git-tracked `ledger/tokens.json` that is the
  single canonical source of truth for all approved tokens
- As the system, I never delete tokens — only mark them deprecated

### Publish
- As Suneet, I can run `npm run publish:figma` to push all approved tokens
  back to Figma as a variables collection
- As an engineer, I can import `tokens.css` and use CSS custom properties with
  confidence that they match the canonical design system

### Design system site
- As a designer, I can visit brightchamps.design and find any token, component,
  or pattern with usage guidelines
- As a designer, I can see the site structured as: Foundations / Components /
  Patterns (mirroring atlassian.design)

## 6. Flows

### Full extraction flow
```
developer runs: npm run extract:all
  → Playwright visits all URLs, extracts computed CSS
  → Figma API pulls styles + variables from all Figma files
  → normalize.ts converts both to DesignToken[]
  → written to ledger/.extractions/ (intermediate, gitignored)
```

### Drift resolution flow
```
developer runs: npm run drift:detect
  → detect.ts diffs figma tokens vs dom tokens
  → writes ledger/drift/YYYY-MM-DD.json
developer runs: npm run drift:review
  → Next.js dashboard opens at localhost:3001
  → designer reviews each item, clicks Approve/Reject
  → decisions written back to ledger/tokens.json
```

### Publish flow
```
developer runs: npm run publish:figma (after all drift resolved)
  → reads ledger/tokens.json (approved tokens only)
  → calls Figma Variables API to create/update collections
  → confirms N variables updated
developer runs: npm run publish:css
  → writes tokens.css with all CSS custom properties
```

## 7. Canonical type scale (student surface, as of 2026-04-16)

The canonical type scale is extracted from Figma and refined through drift
review. All family = Nunito. 17 tokens total: 16 from Figma frequency ranking
+ 1 manual addition (typography.17, body regular — confirmed system gap).

| Token | Size | Weight | Line height | Source |
|-------|-----:|-------:|------------:|--------|
| typography.01 | 16 | 600 | 19.2 | Figma canonical |
| typography.02 | 12 | 700 | 14.4 | Figma canonical |
| typography.03 | 14 | 700 | 19.6 | Figma canonical |
| typography.04 | 20 | 800 | 22.0 | Figma canonical |
| typography.05 | 16 | 700 | 19.2 | Figma canonical |
| typography.06 | 12 | 500 | 14.4 | Figma canonical |
| typography.07 | 12 | 600 | 16.4 | Figma canonical |
| typography.08 | 14 | 800 | 16.8 | Figma canonical |
| typography.09 | 14 | 600 | 19.6 | Figma canonical |
| typography.10 | 16 | 800 | 22.4 | Figma canonical |
| typography.11 | 10 | 400 | 12.0 | Figma canonical |
| typography.12 | 12 | 400 | 16.4 | Figma canonical |
| typography.13 | 14 | 500 | 16.8 | Figma canonical |
| typography.14 | 18 | 800 | 24.0 | Figma canonical |
| typography.15 | 18 | 700 | 21.6 | Figma canonical |
| typography.16 | 16 | 500 | 19.5 | Figma canonical |
| typography.17 | 16 | 400 | 19.2 | **Manual (system gap)** |

## 8. Technical requirements

- Playwright must handle authenticated routes (student, teacher, admin apps)
- Figma API rate limit: max 100 requests/minute — extractor must batch and retry
- DesignToken IDs are stable once assigned — never change on re-extraction
- All tokens stored in px (not rem) in ledger for portability
- Colors stored in hex (not rgb/hsl) in ledger
- Drift detection must handle near-identical values (e.g., 15.9px vs 16px) without false positives

## 9. Phases

### Phase 0 — Setup (current)
Configure surfaces.config.ts, verify extraction works end-to-end on one surface.

### Phase 1 — Extraction complete
All 4 surfaces extracted. Ledger built. First drift report generated.

### Phase 2 — Drift resolved
Design team reviews all critical + high drift items. Canonical ledger approved.

### Phase 3 — First publish
Figma variables published. CSS tokens file available. Design team can use immediately.

### Phase 4 — Design system site
brightchamps.design live with Foundations, Components, Patterns sections.

## 10. Open questions

| Question | Owner | Due |
|----------|-------|-----|
| Real Figma file IDs for each surface? | Suneet | Before Phase 1 |
| Auth strategy for protected surfaces? | Eng | Before Phase 1 |
| Who owns drift resolution decisions? | Design team lead | Before Phase 2 |
| Hosting for brightchamps.design? | Eng | Before Phase 4 |
| Should tokens.css be part of main app build? | Eng | Phase 3 |
