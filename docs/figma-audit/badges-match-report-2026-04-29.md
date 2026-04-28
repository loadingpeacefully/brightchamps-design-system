---
title: /badges — Match Report
date: 2026-04-29
production: 9631:11696 (Homepage on Badges New 2025 page)
---

# /badges — Match Report

**Match rate: 84%** (18 sampled: 3 exact + 12 drift + 2 missing + 1 other).

## Critical finding

**DC-048: Poppins font on course chips** (Coding / Codimath labels). DS only ships Nunito. Production has Nunito + Montserrat (DC-039 from /nano-skills) + Poppins (DC-048 here). Three families total.

PD-009 filed: add Poppins to DS or codemod.

## Sidebar finding

Sidebar = 80px on /badges, 240px on /nano-skills + /my-feed + /learn. Production ships TWO sidebar widths inconsistently.

PD-003 already covers this; data confirms severity.

## Components used in production

- Card (with-image) — class card pattern matches DS Card variant
- Chip — course chips, but Poppins blocks DS reuse
- DashboardLayout — 80px sidebar variant

## Next actions

1. Build CourseChip atom variant with Poppins (or codemod)
2. Confirm sidebar canonical (80 or 240?)
3. Tokenize warm-gray sprawl (`#424242`, `#8e8e8e`, `#b5b5b5`) — DC-050 family
