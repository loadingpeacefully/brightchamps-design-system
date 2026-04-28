---
title: Parent Hub Inventory
date: 2026-04-28
status: research-only — surface mapping for the second product surface in the dashboard codebase
source: repo-cloned/.../src/newDashboard/parentHub
---

# Parent Hub Inventory — 2026-04-28

The parent-hub is a **second product surface** living inside the BrightChamps dashboard codebase, served at `/parent-hub`. It targets parents (not students), has its own information architecture (Insight + Payment tabs), and contributes 53 SCSS modules totalling **8,140 lines of SCSS** with **99 unique hex values** — none of which is in the design system today.

This inventory makes the surface visible. Extraction is a separate pass.

---

## Top-level structure

```
parentHub/
├── Header/
├── Tabs/
│   ├── InsightTab/
│   │   ├── DetailedInsights/
│   │   ├── InsightsLoader/
│   │   ├── ProgressOverview/
│   │   └── ReportCardTable/
│   └── PaymentTab/
│       ├── BillingAddress/
│       ├── PaymentOverview/
│       │   ├── UpcommingPayments/
│       │   └── UpgradePackageCard/
│       ├── StudentSelectionStrip/
│       ├── TransactionTable/
│       ├── YouMayCheckAlso/
│       └── latestPayment/
└── components/
    ├── AlertBannerWithCta/
    ├── AlertCards/
    ├── CourseDropdown/
    ├── CourseTab/
    ├── Cta/
    ├── CtaRibbon/
    ├── DemoStudentScreen/
    ├── EngagementModal/
    ├── ErrorScreen/
    ├── ProfileSelector/
    ├── SkeletonLoading/
    └── StickyNudge/
```

Two tabs (Insight + Payment), 12+ components folders, plus a Header and dedicated SkeletonLoading module.

---

## Component inventory (sized)

### Tabs / Insight (4 sub-modules)

| Component | SCSS lines | Likely purpose |
|---|---:|---|
| InsightsLoader | 242 | Skeleton/loader for insight tab |
| DetailedInsights/CurrentModule | 237 | Current module deep-dive |
| ProgressOverview | (small) | High-level progress summary |
| ReportCardTable | (small) | Tabular report card |

### Tabs / Payment (8 sub-modules)

| Component | SCSS lines | Likely purpose |
|---|---:|---|
| TransactionTable | **637** | Transaction history (2nd-largest module in parent-hub) |
| PaymentOverview/UpcommingPayments | 487 | Upcoming payment dates |
| YouMayCheckAlso/Card | 326 | Cross-sell card |
| latestPayment | 294 | Latest payment summary |
| PaymentOverview/UpgradePackageCard | 211 | Upsell to premium |
| BillingAddress | (small) | Billing address form |
| StudentSelectionStrip | (small) | Multi-student switcher |

### Components folder (12+)

| Component | SCSS lines | Likely purpose |
|---|---:|---|
| SkeletonLoading | **638** | Loader (1st-largest) |
| StickyNudge | 409 | Persistent CTA at bottom |
| ProfileSelector | 300 | Multi-student profile switcher |
| AlertCards (container) | 296 | Alert card grid |
| CourseTab | 277 | Per-course tab navigation |
| AlertCards | 262 | Individual alert card |
| CourseDropdown | 216 | Course filter dropdown |
| AlertBannerWithCta | (small) | Inline banner with action |
| Cta + CtaRibbon | (small) | Generic CTA + ribbon variant |
| DemoStudentScreen | (small) | Demo state placeholder |
| EngagementModal | (small) | Engagement nudge modal |
| ErrorScreen | (small) | Error state |

**Header** is a single small SCSS module — likely just nav chrome for the parent surface.

---

## Color inventory — parent-hub uses 99 unique colors, ZERO in current library

```
Sample (alphabetical, first 40 of 99):
#000000  #00b67a  #02923c  #111827  #181818  #191919  #1976d2  #1a1a1a
#1b1b1b  #1d1d1d  #212121  #222a33  #242424  #252525  #25bf6f  #262626
#272727  #282828  #374151  #3a2a8f  #3b82f6  #3d2a9e  #3d2b9e  #3d2f9a
#3d4d5d  #448b45  #4d3bc2  #4e3bc2  #51667b  #56cb65  #57a3ad  #57ad5b
#5b21b6  #5bb078  #5c5c5c  #6366f1  #6651e4  #6b6b6b  #6b7280  …
```

### Patterns

- **DC-005 brand-purple instances**: `#4e3bc2`, `#6651e4`, `#4d3bc2` — all confirmed here too. Parent-hub uses the same purple cluster as the student dashboard; codemod for DC-005 must include this surface.
- **DC-014 dark text**: `#222a33` confirmed. Same H3 title color.
- **DC-019 utility grays**: `#3d4d5d`, `#51667b` confirmed.
- **NEW Tailwind-style grays**: `#111827`, `#374151`, `#6b7280` — these are Tailwind CSS default greys (gray-900, gray-700, gray-500). Library leak indication. **DC-029 candidate.**
- **NEW Material/electric blues**: `#1976d2`, `#3b82f6`, `#6366f1` — Material Blue 700, Tailwind blue-500, Indigo. **DC-030 candidate** (info color sprawl).
- **NEW deep purple variants**: `#3a2a8f`, `#3d2a9e`, `#3d2b9e`, `#3d2f9a`, `#5b21b6` — five more brand-purple shades not in DC-005's five-way conflict. **DC-005 expansion: now an 8+ way conflict** counting parent-hub.
- **NEW green proliferation**: `#02923c`, `#25bf6f`, `#448b45`, `#56cb65`, `#57ad5b`, `#5bb078` — six more greens (already 5 elsewhere → 11+ total). **DC-024 expansion candidate.**
- **NEW dark-text proliferation**: `#181818`, `#191919`, `#1a1a1a`, `#1b1b1b`, `#1d1d1d`, `#242424`, `#252525`, `#262626`, `#272727`, `#282828` — TEN near-black variants in one surface. None match each other. **DC-031 candidate** (near-black sprawl).

---

## Comparison to documented surfaces

| Aspect | Student dashboard (documented) | Parent hub (this surface) |
|---|---|---|
| Routes | 7 of 35 | 1 of 35 (`/parent-hub` only) |
| SCSS modules | ~21 in inventory + Tier 1–3 | **53** modules |
| SCSS lines | ~2,500 (estimated) | **8,140** lines |
| Unique colors used | ~120 (across student surface SCSS) | **99** (one surface) |
| Layout | DashboardLayout (104px nav + 880 main + 460 right) | Different — likely tabs over a wider main area |
| Audience | Student | Parent (separate user type) |
| Documented in DS | Yes (Tier 1–3 chrome) | **NONE** |

---

## Priority for documentation

Parent hub is the **single largest documentation gap** in the dashboard codebase. Within parent-hub, prioritize:

1. **TransactionTable** (637 lines) + **UpcommingPayments** (487 lines) — payment-flow tables. Reusable patterns for any tabular data.
2. **AlertCards** + **AlertBannerWithCta** + **StickyNudge** (combined 967+ lines) — alert/notification family. Likely reusable in student dashboard.
3. **ProfileSelector** (300 lines) — multi-student switcher. Could merge with the student-dashboard SwitchProfileItemCard (currently undocumented).
4. **SkeletonLoading** (638 lines) — uses 5+ shimmer patterns. Should fold into the canonical motion `animation/shimmer` preset.
5. **CourseTab** + **CourseDropdown** (combined 493 lines) — course navigation patterns reused across the surface.

---

## Engineering migration impact

**The parent-hub codemod will be the largest single migration job after DC-005:**

- 53 SCSS files × ~155 lines avg = ~8,140 lines to touch
- 99 unique colors → at least 30+ new tokens needed (or migrations to existing tokens)
- 6+ new DC tickets recommended (DC-029 Tailwind grays, DC-030 electric blues, DC-031 near-blacks, DC-024-extension greens, DC-005-extension purples, DC-014-extension dark titles)
- Parent-hub-specific patterns (TransactionTable, ProfileSelector) need their own design system pass before the codemod can run cleanly

---

## Method note

```
find src/newDashboard/parentHub -name "*.module.scss" | sort
xargs wc -l < scss-list                  # line counts
xargs grep -ohi "#[0-9a-f]{6}" < list     # color extraction
```

This inventory does NOT include a live extraction. To actually extract from `/parent-hub` would require:
- A parent session cookie configured in `.playwright-auth/parent.json`
- An entry in `surfaces.config.ts` for the parent surface (currently absent)
- Running `npm run extract:dom -- --surface=parent-hub` once auth is in place

The extraction would yield: actual computed CSS values per page, drift detection against the (currently empty) parent Figma file, component element counts.
