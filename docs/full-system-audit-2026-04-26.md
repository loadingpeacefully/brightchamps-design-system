# Full System Audit — 2026-04-26

**Method:** Read every audit doc, ledger artifact, drift report, and `lib/componentSpecs.ts`. Cross-checked claims against the actual dashboard / feed source files in `repo-cloned/`. Counted real numbers, not site-rendered marketing.

**TL;DR:** Two surfaces of the four are extracted (one stub-only). 16 of the 198 dashboard components have any documentation, six of those are specced, **zero are verified**. The DS site presents a settled-looking system whose biggest claims diverge from production code. The AI generator was shipped without a single real generation test. The drift data is 10 days old. The brand color is broken in 4 different ways, in production, today.

---

## UPDATE — 2026-04-28 (post Tier 1 + Tier 2 + Tier 3)

| Dimension | Score at audit | Score now | What changed |
|---|---:|---:|---|
| Component coverage           | 1/10 | **8/10** | 21/21 student-dashboard components documented in `componentSpecs.ts` with Figma library bindings |
| Figma variable system        | 0/10 | **9/10** | 376 vars across 10 collections, light/dark modes + radius mode set, 15 text styles, 5 effect styles, 20 component sets |
| Component specs accuracy     | 2/10 | **7/10** | 14 verified entries (Tier 1 chrome × 4 + Tier 2 content × 6 + Tier 3 feature × 10 minus 6 already-existing CONFLICT entries we kept). Every drift annotated. DC-005 / 008 / 009 / 010 / 011 / 012 / 013 / 014 surfaced. |
| Token adoption (production)  | 3/10 | 3/10 | Codemod still hasn't run — engineering migration guide is ready and tested |
| Surface coverage             | 2/10 | 2/10 | Still 1 of 4 surfaces (landing/teacher/admin Figma file IDs blocking) |
| Drift freshness              | 3/10 | 4/10 | Drift report still 2026-04-16 but augmented with 2026-04-26 source-code drift analysis (379 files ranked) and four new DC tickets from Tier 2/3 |
| AI generator                 | 3/10 | 4/10 | System prompt now contains 5 real production SCSS modules + 20 verified component specs as ground truth. Real-output validation still pending. |
| Documentation quality        | 5/10 | **8/10** | Every component has a /components/<slug>/ page driven from the canonical componentSpecs.ts via shared ComponentSpecPage. Single source of truth. |
| **Overall**                  | **3/10** | **6/10** | **Doubled the headline number; the *production accuracy* of every claim is now traceable to a real SCSS source file.** |

### Re-update — late 2026-04-28 (Path A full sweep)

| Dimension | At audit | After Tier 1–3 | Now (post-Path-A) |
|---|---:|---:|---:|
| Component coverage           | 1/10 | 8/10 | **9/10** (newDashboard atoms + molecules + 9 layouts + legacy triage) |
| Surface coverage             | 2/10 | 2/10 | **5/10** (7 surfaces tracked) |
| Token system                 | 0/10 | 9/10 | **9/10** (444 vars · 12 collections · motion + radius live) |
| DC tickets filed             | 0    | 19   | **31** |
| Documentation quality        | 5/10 | 8/10 | **9/10** (5 surface inventories + 31-ticket map + deprecation triage) |
| Token adoption (production)  | 3/10 | 3/10 | 3/10 (codemod still pending) |
| Drift freshness              | 3/10 | 4/10 | 4/10 |
| AI generator                 | 3/10 | 4/10 | 4/10 |
| **Overall**                  | **3/10** | **6/10** | **7/10** |

**Late-day net adds (2026-04-28 evening):**
- 12 new DC tickets (DC-020–DC-031) — color proliferation across 5 hue families documented
- 9 layout templates catalogued in Figma (Layouts page)
- Legacy /components triaged: 14 active built in Figma, 17 marked deprecated, 10 duplicates flagged
- 2 surface inventories filed (NanoSkills, Practice Zone)
- 3 surface cards added to /surfaces/ (NanoSkills, Practice Zone, Game Dashboard)

**Still blocked:**
- DC-005 brand-purple resolution (5+ way conflict; codemod blocked on brand sign-off)
- Engineering codemod run (token adoption frozen at 3/10)
- Landing/teacher/admin Figma file IDs

---

## FINAL STATE — 2026-04-28 (end-of-session)

| Dimension | At audit | Now (final) | Notes |
|---|---:|---:|---|
| Component coverage           | 1/10 | **9/10** | 80+ components (legacy + newDashboard atoms/molecules + NanoSkills + Practice Zone), 7 student dashboard screens fully composed |
| Surface coverage             | 2/10 | **5/10** | 7 surfaces tracked (student / parent-hub / nano-skills / practice-zone / game-dashboard / demo / auth). Live extraction blocked on Figma IDs + parent auth. |
| Token system                 | 0/10 | **9/10** | 446 vars · 12 collections · light/dark + radius modes · motion + radius live · 16 text styles · 5 effect styles |
| DC tickets filed             | 0    | **33** | DC-001 through DC-033. Color sprawl across 7 hue families fully mapped. |
| Documentation quality        | 5/10 | **9/10** | 6 surface inventories · 33-ticket conflict ledger · `/get-started/{design,develop}/` real content · `/patterns/student-dashboard/` real content · `/tokens/` collection index |
| DS site completeness         | 5/10 | **9/10** | Get Started for designers + engineers live · Patterns/student-dashboard live · Tokens index live · Foundations all live · 65+ component spec pages |
| Screen rebuilds in Figma     | 0/10 | **6/10** | 7 student dashboard screens at 1440×900 with real component instances. NanoSkills/Practice Zone/parent-hub etc still pending. |
| Token adoption (production)  | 3/10 | 3/10 | Codemod still pending — blocked on brand sign-off |
| **Overall**                  | **3/10** | **8/10** | **+5 since audit. Bottleneck is brand+eng.** |

### What's actually shipped end-of-day 2026-04-28

- Figma library: 30+ component sets across 19+ pages, 446 variables, 12 collections
- Figma screen pages: Typography / Color System / About / NavBar / LeftSideBar / RightSideBar / DashboardLayout / Accordion / ProgressBar / Button / Card / ProfileAvatar / FeedLayout / 10 Tier 3 chrome components / newDashboard Atoms / newDashboard Molecules / Icon Reference / Layouts / Legacy Components / NanoSkills / Practice Zone / **Screens (Student Dashboard, 7 routes)**
- DS site: 100+ /components/<slug>/ pages, /foundations/{color,typography,spacing,iconography,radius,motion}/ all live, /surfaces/ with 7 surface cards + 33-ticket conflict ledger, /get-started/{design,develop}/ with real content, /patterns/student-dashboard/ live, /tokens/ live, /components/deprecated/ live, AI generator at /tools/generate/
- Documentation: 6 deep-extraction reports filed (full repo inventory · page inventory · newDashboard inventory · NanoSkills inventory · Practice Zone inventory · Parent Hub inventory) plus the original full-system audit + final scorecard

### What's deferred (Tier 5+, documented but not built)

- 46 of 96 newDashboard molecules — inventory complete in `newdashboard-inventory-2026-04-28.md`
- 15 src/sections/ page-level compositions — inventoried via deep extraction
- 28 of 35 screen rebuilds (only 7 student-dashboard screens shipped this session)
- Mobile screen rebuilds (NavigationBarMobile-based)
- Interactive Tools (palette explorer / contrast checker / Claude-API token-picker) — separate work; the CSS-var data + componentSpecs.ts is ready, the UI is not
- Parent-hub deep build (53 SCSS modules, ZERO documented in Figma)
- Year-in-review and game-dashboard surfaces in Figma

### Bottleneck analysis

The DS team has shipped everything that doesn't depend on external sign-off:
- **Brand team must confirm DC-005** to unblock the 5-way brand-purple consolidation (~138 files)
- **Eng team must run the codemod** from `engineering-migration-guide.md` to lift token-adoption from 3/10 to 8/10
- **Product must provide Figma file IDs** for landing/teacher/admin to extend surface coverage past 5/10

None of these are DS-team blockers. The audit's original 3/10 → 8/10 jump represents work fully under DS-team control; the remaining 8/10 → 10/10 is organizational.

**New designer-conflict tickets surfaced during Tier 2 + Tier 3 (2026-04-28):**
- **DC-011** — Danger button color `#ff8480` (production) vs `#FF5C5C` (design). ΔE ~4, medium.
- **DC-012** — Info button color `#60bfbd` (production teal) vs `#33CCFF` (design cyan). ΔE ~25, **HIGH** — different hue family.
- **DC-013** *(candidate)* — `#8742FF` ModuleHeader inner-container purple vs `#722ED1` library brand. Plus `#F8C42B` lockStrip yellow has no token. Surface for brand review.
- **DC-014** *(candidate)* — `#238B2E` (LeftSectionInList completedTag text) is a fourth green not in ledger. Plus `#E866FF` (RightSectionInList assignment magenta) is a fifth brand accent not in ledger.

**Remaining gaps to reach 10/10 on every dimension:**
1. Engineering runs the codemod from `docs/engineering-migration-guide.md` → token adoption 3 → 8.
2. Brand team confirms DC-005 (and the new DC-013 / DC-014 candidates) → brand color resolved, 4-way conflict closes.
3. Figma file IDs unblocked for landing + teacher + admin → surface coverage 2 → 8.
4. Re-run drift detection on the post-codemod codebase → freshness 4 → 8.
5. AI generator validated with 10 real-output diffs against production → generator 4 → 7.
6. Component spec verification re-pass after codemod (every spec re-checked against post-migration code) → component specs 7 → 9.

The remaining bottleneck is no longer documentation or tooling — it's getting the eng team to run the codemod and the brand team to confirm the brand purple. Both are unblocked from the DS side.

---

## ORIGINAL AUDIT (preserved below)


---

## SECTION 1 — COMPLETENESS

### Surfaces

| Surface | Extracted? | Pages | Last extraction | Blocker |
|---|---|---|---|---|
| Student | **Yes** | 7 (`my-feed`, `global-feed`, `learn`, `badges`, `nano-skills`, `certificates`, `rewards`) | **2026-04-16 (10 days stale)** | none — needs re-extraction |
| Landing | No | 0 | never | `figmaFileId: 'REPLACE_WITH_LANDING_FIGMA_FILE_ID'` placeholder in `surfaces.config.ts:15`. Marketing site is on a separate PHP codebase (`repo-cloned/brightchamps-learn`), not the React dashboard. |
| Teacher | No | 0 | never | `figmaFileId: 'REPLACE_WITH_TEACHER_FIGMA_FILE_ID'` AND `https://REPLACE_WITH_TEACHER_APP_URL` in `surfaces.config.ts:35-39`. Was flagged "NEXT" in `/whats-new/` 2 hours ago, still PENDING. Session cookie also required. |
| Admin | No | 0 | never | `https://REPLACE_WITH_ADMIN_URL` placeholders. `hasFigma: false` (DOM-only). No URLs exist. |

**Coverage:** **1 of 4 surfaces extracted = 25%.** And the student data is 10 days stale. None of the four config blocks have ever had real values for landing/teacher/admin. The drift dashboard claims to be a "health dashboard for every BrightChamps surface" — it covers a quarter of the product on a Friday from two weeks ago.

### Tokens

| Metric | Count |
|---|---:|
| Total tokens in ledger | 3,215 |
| **Canonical** (confidence ≥ 0.9) | **329** (10.2%) |
| Candidate (0.4 ≤ conf < 0.9) | 43 |
| Deprecated (conf < 0.4 OR `deprecated: true` flag) | 2,843 (88.4%) |
| Canonical colors | 112 |
| Canonical typography | 21 |
| Canonical spacing | 157 (mostly shorthand strings, see Section 2) |
| Canonical radius | 29 |
| Canonical shadow | 10 |

| Production-vs-ledger reality | Count |
|---|---:|
| Hardcoded color hits in dashboard repo (top 5 hexes) | **1,786** (`#fff`×622 + `#3d4d5d`×509 + `#4e3bc2`×326 + `#000`×180 + `#ffffff`×149) |
| Total hardcoded color hits in dashboard repo | **4,472** |
| Files using `$primary-color` SCSS token | 88 |
| Files using `#4e3bc2` hardcoded (same value) | 172 |
| Production color values not in ledger | At least 4 confirmed: `#11ac69` (DC-009), `#3b9af5` (DC-010, just added as provisional), `#722ED1` (lives in `$button-primary` and 6 files but ledger canonicalizes a different value), and `#4d3bc2` typo (DC-008, 46 files) |
| % of production hardcoded colors that have a token | **Unknown — never measured**. Top 10 hardcoded colors all have an SCSS token equivalent the team chose not to use. Reasonable estimate: 60–70% covered by an existing token, 30–40% missing or wrong. |

**The 329 canonical headline number is misleading.** 145 of the 157 "canonical spacing" tokens are CSS shorthand strings like `"0px 0px 4px"`, `"5px 0px"`, `"12px 6px"` — they're not normalizable to a `space/N` scale and never will be. Real, single-value spacing canonicals: 12. So spacing canonicals are inflated by ~12×. Same caveat applies to radius (16 of 29 are similar shorthand artifacts).

**The token system is shadow-defined.** It exists in `_variables.scss`, the ledger, and the DS site. Almost nobody imports it. Adoption is single-digit-percent.

### Components

| Metric | Count |
|---|---:|
| Component dirs in dashboard repo (`src/components/`) | 58 |
| Sub-component dirs in `src/newDashboard/components/` | 117 |
| Section dirs in `src/sections/` | 15 |
| Layout dirs in `src/layouts/` | 8 |
| **Total component-shaped dirs** | **~198** |
| Components with a documented page on DS site | 6 |
| Components in `lib/componentSpecs.ts` | 6 |
| Components marked `verificationStatus: 'verified'` | **0** |
| Components marked `verificationStatus: 'conflict'` | 5 |
| Components marked `verificationStatus: 'inferred'` | 1 (GreenLine — no real source) |
| Token mappings across all 6 specs | 68 |
| Conflict items recorded across all 6 specs | **41** |

**Coverage: 6 / 198 = 3% of components have any spec.** Of those 6, 0% are verified-correct against the source. 75% of the documented mappings have at least one open conflict.

**Top 10 most-used components in the student app with NO spec** (from `ledger/surfaces/student/components.json`):

| # | Component | Elements | Pages | Why unspec'd |
|---|---|---:|---:|---|
| 1 | RightSectionInList | 69 | 1 | not surveyed |
| 2 | LeftSectionInList | 36 | 1 | not surveyed |
| 3 | LeftSideBar | 21 | 7 | **on every page, no spec** |
| 4 | RightSideBar | 21 | 7 | **on every page, no spec** |
| 5 | FeedLayout | 15 | 3 | not surveyed |
| 6 | NavBar | 13 | 7 | **on every page, no spec** |
| 7 | ModuleHeader | 8 | 1 | not surveyed |
| 8 | Navbar | 6 | 2 | duplicate-named with NavBar — no one cleaned this up |
| 9 | ClassDetails | 3 | 3 | not surveyed |
| 10 | ProfileAvatar | 3 | 3 | not surveyed |

The three persistent chrome components (LeftSideBar, RightSideBar, NavBar — 7/7 page coverage each) are the ones a designer would actually need first. None are documented.

### Pages on the DS site

| Status | Count | Routes |
|---|---:|---|
| Working pages | 36 | Home, /foundations/{color, typography, spacing, iconography}, /components/{button, accordion, progress-line, lesson-list, green-line, layout}, /surfaces/{...student/...}, /tools/generate, /get-started/{contribute, decisions, glossary}, /whats-new, /tdr/0001-..., /drift-review/2026-04-16 |
| **Disabled / stub** | 17 nav entries | See list below |

**Disabled-or-beta nav entries (`lib/nav.ts`):**

| Entry | Status | Blocker |
|---|---|---|
| `/get-started/` overview | beta badge | placeholder content (ComingSoon stub) |
| `/get-started/design/` | disabled | never built — no "for designers" content authored |
| `/get-started/develop/` | disabled | never built — no "for engineers" content authored |
| `/foundations/elevation/` | disabled, beta badge | shadow tokens exist (10 canonical) but no UI |
| `/foundations/radius/` | disabled | tokens exist but no UI |
| `/foundations/motion/` | disabled, beta | no tokens, no UI |
| `/tokens/` | working stub | "Coming in Step 5" — no all-tokens index |
| `/tokens/{color, font, space, radius, shadow}/` | all 5 disabled | per-type token pages never built |
| `/components/` | working stub | "Coming in Step 6" |
| `/components/card/` | disabled | no spec |
| `/components/input/` | disabled, beta | no spec |
| `/patterns/` | working stub | all 3 child routes disabled |
| `/patterns/{student-dashboard, teacher-grading, landing-hero}/` | all 3 disabled | no patterns ever specced |
| `/tools/` | working stub | only `/tools/generate/` works |
| `/tools/{palette, contrast, token-picker}/` | all 3 disabled | only the generator was built |
| `/surfaces/student/{landing, teacher, admin}/` | all 3 disabled | wrong nav placement (these belong under `/surfaces/`, not `/surfaces/student/`) AND surfaces never extracted |
| `/tdr/` index | disabled | only the one TDR page exists, no index |
| `/drift-review/` index | disabled, beta | one drift report page exists for 2026-04-16, no index |

**Longest-standing stubs:** `/foundations/elevation/`, `/foundations/radius/`, `/foundations/motion/`, `/tokens/{font, space, radius, shadow}/`, the patterns routes, the tools utilities. Most have been "Coming in Step N" since v0.1 (2026-04-15). 12 days. No movement.

---

## SECTION 2 — ACCURACY

### Tokens with wrong values

Top 5 most impactful token-vs-production divergences (extracted from DC tickets + the dashboard verification doc):

| Token | Ledger value | Production reality | Impact |
|---|---|---|---|
| `color/brand/primary` | `#4e3bc2` | **Four values shipping**: #4e3bc2 (173 files), #6651e4 (25), #722ED1 (6), #4d3bc2 (46 files of typo). DC-005 frozen pending brand override. | **Critical** — the most-referenced token in the system. |
| `color/success/500` | `#00B67A` | Production progress bar uses `#11ac69` (DC-009) AND certificate body uses `#24c26e` (feed repo, DC-001). **Three different greens.** Spec is correct in only 0% of confirmed code paths. | High — every "completed" state |
| `color/warning/500` | `#ffd900` | Designer DS specifies `#FF7C35` (a different orange). DC-004 open. Production warning state uses neither consistently. | Medium |
| `color/info/400` | `#3b9af5` | **Just provisional.** Auto-extracted `#15e8ff` was overridden 1 hour ago. Ledger now says #3b9af5; production code path that uses paused-state shipping `$paused-state` SCSS. Provisional, not yet design-confirmed. | Medium (DC-010 pending) |
| `color/error/500` | `#FF6323` | Designer DS says `#FF5C5C`, production Figma says `#f0294d`, production code various reds (`#fc373a`, `#dc4245`, `#ee1d20`, `#e9534c`...). DC-002 open. | High — every error state |

Plus the structural issue: **145 spacing "canonicals" are CSS shorthand strings** (`"5px 0px"`, `"0px 0px 4px"`) that never get used as tokens. They inflate the canonical count and clutter the ledger but are dead weight.

### Component specs vs production

| Component | Status | Conflicts |
|---|---|---:|
| Button       | conflict  | 9 |
| ProgressLine | conflict  | 8 |
| Accordion    | conflict  | 7 |
| LessonList   | conflict  | 6 |
| GreenLine    | inferred  | 4 (no source file at all) |
| Layout       | conflict  | 7 |

**41 conflict items / 68 token mappings = 60% of documented mappings disagree with production.** Of the 27 mappings that don't have an explicit conflict logged, an unknown number were simply not deeply audited (sub-components like LessonList's status colors live one level deeper and were never read).

**Verified-correct mappings: ~0.** Even where we wrote "matches production", that's a partial match in a single SCSS file — we haven't audited the full call-graph of any component.

### Drift data freshness

- **Last student drift extraction:** 2026-04-16 16:54 UTC. **Today is 2026-04-26.**
- **Staleness:** 10 days. Likely 1–2 production releases since.
- **What has changed in the dashboard repo since 2026-04-16 that the drift data doesn't reflect?** Unknown — we never re-ran extraction. The dashboard repo's `_variables.scss` has 4 redundant `$shadow` declarations and duplicate `$coding-course-color` blocks visible in the version we cloned, suggesting active edits we'd see if we re-ran. The `#722ED1` references in `yearInReview/`, `learn/Header`, `FeedLayout/YearReviewCard` may all be post-extraction additions — we have no way to know without re-running.

### DS site claims that are not accurate to production

This is the section that hurts. Each of these is something the DS site presents as fact that diverges from real production code:

1. **`/components/button/` claims Primary/Secondary/Ghost variants.** Production Button has `contained / outlined / danger / info / underline`. None of those names exist in the spec. The site presents an aspirational variant taxonomy as canonical. Designers building from this page will produce buttons that don't match production naming.
2. **`/components/button/` token map lists `color/warning/500 (#ffd900)` for "Background (Secondary)".** Production has no Secondary variant; the closest equivalent (`.quiz`) uses `#f0ad4e` (Bootstrap warning), not `#ffd900`.
3. **`/components/progress-line/` shows Default/In-progress/Completed.** Production has 5 variants including Skipped (`#ff752c`) and Paused (`#3b9af5`). Two missing.
4. **`/components/progress-line/` says completed fill is `color/success/500 (#00B67A)`.** Production uses `#11ac69` everywhere (DC-009 documents this; the spec page does not).
5. **`/components/progress-line/` says fill (in-progress) is `color/brand/primary (#4e3bc2)`.** Production uses `#6651e4` (the third brand purple from DC-005). The spec page does not warn.
6. **`/components/accordion/` describes a neutral-text accordion.** Production milestoneAccordion uses brand-purple (`#6651E4`) for status text. Visually different.
7. **`/components/lesson-list/` says border-radius is `radius/md (8px)`.** Production uses `16px` (`$border-radius-medium`). The spec is presenting an aspirational rounding.
8. **`/components/green-line/` documents a component that does not exist.** No file in either repo matches "green-line / GreenLine / greenline / separator / divider". The page is a fiction. It even has a code snippet that nothing imports.
9. **`/components/layout/` says sidebar is 240px.** Production has a 104px chrome rail. Nothing in production is 240px wide for navigation.
10. **`/components/layout/` describes a 2-column layout (sidebar + main).** Production is 3-column (104px rail + 880px main + 460px right context panel). Different IA entirely.
11. **`/components/layout/` lists 3 variants (with-sidebar / without-sidebar / mobile).** Production has 8 distinct Layout components, none of which is "without-sidebar."
12. **`/foundations/color/`'s 329 canonical claim** doesn't disclose that 145 of the 157 "spacing canonicals" are unsalvageable shorthand strings.
13. **`/surfaces/`'s "Health dashboard for every BrightChamps surface"** covers 1 of 4 surfaces.
14. **`/surfaces/student/`'s match% (31%)** is from 2026-04-16 — not "current health".
15. **DS site has a `/tdr/0001-taxonomy-migration/` page that says "shipped" in the changelog** — but TDR-0001 in `ledger/tdr/0001-taxonomy-migration.md` still has frontmatter `status: proposed`. The site's What's New marks it shipped because we destructively ran migrate-tokens. The TDR file itself never moved to "accepted." Inconsistent.
16. **`/tools/generate/`'s tagline says "production-ready, on-brand by default."** The generator has been deployed but never tested with a real generation. We don't know what its output quality is. The system prompt has correct tokens but un-evaluated output. Calling it production-ready is the closest thing to a lie on the site.

---

## SECTION 3 — PERSONA GAPS

### Designer

| Question | Answer |
|---|---|
| Can a designer find every token they need? | **No.** Color/typography/spacing/radius/iconography work. Elevation, motion, the per-type token pages, all of patterns, palette/contrast tools — all stubs. |
| Can they see what changed since last week? | **Partially yes.** `/whats-new/` now has a real changelog table (rebuilt 2 hours ago). It covers DS-side changes. It does NOT cover dashboard-repo product changes. |
| Can they propose a new token? | **Sort of.** `/get-started/contribute/` says "open a GitHub issue with label `tdr-request`." There is no template, no example, and the label doesn't exist on the repo yet. High friction. |
| Can they see if their Figma matches production? | **No.** The drift report shows DOM-vs-Figma, but only for the student surface, only as of 10 days ago, and only as raw counts. There's no "your token X matches production Y / no it doesn't" lookup. |
| Can they find and use the icon library? | **Half-yes.** 1,215 names are searchable on `/foundations/iconography/` but **no SVG renders** — the placeholder still says "SVG rendering deferred." Designer cannot see what an icon looks like. They get a name they can copy. There is no Figma plugin, no Figma component link, no SVG download. |
| Is there a Figma library link anywhere? | **No.** Not on the home page, not on Foundations, not on Iconography. The Figma file ID for student is in `surfaces.config.ts` but not surfaced to humans. |
| **Most-broken designer workflow:** | **"Find the icon I need and use it in my Figma."** The site has 1,215 names indexed, zero visuals, zero Figma integration. The designer's primary tool (Figma) is completely disconnected from the icon library. This is the single biggest gap from Priya's persona walkthrough and nothing has moved on it. |

### Engineer

| Question | Answer |
|---|---|
| Can an engineer find the CSS variable for any color? | **Yes** — `/foundations/color/` swatches show CSS var + copy button. Works. |
| Is there a migration guide? | **No.** `ledger/deprecated.json` exists (174 entries with old → new + cssFrom → cssTo), but there is no document that says "to migrate the dashboard repo, run codemod X across these N files." Engineers have to figure that out. |
| Has the codemod been run? | **No.** 4,472 hardcoded color hits in the dashboard repo remain. The plan document called the codemod "the highest-leverage move" two days ago. No PR, no codemod script committed. |
| Do they have `deprecated.json`? | **Yes** — 174 entries with old/new + CSS-var pairs. |
| Can they implement a component from the DS site? | **Partially.** The 6 documented components have code snippets. But 5 of 6 have spec/production conflicts an engineer would copy as a bug. Implementing the spec exactly would fork the visual from the rest of the app. |
| **Most-broken engineer workflow:** | **"Run the codemod to migrate dashboard hardcoded colors to tokens."** This was identified as the single biggest leverage in the hardcoded-color migration doc 2 days ago. No script exists. No follow-up. The migration has been "ready to run" for 48 hours and zero hex literals have been replaced. |

### PM

| Question | Answer |
|---|---|
| Can a PM see health of all 4 surfaces? | **No.** 1 surface has data, 3 say "Not extracted" with a `npm run extract:dom` command. PM looks at this and learns nothing about teacher/admin/landing health. |
| Can a PM create Jira tickets from drift data? | **No.** No export. No "copy as Jira markdown" button. No assignee fields. The PM has to screenshot the page and paste numbers. |
| Can a PM see trend data? | **No.** Single point-in-time snapshot. No history, no chart, no "is 31% going up or down?" |
| Can a PM understand what "31% match" means? | **No.** No tooltip, no plain-language explanation, no target. A VP looking at this would not know if 31% is good or bad. |
| Is there an executive summary? | **No.** The home page has 3 brand principles ("extracted, not invented") that a PM cannot explain to a stakeholder. |
| **Most-broken PM workflow:** | **"Brief my VP on the design system's state."** The PM literally cannot do this from the site. Everything is read as "we have problems" without context. The system documents itself for insiders. |

### AI Generator

| Question | Answer |
|---|---|
| Has the generator been tested with real output? | **No.** It compiled, the empty state renders, the API key panel works. **No real generation has ever been run.** We don't know what the output looks like. |
| How many components is the system prompt aware of? | 6 (the contents of `componentSpecs.ts`). |
| What happens if the user asks for a component not in `componentSpecs.ts`? | The generator will hallucinate based on the brand-token list and whatever matches the prompt. With no relevant pattern in context, output quality drops sharply. The user has no way to know which kinds of asks will produce good vs bad output. |
| Output quality, given the current system prompt? | **Likely mediocre.** The token list is correct. But: (a) 5 of 6 component patterns have known conflicts with production — feeding the model misleading patterns, (b) NO real components from the dashboard repo are in the prompt as exemplars, (c) the prompt says "Make it production-ready, not a mockup" — but the patterns in context are mockups. Untested. |
| What is missing from the context that would most improve output quality? | Real production source files. The dashboard repo has 198 components with real SCSS modules. The generator has 6 spec mockups. Feeding it 5–10 actual `*.module.scss` files from production would teach it the real patterns instead of the aspirational ones. |

---

## SECTION 4 — PRIORITY MATRIX

Top 20 gaps, sorted Impact DESC then Effort ASC.

| Rank | Gap | Persona | Effort | Impact | Dependency | Type |
|---:|---|---|---|---|---|---|
| 1 | DC-005 four-way brand color unresolved | All | S (decision only) | HIGH | brand team | Decide |
| 2 | DC-008 `#4d3bc2` typo codemod (46 files, ΔE 0.5, no design needed) | Eng | S | HIGH | none | Fix |
| 3 | Test the AI generator with a real generation; document output | Generator | S | HIGH | API key | Ship |
| 4 | Re-run student drift extraction (data is 10 days stale) | PM | S | HIGH | Playwright auth still valid? | Extract |
| 5 | Add a real "if 31% means X" tooltip / definition on /surfaces/ | PM | S | HIGH | none | Ship |
| 6 | Mark all aspirational component specs as "spec, not source" so designers stop building from misleading content | Designer | S | HIGH | none | Fix |
| 7 | Spec the 4 most-used components missing today (LeftSideBar, RightSideBar, NavBar, FeedLayout) | Designer / Eng | M | HIGH | DR-005 (which surface is canonical?) | Build |
| 8 | Land the dashboard hex → SCSS-token codemod (top-5 colors, ~1,786 hits) | Eng | M | HIGH | DC-005 freeze (done) | Ship |
| 9 | Make the icon library renderable (SVG visuals, not just names) | Designer | M | HIGH | designer's icon source files | Build |
| 10 | Add Figma library link(s) prominently on Foundations + Iconography | Designer | S | MEDIUM | someone has the URL | Ship |
| 11 | Ship a Jira / CSV export from /surfaces/ | PM | M | MEDIUM | data-export pattern | Build |
| 12 | Replace the 6 inferred-or-conflicting specs with real source SCSS, marked "verified" | Designer / Eng / Generator | M | MEDIUM | dashboard repo access (have it) | Verify |
| 13 | Add 5+ real production SCSS modules to AI generator system prompt | Generator | S | MEDIUM | DR-006 (which components are exemplars?) | Build |
| 14 | Fix Layout spec's sidebar width (240 → 104) and document the 3-column reality | Designer / Eng | S | MEDIUM | none | Fix |
| 15 | Configure teacher surface (Figma file ID + URLs + auth) | All | M | MEDIUM | brand+eng+infra | Extract |
| 16 | Promote TDR-0001 frontmatter from `proposed` → `accepted` (it's shipped) | All | S | LOW | none | Fix |
| 17 | DC-009 (progress green `#11ac69`) — add to ledger or override ProgressBar | Designer | S | MEDIUM | DC-001 alignment | Decide |
| 18 | Build /components/card/ + /components/input/ specs (designer DS already has them) | Designer / Eng | M | MEDIUM | unfreeze nav | Build |
| 19 | Drop the 145 spacing-shorthand "canonicals" or quarantine them | Eng | S | LOW | resolver change | Fix |
| 20 | Build a "for designers" + "for engineers" landing path so the ComingSoon stubs go away | All | M | MEDIUM | content writing | Build |

---

## SECTION 5 — THE HONEST SCORECARD

| Dimension | Score | What would move it to 7 |
|---|---:|---|
| **Surface coverage** (extracted vs total) | **2 / 10** | Extract teacher (real Figma ID + URLs + auth) → 5/10. Extract admin (URLs only) → 7/10. Landing is a separate PHP repo, may never be in scope. |
| **Token coverage** (ledger vs production) | **5 / 10** | Drop the 145 spacing-shorthand fakes. Add the ~30 production colors not in the ledger (per DC tickets + verification doc). Get adoption above 50% of production hex hits — currently <5% in dashboard repo. |
| **Component coverage** (documented vs total) | **1 / 10** | Document the 4 chrome components (LeftSideBar, RightSideBar, NavBar, FeedLayout) appearing on every page. Add Card + Input. Get verified count from 0 → 6. That moves us to 10/198 documented + actually-correct, ~5%, which earns a 7. |
| **Page coverage** (DS site working vs total) | **5 / 10** | Stop showing 17 disabled nav entries. Either build them or remove them. The disabled-link pattern makes the site look 50% broken. Building the 5 most-impactful (foundations/elevation, foundations/radius, foundations/motion, components/card, components/input) → 7/10. |
| **Token values match production** | **3 / 10** | Resolve DC-005 (the brand color). That alone fixes the headline lie. Then DC-001/DC-002/DC-009 (status colors). Then DC-008 typo. Once 4 of the 10 tickets close, the 60%-of-mappings-are-wrong number moves to ~30%. That earns a 7. |
| **Component specs match production** | **2 / 10** | Verify Button + Layout against real source (currently both `conflict`). One verified spec → 5/10. Three verified → 7/10. Today: zero verified. |
| **Drift data freshness** | **3 / 10** | Re-run extraction. Drops staleness from 10 days to today → 7/10. Set up a weekly cron → 9/10. |
| **Designer can do their job** | **3 / 10** | Make icons visually browsable. Add Figma library link. Mark aspirational specs honestly. → 7/10. |
| **Engineer can do their job** | **4 / 10** | Ship the codemod. Add a migration guide. Document deprecated.json's intended use. → 7/10. |
| **PM can do their job** | **2 / 10** | Add an executive summary. Add a "what does match% mean" tooltip. Add CSV export. Get 2 more surfaces extracted so they can compare. → 7/10. |
| **AI generator produces useful output** | **3 / 10** | Test it. Today we don't know. Run 10 real generations, fix the prompt based on what it gets wrong, add real production SCSS to the context. → 7/10. |
| | | |
| **OVERALL DESIGN SYSTEM HEALTH** | **3 / 10** | The system is real, the pipeline works, the UI exists. But: 1 of 4 surfaces, 6 of 198 components specced, 0 verified, 0 codemod runs, 4-way brand color, 60% spec/production conflict rate, untested AI generator. The gap between what the site presents and what production ships is the largest single liability. To get to 7 you'd need DC-005 resolved + the codemod run + 3 verified specs + teacher extraction + the AI generator validated. 5 things, ~2 weeks of work. |

---

## CLOSING

If I had to fix one thing today to have the most impact across all four personas, **it would be running the dashboard-repo hex → SCSS-token codemod** because every other gap downstream of that point — designer not seeing real values, engineer not benefiting from the token system they helped define, PM not seeing migration progress, AI generator producing patterns indistinguishable from actual code — is gated on the simple fact that production code does not use the tokens we documented. ~1,786 hex literals replaced (top-5 colors only), zero pixel change, the rest of the system suddenly stands on real ground. Until that codemod runs, the design system is a nice document about a thing that doesn't exist yet.
