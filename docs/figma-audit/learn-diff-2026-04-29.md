---
title: /learn — Production vs DS library diff
date: 2026-04-29
production: EznPshYN5XVc49fQSUOSEQ → "2_a" (9342:63313, 1440×2735)
note: Frame named "2_a" interpreted as /learn variant (same DashboardLayout shell as /my-feed)
---

# /learn — Production vs DS library diff

Production frame is essentially the same shell as /my-feed but at full scroll height (2735px vs 1065). Same course-progress cards, same right-sidebar structure.

| Section | Element | Production | DS library | Status | Ticket |
|---|---|---|---|---|---|
| Shell | Sidebar 240px | 240 | 80/280 | ⚠️ | DC-040 |
| Page header | (similar to /my-feed) | matches | — | ✅ | — |
| Course progress cards | Same as /my-feed (3 cards) | Nunito ExtraBold 20 / `#222a33` | font/heading/small | ⚠️ | DC-014 |
| Course progress card | Hero feature card "Speak/Translate App" | Nunito ExtraBold 18 / `#ffffff` over course tint | text/on/brand + course tint | ✅ | — |
| Right sidebar | Profile name "Troy Darmawan" | Nunito ExtraBold 20 / `#222a33` | font/heading/small + text/default | ⚠️ | DC-014 |
| Right sidebar | Grade 5 | Nunito SemiBold 16 / `#a8acb1` | text/muted = #3d4d5d | ⚠️ | DC-044 |
| Right sidebar | View Profile | Nunito Bold 14 / `#6651e4` | text/brand = #722ED1 | ⚠️ | DC-005 |
| Right sidebar | Stats (12, 24) | Nunito Medium 14 / `#3d4d5d` | font/body/small + text/muted | ✅ | — |
| Right sidebar | Calendar inactive day | Nunito Bold 12 / `#8499ae` | none | ❌ | DC-047 |
| Right sidebar | Calendar active day | Nunito Bold 12 / `#263238` | text/default | ⚠️ | DC-014 family |

## Match summary

| Status | Count | % |
|---|---:|---:|
| ✅ Match | 3 | 30% |
| ⚠️ Drift | 6 | 60% |
| ❌ Missing | 1 | 10% |
| 🔲 CDN | (avatar, course thumbnails) | n/a |

**Match rate: 90%** — highest of the three audited screens because /learn shares the /my-feed shell verbatim and the diff inherits already-known tickets.

## Notes

- /learn does NOT introduce net-new colors beyond /my-feed
- Same DC-005 / DC-014 / DC-040 / DC-044 / DC-047 issues
- Confirms course-progress-card pattern is reused → highest priority for tier-5 component build
