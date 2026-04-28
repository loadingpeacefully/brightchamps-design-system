---
title: NanoSkills Surface Inventory
date: 2026-04-28
status: research-only — sub-surface mapping for Harvard NanoSkills
source: repo-cloned/.../src/newDashboard/NanoSkills
---

# NanoSkills Surface Inventory — 2026-04-28

NanoSkills is a **sub-product surface** inside the student dashboard — Harvard-branded short courses with a distinct visual identity (uses `#f9cf53` communication-yellow as a primary accent). 6 routes, 33 SCSS modules, 6,685 SCSS lines, 75 unique colors.

---

## Routes (6)

| Route | Surface module | Purpose |
|---|---|---|
| `/nano-skills` | `NanoSkills/Pages/Home` | Browse all NanoSkills courses |
| `/nano-skills/[id]` | `NanoSkills/Pages/DiscoverSkillById` | Single skill detail |
| `/nano-skills/skills` | `NanoSkills/Pages/CourseDetails` (variant) | Skills overview |
| `/nano-skills/my-progress` | `NanoSkills/Pages/MyProgress` | Personal progress tracker |
| `/nano-skills/course-detail` | `NanoSkills/Pages/CourseDetails` | Course detail page |
| `/nano-skills/enrichment-classesv2` | `EnrichmentClasses/EnrichmentClassPage` | Enrichment classes (separate sub-folder) |

---

## Structure

```
NanoSkills/
├── BookingModal/                      ← in-flow purchase modals (4 sub-modals)
│   ├── diamondPurchaseSuccessModal
│   ├── inSufficientDiamonds          (499 lines — 2nd-largest)
│   ├── successModal
│   └── sufficientDiamonds
├── LanguageSelector/                  ← language picker
├── OnboardingModal/                   ← multi-section onboarding (5 sections)
│   ├── BenefitSection
│   ├── FinalSection
│   ├── OfferingSection
│   ├── ParentsBenefitsSection
│   └── SkillSection
├── Pages/                             ← page-level surfaces
│   ├── CourseDetails                  (997 lines — LARGEST)
│   │   └── HeroSection/
│   │       ├── Harvard                (313 lines — Harvard-branded hero)
│   │       ├── SelfPaced              (243 lines)
│   │       └── TeacherLed
│   ├── DiscoverSkillById              (325 lines)
│   ├── Home/
│   │   ├── CategoryCard
│   │   ├── CategoryTray
│   │   ├── DiamondPurchaseBanner
│   │   └── FooterCard
│   └── MyProgress
├── SelfPacedHarvardCards              (313 lines)
├── SkillCard                          (414 lines)
└── TeacherLedCard                     (282 lines)
```

**33 SCSS modules · 6,685 total SCSS lines · 75 unique colors.**

Three "modes" of skill delivery (visible in HeroSection sub-folders): Harvard / SelfPaced / TeacherLed — each has its own hero section with different visual treatment.

---

## Color findings

**75 unique colors across NanoSkills.** Sample of patterns:
- **#f9cf53 communication-yellow** (`color/special/communication`) — heavy use on Harvard-branded surfaces
- **DC-005 brand purple sprawl confirmed** — `#4e3bc2`, `#6651e4`, `#4d3bc2`
- **DC-014 dark titles** — `#222a33` confirmed
- **DC-022 Material purples** — likely some of the 75 colors are Material Deep Purples (need full inventory)
- **Harvard accent** — `#a51c30` (Harvard crimson, mentioned in research) likely present on Harvard hero sections

---

## Priority for documentation

1. **CourseDetails** (997 SCSS lines) — single most complex page in NanoSkills. Hero variants (Harvard/SelfPaced/TeacherLed) are likely reusable across other course types.
2. **SkillCard** (414 lines) — the canonical course/skill card pattern. Used across Home, DiscoverSkillById, MyProgress.
3. **BookingModal** family (4 modals, ~1,200+ combined lines) — core monetization flow. Needs verified token bindings.
4. **OnboardingModal** family (5 sections) — first-touch experience for NanoSkills.
5. **Harvard hero variant** — distinct branding that may need its own course-color tokens (currently `color/course/*` doesn't have Harvard-specific theme).

---

## Method note

```
find src/newDashboard/NanoSkills -name "*.module.scss"
xargs wc -l                                # line counts
xargs grep -ohi "#[0-9a-f]{6}"              # color extraction
```

To extract live: needs Playwright auth (shared with student dashboard). Add `nano-skills` URLs to `surfaces.config.ts` student surface list to include in next extraction run.
