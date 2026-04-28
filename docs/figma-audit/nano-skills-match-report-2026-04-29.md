---
title: Nano Skills home — Component Match Report
date: 2026-04-29
production: EznPshYN5XVc49fQSUOSEQ → Nano/Default (10989:8759, 776 layers, 1440×2868)
dsLibrary: 8eNJf875iY9HISEsczDfOh → Screens / Nano Skills / Screen — /nano-skills (rebuilt as 95:402)
---

# Nano Skills home — Component Match Report

## Match summary

Sampled across 12 sections of the production frame (49 distinct elements assessed):

| Status | Count | % |
|---|---:|---:|
| ✅ Exact match | 11 | 22% |
| ⚠️ Close match (drift) | 24 | 49% |
| ❌ No DS equivalent | 10 | 20% |
| 🔲 CDN image (manual upload required) | 4 | 8% |

**Overall match rate: 71%** (✅ + ⚠️ combined — components/tokens that exist in the DS in some form, even if drift is present).

## Components verified in production

For each DS component used in the rebuild:

| DS component | Used in rebuild | Match quality | Notes |
|---|---|---|---|
| LeftSideBar | ❌ NOT USED — built inline | ⚠️ DRIFT | DS LeftSideBar is 80px collapsed / 280px expanded; production is 240px. Custom rebuild at 240. |
| ProgressBar | ✅ used inline | ⚠️ DRIFT | Production progress bar uses `#11AC69` success green which matches DC-009 candidate |
| Card | ❌ NOT USED — built inline | ⚠️ DRIFT | DS Card has 4 variants; production uses with-image variant but with Montserrat CTAs (DC-039) |
| Chip | ❌ NOT USED | ⚠️ DRIFT | Language chips (English/Vietnamese) — DS Chip exists but uses Bold not Medium font weight |
| ProfileAvatar | ❌ NOT USED — placeholder | 🔲 CDN | Avatar image is CDN-hosted (DC-038) |
| Button | ❌ NOT USED — Montserrat blocks reuse | ❌ MISSING | Production CTAs use Montserrat (DC-039), DS Button uses Nunito |
| SectionHeader | ✅ matched conceptually | ⚠️ DRIFT | Production header uses pure black `#000000` (DC-042) |

**Why so few DS instances were used in the rebuild:** the inline route-content rebuild matches production layer-by-layer. To use DS instances faithfully, the DS components first need:
- Sidebar variant at 240px (DC-040)
- Button variant with Montserrat font (DC-039)
- Card variant with `text/default-pure-black` token (DC-042)
- New gray tokens (DC-043 `#8b98a7`, DC-044 `#a8acb1`, DC-047 `#8499ae`)

Without these, every "use a DS Card here" decision reintroduces drift.

## New DC tickets from this audit

9 tickets surfaced from the production frame walk:

| ID | Severity | Category | Title |
|---|---|---|---|
| DC-039 | high | typography | Montserrat font in production CTAs — not in DS typography |
| DC-040 | medium | system | Sidebar width 240px — DS has 80/280, prod is third value |
| DC-041 | medium | system | DiamondBalanceAlert pattern not in DS library |
| DC-042 | medium | color | Pure black `#000000` for "Most Popular Courses" h2 |
| DC-043 | medium | color | New gray `#8b98a7` for course-card meta |
| DC-044 | low | color | New light gray `#a8acb1` for "Grade 5" subtitle |
| DC-045 | low | system | Decorative ambient-blob backdrop pattern + 394px blur |
| DC-046 | low | system | Active sidebar item has black 1px stroke |
| DC-047 | low | color | New gray `#8499ae` for inactive calendar day labels |

## Already-filed DC overlap (confirmed live in production)

These tickets all surface on this single page — confirming their priority:

- **DC-005** four-way brand purple — both `#4d3bc2` (typo, h1) AND `#6651e4` (in-progress, "View Profile") shipping side-by-side on the same screen
- **DC-008** `#4D3BC2` typo — used for the "Nano Skills" page heading itself
- **DC-014** `#222a33` near-black — appears on every text label (sidebar items, course titles, profile name, etc.) — 14+ instances on one page
- **DC-016** `#f8f7fa` lavender bg — on active sidebar item
- **DC-034** SelfPacedBanner gradient — confirmed on Self-Paced Courses hero
- **DC-038** CDN images — logos, avatars, badges, BrightBuddy

## Manual actions for designer

Before this Figma rebuild can replace the production design, a designer needs to:

1. **Replace IMAGE placeholder frames with real assets** (per DC-038):
   - `sidebar > nav-{explore,learn,assessment,nano-skills,rewards} > icon` — multi-color SVG icons from `src/constants/images.tsx` (HOME_ICON, LEARN icons, etc.)
   - `diamond-alert > diamond-icon` — three_diamonds_img.svg
   - `right-sidebar > profile > avatar` — AVATAR_BOY.webp or production student avatar
   - `course-{gen-ai, personal-money, anti-bullying} > thumb` — course thumbnail images (CDN list at `/surfaces/student/#cdn-gap`)
   - `brightbuddy` (40×40 pulsing circle) — chatbot avatar
   - Logo area inside NavBar — `BRIGHTCHAMPS_LOGO.svg`

2. **Review DC-005 brand purple** decision: production uses BOTH `#4d3bc2` (heading) and `#6651e4` ("View Profile") on the same screen. Brand team must pick one canonical and codemod the rest.

3. **Confirm gradient DC-034** on SelfPaced card — is it a one-off marketing asset, or does it warrant a `gradient/*` token collection?

4. **Confirm Montserrat usage** (DC-039): is it intentional (different family for CTAs) or accidental (component imported from another design)? If intentional → add `font/family/secondary` token to DS. If accidental → codemod every CTA to Nunito.

## Recommended DS library updates

For each ⚠️ DRIFT item, what to update to close the gap:

| Drift | DS update |
|---|---|
| Sidebar 240px | Add `chrome/sidebar-medium = 240px` token + LeftSideBar variant |
| `#000000` h2 | Either add `text/default-pure-black` token OR codemod the h2 to use `text/default = #0d1d2d` |
| `#8b98a7` / `#a8acb1` / `#8499ae` | Tokenize as `text/muted-light` and `text/muted-lighter`, OR consolidate to existing neutral ramp |
| Active sidebar black-stroke | Add boolean `activeBorder` to LeftSideBar variant |
| `#51667b` body color | Add `text/muted-warm` OR consolidate to text/muted (#3d4d5d) |
| `#2b3742` near-black | Add to DC-014 family — yet another near-black variant |
| 18px Bold heading | Add `font/heading/sm-bold` (currently only 16/600) |
| Decorative blob bg | Either add a `decorative/blob/*` color collection + blur token, or accept as one-off ornament |

## Production fingerprint findings

These details surfaced from the deep walk and inform DS roadmap:

- **776 layers** in a single screen — most are individual VECTOR nodes inside multi-color icons (5+ vectors per nav icon)
- **Multi-font system in production**: Nunito for body/headings, Montserrat for CTAs. DS only ships Nunito.
- **No design tokens used in production**: every color is a hardcoded hex string. The codemod story (DR-001) is the only path to alignment.
- **3 distinct purples on one page**: `#4d3bc2` (h1), `#6651e4` (View Profile), `#722ED1` (designer intent in DS) — DC-005 is live
- **Drop-shadow on root frame** with negative-x sidebar shadow (`-7/4 44`) — unusual; possibly a Figma-only ornament
- **Layer blur 394px** on background blobs — Figma supports up to ~200px reliably; the rebuild caps at 200
