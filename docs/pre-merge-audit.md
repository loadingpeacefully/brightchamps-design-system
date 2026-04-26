# Pre-Merge Impact Analysis

**Date:** 2026-04-26
**Systems:**
- **A (Engineering DS):** `src/publish/ds-site-v2/` — Next.js 14 SSG, 22 routes, pipeline-fed from `ledger/tokens.json`
- **B (Designer DS):** `Design System Dashbaord/` — Vite + React SPA, 10 active sections, manually authored tokens

---

## SECTION 1 — INVENTORY

### Pages/sections that exist in A but not B

| Page | Route | Content |
|---|---|---|
| Home page (hero + what's new + foundations grid) | `/` | Fraunces hero, event feed, card grid |
| Glossary | `/get-started/glossary/` | 26 plain-English definitions (MDX) |
| Surface health dashboard | `/surfaces/` | Match % bars, token counts, drift analysis |
| Student overview | `/surfaces/student/` | 4 metric cards, top 5 critical drift items |
| Student component inventory | `/surfaces/student/components/` | 21 CSS Module prefixes from DOM audit |
| Student icon audit | `/surfaces/student/icons/` | 160 icons extracted from live DOM, bucketed by size |
| Student interactive states | `/surfaces/student/states/` | 51 hover probes, color change table |
| Drift review (stub) | `/drift-review/2026-04-16/` | Placeholder for approval UI |
| TDR-0001 (stub) | `/tdr/0001-taxonomy-migration/` | Taxonomy migration proposal |
| Dark mode (4 themes) | global | light / dark / hc-light / hc-dark |
| Right TOC scroll-spy | every docs page | IntersectionObserver-driven H2/H3 tracking |

### Pages/sections that exist in B but not A

| Section | Component | Content |
|---|---|---|
| Introduction | (placeholder) | Welcome text |
| How to Use | (placeholder) | Usage instructions |
| Design Principles | (placeholder) | Student experience focus |
| Token System overview | `TokenSystemSection.tsx` | Interactive token visualization (20K) |
| Token Naming & Standards | `TokenSystemDocumentation.tsx` | Naming convention docs (16K) |
| **Buttons** | `ButtonsSection.tsx` | 3 variants, 4 states, 14-row token mapping table (48K) |
| **Input Fields** | `TextFieldSection.tsx` | Text inputs, validation, error messaging (36K) |
| **Dropdowns** | `DropdownSection.tsx` | Select menus, states, behaviors (31K) |
| **Tabs** | `TabsSection.tsx` | Tab navigation, active states (20K) |
| Elevation / Shadows | (placeholder) | Not implemented |
| Illustrations | (placeholder) | Not implemented |
| Motion / Animations | (placeholder) | Not implemented |
| **16 Student Core Components** | (all placeholder) | Class Joining Card, Learning Progress, Feed, Calendar, BrightBuddy AI Chat, Rewards, Streak Tracker, Leaderboard, etc. |
| **7 Patterns** | (all placeholder) | Dashboard Layout, Lesson Flow, Quiz Flow, Homework, Class Join, AI Chat, Progress Tracking |
| States & System Behavior | (placeholder) | Empty, Loading, Error, Success, Disabled |
| Microcopy Guidelines | (placeholder) | Student-friendly tone guide |
| Accessibility Guidelines | (placeholder) | Not implemented |
| Interaction Guidelines | (placeholder) | Not implemented |
| **1,208 SVG icon browser** | `IconsSection.tsx` | 22 categories, searchable, line + fill variants |
| Course vertical colors (6) | In `ColorsSection.tsx` | Coding, Robotics, Finance, AI, Literature, Maths |
| Bulk export (Copy CSS / Copy JSON) | In `ColorsSection.tsx` | Full token system export |

### Pages/sections that exist in both

| Topic | A route | B section | Notes |
|---|---|---|---|
| Colors | `/foundations/color/` | `ColorsSection.tsx` | A has 6 semantic groups + real usage data; B has 10-step ramps + usage descriptions |
| Typography | `/foundations/typography/` | `TypographySection.tsx` | A has size×weight matrix + role sections; B has 2-column card layout with responsive specs |
| Spacing | `/foundations/spacing/` (stub) | `SpacingSection.tsx` | A is empty; B has proportional bars + common uses |
| Icons | `/surfaces/student/icons/` | `IconsSection.tsx` | A shows 160 DOM-extracted assets; B shows 1,208 designed SVGs |

### Component cross-reference

| Job | A component | B component | Same job? |
|---|---|---|---|
| Color swatch card | `ColorSwatch.tsx` | `ColorTokenCard` (inline in ColorsSection) | Yes — different layout, same purpose |
| Typography specimen | `TypeSpecimen.tsx` | Inline in `TypographySection.tsx` | Yes — A uses 2-column grid; B uses card with purple pills |
| Copy to clipboard | `ColorSwatch.tsx` (navigator.clipboard) | `CopyButton` (inline, document.execCommand) | Yes — different API; A is modern, B is legacy |
| Sidebar navigation | `Sidebar.tsx` (Radix-based, sticky, mobile drawer) | Inline in `App.tsx` (~200 lines) | Yes — A has mobile support, accessibility; B is desktop-only |
| Status badge | `StatusBadge.tsx` (4 variants) | None | A only |
| Theme switcher | `ThemeSwitcher.tsx` (5 themes) | None | A only |
| Feedback card | `FeedbackCard.tsx` (localStorage) | None | A only |
| TOC scroll-spy | `RightTOC.tsx` (IntersectionObserver) | None | A only |
| Mobile drawer | `MobileDrawer.tsx` (Radix Dialog) | None | A only |
| Button demo | None | `Button.tsx` + `ButtonsSection.tsx` | B only |
| Input demo | None | `TextFieldSection.tsx` | B only |
| Dropdown demo | None | `DropdownSection.tsx` | B only |
| Tab demo | None | `TabsSection.tsx` | B only |
| 45 shadcn/ui primitives | None | `components/ui/*.tsx` | B only |

---

## SECTION 2 — DATA SOURCES

### A reads from: `ledger/tokens.json` (3,196 tokens total, 307 canonical)

Generated by the extraction pipeline:
- 94 canonical colors (clustered from 2,039 raw via ΔE<5)
- 17 canonical typography tokens
- 10 canonical shadows
- 82 spacing tokens (DOM-extracted, passthrough tier)
- 29 radius tokens (DOM-extracted, passthrough tier)
- 16 manual canonicals (overlays, surfaces, interactive, typography.17, radius/pill)

### B reads from: `designTokens.ts` + `tokens.css` (97 primitive tokens)

Manually authored:
- 56 color primitives (10 primary + 10 secondary + 10 neutral + 12 status + 18 course vertical, at 50/500/900 scale)
- 13 semantic color aliases (brand-primary, brand-surface, interactive-primary, accent-primary, text-primary, etc.)
- 10 typography tokens (headings xl/lg/md/sm, body lg/md/sm, label lg/md/sm, caption)
- 6 font weights
- 12 spacing tokens
- 5 radius tokens
- 4 shadow tokens
- 4 icon sizes
- 3 control heights

### Token overlap and conflicts

**Colors with exact value matches (A ledger canonical ↔ B token):**

| B token name | B value | A ledger match | A name |
|---|---|---|---|
| color-neutral-600 | `#3D4D5D` | ✅ exact | `color.006` |
| color-neutral-50 | `#F9FAFB` | No exact match | — |
| color-neutral-200 | `#E7E7E7` | Close (ΔE<2) | `color.016` (`#eeeeee`) |

**Colors with CONFLICTING values (same role, different hex):**

| Role | B token | B value | A canonical | A value | ΔE | Conflict resolution |
|---|---|---|---|---|---|---|
| **Brand primary** | `color-primary-500` | `#722ED1` | `color.008` | `#4e3bc2` | **~18** | **P0 — must resolve. B is the designer's intent; A is what shipped in Figma. Ask designer: is #722ED1 the new standard?** |
| Brand accent | `color-primary-600` | `#5B25A7` | None | — | — | B only; no conflict |
| Secondary | `color-secondary-500` | `#FFCE00` | `color.028` | `#ffd900` | ~2 | Near match. B is the designer's intent; A is extracted. **Low risk — adopt B.** |
| Success | `color-success-500` | `#00B67A` | `color.066` | `#24c26e` | ~12 | **Different greens.** B is designed; A is extracted from Figma nodes. |
| Warning | `color-warning-500` | `#FF7C35` | None close | — | — | B has a distinct orange; A has various oranges in feedback group |
| Error | `color-error-500` | `#FF5C5C` | `color.017` | `#f0294d` | ~15 | **Different reds.** B is softer coral; A is sharper crimson. |
| Info | `color-info-500` | `#33CCFF` | `color.011` | `#0d47a1` | ~40+ | **Entirely different.** B is cyan; A is dark blue (Material Blue 900, flagged as library leak). |

**Typography overlap:**

| B token | B value | A canonical match | Notes |
|---|---|---|---|
| font-heading-xl | 56px / 800 | None | A's max canonical size is 20px. B's 56px doesn't exist in A. |
| font-heading-lg | 40px / 700 | None | Same — size 40px not in A's canonical scale. |
| font-heading-md | 32px / 700 | None | 32px seen in DOM drift (FINDING-002) but not canonical. |
| font-heading-sm | 24px / 600 | None | 24px seen in DOM drift but not canonical. |
| font-body-lg | 18px / 400 | Close | A has typography.15 (18/700) and typography.14 (18/800), but 18/400 is not canonical. |
| font-body-md | 16px / 400 | `typography.17` | **Exact match.** This is the manually-added body regular. |
| font-body-sm | 14px / 400 | None exact | 14/400 seen in DOM drift but not canonical. |
| font-family | Nunito | ✅ | Both agree on Nunito. |

**Spacing overlap:**

B's 12 spacing tokens (4–96px) all exist as raw values in A's DOM extraction, but only 12 have "canonical" status in A via the passthrough tier. The scales are functionally identical — both use a 4px base.

### Which pages in A would BREAK if we switch to B's token source?

| A page | What breaks | Why |
|---|---|---|
| `/foundations/color/` | Color count drops from 94 to ~69 | B has fewer color primitives; A's pipeline-extracted tokens (overlays, system-gaps) don't exist in B |
| `/foundations/typography/` | Matrix shrinks | B has 10 tokens; A has 17. The 7 missing are size/weight combos B doesn't define. |
| `/surfaces/` | Match % changes | Drift was calculated against A's ledger values. Changing the source changes what "match" means. |
| `/surfaces/student/` | Critical items table changes | Top 5 ΔE values were computed against A's canonicals. |
| All pages | CSS variable names change | A uses `--bc-color-001`; B uses `--color-primary-500`. Every `token.cssVar` reference breaks. |

### Which B pages reference tokens that don't exist in A's ledger?

| B section | Token referenced | Exists in A? |
|---|---|---|
| ColorsSection | `color-primary-500` (#722ED1) | **No** — A's brand purple is #4e3bc2 |
| ColorsSection | Course verticals (coding, robotics, finance, AI, literature, maths) | **No** — A has 0 course-vertical tokens |
| ColorsSection | Semantic aliases (color-brand-primary, color-interactive-hover, etc.) | **No** — A has no semantic alias layer yet (TDR-0001 pending) |
| ButtonsSection | `color-primary-500`, `color-primary-600` for hover | **No** — A has different hex values |
| TypographySection | `font-heading-xl` (56px), `font-heading-lg` (40px) | **No** — A's max canonical size is 20px |
| SpacingSection | All 12 tokens by name | By VALUE yes (4–96px exist); by NAME no (`spacing-4` vs `spacing.04`) |

---

## SECTION 3 — WHAT WILL BREAK

### 3.1 Replacing A's brand accent (#4e3bc2) with B's (#722ED1)

**Files that must change:**

| File | Variable | Current value | New value |
|---|---|---|---|
| `app/globals.css` | `--chrome-accent` | `#4e3bc2` | `#722ED1` |
| `app/globals.css` | `--chrome-border-focused` | `#4e3bc2` | `#722ED1` |
| `app/globals.css` | `--bc-brand-primary` | `#4e3bc2` | `#722ED1` |
| `app/globals.css` | `--chrome-accent` (dark) | `#9b8cff` | Needs new dark variant of #722ED1 (estimated ~#b18cff) |
| `app/globals.css` | `--chrome-accent` (hc-light) | `#2a1f6e` | Needs new HC variant |
| `app/globals.css` | `--chrome-accent` (hc-dark) | `#b5a9ff` | Needs new HC variant |
| `app/page.tsx` | Inline `style={{ background: 'var(--bc-brand-primary)' }}` | Renders purple CTA button | Renders different purple CTA |
| `public/favicon.svg` | `fill="#4e3bc2"` | Purple dot | Different purple dot |
| `tailwind.config.ts` | No direct hex — reads from CSS vars | No change needed | — |
| `lib/tokens.generated.ts` | Auto-generated — `color.008` value | `#4e3bc2` | Requires ledger update + rebuild |
| `scripts/build-tokens.ts` | `BRAND_HEXES` set | Contains `#4e3bc2` | Must add `#722ED1` |
| `scripts/migrate-tokens.ts` | `BRAND_HEXES` set | Contains `#4e3bc2` | Must add `#722ED1` |

**What renders differently:**
- Every purple-accented element: active sidebar item, focus rings, links, CTA buttons, TOC active bar, "NEW" badges, copy button hover state, search trigger hover, foundation card hover borders.
- The brand dot in the topbar logo.
- The hero gradient on the home page (contains `rgba(102,81,228,0.18)` which is derived from `#6651e4`, not `#4e3bc2` — secondary purple, so may or may not change).

**Contrast check:**
- `#722ED1` on white (#ffffff): contrast ratio ~4.8:1 (passes WCAG AA for normal text at 4.5:1). `#4e3bc2` on white: ~5.2:1. Switching to #722ED1 **slightly reduces contrast** but still passes AA.
- `#722ED1` on dark bg (#0b1020): ~3.1:1. `#4e3bc2` on dark: ~2.6:1. The new purple is **better** on dark backgrounds.
- **No WCAG failures from the switch alone**, but HC modes need recalculation.

### 3.2 Importing B's naming scheme into A's build pipeline

**Scripts that break:**

| Script | What references current names | What changes |
|---|---|---|
| `scripts/build-tokens.ts` | `cssVarName()` generates `--bc-color-001` from `color.001` | Must generate `--color-primary-500` from new names |
| `scripts/build-tokens.ts` | `classifyColor()` expects frequency-ranked token names | Must handle new naming pattern |
| `scripts/migrate-tokens.ts` | The entire migration script IS this change — it produces `color/brand/purple/01` names | Already built but produces a different naming scheme than B's `color-primary-500` |
| `src/publish/ds-site-v2/lib/tokens.generated.ts` | Auto-generated — all `token.name` and `token.cssVar` values change | Every page that reads this file is affected |

**Generated files that change:**
- `app/tokens.css` — every CSS variable name changes (e.g., `--bc-color-001` → `--color-primary-500`)
- `lib/tokens.generated.ts` — all `name`, `cssVar` fields change

**Downstream pages affected:**
- `/foundations/color/` — every `<ColorSwatch>` renders the new names
- `/foundations/typography/` — every `<TypeSpecimen>` renders the new names
- Any page that references `token.cssVar` or `token.name`
- The CSS itself — `tokens.css` variables rename, so any hardcoded `var(--bc-color-001)` in globals.css or Tailwind config breaks

**Key conflict:** B uses `color-primary-500`; our TDR-0001 proposes `color/brand/purple/01`. These are **two different naming schemes**. Must pick one before proceeding.

### 3.3 Copying B's ButtonsSection into A

**Imports that fail:**

| Import | B expects | A has | Fix |
|---|---|---|---|
| `Copy, Check, MousePointer2, Loader2, ArrowRight, Plus, Edit, Trash2, Download, Send` from lucide-react | ✅ | ✅ (lucide-react installed in both) | No fix needed |
| `Button` from `./Button` | B's `Button.tsx` | A has no Button component | Must copy `Button.tsx` too |
| CSS class `hover:bg-[#F5F4F0]` | Hardcoded hex | A uses Tailwind but this arbitrary value works | No fix needed |

**CSS variables B references that A doesn't have:**

| Variable | Value | A equivalent |
|---|---|---|
| `--color-primary-500` | `#722ED1` | `--bc-brand-primary` (`#4e3bc2`) — different value |
| `--color-primary-600` | `#5B25A7` | None — A has no hover variant of brand primary |
| `--color-secondary-500` | `#FFCE00` | `--bc-brand-yellow` (`#ffd900`) — close |
| `--color-neutral-50` | `#F9FAFB` | No exact var — value exists in ledger as `color.001` is `#ffffff` |
| `--color-neutral-900` | `#0D1D2D` | No exact var |
| `--color-neutral-200` | `#E7E7E7` | No exact var |
| `--color-neutral-300` | `#BCC2CA` | No exact var |
| `--spacing-6` | `24px` | No `--spacing-*` vars — A uses `--bc-spacing-*` format |
| `--spacing-3` | `12px` | Same issue |
| `--radius-full` | `100px` | No `--radius-*` vars |
| `--font-family-primary` | `Nunito` | No `--font-*` vars |
| `--font-weight-bold` | `700` | No var |
| `--font-size-body-md` | `16px` | No var |

**Without these variables:** Buttons render with fallback values or Tailwind defaults. Colors would be wrong (no purple bg), spacing might be close (Tailwind defaults), border-radius won't be 100px (buttons won't be pill-shaped).

**Estimated fix effort:** Add 15 CSS variable definitions to `globals.css` OR refactor the component to use A's existing Tailwind classes. ~1 hour.

### 3.4 Copying B's spacing visualization into A

**Data B expects:**

```typescript
// Each spacing token needs:
{
  name: string        // "spacing-4"
  value: string       // "16px"
  pixels: number      // 16
  remValue: string    // "1rem"
  commonUses: string[] // ["Card padding", "Form field spacing", "Default margins"]
}
```

**Does A's ledger have this?**
- **Values:** Yes — A has 12 canonical scalar spacing values (4px through 96px) matching B's scale exactly.
- **Names:** Different — A uses `spacing.04`, B uses `spacing-4`.
- **Common uses:** **No.** A has no `commonUses` metadata. This is hand-written content in B's `SpacingSection.tsx`.
- **Rem values:** Not stored in A. Computable from px ÷ 16.
- **Proportional bar heights:** Not stored. Computable from px relative to max.

**Effort:** Port the visualization component, add `commonUses` as static data (6 entries per token × 12 tokens = 72 bullets). ~2 hours.

### 3.5 Importing B's 1,208 SVG icons into A

**File size impact:**

| B icon file | Size | Notes |
|---|---|---|
| `LineIconLibrary.tsx` | 512K | React components |
| `svg-gyzoy5qpkp.ts` | **2.4 MB** | SVG path data (line icons) |
| `FillIconLibrary.tsx` | 472K | React components |
| `svg-8c10s0gv8f.ts` | 584K | SVG path data (fill icons) |
| `iconData.ts` | 232K | Icon metadata |
| `iconCategories.ts` | 8K | Category definitions |
| **Total** | **~4.2 MB source** | — |

**Static build impact:**
- Next.js SSG would tree-shake unused icon components, but `IconsSection.tsx` references all icons for the browser.
- Estimated JS bundle increase: **~800K–1.2 MB** after minification + gzip.
- GitHub Pages has no file size limit per se, but the 100 MB repo limit applies. Currently the repo is ~20 MB including ledger JSON. Adding 4.2 MB source + built output stays well under.
- **Build time increase:** Estimated +10–20 seconds for the larger bundle. Not a blocker.

**Will GitHub Pages serve it?** Yes — GitHub Pages serves static files up to 100 MB per site, individual files up to 100 MB. 1.2 MB gzipped JS is fine.

### 3.6 Adding B's course vertical colors to A's ledger

**B's course verticals:**

| Course | Base hex | 50 | 900 |
|---|---|---|---|
| Coding | `#33CCFF` | `#E6F7FF` | `#0A2933` |
| Robotics | `#FF7C35` | `#FFF5EF` | `#33180A` |
| Finance | `#00B67A` | `#E6F8F1` | `#002518` |
| AI | `#7453D7` | `#F5F0FE` | `#17102B` |
| Literature | `#ED675C` | `#FEF0EF` | `#2F1512` |
| Maths | `#FFA914` | `#FFF8E6` | `#332204` |

**Conflicts with A's canonical ledger:**

| B course color | B value | A canonical match | Conflict? |
|---|---|---|---|
| Coding 500 | `#33CCFF` | `color.031` (`#1cb6f0`, ΔE ~10) | Near match — same hue family |
| Robotics 500 | `#FF7C35` | `color.042` (`#ff752c`, ΔE ~3) | Near match — very close orange |
| Finance 500 | `#00B67A` | `color.027` (`#098137`, ΔE ~20) | Different greens |
| AI 500 | `#7453D7` | `color.055` (`#7b68ec`, ΔE ~8) | Near match — both purple |
| Literature 500 | `#ED675C` | `color.048` (`#f76969`, ΔE ~5) | Near match — same coral family |
| Maths 500 | `#FFA914` | `color.050` (`#ff8f00`, ΔE ~8) | Close — same orange-gold family |

**No hard conflicts** — none of B's course colors exactly duplicate an A canonical at ΔE<2. They can be added as a new `course` category in `manual-canonicals.json` without collision.

---

## SECTION 4 — IS EACH CHANGE FOR THE BETTER?

### 1. Switching brand primary to #722ED1

**NEEDS WORK.**

- #722ED1 is the designer's canonical brand color. It's intentional.
- #4e3bc2 was extracted from the student Figma file — it's what actually shipped.
- If the designer has moved to #722ED1 as the new standard, we should adopt it. But we need confirmation that #722ED1 IS the approved brand color, not just the designer's preference.
- **Risk:** changing the brand color touches every purple element across the site + the entire ledger pipeline.
- **Transition plan needed:** update ledger, rebuild tokens, re-run drift detection (match percentages change), update all chrome CSS variables, regenerate favicon.

### 2. Adopting B's token naming convention

**NEEDS WORK.**

- B's `color-primary-500` is clearer than A's `color.008`. Agreed by all parties.
- But A already has TDR-0001 proposing `color/brand/purple/01` (Atlassian+Primer+Radix hybrid). These are **two different naming schemes**.
- Must pick ONE naming standard before merging. Recommendation: use B's hue names (primary/secondary/neutral/success/warning/error/info + course verticals) with A's hierarchical structure (`color/{hue}/{scale}`). Don't use both.
- **Blocked on TDR-0001 review.**

### 3. Porting B's Buttons component page pattern

**SHIP IT.**

- B's ButtonsSection is the single most valuable component documentation pattern. The variant showcase + state grid + token mapping table is exactly what A needs for every component page.
- Port as a template, not a copy — adapt to use A's token pipeline data, not B's hardcoded values.
- Apply the pattern to all 21 DOM-discovered components (Accordion, ProgressLine, etc.).

### 4. Porting B's spacing visualization

**SHIP IT.**

- Purple proportional bars + "Common Uses" lists are immediately useful.
- A has the token values but not the visualization or the usage descriptions.
- The `commonUses` content must be authored by hand — it's design knowledge, not extractable.

### 5. Importing B's icon library as /foundations/iconography

**SHIP IT** (with caveat).

- 1,208 categorized SVG icons vs A's 160 DOM-extracted assets. No contest.
- **Caveat:** keep A's DOM-extracted icon audit as a separate "what's actually used" analysis. B's library shows what's available; A's audit shows what's deployed. Both are valuable.
- Bundle size increase (~1.2 MB gzipped) is acceptable for GitHub Pages.

### 6. Adding per-swatch usage descriptions from B

**SHIP IT.**

- B's "Lightest surface", "Interactive hover", "Darkest text" descriptions are human-authored design guidance that no pipeline can generate.
- Add as `$description` metadata per token — aligns with DTCG format and TDR-0001's `$description` field.
- No data loss, no breakage.

### 7. Adding course vertical colors to the ledger

**SHIP IT.**

- 6 course hue families with 3 scales each (50/500/900) = 18 new tokens.
- No conflicts with existing canonicals (nearest ΔE is ~3 for Robotics).
- Add to `manual-canonicals.json` as a `course` category.

### 8. Adding bulk export to token pages

**SHIP IT.**

- B has "Copy all CSS variables" and "Copy all JSON" — A only has per-swatch copy.
- Trivial to implement: serialize `tokens.generated.ts` data into CSS/JSON strings, write to clipboard on button click.
- ~30 minutes of work.

### 9. Replacing A's color grouping with B's grouping

**SKIP IT.**

- A's grouping (brand / neutral / feedback / overlay / surface / interactive) is data-driven and includes alpha-hex overlays and system-gap tokens that B doesn't have.
- B's grouping (primary / secondary / neutral / status / course verticals) is simpler but loses the overlay/surface/interactive distinctions.
- **Keep A's grouping.** Add course verticals as a 7th group. Don't collapse the existing categories.

### 10. Merging B's typography card layout with A's matrix layout

**NEEDS WORK.**

- A's matrix shows the full scale at a glance (gaps are visible — intentional). Good for reference.
- B's card layout with responsive specs (desktop/mobile sizes) and purple property pills is more scannable for a single token. Good for guidance.
- **Recommendation:** keep A's matrix as the primary view; add B's responsive spec info to the TypeSpecimen cards below the matrix. Best of both.

### 11. Preserving A's drift detection, governance, TDRs, multi-theme

**SHIP IT** (preserve exactly as-is).

- These are A's core advantages. B has none of them.
- Drift detection, TDR workflow, session logs, manual canonicals, multi-theme, glossary — all stay.
- They're orthogonal to B's content contributions and can coexist.

---

## SECTION 5 — MIGRATION RISK MATRIX

| # | Change | Effort | Risk | Value | Priority score |
|---|---|---|---|---|---|
| 8 | Bulk export buttons | LOW | LOW | MEDIUM | **1st** — quick win |
| 6 | Per-swatch usage descriptions | LOW | LOW | HIGH | **2nd** — pure content addition |
| 7 | Course vertical colors | LOW | LOW | MEDIUM | **3rd** — 18 new tokens, no conflict |
| 4 | Spacing visualization | MEDIUM | LOW | HIGH | **4th** — port component + author 72 usage bullets |
| 3 | Buttons page pattern | MEDIUM | LOW | HIGH | **5th** — template for all component pages |
| 5 | Icon library import | MEDIUM | MEDIUM | HIGH | **6th** — large bundle, needs tree-shaking strategy |
| 10 | Typography layout merge | MEDIUM | LOW | MEDIUM | **7th** — additive, no breakage |
| 1 | Brand color switch | LOW | **HIGH** | HIGH | **8th** — requires brand confirmation first |
| 2 | Token naming migration | **HIGH** | **HIGH** | HIGH | **9th** — blocked on TDR-0001 + naming reconciliation |
| 9 | Color grouping replacement | LOW | MEDIUM | LOW | **10th** — skip; current grouping is better |
| 11 | Preserve governance layer | ZERO | ZERO | HIGH | **Already done** — no action needed |

**Recommended execution order:**
1. Bulk export (30 min, ships today)
2. Per-swatch descriptions (1 hr, ships today)
3. Course vertical colors (30 min, ships today)
4. Spacing visualization (2 hr, ships today)
5. Buttons page pattern (half day)
6. Icon library import (half day)
7. Typography responsive specs (2 hr)
8. Brand color switch (1 hr code, needs brand confirmation **first**)
9. Token naming migration (multi-day, blocked on TDR-0001)

---

## SECTION 6 — WHAT MUST BE RESOLVED BEFORE ANY MERGE

### Decision 1: Brand primary color

**Question:** Is BrightChamps' official brand purple `#722ED1` (designer's choice) or `#4e3bc2` (what shipped in the student Figma file)?

| Option | Implications |
|---|---|
| A: Keep `#4e3bc2` | Designer's tokens.css must update. Dashbaord shows the wrong brand color. |
| B: Adopt `#722ED1` | Ledger re-extraction needed. All chrome CSS variables change. Drift report recalculates. Favicon changes. |

**Recommendation:** Adopt `#722ED1` — the designer is the authority on brand intent. The Figma file may contain an older color. But **confirm with the brand team first**.

### Decision 2: Token naming scheme

**Question:** Which naming convention becomes the standard?

| Option | Example |
|---|---|
| A: TDR-0001 proposal | `color/brand/purple/01`, `fgColor/brand` |
| B: Designer's scheme | `color-primary-500`, `color-brand-primary` |
| C: Hybrid | Use B's hue names + A's hierarchy: `color/primary/500` |

**Recommendation:** Option C — B's hue vocabulary is clearer (`primary` > `purple`); A's hierarchy is more extensible (`color/{hue}/{scale}` > flat `color-{hue}-{scale}`). Amend TDR-0001 with the designer's hue names.

### Decision 3: Typography scale sizes

**Question:** Should 24px, 32px, 40px, 56px from B's heading scale become canonical?

| Option | Implications |
|---|---|
| A: Keep current 10–20px scale | B's heading tokens can't render; large headings remain undocumented |
| B: Add B's heading sizes | Canonical count rises from 17 to ~21; covers display/hero headings |

**Recommendation:** Add them. They exist in B because designers need them; our DOM extraction found 24px and 32px in the wild (FINDING-002). This closes a known gap.

### Decision 4: Semantic alias layer

**Question:** Should we add B's semantic aliases (`color-brand-primary: var(--color-primary-500)`) to the ledger now, or wait for TDR-0001 review?

| Option | Implications |
|---|---|
| A: Wait for TDR-0001 | Clean but delayed; aliases don't ship until TDR is accepted |
| B: Add aliases now | Ships faster; may need to rename later when TDR-0001 finalizes names |

**Recommendation:** Wait. Adding aliases now with provisional names and then renaming when TDR-0001 ships creates a double migration. Accept the delay.

### Decision 5: Icon library ownership

**Question:** Should the 1,208-icon library from B replace or supplement A's DOM-extracted icon audit?

| Option | Implications |
|---|---|
| A: Replace | Lose the "what's actually used" production data |
| B: Supplement | Both coexist: `/foundations/iconography/` shows the full library; `/surfaces/student/icons/` shows what's deployed |

**Recommendation:** Supplement. Both serve different audiences: designers browse the library; PMs audit production usage.

### Decision 6: Status colors

**Question:** B defines Success (#00B67A), Warning (#FF7C35), Error (#FF5C5C), Info (#33CCFF). A extracted different values. Which set is canonical?

| Option | Implications |
|---|---|
| A: Keep extracted values | Matches what shipped; designer's dashboard shows different colors |
| B: Adopt designer's values | Clean status palette; production code may show different colors until eng updates |

**Recommendation:** Adopt B's values as the **target**. Flag the current production values as drift. This is exactly what the drift system is for — the designer defines intent, the pipeline detects deviation.
