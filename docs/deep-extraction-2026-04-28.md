---
title: Deep Extraction Report
date: 2026-04-28
status: research → action — Phase 1-4 follow-up complete (token expansion + DC tickets + page inventory + newDashboard inventory)
source: repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8
---

# Deep Extraction Report — 2026-04-28

## Phase 1-4 follow-up — completed 2026-04-28

| Phase | Action | Outcome |
|---|---|---|
| 1A | 16 color primitives + 3 semantic aliases added to Figma library | extended neutrals 150–950, primary 150–450 (DC-018 desc on /450), secondary 250/350, surface app-bg, special communication |
| 1B | 3 typography primitives + 6 semantic + Caption/SM text style | font/size/2xs (10), font/weight/black (900), font/lineheight/2xs (14) |
| 1C | 9 radius primitives + 3 new semantic radius tokens | radius/2xl /3xl /4xl × 3 modes; semantic radius/card / radius/container/xl / radius/container/2xl |
| 1D | NEW motion collection (primitives/motion + semantic/motion) | 6 durations + 4 easings + 18 semantic animation presets |
| 1E | DS site foundation pages | /foundations/motion + /foundations/radius enabled (no longer disabled stubs); /foundations/color + /foundations/typography updated with new-token callouts |
| 2 | DC-013 through DC-019 filed | 19 total open tickets; DC-005 upgraded to FIVE-WAY conflict (added fifthVariant #4a3fb4 field, /surfaces/ now renders 5 swatches) |
| 3 | docs/page-inventory-2026-04-28.md | full surface mapping for all 35 routes; identifies parent-hub (53 SCSS modules, 0 docs) as #1 non-student-dashboard target |
| 4 | docs/newdashboard-inventory-2026-04-28.md | 14 atoms + top 30 molecules catalogued; surfaces 8 new DC candidates (DC-020–DC-027) for color sprawl across reds/blues/greens/yellows/oranges |

**Library state after Phase 1:** 12 collections · **444 variables** (was 376, +68) · 16 text styles (was 15, +1) · 5 effect styles · 20 component sets.

**Net-new finding from Phase 4:** the 96.8% color gap from the original extraction is structural — many "unmapped" colors are PROLIFERATIONS of existing system colors. There are 5+ blues, 7+ reds, 7+ oranges, 5+ greens, 5+ yellows in production where the canonical scale has 1 of each. New DC-020 through DC-027 candidates filed in `docs/newdashboard-inventory-2026-04-28.md`.

---

Source-only inventory of the BrightChamps student-dashboard codebase. No data read from the DS site. Every number below comes from `grep`/`find` over the cloned dashboard repo on disk.

---

## TL;DR — what we missed

| Dimension | Documented | Source has | Gap |
|---|---:|---:|---:|
| Pages (top-level routes) | 7 | **35** | **28** |
| SCSS module files | ~21 | **675** | **654** |
| Components in `src/components/` | 14 referenced | **60** | **46** |
| `newDashboard/components/` (atoms + molecules) | 0 fully | **110 dirs** (14 atoms + 96 molecules) | ~108 |
| `newDashboard/components/` total nested | — | **242 dirs** | — |
| Unique colors in source | 16 mapped | **651** | **635 unmapped (96.8%)** |
| Total raw color occurrences (unmapped) | 0 | **1,303** | full sweep needed |
| Unique font sizes | 9 in library | **56** | **47** |
| Unique font weights | 6 in library | 11 | 5 |
| Unique transitions | 0 in library | 20 | 20 |
| Unique animations | 0 in library | 20 | 20 |
| Unique `@keyframes` blocks | 0 in library | **47** | **47** |
| CDN-hosted assets (icons + images) | 0 in library | **765** unique URLs | 765 |
| `_ICON`-suffixed exports in `images.tsx` | 0 in library | **136** | 136 |

**The 21/21 student-dashboard component documentation milestone is real but very narrow.** It covers the inventory CSS-Module prefixes from the Playwright extraction (which only crawled 7 student pages and clustered like-named CSS classes). The actual codebase is **675 SCSS modules across 35 pages** — we documented the visible surface, not the body of work.

---

## 1 · Page inventory

**Total `src/pages/*` routes: 35** (vs. the 7 student pages we extracted).

```
/accounts                       /demo-classes                  /reset-password
/badges                         /demo-dashboard-post           /rewards
/demo-dashboard                 /download-gurukul-app          /student-assessments
/game-dashboard                 /global-feed                   /student-certificates
/launch-gurukul-app             /learn                         /teacher
/login                          /logout                        /teacher-profile
/my-feed                        /nano-skills                   /welcome-kit
/nano-skills/[id]               /nano-skills/course-detail     /year-in-review-2025
/nano-skills/enrichment-classesv2  /nano-skills/my-progress    /next-steps
/nano-skills/skills             /new-refund                    /onboarding
/parent-hub                     /practice-zone                 /redirect-app
/practice-zone/module-detail
```

**Pages we extracted (7):** `my-feed, global-feed, learn, badges, nano-skills, certificates, rewards`.

**Pages we never extracted (28):** `accounts, demo-classes, demo-dashboard-post, demo-dashboard, download-gurukul-app, game-dashboard, launch-gurukul-app, login, logout, nano-skills/[id], nano-skills/course-detail, nano-skills/enrichment-classesv2, nano-skills/my-progress, nano-skills/skills, new-refund, next-steps, onboarding, parent-hub, practice-zone, practice-zone/module-detail, redirect-app, reset-password, student-assessments, student-certificates, teacher-profile, teacher, welcome-kit, year-in-review-2025`.

**`/parent-hub` alone has 53 SCSS modules** — a whole second product surface inside the dashboard codebase, completely undocumented.

---

## 2 · Component inventory

```
src/components/                       60 dirs/files
src/newDashboard/                     19 top-level dirs
src/newDashboard/components/atoms     14
src/newDashboard/components/molecules 96
src/newDashboard/components total     242 nested dirs (depth ≤ 5)
src/sections/                         15 top-level dirs (legacy composed pages)
src/layouts/                          10
TOTAL SCSS module files               675
  newDashboard/                       398
  legacy components + sections        277
```

### `src/components/` (60 entries, 14 documented)

**Documented (14):** Button, Card, Chip, Input, Loader, Login, Modal, NavigationBar, NavigationBarMobile, Popup, ProgressBar, SectionHeader, Timer, plus shared modules.

**NOT documented (46):**
```
AppWrapper, CardImage, CertificateCard, ChatBot, CurrentTime, DemoDashboard,
DropDown, EditContactInformation, ErrorBoundaries, ErrorFallbackUi, FAQ, FlashButton,
Gap, LanguageSelector, LearningExperience, MyRewardsCard, NewExperience, ProjectModal,
Rating, RedeemGemsCard, RedeemRewardsModal, ReferralStatusCard, ResponsePicker,
RewardsReferralCard, RewardsTabs, RewardsWalkthroughCard, Select, SharingButtons,
ShowStarRating, SideBarPopup, SlotPicker, SlotSelector, StarRating, SubscriptionStatusBanner,
SummerCampCard, SwitchProfileItemCard, TeacherDetail, Text, ThirdPartyScripts, TrustPilotSidebar,
TrustpilotPopup, UpcomingCertificateCard, classRatingFeedback, confirmationModal, errorComponent,
filter, toast
```

### `src/newDashboard/` top-level (19)

```
DemoClasses    EnrichmentClasses    NanoSkills      PracticeZone   TeacherProfile
assesment      badges               certificates    components      constants
feed           learn                parentHub       rewards         sections
templates      types                utils           yearInReview
```

SCSS by surface:
- `parentHub`: **53** modules (whole second product, totally undocumented)
- `NanoSkills`: 33
- `learn`: 17
- `templates`: 15
- `badges`: 15
- `DemoClasses`: 10
- `certificates`: 6
- `TeacherProfile`: 6
- `PracticeZone`: 6
- `EnrichmentClasses`: 5
- `assesment`: 3, `sections`: 3, `yearInReview`: 2, `rewards`: 1, `feed`: 1
- `components/` (atoms + molecules): **222** modules

### `src/sections/` (15)

`DemoDashboardPage, DownloadGurukulAppV2, DownloadGurukulOnClassJoiningPage, GameDashboardPage, LaunchGurukulAppPage, NextStepsPage, ProfileSidebarSections, RedirectToGurukulPage, ReferralSection, SelectProfile, SideBarPopup, TeacherProfileSection, WelcomeKit, onboarding-new, resetPassword`

### `src/layouts/` (10)

`AppLayout, DashboardLayout, DemoDashboardLayout, FullScreenLayout, FullWidthLayout, GameDashboardLayout, LayoutProviders.tsx, LoginLayout, OnboardingLayout, pageLayoutConfig.ts`

We documented one (`DashboardLayout`). **9 layouts undocumented.**

---

## 3 · Icon / asset inventory

**No icon library installed.** `package.json` has 48 dependencies — none of `lucide-react`, `react-icons`, `@mui/icons-material`, `material-symbols`. The whole icon system is **CDN-hosted assets** referenced via `src/constants/images.tsx`.

```
src/constants/images.tsx
  Total exported consts:         793
  _ICON / _IMAGE / _LOGO suffix:  217
  _ICON-suffixed specifically:    136

CDN assets by file extension:
  .webp     413
  .svg      230
  .png       84
  .jpg       19
  .gif       19
  ─────────────
  Total     765 unique CDN URLs
```

Sample (first 20 ICON exports):
```
RIGHT_ARROW            LOGO                LOGO_ICON         WHATSAPP_ICON
SETTING_ICON           LOGOUT_ICON         AVATAR_PLACEHOLDER  CARD_IMAGE_PLACEHOLDER
HOME_ICON              HOME_ACTIVE_ICON    RIGHT_ICON         MODULECARD_ARROW
LESSON_COMPLETED       MARK_DONE           VIEW_CLASS_NOTES   CROSS_BUTTON_POPUP
DUE_CALENDER           TAKE_ASSIGNMENT_ICON  TAKE_QUIZ_ICON   LESSON_INPROGRESS
```

**ImageKit URL fragments** (76 files reference `ik.imagekit.io`):
- `/brightchamps/dashboard/` (main asset bucket)
- `/brightchamps/website/` (marketing)
- `/brightchamps/dashboard/referrral-rewards/`
- `/brightchamps/payment_structure`
- `/brightchamps/game_dashboard`
- `/brightchamps/Gurukul-live`
- `/brightchamps/certificate`

**Local `src/newDashboard/components/atoms/Icon` exists** as a wrapper component but doesn't ship icon definitions — it consumes URLs from `images.tsx`.

**Icon system gap:**
- The library currently has zero icon tokens, zero icon components, zero CDN-asset mapping.
- A real Figma icon library would need to mirror the 765 CDN URLs (or at least the 217 with `_ICON`/`_IMAGE`/`_LOGO` semantic naming).
- Highest priority candidates: `LOGO`, `LOGO_ICON`, `HOME_ICON`/`HOME_ACTIVE_ICON`, `LESSON_*` (completed/inprogress/skipped), `RIGHT_ARROW`, `MODULECARD_ARROW`, `AVATAR_PLACEHOLDER`, `CARD_IMAGE_PLACEHOLDER`, `WHATSAPP_ICON`, `SETTING_ICON`, `LOGOUT_ICON`.

---

## 4 · `newDashboard/` gap (the future of the codebase)

**398 SCSS modules in `newDashboard/`. We documented ~9 of them.**

### `newDashboard/components/atoms` (14, all undocumented)

```
DateDropdown, Icon, LoadingIndicator, ProgressBar, ProgressbarWithStar,
SelectedTeacher, ShowStarRating, SideBarPopup, SpeechBubble, TextTruncate,
Tooltip, TruncateText, dropdown, togglebutton
```

We documented `ProgressBar` (the legacy `src/components/ProgressBar` — different file). The newDashboard atoms version is a separate component. Same name, different SCSS, possibly different behavior. **None verified.**

### `newDashboard/components/molecules` (96, all undocumented)

```
AccountValidityLabel, AddMoreClasses, AddMoreClassesV2, AnimatedGems,
Badges&Challenges, BadgesCard, Button, ButtonTag, Calendar, Card, CardImage,
ChecklistForJoiningClass, ClassCardInfo, ClassesToReschedule, ConfirmationModal,
CounsellorCard, CurrentTime, DemoCourseDetailModal, DemoSideBarPopup,
DiamondPurchaseHeader, DiamondReward, DropDown, EditContactInformation,
EditDemoUserForm, EditTimezone, EmptyState, Gap, GetCallBack,
GetCertificateCallBackPreDemo, Input, ... (66 more)
```

There are **two Button implementations** in this codebase: `src/components/Button` (the verified one in our library) and `src/newDashboard/components/molecules/Button` — never inspected. The new-dashboard rewrite has its own Card, ProgressBar, Input, DropDown, Modal-equivalents.

### Atomic-design gap

newDashboard is structured atoms → molecules. There's no `organisms/` directory. The closest organisms are at the surface level (`learn/`, `badges/`, etc.). **The library currently doesn't reflect this hierarchy at all** — Tier 1/2/3 was a Suneet-side classification, not source-derived.

---

## 5 · Unmapped colors — 635 of 651 unique values (96.8%)

**Total unique 6-digit hex values found in `*.module.scss`: 651.**
**Already in the canonical token set: 16.**
**Unmapped: 635.**
**Total raw occurrences of unmapped colors: 1,303.**

### Top 25 unmapped colors (by occurrence)

| Hex | Uses | Files | Likely role | First file (sample) |
|---|---:|---:|---|---|
| `#384655` | 70 | 27 | Dark gray (between neutral/700 #2D3D4D and neutral/600 #3D4D5D) | sections/DemoDashboardPage/.../joinButton |
| `#222a33` | 45 | 22 | Near-black (= source `text-dark-blue` neighbor) | components/LanguageSelector |
| `#8a78f9` | 33 | 17 | Light purple (= `$text-light-purple` in _variables.scss) | sections/DemoDashboardPage/PostDemo/Referral |
| `#bdbdbd` | 28 | 2 | Mid-gray (only 2 files — local convention) | newDashboard/certificates |
| `#424242` | 24 | 16 | Dark gray (= `$dropdown-font-color` in _variables.scss) | components/ProjectModal |
| `#e3e2e9` | 21 | 17 | Light cool gray | — |
| `#f5f4fa` | 20 | 13 | **App-background (`$app-background` in _variables.scss)** — DashboardLayout main bg | — |
| `#8e8e8e` | 18 | 12 | Mid-gray (= `$text-disabled` in _variables.scss) | — |
| `#e0e0e0` | 17 | 8 | Light gray (= ProgressBar production track) | — |
| `#64717d` | 17 | 14 | Mid-cool-gray (= `$notstarted-state-dark`) | — |
| `#f5f3fc` | 17 | 10 | Very-light purple (= `$primary-color-extra-light`) | — |
| `#ffc200` | 16 | 4 | Yellow (close to but not = secondary/500 #FFCE00) | — |
| `#d9d9d9` | 15 | 12 | Light gray | — |
| `#ff752c` | 14 | 11 | **Orange (= `$highlight-color`, also `$skipped-state`)** — should map to warning/500 | — |
| `#1b0742` | 13 | 7 | Very-dark purple (= primary/900 neighbor #20093E) | — |
| `#f0f0f0` | 13 | 11 | Light gray | — |
| `#ffd02b` | 12 | 12 | Yellow (close to secondary/400 #FFD833) | — |
| `#f5f5f5` | 12 | 12 | Very light gray | — |
| `#e1e2ff` | 12 | 11 | Very-light blue-purple | — |
| `#7d8892` | 12 | 11 | Mid-cool-gray (= `$text-gray` in _variables.scss) | — |
| `#eff3f5` | 11 | 9 | Light cool gray (= `$disabled-bg`) | — |
| `#4a3fb4` | 11 | 5 | **5th brand purple variant** (close to #4e3bc2) | — |
| `#2b3742` | 11 | 3 | Near-black (= `$text-dark-black`) | — |
| `#f9cf53` | 10 | 5 | Yellow (= `$communication-course-color`) | — |
| `#f8f9fa` | 10 | 4 | Very light gray | — |

### DC-005 four-way conflict — actual scale

| Hex | Role | Uses | Files |
|---|---|---:|---:|
| `#722ed1` | Designer intent (in library) | **1** | 1 |
| `#4e3bc2` | Production canonical | **218** | **112** |
| `#6651e4` | Production in-progress | 15 | 12 |
| `#4d3bc2` | DC-008 typo | 24 | 13 |

**The codemod must touch ~138 files to migrate brand purple alone.** This is a major-scope migration.

### DC-013/014 candidates (corroborated, but small)

| Candidate | Hex | Uses | Files | Where found |
|---|---|---:|---:|---|
| DC-013a | `#8742ff` (ModuleHeader inner) | 2 | 2 | learn/components/ModuleHeader |
| DC-013b | `#f8c42b` (lockStrip yellow) | 1 | 1 | learn/components/LockedModuleContainer |
| DC-014a | `#238b2e` (4th green) | 1 | 1 | learn/components/LessonList/LeftSectionInList |
| DC-014b | `#e866ff` (assignment magenta) | 1 | 1 | learn/components/LessonList/RightSectionInList |

DC-013/014 are real but small (1–2 uses each). Compared to:
- 70 uses of `#384655` (a dark gray with no token at all)
- 33 uses of `#8a78f9` (`$text-light-purple` — exists in SCSS vars but not in our ledger)
- 21 uses of `#e3e2e9` (a cool-gray with no token)

**The bigger DC tickets aren't DC-013/014. They're the 25-30 colors that have clear neutral/utility roles, are used 10+ times, and have no library counterpart.**

### Recommended new tickets

| ID | Hex | Severity | Why |
|---|---|---|---|
| DC-013 | `#384655` | high (70 uses, 27 files) | Dominant dark-gray with no library token; lives between neutral/700 and neutral/600 |
| DC-014 | `#222a33` | high (45 uses, 22 files) | Near-black title color used by H3s across the dashboard |
| DC-015 | `#8a78f9` | medium (33 uses, 17 files) | `$text-light-purple` — should map to primary/300 (#AA82E3) but ΔE significant |
| DC-016 | `#f5f4fa` | medium (20 uses, 13 files) | `$app-background` — bound to surface/bg/sunken (#F2F2F2) but the lavender tint is lost |
| DC-017 | `#ffc200` / `#ffd02b` | medium (16 + 12 uses) | Two yellows neither matching secondary/500 #FFCE00 nor /400 #FFD833 |
| DC-018 | `#4a3fb4` | medium (11 uses, 5 files) | **5th brand purple** — DC-005 is actually a five-way conflict |
| DC-019 | `#7d8892` / `#64717d` | low (29 uses combined) | `$text-gray` and `$notstarted-state-dark` — should map to neutral/400 / /500 |

---

## 6 · Typography gap

### Font sizes used in production (top 25 of 56 unique values)

```
525×  12px         29×   13px         3×    25px         2×   16.449px
490×  14px         24×   28px         3×    13.7px       2×   13.985px
345×  16px         23×   11px         4×    30px         2×   11.749px
213×  18px         17×   22px         5×    26px         2×   11.223px
148×  20px         15×    8px         6×     9px
118×  10px          9×   15px         7×    40px
109×  24px          8×   23px         8×   ...continues to 56 total values
 44×  32px
```

**56 distinct font sizes in source.** The Figma library has **9** (`xs 12 / sm 14 / md 16 / lg 18 / xl 20 / 2xl 24 / 3xl 32 / 4xl 40 / 5xl 56`). Hits the most common 9 of the top 11 — but misses:
- **10px** (118 uses) — caption / status pill text. **Add `font/size/2xs` = 10.**
- **22px / 28px / 26px** (17 + 24 + 5 uses) — between scale steps; either round to existing or add intermediate.
- **Fractional sizes** (11.223, 11.749, 13.7, 13.985, 16.449) are FINDING-001 (em/rem with non-integer multipliers — confirmed bug, see HANDOFF).

### Font weights in source

```
2135× 800 (heavy use!)
 585× 800
 448× 700
 389× 600
 340× 500
 247× 400
 108× 900
  15× 300
   1× 200
   1× 1000
   1× 100
```

**Library has 6 (300/400/500/600/700/800).** Source uses 11 distinct values — the outliers (200, 100, 1000, 900) are mostly typos or one-off uses. **108 uses of weight 900 (Black)** is the real gap — Nunito Black is loaded by some text styles already; recommend adding `font/weight/black = 900` primitive.

### Line heights — top values

```
304× line-height: normal             63× line-height: 22px
183× line-height: 20px               63× line-height: 16px
173× line-height: 24px               50× line-height: 32px
148× line-height: 120%               35× line-height: 40px
103× line-height: 18px               31× line-height: 130%
 80× line-height: 140%               29× line-height: 28px
```

The library uses absolute pixel line-heights (e.g. lineheight/lg = 27 from 18×1.5). Source heavily uses `120%` and `140%` — different multiplier system. The 1.5× ratio holds for body text but headings use 1.2× / 1.3× / 1.4× in production. **Recommend adding `font/lineheight/tight` = 1.2× variants.**

---

## 7 · Spacing & radius gap

### Border radius — top 25 of source

```
193× 50%                         24×  18px           14× 32px         11× 1rem
154× 20px                        22×  14px           14× 2vw          ...
146× 16px                        21×  50px           13× 100px
129× 10px                        19×  $border-radius-medium  13× 0
127×  8px                        18×  1vw            12× 15px
 91× 12px                        18×  0.5vw
 90× 24px                        16×   5px
 66×  4px                        16×  40px
 61×  6px
 37× 30px
 25× 100%
```

**Library has** primitives at 0/6/8/10/14/9999 + rounded-mode 0/10/14/18/24/9999 + 50%-equivalent via radius/pill. Source uses:
- **20px** (154 uses, no library token) — between 14 and 24, common. Add `radius/container/xl = 20`.
- **16px** (146 uses — `$border-radius-medium`) — bound to radius/container/lg (10) with +6px drift; add a true 16 token.
- **30px / 40px / 50px** (37 + 16 + 21) — all functionally pill at button heights but treated as raw values in source.
- **24px** (90 uses, no token) — between 14 and 9999, frequent on Card/chip-like containers.
- **`$border-radius-medium`** (19 uses as the SCSS var directly) — confirms the var is used inline, not always resolved to its hex.

### Padding — top 15

```
97× padding: 16px           34× 12px           18× 12px 16px      14× 6px 12px
76× padding: 0              32×  8px           18× 0px 0px 30%    14× 4px 10px
59× padding: 20px           28× 4px 8px        15× 15px 0 !i      14× 10px 16px
53× padding: 10px           28× 2px            14× 9px 16px       14× 0 8px
49× padding: 24px           26× 0px !i
42× padding: 8px 24px       25× 0px
                            23× 4px
                            20× 0 16px
```

`8px 24px` (42 uses) is **the Button padding** — bound to space/inset/sm + space/inset/2xl ✓.

`9px 16px` (14 uses) is the **joinNowButton padding** (RightSectionInList) — no exact token (closest: 8 + 16). Drift +1px.

### Gap — top 15

```
252× 8px         49× 24px           18× 25px          13× 0
134× 12px        46× 20px           15× 0px          12× 1px
132× 4px         43×  5px           13× 32px         11× 3px
119× 16px        35× 15px           13× 0.56vw       11× 48px
113× 10px        32× 30px           24×  2px
 56×  6px
```

Library has 4/8/12/16/24/32 as semantic stack. **5px / 6px / 10px / 15px / 20px** are all common but not in the semantic stack. Most likely production drift — engineering used pixel values that *almost* map to a token (10 ≈ 12, 15 ≈ 16, 20 ≈ 24).

---

## 8 · Motion gap

**Currently in library: 0 motion tokens.**
**Source has: 20 transition-rules, 20 animation-rules, 47 unique `@keyframes`.**

### Transition durations + easings

```
33× transition: all 0.2s ease            5× transition: 0.5s
27× transition: all 0.3s ease            5× transition: stroke-dashoffset 0.3s
10× transition: transform 0.3s ease      5× transition: opacity 0.2s ease
10× transition: all 0.3s linear          5× transition: background-color 0.3s ease
 9× transition: transform 0.2s ease      4× transition: width 0.3s ease
 9× transition: none                     4× transition: transform 0.3s ease-in-out
 7× transition: all 0.3s ease-in-out     4× transition: stroke 0.3s
 6× transition: background-color 0.2s    4× transition: fill var(--bezier)
 6× transition: 1s
```

**Two durations dominate: 0.2s and 0.3s.** Both `ease` and `linear` are used. Recommend adding motion tokens:
- `motion/duration/fast = 200ms`
- `motion/duration/base = 300ms`
- `motion/easing/out = ease`
- `motion/easing/linear = linear`
- `motion/easing/in-out = ease-in-out`

### Animations + keyframes

```
Most-used animation rules:
  5× shimmer 1.5s infinite ease-in-out
  5× fadeInUp 0.7s ease-in-out
  4× shimmer 2s infinite linear
  4× shimmer 1.5s ease-in-out infinite
  4× fadeIn 3s
  3× steam 20s linear infinite
  3× slideDown 0.15s ease

47 unique @keyframes (all undocumented):
  fadeIn(8) marquee(5) starStroke(4) starRing(4) starLine(4) starFill(4)
  star-fall-1(4) slideIn(4) slideDown(4) shimmer(4) steam(3) slide(3)
  successContainerSlideIn(2) spin(2) slider(2) slidein(2) slideRight(2)
  scaleIn(2) pulse(2) fadeInUp(2)
  + 27 single-use keyframes (lockUnlock, crownWiggle, tadaAvatar, bubbleUp, etc.)
```

**Highest-priority motion patterns:**
1. `shimmer` (skeleton loading) — 13 total uses — production has 3 different durations (1.5s ease-in-out, 1.5s linear, 2s linear). Should be one canonical shimmer.
2. `fadeIn` / `fadeInUp` (8+5+4 uses) — entrance animation; 0.3s and 0.7s and 3s versions. Should be one canonical with two duration variants.
3. `slideDown` / `slideIn` / `slideRight` (4+4+2 uses) — drawer/menu animations.
4. `starFill` / `starRing` / `starStroke` / `starLine` / `star-fall-1` (4 each) — rating component family. Should be one shared StarRating animation set.

**The library should add a motion collection** with 5–8 canonical keyframes (shimmer, fadeIn, fadeInUp, slideDown, slideIn, scaleIn, pulse, spin) + 4 duration tokens + 4 easing tokens.

---

## 9 · Priority action list

Ranked by impact (most-fixable × highest gap):

1. **`#384655` → DC-013** (70 uses / 27 files) — dominant dark-gray with no token. **First codemod target.**
2. **`#222a33` → DC-014** (45 uses / 22 files) — title color across many H3s.
3. **`#8a78f9` → DC-015** (33 uses / 17 files) — light-purple `$text-light-purple` SCSS var; should resolve to primary/300 or get its own token.
4. **DC-005 four-way → resolve** (`#4e3bc2` = 218 uses across 112 files). The single biggest migration target. Until brand confirms, the codemod is blocked.
5. **Add motion collection** to library (zero coverage today; 47 keyframes in source).
6. **Add `font/size/2xs = 10`** primitive (118 uses, no token, used for status pills + caption text on every page).
7. **Add `font/weight/black = 900`** primitive (108 uses, no token, used for emphatic numbers like score readouts).
8. **Add `radius/container/xl = 20`** primitive (154 uses, currently rounded down or up to nearest token).
9. **Document the 28 unextracted pages** — `parent-hub` alone has 53 SCSS modules and is a second product surface inside the dashboard.
10. **Document the 96 newDashboard molecules** — most of the future codebase lives there. The 21 documented components are mostly legacy `src/components/` and `learn/components/`.
11. **Build an icon-token bridge** — 217 `_ICON`-suffixed CDN assets in `images.tsx`. Library has zero. Even just publishing the 30 most-used as Figma component instances would close a real gap.
12. **Tighten the 56-font-size sprawl** to a 12-step ramp — many of the 56 values are 1–2-px deviations that should snap.

---

## Appendix · Numbers cited (source-verified)

| | |
|---|---:|
| Routes in `src/pages/`               | 35 |
| SCSS modules total                   | 675 |
| SCSS modules in `newDashboard/`      | 398 |
| `src/components/` directory entries  | 60 |
| `newDashboard/components/` total dirs | 242 |
| `newDashboard/components/atoms/`     | 14 |
| `newDashboard/components/molecules/` | 96 |
| `src/sections/`                      | 15 |
| `src/layouts/`                       | 10 |
| Unique 6-digit hex colors in `*.module.scss` | 651 |
| Hex colors mapped to library tokens  | 16 |
| Unmapped colors                      | 635 |
| Unmapped color occurrences (total)   | 1,303 |
| Unique font sizes                    | 56 |
| Unique font weights                  | 11 |
| Unique transition rules              | 20 |
| Unique animation rules               | 20 |
| Unique `@keyframes` blocks           | 47 |
| `images.tsx` const exports           | 793 |
| `_ICON`/`_IMAGE`/`_LOGO` exports     | 217 |
| `_ICON`-only exports                 | 136 |
| Unique CDN URLs (svg/png/webp/jpg/gif) | 765 |

Method: `grep -roh` over `src/**/*.module.scss` for hex/font/spacing/motion. `find` for files. `ls` for directories. No DS-site reads, no Figma calls. Reproducible with the bash blocks at the top of each step in the assignment.
