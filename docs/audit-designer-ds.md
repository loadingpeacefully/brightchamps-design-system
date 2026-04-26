# Design System Dashboard — Audit Report

**Date:** 2026-04-26
**Subject:** Comparison of the designer-built "Design System Dashboard" (Vite + React SPA at `Design System Dashbaord/`) against the engineering-built `ds-site-v2` (Next.js SSG at `src/publish/ds-site-v2/`).

---

## 1. File structure

| Dimension | Designer's version | Our ds-site-v2 |
|---|---|---|
| **Framework** | React 18 + Vite 6 + Tailwind 4 (SPA) | Next.js 14 App Router + Tailwind 3 (SSG) |
| **Routing** | Client-side state management (no URL routing) | File-system routes, 22 static pages |
| **UI primitives** | Radix UI + shadcn/ui (49 components in `ui/`) | Radix Dialog only; custom components |
| **Icons** | lucide-react + 2 custom Figma-exported icon sets (1,208 icons total) | lucide-react only |
| **Figma integration** | Direct Figma exports in `src/imports/` (Colours, Fill/Line icon libraries, CTA frames) — auto-generated from Figma plugin | None; tokens extracted via REST API |
| **Token source** | Manually authored `tokens.css` (195 lines) + `designTokens.ts` (12K) | Auto-generated from `ledger/tokens.json` via `build-tokens.ts` |
| **Deployment** | Static SPA in `dist/` (deployable to any CDN) | GitHub Pages via Actions workflow |
| **Total source size** | ~1.5MB (excluding `node_modules`, Figma SVG data is ~3MB) | ~200KB source + 3MB ledger JSON |

**Key structural difference:** The designer's version is a self-contained showcase app. Our version is a pipeline-fed documentation site where every token value traces back to a Figma extraction or a DOM audit.

---

## 2. Design quality

### Visual comparison (from screenshots)

| Page | Designer's version | Our ds-site-v2 |
|---|---|---|
| **Home** | Orange gradient sidebar header with BrightCHAMPS branding. Main area: centered "Welcome" with sparkle icon. Clean but generic. | Dark header, Fraunces serif display hero, "What's new" strip, foundation cards grid. More Atlassian-like. |
| **Colors** | "Color Token System" hero with purple gradient. Tabbed interface (Primitive / Semantic / Multiple Formats). Export buttons (Copy CSS / Copy JSON). Code preview panel. Then 10-step ramps (50–900) per hue. Each swatch shows token name, hex, usage description. | Semantic groupings (Brand / Neutral / Feedback / Overlay / Surface / Interactive). Each swatch has copy-hex, copy-CSS-var, copy-name buttons, tier badge, usage count, surface pills. |
| **Typography** | Token cards in a 2-column grid showing token name (`font-heading-xl`), size/LH/weight as purple pills, live "quick brown fox" specimen. Role-based grouping (Headings / Body / Labels / Captions). | Size × weight matrix (6 rows × 5 cols) with live Nunito specimens. Role sections below (Display / Heading / Body / Caption). |
| **Buttons** | Three-column variant showcase (Primary / Secondary / Ghost) with live rendered buttons. Four-column state grid (Default / Hover / Disabled / Loading). Token mapping table with property → token → CSS var → value. | Not built yet (stub page). |
| **Icons** | Full searchable icon browser: 1,208 icons across 18 categories with copy buttons. Category tabs for filtering. | DOM-extracted audit: 160 icons (7 SVG, 153 images). Renders actual images from CDN. "No icon system detected" finding. |
| **Spacing** | Cards with purple proportional bars, token names, px/rem values, and "Common Uses" bullet lists for each step. Very effective visual. | Stub page only. |

### Typography
- **Designer:** Uses `Nunito` for specimens. UI chrome uses system font. Token names shown in pills (`40px LH 48px 700`). Clear role grouping.
- **Ours:** Uses `Inter` for UI chrome, `Nunito` for specimens only (per the brief). Matrix view is more information-dense but less visually approachable.
- **Winner:** Designer's card-based approach is more scannable; our matrix shows the full scale at a glance. Both have merit.

### Color presentation
- **Designer:** 10-step ramps (50–900) per hue family — Primary, Secondary, Neutral, Success, Warning, Error, Info, plus course-vertical colors (Coding, Robotics, Finance, AI, Literature, Maths). Each swatch has usage context ("Main brand color for primary actions").
- **Ours:** Semantic grouping (Brand / Neutral / Feedback / Overlay / Surface / Interactive) with sub-grouped feedback roles. Each swatch has real usage count from Figma extraction + tier badge + surface pill.
- **Winner:** Designer has better descriptive context per swatch. We have better data integrity (real usage counts, confidence tiers).

### Information hierarchy
- **Designer:** Clear section headers, purple accent on active sidebar item, breadcrumb trail. Content-focused — each section tells you what to use and when.
- **Ours:** Three-column layout (sidebar + content + right TOC), dark header, scroll-spy, section counts. More reference-oriented.
- **Winner:** Designer's copy and guidance is better for a first-time reader. Our layout is better for ongoing reference.

---

## 3. Token coverage

### Critical finding: brand color mismatch

| Token | Designer | Our extraction | Delta |
|---|---|---|---|
| Primary purple | `#722ED1` (Royal Amethyst) | `#4e3bc2` | **ΔE ≈ 18** — clearly different purples |
| Secondary yellow | `#FFCE00` | `#ffd900` | ΔE ≈ 2 — near match |
| Neutral 600 | `#3D4D5D` | `#3d4d5d` | ΔE = 0 — exact match |
| Success green | `#00B67A` | `#24c26e` | ΔE ≈ 12 — different greens |
| Error red | `#FF5C5C` | `#f0294d` | ΔE ≈ 15 — different reds |
| Info blue | `#33CCFF` | `#0d47a1` | ΔE ≈ 40+ — entirely different hues |

**The designer's brand purple (#722ED1) and our extracted brand purple (#4e3bc2) are different colors.** This is a P0 finding. Either:
- The designer is using the new brand color and the Figma file we extracted from is outdated
- Or the designer's version is aspirational and the Figma file reflects what shipped

This must be resolved before any merge.

### Token count comparison

| Category | Designer | Our ledger | Notes |
|---|---|---|---|
| Color primitives | 67 (10 hues × 3–10 steps) | 94 canonical (from 2,039 extracted) | Designer has cleaner ramps; we have more coverage |
| Typography | 10 role-based tokens | 17 canonical (from 712 extracted) | Designer names by role; we name by rank |
| Spacing | 12 steps (4px–96px) | 157 raw extracted (12 canonical scalar) | Comparable on canonical count |
| Radius | 5 sizes (sm–full) | 29 extracted (9 canonical) | Designer has cleaner scale |
| Shadow | 4 levels (sm–xl) | 10 canonical | Comparable |
| Icons | 1,208 SVG icons | 160 DOM-extracted (7 SVG, 153 img) | Designer has a complete icon library |
| Course verticals | 6 hue families (Coding, Robotics, Finance, AI, Literature, Maths) | 0 | We never extracted course-specific colors |

### Token naming

| Approach | Designer | Ours |
|---|---|---|
| Color | `color-primary-500` (hue + scale) | `color.008` (frequency rank) |
| Typography | `font-heading-xl` (role + size) | `typography.01` (frequency rank) |
| Spacing | `spacing-4` (multiplier) | `spacing.04` (frequency rank) |
| Semantic layer | Partial — `color-brand-primary: var(--color-primary-500)` | Proposed in TDR-0001 — `fgColor/brand: {color.brand.purple.9}` |

**Designer's naming is more descriptive than ours.** Our TDR-0001 migration proposal addresses this, but it hasn't shipped yet.

---

## 4. Components

### Designer has documented (10 active):
1. **Buttons** — Primary/Secondary/Ghost variants, Default/Hover/Disabled/Loading states, token mapping table with property → token → CSS var → value, copy-to-clipboard code snippets
2. **Input Fields** — Text inputs, text areas, validation states, error messaging
3. **Dropdowns** — Select menus, option lists, open/closed states
4. **Tabs** — Tab bar variants, active state, content switching
5. **Chips/Tags** — (listed, likely stub)
6. **Modals** — (listed, likely stub)
7. **Tooltips** — (listed, likely stub)
8. **Loaders/Spinners** — (listed, likely stub)
9. **Toast/Snackbars** — (listed, likely stub)
10. **Icons** — Full 1,208-icon searchable browser

### Designer has planned (16 student-specific):
Class Joining Card, Learning Progress Card, Feed (All States), Calendar, Lesson/Homework/Quiz Lists, Profile Card, Side Menu, BrightBuddy (AI Chat), Rewards/Achievements, Streak Tracker, Leaderboard, Course Card, Activity Timeline

### What we have:
- **Zero component documentation pages.** All component pages are stubs.
- **21 components discovered** from DOM audit (Accordion, RightSectionInList, ProgressLine, GreenLine, LessonList, etc.) — but these are raw CSS Module prefix counts, not documentation.

---

## 5. What the designer's version does better

1. **Component documentation with token mappings.** The Buttons page shows exactly which tokens map to which CSS properties (background → `color-primary-500`, padding → `spacing-6`). This is the single most useful thing for an engineer implementing a component. We have nothing comparable.

2. **Export functionality.** "Copy CSS Variables" and "Copy JSON" buttons export the entire token system in one click. We have per-token copy but no bulk export.

3. **Spacing visualization.** Purple proportional bars + "Common Uses" bullet lists make the spacing scale immediately scannable. Our spacing page is a stub.

4. **1,208-icon searchable library.** Categorized (18 categories), filterable, with copy buttons on every icon. Our icon page shows 160 DOM-extracted assets — useful for auditing but not for a designer picking an icon.

5. **Usage context on every swatch.** Each color card says "Lightest surface", "Interactive hover", "Darkest text" — tells you when to use it, not just what the value is.

6. **Course vertical colors.** Coding (cyan), Robotics (orange), Finance (green), AI (purple), Literature (coral), Maths (gold) — product-specific color families. We extracted nothing like this.

7. **Token naming is already role-based.** `font-heading-xl` is immediately understandable. Our `typography.01` requires a lookup.

8. **Button state documentation.** Default/Hover/Disabled/Loading shown side by side with live examples. This is what engineers need and we don't have.

---

## 6. What we do better

1. **Production-verified tokens.** Every canonical token in our ledger was extracted from the real Figma file (2,861 raw → 94 canonical colors after ΔE<5 clustering) or verified against live DOM (7 authenticated student URLs). The designer's tokens are manually authored — if they drift from production, nobody knows.

2. **Drift detection.** We compare Figma vs DOM values for every token and classify as match/drift/missing/unknown/system-gap. The designer has no concept of production verification.

3. **Usage counts.** We know `#4e3bc2` appears 5,853 times in the Figma file and on every student page. The designer's tokens have zero usage data.

4. **Confidence tiers.** canonical (≥0.9) / candidate (0.4–0.89) / deprecated (<0.4) — a lifecycle system. The designer has no tier or lifecycle.

5. **Governance pipeline.** TDR system, ADRs, session logs, manual canonicals with audit trail, drift reports. The designer has none.

6. **Component discovery from DOM.** We know the student app has 21 real CSS Module components (Accordion 98 elements, ProgressLine 63, etc.). The designer lists components but doesn't verify they match production.

7. **Interactive state audit.** We probed 51 interactive elements and found 86% lack hover color changes. The designer documents ideal hover states but doesn't verify the app implements them.

8. **Multi-theme support.** Light/Dark/HC-Light/HC-Dark with complete CSS variable coverage. Designer has light mode only.

9. **Glossary.** 26 plain-English definitions for non-technical readers. Designer has none.

10. **Static site with GitHub Pages CI/CD.** Automated build + deploy on push. Designer's SPA needs manual deployment.

---

## 7. Merge recommendations (priority order)

### P0 — Resolve brand color conflict

The designer uses `#722ED1`; our extraction found `#4e3bc2`. **Do not merge anything until this is resolved.** Ask the designer: is #722ED1 the new brand color, or is #4e3bc2 still current? If the designer's color is canonical, our Figma extraction needs to be re-run against the updated file. If our extraction is canonical, the designer's tokens.css needs to be updated.

### P1 — Adopt the designer's token naming scheme

The designer's `color-primary-500` / `font-heading-xl` / `spacing-4` naming is clearer than our frequency-ranked `color.008` / `typography.01`. This aligns with TDR-0001's direction. Recommended approach:
- Accept TDR-0001 with the designer's naming as the target vocabulary
- Run the migration script with the designer's hue names (Royal Amethyst, Golden Aurelia, Metal Grey) as the canonical labels
- Map our extracted values to the designer's scale positions

### P2 — Port the Buttons page (component + token mapping pattern)

The designer's ButtonsSection.tsx (48K) is the single most valuable page to port. It demonstrates the pattern every component page should follow:
1. Variant showcase with live examples
2. State grid (Default/Hover/Disabled/Loading)
3. Token mapping table (property → token name → CSS variable → resolved value)
4. Copy-to-clipboard code snippets

Port this to our Next.js site as `/components/button/page.tsx`. Use our token pipeline as the source but adopt the designer's layout pattern.

### P3 — Port the spacing visualization

The designer's spacing cards with proportional purple bars and "Common Uses" lists are the best spacing documentation I've seen. Port to `/foundations/spacing/page.tsx`. Wire to our ledger spacing tokens.

### P4 — Import the icon library

The designer has 1,208 categorized SVG icons (Fill + Line variants). Port to `/foundations/iconography/page.tsx` with the category tabs and search. This replaces our DOM-extracted icon audit (which remains useful as a "what's actually used in production" audit).

### P5 — Add course vertical colors

The designer defines 6 product-specific color families (Coding, Robotics, Finance, AI, Literature, Maths). Add these to `ledger/manual-canonicals.json` and render on the color page as a seventh semantic group.

### P6 — Add usage context to our color swatches

The designer's per-swatch descriptions ("Lightest surface", "Interactive hover", "Darkest text") add immediate value. We should add a `description` field to our color tokens — either in `manual-canonicals.json` or in the DTCG `$description` field once TDR-0001 ships.

### P7 — Add bulk export

Add "Copy all CSS variables" and "Copy all JSON" buttons to the top of our color and typography pages. The designer has this; we only have per-token copy.

---

## Summary table

| Dimension | Designer wins | We win | Tie |
|---|---|---|---|
| Token naming | ✓ | | |
| Usage context | ✓ | | |
| Component docs | ✓ | | |
| Icon library | ✓ | | |
| Spacing visualization | ✓ | | |
| Export functionality | ✓ | | |
| Course vertical colors | ✓ | | |
| Production verification | | ✓ | |
| Drift detection | | ✓ | |
| Usage counts | | ✓ | |
| Governance / TDRs | | ✓ | |
| Multi-theme | | ✓ | |
| Static deployment | | ✓ | |
| Glossary | | ✓ | |
| Component discovery | | ✓ | |
| Interactive state audit | | ✓ | |
| Color page presentation | | | ✓ (different strengths) |
| Typography presentation | | | ✓ (different strengths) |

**Designer: 7 wins. Engineering: 9 wins. Ties: 2.**

The designer's version is better for a first-time reader who needs to know "what do I use and when." Our version is better for ongoing governance, production verification, and systematic accuracy. The ideal merge takes the designer's UX patterns and copy, fills them with our pipeline data, and keeps our governance layer underneath.
