# Session Handoff

> This file is updated at the END of every Claude Code session.
> READ THIS FIRST at the start of every new session.

## Current status
**Phase:** 2 — Drift review (first authenticated report shipped)
**Last updated:** 2026-04-16 (end of day)
**Last session:** Unblocked auth (storageState), shipped first real drift
report, added 3 system-gap tokens to canonical.

## What has been done (cumulative)
- [x] Architecture, PRD, 8 ADRs
- [x] Typecheck clean; full pipeline scripts working
- [x] Figma tree-walk extractor (page allowlist, frequency-ranked tokens)
- [x] Canonical ledger tiering (ADR-0008)
- [x] Playwright DOM extractor — full-page walk, hydration waits, storageState auth
- [x] Value-based drift detector with `match`/`drift`/`missing`/`unknown`/`system-gap`
- [x] **Manual canonicals mechanism** — `ledger/manual-canonicals.json` + resolver merge
- [x] **First authenticated drift report** — student surface, 2026-04-16
- [x] 3 system gaps surfaced and added to canonical (2 translucent colors + body regular)
- [x] `CLAUDE.md` has Auth for protected surfaces section with refresh command

## What didn't work today (pre-fix)
- `_aat` cookie-header auth failed — app uses localStorage tokens.
  All prior "authenticated" extractions were login-page DOM. Discarded.
- SPA hydration waits added yesterday didn't move the needle because
  the auth failure meant there was nothing to hydrate.

## Key decisions today
- **Auth default is storageState.** `cookieEnvKey`/`cookieFormat` retained
  as fallback for surfaces that work with plain cookies.
- **typography.17 is canonical, not candidate.** Body regular was a system
  gap, not an intentional omission. Confidence 0.95.
- **Manual canonicals override auto.** On name or (type, value) collision,
  manual wins. Documented in resolver.

## Ledger state (2026-04-16)
```
Total tokens:   3,027
Surfaces:       student
Manual canonicals: 5
  color/overlay/dark        #33333340
  color/overlay/subtle      #0000001a
  color/overlay/white-80    #ffffffcc   ← added today
  color/surface/lavender-70 #edebf9b2   ← added today
  typography.17             Nunito 16px/400  ← added today

By type:
  color         2,059
  typography      756
  shadow          110
  spacing          82 (DOM-only, see FINDING-006)
  radius           20 (DOM-only, see FINDING-006)

Canonical type scale: 17 tokens (16 Figma + 1 manual)
Canonical colors:     84 (80 Figma cluster + 4 manual)
Canonical shadows:    10
```

## Today's drift report

| Type | Match | Drift | Missing | Unknown | Sys-gap |
|------|------:|------:|--------:|--------:|--------:|
| color | 16 | 16 | 59 | 5 | 2 |
| typography | 28 | 16 | 4 | 0 | 0 |
| spacing | 12 | 2 | 0 | 68 | 0 |
| radius | 9 | 3 | 0 | 8 | 0 |

**Color exact match 41% / within-system 82%.**
**Typography exact match 64% / within-family 100%** (all Nunito).

Full report: [ledger/drift/2026-04-16.json](ledger/drift/2026-04-16.json)

## The actual design system (live-confirmed today)
**Top colors rendered correctly in-app:** `#000000`, `#ffffff`, `#3d4d5d`,
`#222a33`, `#8499ae`, `#ffd900` (yellow accent), `#6651e4` (indigo accent),
`#4e3bc2` (brand purple exact), `#51667b`, `#ffffff99`, `#7e858d`, `#95ec2f`
(success green), `#f0294d` (error red).

**Unknown colors flagged for design triage:** `#4bae4f` (likely Material Green
leak), `#6c2bd9` (unknown deep purple), `#4a3fb4` (indigo variant), `#963e02`
(unusual brown), `#ab9dff` (lavender).

**Typography:** Nunito only. All 44 distinct DOM combos are Nunito. 28 hit
canonical exactly; 16 drift by size or weight only.

## Known issues / followups

### HIGH priority
1. **FINDING-001 confirmed** — fractional px in DOM from em/rem with
   non-integer multipliers. 11.2/13.3/14.4px observed. Needs CSS audit in the
   student app. Priority upgraded from MEDIUM to HIGH today — it's
   systematic, not isolated.

### MEDIUM priority
2. **FINDING-006 — circular DOM-only comparison.** `passthroughTier`
   promotes DOM-only spacing/radius to canonical. Today's spacing/radius
   matches partially self-match. Fix: downgrade DOM-only types to
   candidate (confidence 0.5) until Figma extractor walks layout tokens.
3. **FINDING-007 — identical element counts across URLs.** Likely SPA
   shell-with-content-swap. Need per-page `window.location.href` + main
   content probe to verify.
4. **5 unknown colors triage** — design team decision. Add to canonical or
   flag as library leaks in the CSS to remove.
5. **Landing + teacher Figma file IDs** — still placeholders.

### LOW priority
6. **Typography drift "closest canonical" always 16/600** — cosmetic bug in
   detector (first same-family wins, not nearest size/weight).
7. **`Nunito 0px/400` in drift** — crawler visibility filter should reject
   zero font-size.
8. **CIEDE2000** upgrade from CIE76 if design team flags ΔE≈5 edge cases.

## Exact next step
1. Read activeContext.md, progress.md, this file
2. Pick one:
   - **Fix FINDING-006** (30 min) — simple resolver tweak, improves next
     drift report's credibility on spacing/radius
   - **Diagnose FINDING-007** (15 min) — add URL/content probe to crawler,
     confirm per-page routing works
   - **Add landing + teacher Figma IDs** (requires input from Suneet)
   - **Triage the 5 unknown colors** (requires design team input)
   - **Build drift review dashboard** (bigger scope, only after multi-surface)

## Files written today
- `ledger/manual-canonicals.json` (new entries)
- `src/types/index.ts` (DriftStatus system-gap — already existed from yesterday)
- `src/extractors/playwright-crawler.ts` (hydration + storageState)
- `src/resolver/index.ts` (manual canonicals merge)
- `surfaces.config.ts` (`storageStatePath` field; student uses it)
- `CLAUDE.md` (Auth for protected surfaces)
- `docs/PRD.md` (§7 type scale table)
- `docs/decisions/0008-token-clustering-thresholds.md` (typography.17 amendment)
- `docs/session-logs/2026-04-16-findings.md` (new — FINDING-001 confirm,
  FINDING-006, FINDING-007)
- `docs/session-logs/2026-04-16.md` (new — session log)
- `memory-bank/activeContext.md` / `memory-bank/progress.md` (updated)
- `ledger/tokens.json` (rebuilt)
- `ledger/drift/2026-04-16.json` (new drift report)
- `ledger/.extractions/student-dom.json` (rerun, authenticated)
- `.playwright-auth/student.json` (new, gitignored)

## Context that can't be reconstructed from code
- Student live app auth refresh command:
  `npx playwright codegen --save-storage=.playwright-auth/student.json https://champ.brightchamps.com/login/`
- Storage file is 44KB, contains 36 cookies + 19 localStorage keys including
  `parent`, `studentDetails-117`, `tutorial-completed`. Not committed.
- Yesterday's drift report (`ledger/drift/2026-04-15.json`) is login-page
  pollution — still on disk for audit trail but should not be trusted as
  signal
- Student session on `champ.brightchamps.com` is tied to student ID 117
  (parent ID 82). If the session is refreshed with a different student,
  per-student UI variation may shift the tokens extracted
- All 3 URLs returned identical element counts (700/707/707 walked, 532
  visible each). FINDING-007 — likely SPA shell pattern, not bug
- `Parent's Corner` page in Figma file extracted 0 tokens yesterday — may be
  empty placeholder (not blocking, but worth a visual check)
- `#1a237e` (Material Indigo 900) and `#0d47a1` (Material Blue 900) are in
  top 11 canonical colors — flagged as library leaks by Suneet, awaiting
  design team call
