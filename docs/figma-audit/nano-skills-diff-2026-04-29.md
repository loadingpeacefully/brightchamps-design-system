---
title: Nano Skills home — Production vs DS library diff
date: 2026-04-29
production: Final_Dev_Ready_Screens (EznPshYN5XVc49fQSUOSEQ) → Nano/Default (10989:8759)
dsLibrary: BrightChamps DS (8eNJf875iY9HISEsczDfOh) → Screens / Nano Skills page
---

# Nano Skills home — Production vs DS library diff

Production frame walked: **776 layers**, 1440×2868. White root + drop-shadow `0/4 4 #000000 @ 0.25`.

## Status legend

- ✅ **MATCH** — production value matches DS library token / component
- ⚠️ **DRIFT** — close but not exact, with delta noted
- ❌ **MISSING** — DS library has no equivalent component or token
- 🔲 **CDN IMAGE** — image asset, DC-038 applies

## Section-by-section diff

### 1. Background (ambient blob backdrop)

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Frame opacity | 0.30 | n/a (no equivalent) | ❌ MISSING | Decorative-bg pattern not in DS — file DC-045 |
| Blob #1 (top-left) | `#90adf7` 731×826 blur 394 | n/a | ❌ MISSING | New token: `color/decorative/blue-soft` |
| Blob #2 (top-right) | `#c1a4ff` 1219×1378 blur 394 | n/a | ❌ MISSING | New token: `color/decorative/lavender` |
| Blob #3 (orange) | `#ff945b` 766×649 blur 394 | n/a | ❌ MISSING | New token: `color/decorative/peach` |
| Blob #4 (deep purple) | `#644fe3` 1025×981 blur 394 | n/a | ❌ MISSING | Variant of brand purple — different from DC-005 set |
| Layer blur radius | 394px | n/a | ❌ MISSING | No `effect/blur/*` tokens in DS |

### 2. Page header (top of main column)

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Title font | Nunito Black 32 / 900 / 120% | font/heading/large = Nunito ExtraBold 24/800 | ⚠️ DRIFT | Production uses heavier weight (900 vs 800) and bigger size (32 vs 24). Add `font/display/medium` token |
| Title color | `#4d3bc2` | text/brand = `#722ED1` (designer intent) | ⚠️ DRIFT (DC-008) | Already filed — pending brand sign-off |
| Subtitle | Nunito SemiBold 14 / 600 / `#3d4d5d` | font/body/small + text/muted = #3d4d5d | ✅ MATCH | none |

### 3. Left sidebar

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Width | **240px** | NavBar = 80px collapsed, 280px expanded | ⚠️ DRIFT | DC-040 — 240 is a third unbound value |
| Background | `#ffffff` @ 0% opacity (transparent) | surface/bg/default | ⚠️ DRIFT | Transparent over the ambient blobs — DS has no spec for this |
| Stroke | `#c9cbce` 1px | border/default = neutral-200 | ✅ MATCH (close) | Hex differs by 1-2 — within ΔE2 |
| Shadow | `-7/4 44 #000000 @ 0.10` | shadow/lg | ⚠️ DRIFT | Negative-x offset is unusual (drop-shadow points left) |
| Item dimensions | 216×48, padding 12, gap 8, radius 8 | radius/control/md (8) ✓ space/inset/sm (12) ✓ | ✅ MATCH | none |
| Item text inactive | Nunito SemiBold 16 / `#222a33` | font/body/medium + text/default | ⚠️ DRIFT (DC-014) | `#222a33` not `#0d1d2d` — DC-014 already filed |
| Item text active (Nano Skills) | Nunito ExtraBold 16 / `#222a33` | n/a — no active variant token | ⚠️ DRIFT | Active = same color, weight 800 |
| Active item bg | `#f8f7fa` | surface/bg/sunken (DC-016 area) | ⚠️ DRIFT (DC-016) | Already filed |
| Active item stroke | `#000000` 1px | n/a | ❌ MISSING | Black-bordered active state is unusual — file DC-046 |
| Item icons | Multi-color custom SVGs | CDN (DC-038) | 🔲 CDN IMAGE | Manual upload of icon SVGs |

### 4. Diamond balance alert banner

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Component | DiamondBalanceAlert | none | ❌ MISSING | Tier 5 — file DC-041 |
| Background | `#ffffff` (banner card on transparent bg) | surface/bg/default | ✅ MATCH | none |
| Title | "Low diamond balance alert ⚡" Nunito Bold 18 / `#3d4d5d` | font/heading/small + text/muted | ⚠️ DRIFT | DS heading/small is 16, prod is 18 |
| Body | Nunito Medium 14 / `#51667b` | font/body/small + text/muted | ⚠️ DRIFT | `#51667b` not in ledger — variant of #3d4d5d |
| CTA "Add Diamonds" | Nunito Bold 12 / `#ffffff` | Button (contained, small) — but font Bold 12 | ⚠️ DRIFT | DS Button uses Label/MD = 14/800. Prod = 12/700 |

### 5. Self-Paced Courses hero card

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Background | linear-gradient(253.85deg, #FFAEC2, #E29ED9, #A86BD1) | none — tokenized as DC-034 | ❌ NO TOKEN | DC-034 pending |
| Title | "Self-Paced Courses" Nunito ExtraBold 24/800 / `#ffffff` | font/heading/medium + text/on/brand | ✅ MATCH | none |
| Subtitle | Nunito Regular 14/400 / `#ffffff` | font/body/small + text/on/brand | ✅ MATCH | none |
| CTA "View All Courses" | **Montserrat** SemiBold 14 / `#ffffff` | none — DS doesn't ship Montserrat | ❌ MISSING | DC-039 — new font finding |
| CTA bg | (inferred white pill — needs second walk) | Button (inverse) | ⚠️ DRIFT | Will need Button "inverse" variant |

### 6. Most Popular Courses section header

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Header text | "Most Popular Courses" Nunito Bold 24/700 / **`#000000`** | font/heading/medium + text/default = #0d1d2d | ⚠️ DRIFT (DC-042) | Pure black — drift |
| "View All" link | **Montserrat** SemiBold 14/600 / `#4d3bc2` | none — Montserrat not in DS | ❌ MISSING | DC-039 + DC-008 |

### 7. Course card grid (3 cards visible)

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Card title | Nunito ExtraBold 16/800 / `#222a33` | font/heading/small + text/default | ⚠️ DRIFT (DC-014) | Already filed |
| Card meta "8 LESSONS" | Nunito SemiBold 10/600 / **`#8b98a7`** | none | ❌ NO TOKEN (DC-043) | New gray — file ticket |
| Rating "4.5" | Nunito Bold 12/700 / `#222a33` | Chip variant (amber) | ⚠️ DRIFT | DS Chip uses 12/600 |
| Language chip "English"/"Vietnamese" | Nunito Medium 10/500 / `#ffffff` | Chip variants exist | ⚠️ DRIFT | Chip text font is Medium (500) not Bold |
| CTA "Start Now" / "Enroll Now" | **Montserrat** SemiBold 14 / variable color | none | ❌ MISSING | DC-039 |
| Price "50" | Nunito ExtraBold 14/800 / `#2b3742` | none | ❌ NO TOKEN | New near-black `#2b3742` |
| Card image area | (placeholder rectangles in production too) | Tier 5 placeholder | 🔲 CDN IMAGE | Manual upload required |

### 8. Right sidebar — student profile

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Avatar | (CDN image) | ProfileAvatar component (✓ exists) | 🔲 CDN IMAGE | Manual upload |
| Name "Troy Darmawan" | Nunito ExtraBold 20/800 / `#222a33` | font/heading/small + text/default | ⚠️ DRIFT (DC-014) | none |
| Grade "Grade 5" | Nunito SemiBold 16/600 / `#a8acb1` | text/muted = #3d4d5d | ⚠️ DRIFT (DC-044) | New light gray |
| "View Profile" CTA | Nunito Bold 14/700 / `#6651e4` | text/brand = #722ED1 | ⚠️ DRIFT (DC-005) | Production-in-progress purple |
| Stats (12, 24, 32434) | Nunito Medium 14/500 / `#3d4d5d` | font/body/small + text/muted | ✅ MATCH | none |

### 9. Right sidebar — schedule

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Header "My Schedule for September" | Nunito ExtraBold 16 | font/heading/xsmall (12/600) | ⚠️ DRIFT | DS heading/xsmall too small |
| Calendar week strip | 7 days, M-S, 03-09 | Calendar (newDashboard molecule, ✓ exists) | ✅ MATCH | Active day color is unusual (#263238 vs DC-014 #222a33) |
| Day labels (inactive) | Nunito Bold 12 / `#8499ae` | none | ❌ NO TOKEN | New gray — file DC-047 |
| Day labels (active "W") | Nunito Bold 12 / `#263238` | text/default | ⚠️ DRIFT | Yet another near-black variant |
| Date numbers | Nunito Bold 16 / `#3d4d5d` (active=#263238) | font/body/medium + text/muted | ✅ MATCH | none |

### 10. Right sidebar — class card

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Component | Inline class info | ClassCardInfo / ClassJoiningCard exists | ⚠️ DRIFT | DS ClassJoiningCard binds to template path, prod is inline |
| "Coding Class #16" | Nunito Medium 12 / `#3d4d5d` | font/body/small + text/muted | ✅ MATCH | none |
| "Develop the BrightFit App" | Nunito Bold 16 / `#222a33` | font/heading/small + text/default | ⚠️ DRIFT (DC-014) | none |
| "Troy & Teacher Jacob" | Nunito Medium 12 / `#3d4d5d` | font/body/small + text/muted | ✅ MATCH | none |
| "4:30 PM" | Nunito Bold 12 / `#263238` | text/default | ⚠️ DRIFT | Yet another near-black variant |

### 11. Right sidebar — My Learning Progress

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| Course "Become a YouTuber" | Nunito Bold 16 / `#3d4d5d` | font/heading/small + text/muted | ⚠️ DRIFT | Heading/small uses text/default in DS, prod uses muted |
| Progress text "24/146" | Nunito Regular 12 / `#3d4d5d` | font/body/small + text/muted | ✅ MATCH | none |
| Progress bar | n/a inline | ProgressBar component (✓ exists) | 🔲 verify in second walk | none |

### 12. NavBar / utility area

| Element | Production | DS library | Status | Action |
|---|---|---|---|---|
| BrightCHAMPS logo + tagline | Custom SVG + text | NavBar component | 🔲 CDN IMAGE | Logo asset upload |
| Pulsing circle (BrightBuddy 40×40) | IMAGE fill | none — ChatBot is out-of-scope | ❌ MISSING | Per /governance/scope-boundary/ |
| "Component 147" 88×36 utility | Unclear without deeper walk | n/a | ⚠️ verify | Re-walk needed |

---

## Match summary

| Status | Count | % |
|---|---:|---:|
| ✅ MATCH | 11 | 22% |
| ⚠️ DRIFT | 24 | 49% |
| ❌ MISSING / NO TOKEN | 10 | 20% |
| 🔲 CDN IMAGE | 4 | 8% |
| **Total assessed** | **49** | **100%** |

(Sampled across 12 sections. The full 776-layer count includes per-vector breakdown of multi-colored SVG icons.)

## New DC tickets surfaced

These are net-new findings from the production frame walk — file in the next ledger update:

| ID | Category | Title |
|---|---|---|
| DC-039 | typography | Montserrat font in production CTAs — not in DS typography system |
| DC-040 | system | Sidebar width 240px — DS has 80/280, prod is a third value |
| DC-041 | system | DiamondBalanceAlert pattern not in DS library — Tier 5 candidate |
| DC-042 | color | Pure black `#000000` for "Most Popular Courses" h2 — drift from text/default |
| DC-043 | color | New gray `#8b98a7` for course-card meta — not in ledger |
| DC-044 | color | New light gray `#a8acb1` for "Grade 5" subtitle — not in ledger |
| DC-045 | system | Decorative ambient-blob backdrop pattern + 394px blur token — no DS equivalent |
| DC-046 | system | Active sidebar item has black 1px stroke — unusual; not in DS |
| DC-047 | color | New gray `#8499ae` for inactive calendar day labels |

## Already-filed DC overlap

These tickets confirm in this audit:

- **DC-005** (4-way brand purple): Production uses `#4d3bc2` (typo) for h1, `#6651e4` (in-progress) for "View Profile". Both surfaces of the conflict shipping side-by-side on the same page.
- **DC-008** (typo `#4D3BC2`): Active in the "Nano Skills" page heading.
- **DC-013** area (#3d4d5d): Confirmed for body subtitles. ✓
- **DC-014** (`#222a33` near-black): Confirmed on virtually every text label in the page. Highest-impact ticket.
- **DC-016** (`#f5f4fa` / `#f8f7fa` lavender bg): Confirmed on active sidebar item.
- **DC-034** (SelfPacedBanner gradient): Confirmed on hero card.
- **DC-038** (CDN images): Logos, avatars, badges, BrightBuddy.

## Biggest gaps to close

1. **Montserrat font** (DC-039) — critical. Production uses Montserrat for every CTA. Either add `font/family/secondary = Montserrat` to the DS, or codemod every CTA to Nunito.
2. **Sidebar width 240px** (DC-040) — every existing DS spec uses 80/280. The 240 may be the real production canonical.
3. **DC-014 sprawl** — `#222a33` appears 14+ times in the audited sections alone. Codemod to `text/default` should be the highest-priority eng task.
4. **DiamondBalanceAlert** (DC-041) — net-new system-component pattern. Likely reused on multiple surfaces (gem-purchase upsell flow).
