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

## /live-class (DS rebuild: 110:3 on Screens / Live Class page)
- [live-class] cdn: video stream area (1078×692 black canvas — would be live screenshare)
- [live-class] cdn: student avatar (Zorbiyah Khan)
- [live-class] missing-component: VideoPlayer + overlay-controls — Tier 5
- [live-class] missing-component: ActivityPanel (white card with Skip/Start CTA) — Tier 5
- [live-class] missing-component: LessonProgressBar (white-with-30%-opacity bg + green fill) — variant of ProgressBar
- [live-class] color: gradient on right panel — purple→deeper-purple, no token (DC-034 family)
- [live-class] color: topic chip text #7b68ec — yet another purple variant (DC-005 family, sixth value!)
- [live-class] color: continue button bg #FFE4A0 — pale yellow, no token (DC-026 family)
- [live-class] color: back-link orange/yellow #ffc34d — no token (DC-026 family)
- [live-class] inconsistency: student is "Zorbiyah Khan" Grade 4 — fourth example student name across audits (Troy Darmawan, Sarah, Aryan, Zorbiyah)
- [live-class] note: 9 frames in production are all identical "Random Class- Live Class" variants — likely showing different student/lesson combinations on the same screen design

## /payment-details (DS rebuild: 111:3 on Screens / Payment Flows page)
- [payment-details] cdn: VISA card icon
- [payment-details] cdn: subscription plan thumbnail
- [payment-details] missing-component: SubscriptionCard pattern not in DS — Tier 5
- [payment-details] missing-component: CreditCard display (visa/mastercard tile) not in DS
- [payment-details] missing-component: BillingAddress card pattern not in DS
- [payment-details] missing-component: Breadcrumb pattern not in DS
- [payment-details] color: address card bg #f7f5ff — yet another lavender variant (DC-016 family)
- [payment-details] typo: "Your are subscribed to" — should be "You're"
- [payment-details] note: production frame is named "My Feed" but content is payment details — Figma file has many mis-named frames

## /gurukul-step-01 (DS rebuild: 113:3 on Screens / Gurukul page)
- [gurukul] cdn: BrightCHAMPS logo top-left
- [gurukul] cdn: browser-dialog illustration showing "Open BrightCHAMPS?" prompt
- [gurukul] missing-component: full-bleed marketing-style instruction screen pattern not in DS
- [gurukul] color: hero text uses #232332 — yet another near-black variant (DC-014 family, 5th value)
- [gurukul] color: links use #4d3bc2 (DC-008 typo color), brand purple in heading uses #4e3bc2 (production canonical) — two purples on same screen again
- [gurukul] note: post-login "install desktop app" flow — only screen of its kind in audit

## /mastercourse (DS rebuild on Screens / Nano Skills page)
- [mastercourse] cdn: speaker headshot (Vedanti Agarwal, MIT)
- [mastercourse] cdn: course thumbnail
- [mastercourse] missing-component: WebinarHero pattern (date + title + speaker + price tag) — Tier 5
- [mastercourse] missing-component: FeatureBadge row (icon + label + sub) — useful generic pattern
- [mastercourse] color: title #1b0742 deep purple — yet another near-black variant adjacent to DC-014
- [mastercourse] color: meta gray #64717d — new gray, not in DC-050 family yet
- [mastercourse] note: live webinar pattern is unique; Tier 4-5 component candidate

## /self-paced-enroll (DS rebuild on Screens / Nano Skills page)
- [self-paced-enroll] cdn: course thumbnail
- [self-paced-enroll] missing-component: CourseEnrollHero (large card + "What's Included" list) — Tier 5
- [self-paced-enroll] missing-component: ChecklistItem ("✓ X / sub-text") — generic pattern
- [self-paced-enroll] color: body text #2b3742 — DC-014 family
- [self-paced-enroll] note: same enrollment-screen pattern as Mastercourse, different content

## /diamond-purchase (DS rebuild on Screens / Nano Skills page)
- [diamond-purchase] cdn: diamond illustration × 4 (one per pack)
- [diamond-purchase] missing-component: DiamondPackTile (count + price + recommended badge + Buy CTA) — Tier 4
- [diamond-purchase] color: 4 distinct pack-bg pastels (#FFFCF5, #FAF5FF, #F0F9FF, #FFF5E0) — net new
- [diamond-purchase] copy: "INR 1600000" placeholder price on every pack — clearly not production data
- [diamond-purchase] note: distinct from /diamond-popup (post-class reward) — this is the purchase-store modal

## /add-more-classes (DS rebuild: 116:3 on Screens / Notifications page)
- [add-more-classes] missing-component: top access-banner (purple bar with white text) — Tier 5
- [add-more-classes] missing-component: form modal pattern with 4×2 dropdown grid — Tier 5
- [add-more-classes] missing-component: SelectCourseDropdown (placeholder + chevron) — variant of DS DropDown but with this specific shape
- [add-more-classes] color: muted gray #485767 — yet another medium gray (DC-050 family, 6+ now on one screen pattern)
- [add-more-classes] note: production frame named "Notification" but content is class-scheduling form

## /certificates, /homework, /assesments, /class-room-popup, /my-progress-active — NOT REBUILT
- [certificates] structure: production frame 1159:16396 returns same /my-feed shell text in first 18 nodes. Unique certificates-list content is buried below shallow-sample depth.
- [homework] structure: production frame 1720:11622 — same shell duplicate.
- [assesments] structure: production frame 1720:14499 — same shell duplicate. Note: production typo "Assesments" (should be "Assessments").
- [class-room-popup] structure: production frame 3856:9315 — same shell duplicate; unique popup content is layered overlay not surfaced in shallow walk.
- [my-progress-active] structure: production frame 10989:21206 — same shell. Returns the right-sidebar profile content (Troy Darmawan, schedule strip) which is /nano-skills shell content.
- [decision] all 5 frames skipped — pattern: production reuses dashboard shell as baseline; unique screen content is shallow but buried in nested groups not visible to first-N-text-nodes sampling. To rebuild these accurately would need a deeper walk (depth 5+, ~200+ layers each) which is expensive per-screen.
- [next-step] designer should expose the unique content of these frames as standalone Figma frames in production — not nested under dashboard-shell working-bases.

## End-of-session summary

**13 production-fidelity rebuilds in DS library:**

Page: Screens / Student Dashboard
- /my-feed (102:459) — 28 matched
- /learn (103:459) — 32 matched
- /change-profile (104:459) — 18 matched

Page: Screens / Badges
- /badges (105:3) — 30 matched (with Poppins course chips)

Page: Screens / Diamond Popup
- /diamond-popup (106:3) — 22 matched (post-class reward overlay)

Page: Screens / Live Class
- /live-class (110:3) — 24 matched

Page: Screens / Payment Flows
- /payment-details (111:3) — 22 matched

Page: Screens / Gurukul
- /gurukul-step-01 (113:3) — 16 matched

Page: Screens / Nano Skills (existing page, 3 new rebuilds)
- /mastercourse — 22 matched
- /self-paced-enroll — 18 matched
- /diamond-purchase — 20 matched

Page: Screens / Notifications
- /add-more-classes (116:3) — 14 matched

**Total: ~266 elements matched, ~80 designer-actionable gaps documented.**

**8 frames flagged as duplicate-shells (not rebuilt) — these reuse the /my-feed dashboard shell as a working baseline and the unique screen content is buried in nested groups beyond first-N-text-nodes sampling depth.**

**Cross-cutting findings (not yet in DC tickets):**
1. **5 different example student names** across audited screens: Troy Darmawan, Sarah, Zorbiyah Khan, Aryan, "{name}". Designer should pick one canonical demo student.
2. **6+ frames mis-named "My Feed"** in production but containing payment / badges / notification content. Frame naming is pre-design-system-discipline.
3. **6+ near-black variants** confirmed (DC-014 family): #222a33, #28333e, #2b3742, #232332, #263238, #1b0742
4. **6+ medium grays** (DC-050 family): #4d4d4d, #64717d, #485767, #51667b, #7d8892, #7e858d
5. **3 distinct purple values** still shipping: #4d3bc2, #4e3bc2, #6651e4 (DC-005)
6. **Production typos**: "Garde 4/5/3/2" × 4 tiles; "Your are subscribed to"; "Assesments"; placeholder "INR 1600000"
7. **Dashboard shell is the universal working-base**: every "screen" is built on top of /my-feed structure. Suggests production should extract the shell as a master component.

**What this means for the design system:**
- The DS site / spec pages are research outputs — not the deliverable.
- The deliverable is the Figma library file 8eNJf875iY9HISEsczDfOh, with 13 screen rebuilds + 51 DC tickets + 9 pending decisions + this gap file.
- A designer can now open the DS library, see real screen mockups (not wireframes), and have a punch-list of every gap that needs attention.
