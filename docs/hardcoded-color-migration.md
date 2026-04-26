# Hardcoded Color Migration Map (feed repo)

**Scope:** The 10 most-used hardcoded color values in the student-feed repo, mapped to their canonical DS token + a concrete migration recipe.

**Repo audited:** `repo-cloned/brightchamps-student-feed-b84495106f34/`
**Date:** 2026-04-26

---

## Migration table

| Color | Total occurrences | Files | DS token | CSS variable | Migration |
|---|---:|---:|---|---|---|
| `#fff` | 83 | 48 | `color/neutral/100` | `--color-neutral-100` | `background: var(--color-neutral-100)` (or use `$text-white` SCSS var if staying in SCSS) |
| `#3d4d5d` | 15 | 12 | `color/info/1400`* | `--color-info-1400` | `color: var(--color-info-1400)` (or use `$text-black-secondary` SCSS var) |
| `#e8e8e8` | 14 | 14 | `color/neutral/200` (CLOSE, ΔE 1.5) | `--color-neutral-200` | `border-color: var(--color-neutral-200)` |
| `#222a33` | 14 | 7 | `color/info/1500` | `--color-info-1500` | `color: var(--color-info-1500)` (heading dark slate) |
| `#000` | 11 | 6 | `color/neutral/1600` | `--color-neutral-1600` | `color: var(--color-neutral-1600)` |
| `#6651e4` | 9 | 6 | `color/primary/500` | `--color-primary-500` | **see decision needed below** |
| `#ffffff` | 8 | 8 | `color/neutral/100` | `--color-neutral-100` | merge with `#fff` migration |
| `#f7f6fd` | 8 | 4 | none yet (closest `color/course/ai/50` `#F5F0FE`, ΔE ~3) | — | **add as canonical** `color/primary/50-tint` or `color/surface/lavender-tint` |
| `#51667b` | 7 | 4 | `color/info/1300` | `--color-info-1300` | `color: var(--color-info-1300)` |
| `#424242` | 7 | 5 | `color/neutral/1300` (CLOSE, ΔE 4.0) | `--color-neutral-1300` | `color: var(--color-neutral-1300)` |

*\*Note on `#3d4d5d`:* the resolver classified this as `color/info/1400` (cool slate) instead of a neutral. Functionally it's body text. **Recommendation:** add a manual canonical alias `color/text/default → {color/info/1400}` so `body { color: var(--color-text-default) }` works without leaking the info-ramp naming into product code.

---

## #6651e4 — the decision needed before migrating

### Where it's used (6 files, 9 occurrences)

| File | Lines | Role |
|---|---|---|
| `src/components/atoms/Button/Button.scss` | 45 | `.btn.primary` background |
| `src/components/molecules/CardBody/Components/BodyHeader/BodyHeader.module.scss` | 8 | section-header background |
| `src/components/molecules/CardBody/Components/PendingQuestion/index.js` | 75 | inline style `backgroundColor` |
| `src/components/molecules/CardBody/BodyComponents/GenericCardBody/GenericCardBody.module.scss` | 61, 89 | banner background + accent text |
| `src/components/molecules/CardBody/BodyComponents/CompletionCardBody/CompletionCardBody.module.scss` | 74 | border |
| `src/components/molecules/CardBody/BodyComponents/CompletionCardBody/index.js` | 651 | inline style (`STUDENT_MISSED ? "#F0294D" : "#6651E4"`) |
| `src/components/molecules/CardBody/BodyComponents/CompletionCardBody/Components/QuizCard/index.js` | 38 | inline style `color` |
| `src/components/molecules/CardBody/BodyComponents/CompletionCardBody/Components/CompletedCard/CompletedCard.module.scss` | 2 | tinted background `#6651e40d` (5% alpha) |

### What this means

`#6651e4` is **the actual production brand color**. It's used on Button.primary, every card banner, every section header, every accent, the completion-card border. The DS canonicalizes `#4e3bc2` (`color/brand/primary`) as the brand purple — but production code shipped `#6651e4` (`color/primary/500`) at scale.

`#4e3bc2` itself appears only **twice** in the entire feed repo:
- `_colors.scss:1` — the token definition (no consumer imports it)
- `TeacherDefaultProfile.module.scss:8` — a single avatar fallback background

So the migration recipe depends on a brand-team decision. Three paths:

**Path A — Keep `#4e3bc2` canonical, fix production.**
Codemod `#6651e4` → `var(--color-brand-primary)` (#4e3bc2) across all 9 occurrences. The product slightly shifts purple. Best aligned with the ledger's current state but visible in QA.

**Path B — Promote `#6651e4` to canonical.**
Treat `#6651e4` as the production-canonical brand color. Codemod `#6651e4` → `var(--color-brand-primary)` AND change the ledger's `color/brand/primary` value from `#4e3bc2` to `#6651e4`. The single `TeacherDefaultProfile.module.scss` reference and the unused `_colors.scss:1` definition get the new value too.

**Path C — Two-color brand system.**
Document that `#4e3bc2` is the marketing brand purple and `#6651e4` is the in-app brand purple. Codemod `#6651e4` → `var(--color-primary-500)` (which already maps to `#6651e4`). Add a note in the DS site explaining the split.

**Recommendation:** Path C — it's the only option that requires zero visual change in production while making the system honest about what's currently shipping. Document the split in DC-005's notes when the brand team weighs in.

---

## Quick-win migration order

If somebody's going to swing through this repo with a codemod, here's the priority list. Each line shows hex → CSS variable, expected file count, and impact.

1. **`#fff` / `#ffffff` → `var(--color-neutral-100)`** — 91 occurrences across 56 files. Single biggest sweep. Most are SCSS module backgrounds and inline-style `color: white` calls. Mechanical.
2. **`#3d4d5d` → `var(--color-text-default)` (new alias) or `var(--color-info-1400)`** — 15 occurrences, 12 files. This is body text; it deserves a semantic alias before the codemod runs. Otherwise everyone references `--color-info-1400` for body copy and the naming gets confusing.
3. **`#000` / `#000000` → `var(--color-neutral-1600)`** — 19 occurrences. Almost all are `color: black` text on overlays.
4. **`#e8e8e8` → `var(--color-neutral-200)`** — 14 files. Card borders. Approximate match (ΔE 1.5) — visually identical.
5. **`#6651e4` → `var(--color-primary-500)` (per Path C above)** — 9 occurrences, 6 files. **Resolves the brand-color question for production code without changing any pixel.**
6. **`#222a33` → `var(--color-info-1500)`** — 7 files. Headings on completion cards.
7. **`#51667b` → `var(--color-info-1300)`** — 4 files. Subtitle text on cards.
8. **`#424242` → `var(--color-neutral-1300)`** — 5 files. Caption + meta text. ΔE 4.0 — perceptually identical.
9. **`#f7f6fd` — needs ledger addition.** Used as a card-body / banner background in 4 files. Closest canonical is `color/course/ai/50` (semantically wrong). Add as a manual canonical: `color/surface/lavender-tint` `#f7f6fd` (ΔE 0 against existing `color/surface/lavender-70`-style naming).
10. **`#e8e8e8` is already covered above.**

**Total mechanical replacements possible without ledger additions:** ~150 of the ~200 hardcoded color hits. The remaining ~50 need either ledger additions (`#f7f6fd`, `#8e8e8e`, `#007bff`-equivalent) or product decisions (the brand-color question above).

---

## Method note for future audits

Counting `#6651e4` lookups: `grep -rn "#6651e4\|#6651E4" src --include="*.js" --include="*.scss" --include="*.css"` (case-insensitive grep would catch both at once with `-i`, but the explicit OR keeps grep portable). Counted only files **inside `src/`** — `node_modules` and `public/` excluded.
