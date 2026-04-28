---
title: Practice Zone Surface Inventory
date: 2026-04-28
status: research-only — sub-surface mapping
source: repo-cloned/.../src/newDashboard/PracticeZone
---

# Practice Zone Surface Inventory — 2026-04-28

Practice Zone is a **2-route sub-surface** of the student dashboard, focused on practice/homework. Smaller than NanoSkills but contains the production `milestoneAccordion` (already documented as Tier 2 Accordion).

---

## Routes (2)

| Route | Surface module | Purpose |
|---|---|---|
| `/practice-zone` | `PracticeZone/pages/Home` | Practice Zone home (368 SCSS lines) |
| `/practice-zone/module-detail` | `PracticeZone/pages/ModuleSkills` | Per-module practice detail (202 lines) |

---

## SCSS files (6)

| File | Lines | Purpose |
|---|---:|---|
| `pages/Home/practiceZone.module.scss` | 368 | Home page layout |
| `components/worksheetStep/workSheetStep.module.scss` | 233 | Step-by-step worksheet UI |
| `pages/ModuleSkills/moduleSkills.module.scss` | 202 | Per-module skill view |
| `components/PracticeSectionHeader/practiceSectionHeader.module.scss` | 184 | Section header pattern |
| `components/milestoneAccordion/milestoneAccordion.module.scss` | 147 | **Already documented as Accordion (Tier 2)** |
| `pages/Home/skeleton/moduleCardSkeleton.module.scss` | 24 | Loading skeleton |

**Total: 6 SCSS modules · 1,158 SCSS lines · 26 unique colors.**

---

## Color findings

26 unique colors — much smaller than NanoSkills (75) or parent-hub (99). Most are already in DC tickets:
- `#4e3bc2` `#6651e4` (DC-005 brand purple)
- `#222a33` (DC-014 dark title)
- `#37255124` (brand-purple alpha — already used in milestoneAccordion bottom border)
- `#7D68FF` (`$light-primary-color`, DC-015 candidate)

The relatively contained color palette suggests Practice Zone was built more recently (post DC-005 awareness) or uses a tighter component library.

---

## Component inventory

### Documented (Tier 2)

- **milestoneAccordion** — already specced as `/components/accordion/`. Source: `PracticeZone/components/milestoneAccordion`.

### NOT documented (5)

| Component | Lines | Priority |
|---|---:|---|
| `practiceZone` page wrapper | 368 | HIGH — page-level layout |
| `workSheetStep` | 233 | HIGH — core practice mechanic |
| `moduleSkills` page wrapper | 202 | MEDIUM — per-module detail |
| `practiceSectionHeader` | 184 | MEDIUM — section header (likely shares SectionHeader concept) |
| `moduleCardSkeleton` | 24 | LOW — loading state |

---

## Priority for documentation

1. **workSheetStep** (233 lines) — the core practice-mechanic component. Likely contains progress, validation, hint patterns reusable elsewhere.
2. **practiceZone page layout** (368 lines) — sets the visual identity for practice flows.
3. **practiceSectionHeader** (184 lines) — compare to legacy SectionHeader for consolidation opportunity.

---

## Method note

```
find src/newDashboard/PracticeZone -name "*.module.scss"
xargs wc -l < scss-list                 # 6 files, 1,158 lines
xargs grep -ohi "#[0-9a-f]{6}"           # 26 unique colors
```

Live extraction shares student-dashboard auth.
