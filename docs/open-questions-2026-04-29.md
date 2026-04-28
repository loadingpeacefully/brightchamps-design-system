# Open questions — designer handover

Running list of gaps found while rebuilding production screens in the DS library file (8eNJf875iY9HISEsczDfOh). One line per gap. No tickets, no reports — just the work that needs designer attention.

Format: `[screen] [type] [what's missing] [where in DS frame]`

## /my-feed (DS rebuild: 102:459)
- [my-feed] cdn: AVATAR_BOY.webp — right-sidebar profile avatar
- [my-feed] cdn: AVATAR_BOY.webp — comment-box avatar
- [my-feed] cdn: AVATAR_BOY.webp — teacher-thread avatar (Teacher Jacob)
- [my-feed] cdn: course-thumbnail × 3 — course-progress card thumbs (Coding Fundamentals, App Development, Speak/Translate App)
- [my-feed] missing-component: CourseProgressCard pattern not in DS — Tier 5 (3 instances visible)
- [my-feed] missing-component: CommentBox pattern not in DS — Tier 5
- [my-feed] missing-component: CommentThread (teacher reply) pattern not in DS — Tier 5
- [my-feed] color: #d227ba magenta accent — no token (DC-049)
- [my-feed] color: #e866ff pink accent — no token (DC-049)
- [my-feed] color: #409cf2 electric blue progress — no token (DC-051)
- [my-feed] color: #f76969 coral progress — no token (DC-051)
- [my-feed] drift: sidebar 240px — DS NavBar is 80/280 (DC-040)
- [my-feed] drift: heading uses #4d3bc2 — DS canonical is #722ED1 (DC-005)
- [my-feed] drift: text uses #222a33 14× — DS canonical text/default = #0d1d2d (DC-014)
- [my-feed] drift: View Profile uses #6651e4 — DS canonical text/brand = #722ED1 (DC-005)
- [my-feed] drift: 5 grays on one screen (#4d4d4d, #7d8892, #7e858d, #51667b, #28333e) — gray sprawl (DC-050)

## /learn (DS rebuild: 103:459)
- [learn] cdn: feature-card hero image — large 720×696 course thumbnail
- [learn] cdn: course-thumbnail × 5 — same as /my-feed but with 6 cards stacked
- [learn] missing-component: hero-feature CourseCard variant (large with image overlay) not in DS — Tier 5
- [learn] inherits: all /my-feed drifts (DC-005, DC-014, DC-040, DC-044, DC-047, DC-050)
- [learn] note: same shell as /my-feed, longer scroll (2735 vs 1065), 6 card slots vs 3

## /quiz (production: 10143:8366) — NOT REBUILT
- [quiz] structure: production frame named "Quiz" but content is /my-feed shell (same 3 course-progress cards, same right-sidebar, same Troy Darmawan)
- [quiz] missing: actual Quiz UI (question card, answer options, submit button) not visible in production frame at this depth — designer needs to confirm where the quiz interaction lives
- [quiz] decision: rebuild skipped to save MCP budget — same shell as /my-feed (102:459) is a faithful proxy until actual Quiz UI is found

## /change-profile (DS rebuild: 104:459)
- [change-profile] cdn: 4 student avatars — Troy/Zoey/Zack/Peter
- [change-profile] cdn: BrightCHAMPS logo top-left
- [change-profile] missing-component: ProfilePickerTile not in DS — Tier 5
- [change-profile] missing-component: Modal pattern (810×538 centered) not in DS for this size — exists at smaller sizes
- [change-profile] color: pastel avatar bgs #bc8bfc, #fce672, #a7eb7c, peach (4 net-new pastels)
- [change-profile] typo: "Garde 4" / "Garde 5" / "Garde 3" / "Garde 2" — should be "Grade" — production typo on every tile
- [change-profile] drift: text uses #3d4d5d not text/default

## /2_a long variant (production: 8897:8475) — NOT REBUILT
- [2_a-long] structure: same shell as /learn (9342:63313) but 3057px tall vs 2735
- [2_a-long] difference: schedule header says "My Schedule for October" (vs "September" on /learn)
- [2_a-long] difference: right-sidebar is 3154px tall (full-page-scroll variant)
- [2_a-long] decision: rebuild skipped — same content as /learn (103:459) is faithful proxy. Designer should clarify if these two variants are intentional A/B options or a single screen with scroll-state samples.

## /badges (DS rebuild: 105:3 on Screens / Badges page)
- [badges] cdn: notification banner icon
- [badges] cdn: 3× class-card thumbnails
- [badges] cdn: 3× teacher avatars (Reema Milan)
- [badges] missing-component: ClassCard with course-chip + teacher row + CTA + notes-link — Tier 5
- [badges] missing-component: NotificationBanner pattern not in DS
- [badges] font: course chips use Poppins (DC-048) — DS only has Nunito; PD-009 pending
- [badges] color: warm-gray sprawl #424242, #8e8e8e, #b5b5b5 on one screen (DC-050 family)
- [badges] color: green pill #57ad5b (DC-024 fifth-green)
- [badges] color: link blue #4360fd (DC-025 electric blue)
- [badges] color: brand purple #4e3bc2 (DC-005 production canonical, on Codimath chip)
- [badges] inconsistency: greeting "Hello Sarah 👋" — different student name from Troy Darmawan (used on /my-feed, /learn). Designer should pick one canonical example student.
- [badges] drift: sidebar = 80px here, but 240px on /nano-skills + /my-feed + /learn (DC-040)

## /badges My Feed full-scroll (production: 9631:8478) — NOT REBUILT
- [badges-scroll] structure: same /my-feed shell at 5266px scroll height; first 25 texts are course-progress cards (identical to /my-feed)
- [badges-scroll] decision: rebuild skipped — badge-specific content (badge tiles, level progress) is deeper than first 25 texts; would need full-tree walk. /badges Homepage rebuild (105:3) covers the unique upper-fold; this scroll variant is the same data + extra scroll content not visible at this depth.

## /diamond-popup (DS rebuild: 106:3 on Screens / Diamond Popup page)
- [diamond-popup] cdn: tick/checkmark icon — 83×75 in hero card
- [diamond-popup] cdn: three_diamonds_img.svg — 240×240 popup hero illustration
- [diamond-popup] missing-component: ClassJoiningCard with hero purple bg + tick + class details + Join CTA — Tier 2 (highly-reused, on every dashboard)
- [diamond-popup] missing-component: DiamondRewardPopup overlay (right-side 463×791) — Tier 5
- [diamond-popup] color: hero card bg #6651e4 (DC-005 production-in-progress purple)
- [diamond-popup] color: pink achievement banner #e866ff (DC-049)
- [diamond-popup] color: time text #ffda0b yellow — yet another yellow variant not in DC-026 ledger
- [diamond-popup] inconsistency: time text uses yellow #ffda0b on purple bg — accessibility concern (contrast borderline)
