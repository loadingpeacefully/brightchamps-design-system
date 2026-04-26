# Three Pre-Deploy Checks — Verification

**Date:** 2026-04-26
**Status:** ALL THREE CHECKS PASS — ready to deploy.

| # | File | Verifies |
|---|---|---|
| 01 | [01-color-info-400-with-override-note.png](2026-04-26-three-checks/01-color-info-400-with-override-note.png) | **CHECK 1.** `color/info/400` swatch shows: value `#3b9af5` (not `#15e8ff`), CANDIDATE tier badge (confidence 0.60, not canonical), description ends with "Overrides auto-extracted #15e8ff (see DC-010)." Override entry added to `ledger/deprecated.json` (174 total entries, +1). |
| 02 | [02-generate-empty-with-gear-icon-and-new-prompts.png](2026-04-26-three-checks/02-generate-empty-with-gear-icon-and-new-prompts.png) | **CHECK 2 + 3.** Gear icon now lives top-right of the left panel (next to "Generate a component"). Three example prompts updated to the exact specified strings: "A lesson progress card showing 60% completion, course name 'Introduction to Python', and a Continue button" / "A primary CTA button with loading and disabled states using brand purple" / "A navigation item showing active lesson with icon, title, and completion badge". |
| 03 | [03-generate-key-panel-with-save-button.png](2026-04-26-three-checks/03-generate-key-panel-with-save-button.png) | **CHECK 2.** Clicking the gear opens an inline panel with: label "Anthropic API key", password input with placeholder `sk-ant-...`, brand-primary **Save** button (clicking persists to `localStorage` and shows a 1.5s "Saved" confirmation), note text "Key stored locally. Never sent to any server except api.anthropic.com." (verbatim from spec). |

## What changed

### Check 1 — color/info/400 override indicator
- `ledger/tokens.json` description updated to end with "Overrides auto-extracted #15e8ff (see DC-010)."
- `ledger/deprecated.json` gains the override entry (from / to / cssFrom / cssTo / reason)
- `tokens.css` and `tokens.generated.ts` regenerated; the swatch description renders the override note

### Check 2 — API key gear icon
- `GeneratorClient.tsx`: replaced the bottom-of-panel "Set Anthropic API key" text-button with a top-right gear button (lucide `Settings` icon)
- Added a `keyDraft` state so typing into the input doesn't immediately save (explicit Save action now)
- Save button shows ✓ Saved confirmation for 1.5s
- Note text changed to verbatim spec: "Key stored locally. Never sent to any server except api.anthropic.com."
- "API key required" error path auto-opens the key panel and updates the error message to "Click the gear icon to set it"

### Check 3 — example prompts
- `EXAMPLE_PROMPTS` constant in `GeneratorClient.tsx` updated to the three exact specified strings (with single quotes around 'Introduction to Python')

## Build state

- `pnpm typecheck`: passed
- `pnpm build`: passed (36 routes, no regressions)
