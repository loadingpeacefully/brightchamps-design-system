# Component Spec Verification — feed repo source vs `componentSpecs.ts`

**Scope:** For each of the 6 components in `src/publish/ds-site-v2/lib/componentSpecs.ts`, find the matching source file in the feed repo (`brightchamps-student-feed`) and compare the documented token mapping against the actual code.

**Repo audited:** `repo-cloned/brightchamps-student-feed-b84495106f34/`

---

## Headline finding

**Of 6 components in `componentSpecs.ts`, only 1 (Button) has a direct file match in the feed repo.** The other 5 (ProgressLine, Accordion, LessonList, GreenLine, Layout) live in the broader student-app surfaces — not in this feed surface. The feed repo is exclusively the my-feed / global-feed routes (CardBody, CardHeader, ReactionSection, CommentSection, etc.).

**The Button audit reveals a single, large discrepancy that propagates across the whole repo:** the production "brand" color is `#6651e4` (which migrated to `color/primary/500`), not `#4e3bc2` (which is `color/brand/primary` in the ledger). Our componentSpecs documents the latter; production uses the former.

---

## Component-by-component

### 1. Button — **CONFLICT**

**Source files:**
- `src/components/atoms/Button/index.js`
- `src/components/atoms/Button/Button.scss`

**Source variants:** `submit`, `quiz`, `primary` (no Secondary, no Ghost — naming differs from spec).

**Colors in source:**

| Where | Color | Notes |
|---|---|---|
| `.btn.primary` background | `#6651e4` | the de facto brand purple |
| `.btn.primary` text | `#fff` | white |
| `.btn.submit` background | `#fff` | white |
| `.btn.submit` text | `007bff` | **broken — missing `#`, invalid CSS, browser ignores it** |
| `.btn.quiz` background | `#f0ad4e` | bootstrap warning orange — not in canonical ledger |
| `.btn.quiz` text | `white` | keyword |
| `.btn` base padding | `10px 15px` | not aligned to any `space/*` token |
| `.btn.primary` padding | `10px 20px` | mixed |
| `.btn.submit` padding | `4px 8px` | matches `space/0-5` + `space/2` |
| `.btn` border-radius | `5px` | not in ledger (closest is `radius/sm`) |
| `.btn.primary` border-radius | `100px` | matches `radius/full` |

**Our spec says:**
- Background (Primary) → `color/brand/primary` `#4e3bc2`
- Background (Secondary) → `color/warning/500` `#ffd900`
- Background (Hover) → `color/primary/700` `#0d47a1`
- Border radius → `radius/full` `9999px`
- Padding (x) → `space/6` `24px`, padding (y) → `space/3` `12px`

**Verdict:** **CONFLICT.**

| Property | Spec says | Code uses | Match |
|---|---|---|---|
| Primary background | `#4e3bc2` (`color/brand/primary`) | `#6651e4` (`color/primary/500`) | **WRONG** |
| Secondary | `#ffd900` (`color/warning/500`) | (no Secondary variant — Quiz uses `#f0ad4e`, Submit uses `#fff` w/ broken text) | **MISSING / WRONG** |
| Hover | `#0d47a1` (`color/primary/700`) | (no `:hover` rule defined) | **MISSING** |
| Border radius | `9999px` (`radius/full`) | `5px` default, `100px` for primary/submit | **PARTIAL** |
| Padding | `24px / 12px` (`space/6 / space/3`) | `10px 15px` default, `10px 20px` primary | **WRONG** |

**Blocker bug to file:** `Button.scss` line ~31 has `color: 007bff;` (missing `#`). That's invalid CSS. Submit-variant text inherits whatever's in scope. Likely a copy-paste regression from when the color was first defined.

---

### 2. ProgressLine — **NOT IN THIS REPO**

No file matching `progress-line`, `progress.bar`, or `Progress` as a component name. The feed repo references "progress" only as data fields (`completionProgress`, `progressPercent`) inside `CompletionCardBody` and `NanoCourseCardBody`, but none of those render a horizontal bar.

ProgressLine likely lives in:
- `champ.brightchamps.com` / learn surface (where the DS audit found 63 elements across 7 pages)
- Possibly in a parent monorepo or sibling repo we don't have access to

**Verdict:** spec is **inferred** (from DOM audit + designer DS), not yet **verified** against React source.

---

### 3. Accordion — **NOT IN THIS REPO**

No file matching `accordion` (case-insensitive). The feed repo doesn't expand/collapse — every card is fully rendered. The 98 Accordion DOM elements counted in the audit live elsewhere (probably in /learn/ lesson lists or /badges/).

**Verdict:** spec is **inferred**.

---

### 4. LessonList — **NOT IN THIS REPO**

The only "lesson" reference in the feed repo is a comment inside `CompletionCardBody` (a card that summarizes a completed lesson). There is no LessonList rendering code here. The /learn/ page where the DS audit found 43 LessonList elements isn't in this repo.

**Verdict:** spec is **inferred**.

---

### 5. GreenLine — **NOT IN THIS REPO**

No file matching `green-line` / `GreenLine` / `greenline`. No element using `#00B67A` (the spec's success color). The closest production green is `#24C26E`, used 2× in `CertificateCardBody/index.js` (background color) and `CompletionCardBody/utils.js`. That's the legacy success color — `color/success/300` in our migrated ledger.

**Verdict:** spec is **inferred**, AND **success token disagrees with production**: spec says `#00B67A` (`color/success/500`), production uses `#24C26E` (`color/success/300`). Same finding as DC-001 in the designer-conflicts drift report — and now confirmed by source code, not just the designer DS.

---

### 6. Layout — **NOT IN THIS REPO**

The feed repo has no top-level shell — it's mounted inside the larger student-app shell. Search for "sidebar"/"Layout" returns no matches. The Layout DS spec describes the parent app's frame, which is owned outside this repo.

**Verdict:** spec is **inferred**.

---

## Cross-cutting finding: the production brand color is `#6651e4`, not `#4e3bc2`

This is the most important takeaway from the audit and changes how the design system should publish the brand primary.

| Color | DS token | Where in feed repo | Count |
|---|---|---|---|
| `#6651e4` | `color/primary/500` (luminance-ramped, not "brand") | Button.primary, GenericCardBody (banner + accent), BodyHeader, PendingQuestion, CompletionCardBody (border + text), CompletedCard (10% tint), QuizCard | **9 production usages, 7 files** |
| `#4e3bc2` | `color/brand/primary` (with the openQuestion callout) | `_colors.scss` (defined but never imported by consumers), `TeacherDefaultProfile.module.scss` | **2 usages — one is a token def nobody reads** |

So in actual production code, the brand purple is `#6651e4`, not `#4e3bc2`. Our DS site shows `color/brand/primary` = `#4e3bc2` as the canonical brand color, with `color/primary/500` = `#6651e4` as a "secondary primary surface." Production reverses that hierarchy.

**Three possible explanations:**
1. The production app drifted away from the brand-team-approved purple `#4e3bc2` over time.
2. The designer's Figma file uses `#4e3bc2` aspirationally, but engineering has been shipping `#6651e4` for so long that the "real" brand became `#6651e4`.
3. Both are intentional — `#4e3bc2` for marketing surfaces, `#6651e4` for in-app — and the DS just hasn't documented this distinction yet.

This adds a fourth voice to the DC-005 conflict (designer says `#722ED1`, Figma says `#4e3bc2`, production code says `#6651e4`). The brand team's resolution needs to account for all three.

---

## Recommendations

1. **Fix the Button.scss `007bff` typo first.** It's a one-line change and currently shipping broken CSS.
2. **Decide the brand color** before writing any more component specs. Until DC-005 is resolved, every Button / Card / nav-active spec carries a 50/50 risk of being wrong in production.
3. **Mark 5 of 6 specs as `inferred`** in `componentSpecs.ts` until source files for ProgressLine / Accordion / LessonList / GreenLine / Layout are located. Only the Button page is currently `verifiable` against the feed repo — and that verification revealed conflicts.
4. **Add the GreenLine success-color conflict (`#00B67A` vs `#24C26E`) as a verification-stage finding on DC-001.** It was a designer-DS-vs-production-Figma discrepancy; now confirmed by production-source as well.
