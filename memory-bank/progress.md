# Progress

## What works
- [x] Project scaffold, CLAUDE.md, memory-bank, 8 ADRs, PRD
- [x] TypeScript types (src/types/index.ts) with DriftStatus/MatchMethod + tier helpers
- [x] `npm run typecheck` clean
- [x] `.env` / `.env.example` / `.gitignore` scaffolded
- [x] `.playwright-auth/` directory + storageState auth mechanism
- [x] **Figma tree-walk extractor** with page allowlist, frequency-ranked tokens
- [x] **Canonical ledger tiering** (ADR-0008) — color ΔE<5, typography rank-based, shadow ±4px
- [x] `npm run ledger:status` / `build` / `publish:css` working
- [x] CSS publisher — per-property typography vars, rounded shadow px
- [x] **Playwright DOM extractor** with full-page walk + auth + hydration waits
- [x] **storageState auth** with codegen refresh workflow
- [x] **Value-based drift detector** (ΔE colors, exact-family typography, ±2px sizes)
- [x] **DriftStatus: system-gap** for alpha-hex colors missing from Figma
- [x] **Manual canonicals merge** — `ledger/manual-canonicals.json` survives rebuild
- [x] **First authenticated drift report** — 2026-04-16 student surface

## First authenticated drift — student surface (2026-04-16)
| Type | Match | Drift | Missing | Unknown | Sys-gap |
|------|------:|------:|--------:|--------:|--------:|
| color | 16 | 16 | 59 | 5 | 2 |
| typography | 28 | 16 | 4 | 0 | 0 |
| spacing | 12 | 2 | 0 | 68 | 0 |
| radius | 9 | 3 | 0 | 8 | 0 |

Color match rate 41% exact / 82% within-system-including-drift.
Typography match rate 64% exact / 100% within-family.

## Ledger state (2026-04-16)
```
Total tokens:   3,027
Canonical:      207  (80 color auto + 4 manual overlay/surface + 16 typo auto + 1 typo manual + 10 shadow + 96 other passthrough)
Candidate:      44   (typography 17–60, pre-manual merge)
Deprecated:     2,776
Last built:     2026-04-16T15:42:27.988Z
Manual canonicals: 5 (4 color + 1 typography)
```

## What's in progress
- [ ] Triage 5 unknown colors from 2026-04-16 drift (design team)
- [ ] Landing + teacher Figma IDs (outstanding)
- [ ] Admin URLs + auth (blocked)

## What's left
1. Collect remaining Figma file IDs → extract all Figma surfaces
2. URLs + auth for teacher and admin → full DOM extraction
3. Fix FINDING-006: passthroughTier confidence downgrade for DOM-only types
4. Fix FINDING-007 (verify with per-page URL probe): confirm multi-URL routing works
5. Extend Figma extractor for layout tokens (spacing/padding/radius from frames)
6. Drift review dashboard (Next.js at localhost:3001)
7. `publish:figma` — push canonical tokens back to Figma Variables
8. `brightchamps.design` static site

## Known issues
- **FINDING-001 (HIGH)** — Fractional px in DOM = em/rem-with-non-integer bug
- **FINDING-004 (resolved)** — SPA hydration: added waitForSelector + scroll,
  cannot verify effect until FINDING-007 is resolved
- **FINDING-005 (resolved)** — Manual canonicals survival: fixed via resolver merge
- **FINDING-006 (open)** — Circular DOM-only spacing/radius in ledger:build
- **FINDING-007 (open)** — Identical element counts across student URLs

## Decisions that might need revisiting
- ΔE 5 is CIE76, not CIEDE2000 — acceptable rough bucket, revisit if design team
  flags colors at the ΔE≈5 boundary as wrongly clustered
- Color top-80 threshold — may need to rise when drift feedback lands
- Typography grouping discards line-height/letter-spacing — fine for now; revisit
  if any surface uses 16/600 with two intentional line-heights
