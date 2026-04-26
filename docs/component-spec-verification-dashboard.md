# Component Spec Verification — student-dashboard repo

**Repo:** `repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/`
**Date:** 2026-04-26
**Method:** For each spec in `lib/componentSpecs.ts`, located the actual production source file and compared every token mapping against the real SCSS / TSX. This rerun supersedes `docs/component-spec-verification.md` (which audited the smaller feed repo).

## Headline

**5 of 6 specs found, all 5 with at least one conflict against production.** Plus the brand-color disaster runs even deeper than DC-005's three-way: `#722ED1` (the designer DS purple) is shipping in production code paths, the production progress-bar uses **a third green** `#11ac69` not yet in the ledger, and several "neutral" tokens we documented are actually brand-purples in real code.

| Component | Source file | Status | Notes |
|---|---|---|---|
| Button | `src/components/Button/{index.tsx, button.module.scss}` | **conflict** | Variant taxonomy completely different (5 variants, none called "primary/secondary/ghost"); padding y wrong; border-radius wrong; brand-primary background correct |
| ProgressLine | `src/components/ProgressBar/{index.tsx, progressbar.module.scss}` | **conflict** | Track wrong, height wrong, radius wrong, completed-green is a NEW value `#11ac69` (not in ledger), in-progress fill is `#6651e4` not `#4e3bc2` |
| Accordion | `src/newDashboard/PracticeZone/components/milestoneAccordion/{MilestoneAccordion.tsx, milestoneAccordion.module.scss}` | **conflict** | Status colors use brand purple `#6651E4`, not neutral; border-radius / padding values differ |
| LessonList | `src/newDashboard/learn/components/LessonList/LessonList.module.scss` | **conflict** | Border-radius is `16px`, our spec says `radius/md` (8px). Padding `26px 0`, not `space/4` (16px). Status colors live one level deeper in `LessonList/components/`. |
| GreenLine | (no direct match) | **inferred** | No reusable GreenLine component exists. Production has `height: 4px` patterns but they're inlined into specific contexts (ToggleSwitch, BadgeTab indicator, etc.), not extracted. |
| Layout | `src/layouts/DashboardLayout/{index.tsx, dashboardLayout.module.scss}` | **conflict** | Sidebar width is **104px** in production, our spec says **240px** (a desktop chrome shortcut bar, not a full sidebar — different IA). Page background uses `$app-background` (#f5f4fa), not pure white. |

---

## 1. Button

**Source:** [`src/components/Button/index.tsx`](repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/Button/index.tsx) + `button.module.scss`

### Real variants

```ts
type ButtonVariants = 'contained' | 'outlined' | 'danger' | 'info' | 'underline'
```

**None match our spec's** `primary` / `secondary` / `ghost`. The closest mapping:

| Our spec | Production reality |
|---|---|
| `primary` | `contained` (filled brand-primary background) |
| `ghost`   | `underline` or `outlined` (border-only, transparent bg) |
| `secondary` | (no equivalent — production has `danger` and `info` instead, both color-keyed) |

### Tokens — actual

```scss
.contained {
  background-color: get-color(primary-color);  // = $primary-color = #4e3bc2 ✓
  color: text-property(text-white);            // = #ffffff ✓
  border: 2px solid get-color(primary-color);  // 2px border NOT in our spec
  padding: 8px 24px;                           // y=8px, our spec says 12px
}
.root { border-radius: 50px; ... }             // 50px, our spec says radius/full (9999px)
.danger  { border: 2px solid #ff8480; color: #ff8480; }   // hardcoded, no token
.info    { border: 2px solid #60bfbd; color: #60bfbd; }   // hardcoded, no token
.contained:disabled { background: $disabled-bg; }         // $disabled-bg = #eff3f5, not #eeeeee
```

### Conflicts vs componentSpecs

- **Background (Primary):** `#4e3bc2` ✓ matches `color/brand/primary`
- **Padding (y):** spec says `space/3` (12px), code has `8px`
- **Border radius:** spec says `radius/full` (9999px), code has `50px` (functionally pill, but numerically different)
- **Outline:** code adds a `2px` brand-color border to `.contained` — not in spec
- **Disabled bg:** spec says `color/neutral/200` (#eeeeee), code uses `$disabled-bg` (#eff3f5)
- **Hover:** spec says `color/primary/700` (#0d47a1), no `:hover` rule in source
- **Variants:** spec has 3 (primary/secondary/ghost), code has 5 (`contained`/`outlined`/`danger`/`info`/`underline`)
- **Hardcoded `#ff8480`, `#60bfbd`, `#0000003b`:** none in ledger; should be canonicalized

---

## 2. ProgressLine (= ProgressBar)

**Source:** [`src/components/ProgressBar/{index.tsx, progressbar.module.scss}`](repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/ProgressBar/)

### Tokens — actual

```scss
.progressBar { width: 100%; height: 10px; background: #e0e0e0; border-radius: 10px; }
.progressBarFill                   { background: #11ac69; }   // default — NEW green not in ledger
.progressBarFillCompleted          { background: #11ac69; }   // completed → also #11ac69
.progressBarFillInProgress         { background: #6651e4; }   // in-progress → $inprogress-state
.progressBarFillSkipped            { background: #ff752c; }   // skipped → $highlight-color = color/warning/1400 ✓
.progressBarFillPaused             { background: #3b9af5; }   // paused — not in ledger
.progressValueCompleted            { color: #11ac69; }
.progressValueInProgress           { color: #6651e4; }
.progressValuePaused               { color: #3b9af5; }
```

### Conflicts vs componentSpecs

- **Track:** spec says `color/neutral/200` (#e7e7e7), code has `#e0e0e0`
- **Height:** spec says `space/2` (8px), code has `10px`
- **Border radius:** spec says `radius/full` (9999px), code has `10px` (rounded corners, not pill — completely different visual)
- **Fill (in-progress):** spec says `color/brand/primary` (#4e3bc2), code uses **`#6651e4`** (= `color/primary/500`, the feed repo's de facto brand)
- **Fill (completed):** spec says `color/success/500` (#00B67A), code uses **`#11ac69`** (a fourth green, not in ledger; not even the `#24c26e` we found in the feed repo)
- **Variants:** spec has 3 (default/in-progress/completed), code has 5 (default/completed/in-progress/skipped/paused)

**This single component invalidates 4 of 9 token mappings in the ProgressLine spec.**

---

## 3. Accordion

**Source:** [`src/newDashboard/PracticeZone/components/milestoneAccordion/milestoneAccordion.module.scss`](repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/PracticeZone/components/milestoneAccordion/)

(There's also `src/components/FAQ/` with a simpler accordion shape — both exist; milestoneAccordion is the better match for our spec.)

### Tokens — actual

```scss
.wrapper       { border-bottom: 1px solid #37255124; padding: 20px 0; }
.titleContainer h4 { color: #222A33; font-size: 16px; font-weight: 500; }
.flagIcon      { background: #fff; }
.flagIcon.blueBg { background: #7D68FF; }                  // = $light-primary-color
.status        { color: #6651E4; font-size: 12px;          // status text → brand-purple
                 padding: 3px 4px; border-radius: 6px; background: #ffffff99; }
.status.not_started { color: #222A33; font-weight: 400; }
```

### Conflicts vs componentSpecs

- **Background (default):** spec says `color/neutral/100` (#ffffff). Code uses... no explicit background — wrapper has `#fff` but only in the `flagIcon`. The accordion wrapper is transparent on its container.
- **Border:** spec says `color/neutral/200` (#e7e7e7), code uses **`#37255124`** (a brand-purple at 14% alpha — bottom-border only, not a full container border)
- **Title text:** spec says `color/neutral/1400` (#212121), code uses **`#222A33`** (= `color/info/1500`, the dark slate)
- **Body / status text:** spec says `color/neutral/600` (#3d4d5d), code uses **`#6651E4`** (brand purple) for active status, `#222A33` for not-started
- **Border radius:** spec says `radius/md` (8px), status pill has `6px` (close), wrapper has none
- **Padding:** spec says `space/4` (16px), code has `20px 0`
- **Hover:** code uses `cursor: pointer` on header; no hover background change

**Production accordion is brand-color-keyed, not neutral-only as our spec implies.**

---

## 4. LessonList

**Source:** [`src/newDashboard/learn/components/LessonList/LessonList.module.scss`](repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/learn/components/LessonList/) (top-level only — sub-components in `LessonList/components/LeftSectionInList/` etc. would carry the per-row status colors)

### Tokens — actual

```scss
.activeList    { background: #fff; border-radius: 16px; }
.iconContainer { width: 50px; height: 50px; }
.upcomingIcon  { width: 24px; height: 24px;
                 border: 0.5px solid #A3B3C2; border-radius: 50%; background: #F8F7FA; }
.container     { padding: 26px 0; border-bottom: 1px solid rgb(10, 13, 15, 0.1); }
```

### Conflicts vs componentSpecs

- **Row background (hover):** spec says `color/neutral/200` (#e7e7e7). Code uses `#fff` for `.activeList` (the visible-row background, not a hover state).
- **Border radius:** spec says `radius/md` (8px), code uses `16px` (= `$border-radius-medium`)
- **Padding (block):** spec says `space/4` (16px), code uses `26px 0` (no token, custom value)
- **Divider:** spec says `color/neutral/200`, code uses `rgb(10, 13, 15, 0.1)` (alpha overlay — not in ledger)
- **Status colors:** not visible in this top-level SCSS. The 4 statuses (locked/available/in-progress/completed) likely live in `LessonList/components/LeftSectionInList/` which we'd need to read separately to fully verify.
- **Status icon size:** spec says `space/4` (16px), upcoming icon is `24px` desktop / `16px` mobile

---

## 5. GreenLine

**Source:** **No reusable component found.** Searched for `green-line`, `GreenLine`, `greenline`, `separator`, `divider` — none match. The 49 DOM elements counted in our audit likely correspond to inline patterns:

- `height: 4px` rules in 4 places: ToggleSwitch indicator, badge tab indicator, prelogin marker, teacher-led card progress accent
- Each is component-local, not extracted into a reusable element

### Conflict vs componentSpec

The spec's existence as a standalone "GreenLine" component is **not validated by production code**. It's a pattern, not a component. Recommendation: either (a) remove from `componentSpecs.ts` and merge its tokens into ProgressLine variants, or (b) keep it as a documented utility pattern with no source file.

---

## 6. Layout

**Source:** [`src/layouts/DashboardLayout/{index.tsx, dashboardLayout.module.scss}`](repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/layouts/DashboardLayout/)

### Tokens — actual

```scss
.root         { max-width: 1440px; margin: 0 auto; }
.container    { display: flex; gap: 0; background: white; }
.leftArea     { width: 104px; }                                 // ← sidebar is 104px, NOT 240px
.mainWrapper  { background: $app-background;                    // = #f5f4fa, NOT #ffffff
                height: 100vh; overflow-y: scroll;
                padding: 32px 24px;                             // matches space/8 + space/6 ✓
                flex-grow: 1; }
.mainContentArea { max-width: 880px; margin: auto; }
.rightArea    { min-width: 460px; max-width: 460px; padding: 20px; }   // RIGHT sidebar 460px wide
.challenges   { color: #3d4d5d; }                              // matches $text-black
.new          { background: #fd4141;                            // not in ledger
                color: $text-white; }                          // ✓
```

The architecture is **three-column** (left chrome 104px / main 880px / right context 460px), not two-column with a sidebar drawer like our spec.

### Conflicts vs componentSpecs

- **Page background:** spec says `color/neutral/100` (#ffffff), code uses `$app-background` (#f5f4fa)
- **Sidebar width (desktop):** spec says **240px**, code has **104px** (a chrome rail with icons + minimal labels, not a wide sidebar) — and there's a SECOND right-side panel of 460px the spec doesn't mention
- **Sidebar background:** spec says `color/neutral/200` (#e7e7e7). The `NavigationBar` component renders the left rail; its actual background lives in `src/components/NavigationBar/` and would need to be read separately. The `dashboardLayout.module.scss` itself doesn't paint the rail.
- **Active item bg / fg:** lives inside `NavigationBar`, not in this layout file
- **Padding (block, inline):** spec says `space/8 / space/6` (32px / 24px) — code matches ✓
- **Variants:** spec has `with-sidebar / without-sidebar / mobile`. Production has 8 layouts (`AppLayout`, `LoginLayout`, `FullScreenLayout`, `FullWidthLayout`, `OnboardingLayout`, `DashboardLayout`, `DemoDashboardLayout`, `GameDashboardLayout`) — none called "without-sidebar", and the mobile case is a separate `NavigationBarMobile` component, not a Layout variant.

---

## #722ED1 — full inventory

The designer's "Royal Amethyst" purple is not aspirational; it's **shipping in 6 files** of the dashboard repo:

```
src/styles/_variables.scss:90                                  $button-primary: #722ED1;
src/newDashboard/yearInReview/yearInReview.module.scss:177     background-color: #722ED1;
src/newDashboard/yearInReview/yearInReview.module.scss:263     background: #722ed1;
src/newDashboard/learn/components/Header/Header.module.scss:87 color: #722ED1;
src/newDashboard/yearInReview/index.tsx:307                    fill="#722ED1"
src/newDashboard/templates/FeedLayout/components/YearReviewCard/index.tsx:71  fill="#722ED1"
src/newDashboard/templates/FeedLayout/components/YearReviewCard/yearReview.module.scss:53  background: #722ED1;
```

All 6 are recent feature surfaces (year-in-review, learn page header, FeedLayout banners). The token `$button-primary` is defined but only used by 10 files — implying a token migration started but didn't finish.

---

## What this means for componentSpecs.ts

Updates to apply:

| Component | New `verificationStatus` | New `sourceFile` |
|---|---|---|
| Button | `conflict` | `repo-cloned/.../src/components/Button/button.module.scss` |
| ProgressLine | `conflict` | `repo-cloned/.../src/components/ProgressBar/progressbar.module.scss` |
| Accordion | `conflict` | `repo-cloned/.../src/newDashboard/PracticeZone/components/milestoneAccordion/milestoneAccordion.module.scss` |
| LessonList | `conflict` | `repo-cloned/.../src/newDashboard/learn/components/LessonList/LessonList.module.scss` |
| GreenLine | `inferred` (kept) | (no match) |
| Layout | `conflict` | `repo-cloned/.../src/layouts/DashboardLayout/dashboardLayout.module.scss` |

5 of 6 flip from `inferred` to `conflict`. GreenLine remains inferred — and probably should be removed from `componentSpecs.ts` until production grows a real reusable element.

## Two new tickets recommended

1. **DC-009 — production progress green is `#11ac69`, not in ledger.** Used in `ProgressBar.module.scss` (default + completed fill, value text color) and reused as `$completed-state` and `$success-green` in `_variables.scss`. Add as a manual canonical or reconcile against existing `color/success/*` ramp.
2. **DC-010 — paused-state color `#3b9af5` not in ledger.** Used in `ProgressBar` paused variant.

Both are smaller than DC-005 / DC-008 but block the codemod for this component.
