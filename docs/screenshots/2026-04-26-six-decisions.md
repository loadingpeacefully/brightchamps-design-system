# Six Decisions Frozen — Verification Screenshots

**Date:** 2026-04-26
**Scope:** DR-001, DR-002, DR-003 + DC-005 freeze + DC-010 provisional token + Teacher surface row.

| # | File | Shows |
|---|---|---|
| 01 | [01-tools-generate-empty-state.png](2026-04-26-six-decisions/01-tools-generate-empty-state.png) | DR-003 — `/tools/generate/` page. Two-panel layout: left (textarea, 3 dropdowns: Component type / Surface / Output format, full-width brand-primary Generate button, "Set Anthropic API key" toggle). Right (Preview/Code tabs, 3 example prompt buttons that fill the textarea + auto-generate). Both Decisions and AI Generator visible in the sidebar nav with NEW badges. |
| 02 | [02-decisions-page-dr001-dr002-dr003.png](2026-04-26-six-decisions/02-decisions-page-dr001-dr002-dr003.png) | New `/get-started/decisions/` page. DR-001 / DR-002 / DR-003 each rendered as a card with green DECIDED pill, decision date, summary copy, implementation note. DR-001 also shows the newDashboard / sections target buckets with which components fall into each. |
| 03 | [03-whats-new-changelog-with-teacher-pending.png](2026-04-26-six-decisions/03-whats-new-changelog-with-teacher-pending.png) | `/whats-new/` rewritten as a real changelog table (was a ComingSoon stub). 19 entries reverse-chronological. v0.4 freeze items at top, including the PENDING Teacher surface row with "(session cookie required)" note. Per-row kind badges color-coded by type (TDR / DECISION / DRIFT / TOKENS / etc.). |
| 04 | [04-color-info-400-candidate.png](2026-04-26-six-decisions/04-color-info-400-candidate.png) | DC-010 — `color/info/400` swatch on `/foundations/color/`. Shows #3b9af5 with CANDIDATE tier badge (confidence 0.60), description "Paused/in-progress state — mid blue. Used for ProgressBar paused variant." Visible in the Info group as required. |

## What changed in this freeze

### DR-001 — Migration target
- `lib/componentSpecs.ts` interface gains `target: 'newDashboard' | 'sections'`
- Button / ProgressLine / Accordion / Layout → `newDashboard`
- LessonList / GreenLine → `sections`

### DR-002 — ledger:build guard
- `package.json` `ledger:build` script now prepends a `node -e "console.error(...)"` warning before invoking the resolver
- Two-layer guard total: npm script warns, resolver itself requires `--force` to proceed
- Message references DR-002 in `/get-started/decisions/`

### DR-003 — AI Generator
- New `/tools/generate/` page (server wrapper + `GeneratorClient.tsx` client island)
- System prompt built from live `componentSpecs.ts` + brand tokens
- Browser → Anthropic API direct (static export, no backend); user-supplied API key stored in `localStorage`
- Empty state shows 3 example prompts that fill + auto-generate
- Preview tab renders TSX/HTML in a sandboxed iframe with token CSS injected; Code tab shows syntax with copy button

### DC-005 freeze
- `manual-canonicals.json` brand-primary entry: notes prefixed "Frozen at #4e3bc2 as working canonical pending brand team formal override"
- `designer-conflicts-2026-04-26.json` DC-005 action + notes updated to mark FROZEN; pending-confirmation status preserved

### DC-010 provisional token
- `manual-canonicals.json` gains `color/info/400` entry (`#3b9af5`, source: designer, confidence 0.6)
- `ledger/tokens.json` patched in place to replace the auto-extracted #15e8ff with #3b9af5 — preserves token id, kept canonical:true with confidence 0.6 (renders as CANDIDATE tier on the swatch)
- `tokens.css` and `tokens.generated.ts` regenerated; `--color-info-400: #3b9af5` now live
- Note: a fresh `ledger:build` (with `--force`) would re-pull the original auto value; the manual-canonicals entry overrides on the next legitimate rebuild

### Teacher surface row
- `/whats-new/` converted from ComingSoon stub to a real changelog table (19 entries)
- Teacher surface entry: date "TBD", v0.4, SURFACE kind, status PENDING, note "(session cookie required)"

## Build state

- `pnpm typecheck`: passed
- `pnpm build`: passed — **36 routes** (was 34, +2: `/tools/generate` and `/get-started/decisions`)
- All 5 smoke-tested routes return 200
- ledger:build guard fires correctly without `--force` (verified via `node -e` printing the warning text)

## Two implementation notes

1. **`color/info/400` collision.** The slot was already taken by an auto-extracted `#15e8ff`. Per the user's spec the new value goes at `color/info/400`, so I patched the existing token's value (`#15e8ff` → `#3b9af5`), preserving the token id and switching `source` to `designer`. The original value is preserved in the new token's `raw.overriddenFrom` field for audit.
2. **AI Generator API path.** The site is a static export (`next export`) — no backend, no server-side API key. The Generator calls Anthropic from the browser with `anthropic-dangerous-direct-browser-access: true` and the user's own key from `localStorage`. The "Set Anthropic API key" disclosure pattern explains this and stores nothing server-side.
