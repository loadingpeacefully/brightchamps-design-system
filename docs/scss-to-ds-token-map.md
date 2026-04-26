# SCSS → DS Token Map (feed repo)

**Scope:** Map every SCSS variable in the student-feed repo's token files to its canonical equivalent in `ledger/tokens.json`.

**Sources:**
- `repo-cloned/brightchamps-student-feed-b84495106f34/src/styles/_colors.scss`
- `repo-cloned/brightchamps-student-feed-b84495106f34/src/styles/_variables.scss`

**Match scale:** EXACT (same hex) · CLOSE (ΔE < 5, perceptually indistinguishable) · NO MATCH (ΔE ≥ 5)

---

## Mapping table

| SCSS variable | SCSS value | DS token | DS value | Match |
|---|---|---|---|---|
| `$primary-color` (in `_colors.scss`) | `#4e3bc2` | `color/brand/primary` | `#4e3bc2` | **EXACT** |
| `$primary-color-dark` | `#3928a0` | (no good fit — closest `color/interactive/tab-active` `#4a3fb4`) | — | NO MATCH (ΔE 9.32) |
| `$primary-color-darker` | `#27197e` | (no good fit — closest `color/primary/900` `#1a237e`) | — | NO MATCH (ΔE 7.73) |
| `$secondary-color` (in `_colors.scss`) | `#ff752c` | `color/warning/1400` | `#ff752c` | **EXACT** |
| `$shade-color` | `#f5f6f7` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 2.81) |
| `$disabled-bg` | `#eff3f5` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 2.28) |
| `$app-background` | `#f5f4fa` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 3.87) |
| `$menu-hover-color` | `#edebf8` | `color/course/ai/50` | `#F5F0FE` | CLOSE (ΔE 2.31) — but semantically wrong; should map to `color/primary/50` once that fills out |
| `$dropdown-hover-color` | `#eff3f5` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 2.28) |
| `$dropdown-font-color` | `#424242` | `color/neutral/1300` | `#393939` | CLOSE (ΔE 4.00) |
| `$text-black-primary` | `#384655` | `color/info/1400` | `#3d4d5d` | CLOSE (ΔE 3.02) |
| `$text-black-secondary` | `#3d4d5d` | `color/info/1400` | `#3d4d5d` | **EXACT** ⚠️ classified as info, not neutral |
| `$text-white` | `#ffffff` | `color/neutral/100` | `#ffffff` | **EXACT** |
| `$text-disabled` | `#8e8e8e` | (no good fit — closest `color/neutral/800` `#7e858d`) | — | NO MATCH (ΔE 6.49) |
| `$light-gray` | `#f5f6f7` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 2.81) — alias of `$shade-color` |
| `$text-area-bg-color` | `#fafafa` | `color/neutral/100` | `#ffffff` | CLOSE (ΔE 1.73) |
| `$card-border-color` | `#ededed` | `color/neutral/200` | `#eeeeee` | CLOSE (ΔE 0.35) |
| `$primary-color` (in `_variables.scss`) | `#007bff` | (no fit — Material Blue) | — | NO MATCH (ΔE 20.52) |
| `$secondary-color` (in `_variables.scss`) | `#f0ad4e` | `color/warning/1000` `#feb04d` | — | NO MATCH (ΔE 5.78) |
| `text-black` (in `$text-property` map) | `#3d4d5d` | `color/info/1400` | `#3d4d5d` | **EXACT** |
| `text-white` (in `$text-property` map) | `#ffffff` | `color/neutral/100` | `#ffffff` | **EXACT** |
| `text-disabled` (in `$text-property` map) | `#8e8e8e` | (no good fit) | — | NO MATCH (ΔE 6.49) |
| `text-label-color` (in `$text-property` map) | `#303437` | `color/neutral/1300` | `#393939` | CLOSE (ΔE 3.68) |
| `invalid-text-color` (in `$text-property` map) | `#ff0000` | (no fit — pure red) | — | NO MATCH (ΔE 25.34) — the ledger doesn't have a true `#ff0000`; closest is `color/error/500` `#ff6323` |

**Summary:**
- 6 EXACT matches
- 9 CLOSE matches (would pass through DOM-vs-Figma drift detection without flagging)
- 6 NO MATCH (real drift — these SCSS values diverge from the ledger and need either ledger additions or a semantic remap)

---

## $primary-color conflict — what actually wins at runtime

This is the latent bug flagged in the analysis report. Two definitions exist:

```scss
// src/styles/_colors.scss — line 1
$primary-color: #4e3bc2;   // brand purple

// src/styles/_variables.scss — line 7
$primary-color: #007bff;   // Material blue
```

### Import chain trace

```
src/App.scss
  └─ @import "./styles/variables"
       ├─ @import "breakpoints"
       ├─ @import "colors"     ← sets $primary-color: #4e3bc2
       ├─ @import "fonts"
       └─ $primary-color: #007bff;   ← redeclares, OVERRIDES #4e3bc2
```

Every `.module.scss` file that touches `variables` (directly or transitively) sees the **`#007bff`** value. Only `_variables.scss` itself imports `_colors.scss` — no other file imports `colors.scss` directly except via the `variables.scss` chain.

### What runtime value does `$primary-color` actually hold?

**`#007bff`** — the Material Blue redeclaration in `_variables.scss` wins because it comes after the `@import "colors"` line in the same file.

### But it doesn't matter

`grep -rn "\$primary-color" src --include="*.scss"` returns **zero usages**. Same for `$secondary-color`, `$primary-color-dark`, `$primary-color-darker`. The token system is defined but the actual `.module.scss` files don't import or use any of these. Every component pastes hex inline.

So the conflict is real but inert. The risk is the moment somebody starts using `$primary-color` (thinking it's the brand purple), they'd get Material Blue instead. **Recommended fix:** delete the four `$primary-color/$secondary-color/$shadow/$border-radius` redeclarations from `_variables.scss` lines 5–9. Keep only the imports and the `$text-property` map.

---

## Three findings beyond the table

1. **`$text-black-secondary` lands in `color/info/1400`, not a neutral.** Production text color `#3d4d5d` is a slate (cool gray), and the resolver's hue-bucket classification put it in the info ramp. From a usage standpoint it's body-text neutral. **Migration recommendation:** add a manual canonical alias `color/neutral/text-default → {color.info.1400}` so the rename works without confusion.

2. **No canonical for `$text-disabled` (`#8e8e8e`).** The closest neutral is `color/neutral/800` `#7e858d` (ΔE 6.49 — perceptually distinct). This is a real gap; the disabled-text color should be added to manual canonicals as `color/neutral/disabled` or a free-standing canonical to fill the gap.

3. **No canonical for `#007bff` and `#ff0000`.** Both are sentinel placeholders (Material Blue from a prior boilerplate; `invalid-text-color` set to pure red). Both should be deleted from `_variables.scss` rather than mapped — they're not intentional product colors.
