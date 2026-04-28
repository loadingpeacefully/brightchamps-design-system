---
title: newDashboard Component Inventory
date: 2026-04-28
status: research-only — full atom + top-30 molecule catalogue
source: repo-cloned/.../src/newDashboard/components
---

# newDashboard Component Inventory — 2026-04-28

The `newDashboard/components/` directory is the future of the codebase. It contains **14 atoms** and **96 molecules** in atomic-design layout. Of these 110 components, the Tier 1–3 documentation effort covered **2** (the dashboard-layout NavBar/sidebar references mapped to legacy `src/components/`, not these atoms). This doc catalogs every atom + the 30 largest molecules (representing the highest-complexity 31% of the molecule library).

---

## Summary

```
Atoms              14 components, 0 documented
Molecules          96 components, 2 documented (Card / Button via legacy src/components/)
Top 30 molecules   31% of molecule library by SCSS line count
                   Combined SCSS lines: ~7,500 (out of ~12,000 total in molecules/)
```

**Critical finding from atom inspection:** `togglebutton` uses `#4D3BC2` (DC-008 typo!) AND `#4a3fb4` (DC-018 5th brand purple) AND `#7453d7` (= `color/course/ai/500` — used here NOT as a course color). All three already mapped or filed.

**Critical finding from molecule inspection:** the largest molecules use 8–15 unique colors each. `Calendar.module.scss` (851 lines) uses 15 distinct hex values including `#222a33` (DC-014), `#4e3bc2` + `#6651e4` (DC-005), `#ff2d3a` and `#ff6e61` (TWO unmapped reds), `#fff5dc` and `#ffe895` (warm yellows not in the ledger).

---

## Atoms (14 / 14)

| Component | SCSS lines | Colors used | Mapped? | Props/variants | Priority |
|---|---:|---|---|---|---|
| **DateDropdown** | 60 | `#f5f5f5` (1) | 1/1 (close to neutral/100) | `type`, disabled state | MEDIUM — used in onboarding forms |
| **Icon** | 0 | — | — | wraps `images.tsx` URLs | HIGH — central to all 765 CDN icons |
| **LoadingIndicator** | 35 | `#ffffff` | 1/1 | `type` (layoutLoader vs default) | MEDIUM — used everywhere |
| **ProgressBar** | 77 | `#40c178` `#ebebeb` `#ff6565` `#ffbf31` (4) | **0/4 mapped** | `color` (green/yellow/red) | HIGH — different from legacy ProgressBar; uses 4 unmapped colors as 3-state indicators |
| **ProgressbarWithStar** | 0 | — | — | `color` | LOW (TS-only, no SCSS) |
| **SelectedTeacher** | 168 | `#4e3bc2` `#e1e2ff` (2) | 0/2 mapped (DC-005 + DC-015 area) | `size` | MEDIUM — teacher-selection UI |
| **ShowStarRating** | 0 | — | — | `color`, `StarRatingProps` interface | LOW (TS-only) |
| **SideBarPopup** | 102 | none (uses parent context) | — | sidebarProps type | MEDIUM — overlay/drawer pattern |
| **SpeechBubble** | 63 | `#e0e0e0` (1) | 0/1 mapped | corner positioning props | LOW |
| **TextTruncate** | 94 | `#0056b3` `#007bff` `#3182ce` `#63b3ed` `#6c757d` `#a0aec0` (6) | **0/6 mapped — Bootstrap blues!** | TextTruncateProps | **HIGH — uses Bootstrap blues, NOT BrightChamps** |
| **Tooltip** | 39 | `#FFF5F1` (1, peach) | 0/1 mapped | TooltipProps | MEDIUM |
| **TruncateText** | 36 | none (text-only) | — | `type` | LOW |
| **dropdown** | 92 | `#394150` `#d0d0d0` `#f0f0f0` (3) | **0/3 mapped — none of the grays match canonical** | (no .tsx — orphan?) | MEDIUM |
| **togglebutton** | 44 | `#3D4D5D` `#3d4d5d` `#4D3BC2` (DC-008!) `#4a3fb4` (DC-018!) `#7453d7` (5) | 1/5 (3D4D5D = neutral/600); rest are conflict tickets | ButtonProps | **HIGH — concentrates 3 DC tickets in one 44-line file** |

**Atom-specific findings:**
1. `TextTruncate` is using **Bootstrap CSS framework colors** (`#007bff`, `#0056b3`, etc.) — these have no place in a BrightChamps system. Likely a copy-paste from a Bootstrap example. New ticket DC-020 candidate.
2. `togglebutton` is the most concentrated DC-conflict atom: contains the DC-008 typo (`#4D3BC2`), DC-018 5th brand purple (`#4a3fb4`), and `#7453d7` (which is the AI course color, used here outside its semantic role).
3. `ProgressBar` (newDashboard atom) uses a **completely different palette** than the legacy `src/components/ProgressBar` — green/yellow/red traffic-light colors that don't match `surface/bg/success` (#00B67A), `/warning` (#FF7C35), or `/error` (#FF5C5C). Two parallel ProgressBar components, two different color schemes. New ticket DC-021 candidate.

---

## Top 30 Molecules (by SCSS line count)

Sorted by complexity (line count = rough proxy for component depth). Combined: ~7,500 lines of SCSS, ~70 unique colors.

| # | Molecule | Lines | Colors used | Notable colors / DC overlap |
|---|---|---:|---:|---|
| 1 | **Calendar** | 851 | 15 | `#222a33` DC-014, `#4e3bc2`+`#6651e4` DC-005, `#ff2d3a`+`#ff6e61` two unmapped reds, `#fff5dc`+`#ffe895` warm yellows |
| 2 | **Rating** | 757 | 3 | `#ffc200` DC-017 (yellow), `#faf5ff` (= primary/50) |
| 3 | **MyLearningProcess** | 574 | 11 | `#4a3fb4` DC-018, `#4e3bc2` DC-005, `#5698ee`, `#57ad5b`, `#ee7d41`, `#fde055` (4 unmapped accent colors) |
| 4 | **ReferralCard** (style) | 495 | shared with skeletonLoader below | — |
| 5 | **TrustPilotPopup** | 428 | 5 | `#7453D7` (= AI course color), `#1E1E1E` near-black |
| 6 | **ReferralCard** (skeleton) | 408 | 3 | `#4e3bc2` DC-005, `#8a78f9` DC-015 |
| 7 | **UnlockClassPopup** | 344 | 6 | `#373139` (different near-black, ΔE small from DC-014) |
| 8 | **TeacherProfile** (molecule) | 330 | 4 | `#11AC69` DC-009, `#FFBF31` (different yellow, not in ledger) |
| 9 | **DemoCourseDetailModal** | 328 | 8 | `#894AED` purple variant, `#BCA2F6`, `#FF045E` magenta — none mapped |
| 10 | **PrefferedClassTimings** | 322 | 9 | `#384655` DC-013, `#3928a0` (yet another purple), `#7d8892` DC-019 |
| 11 | **ClassesToReschedule** | 293 | 5 | `#4e3bc2` DC-005, `#8a78f9` DC-015, `#e1e2ff` (= primary/350) |
| 12 | **UpgradeCardFeed** | 277 | 11 | `#892cff`, `#9B78FF`, `#9a7cec`, `#BFA2FF` (4 unmapped purples — same family but different shades) |
| 13 | **classAccordion** | 266 | 7 | `#24c26e` (third green!), `#4a90e2` blue accent, `#f04b4b` red, `#f5a623` orange — none mapped, traffic-light palette |
| 14 | **InstallmentCard** | 266 | 11 | `#581DAE` `#673AB7` `#7C4DFF` (Material Design purples), `#9B78FF` `#BFA2FF` |
| 15 | **AddClassComponent** | 260 | 7 | DC-005 + DC-013 + DC-016 colors all present |
| 16 | **Combobox** | 259 | 6 | `#7d68ff` (= `$light-primary-color`), `#ecedef` `#eff3f5` `#fafafa` (3 grays not mapped) |
| 17 | **TimeZone** | 247 | 1 | `#222a33` DC-014 |
| 18 | **editDetailForm** | 246 | 6 | `#222A33` DC-014, `#e53e3e` (form-error red) |
| 19 | **GetCallBack** | 241 | 3 | `#4e3bc2` DC-005, `#6c7072` (gray) |
| 20 | **circleChessBanner** | 238 | 6 | `#6c2bd9` (yet another purple!), `#963E02` `#a84300` `#cd5400` `#e8a37a` (4 unmapped browns/oranges) |
| 21 | **CreditTransfer** | 238 | 9 | `#54BAB9` finlit course color + `#8A78F9` DC-015 + `#8CC0DE` coding course |
| 22 | **myReferrals** | 236 | 10 | DC-005 + DC-015 + DC-017 + multiple course colors |
| 23 | **EditDemoUserForm** | 232 | 9 | DC-014 + AI course color used as form accent |
| 24 | **ProjectModal** | 231 | 5 | `#4e3bc2`+`#6651e4` DC-005, `#e64a19` (orange not in ledger) |
| 25 | **banner** | 227 | 4 | `#43a047` (Material green!), `#e8f5e9` (Material green-50) — Material Design library leak |
| 26 | **ChallengesList Card** | 221 | 7 | `#4360fd` (electric blue), `#f1385a` (electric red) — neither mapped |
| 27 | **MakeupStatusModal** | 219 | 10 | `#4D3BC2` DC-008, `#7E69FF`, `#FB4F2C` (orange variant) |
| 28 | **RedeemGemsCard** | 218 | 3 | DC-005 + DC-015 |
| 29 | **LongTermSchedulingComponent** | 215 | 5 | DC-005 + DC-016 (`#f5f4fa` app-bg) |

---

## Color taxonomy across molecules

Of the ~70 unique hex values found in the top 30 molecules:

**Already mapped (or in DC tickets):**
- `#4e3bc2` (DC-005) appears in 12+ molecules
- `#222a33` / `#222A33` (DC-014) in 4
- `#384655` (DC-013) in 1 atom + 1 molecule
- `#8a78f9` / `#8A78F9` (DC-015) in 7
- `#ffc200` / `#ffd02b` (DC-017) in 4
- `#4D3BC2` / `#4d3bc2` (DC-008 typo) in 3
- `#4a3fb4` / `#4A3FB4` (DC-018) in 2
- `#f5f4fa` / `#F5F4FA` (DC-016) in 4

**NOT yet in any ticket — net new findings from molecule scan:**

| Hex | Where found | Likely role | Action |
|---|---|---|---|
| `#11AC69` | TeacherProfile | Different green from `#11ac69` (DC-009) — same hex, different case. SAME color. | Confirm DC-009 |
| `#7453D7` | togglebutton, TrustPilotPopup | = `color/course/ai/500` | Audit usage outside AI-course context |
| `#7d68ff` | Combobox | = `$light-primary-color` SCSS var | Add as `color/primary/special-light` or fold into primary scale |
| `#581DAE` `#673AB7` `#7C4DFF` | InstallmentCard | Material Design purples | **DC-022 candidate** — Material library leak |
| `#892cff` `#9B78FF` `#9a7cec` `#BFA2FF` `#9685ff` | UpgradeCardFeed, InstallmentCard | Multiple purple variants | **DC-022 candidate** — proliferation of purples |
| `#ff2d3a` `#ff6e61` `#FB4F2C` `#f04b4b` `#f1385a` `#FF045E` `#e64a19` | Calendar, classAccordion, MakeupStatus, ChallengesList, DemoCourseDetail, ProjectModal | 7 distinct red/orange variants, none = `#FF5C5C` (error/500) | **DC-023 candidate** — error/destructive color sprawl |
| `#43a047` `#24c26e` `#57ad5b` `#40c178` `#54BAB9` | banner, classAccordion, MyLearningProcess, ProgressBar(atom), CreditTransfer | 5 distinct green/teal variants, none = `#00B67A` (success/500) | **DC-024 candidate** — success color sprawl (already partially in DC-001/009) |
| `#4a90e2` `#5698ee` `#4360fd` `#3182ce` `#63b3ed` | classAccordion, MyLearningProcess, ChallengesList, TextTruncate | 5 blue variants, none = `#33CCFF` (info/500) | **DC-025 candidate** — info/blue color sprawl |
| `#fde055` `#FFBF31` `#FDDE6E` `#fff5dc` `#ffe895` | MyLearningProcess, TeacherProfile, DemoCourseDetail, Calendar | 5 warm-yellow variants | **DC-026 candidate** — yellow proliferation |
| `#ee7d41` `#f5a623` `#cd5400` `#a84300` `#e8a37a` `#FB4F2C` `#963E02` | MyLearningProcess, classAccordion, circleChessBanner, MakeupStatusModal | 7+ orange/brown variants | **DC-027 candidate** — warning color sprawl |

**Realization:** the deep extraction's "635 unmapped colors" figure understates the structural problem. Many of these unmapped colors are not arbitrary — they're **proliferating variants of system colors** (5+ blues, 7+ reds, 7+ oranges, 5+ greens, 5+ yellows). These are real DC tickets, not noise.

---

## Documentation priority — newDashboard atoms (HIGH first)

1. **togglebutton** — concentrates DC-008 + DC-018 + AI-course leak. Tier 4 candidate.
2. **TextTruncate** — Bootstrap library leak; needs explicit DC-020 ticket and remap to BrightChamps blues.
3. **ProgressBar** (atom) — different palette from documented legacy ProgressBar. Verify whether it should converge or stay separate.
4. **Icon** — wraps the entire CDN-icon system; documenting this atom is the path to documenting all 765 CDN icons.
5. **SelectedTeacher** — heavy use in onboarding teacher selection; uses DC-005 + DC-015 colors.

## Documentation priority — newDashboard molecules (HIGH first)

1. **Calendar** — 851 lines, 15 colors, used in scheduling flows. Singular highest-complexity component in the codebase.
2. **MyLearningProcess** — 574 lines, surfaces 4 net-new colors (DC-024/025/026/027 candidates).
3. **TeacherProfile** (molecule) — used on `/teacher-profile` route, references shared TeacherProfileCard.
4. **TrustPilotPopup** — appears on multiple pages, social-proof pattern.
5. **ReferralCard** + **RedeemGemsCard** — referral-flow components used heavily on demo-dashboard-post.
6. **ClassesToReschedule** + **GetCallBack** — student-support flows referenced from multiple pages.

---

## What this means for the DS roadmap

- **The Figma library's 444 variables cover roughly 18% of the colors actually in production** (based on Tier 3 + this molecule scan). The motion + radius additions help, but color sprawl is the real story.
- **Documenting more components with the existing token set won't shrink the gap.** New tokens need to be added — see DC-020 through DC-027 candidates above. That's potentially **8 new tickets** beyond the 19 currently filed.
- **The newDashboard ProgressBar atom is a fork** of the documented ProgressBar. We have two production progress-bar components in this codebase. Either we deprecate one or document both.

---

## Method note

- Atoms: every `*.module.scss` and matching `index.tsx` in `newDashboard/components/atoms/*` was inspected.
- Molecules: top 30 by SCSS line count from `find ... -name "*.module.scss" | xargs wc -l | sort -rn | head -30`.
- Color extraction: `grep -ohi "#[0-9a-f]{6}"`, deduplicated per file.
- Class names: first 5 `^\.` lines per file (rough indicator of structure).
- Props: `interface .* Props` + `variant|size|state|type|appearance|color` regex.

The full molecule list (96 entries) is not exhaustively catalogued — only the top 30. Remaining 66 molecules are smaller (under 200 SCSS lines each) but still warrant a future pass; they may surface additional DC candidates.
