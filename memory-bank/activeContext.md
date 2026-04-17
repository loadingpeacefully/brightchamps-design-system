# Active Context

> Updated at the start/end of every session. Most volatile file in memory-bank.

## Current phase
**Phase 2: Drift review (first authenticated report shipped)**

## Current focus
First meaningful drift report exists for the student surface against the
authenticated app. Two blockers resolved (auth via storageState, manual
canonicals survival). Moving toward drift review workflow — dashboard not yet
built; drift JSON is directly inspectable.

## What just happened (2026-04-16)
- **Auth fixed via Playwright storageState** — `.playwright-auth/student.json`.
  Student app uses localStorage-based tokens, not cookies alone; `_aat` cookie
  header approach failed silently (kept returning login page). storageState
  captures cookies + localStorage + sessionStorage together.
- **Manual canonicals mechanism built.** `ledger/manual-canonicals.json` now
  survives `npm run ledger:build` via the resolver's merge step. 5 manual
  canonicals currently: 4 color (2 overlay-dark variants + 2 system-gap whites),
  1 typography (typography.17 body regular).
- **First authenticated drift report:** 65 matches, 37 drifts, 5 unknowns
  (color library leak suspects), 2 system-gaps (now added to canonical).
  Colors: 16 exact + 16 near-miss. Typography: 28 exact + 16 drift (all Nunito).
- **FINDING-001 confirmed** as HIGH-priority bug — fractional px sizes in DOM
  reveal em/rem-with-non-integer-multipliers pattern across the app
- **FINDING-006 logged** — circular spacing/radius comparison (see Known Issues)
- **FINDING-007 logged** — identical element counts across student URLs
  (likely SPA shell-with-content-swap, not extractor bug)

## Open questions
- [ ] Landing Figma file ID (still placeholder)
- [ ] Teacher Figma file ID (still placeholder)
- [ ] 5 unknown colors from drift: triage with design team
      (`#4bae4f`, `#6c2bd9`, `#4a3fb4`, `#963e02`, `#ab9dff`)
- [ ] Is `my-feed/courses/profile` really the full student surface, or are
      there course-detail, practice, profile-edit pages we should also crawl?
- [ ] Admin dashboard URLs + auth — still blocked

## Recent decisions
- Auth uses `storageStatePath` in `SurfaceConfig` as the preferred mechanism.
  `cookieEnvKey` / `cookieFormat: 'header'` retained as fallback for surfaces
  that don't use localStorage tokens.
- Manual canonicals file is append-only: new entries override any
  auto-generated canonical with matching name or (type, value). Tracked in
  resolver via `mergeManualCanonicals()`.
- `typography.17` added as canonical (not candidate). Body regular was never
  a candidate — it was a gap. Confidence 0.95.
- `color/overlay/*` and `color/surface/*` semantic naming kept for manually
  added colors — distinguishes them from auto-ranked `color.NN` tokens.

## Known Issues
### FINDING-006: Circular spacing/radius comparison
**Cause:** `passthroughTier` promotes DOM-only tokens to canonical at 0.9
confidence. When drift detection runs, spacing/radius DOM tokens compare
against their own promoted copies in the ledger — DOM matches DOM, not design
intent.
**Effect:** The 12 spacing matches and 9 radius matches in the 2026-04-16
drift report are partially self-referential. The 2 spacing drifts and 3
radius drifts are DOM-vs-DOM near-misses, not drift vs design.
**Fix needed:** downgrade DOM-only spacing/radius to candidate (confidence
0.5) in `passthroughTier` until the Figma extractor walks `layoutMode` /
`itemSpacing` / `cornerRadius` on frames.
**Impact:** treat spacing/radius columns in current drift report as
unverified. Color and typography drift remains real.

### FINDING-007: Identical element counts across student URLs
Three student URLs returned 700/707/707 elements walked, 532 visible each.
Likely SPA shell-with-content-swap pattern; routes change content panels but
not the DOM tree size. Verify with per-page URL probe next session.

### FINDING-001 — fractional px font sizes (HIGH, open)
Confirmed bug. Developers used em/rem with non-integer multipliers; evidence
in drift: 11.223px, 13.333px, 14.4px. Fix in student app CSS.

## Active blockers
- None for student. Landing + teacher Figma file IDs blocking full-surface
  extraction. Admin URLs + auth blocking Phase 1 completion.

## Next session start point
1. Read HANDOFF.md (today's handoff), progress.md, this file
2. Decide: triage unknown colors now, or push toward full multi-surface
   extraction (requires landing + teacher Figma IDs)?
3. Consider FINDING-006 fix — downgrade passthroughTier confidence for
   DOM-only token types that have no Figma canonical counterpart
4. Build drift review dashboard OR wait until all four surfaces are
   extracted?
