# Component Specs — Verification Screenshots

**Date:** 2026-04-26
**Goal:** Spec the top 5 student-app components from the DOM audit using the Button page as the template, plus build `lib/componentSpecs.ts` as the AI generator's machine-readable input.

| # | File | Shows |
|---|---|---|
| 01 | [01-progress-line-full-page.png](2026-04-26-component-specs/01-progress-line-full-page.png) | `/components/progress-line/` — all 6 sections render: Overview + when/when-not, Variants (Default/In progress/Completed live bars), States (4 rows × 2 density columns), Token mapping (9 rows with hex swatches), Usage code snippet, Accessibility notes. Sidebar nav shows 6 components with NEW badges. |
| 02 | [02-accordion-full-page.png](2026-04-26-component-specs/02-accordion-full-page.png) | `/components/accordion/` — interactive demo (the right card actually toggles via `AccordionDemo.tsx` client island). States grid covers Default/Hover/Disabled × Collapsed/Expanded. 12-row token map. Real `aria-expanded` snippet. |
| 03 | [03-component-inventory-documented-badges.png](2026-04-26-component-specs/03-component-inventory-documented-badges.png) | `/surfaces/student/components/` — 5 components show green **DOCUMENTED** badges (Accordion, ProgressLine, GreenLine, LessonList, Layout). Component names link to their spec pages. The remaining 16 still show amber **NEEDS SPEC**. Header copy: "5 of 21 have a full spec page on this site… The remaining 16 are tracked here as 'Needs spec'." |

## Build state at capture

- `pnpm typecheck`: passed
- `pnpm build`: passed — **34 routes** (was 29, +5 component pages)
- All 5 new routes return 200 (`/components/{progress-line,accordion,lesson-list,green-line,layout}/`)

## Files added in this pass

- `src/publish/ds-site-v2/app/(docs)/components/progress-line/page.tsx`
- `src/publish/ds-site-v2/app/(docs)/components/accordion/page.tsx`
- `src/publish/ds-site-v2/app/(docs)/components/accordion/AccordionDemo.tsx` (client island — `useState` can't live in a Server Component that exports `metadata`)
- `src/publish/ds-site-v2/app/(docs)/components/lesson-list/page.tsx`
- `src/publish/ds-site-v2/app/(docs)/components/green-line/page.tsx`
- `src/publish/ds-site-v2/app/(docs)/components/layout/page.tsx`
- `src/publish/ds-site-v2/lib/componentSpecs.ts` — typed export of 6 component specs (Button + 5 new), 67 total token mappings, ready to import in the AI generator

## Files modified

- `src/publish/ds-site-v2/lib/nav.ts` — Components section now lists Button + Accordion + ProgressLine + GreenLine + LessonList + Layout (all `badge: 'new'`), Card and Input remain disabled
- `src/publish/ds-site-v2/app/(docs)/surfaces/student/components/page.tsx` — DOCUMENTED status (green) + clickable component-name link for the 5 spec'd components; NEEDS SPEC (amber) preserved for the remaining 16; header count badge added

## What's in `lib/componentSpecs.ts`

6 typed entries — Button, ProgressLine, Accordion, LessonList, GreenLine, Layout. Each carries:

- `name`, `slug`, `description`, `variants[]`
- `tokens[]` — every property → token → cssVar → value mapping from the page (9–13 rows per component, **67 total**)
- `usageExample` — full code snippet using `var(--color-*)` / `var(--space-*)` semantic CSS variables

This file is the AI generator's primary input. Import it to know the exact token bindings the design system expects when generating a new on-brand component.
