---
title: BrightChamps Figma Variable Library
date: 2026-04-26
status: shipped — pending manual file rename + DC-005 brand sign-off
---

# BrightChamps Figma Variable Library

A production-ready Figma variable system for the BrightChamps design system, built into a single Figma file from `Design System Dashbaord/src/app/utils/designTokens.ts` + `tokens.css` + the canonical ledger + the DC-005 four-way conflict ticket.

## File

| Field | Value |
|---|---|
| URL | https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/Student-Dashboard-Design-System |
| File ID | `8eNJf875iY9HISEsczDfOh` |
| File name (current) | `Document` |
| File name (target) | `BrightChamps — Design System Library` |
| Status | shipped — needs manual rename in Figma desktop |
| Built | 2026-04-26 |

> The Figma plugin API blocks programmatic file renaming. The file ships with name `Document`; the user must rename in Figma desktop to match the spec.

## Counts

| Asset | Count |
|---|---:|
| Variable collections | 10 (5 primitive + 5 semantic) |
| Variables (total) | 376 (was 364 + 12 chrome architecture vars added 2026-04-28) |
| Variables (primitive) | 148 (was 142 + 6 chrome primitives) |
| Variables (semantic) | 228 (was 222 + 6 chrome semantic aliases) |
| Text styles | 15 |
| Effect styles | 5 |
| Pages | 8 (Page 1, Typography, Color System, About this library, NavBar, LeftSideBar, RightSideBar, DashboardLayout) |
| Components | 4 component sets (NavBar, LeftSideBar, RightSideBar, DashboardLayout) |

### Variable collections breakdown

| Collection | Modes | Vars |
|---|---|---:|
| `primitives/color` | value | 63 |
| `primitives/dimension` | value | 19 |
| `primitives/radius` | value | 15 |
| `primitives/typography` | value | 29 |
| `primitives/number` | value | 16 |
| `semantic/color` | light, dark | 92 |
| `semantic/typography` | value | 90 |
| `semantic/dimension` | value | 26 |
| `semantic/radius` | default, rounded, no-corner-radius | 8 |
| `semantic/number` | value | 6 |

### Text styles (15)

`Display, Heading/H1, Heading/H2, Heading/H3, Heading/H4, Title/LG, Title/MD, Body/LG, Body/MD, Body/SM, Label/MD, Label/SM, Caption, Code/MD, Code/SM`

Each style is bound to 6 `semantic/typography/[style]/*` variables: `font-family`, `font-size`, `line-height`, `letter-spacing`, `paragraph-spacing`, `font-weight`.

### Effect styles (5)

`shadow/sm, shadow/md, shadow/lg, shadow/xl, shadow/none` — DROP_SHADOW values from `designTokens.ts` `shadowTokens`.

## DC-005 four-way conflict

The locked, verbatim description on `primitives/color :: primary/500`:

```
DC-005 CRITICAL: Four-way brand purple conflict. Designer intent: #722ED1. Figma extraction: #4e3bc2. Production in-progress state: #6651e4. Typo (46 files): #4d3bc2. Brand team sign-off required. See DS site: /surfaces/#designer-conflicts
```

(239 chars, byte-identical to the spec, verified at Phase 9.)

The Color System page also documents the conflict visually with four side-by-side swatches and a footer note pointing to the DS site.

## Verification (Phase 9)

| Check | Result |
|---|---|
| 5/5 random primitives match spec values exactly | ✅ |
| 6/6 random semantics resolve to alias-only (no raw values) | ✅ |
| Light/dark mode divergence on `surface/bg/canvas` and `text/default` | ✅ both differ |
| `semantic/radius/radius/control/sm` modes resolve to 6 / 10 / 0 | ✅ exact match |
| 15/15 text styles each bound to 6 typography variables | ✅ |
| `color/primary/500` code syntax = `var(--color-primary-500)` | ✅ verbatim |
| DC-005 description verbatim (239 chars) on `primary/500` | ✅ |
| Typography preview page renders 15 styles in spec order | ✅ visually verified |
| Color System DC-005 section shows 4 distinct swatches | ✅ visually verified |
| All 364 variables scoped per spec table | ✅ 364/364, 0 failures |
| All 364 variables have WEB code syntax in `var()` form | ✅ 364/364 |

## Spec deviations (documented inline on the About page)

1. **`radius/full = 9999`** — `designTokens.ts` ships 100px; user spec overrode to 9999 for true pill at any element height. Reconciliation follow-up filed for `designTokens.ts`.
2. **`semantic/elevation` collection NOT created** — Figma variables don't have an `EFFECT` type. The 5 primitive shadow effect styles serve as the elevation system. Light/dark elevation modes would require duplicate effect styles, which is out of scope for v0.6.
3. **`primitives/dimension` is 19 vars (not 22)** — `designTokens.ts` has 12 spacing entries, not 15. Source ground truth honored over plan estimate.
4. **2 typography primitives added** beyond original count — `font/letterspacing/normal` and `font/paragraphspacing/normal` — needed to keep `semantic/typography` strictly alias-only across all 6 sub-tokens per style.

## Blockers before publishing as a team library

1. **Rename the Figma file** to `BrightChamps — Design System Library` in Figma desktop. The plugin API blocks programmatic rename, so this must be done manually.
2. **DC-005 brand-team sign-off** is still pending — that's the entire purpose of the locked description on `color/primary/500`. Until brand confirms, the library ships with `#722ED1` (designer intent) as the canonical and the description documents the conflict.
3. *(Optional)* Build a cover page on `Page 1`. Not strictly required for publishing.

## Phase summary

| Phase | Action | Result |
|---|---|---|
| Pre-flight | HARD GATE empty-file check | ✅ 0 collections, 0 styles, 1 default empty page |
| 1 | 6 primitive collections + 5 effect styles + DC-005 description | 142 vars + 5 effects |
| 1 read-back | Verify 5 random primitives | 5/5 ✅ |
| 2 | 5 semantic collections, all alias-only | 222 vars |
| 2 read-back | Verify 5 random semantics | 5/5 alias-only ✅ |
| 3 | Apply scopes per spec table | 364/364, 0 failures |
| 4 | WEB code syntax `var(--name)` | 364/364, 8 spec examples verbatim |
| 5 | 15 local text styles | 15 × 6 successful bindings (90 total) |
| 6 | Typography preview page | 15 rows, visually verified |
| 7 | Color System page (4 sections including DC-005 4-way) | rendered cleanly |
| 8 | About this library page | 14 info rows + 4 spec deviations |
| 9 | End-to-end verification | all 11 checks pass |

## Source files (read; never modified)

- `Design System Dashbaord/src/app/utils/designTokens.ts`
- `Design System Dashbaord/src/styles/tokens.css`
- `ledger/tokens.json`
- `ledger/drift/designer-conflicts-2026-04-26.json`

## Next pass (out of scope for v0.6)

- Build component instances (Button, Input, Card, Avatar, Badge, etc.) into the same library.
- Wire Code Connect mappings between library components and the dashboard repo.
- Design and add a cover page.
- Once DC-005 lands: update `color/primary/500` value (and remove the description) in a single targeted call.

---

## Tier 1 chrome components (added 2026-04-28, v0.7)

4 chrome components built from real production SCSS source, each on its own dedicated page:

| Page | Component | Variants | Source |
|---|---|---|---|
| `NavBar` | NavBar | collapsed (80px) / expanded (280px) | `src/components/NavigationBar/navigation.module.scss` |
| `LeftSideBar` | LeftSideBar | default (104px wrapper) | `src/layouts/DashboardLayout/dashboardLayout.module.scss` `.leftArea` |
| `RightSideBar` | RightSideBar | empty / class-info (460px panel) | `src/layouts/DashboardLayout/dashboardLayout.module.scss` `.rightArea` |
| `DashboardLayout` | DashboardLayout | rightPanelVisible=true / rightPanelVisible=false | `src/layouts/DashboardLayout/dashboardLayout.module.scss` |

`DashboardLayout` uses live instances of `LeftSideBar` and `RightSideBar` — not static mockups. Toggling those instances or swapping properties cascades into the shell.

### Chrome architecture variables added

6 primitives + 6 semantic aliases under `chrome/*`. These are layout architecture values, not visual scale:

| Variable | Value | Production source |
|---|---:|---|
| `chrome/sidebar-rail` | 104 | `.leftArea { width: 104px }` |
| `chrome/sidebar-collapsed` | 80 | `$navigation-width: 80px` |
| `chrome/sidebar-expanded` | 280 | `$navigation-width-expanded: 280px` |
| `chrome/right-panel` | 460 | `.rightArea { min/max-width: 460px }` |
| `chrome/main-content-max` | 880 | `.mainContentArea { max-width: 880px }` |
| `chrome/page-max` | 1440 | `.root { max-width: 1440px }` |

### Production drift flagged for ledger reconciliation

- NavBar padding 18px → bound to `space/inset/lg` (16px), +2px drift
- NavBar menu-item radius 12px → bound to `radius/control/lg` (10px), +2px drift
- 56×56 icon container has no matching dimension token (kept as raw value)
- `$border-radius-medium` 16px → bound to `radius/container/lg` (10px), +6px drift on RightSideBar
- `$menu-hover-color` #edebf8 → bound to `surface/bg/brand/subtle` #FAF5FF (close but not exact)
- `$app-background` #f5f4fa (tinted lavender) → bound to `surface/bg/sunken` #F2F2F2 (no purple tint)
- DC-005 unresolved: NavBar active bg ships #722ED1 (designer intent) via `surface/bg/brand`; production CSS resolves `get-color("primary-color")` = #4e3bc2

### Production realities documented (not "fixed")

- Production navData has only **one** entry: dashboard. Audit's 7-item list (learn/feed/badges/etc.) doesn't match source. Figma honors source.
- LeftSideBar is the 104px wrapper around NavigationBar (not a separate styled sidebar). No background; inherits `.container` white.
- RightSideBar transparent over `app-background` — looks gray, not white, in production.
- DashboardLayout `masWrapper` (masquerade users) state is an edge case, not built as separate variant.
- Tablet-portrait media query collapses left/right areas + shows mobile nav — Tier 2 work.
