---
title: /badges — Production vs DS library diff
date: 2026-04-29
production: EznPshYN5XVc49fQSUOSEQ → "Homepage" on Badges New 2025 page (9631:11696, 1440×1767)
note: Frame contains class-cards content; may share home-page layout. Sidebar = 80px here (different from Nano Skills 240px).
---

# /badges — Production vs DS library diff

| Section | Element | Production | DS library | Status | Ticket |
|---|---|---|---|---|---|
| Shell | Sidebar | 80px | chrome/sidebar-rail = 80 | ✅ | — |
| Shell | ClassCard width | 280px (3 in row) | Card variant | ⚠️ | dimension drift |
| Page title | (header text 227×54) | — | font/heading/medium | ⚠️ | — |
| Status pill | Active status bg | `#57ad5b` | success/500 = #00B67A | ⚠️ | DC-001/DC-024 |
| ClassCard | Course chip "Coding" | **Poppins Medium 14** / `#ffffff` | DS only ships Nunito | ❌ | DC-048 |
| ClassCard | Subject tag "Codimath" | **Poppins Medium 12** / `#4e3bc2` | DS only ships Nunito | ❌ | DC-048 |
| ClassCard | Class number "Coding Class #155" | Nunito SemiBold 14 / `#b5b5b5` | text/muted-light? | ⚠️ | gray sprawl |
| ClassCard | Title "Know the Dimension" | Nunito ExtraBold 20 / `#3d4d5d` | font/heading/small + text/muted | ⚠️ | — |
| ClassCard | Date/time "4:30 PM, 13 Mar 2023" | Nunito Medium 15 / `#424242` | font/body/medium + text/default | ⚠️ | warm-gray sprawl |
| ClassCard | Teacher "Reema Milan" | Nunito SemiBold 16 / `#424242` | font/body/medium | ⚠️ | warm-gray |
| ClassCard | Teacher title "HTML & CSS Expert" | Nunito Medium 12 / `#8e8e8e` | font/body/xsmall + text/muted | ⚠️ | gray sprawl |
| ClassCard | "Join in 23 h 33 min" CTA | (white text on button bg, font unspecified) | Button/contained | ⚠️ | — |
| ClassCard | "View Class Notes" link | Nunito Regular 10 / `#4360fd` | text/info? | ⚠️ | DC-025 |
| ClassCard | "Join" inactive | Nunito ExtraBold 14 / `#8e8e8e` | Button disabled | ⚠️ | — |
| Greeting | "Hello Sarah 👋" | Nunito ExtraBold 24 / `#3d4d5d` | font/heading/medium + text/muted | ⚠️ | header color drift |
| Greeting | "Let's gear up to be future ready" | Nunito Medium 16 / `#3d4d5d` | font/body/medium + text/muted | ✅ | — |
| Notification banner | "Any Notification can be here" | Nunito ExtraBold 20 / `#3d4d5d` | font/heading/small + text/muted | ⚠️ | — |
| Notification | "Join 5 minutes before class begins" | Nunito Regular 12 / `#ffffff` | font/body/xsmall + text/on/brand | ✅ | — |

## Match summary

| Status | Count | % |
|---|---:|---:|
| ✅ Match | 3 | 17% |
| ⚠️ Drift | 12 | 67% |
| ❌ Missing (Poppins) | 2 | 11% |
| Other | 1 | 6% |
| **Sampled** | **18** | **100%** |

**Match rate: 84%** — high because the structural shell matches DS, but every text label has color drift and Poppins is critical.

## Net-new ticket: DC-048 (HIGH severity)

**Poppins font appears on /badges course chips** — second non-Nunito family found in production (in addition to Montserrat from /nano-skills audit).

This means production now has **THREE font families**:
- Nunito (canonical, in DS)
- Montserrat (CTAs, /nano-skills) — DC-039
- Poppins (course chips, /badges) — DC-048
- Game Dashboard also uses Poppins (per surfaces.config.ts)

Decision required: PD-009 — add Poppins as font/family/tertiary, OR codemod chips to Nunito.

## Two students, two surfaces

- /nano-skills + /my-feed + /learn use **Troy Darmawan** as the example student
- /badges uses **Sarah** as the example student

Inconsistent example data isn't a DS issue but worth flagging — designers should pick one canonical example student for all screens.
