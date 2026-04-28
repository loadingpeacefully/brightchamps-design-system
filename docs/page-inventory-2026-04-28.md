---
title: Page Inventory
date: 2026-04-28
status: research-only — full route-to-surface mapping
source: repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/pages
---

# Page Inventory — 2026-04-28

Static analysis of all 35 routes in `src/pages/`. Each page is a thin Next.js wrapper that `dynamic()`-imports its real implementation from `@/newDashboard/*` or `@/sections/*`. This inventory traces every page to its surface module and tags by audience and Figma-doc priority.

---

## Summary

| Surface group | Pages | Status |
|---|---:|---|
| Student dashboard (auth-gated, primary product) | **9** | 7/9 partially documented (Tier 1–3 chrome on 7) |
| Parent hub (separate product surface) | **1** | **0 documented**, 53 SCSS modules |
| Demo + onboarding (acquisition funnel) | **5** | 0 documented |
| NanoSkills (sub-product) | **6** | 0 documented |
| Practice zone (sub-product) | **2** | 0 documented |
| Game dashboard (sub-product) | **1** | 0 documented |
| Auth + utility | **5** | 0 documented (mostly out-of-scope) |
| Legacy / static (Year-in-Review, etc.) | **6** | 0 documented |
| **Total** | **35** | **7 of 35** |

---

## Pages we extracted previously (7) — all student dashboard

These were the Playwright-crawled pages that produced `ledger/surfaces/student/*.json`:

| Route | Surface module | Docs status |
|---|---|---|
| `/my-feed` | `@/newDashboard/feed` | Tier 1 chrome documented (DashboardLayout, NavBar, etc.) |
| `/global-feed` | `@/newDashboard/feed` | shared with my-feed |
| `/learn` | `@/newDashboard/learn` | Tier 2 + 3 components documented |
| `/badges` | `@/newDashboard/badges` | partially (ToggleSwitch only) |
| `/nano-skills` | `@/newDashboard/NanoSkills/Pages/Home` | not really specced (wrong route — see below) |
| `/student-certificates` | `@/newDashboard/certificates` | not specced |
| `/rewards` | `@/newDashboard/rewards` | not specced (Tray component documented from a sub-component) |

---

## Pages now analyzed via source (28)

### Student dashboard (auth-gated)

#### `/student-assessments`
- **Surface:** `@/newDashboard/assesment`
- **Layout:** `DashboardLayout` (inherited)
- **Audience:** Student
- **SCSS modules in surface:** 3 (small surface)
- **Priority for Figma docs:** **MEDIUM** — appears in nav but minimal UI
- **Why:** Existing students see this; needs verified token bindings on AssessmentCard component.

#### `/teacher-profile`
- **Surface:** `@/newDashboard/TeacherProfile`
- **Layout:** `DashboardLayout`
- **Audience:** Student (viewing teacher info)
- **SCSS modules:** 6 (TeacherProfileCard, RatingSummary, RatingsAndReviews, HeroBanner, SkeletonLoader)
- **Priority:** **HIGH** — teacher profile is high-touch on student dashboard. Has unique HeroBanner + RatingSummary patterns.
- **Why:** ProfileAvatar instances should compose here; RatingSummary is a candidate for shared component.

### Parent hub (separate product, 0 documented)

#### `/parent-hub` ⚠️ **largest undocumented surface**
- **Surface:** `@/newDashboard/parentHub`
- **Layout:** Inherited (likely `AppLayout` or a parent-specific shell)
- **Audience:** Parent (NOT student — entirely separate user type)
- **SCSS modules in surface:** **53** modules — biggest single surface in the codebase
- **Priority:** **HIGHEST** for non-student work
- **Why:** Parent hub is a complete second product surface. Includes Tabs (PaymentTab, etc.), DemoStudentScreen, payment flows, 53+ unique SCSS files. The DS system currently has zero coverage here.

### Demo + onboarding (acquisition funnel)

#### `/onboarding`
- **Surface:** `@/sections/onboarding-new`
- **Layout:** `OnboardingLayout`
- **Audience:** Pre-student (sign-up flow)
- **SCSS modules:** ~15 (FormScreen, ShippingDetails, ContactInfoForm, teacherSelectionModal, etc.)
- **Priority:** **HIGH** — first-impression funnel; conversion-critical
- **Why:** Form patterns (ShippingDetails, ContactInfoForm) are reusable. teacherSelectionModal is its own pattern.

#### `/demo-dashboard`
- **Surface:** `@/newDashboard/components/atoms/LoadingIndicator` (page is just a loader; real surface is dynamic-loaded below)
- **Layout:** `DemoDashboardLayout`
- **Audience:** Demo student (prospective)
- **SCSS modules in surface:** 10+ (DemoDashboardPage in /sections/, DemoClasses in /newDashboard/)
- **Priority:** **HIGH** — main demo experience
- **Why:** DemoJoiningCard, OtherCourses, SiblingOffer all live here. Different layout than authenticated.

#### `/demo-dashboard-post`
- **Surface:** `@/sections/DemoDashboardPage/PostDemo`
- **Layout:** `DemoDashboardLayout`
- **Audience:** Demo student (post-class)
- **SCSS modules:** 8 (PostDemo, Referral, ReferralCard, RedeemGemsCard, ratings, NegativeFeedback, PositiveFeedback)
- **Priority:** **MEDIUM** — high conversion-value moment
- **Why:** ReferralCard / RedeemGemsCard patterns — uses `#8a78f9` (DC-015) heavily.

#### `/demo-classes`
- **Surface:** `@/newDashboard/DemoClasses`
- **Layout:** `DemoDashboardLayout`
- **Audience:** Demo student
- **SCSS modules:** 10 (DemoJoiningCard with 4 sub-components, OtherCourses, SiblingOffer)
- **Priority:** **MEDIUM**
- **Why:** Class-joining flow shared with student dashboard `ClassDetails` component (already documented).

#### `/next-steps`
- **Surface:** `@/sections/NextStepsPage`
- **Layout:** `OnboardingLayout` or similar
- **Audience:** Post-onboarding student
- **SCSS modules:** small (~3)
- **Priority:** **LOW**
- **Why:** Transitional page; minimal unique UI.

### NanoSkills (Harvard sub-product)

#### `/nano-skills` (index)
- **Surface:** `@/newDashboard/NanoSkills/Pages/Home`
- **Layout:** `DashboardLayout`
- **Audience:** Student
- **SCSS modules:** 33 (NanoSkills is a substantial sub-product)
- **Priority:** **HIGH**
- **Why:** Includes HarvardBanner, FooterCard, SelfPacedHarvardCards. Heavy use of `$communication-course-color` (#f9cf53 — now `color/special/communication`).

#### `/nano-skills/[id]`
- **Surface:** `@/newDashboard/NanoSkills/Pages/DiscoverSkillById`
- **Audience:** Student
- **Priority:** MEDIUM (sub-route of /nano-skills)

#### `/nano-skills/skills`, `/nano-skills/my-progress`, `/nano-skills/course-detail`, `/nano-skills/enrichment-classesv2`
- **Surface:** various NanoSkills sub-pages + `EnrichmentClasses/EnrichmentClassPage`
- **Audience:** Student
- **Priority:** **LOW–MEDIUM** — verify tokens but content-heavy is harder to spec generically.

### Practice zone

#### `/practice-zone` + `/practice-zone/module-detail`
- **Surface:** `@/newDashboard/PracticeZone/pages/Home` + `ModuleSkills`
- **Layout:** `DashboardLayout`
- **Audience:** Student
- **SCSS modules:** 6 (PracticeSectionHeader, milestoneAccordion — already documented as Accordion)
- **Priority:** **HIGH** — milestoneAccordion is here, already in Tier 2 docs but the page-level patterns aren't.

### Game dashboard

#### `/game-dashboard`
- **Surface:** `@/newDashboard/components/FontLoader/PoppinsFont` + `@/sections/GameDashboardPage`
- **Layout:** `GameDashboardLayout` (3rd unique layout)
- **Audience:** Student playing games
- **SCSS modules:** ~10 (GameDashboardPage, MemoryGame, etc.)
- **Priority:** **MEDIUM**
- **Why:** Different visual language (different font: Poppins, not Nunito). Fundamentally a separate surface treatment.

### Auth + utility

#### `/login`, `/logout`, `/reset-password`, `/redirect-app`, `/new-refund`
- **Surfaces:** `@/components/Login`, various
- **Layouts:** `LoginLayout`, `FullScreenLayout`
- **Audience:** Pre-auth or transient
- **Priority:** **LOW** — out of student-dashboard scope. Login is its own surface but shares Button/Input components.

#### `/accounts`
- **Surface:** `@/sections/SelectProfile/NewAccountSelectProfile`
- **Audience:** Multi-student parent
- **Priority:** **LOW–MEDIUM** — uses ProfileAvatar (already documented).

### Legacy / static / promotional

#### `/year-in-review-2025`
- **Surface:** `@/newDashboard/yearInReview`
- **Layout:** `FullScreenLayout`
- **Audience:** Returning student (annual recap)
- **SCSS modules:** 2
- **Priority:** **LOW** — annual one-off; uses #722ED1 designer-intent purple in production (1 of the 1 use of #722ED1 confirmed in deep extraction).

#### `/welcome-kit`
- **Surface:** `@/sections/WelcomeKit`
- **Audience:** New student
- **SCSS modules:** small
- **Priority:** **LOW** — onboarding ancillary.

#### `/teacher`
- **Surface:** `@/newDashboard/components/molecules/TeacherProfile`
- **Note:** Different from `/teacher-profile` — this one is the *molecule wrapper*, not the full surface.
- **Priority:** **LOW** — likely a redirect or stub.

#### `/launch-gurukul-app`, `/download-gurukul-app`
- **Surfaces:** `@/sections/LaunchGurukulAppPage`, `@/sections/DownloadGurukulAppV2`
- **Audience:** Mobile app prompt
- **Priority:** **LOW** — promotional; out of dashboard scope.

#### `/index` (homepage)
- **Surface:** trivially loads `@/components/toast` then redirects.
- **Priority:** **N/A**

---

## Surface breakdown

```
Student dashboard surfaces           7 of 35 routes (20%)
  - Documented in Tier 1–3:          7 partially
  - Components in scope:              learn, badges, certificates, rewards, my-feed, global-feed, nano-skills (broad)
  - Components NOT yet specced:       certificates internals, badges internals, rewards internals

Parent hub                           1 of 35 routes (3%)
  - 53 SCSS modules                  ZERO documented
  - Highest non-student-dashboard priority

Demo + onboarding flows              5 of 35 routes (14%)
  - Different layouts (OnboardingLayout, DemoDashboardLayout)
  - 0 documented; high conversion-value

NanoSkills sub-product               6 of 35 routes (17%)
  - 33 SCSS modules
  - 0 documented; uses unique 'communication' color #f9cf53

Practice zone                        2 of 35 routes (6%)
Game dashboard                       1 of 35 routes (3%)
Auth flows                           5 of 35 routes (14%)
Legacy / static                      6 of 35 routes (17%)
```

---

## Priority action list (page-level)

1. **`/parent-hub`** — 53 SCSS modules, zero docs. Single biggest documentation gap. *Tier 4 candidate.*
2. **`/onboarding`** — conversion-critical funnel. Form patterns reusable across DS.
3. **`/teacher-profile`** — RatingSummary + HeroBanner are reusable patterns.
4. **`/demo-dashboard`** + `/demo-dashboard-post` + `/demo-classes` — demo flow has its own visual identity that's not yet captured.
5. **`/nano-skills`** — 33-module sub-product with unique brand color (communication yellow).
6. **`/student-assessments`** + `/student-certificates`** — student-facing surfaces missing from Tier 1–3 coverage.
7. **`/practice-zone/module-detail`** — uses milestoneAccordion (specced) but page-level patterns aren't documented.

---

## Method note

Each page in `src/pages/` was inspected for:
- `dynamic(() => import(...))` calls — captures the real surface module
- direct `import` statements with `@/newDashboard/*`, `@/sections/*`, `@/components/*`, `@/layouts/*` patterns
- the JSX tree at the page level (usually 1–2 components)

The surfaces themselves were mapped to their primary directory, with SCSS-module counts pulled from the deep extraction (`docs/deep-extraction-2026-04-28.md`).

No live DOM crawl was performed — that requires Playwright auth and is blocked on session cookies for non-student surfaces.
