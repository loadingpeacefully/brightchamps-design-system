# Engineering Migration Guide
## BrightChamps Design System — Dashboard Token Migration

**Status:** Ready to execute (Steps 0–3 require no design decisions)
**Repo:** `brightchamps-student-dashboard`
**Source-drift report:** [`ledger/drift/source-drift-2026-04-26.json`](../ledger/drift/source-drift-2026-04-26.json)
**Estimated effort:** Step 0 5 min · Step 1 30 min · Step 2 2 hr · Step 3 1 sprint · Step 4–5 blocked on DC-005
**Zero visual change guaranteed for Steps 0–3**

---

## TL;DR (real numbers from static analysis)

- **758 unique solid hex values** in production source. **4,472 total color occurrences.**
- **Token adoption: 20%** — 2,694 hardcoded · 623 `$scss-vars` · 50 `var(--css-vars)`.
- **252 files have ZERO token adoption** (all hardcoded hex).
- **58 hex values are exact matches** for an existing canonical token but pasted as hex anyway.
- **425 close matches** (ΔE < 5) — replaceable with existing tokens, no visual change.
- **263 drift colors** (ΔE 5–15) — need design review.
- **12 hex values have no canonical match** (ΔE ≥ 15) — need ledger additions.

---

## Step 0 — Clean up `_variables.scss` (5 minutes, zero risk)

The dashboard repo has **no `_colors.scss` file**. All SCSS tokens live in `src/styles/_variables.scss`. The conflicts the design system docs warn about (`$primary-color: #007bff` overriding `#4e3bc2`) **only exist in the feed repo**, not here. The dashboard's `$primary-color: #4e3bc2` (line 13) is correct and uncontested.

The dashboard's real issues are merge cruft — duplicate declarations:

### Issue 1 — `$shadow` declared 3 times

In `src/styles/_variables.scss`:
- Line 32: `$shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);`
- Line 33: `$shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);`
- Line 42: `$shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);`

All three lines have identical values, so the duplicates are harmless today — but they will silently break the day someone changes one without changing the others.

**Fix:** delete lines 33 and 42, keep only line 32.

### Issue 2 — Course color tokens declared twice

In `src/styles/_variables.scss`:
- Lines 70–73 declare `$coding-course-color`, `$finlit-course-color`, `$robotics-course-color`, `$communication-course-color`.
- Lines 78–81 declare the **same four tokens with the same values**.

**Fix:** delete lines 78–81. Keep the first set (line 70–73).

### Verify

```bash
cd /path/to/brightchamps-student-dashboard
grep -n "^\$shadow" src/styles/_variables.scss
# Expected after fix: ONE line containing $shadow

grep -n "coding-course-color" src/styles/_variables.scss
# Expected after fix: ONE line
```

**Commit:** `chore: remove duplicate $shadow and $course-color declarations in _variables.scss`

---

## Step 1 — Fix the brand purple typo (30 minutes, zero risk)

**DC-008** · ΔE ≈ 0.5 vs `#4e3bc2` · No design decision needed.

Production ships `#4d3bc2` (one character off from the canonical `#4e3bc2`). 79 occurrences across **46 files**. Visually identical. Semantically wrong. Will surface as a CSS-variable bug the moment Step 3 introduces tokens.

### Files affected (46)

```
src/sections/onboarding-new/screens/FormScreen/TimingModal/timing.module.scss
src/sections/WelcomeKit/Components/welcomeKitClassCard.module.scss
src/sections/SelectProfile/selectProfile.module.scss
src/sections/LaunchGurukulAppPage/launchGurukulApp.module.scss
src/newDashboard/PracticeZone/components/PracticeSectionHeader/practiceSectionHeader.module.scss
src/newDashboard/PracticeZone/pages/ModuleSkills/moduleSkills.module.scss
src/newDashboard/learn/components/Navbar/Navbar.module.scss
src/newDashboard/learn/components/LessonList/components/RightSectionInList/RightSectionInList.module.scss
src/newDashboard/learn/components/Header/Header.module.scss
src/newDashboard/NanoSkills/SkillCard/skillCard.module.scss
src/newDashboard/NanoSkills/Pages/Home/index.tsx
src/newDashboard/NanoSkills/Pages/Home/nanoSkillsPage.module.scss
src/newDashboard/NanoSkills/Pages/Home/LanguageSensitiveTray/languageSensitiveTray.module.scss
src/newDashboard/NanoSkills/Pages/CourseDetails/courseDetails.module.scss
src/newDashboard/NanoSkills/Pages/CourseDetails/HeroSection/SelfPaced/selfPacedHero.module.scss
src/newDashboard/NanoSkills/Pages/CourseDetails/HeroSection/Harvard/harvardHero.module.scss
src/newDashboard/rewards/rewardsPage.module.scss
src/newDashboard/components/molecules/SectionHeader/sectionHeader.module.scss
src/newDashboard/components/molecules/ReferralCard/style.module.scss
src/newDashboard/components/molecules/BadgesCard/badgesCard.module.scss
src/newDashboard/components/molecules/MakeupStatusModal/makeupStatusModal.module.scss
src/newDashboard/components/molecules/PreLogin/prelogin.module.scss
src/newDashboard/components/molecules/TeacherProfile/TeacherProfileInfo/teacherProfileInfo.module.scss
src/newDashboard/components/atoms/togglebutton/togglebutton.module.scss
src/newDashboard/components/atoms/LoadingIndicator/TrophyLoader.tsx
src/newDashboard/templates/NewDashboard/Layout.module.scss
src/newDashboard/TeacherProfile/TeacherProfileCard/teacherProfileCard.module.scss
src/newDashboard/parentHub/Tabs/InsightTab/ProgressOverview/progressOverview.module.scss
src/newDashboard/parentHub/Tabs/InsightTab/ProgressOverview/ProgressSection/index.tsx
src/newDashboard/parentHub/Tabs/InsightTab/ProgressOverview/ProgressSection/progressSection.module.scss
src/newDashboard/parentHub/Tabs/InsightTab/DetailedInsights/CurrentModule/currentModule.module.scss
src/newDashboard/parentHub/Tabs/PaymentTab/latestPayment/latestPayment.module.scss
src/newDashboard/parentHub/Tabs/PaymentTab/PaymentOverview/UpcommingPayments/upcommingPayment.module.scss
src/newDashboard/parentHub/components/StickyNudge/index.tsx
src/newDashboard/parentHub/components/StickyNudge/stickuNudge.module.scss
src/newDashboard/parentHub/components/DemoStudentScreen/demoStudentScreen.module.scss
src/newDashboard/parentHub/components/CourseDropdown/courseDropdown.module.scss
src/newDashboard/parentHub/components/ProfileDropdown/profileDropdown.module.scss
src/newDashboard/parentHub/components/AlertCards/index.tsx
src/newDashboard/parentHub/components/AlertCards/alertCards.module.scss
src/newDashboard/parentHub/components/MonthDropdown/monthDropdown.module.scss
src/newDashboard/parentHub/components/CtaRibbon/ctaRibbon.module.scss
src/newDashboard/parentHub/components/ErrorScreen/errorScreen.module.scss
src/newDashboard/badges/CurrentBadges/StudentDetailsCard/studentDetailsCard.module.scss
src/newDashboard/badges/components/BadgesTab/badgestab.module.scss
src/newDashboard/badges/UnlockedBadges/badgeSlider.module.scss
```

### Commands

```bash
cd /path/to/brightchamps-student-dashboard

# Preview (no changes):
grep -rn "#4d3bc2\|#4D3BC2" src --include="*.scss" --include="*.tsx" --include="*.ts"
# Expected: 79 lines

# Fix (in-place):
find src \( -name "*.scss" -o -name "*.tsx" -o -name "*.ts" \) -print0 \
  | xargs -0 sed -i '' 's/#4d3bc2/#4e3bc2/g'
find src \( -name "*.scss" -o -name "*.tsx" -o -name "*.ts" \) -print0 \
  | xargs -0 sed -i '' 's/#4D3BC2/#4e3bc2/g'

# Verify zero remaining:
grep -rn "#4d3bc2\|#4D3BC2" src --include="*.scss" --include="*.tsx" --include="*.ts"
# Expected: no output
```

**Commit:** `fix: DC-008 — replace #4d3bc2 typo with #4e3bc2 (46 files, 79 occurrences)`

---

## Step 2 — Replace hardcoded hex with existing SCSS tokens (2 hours, zero visual change)

Every token in this table is **already declared** in `src/styles/_variables.scss` and has an **exact hex match** with hardcoded values currently shipping. This is pure find-replace — no visual change, no design review, no new dependencies.

### Token map (verified exact matches)

| Hex | SCSS token | Files | Occurrences |
|---|---|---:|---:|
| `#3d4d5d` | `$text-black` | 219 | 509 |
| `#4e3bc2` | `$primary-color` | 173 | 326 |
| `#ffffff` | `$text-white` (or `$bg-white`) | 86 | 149 |
| `#8a78f9` | `$text-light-purple` | 33 | 58 |
| `#f5f4fa` | `$app-background` | 22 | 33 |
| `#2b3742` | `$text-dark-black` | 11 | 23 |
| `#8e8e8e` | `$text-disabled` | 13 | 21 |
| `#7d8892` | `$text-gray` | 18 | 19 |
| `#f5f3fc` | `$primary-color-extra-light` | 11 | 18 |
| `#51667b` | `$text-black-medium` | 12 | 17 |
| `#eff3f5` | `$disabled-bg` (or `$dropdown-hover-color`) | 12 | 15 |
| `#ff752c` | `$highlight-color` (or `$skipped-state`) | 17 | 24 |
| `#7d68ff` | `$light-primary-color` | 8 | 10 |
| `#f5f6f7` | `$light-gray` | 9 | 10 |
| `#dcdcdc` | `$border-color` | — | — |
| `#ededed` | `$card-border-color` | — | — |
| `#fafafa` | `$text-area-bg-color` | — | — |
| `#9685ff` | `$primary-color-light` | 2 | 2 |
| `#edebf8` | `$menu-hover-color` | 2 | 2 |
| `#11ac69` | `$completed-state` (or `$success-green`) — see DC-001/DC-009 | 8 | 13 |

**Replacement-safe baseline (Steps 0+1+2 combined): ~1,300 occurrences across ~370 files. Zero visual change.**

### Commands (run in order)

Each command is a single tight regex — only replaces in property-value position (`: hex;`), not inside comments or token definitions. Run after Step 1 has cleared the `#4d3bc2` typo.

```bash
cd /path/to/brightchamps-student-dashboard

# 1. $text-black (#3d4d5d) — biggest single sweep
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #3d4d5d;/: $text-black;/g; s/: #3D4D5D;/: $text-black;/g'

# 2. $primary-color (#4e3bc2)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #4e3bc2;/: $primary-color;/g; s/: #4E3BC2;/: $primary-color;/g'

# 3. $text-white (#ffffff) — only in property-value position to avoid renaming the token-def line
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #ffffff;/: $text-white;/g; s/: #FFFFFF;/: $text-white;/g'

# 4. $text-light-purple (#8a78f9)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #8a78f9;/: $text-light-purple;/g; s/: #8A78F9;/: $text-light-purple;/g'

# 5. $app-background (#f5f4fa)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #f5f4fa;/: $app-background;/g; s/: #F5F4FA;/: $app-background;/g'

# 6. $text-dark-black (#2b3742)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #2b3742;/: $text-dark-black;/g; s/: #2B3742;/: $text-dark-black;/g'

# 7. $text-disabled (#8e8e8e)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #8e8e8e;/: $text-disabled;/g; s/: #8E8E8E;/: $text-disabled;/g'

# 8. $text-gray (#7d8892)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #7d8892;/: $text-gray;/g; s/: #7D8892;/: $text-gray;/g'

# 9. $primary-color-extra-light (#f5f3fc)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #f5f3fc;/: $primary-color-extra-light;/g; s/: #F5F3FC;/: $primary-color-extra-light;/g'

# 10. $text-black-medium (#51667b)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #51667b;/: $text-black-medium;/g; s/: #51667B;/: $text-black-medium;/g'

# 11. $disabled-bg (#eff3f5)
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #eff3f5;/: $disabled-bg;/g; s/: #EFF3F5;/: $disabled-bg;/g'

# 12. $highlight-color / $skipped-state (#ff752c)
# Same hex serves both — pick $highlight-color for non-state uses
find src \( -name "*.scss" -o -name "*.module.scss" \) -print0 \
  | xargs -0 sed -i '' 's/: #ff752c;/: $highlight-color;/g; s/: #FF752C;/: $highlight-color;/g'

# Final verify — should show only un-mappable colors remaining
grep -roh "#[0-9a-fA-F]\{6\}" src --include="*.scss" \
  | sort | uniq -c | sort -rn | head -30
# Top results should now be unmappable colors that need design review
```

**Commit:** `chore: replace 12 most-used hardcoded hex values with SCSS tokens — ~1,200 replacements, zero visual change`

**Re-extract drift after this commit:** rerun the source-analysis pipeline. The DS site `/surfaces/student/` should jump from 20% adoption to ~50%.

---

## Step 3 — Introduce CSS custom properties (1 sprint)

Add the following block to `src/styles/globals.scss` inside `:root {}`. This bridges the SCSS token system to the CSS-variable system the design system documentation site uses (`--color-brand-primary` etc.).

```scss
:root {
  // Brand
  --color-brand-primary:        #{$primary-color};              // #4e3bc2
  --color-brand-primary-light:  #{$primary-color-light};        // #9685ff
  --color-brand-primary-xlight: #{$primary-color-extra-light};  // #f5f3fc
  --color-brand-secondary:      #{$highlight-color};            // #ff752c

  // Text
  --color-text-primary:   #{$text-black};        // #3d4d5d
  --color-text-dark:      #{$text-dark-black};   // #2b3742
  --color-text-medium:    #{$text-black-medium}; // #51667b
  --color-text-light:     #{$text-light-purple}; // #8a78f9
  --color-text-disabled:  #{$text-disabled};     // #8e8e8e
  --color-text-white:     #{$text-white};        // #ffffff

  // Backgrounds
  --color-bg-app:         #{$app-background};     // #f5f4fa
  --color-bg-white:       #{$bg-white};           // #ffffff
  --color-bg-disabled:    #{$disabled-bg};        // #eff3f5
  --color-bg-hover:       #{$menu-hover-color};   // #edebf8

  // States
  --color-success:        #{$completed-state};    // #11ac69 (DC-009 target: #00B67A)
  --color-error:          #{$danger-color};       // #f04b4b (DC-002 target: #FF5C5C)
  --color-warning:        #{$skipped-state};      // #ff752c (matches DC-004)
  --color-in-progress:    #{$inprogress-state};   // #6651e4 (DC-005 pending)
  --color-paused:         #{$paused-state};       // #3b9af5 (DC-010 provisional)

  // Course verticals
  --color-course-coding:        #{$coding-course-color};        // #8cc0de
  --color-course-finance:       #{$finlit-course-color};        // #54bab9
  --color-course-robotics:      #{$robotics-course-color};      // #fc8a8a
  --color-course-communication: #{$communication-course-color}; // #f9cf53

  // Radius
  --radius-sm: #{$border-radius-small};         // 10px
  --radius-md: #{$border-radius-medium};        // 16px
  --radius-lg: #{$border-radius-large};         // 20px
  --radius-xl: #{$border-radius-extra-large};   // 46px

  // Shadow
  --shadow-default: #{$shadow};                 // 0px 8px 24px rgba(0,0,0,.12)

  // Typography
  --font-family-primary: 'Nunito', sans-serif;
}
```

### Migration order (start with files that are easiest to convert)

The 10 files with the **highest current `$variable` adoption** — these only need to switch from `$primary-color` to `var(--color-brand-primary)`:

```
src/components/Rating/rating.module.scss              (32 SCSS vars / 8 hex)
src/components/classRatingFeedback/classRatingFeedback.module.scss  (32 / 8)
src/components/CertificateCard/certificatecard.module.scss          (19 / 9)
src/components/RewardsReferralCard/rewardsReferralCard.module.scss  (9 / 8)
src/newDashboard/components/molecules/Calendar/calendar.module.scss (high ratio)
src/components/Input/Combobox/combobox.module.scss                  (3 / 9)
src/components/CardImage/cardImage.module.scss                      (1 / 8)
src/components/Button/button.module.scss                            (2 / 8)
src/components/ChatBot/LiveChatCard/liveChatCard.module.scss        (1 / 8)
src/components/LanguageSelector/languageselector.module.scss        (1 / 10)
```

For each, replace `$variable` references with `var(--variable)` while keeping the SCSS imports intact.

---

## Step 4 — Status color corrections (30 minutes per ticket)

These are confirmed by the designer DS. No brand-team sign-off needed.

### DC-001 — Success color (#00B67A)

```bash
# Current production: #24c26e (feed) and #11ac69 (dashboard)
# Target: #00B67A
grep -rln "#24c26e\|#11ac69" src --include="*.scss"
find src \( -name "*.scss" \) -print0 \
  | xargs -0 sed -i '' 's/#24c26e/#00B67A/gi; s/#11ac69/#00B67A/gi'

# Update _variables.scss:
sed -i '' 's/\$completed-state: #11ac69;/\$completed-state: #00B67A;/' src/styles/_variables.scss
sed -i '' 's/\$success-green: #11ac69;/\$success-green: #00B67A;/' src/styles/_variables.scss
```

### DC-002 — Error color (#FF5C5C)

```bash
# Production reds: #f04b4b, #fc373a, #dc4245, #ee1d20
# Target: #FF5C5C
grep -rln "#f04b4b\|#fc373a\|#dc4245" src --include="*.scss"
find src \( -name "*.scss" \) -print0 \
  | xargs -0 sed -i '' 's/#f04b4b/#FF5C5C/gi; s/#fc373a/#FF5C5C/gi; s/#dc4245/#FF5C5C/gi'

sed -i '' 's/\$danger-color: #f04b4b;/\$danger-color: #FF5C5C;/' src/styles/_variables.scss
```

### DC-003 — Info color (Material Design Blue 900 leak)

```bash
# Production: #0d47a1 (confirmed Material library leak)
# Target: #33CCFF
grep -rln "#0d47a1" src --include="*.scss"
find src \( -name "*.scss" \) -print0 \
  | xargs -0 sed -i '' 's/#0d47a1/#33CCFF/gi'
```

### DC-004 — Warning color

```bash
# Already shipping #ff752c as $skipped-state and $highlight-color
# DC-004 target: #FF7C35 (designer DS) — slightly different orange
# Add a dedicated $warning-color token if needed:
echo '$warning-color: #FF7C35;' >> src/styles/_variables.scss
```

### DC-009 — Progress success

Resolved by DC-001 above (same value `#11ac69` → `#00B67A`).

### DC-010 — Paused state

Already a single value `#3b9af5` shipping; the DS ledger now has `color/info/400` provisionally pointing to it. No code change until brand confirms.

---

## Step 5 — Brand purple resolution (BLOCKED on DC-005)

Once the brand team selects from:
- Option A: `#722ED1` (designer / Royal Amethyst, 7 occurrences in dashboard via `$button-primary`)
- Option B: `#4e3bc2` (Figma extraction / current `$primary-color`, 326 occurrences)
- Option C: `#6651e4` (in-progress state / `$inprogress-state`, 32 occurrences)

Run this codemod (replace `CANONICAL_HEX` with the chosen value):

```bash
cd /path/to/brightchamps-student-dashboard
CANONICAL_HEX="#XXXXXX"  # ← brand team fills this in

# Replace all four variants with the single canonical:
find src \( -name "*.scss" -o -name "*.tsx" -o -name "*.ts" \) -print0 \
  | xargs -0 sed -i '' "s/#4e3bc2/$CANONICAL_HEX/gi; s/#6651e4/$CANONICAL_HEX/gi; s/#722ED1/$CANONICAL_HEX/gi; s/#722ed1/$CANONICAL_HEX/gi"
# Note: #4d3bc2 already fixed in Step 1

# Update _variables.scss:
sed -i '' "s/\$primary-color: #4e3bc2;/\$primary-color: $CANONICAL_HEX;/" src/styles/_variables.scss
sed -i '' "s/\$button-primary: #722ED1;/\$button-primary: $CANONICAL_HEX;/" src/styles/_variables.scss
sed -i '' "s/\$inprogress-state: #6651e4;/\$inprogress-state: $CANONICAL_HEX;/" src/styles/_variables.scss

# Verify — all three legacy hexes should be gone:
grep -rn "#4e3bc2\|#6651e4\|#722ED1\|#722ed1" src --include="*.scss"
# Expected: 0 results outside _variables.scss line containing $primary-color
```

---

## Component token-adoption tracker — top 30 priorities

Sorted by hardcoded count descending (most hardcoded = highest priority for Step 2 sweep). Generated from `/tmp/component-colors.txt` and `/tmp/newdashboard-component-colors.txt`.

### Priority HIGH (≥ 20 hardcoded colors)

| File | Hardcoded | SCSS vars | CSS vars |
|---|---:|---:|---:|
| `src/newDashboard/NanoSkills/Pages/CourseDetails/courseDetails.module.scss` | 57 | 0 | 0 |
| `src/newDashboard/components/molecules/Calendar/calendar.module.scss` | 42 | 0 | 0 |
| `src/newDashboard/certificates/CertificateViewSection/certificateViewSection.module.scss` | 41 | 33 | 0 |
| `src/newDashboard/parentHub/Tabs/PaymentTab/TransactionTable/transactionTable.module.scss` | 40 | 0 | 0 |
| `src/newDashboard/parentHub/Tabs/PaymentTab/PaymentOverview/UpcommingPayments/upcommingPayment.module.scss` | 33 | 0 | 0 |
| `src/newDashboard/sections/hackathonSlotModal/components/CustomDropdown/CustomDropdown.module.scss` | 29 | 0 | 0 |
| `src/newDashboard/parentHub/components/StickyNudge/stickuNudge.module.scss` | 28 | 0 | 0 |
| `src/newDashboard/NanoSkills/BookingModal/inSufficientDiamonds/inSufficientDiamonds.module.scss` | 27 | 11 | 0 |
| `src/newDashboard/NanoSkills/SkillCard/skillCard.module.scss` | 26 | 0 | 0 |
| `src/components/ProgressBar/progressbar.module.scss` | 25 | 0 | 0 |
| `src/newDashboard/components/molecules/ReferralCard/style.module.scss` | 24 | 10 | 0 |
| `src/newDashboard/NanoSkills/SelfPacedHarvardCards/selfPacedCards.module.scss` | 22 | 11 | 0 |
| `src/newDashboard/PracticeZone/components/worksheetStep/workSheetStep.module.scss` | 22 | 0 | 0 |
| `src/newDashboard/NanoSkills/Pages/CourseDetails/HeroSection/Harvard/harvardHero.module.scss` | 22 | 0 | 0 |
| `src/newDashboard/yearInReview/yearInReview.module.scss` | 21 | 0 | 0 |
| `src/newDashboard/components/molecules/InstallmentCard/installmentCard.module.scss` | 21 | 0 | 0 |

### Priority MEDIUM (8–19 hardcoded colors)

| File | Hardcoded | SCSS vars |
|---|---:|---:|
| `src/components/ReferralStatusCard/referralStatusCard.module.scss` | 15 | 0 |
| `src/components/NewExperience/newExperience.module.scss` | 13 | 0 |
| `src/components/RedeemGemsCard/redeemGemsCard.module.scss` | 11 | 1 |
| `src/components/ChatBot/GridActionButtons/gridActionButtons.module.scss` | 11 | 0 |
| `src/components/LanguageSelector/languageselector.module.scss` | 10 | 1 |
| `src/components/FlashButton/FlashButton.module.scss` | 10 | 0 |
| `src/components/Input/Combobox/combobox.module.scss` | 9 | 3 |
| `src/components/CertificateCard/certificatecard.module.scss` | 9 | 19 |
| `src/components/RewardsReferralCard/rewardsReferralCard.module.scss` | 8 | 9 |
| `src/components/classRatingFeedback/classRatingFeedback.module.scss` | 8 | 32 |
| `src/components/Rating/rating.module.scss` | 8 | 32 |
| `src/components/Button/button.module.scss` | 8 | 2 |
| `src/components/ChatBot/LiveChatCard/liveChatCard.module.scss` | 8 | 1 |
| `src/components/CardImage/cardImage.module.scss` | 8 | 1 |

**Of the 379 files needing migration, 252 currently have ZERO token adoption (only hardcoded hex).** The 16 HIGH-priority files above account for ~480 of the ~2,694 hardcoded color occurrences (~18%). Knock these out and the migration is roughly 1/5 done.

---

## Notes for the engineer running this

- **Use BSD `sed` syntax** (`-i ''` with the empty-string argument) — this guide assumes macOS. For Linux/CI, use `sed -i` without the empty string.
- **Run on a feature branch.** Each step should be its own PR for clean reviewability.
- **After each step, regenerate `ledger/drift/source-drift-2026-04-26.json`** by re-running the static analysis pipeline. The DS site's `/surfaces/student/` page will reflect the improvement.
- **Don't run `npm run ledger:build`** — it overwrites the TDR-0001 semantic naming. See [DR-002](https://loadingpeacefully.github.io/brightchamps-design-system/get-started/decisions/#dr-002).
- **Verify visually** after Step 1 (typo fix) by spot-checking the 5 most-trafficked dashboard pages. Steps 2 and 3 are guaranteed visual no-ops; Step 4 changes status colors slightly (intentional, per design).
