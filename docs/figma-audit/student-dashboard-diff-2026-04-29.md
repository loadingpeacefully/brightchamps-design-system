---
title: Student Dashboard /my-feed — Production vs DS library diff
date: 2026-04-29
production: EznPshYN5XVc49fQSUOSEQ → My Feed (9325:8437, 1440×1065)
dsLibrary: 8eNJf875iY9HISEsczDfOh → Screens / Student Dashboard / /my-feed
---

# Student Dashboard /my-feed — Production vs DS library diff

Top-level: 9 sections, 80 text nodes, **single font family (Nunito)** ✓, 14 distinct text colors.

| Section | Element | Production | DS library | Status | Ticket |
|---|---|---|---|---|---|
| Shell | Sidebar width | 240px | 80/280px | ⚠️ | DC-040 |
| Shell | Right panel | 362×1755 | chrome/right-panel = 460px | ⚠️ | — |
| Course progress card | Title | Nunito SemiBold 20 / `#222a33` | font/heading/small + text/default | ⚠️ | DC-014 |
| Course progress card | Sub-label "Lessons / Quiz / Assignments" | Nunito SemiBold 16 / `#222a33` | — | ⚠️ | DC-014 |
| Course progress card | Numeric values "12/12, 4/6" | Nunito ExtraBold 20 / `#222a33` | — | ⚠️ | DC-014 |
| Course progress card | "100%" / "29.17%" / "0%" badge | Nunito ExtraBold 20 / `#222a33` | font/heading/small | ⚠️ | DC-014 |
| Course progress card | Feature card image overlay text "Speak/Translate App" | Nunito ExtraBold 18 / `#ffffff` | text/on/brand | ✅ | — |
| Comment box | Placeholder "Comment as Troy Darmawan" | Nunito SemiBold 16 / `#8499ae` | — | ❌ | DC-047 |
| Comment box | Teacher name "Teacher Jacob" | Nunito ExtraBold 16 / `#4d4d4d` | text/default = #0d1d2d | ⚠️ | gray sprawl |
| Comment box | Teacher title | Nunito Regular 12 / `#7d8892` | — | ❌ | DC-050 |
| Comment box | Timestamp "4 min" | Nunito Regular 12 / `#7d8892` | — | ❌ | DC-050 |
| Comment box | Body | Nunito SemiBold 16 / `#3d4d5d` | font/body/medium + text/muted | ✅ | — |
| Feed accent | Magenta highlight | `#d227ba` | none | ❌ | DC-049 |
| Feed accent | Pink highlight | `#e866ff` | none | ❌ | DC-049 |
| Feed accent | Coral status | `#f76969` | error/300 area? | ⚠️ | DC-051 |
| Feed accent | Electric blue | `#409cf2` | info family | ⚠️ | DC-051 |
| Feed | Brand purple | `#4e3bc2` | text/brand = #722ED1 | ⚠️ | DC-005 |

## Match summary

| Status | Count | % |
|---|---:|---:|
| ✅ Match | 2 | 11% |
| ⚠️ Drift | 11 | 61% |
| ❌ Missing / no token | 5 | 28% |
| 🔲 CDN | (course thumbs, comment avatars) | n/a |
| **Sampled** | **18** | **100%** |

**Match rate: 72%**

## New tickets (DC-049, DC-050, DC-051)

- DC-049: Magenta `#d227ba` + pink `#e866ff` — feed-accent palette not in DS
- DC-050: Multiple grays on one page (`#4d4d4d`, `#7d8892`, `#7e858d`, `#51667b`, `#28333e`)
- DC-051: Electric blue `#409cf2` + coral `#f76969` for course-progress accents
