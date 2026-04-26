---
number: 0001
title: Semantic taxonomy migration — frequency-ranked → role-based
status: proposed
date: 2026-04-16
deciders:
  - Suneet Jagdev (PM, primary approver)
  - Design team lead (awaiting)
  - Eng lead (awaiting)
supersedes: []
related:
  - ADR-0005 (DesignToken schema — to be revised if this TDR is accepted)
  - ADR-0008 (Token clustering thresholds — unaffected)
  - ADR-0006 (Never auto-resolve drift — unaffected)
deprecation-window: 90 days
breaking: true
---

# TDR-0001: Semantic taxonomy migration

## Status

**Proposed.** Dry-run migration script executed 2026-04-16; artifacts at
`ledger/tokens.proposed.json` and `ledger/deprecated.proposed.json`. No
destructive writes yet.

## Context

The current ledger uses **frequency-ranked flat names**:

- `color.001`, `color.002`, …, `color.080` (ordered by combined cluster usage)
- `typography.01`, …, `typography.17`
- `spacing.01`, …, `spacing.157`
- `radius.01`, …, `radius.29`
- `shadow.01`, …, `shadow.10`

These names carry **zero semantic information**. `color.008` happens to be
`#4e3bc2` (our brand purple) only because it's the 8th most-used color. A
designer asking "which token is the brand primary?" has to look it up by hex.
A developer reading the CSS can't tell intent from the variable name.

Neighboring design systems solve this with **semantic taxonomies**:

- **Atlassian** uses role-based names like `color.text.brand`, `color.background.accent.blue.bolder`,
  with strict lifecycle enforcement (stable → deprecated → removed).
- **Primer (GitHub)** puts the property first: `--fgColor-default`, `--bgColor-emphasis`.
  This makes misuse visible in IDE autocomplete.
- **Radix Colors** publishes 1–12 numbered ramps per hue with codified
  per-step use cases ("step 9 = solid brand bg, step 11 = body text on step 3").
- **Polaris (Shopify)** carries pairing metadata on each token so tooling can
  warn on inaccessible combinations.

BrightChamps currently ships with **none** of these properties. This TDR
proposes adopting a hybrid: Atlassian's role vocabulary + Primer's
property-first prefix + Radix's per-hue ramps + DTCG 2025.10 as the on-disk
format.

## Decision

Adopt a three-tier taxonomy, DTCG-formatted on disk:

### Tier 1 — Primitives (private)

Raw color ladders keyed by hue bucket. Never referenced directly by product
code. Sorted by luminance ascending within each hue (darkest = `01`).

```
color/brand/purple/{01..N}
color/brand/blue/{01..N}
color/brand/yellow/{01..N}
color/neutral/{01..N}        (light mode scope)
color/feedback/danger/{01..N}
color/feedback/warning/{01..N}
color/feedback/success/{01..N}
color/feedback/info/{01..N}
color/surface/{01..N}        + preserved semantic names (color/surface/lavender-70)
color/overlay/{01..N}        + preserved semantic names (color/overlay/dark)
color/interactive/*          (all semantic, preserved)
```

### Tier 2 — Semantic aliases (public surface)

Property-first names that product code imports. Every alias is a DTCG `{…}`
reference to a primitive.

```
fgColor/{default,subtle,brand,danger,warning,success,info,onBrand,onEmphasis}
bgColor/{default,brand/emphasis,danger/subtle,…}
borderColor/{default,focused,danger,…}
iconColor/{…}                (parallel to fgColor)
```

### Tier 3 — Component tokens (rare)

Only when a component has internal state not expressible in semantic tokens.
Example: `component/button/primary/bg/hovered`. Avoid unless a pattern repeats
across ≥3 components.

### Typography, spacing, radius, shadow

- **Typography**: role-based (`font/heading/{xxsmall..xxlarge}`, `font/body/{xsmall..xlarge}`)
  keyed by size × weight. Collisions disambiguated by suffix `/{size}-{weight}`.
- **Spacing**: multiplier scale on a 4px base. `space/100` = 4px, `space/400` = 16px, `space/1600` = 64px. Mirrors Polaris.
- **Radius**: t-shirt sizes. `radius/{none,xs,sm,md,lg,xl,2xl,3xl,pill,full}`.
- **Shadow**: ranked by usage. `shadow/{01..10}`.

## Dry-run results (2026-04-16)

```
Total tokens in ledger:    3,196
Migrated (new path):       188
Preserved (no clean name): 3,007   ← mostly deprecated cluster members

Source breakdown:
  spacing        157
  color          94
  typography     60
  radius         29
  shadow         10

Proposed groups:
  font           59
  color/feedback 52
  color/neutral  15
  color/overlay  13
  radius         13
  space          12
  shadow         10
  color/brand    7
  color/surface  6
  color/interactive 1

Uncategorized (flagged for review):
  spacing shorthands (e.g. "8px 16px"):  145
  radius shorthands (e.g. "50%"):         16
```

### Representative renames

```
color.080              → color/brand/purple/01       (hue 248, darkest purple)
color.008              → color/brand/purple/02       (#4e3bc2 — BRAND PRIMARY)
color.015              → color/brand/purple/03       (#6651e4 — brand accent)
color.001              → color/neutral/01            (#ffffff, lightest)
color.039              → color/feedback/danger/01
color/surface/lavender-70 → color/surface/lavender-70 (preserved)
color/overlay/dark     → color/overlay/dark          (preserved)
```

Semantic aliases auto-generated where a credible source exists:

```
color/brand/primary       → {color.brand.purple.02}   (#4e3bc2)
fgColor/brand             → {color/brand/primary}
fgColor/default           → {color.neutral.12}        (darkest neutral)
fgColor/subtle            → {color.neutral.09}
borderColor/focused       → {color/brand/primary}
bgColor/brand/emphasis    → {color/brand/primary}
```

## Consequences

### Positive

- **Intent is self-documenting.** `--bc-fgColor-brand` tells you what it is. `--bc-color-008` does not.
- **Dark mode becomes trivial.** Swap the primitive resolutions under `[data-theme='dark']`; all semantic aliases re-resolve automatically.
- **IDE autocomplete becomes a guide.** Typing `fgColor.` in a typed language surfaces only foreground-color choices.
- **DTCG compliance unlocks tooling.** Style Dictionary, Terrazzo, Specify, Tokens Studio (Figma) all speak DTCG 2025.10 natively.
- **Migration table** preserves every old name's resolution — no downstream code breaks silently; ESLint rules can auto-fix.

### Negative / costs

- **Breaking change.** `publish:css` output changes from `--bc-color-001` to `--bc-fgColor-default` et al. Every consumer needs to migrate.
- **The 12-step Radix ramp is aspirational.** Our actual extraction yields 1–7 colors per hue bucket, not 12. The TDR proposes filling gaps via the palette generator (`/tools/palette` in the DS site) before publishing as "official." Until then, numbered steps within each hue are dense, not semantic (step 01 is just "darkest I have").
- **145 spacing values can't be cleanly mapped** — these are CSS shorthands (`"8px 16px"`, `"0px 0px 4px"`, etc.) that encode 2–4 values in one token. FINDING-006 (circular DOM-only extraction) already flags this as a separate issue. Proposed: defer shorthand migration to a follow-up TDR once `detect.ts` distinguishes spacing-shorthand tokens from scalar ones.
- **Typography role mapping is heuristic.** The dry-run assigns `Nunito 16/600` to `font/heading/medium` based on weight ≥ 600. Designers should validate these assignments with real product context.
- **ADR-0005 (DesignToken schema)** needs revision to add DTCG fields (`$value`, `$type`, `$description`, `$extensions`). LedgerToken stays internal; the public ledger becomes DTCG.

## Rollout plan

1. **Review** (this TDR → accepted): design + eng sign-off on the taxonomy, especially the role assignments for typography and the brand-hue clustering.
2. **Promote to ADR** once accepted. Update ADR-0005 with DTCG schema revisions.
3. **Build**: implement `scripts/build-tokens.ts` to emit both legacy (`--bc-color-001`) and new (`--bc-fgColor-brand`) CSS variables during the deprecation window.
4. **Deprecation window (90 days)**: product teams migrate. ESLint plugin `@brightchamps/eslint-plugin-design-system` warns on legacy usage; codemod handles mechanical renames.
5. **Cut over**: after the window, drop legacy output from `publish:css`. Legacy names remain in `ledger/deprecated.json` for audit trail.

## Amendments

### A1 — Luminance floor / ceiling rule for classification (2026-04-16)

**Context:** During review, the first dry-run classified `color.080` (`#000014`)
as `color/brand/purple/01` because HSL reports it at hue 249° with saturation
53%. Visually the color is effectively black — lightness is 0.6%. At perceptual
extremes, hue-based classification is meaningless because the human eye cannot
distinguish hue at very low or very high lightness.

**Rule:** Before hue-based classification runs, apply a luminance floor and
ceiling:

- `L% < 5` → always route to `color/neutral` (regardless of hue / saturation)
- `L% > 97` → always route to `color/neutral`
- Only colors in `5 ≤ L ≤ 97` pass through to the saturation / hue logic

**Result after applying the rule:**

```
color.080 (#000014, L=0.6%)  → color/neutral/15   (was brand/purple/01)
color.008 (#4e3bc2, L=28.5%) → color/brand/purple/01 (unchanged — correct)
```

**Implementation:** Applied in `scripts/migrate-tokens.ts` via the constants
`NEUTRAL_L_FLOOR = 5` and `NEUTRAL_L_CEILING = 97`. Runs before hue dispatch so
extreme-L tokens never reach the hue bucket at all.

**Follow-up consideration:** the threshold is defensible but not empirical. If
design feedback indicates edge cases (e.g. `#000020` at L=1.2% — "we meant this
as a very-dark brand color, not neutral"), we can raise the floor or introduce
a secondary rule that keeps a color in its hue bucket if saturation is ≥ 70%.

### A2 — Dual-emission alias direction during the 90-day window

**Context:** The rollout plan calls for `publish:css` to emit both legacy
(`--bc-color-001`) and new (`--bc-fgColor-brand`) CSS variables during the
deprecation window so product code can migrate incrementally. The direction of
the alias matters: it's easy to wire it backwards and create a silent fork.

**Wrong direction (forks the source of truth):**

```css
/* DO NOT DO THIS */
--bc-color-001: #4e3bc2;                           /* legacy source */
--bc-fgColor-brand: var(--bc-color-001);          /* new refs legacy */
```

If design updates the brand primary by editing `--bc-fgColor-brand`, the change
does not flow to the legacy variable. Product code still on the legacy name
silently keeps the old color. The two variables diverge invisibly.

**Right direction (new is source of truth; legacy is an alias):**

```css
--bc-fgColor-brand: #4e3bc2;                       /* new source */
--bc-color-001: var(--bc-fgColor-brand);           /* legacy aliases new, deprecated */
```

When the window closes, deleting the legacy line is the only change needed.
Nothing silently drifts. Every color update during the window flows through
both variables automatically.

**Implementation note:** `scripts/build-tokens.ts` (not yet written) must emit
variables in this order:

1. Primitive tier: `--bc-color-brand-purple-01: #4e3bc2;`
2. Semantic tier: `--bc-fgColor-brand: var(--bc-color-brand-purple-01);`
3. Legacy aliases: `--bc-color-001: var(--bc-fgColor-brand);` (with a CSS
   comment tagging the deprecation and the replacement name)

**CI enforcement:** add a schema validator that fails the build if any legacy
variable resolves to a hex literal directly (i.e., any `--bc-color-\d+:` line
must be `var(...)`, never `#…`).

### A3 — Naming scheme reconciliation with designer DS (2026-04-26)

**Context:** The designer's system uses flat kebab-case naming:
`color-primary-500`, `color-secondary-500`, `font-heading-xl`. TDR-0001
originally proposed slash-hierarchical: `color/brand/purple/01`. After a
pre-merge audit comparing both systems (`docs/pre-merge-audit.md`), a hybrid
was chosen.

**Decision:** Adopt `color/primary/500` — the designer's semantic hue
vocabulary with our slash-delimited DTCG-compatible hierarchy.

**Rationale:**
- Slash-delimited paths are DTCG-compatible and Figma Variables-ready
- Semantic hue names (`primary` not `purple`) survive brand color changes
  without token renames — if purple becomes blue, `color/primary/500` is
  still valid
- Maps to CSS vars as `--color-primary-500` (readable, standard)
- Matches designer's mental model and how Tailwind/shadcn consumers think
- The designer's vocabulary is adopted exactly: `primary` (Royal Amethyst),
  `secondary` (Golden Aurelia), `neutral` (Metal Grey), `success`, `warning`,
  `error`, `info`, plus course verticals: `coding`, `robotics`, `finance`,
  `ai`, `literature`, `maths`

**Updated naming examples:**

```
color/primary/500     (was: color.008 / earlier proposed: color/brand/purple/01)
color/secondary/500   (was: color.028)
color/neutral/600     (was: color.006)
color/success/500     (was: color.066)
color/course/coding/500  (new — from designer DS)
font/heading/xl       (was: typography.01, now mapped by role)
space/4               (was: spacing.04)
radius/full           (was: radius.11)
```

**Migration status:** DRY-RUN ONLY until design + eng sign-off.
`scripts/migrate-tokens.ts` updated to produce the hybrid naming scheme.

## Alternatives considered

1. **Keep frequency-ranked names; add comments.** Rejected: comments in JSON are ignored by tooling; the problem is the name itself, not documentation around it.
2. **Pure Atlassian taxonomy (`color.text.brand.subtle`)**. Rejected: Atlassian's naming is noun-heavy and verbose. Primer's `fgColor/subtle` is crisper and makes the mistake of using a background color for text visible at a glance.
3. **Pure Radix (`purple.9`)**. Rejected: Radix doesn't distinguish purpose (text vs bg vs border). Combining Radix ramps (primitives) with Primer property prefixes (aliases) gives both.
4. **Full 12-step ramps generated per hue**. Rejected for TDR-0001 scope; proposed as a follow-up once `/tools/palette` ships (would generate the missing ramp steps from a seed hex).

## References

- Atlassian DS: https://atlassian.design/foundations/color
- Primer Primitives: https://primer.style/foundations/primitives/color
- Radix Colors: https://www.radix-ui.com/colors
- Polaris tokens: https://polaris.shopify.com/tokens
- DTCG 2025.10 format: https://design-tokens.github.io/community-group/format/
- Dry-run artifacts: `ledger/tokens.proposed.json`, `ledger/deprecated.proposed.json`
- Migration script: `scripts/migrate-tokens.ts`
