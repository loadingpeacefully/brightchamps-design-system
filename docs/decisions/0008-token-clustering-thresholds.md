# ADR-0008: Token Clustering Thresholds

## Status
Accepted

## Date
2026-04-15

## Context

The first Figma extraction against the student surface (`Final_Dev_Ready_Screens`,
file `EznPshYN5XVc49fQSUOSEQ`) returned:

- **2,039** distinct colors
- **712** distinct text styles (352 unique family+size+weight combos)
- **110** distinct shadows

The file has no named styles, no variables, and no components — designers applied
every fill / typography / effect as a raw value directly on nodes. This produced
extreme drift: `#ffffff` alone has 55 off-white near-duplicates in use, `#212121`
has 20 near-blacks, most text styles appear as one-off size/weight permutations.

Without clustering, the canonical ledger would contain 2,861 tokens — every
near-duplicate promoted as if intentional. This is the opposite of a design system.

Analysis confirmed a clean Pareto:
- Top 100 colors = 79% of color uses
- **16 typography combos = 80% of text uses**
- 60 combos = 95%

Three ΔE thresholds were evaluated on the color data:
- **ΔE < 2** — near-identical: too conservative, leaves ~1,800 colors
- **ΔE < 5** — same-family: 1,111 colors merge (55%), 87% of uses collapse; white absorbs off-whites, black absorbs near-blacks, intent preserved
- **ΔE < 10** — intentional variant: too aggressive, merges semantically distinct colors (cream into white, blue-gray into mid-gray)

## Decision

Apply the following tiers in the resolver. Non-canonical tokens are **never deleted**
(per ADR-0006) — they are persisted in the ledger with `deprecated: true` and
tracked as merged into their canonical.

### Confidence tiers
The `canonical` field on `LedgerToken` is derived from `confidence`:

| Tier       | Confidence | Behavior                       |
|------------|-----------:|--------------------------------|
| canonical  | ≥ 0.9      | Ships in publish outputs       |
| candidate  | 0.4 – 0.89 | Needs design review            |
| deprecated | < 0.4      | Preserved; not published       |

The field is persisted at build time (rather than computed as a getter) so the
ledger round-trips cleanly through JSON. Helpers `isCanonical`, `isCandidate`,
`isDeprecatedTier` live in `src/types/index.ts`.

### Colors
- Cluster using **CIE76 ΔE*ab < 5**
- Solid hex (#rrggbb) only — alpha variants (#rrggbbaa) stay standalone
- **Top 80 clusters** by combined usage → confidence 0.9 (canonical)
- **Clusters 81+** → confidence 0.2 (deprecated)
- **Non-canonical cluster members** (colors that merged away) → confidence 0.1
  (deprecated), persisted with `raw.mergedInto` pointing to the canonical value

### Typography
- Group by `(fontFamily + fontSize + fontWeight)` — line-height and letter-spacing
  are considered sub-variants within a group
- **Rank 1–16** (80% coverage cutoff) → confidence 1.0 (canonical)
- **Rank 17–60** (95% coverage cutoff) → confidence 0.5 (candidate)
- **Rank 61+** → confidence 0.1 (deprecated)
- Sub-variants of a group → confidence 0.1, persisted with `raw.mergedIntoGroup`
- **Amendment (2026-04-16):** `typography.17` (Nunito 16/400 — body regular) was
  added to canonical via `ledger/manual-canonicals.json` at confidence 0.95.
  DOM drift revealed it as a confirmed system gap (Figma file never captured it
  as a named style, but it is heavily used on the live student app). The
  canonical type scale is now 17 tokens, not 16. Future rebuilds preserve it
  via the manual-canonicals merge step.

### Shadows
- Cluster at **±4 px tolerance** on blur/offset/spread with exact color match
- **Top 10 clusters** → confidence 0.9 (canonical)
- Remaining → confidence 0.2 (deprecated)

## Consequences

**Positive:**
- Canonical ledger is manageable: 80 colors, 16 + 44 typography, 10 shadows
- Drift is traceable — every deprecated token points to the canonical it merged into
- Design team can opt a specific deprecated value back in by adjusting its
  confidence; the ledger is append-only, not destructive

**Negative:**
- CIE76 ΔE is less perceptually accurate than CIEDE2000; colors near the ΔE = 5
  boundary may cluster differently than a designer's eye would. Revisitable.
- Thresholds are heuristic. The top-80 color cut was chosen for coverage (~87%)
  not from a principled usage-frequency knee. If the design team finds colors
  81–100 are actually intentional system values, the threshold should rise.
- Typography grouping discards line-height/letter-spacing variation. If a
  surface genuinely uses `16/600` with two different line-heights intentionally,
  one is demoted to sub-variant and hidden from the canonical scale.

## Revisit triggers

- Once DOM extraction runs (Phase 1 complete), compare cluster shapes — if DOM
  tokens cluster differently from Figma, the extraction noise may not be drift
- If design team flags >5% of candidate typography as "should be canonical",
  raise `TYPO_CANONICAL_TOP_N` from 16 toward 30
- If brand color work adds surfaces beyond student, re-extract and re-cluster;
  thresholds are per-build, not per-surface

## CSS publish encoding (added 2026-04-15)

The ledger stores typography as a JSON signature string so that grouping and
dedup work on a primary key. CSS has no way to consume that as a single custom
property value, so `src/publish/css-tokens.ts` decodes typography into **five
per-property custom properties** per token:

```css
--bc-typography-01-family: Nunito;
--bc-typography-01-size: 16px;
--bc-typography-01-weight: 600;
--bc-typography-01-line-height: 19.2px;
--bc-typography-01-letter-spacing: 0px;
```

Rationale for per-property over `font:` shorthand:
- Preserves letter-spacing (shorthand doesn't)
- Components can compose values individually (size without weight, etc.)
- Matches Shopify Polaris / IBM Carbon conventions
- Downside: 5× variables (16 typography tokens → 80 CSS vars). Acceptable.

Shadows: all px values rounded to **1 decimal place** before emit, to clean up
float-precision artifacts that bleed from Figma (e.g. `8.399999618530273px`
→ `8.4px`).

## References
- ADR-0006 (never auto-resolve drift) — this ADR sits alongside it. Clustering is
  a prep step that reduces drift count; it does **not** resolve drift between
  sources. That still requires human decision.
- Analysis script: `scripts/analyze-figma-extraction.ts` — produces the numbers
  these thresholds are derived from. Re-run when new extractions land.
- Resolver: `src/resolver/index.ts` (tiering pipeline); `src/resolver/cluster.ts`
  (ΔE math + clustering).
- CSS publisher: `src/publish/css-tokens.ts` (per-property typography decode,
  shadow rounding).
