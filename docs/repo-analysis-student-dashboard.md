# Repo Analysis — brightchamps-student-dashboard (the real one)

**Path:** `/repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8`
**Date:** 2026-04-26
**Verdict:** This is **the real student dashboard** — Next.js 13 + React 18, 1,156 source files, well-organized component / layout / page / sections architecture. It's the codebase the AI generator should target. The `feed` repo we analyzed yesterday is a sibling product (the my-feed/global-feed surface only); this dashboard is the entire authenticated student app.

The `_variables.scss` token file is comprehensive (~75 named tokens), but the **brand-color situation is a four-way disaster**: `#4e3bc2`, `#722ED1`, `#6651e4`, AND a typo `#4d3bc2` all coexist as live production purples. DC-005 is bigger than we documented.

---

## Stack

```
NAME:    brightchamps-student-dashboard
VERSION: 0.1.0
NEXT:    13.2.4
REACT:   18.2.0
```

| Concern | What's used |
|---|---|
| Framework | Next.js 13 (Pages Router — `next dev`, `next build`, `next export`) |
| State | Redux Toolkit + react-query 4 (also imports legacy `react-query` 3 — both installed) |
| Styling | **SCSS modules** (679 `.scss` files, 675 are `.module.scss`). No Tailwind, no styled-components, no Emotion. |
| i18n | i18next + react-i18next + locale-key linter scripts |
| APM | `@elastic/apm-rum` |
| Notable libs | react-pdf, react-player, react-slick, react-toastify, react-joyride, react-circular-progressbar, lottie-react |

Build: `npm run check-used-translation-keys && next build && next export`. The `next export` makes this a static export (just like our DS site).

## Folder structure

```
src/
├── components/   ~58 component dirs — Button, Card, Modal, Input, ProgressBar, Loader,
│                  Text, Select, NavigationBar, NavigationBarMobile, FAQ, Chip, Timer,
│                  CertificateCard, Rating, ChatBot, ResponsePicker, SectionHeader,
│                  StarRating, RewardsTabs, SwitchProfileItemCard, … (and many more)
├── layouts/      8 layouts: AppLayout, DashboardLayout, OnboardingLayout,
│                  GameDashboardLayout, DemoDashboardLayout, FullScreenLayout,
│                  FullWidthLayout, LoginLayout
├── pages/        Next.js Pages Router — index, my-feed, learn, badges, certificates,
│                  rewards, parent-hub, onboarding, login, demo-classes, teacher-profile,
│                  practice-zone/, nano-skills/, year-in-review-2025, etc.
├── sections/     Page-specific composed sections (DemoDashboardPage, ReferralSection,
│                  WelcomeKit, OnboardingNew, GameDashboardPage, etc.)
├── newDashboard/ A parallel "new" implementation in active development —
│                  newDashboard/{learn, feed, certificates, badges, rewards, parentHub,
│                  PracticeZone, NanoSkills, TeacherProfile, EnrichmentClasses, …}.
│                  Both old and new code paths are shipped today.
├── styles/       _variables.scss, _mixins.scss, _functions.scss, globals.scss
├── store/        slices/, actions/  (Redux Toolkit)
├── services/     API clients (axios)
├── hooks/        Custom hooks
├── contexts/     React contexts
├── constants/    Including newDashboard/constants/practicezone-colors.ts
└── utils/        Utilities
```

## File extensions in src

| Ext | Count |
|---|---:|
| `.tsx` | 904 |
| `.scss` | 679 |
| `.ts`  | 243 |
| `.js`  | 12 |
| `.jsx` | 9 |
| **Total component-class files (.tsx + .ts + .jsx)** | **1,156** |

---

## Existing token system

### `src/styles/_variables.scss` — full inventory

The file defines ~75 SCSS tokens. **More comprehensive than the feed repo**, but still hand-authored, no auto-generation.

#### Brand / primary purples (the multi-purple problem)

```scss
$primary-color: #4e3bc2;            // Figma extraction canonical
$primary-color-light: #9685ff;
$primary-color-border: #9c8eef80;
$primary-color-extra-light: #f5f3fc;
$light-primary-color: #7d68ff;
$light-purple1: #e5e0f6;
$light-purple2: #d0c8ed;
$text-light-purple: #8a78f9;
$chip-hover-color: #4e3bc2;          // duplicate of $primary-color value
$inprogress-state: #6651e4;          // ← THIRD brand purple ("in-progress" is a primary-action color)
$inprogress-state-dark: #27197e;
$button-primary: #722ED1;            // ← FOURTH brand purple — designer DS color, only used 6x
$button-primary-hover: #5B25A7;
$button-primary-disable: #E7E7E7;
$button-primary-disable-text: #BCC2CA;
```

#### Other tokens

```scss
// Backgrounds + chrome
$body-bg: linear-gradient(135deg, #f9e5ff, #d3f4ff);
$disabled-bg: #eff3f5;
$app-background: #f5f4fa;
$menu-hover-color: #edebf8;
$dropdown-hover-color: #eff3f5;
$bg-white: #ffffff;

// Text
$text-dark-black: #2b3742;
$text-black: #3d4d5d;                // matches DS color/info/1400
$text-black-medium: #51667B;          // matches DS color/info/1300
$text-black-light: #606060;
$text-white: #ffffff;
$text-disabled: #8e8e8e;
$text-gray: #7d8892;
$text-dark-blue: #1334f2;             // standalone, no DS canonical

// State
$completed-state: #11ac69;            // not in DS ledger; closest is success/700
$completed-state-dark: #258f61;
$skipped-state: #ff752c;              // matches DS color/warning/1400
$skipped-state-dark: #bb480c;
$paused-state: #3b9af5;               // not in DS ledger
$paused-state-dark: #1866b1;
$danger-color: #f04b4b;               // close to DS color/error/700 (#f0294d)
$success-green: #11ac69;              // duplicate of $completed-state
$red-background: #ee1d20;
$dark-red-background: #a51315;

// Borders / shadows
$border-color: #dcdcdc;
$shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);  // declared THREE times in the file (line 19, 35, 38)
$slot-border-color: #3d4d5d33;
$card-border-color: #ededed;
$orange-border: #d0a044;

// Course identity
$coding-course-color: #8cc0de;
$finlit-course-color: #54bab9;
$robotics-course-color: #fc8a8a;
$communication-course-color: #f9cf53;

// Border radius
$border-radius-small:       10px;
$border-radius-medium:      16px;
$border-radius-large:       20px;
$border-radius-extra-large: 46px;

// Maps (used by SCSS @each generators)
$text-property: ( "text-black": #3d4d5d, "text-white": #ffffff, … )
$colors:        ( "primary-color": #4e3bc2, "highlight-color": #ff752c, "shade": #f5f6f7 )
```

### Token adoption

| Token | Usage in `.scss` files |
|---|---:|
| `$primary-color` | **88 files** |
| `$button-primary` | 10 files |
| `$inprogress-state` | 2 files |

So `$primary-color` (the `#4e3bc2` token) IS being used — far more than in the feed repo (where it was 0). But hardcoded `#4e3bc2` still wins **328 occurrences** over the 88 files using `$primary-color`. People know the token exists; they just paste the hex anyway.

### CSS custom properties

Only ~20 `var(--*)` references across the entire codebase. The naming convention is **inconsistent** between two camps:

| CSS var | Refs | Casing |
|---|---:|---|
| `--Typography-600` | 15 | PascalCase |
| `--bezier` | 8 | kebab-case |
| `--primary-brand-color-50` | 6 | kebab-case |
| `--typography-500` | 5 | kebab-case |
| `--Typography-500` | 5 | PascalCase (collides with the above) |
| `--neutal-500` | 5 | kebab-case + **typo** ("neutal" not "neutral") |
| `--Typography-800` | 4 | PascalCase |
| `--White` | 4 | PascalCase |
| `--primary-brand-color-600` | 4 | kebab-case |
| `--Brand-Purple-500` | 3 | PascalCase |

CSS-var adoption is essentially zero — and what does exist is incoherent.

---

## Top 40 hardcoded colors

```
624 #fff
510 #3d4d5d         ← $text-black
328 #4e3bc2         ← $primary-color (despite the token existing!)
180 #000
149 #ffffff
100 #222a33
 79 #4d3bc2         ← TYPO of $primary-color (one digit off — see below)
 70 #384655
 58 #8a78f9         ← $text-light-purple
 47 #7453d7
 39 #000000
 33 #f5f4fa         ← $app-background / $light-purple
 32 #6651e4         ← $inprogress-state (third brand purple)
 29 #64717d
 28 #bdbdbd
 25 #424242         ← $dropdown-font-color
 24 #ff752c         ← $highlight-color / $skipped-state
 23 #e3e2e9
 23 #333
 23 #2b3742         ← $text-dark-black
 21 #f9cf53         ← $communication-course-color
 21 #e0e0e0
 21 #d9d9d9
 21 #8e8e8e         ← $text-disabled
 20 #ffc200
 20 #666
 20 #1b0742
 19 #ddd
 19 #7d8892         ← $text-gray
 18 #f5f3fc         ← $primary-color-extra-light
 17 #51667b         ← $text-black-medium
 16 #f5f5f5
 15 #f0f0f0
 15 #eff3f5         ← $disabled-bg / $dropdown-hover-color
 15 #894aed
 14 #f9fafb
 14 #e1e2ff
 13 #fd8a8a
 13 #f1f1f1
 13 #efefef
```

**Striking observation:** for nearly every top-40 hardcoded color, an equivalent SCSS token ALREADY EXISTS. The most-used hardcoded purple `#4e3bc2` (328 hits) duplicates `$primary-color`. `#3d4d5d` (510 hits) duplicates `$text-black`. `#ff752c` (24 hits) duplicates `$highlight-color`. The token system is shadow-defined; nobody imports `_variables`.

---

## The brand-color disaster (DC-005 expanded)

Counting distinct purples in this repo's source code:

| Hex | Usage | Identity |
|---|---:|---|
| `#4e3bc2` | **173 files** | Figma extraction canonical / `$primary-color` / what we call `color/brand/primary` |
| `#4d3bc2` | **46 files** | **TYPO** of `#4e3bc2` (one digit off — `d` vs `e`) — perceptually identical (ΔE ≈ 0.5) but technically a separate value. Real shipping CSS. |
| `#6651e4` | **25 files** | `$inprogress-state` / what migrated to `color/primary/500` / the de facto in-app brand purple in the feed repo |
| `#722ED1` | **6 files** | `$button-primary` / Royal Amethyst from the designer DS |

**This is a four-way conflict, not three-way.** The DC-005 ticket should be updated again — and the `#4d3bc2` typo should be filed as its own ticket because it's a real bug that produces invisibly-wrong CSS in 46 files.

For comparison, here's where each lives:

- **`#4e3bc2`** (173 files): everywhere. The default brand color across pages, components, sections.
- **`#4d3bc2`** (46 files): scattered across `LaunchGurukulApp`, `WelcomeKit`, `SelectProfile`, `onboarding-new`, `PracticeZone/PracticeSectionHeader`, etc. **All four `_variables.scss` purples could be replaced by `$primary-color` and nobody would visually notice the typo case.**
- **`#6651e4`** (25 files): in-progress states, feed cards, lesson progress.
- **`#722ED1`** (6 files): year-in-review banner, learn page header, FeedLayout/YearReviewCard, the `$button-primary` token def.

---

## Component count + structure

- **1,156** `.tsx`/`.ts`/`.jsx` source files
- **58** named component directories under `src/components/`
- **8** layouts under `src/layouts/`
- **~50** Next.js pages
- **675** `.module.scss` files (one per component, the canonical SCSS-modules pattern)
- **787** lines containing `module.scss` / `module.css` references in `.tsx` files

This is a real, well-structured app — by far the largest of the three repos analyzed.

### Components that match our DS spec pages

| DS spec | Found in dashboard repo? |
|---|---|
| Button | `src/components/Button/{index.tsx, button.module.scss}` ✓ |
| ProgressLine | `src/components/ProgressBar/` — likely match (need to verify it's the bar variant, not a circular one) |
| Accordion | Probably exists — we should grep for it |
| LessonList | Lives under `src/newDashboard/learn/` — likely a section, not a single component |
| GreenLine | Naming-specific; may be inline / part of ProgressBar variants |
| Layout | `src/layouts/DashboardLayout/index.tsx` and 7 siblings |

**Recommendation:** rerun `docs/component-spec-verification.md` against THIS repo, not the feed repo. Five of the six "not in this repo" findings will likely flip to "found" against the dashboard.

---

## Existing bugs & latent risks

1. **`#4d3bc2` typo in 46 files.** The brand purple is `#4e3bc2`. Production CSS frequently writes `#4d3bc2`. Visually indistinguishable (ΔE ≈ 0.5) but a real divergence that won't show up in any drift detector that uses ΔE > 1 thresholds. **Filing as a new drift ticket.**
2. **`$shadow` declared three times** in `_variables.scss` (lines 19, 35, 38) with the same value. Harmless but signals merge cruft.
3. **`$coding-course-color` etc. declared twice** (lines 70-73 and 78-81). Same signal.
4. **`--neutal-500` typo** ("neutal" instead of "neutral") — 5 references. Real bug; renames silently break.
5. **Two CSS-var casing conventions live in the same code.** `--Typography-600` (15 refs) and `--typography-500` (5 refs) both exist.
6. **`react-query` v3 AND `@tanstack/react-query` v4 both installed.** Migration in progress, both code paths shipping.
7. **Two parallel UI implementations.** `src/sections/` (old) and `src/newDashboard/` (new) coexist. The DS audit will be split-brain unless we pick one.

---

## Style system files

```
src/styles/_functions.scss
src/styles/_variables.scss
src/styles/_mixins.scss
src/styles/globals.scss
```

`globals.scss` does NOT define any CSS custom properties — it's just resets, scrollbar styles, slick-carousel overrides. No `:root { --foo }` block.

---

## Tailwind?

No `tailwind.config.{js,ts,mjs}` exists. No Tailwind anywhere. The class-name analysis returned no utility classes (`bg-*`, `p-*`, etc.) because none exist. Everything is SCSS modules.

---

## What this means for the design system

This repo is the migration target. Everything we've done so far — the ledger, the tokens, the DS site, the componentSpecs.ts — needs to be evaluated against THIS codebase, not the smaller feed repo. Concrete next steps:

1. **Re-run component-spec-verification against this repo.** All 6 components likely have direct file matches here. The Button conflict found in the feed repo will reproduce here at much larger scale (`src/components/Button/index.tsx` is the actual production button used by 1,000+ call sites).
2. **File DC-008: brand color #4d3bc2 typo.** 46 files. Affects WelcomeKit, SelectProfile, LaunchGurukulApp, PracticeSectionHeader, onboarding-new, etc. Recommended fix: codemod `#4d3bc2` → `$primary-color` (or `#4e3bc2`).
3. **Update DC-005 to four-way conflict.** Add `productionCodeButtonPrimary: "#722ED1"` (which exists as a token alongside `$primary-color`!) — the designer's color is *also* in this codebase, baked in as `$button-primary`. The brand team's choice doesn't just settle a 3-way conflict; it tells us which of FOUR existing production purples is canonical.
4. **Highest-leverage codemod target.** This repo is where token adoption has the biggest impact: codemod the top 5 hardcoded colors (`#fff`, `#3d4d5d`, `#4e3bc2`, `#000`, `#4d3bc2`) to their `$variable` equivalents. ~1,400 hex replacements with **zero pixel change**.
5. **Decide old vs new dashboard before specifying more components.** If `src/newDashboard/*` is the future, all DS specs should target it. If `src/sections/*` is sticking around, both need parallel specs.
