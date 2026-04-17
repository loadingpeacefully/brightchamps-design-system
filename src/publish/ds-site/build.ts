/**
 * src/publish/ds-site/build.ts
 *
 * brightchamps.design static site generator.
 *
 * Design language (after studying atlassian.design):
 *   - Left sidebar nav with collapsible <details> sections (sticky)
 *   - Dark header, white content area, light-gray token cards
 *   - UI chrome: Inter. Type specimens: Nunito only.
 *   - Brand purple #4e3bc2 as primary accent
 *   - Colors grouped semantically: Brand / Neutral / Feedback / Overlay / Surface / Interactive
 *   - Typography as size × weight matrix
 *   - Surfaces as health dashboard with per-surface progress bars
 *
 * Usage: npm run publish:site
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import path from 'path'
import type { DriftItem, DriftReport, DriftStatus, LedgerState, LedgerToken, Surface } from '../../types/index.js'

const LEDGER_DIR = 'ledger'
const OUT_DIR = 'src/publish/ds-site/dist'
const ALL_SURFACES: Surface[] = ['landing', 'student', 'teacher', 'admin']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function fmtNum(n: number): string { return n.toLocaleString() }
function loadLedger(): LedgerState {
  return JSON.parse(readFileSync(path.join(LEDGER_DIR, 'tokens.json'), 'utf-8')) as LedgerState
}
function loadLatestDrift(): DriftReport | null {
  const dir = path.join(LEDGER_DIR, 'drift')
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json')).sort()
    if (files.length === 0) return null
    const latest = files[files.length - 1]!
    return JSON.parse(readFileSync(path.join(dir, latest), 'utf-8')) as DriftReport
  } catch { return null }
}
function tierOf(t: LedgerToken): 'canonical' | 'candidate' | 'deprecated' {
  if (t.confidence >= 0.9) return 'canonical'
  if (t.confidence >= 0.4) return 'candidate'
  return 'deprecated'
}

// ─── Color math ───────────────────────────────────────────────────────────────

function isAlphaHex(v: string): boolean { return /^#[0-9a-f]{8}$/i.test(v) }
function solidOf(v: string): string { return isAlphaHex(v) ? '#' + v.slice(1, 7) : v }

interface HSL { h: number; s: number; l: number }
function hexToHsl(hex: string): HSL {
  const h = hex.replace('#', '').slice(0, 6)
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  const L = (max + min) / 2
  const S = d === 0 ? 0 : (L > 0.5 ? d / (2 - max - min) : d / (max + min))
  let H = 0
  if (d) {
    if (max === r) H = ((g - b) / d) % 6
    else if (max === g) H = (b - r) / d + 2
    else H = (r - g) / d + 4
    H = H * 60
    if (H < 0) H += 360
  }
  return { h: H, s: S * 100, l: L * 100 }
}

function luminance(hex: string): number {
  const h = solidOf(hex).replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function textOn(hex: string): string {
  return luminance(hex) > 0.55 ? '#212121' : '#ffffff'
}

// ─── Color semantic classification ────────────────────────────────────────────

type ColorGroup = 'brand' | 'neutral' | 'feedback' | 'overlay' | 'surface' | 'interactive'
type FeedbackRole = 'danger' | 'warning' | 'success' | 'info'

// Known brand colors (from the extraction)
const BRAND_HEXES = new Set(['#4e3bc2', '#6651e4', '#4d3bc2', '#1a237e', '#0d47a1'])

function classifyColor(t: LedgerToken): ColorGroup {
  // Name-based classification first — manual canonicals carry semantic names
  if (t.name.startsWith('color/interactive/')) return 'interactive'
  if (t.name.startsWith('color/overlay/')) return 'overlay'
  if (t.name.startsWith('color/surface/')) return 'surface'

  // Value-based for frequency-ranked
  const v = t.value.toLowerCase()
  if (isAlphaHex(v)) return 'overlay'
  if (BRAND_HEXES.has(v)) return 'brand'

  const hsl = hexToHsl(v)
  // Very low saturation → neutral
  if (hsl.s < 15) return 'neutral'
  // Very light tinted → surface
  if (hsl.l > 92) return 'surface'
  // Purple range with strong saturation → brand
  if (hsl.h >= 240 && hsl.h <= 280 && hsl.s >= 35) return 'brand'
  // Otherwise chromatic → feedback
  return 'feedback'
}

function feedbackRole(hex: string): FeedbackRole {
  const { h } = hexToHsl(hex)
  if (h >= 340 || h < 20) return 'danger'    // red / pink
  if (h >= 20 && h < 70) return 'warning'    // orange / yellow
  if (h >= 70 && h < 170) return 'success'   // green
  return 'info'                               // blue / cyan / fallback
}

// ─── Surfaces mentioned in token ──────────────────────────────────────────────

function tokenSurfaces(t: LedgerToken): Surface[] {
  if (t.surfaces && t.surfaces.length > 0) return t.surfaces
  return [t.surface]
}

// ─── Layout: dark header + left sidebar + content ─────────────────────────────

type ActiveNav = 'home' | 'colors' | 'typography' | 'surfaces-student'

function sidebar(active: ActiveNav): string {
  const isActive = (key: ActiveNav): string => active === key ? 'active' : ''
  return `
<aside class="sidebar">
  <details open>
    <summary>Overview</summary>
    <ul>
      <li><a href="./index.html" class="${isActive('home')}">System health</a></li>
    </ul>
  </details>
  <details open>
    <summary>Foundations</summary>
    <ul>
      <li><a href="./colors.html" class="${isActive('colors')}">Color</a></li>
      <li><a href="./typography.html" class="${isActive('typography')}">Typography</a></li>
    </ul>
  </details>
  <details open>
    <summary>Surfaces</summary>
    <ul>
      <li><a href="./surfaces.html" class="${isActive('surfaces-student')}">Student app</a></li>
      <li><a href="#" class="disabled" title="Not yet extracted">Landing</a></li>
      <li><a href="#" class="disabled" title="Not yet extracted">Teacher app</a></li>
      <li><a href="#" class="disabled" title="Not yet extracted">Admin</a></li>
    </ul>
  </details>
  <details>
    <summary>Resources</summary>
    <ul>
      <li><span class="muted small">Source: ledger/tokens.json</span></li>
      <li><span class="muted small">ADR-0006, ADR-0008</span></li>
    </ul>
  </details>
</aside>`
}

function layout(title: string, active: ActiveNav, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · BrightChamps Design System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="./styles.css">
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a href="./index.html" class="brand">
      <span class="brand-dot"></span>
      <span class="brand-name">BrightChamps</span>
      <span class="brand-sub">Design System</span>
    </a>
    <nav class="top-nav">
      <button class="search-trigger" id="search-trigger" type="button" aria-label="Search (⌘K)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
      <span class="version">v0.1 · Phase 1</span>
    </nav>
  </div>
</header>
<div class="app">
  ${sidebar(active)}
  <main class="content" data-pagefind-body>
    ${body}
  </main>
</div>

<!-- Search modal -->
<div class="search-modal" id="search-modal" hidden role="dialog" aria-label="Search">
  <div class="search-backdrop" data-close></div>
  <div class="search-box">
    <div class="search-input-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input id="search-input" type="search" placeholder="Search tokens, foundations, pages…" autocomplete="off" spellcheck="false">
      <kbd>ESC</kbd>
    </div>
    <div id="search-results" class="search-results"></div>
  </div>
</div>

<!-- Right-click copy menu -->
<div class="ctx-menu" id="ctx-menu" hidden role="menu">
  <button class="ctx-item" data-copy-kind="hex" role="menuitem">Copy hex</button>
  <button class="ctx-item" data-copy-kind="css-var" role="menuitem">Copy CSS variable</button>
  <button class="ctx-item" data-copy-kind="token-name" role="menuitem">Copy token name</button>
</div>

<script>
// ─── Copy buttons ─────────────────────────────────────────────────────────────
function copyToClipboard(text, successEl) {
  return navigator.clipboard.writeText(text).then(() => {
    if (successEl) {
      const prev = successEl.textContent
      successEl.textContent = '✓ Copied'
      successEl.classList.add('copied')
      setTimeout(() => { successEl.textContent = prev; successEl.classList.remove('copied') }, 1200)
    }
  })
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn')
  if (btn) {
    const value = btn.getAttribute('data-copy') || ''
    copyToClipboard(value, btn)
    return
  }
  // Click-to-copy on token names
  const nameEl = e.target.closest('.token-name[data-copy-name]')
  if (nameEl) {
    const name = nameEl.getAttribute('data-copy-name') || nameEl.textContent || ''
    copyToClipboard(name).then(() => {
      nameEl.classList.add('copied-flash')
      setTimeout(() => nameEl.classList.remove('copied-flash'), 600)
    })
  }
})

// ─── Right-click context menu ────────────────────────────────────────────────
const ctxMenu = document.getElementById('ctx-menu')
let ctxTarget = null
document.addEventListener('contextmenu', (e) => {
  const card = e.target.closest('.color-card[data-hex]')
  if (!card) return
  e.preventDefault()
  ctxTarget = card
  ctxMenu.style.left = Math.min(e.pageX, window.innerWidth - 200) + 'px'
  ctxMenu.style.top = Math.min(e.pageY, window.innerHeight - 140) + 'px'
  ctxMenu.hidden = false
})
document.addEventListener('click', (e) => {
  if (ctxMenu.hidden) return
  const item = e.target.closest('.ctx-item')
  if (item && ctxTarget) {
    const kind = item.getAttribute('data-copy-kind')
    const hex = ctxTarget.getAttribute('data-hex') || ''
    const name = ctxTarget.getAttribute('data-token-name') || ''
    const cssVar = '--bc-' + name.replace(/[./]/g, '-')
    const toCopy = kind === 'hex' ? hex : kind === 'css-var' ? 'var(' + cssVar + ')' : name
    copyToClipboard(toCopy).then(() => {
      item.classList.add('copied')
      setTimeout(() => {
        ctxMenu.hidden = true
        item.classList.remove('copied')
      }, 600)
    })
  } else if (!e.target.closest('#ctx-menu')) {
    ctxMenu.hidden = true
    ctxTarget = null
  }
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !ctxMenu.hidden) { ctxMenu.hidden = true; ctxTarget = null }
})

// ─── Pagefind ⌘K search ──────────────────────────────────────────────────────
const searchModal = document.getElementById('search-modal')
const searchInput = document.getElementById('search-input')
const searchResults = document.getElementById('search-results')
let pagefind = null
async function ensurePagefind() {
  if (pagefind) return pagefind
  try {
    pagefind = await import(/* webpackIgnore: true */ './_pagefind/pagefind.js')
    await pagefind.options({})
    return pagefind
  } catch (err) {
    searchResults.innerHTML = '<div class="search-error">Search index not available. Run <code>npm run publish:site</code> to rebuild.</div>'
    return null
  }
}
function openSearch() {
  searchModal.hidden = false
  setTimeout(() => searchInput.focus(), 30)
  ensurePagefind()
}
function closeSearch() {
  searchModal.hidden = true
  searchInput.value = ''
  searchResults.innerHTML = ''
}
document.getElementById('search-trigger').addEventListener('click', openSearch)
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch() }
  if (e.key === 'Escape' && !searchModal.hidden) closeSearch()
})
searchModal.addEventListener('click', (e) => {
  if (e.target.dataset.close !== undefined) closeSearch()
})
let searchDebounce
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce)
  const q = searchInput.value.trim()
  if (!q) { searchResults.innerHTML = ''; return }
  searchDebounce = setTimeout(async () => {
    const pf = await ensurePagefind()
    if (!pf) return
    const search = await pf.search(q)
    if (search.results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">No results for <strong>' + q.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[c]) + '</strong></div>'
      return
    }
    const items = await Promise.all(search.results.slice(0, 10).map(r => r.data()))
    searchResults.innerHTML = items.map(item => {
      const excerpt = (item.excerpt || '').replace(/<mark>/g, '<mark>').replace(/<\\/mark>/g, '</mark>')
      return '<a class="search-hit" href="' + item.url + '"><div class="search-hit-title">' + (item.meta?.title || item.url) + '</div><div class="search-hit-excerpt">' + excerpt + '</div></a>'
    }).join('')
  }, 120)
})
</script>
</body>
</html>`
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

function surfacePills(surfaces: Surface[]): string {
  if (!surfaces || surfaces.length === 0) return ''
  return `<span class="surface-pills">${surfaces.map(s => `<span class="surface-pill">${esc(s)}</span>`).join('')}</span>`
}

function tierBadge(tier: 'canonical' | 'candidate' | 'deprecated'): string {
  return `<span class="tier-badge tier-${tier}">${tier}</span>`
}

// ─── Token card ───────────────────────────────────────────────────────────────

function renderColorCard(t: LedgerToken): string {
  const hex = t.value
  const solid = solidOf(hex)
  const fg = textOn(hex)
  const tier = tierOf(t)
  const uses = t.usageCount !== undefined ? fmtNum(t.usageCount) : '—'
  const surfaces = tokenSurfaces(t)
  const isAlpha = isAlphaHex(hex)
  const styleBg = isAlpha ? hex : solid

  return `
<article class="token-card color-card" data-hex="${esc(hex)}" data-token-name="${esc(t.name)}" title="Right-click for copy options" data-pagefind-meta="category:color">
  <div class="color-preview ${isAlpha ? 'alpha' : ''}" style="--swatch:${esc(styleBg)}; --fg:${fg}">
    <span class="color-hex">${esc(hex)}</span>
  </div>
  <div class="token-body">
    <div class="token-name" data-copy-name="${esc(t.name)}" tabindex="0" role="button" aria-label="Copy token name ${esc(t.name)}">${esc(t.name)}</div>
    <div class="token-meta">
      ${tierBadge(tier)}
      <button class="copy-btn" data-copy="${esc(hex)}" aria-label="Copy hex value">Copy hex</button>
    </div>
    <dl class="token-attrs">
      <div><dt>Usage</dt><dd>${uses}</dd></div>
      <div><dt>Confidence</dt><dd>${t.confidence.toFixed(2)}</dd></div>
    </dl>
    ${surfacePills(surfaces)}
  </div>
</article>`
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function renderHome(ledger: LedgerState, drift: DriftReport | null): string {
  const canonical = ledger.tokens.filter(t => t.canonical)
  const candidate = ledger.tokens.filter(t => !t.canonical && t.confidence >= 0.4 && !t.deprecated)
  const deprecated = ledger.tokens.filter(t => t.deprecated)

  const canonByType: Record<string, number> = {}
  for (const t of canonical) canonByType[t.type] = (canonByType[t.type] ?? 0) + 1

  const driftByStatus = drift?.byStatus ?? null

  return `
<div class="page-hero">
  <h1>System health</h1>
  <p class="lede">A snapshot of the BrightChamps token system — what's canonical, what's drifting, and what's missing. Data is sourced from <code>ledger/tokens.json</code> and the latest drift report.</p>
</div>

<section class="section">
  <h2 class="section-title">Token totals</h2>
  <div class="kpi-grid">
    <div class="kpi kpi-primary">
      <div class="kpi-label">Canonical</div>
      <div class="kpi-value">${fmtNum(canonical.length)}</div>
      <div class="kpi-sub">Approved for use</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Candidate</div>
      <div class="kpi-value">${fmtNum(candidate.length)}</div>
      <div class="kpi-sub">Awaiting review</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Deprecated</div>
      <div class="kpi-value">${fmtNum(deprecated.length)}</div>
      <div class="kpi-sub">Preserved, not published</div>
    </div>
    <div class="kpi">
      <div class="kpi-label">Total tokens</div>
      <div class="kpi-value">${fmtNum(ledger.tokens.length)}</div>
      <div class="kpi-sub">Ledger ${esc(ledger.lastBuilt.slice(0, 10))}</div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Canonical by type</h2>
  <div class="type-chips">
    ${Object.entries(canonByType).sort((a, b) => b[1] - a[1]).map(([type, n]) => `
      <div class="type-chip">
        <span class="type-chip-name">${esc(type)}</span>
        <span class="type-chip-count">${n}</span>
      </div>`).join('')}
  </div>
</section>

${drift ? `
<section class="section">
  <h2 class="section-title">Drift distribution</h2>
  <p class="muted small">Latest report: ${esc(drift.generatedAt.slice(0, 10))} · ${fmtNum(drift.totalItems)} items · surfaces ${drift.surfaces.map(esc).join(', ')}</p>
  <div class="drift-grid">
    ${renderDriftKpi('match', driftByStatus?.match ?? 0, 'Ships correctly')}
    ${renderDriftKpi('drift', driftByStatus?.drift ?? 0, 'Close but off canonical')}
    ${renderDriftKpi('missing', driftByStatus?.missing ?? 0, 'Canonical not seen')}
    ${renderDriftKpi('unknown', driftByStatus?.unknown ?? 0, 'Not in system')}
    ${renderDriftKpi('system-gap', driftByStatus?.['system-gap'] ?? 0, 'Should be added')}
  </div>
</section>
` : ''}

<section class="section">
  <h2 class="section-title">Explore</h2>
  <div class="nav-cards">
    <a class="nav-card" href="./colors.html">
      <div class="nav-card-kicker">Foundations</div>
      <div class="nav-card-title">Color</div>
      <div class="nav-card-sub">${canonByType['color'] ?? 0} canonical colors across brand, neutral, feedback, overlay, surface, and interactive roles</div>
    </a>
    <a class="nav-card" href="./typography.html">
      <div class="nav-card-kicker">Foundations</div>
      <div class="nav-card-title">Typography</div>
      <div class="nav-card-sub">${canonByType['typography'] ?? 0} type tokens · Nunito across 6 sizes and 5 weights</div>
    </a>
    <a class="nav-card" href="./surfaces.html">
      <div class="nav-card-kicker">Surfaces</div>
      <div class="nav-card-title">Health dashboard</div>
      <div class="nav-card-sub">Per-surface drift status, match rate, and actionable items</div>
    </a>
  </div>
</section>`
}

function renderDriftKpi(key: string, value: number, sub: string): string {
  const label = key.replace('-', ' ')
  return `
<div class="drift-kpi drift-kpi-${key}">
  <div class="drift-kpi-label">${esc(label)}</div>
  <div class="drift-kpi-value">${fmtNum(value)}</div>
  <div class="drift-kpi-sub">${esc(sub)}</div>
</div>`
}

// ─── Colors ───────────────────────────────────────────────────────────────────

function renderColorGroupSection(title: string, subtitle: string, tokens: LedgerToken[]): string {
  if (tokens.length === 0) return ''
  return `
<section class="section">
  <div class="section-head">
    <h2 class="section-title">${esc(title)}</h2>
    <span class="section-count">${tokens.length}</span>
  </div>
  <p class="muted small">${esc(subtitle)}</p>
  <div class="token-grid">
    ${tokens.map(renderColorCard).join('')}
  </div>
</section>`
}

function renderColors(ledger: LedgerState): string {
  const colors = ledger.tokens.filter(t => t.type === 'color' && t.canonical)
  const groups: Record<ColorGroup, LedgerToken[]> = {
    brand: [], neutral: [], feedback: [], overlay: [], surface: [], interactive: [],
  }
  for (const t of colors) groups[classifyColor(t)].push(t)

  // Sort each group sensibly
  groups.brand.sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  groups.interactive.sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  groups.neutral.sort((a, b) => luminance(b.value) - luminance(a.value))
  groups.surface.sort((a, b) => luminance(b.value) - luminance(a.value))
  groups.overlay.sort((a, b) => {
    // alpha ascending, then luminance
    const aA = isAlphaHex(a.value) ? parseInt(a.value.slice(-2), 16) : 255
    const bA = isAlphaHex(b.value) ? parseInt(b.value.slice(-2), 16) : 255
    return aA - bA
  })
  // Feedback: sub-group by role then by usage
  const feedbackByRole: Record<FeedbackRole, LedgerToken[]> = { danger: [], warning: [], success: [], info: [] }
  for (const t of groups.feedback) feedbackByRole[feedbackRole(solidOf(t.value))].push(t)
  for (const role of Object.keys(feedbackByRole) as FeedbackRole[]) {
    feedbackByRole[role].sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  }

  const feedbackSections = (Object.keys(feedbackByRole) as FeedbackRole[])
    .filter(r => feedbackByRole[r].length > 0)
    .map(role => `
<section class="subsection">
  <div class="subsection-head">
    <h3 class="subsection-title">${esc(role)}</h3>
    <span class="section-count">${feedbackByRole[role].length}</span>
  </div>
  <div class="token-grid">
    ${feedbackByRole[role].map(renderColorCard).join('')}
  </div>
</section>`).join('')

  return `
<div class="page-hero">
  <h1>Color</h1>
  <p class="lede">${colors.length} canonical colors across six semantic roles. Frequency-ranked tokens come from the Figma extraction; named tokens (<code>color/overlay/*</code>, <code>color/interactive/*</code>, etc.) were added through drift review.</p>
</div>

${renderColorGroupSection(
  'Brand',
  'The BrightChamps identity — purples that define the product. These are the colors that make the product feel like BrightChamps.',
  groups.brand,
)}

${renderColorGroupSection(
  'Neutral',
  'Whites, grays, and near-blacks. Use for text, surfaces, borders, and structural elements. Ordered from lightest to darkest.',
  groups.neutral,
)}

${groups.feedback.length > 0 ? `
<section class="section">
  <div class="section-head">
    <h2 class="section-title">Feedback</h2>
    <span class="section-count">${groups.feedback.length}</span>
  </div>
  <p class="muted small">Status and semantic colors. Danger for errors and destructive actions; warning for caution; success for positive confirmation; info for neutral notifications.</p>
  ${feedbackSections}
</section>` : ''}

${renderColorGroupSection(
  'Overlay',
  'Translucent colors for modals, scrims, and layered effects. Stored as 8-digit hex (#RRGGBBAA). Composite on top of any content.',
  groups.overlay,
)}

${renderColorGroupSection(
  'Surface',
  'Tinted background colors for cards, containers, and page regions. Usually near-white with a brand-adjacent hue.',
  groups.surface,
)}

${renderColorGroupSection(
  'Interactive',
  'Colors reserved for UI state — hover, active, selected. These carry semantic meaning for interaction.',
  groups.interactive,
)}`
}

// ─── Typography ───────────────────────────────────────────────────────────────

interface TypoSig {
  fontFamily: string | null
  fontSize: number | null
  fontWeight: number | null
  lineHeightPx: number | null
  letterSpacing: number | null
}
function parseTypoValue(v: string): TypoSig | null {
  try { return JSON.parse(v) as TypoSig } catch { return null }
}

function renderTypographyMatrix(ledger: LedgerState): string {
  const typography = ledger.tokens.filter(t => t.type === 'typography' && t.canonical)
  const parsed = typography.map(t => ({ t, sig: parseTypoValue(t.value) })).filter(p => p.sig)

  const sizes = [...new Set(parsed.map(p => p.sig!.fontSize).filter((s): s is number => s !== null))].sort((a, b) => a - b)
  const weights = [...new Set(parsed.map(p => p.sig!.fontWeight).filter((w): w is number => w !== null))].sort((a, b) => a - b)

  // Lookup: size|weight → token
  const cellMap = new Map<string, LedgerToken>()
  for (const p of parsed) {
    const k = `${p.sig!.fontSize}|${p.sig!.fontWeight}`
    // Keep highest-usage token if duplicate family/size/weight
    const existing = cellMap.get(k)
    if (!existing || (p.t.usageCount ?? 0) > (existing.usageCount ?? 0)) cellMap.set(k, p.t)
  }

  const cells = (size: number, weight: number): string => {
    const token = cellMap.get(`${size}|${weight}`)
    if (!token) return `<td class="matrix-cell empty"><span class="muted small">—</span></td>`
    const sig = parseTypoValue(token.value)!
    const lh = sig.lineHeightPx ?? size * 1.2
    const family = sig.fontFamily ?? 'Nunito'
    const uses = token.usageCount !== undefined ? fmtNum(token.usageCount) : '—'
    return `
<td class="matrix-cell filled">
  <div class="matrix-specimen" style="font-family:'${esc(family)}',sans-serif;font-size:${size}px;font-weight:${weight};line-height:${lh}px">Aa</div>
  <div class="matrix-cell-meta">
    <div class="matrix-cell-name">${esc(token.name)}</div>
    <div class="matrix-cell-attrs">
      <span>${size}/${weight}</span>
      <span class="muted">${lh.toFixed(1)}lh</span>
      <span class="muted">${uses} uses</span>
    </div>
  </div>
</td>`
  }

  const header = `<tr><th class="matrix-corner"></th>${weights.map(w => `<th class="matrix-col-head">${w}<span class="muted small">${weightLabel(w)}</span></th>`).join('')}</tr>`
  const rows = sizes.map(size => `
<tr>
  <th class="matrix-row-head">${size}px<span class="muted small">${sizeLabel(size)}</span></th>
  ${weights.map(w => cells(size, w)).join('')}
</tr>`).join('')

  return `
<div class="page-hero">
  <h1>Typography</h1>
  <p class="lede">${typography.length} canonical type tokens. Nunito is the sole font family across ${sizes.length} sizes and ${weights.length} weights. Empty cells are size/weight combinations that exist in the DOM but aren't canonical — either drift to fix or candidates for promotion.</p>
</div>

<section class="section">
  <div class="section-head">
    <h2 class="section-title">Size × weight matrix</h2>
    <span class="section-count">${typography.length}</span>
  </div>
  <p class="muted small">Rows: size. Columns: weight. Each filled cell is a canonical token — click to copy the name.</p>
  <div class="matrix-wrap">
    <table class="type-matrix">
      <thead>${header}</thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</section>

<section class="section">
  <h2 class="section-title">Full specimen list</h2>
  <p class="muted small">Live rendering of each canonical type token, sorted by weight then size.</p>
  <div class="spec-list">
    ${parsed
      .sort((a, b) => {
        const dw = (a.sig!.fontWeight ?? 0) - (b.sig!.fontWeight ?? 0)
        if (dw !== 0) return dw
        return (a.sig!.fontSize ?? 0) - (b.sig!.fontSize ?? 0)
      })
      .map(({ t, sig }) => {
        const size = sig!.fontSize ?? 16
        const weight = sig!.fontWeight ?? 400
        const lh = sig!.lineHeightPx ?? size * 1.2
        const family = sig!.fontFamily ?? 'Nunito'
        const uses = t.usageCount !== undefined ? fmtNum(t.usageCount) : '—'
        const tier = tierOf(t)
        return `
<article class="token-card spec-row" data-pagefind-meta="category:typography">
  <div class="spec-meta">
    <div class="token-name" data-copy-name="${esc(t.name)}" tabindex="0" role="button" aria-label="Copy token name">${esc(t.name)}</div>
    <div class="spec-attrs">
      <span>${esc(family)}</span>
      <span>${size}px · ${weight}</span>
      <span class="muted">${lh.toFixed(1)}lh</span>
    </div>
    <div class="token-meta">
      ${tierBadge(tier)}
      <button class="copy-btn" data-copy="${esc(t.name)}">Copy name</button>
      <span class="muted small">${uses} uses</span>
    </div>
  </div>
  <div class="spec-specimen" style="font-family:'${esc(family)}',sans-serif;font-size:${size}px;font-weight:${weight};line-height:${lh}px">The quick brown fox jumps over the lazy dog</div>
</article>`
      })
      .join('')}
  </div>
</section>`
}

function sizeLabel(n: number): string {
  if (n <= 10) return 'xs'
  if (n === 12) return 'sm'
  if (n === 14) return 'md'
  if (n === 16) return 'base'
  if (n === 18) return 'lg'
  if (n === 20) return 'xl'
  return ''
}
function weightLabel(n: number): string {
  const map: Record<number, string> = { 100: 'thin', 200: 'extra light', 300: 'light', 400: 'regular', 500: 'medium', 600: 'semibold', 700: 'bold', 800: 'extrabold', 900: 'black' }
  return map[n] ?? ''
}

// ─── Surfaces health dashboard ────────────────────────────────────────────────

function renderProgressBar(value: number, total: number, key: string, label: string): string {
  const pct = total === 0 ? 0 : (value / total) * 100
  return `
<div class="bar-row">
  <div class="bar-row-head">
    <span class="bar-label">${esc(label)}</span>
    <span class="bar-value">${fmtNum(value)} <span class="muted small">· ${pct.toFixed(1)}%</span></span>
  </div>
  <div class="bar-track">
    <div class="bar-fill bar-${key}" style="width:${pct.toFixed(2)}%"></div>
  </div>
</div>`
}

function renderSurfaceCard(surface: Surface, drift: DriftReport | null): string {
  const items = drift?.items?.filter(i => i.surface === surface) ?? []
  const hasData = items.length > 0

  if (!hasData) {
    return `
<article class="surface-card surface-empty">
  <div class="surface-head">
    <h3 class="surface-name">${esc(surfaceDisplayName(surface))}</h3>
    <span class="surface-state">Not yet extracted</span>
  </div>
  <p class="muted small">Run <code>npm run extract:dom -- --surface=${esc(surface)}</code> to populate this card.</p>
</article>`
  }

  const counts: Record<DriftStatus, number> = { match: 0, drift: 0, missing: 0, unknown: 0, 'system-gap': 0 }
  for (const it of items) if (it.status) counts[it.status]++
  const total = counts.match + counts.drift + counts.missing + counts.unknown + counts['system-gap']
  const actionable = counts.drift + counts.unknown + counts['system-gap']
  const matchPct = total === 0 ? 0 : (counts.match / total) * 100

  return `
<article class="surface-card">
  <div class="surface-head">
    <h3 class="surface-name">${esc(surfaceDisplayName(surface))}</h3>
    <span class="match-score ${matchPct >= 60 ? 'score-good' : matchPct >= 40 ? 'score-ok' : 'score-bad'}">${matchPct.toFixed(0)}% match</span>
  </div>
  <p class="muted small">${fmtNum(total)} items · ${fmtNum(actionable)} actionable (drift + unknown + system gap)</p>
  <div class="bar-stack">
    ${renderProgressBar(counts.match, total, 'match', 'Match')}
    ${renderProgressBar(counts.drift, total, 'drift', 'Drift')}
    ${renderProgressBar(counts.unknown, total, 'unknown', 'Unknown')}
    ${renderProgressBar(counts.missing, total, 'missing', 'Missing')}
    ${renderProgressBar(counts['system-gap'], total, 'gap', 'System gap')}
  </div>
</article>`
}

function surfaceDisplayName(s: Surface): string {
  const map: Record<Surface, string> = { landing: 'Landing pages', student: 'Student app', teacher: 'Teacher app', admin: 'Admin dashboard' }
  return map[s]
}

function renderSurfaces(ledger: LedgerState, drift: DriftReport | null): string {
  void ledger
  const studentActionable = (drift?.items ?? [])
    .filter(i => i.surface === 'student' && (i.status === 'unknown' || i.status === 'drift' || i.status === 'system-gap'))
    .sort((a, b) => {
      const sev = { critical: 0, high: 1, medium: 2, low: 3 }
      const ds = sev[a.severity] - sev[b.severity]
      if (ds !== 0) return ds
      return (b.delta ?? 0) - (a.delta ?? 0)
    })

  return `
<div class="page-hero">
  <h1>Health dashboard</h1>
  <p class="lede">Per-surface drift status. Each surface reports its match rate — what percent of extracted DOM tokens match the canonical design system. Actionable items (drift, unknown, system gap) are surfaced below for design triage.</p>
</div>

<section class="section">
  <h2 class="section-title">Surfaces</h2>
  <div class="surface-grid">
    ${ALL_SURFACES.map(s => renderSurfaceCard(s, drift)).join('')}
  </div>
</section>

${studentActionable.length > 0 ? `
<section class="section">
  <div class="section-head">
    <h2 class="section-title">Student app · actionable drift</h2>
    <span class="section-count">${studentActionable.length}</span>
  </div>
  <p class="muted small">Ordered by severity, then delta magnitude. Unknowns first (critical), then drift, then system gaps.</p>
  <div class="table-wrap">
    <table class="drift-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Type</th>
          <th>DOM value</th>
          <th>Closest canonical</th>
          <th class="right">Δ</th>
          <th>Severity</th>
          <th>Pages</th>
        </tr>
      </thead>
      <tbody>${studentActionable.slice(0, 80).map(renderDriftRow).join('')}</tbody>
    </table>
    ${studentActionable.length > 80 ? `<p class="muted small">Showing top 80 of ${studentActionable.length}.</p>` : ''}
  </div>
</section>` : ''}`
}

function renderDriftRow(item: DriftItem): string {
  const pagesList = (item.domPages ?? []).map(p => p.replace('https://champ.brightchamps.com/', '').replace(/\/$/, '') || '/')
  const pages = pagesList.length > 0 ? pagesList.join(', ') : '—'
  const delta = item.delta && item.delta > 0 ? `Δ${Number(item.delta).toFixed(2)}` : ''
  const preview = (v: string | null): string => {
    if (!v) return '<span class="muted">—</span>'
    if (/^#[0-9a-f]{3,8}$/i.test(v)) {
      const fg = textOn(v)
      return `<span class="inline-swatch" style="background:${esc(v)};color:${fg}">${esc(v)}</span>`
    }
    return `<code>${esc(v.length > 50 ? v.slice(0, 50) + '…' : v)}</code>`
  }
  return `
<tr>
  <td><span class="status-badge status-${item.status ?? 'unknown'}">${esc(item.status ?? '?')}</span></td>
  <td>${esc(item.tokenType)}</td>
  <td>${preview(item.domValue)}</td>
  <td>${preview(item.figmaValue)}</td>
  <td class="right mono">${esc(delta)}</td>
  <td><span class="sev-badge sev-${item.severity}">${esc(item.severity)}</span></td>
  <td class="pages">${esc(pages)}</td>
</tr>`
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
/* ─── Tokens ─────────────────────────────────────────── */
:root {
  --brand-primary: #4e3bc2;
  --brand-accent: #6651e4;
  --brand-dark: #2a1f6e;

  --fg-primary: #212121;
  --fg-secondary: #3d4d5d;
  --fg-muted: #757575;
  --fg-inverse: #ffffff;

  --bg-page: #ffffff;
  --bg-card: #f8f7fa;
  --bg-surface: #f3f1f7;
  --bg-header: #1a1530;

  --border: #e6e4ec;
  --border-strong: #cfd8dc;

  --success: #24c26e;
  --warning: #ffbb3a;
  --danger: #f0294d;
  --info: #0d47a1;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 30px;

  --shadow-sm: 0 1px 2px rgba(17, 12, 46, 0.06);
  --shadow-md: 0 4px 12px rgba(17, 12, 46, 0.08);
  --shadow-lg: 0 10px 32px rgba(17, 12, 46, 0.10);

  --sidebar-w: 260px;
  --header-h: 56px;

  --ui-font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --specimen-font: 'Nunito', system-ui, sans-serif;
  --mono-font: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: var(--ui-font);
  font-size: 14px; line-height: 1.55;
  color: var(--fg-primary);
  background: var(--bg-page);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--brand-primary); }

/* ─── Header (dark) ──────────────────────────────────── */
.site-header {
  position: sticky; top: 0; z-index: 100;
  height: var(--header-h);
  background: var(--bg-header);
  color: var(--fg-inverse);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  height: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
}
.brand {
  display: flex; align-items: center; gap: 10px;
  color: var(--fg-inverse); text-decoration: none;
  font-weight: 700;
}
.brand-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--brand-accent);
  box-shadow: 0 0 0 3px rgba(102,81,228,0.30);
}
.brand-name { font-size: 15px; letter-spacing: -0.01em; }
.brand-sub { font-weight: 500; color: rgba(255,255,255,0.55); font-size: 13px; }
.top-nav .version {
  font-size: 12px; color: rgba(255,255,255,0.55);
  padding: 4px 10px; border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-pill);
}

/* ─── App layout ─────────────────────────────────────── */
.app {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  min-height: calc(100vh - var(--header-h));
}

/* ─── Sidebar ────────────────────────────────────────── */
.sidebar {
  position: sticky; top: var(--header-h);
  height: calc(100vh - var(--header-h));
  overflow-y: auto;
  border-right: 1px solid var(--border);
  padding: 16px 12px 32px;
  background: var(--bg-page);
}
.sidebar details { margin-bottom: 4px; }
.sidebar summary {
  cursor: pointer;
  list-style: none;
  padding: 8px 12px;
  font-weight: 700; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--fg-muted);
  border-radius: var(--radius-sm);
  user-select: none;
  position: relative;
}
.sidebar summary::-webkit-details-marker { display: none; }
.sidebar summary::after {
  content: ''; position: absolute; right: 12px; top: 50%;
  width: 6px; height: 6px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor;
  transform: translateY(-75%) rotate(45deg); transition: transform 0.15s;
  opacity: 0.5;
}
.sidebar details[open] summary::after { transform: translateY(-25%) rotate(225deg); }
.sidebar summary:hover { background: var(--bg-card); color: var(--fg-primary); }
.sidebar ul { list-style: none; padding: 2px 0 8px; margin: 0; }
.sidebar li a {
  display: block; padding: 7px 12px;
  color: var(--fg-secondary); text-decoration: none;
  font-size: 14px; font-weight: 500;
  border-radius: var(--radius-sm);
}
.sidebar li a:hover { background: var(--bg-card); color: var(--fg-primary); }
.sidebar li a.active {
  background: rgba(78,59,194,0.08);
  color: var(--brand-primary);
  font-weight: 600;
}
.sidebar li a.disabled { color: var(--fg-muted); cursor: not-allowed; }
.sidebar li a.disabled:hover { background: transparent; }
.sidebar li span.muted { display: block; padding: 4px 12px; }

/* ─── Main content ───────────────────────────────────── */
.content {
  max-width: 1120px;
  padding: 40px 48px 64px;
  width: 100%;
}
.page-hero { margin-bottom: 40px; }
.page-hero h1 {
  font-size: 34px; font-weight: 800; margin: 0 0 10px;
  letter-spacing: -0.02em; line-height: 1.1;
}
.lede {
  font-size: 16px; color: var(--fg-secondary);
  max-width: 720px; margin: 0;
}
.section { padding: 28px 0; border-top: 1px solid var(--border); }
.section:first-of-type { border-top: 0; padding-top: 0; }
.section-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 4px; }
.section-title { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.section-count {
  font-family: var(--mono-font); font-size: 12px; font-weight: 600;
  background: var(--bg-card); color: var(--fg-muted);
  padding: 2px 8px; border-radius: 10px;
}
.subsection { margin-top: 24px; }
.subsection-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
.subsection-title {
  font-size: 13px; font-weight: 700; margin: 0;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-secondary);
}

.muted { color: var(--fg-muted); }
.small { font-size: 12px; }
.right { text-align: right; }
.mono { font-family: var(--mono-font); }
code {
  font-family: var(--mono-font);
  font-size: 12.5px; background: var(--bg-card); color: var(--fg-primary);
  padding: 1px 6px; border-radius: 4px;
}

/* ─── Home KPI grid ──────────────────────────────────── */
.kpi-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.kpi {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
}
.kpi-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-muted); }
.kpi-value { font-size: 30px; font-weight: 800; line-height: 1.1; margin: 6px 0 4px; letter-spacing: -0.02em; }
.kpi-sub { font-size: 12px; color: var(--fg-muted); }
.kpi-primary { background: rgba(78,59,194,0.04); border-color: rgba(78,59,194,0.25); }
.kpi-primary .kpi-value { color: var(--brand-primary); }

.type-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.type-chip {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-pill); font-size: 13px;
}
.type-chip-name { font-weight: 600; text-transform: capitalize; color: var(--fg-secondary); }
.type-chip-count {
  background: var(--brand-primary); color: #fff; font-weight: 700;
  font-size: 11px; padding: 1px 8px; border-radius: 10px;
}

/* ─── Drift KPI strip ────────────────────────────────── */
.drift-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; margin-top: 12px; }
.drift-kpi {
  padding: 14px;
  background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
  border-left: 3px solid var(--fg-muted);
}
.drift-kpi-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-muted); }
.drift-kpi-value { font-size: 24px; font-weight: 800; line-height: 1; margin: 6px 0 2px; }
.drift-kpi-sub { font-size: 12px; color: var(--fg-muted); }
.drift-kpi-match { border-left-color: var(--success); }
.drift-kpi-match .drift-kpi-value { color: var(--success); }
.drift-kpi-drift { border-left-color: var(--warning); }
.drift-kpi-drift .drift-kpi-value { color: #c07a00; }
.drift-kpi-missing { border-left-color: #8499ae; }
.drift-kpi-missing .drift-kpi-value { color: #607684; }
.drift-kpi-unknown { border-left-color: var(--danger); }
.drift-kpi-unknown .drift-kpi-value { color: var(--danger); }
.drift-kpi-system-gap { border-left-color: var(--brand-accent); }
.drift-kpi-system-gap .drift-kpi-value { color: var(--brand-primary); }

/* ─── Home nav cards ─────────────────────────────────── */
.nav-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
.nav-card {
  padding: 18px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md); text-decoration: none; color: var(--fg-primary);
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.nav-card:hover { border-color: var(--brand-primary); transform: translateY(-1px); box-shadow: var(--shadow-md); }
.nav-card-kicker { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--brand-primary); }
.nav-card-title { font-size: 18px; font-weight: 800; margin: 4px 0 6px; letter-spacing: -0.01em; }
.nav-card-sub { font-size: 13px; color: var(--fg-secondary); }

/* ─── Token cards (colors) ──────────────────────────── */
.token-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 14px; }
.token-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.15s;
}
.token-card:hover { border-color: var(--border-strong); }

.color-card { display: flex; flex-direction: column; }
.color-preview {
  height: 92px;
  position: relative;
  display: flex; align-items: flex-end;
  padding: 10px 12px;
  background: var(--swatch);
  color: var(--fg);
}
.color-preview.alpha {
  background-image:
    var(--swatch),
    linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
    linear-gradient(-45deg, transparent 75%, #d0d0d0 75%);
  background-size: cover, 12px 12px, 12px 12px, 12px 12px, 12px 12px;
  background-position: 0 0, 0 0, 0 6px, 6px -6px, -6px 0;
}
.color-hex {
  font-family: var(--mono-font); font-size: 12px; font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
.token-body { padding: 10px 12px; }
.token-name {
  font-family: var(--mono-font);
  font-size: 12px; font-weight: 600; color: var(--fg-primary);
  margin-bottom: 8px; word-break: break-all;
}
.token-meta { display: flex; gap: 6px; align-items: center; margin-bottom: 8px; }
.token-attrs {
  display: grid; grid-template-columns: auto auto; gap: 4px 10px;
  margin: 0 0 8px; font-size: 11px;
}
.token-attrs > div { display: contents; }
.token-attrs dt { color: var(--fg-muted); }
.token-attrs dd { margin: 0; color: var(--fg-primary); font-weight: 600; font-family: var(--mono-font); }

.tier-badge {
  font-size: 9.5px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.06em; padding: 2px 7px; border-radius: 10px;
}
.tier-canonical { background: rgba(36,194,110,0.14); color: #16803c; }
.tier-candidate { background: rgba(255,187,58,0.2); color: #8a5e00; }
.tier-deprecated { background: rgba(132,153,174,0.18); color: var(--fg-secondary); }

.copy-btn {
  font-family: var(--ui-font);
  font-size: 11px; font-weight: 600;
  padding: 3px 10px;
  background: #fff; color: var(--fg-secondary);
  border: 1px solid var(--border-strong); border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.12s;
}
.copy-btn:hover { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
.copy-btn.copied { background: var(--success); color: #fff; border-color: var(--success); }

.surface-pills { display: flex; flex-wrap: wrap; gap: 4px; }
.surface-pill {
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 2px 7px; border-radius: 10px;
  background: #fff; color: var(--fg-secondary); border: 1px solid var(--border-strong);
}

/* ─── Typography matrix ──────────────────────────────── */
.matrix-wrap { overflow-x: auto; margin-top: 14px; border-radius: var(--radius-md); border: 1px solid var(--border); }
.type-matrix { border-collapse: collapse; width: 100%; background: #fff; }
.type-matrix th, .type-matrix td { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); vertical-align: top; }
.type-matrix th:last-child, .type-matrix td:last-child { border-right: 0; }
.type-matrix tr:last-child th, .type-matrix tr:last-child td { border-bottom: 0; }

.matrix-corner { background: var(--bg-surface); width: 100px; }
.matrix-col-head {
  background: var(--bg-surface); padding: 10px 12px;
  font-size: 13px; font-weight: 700; text-align: left;
  color: var(--fg-primary);
}
.matrix-col-head .muted { display: block; font-weight: 500; margin-top: 1px; font-size: 11px; }
.matrix-row-head {
  background: var(--bg-surface); padding: 12px; min-width: 80px;
  font-size: 13px; font-weight: 700; text-align: left;
  color: var(--fg-primary); white-space: nowrap;
}
.matrix-row-head .muted { display: block; font-weight: 500; margin-top: 1px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }

.matrix-cell { padding: 16px 14px; min-width: 140px; }
.matrix-cell.empty { background: repeating-linear-gradient(45deg, #fafafa 0, #fafafa 6px, #fff 6px, #fff 12px); }
.matrix-cell.filled { background: #fff; }
.matrix-specimen {
  font-family: var(--specimen-font); color: var(--fg-primary);
  margin-bottom: 10px;
}
.matrix-cell-meta { padding-top: 4px; border-top: 1px dashed var(--border); }
.matrix-cell-name {
  font-family: var(--mono-font); font-size: 10.5px; font-weight: 600;
  color: var(--fg-primary); margin-bottom: 2px;
}
.matrix-cell-attrs { display: flex; gap: 8px; font-size: 10.5px; font-family: var(--mono-font); color: var(--fg-secondary); }

/* ─── Type specimen list ─────────────────────────────── */
.spec-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
.spec-row {
  display: grid; grid-template-columns: 240px 1fr; gap: 24px;
  padding: 16px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md);
  align-items: center;
}
.spec-meta { display: flex; flex-direction: column; gap: 6px; }
.spec-attrs { display: flex; flex-direction: column; gap: 2px; font-size: 12px; font-family: var(--mono-font); color: var(--fg-secondary); }
.spec-specimen {
  font-family: var(--specimen-font);
  color: var(--fg-primary); overflow-wrap: break-word;
}
@media (max-width: 780px) {
  .spec-row { grid-template-columns: 1fr; }
}

/* ─── Surfaces health dashboard ──────────────────────── */
.surface-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 14px; }
.surface-card {
  padding: 20px; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.surface-empty { background: repeating-linear-gradient(45deg, #fafafa 0, #fafafa 6px, #fff 6px, #fff 12px); }
.surface-empty .surface-name { color: var(--fg-muted); }
.surface-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.surface-name { font-size: 16px; font-weight: 800; margin: 0; letter-spacing: -0.01em; }
.surface-state {
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--fg-muted);
}
.match-score {
  font-size: 12px; font-weight: 800;
  padding: 4px 10px; border-radius: var(--radius-pill);
}
.score-good { background: rgba(36,194,110,0.14); color: #16803c; }
.score-ok { background: rgba(255,187,58,0.18); color: #8a5e00; }
.score-bad { background: rgba(240,41,77,0.12); color: #a31836; }

.bar-stack { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
.bar-row-head { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px; }
.bar-label { font-weight: 600; color: var(--fg-secondary); }
.bar-value { color: var(--fg-primary); font-weight: 600; font-family: var(--mono-font); }
.bar-track {
  height: 6px; background: #eee; border-radius: 3px; overflow: hidden;
}
.bar-fill { height: 100%; }
.bar-fill.bar-match { background: var(--success); }
.bar-fill.bar-drift { background: var(--warning); }
.bar-fill.bar-unknown { background: var(--danger); }
.bar-fill.bar-missing { background: #8499ae; }
.bar-fill.bar-gap { background: var(--brand-accent); }

/* ─── Drift table ────────────────────────────────────── */
.table-wrap { overflow-x: auto; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-md); margin-top: 14px; }
.drift-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.drift-table th {
  text-align: left; padding: 10px 14px; font-weight: 700; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--fg-muted);
  border-bottom: 1px solid var(--border); background: var(--bg-surface);
}
.drift-table th.right { text-align: right; }
.drift-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.drift-table tr:last-child td { border-bottom: 0; }
.drift-table td.right { text-align: right; }
.drift-table td.pages { max-width: 240px; font-size: 12px; color: var(--fg-secondary); }

.status-badge, .sev-badge {
  display: inline-block; font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.05em; padding: 3px 8px; border-radius: 10px;
}
.status-match { background: rgba(36,194,110,0.14); color: #16803c; }
.status-drift { background: rgba(255,187,58,0.18); color: #8a5e00; }
.status-missing { background: rgba(132,153,174,0.18); color: var(--fg-secondary); }
.status-unknown { background: rgba(240,41,77,0.12); color: #a31836; }
.status-system-gap { background: rgba(102,81,228,0.12); color: var(--brand-primary); }

.sev-critical { background: rgba(240,41,77,0.12); color: #a31836; }
.sev-high { background: rgba(255,117,44,0.14); color: #a34d10; }
.sev-medium { background: rgba(255,217,0,0.18); color: #8a6b00; }
.sev-low { background: rgba(132,153,174,0.18); color: var(--fg-secondary); }

.inline-swatch {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-family: var(--mono-font); font-size: 12px; font-weight: 600;
  border: 1px solid rgba(0,0,0,0.06);
}

/* ─── Search trigger + modal ─────────────────────────── */
.top-nav { display: flex; align-items: center; gap: 12px; }
.search-trigger {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 10px 5px 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.8);
  font-family: var(--ui-font); font-size: 12px; font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.search-trigger:hover { background: rgba(255,255,255,0.12); color: #fff; }
.search-trigger kbd {
  font-family: var(--ui-font); font-size: 10px;
  padding: 1px 5px; background: rgba(255,255,255,0.1); border-radius: 3px;
  border: 1px solid rgba(255,255,255,0.1);
}

.search-modal {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 10vh;
}
.search-modal[hidden] { display: none; }
.search-backdrop {
  position: absolute; inset: 0;
  background: rgba(10,10,30,0.4);
  backdrop-filter: blur(4px);
}
.search-box {
  position: relative;
  width: 100%; max-width: 560px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-3);
  overflow: hidden;
}
.search-input-wrap {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--fg-muted);
}
.search-input-wrap input {
  flex: 1; border: 0; outline: 0; background: transparent;
  font-family: var(--ui-font); font-size: 16px; color: var(--fg-primary);
}
.search-input-wrap input::placeholder { color: var(--fg-muted); }
.search-input-wrap kbd {
  font-family: var(--ui-font); font-size: 11px;
  padding: 2px 6px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: 3px;
  color: var(--fg-muted);
}
.search-results { max-height: 60vh; overflow-y: auto; }
.search-hit {
  display: block; padding: 12px 16px;
  text-decoration: none; color: inherit;
  border-bottom: 1px solid var(--border);
}
.search-hit:last-child { border-bottom: 0; }
.search-hit:hover { background: var(--bg-card); }
.search-hit-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; color: var(--fg-primary); }
.search-hit-excerpt { font-size: 12px; color: var(--fg-secondary); line-height: 1.5; }
.search-hit-excerpt mark { background: rgba(78,59,194,0.18); color: var(--brand-primary); padding: 0 2px; border-radius: 2px; }
.search-empty, .search-error {
  padding: 24px 16px; text-align: center;
  color: var(--fg-muted); font-size: 13px;
}

/* ─── Right-click context menu ───────────────────────── */
.ctx-menu {
  position: absolute; z-index: 300;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-3);
  padding: 4px;
  min-width: 180px;
}
.ctx-menu[hidden] { display: none; }
.ctx-item {
  display: block; width: 100%; text-align: left;
  padding: 8px 12px;
  background: transparent; border: 0;
  font-family: var(--ui-font); font-size: 13px; color: var(--fg-primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.ctx-item:hover { background: var(--bg-card); }
.ctx-item.copied { background: var(--success); color: #fff; }

/* ─── Click-to-copy token name ───────────────────────── */
.token-name[data-copy-name] {
  cursor: pointer;
  transition: color 0.15s;
  border-radius: 3px;
  outline: none;
}
.token-name[data-copy-name]:hover { color: var(--brand-primary); }
.token-name[data-copy-name]:focus-visible {
  box-shadow: 0 0 0 2px var(--brand-primary);
}
.token-name.copied-flash { color: var(--success); }

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 880px) {
  .app { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--border); }
  .content { padding: 24px 20px 48px; }
  .search-trigger span { display: none; }
}
`

// ─── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  console.log('[publish:site] Loading ledger...')
  const ledger = loadLedger()
  console.log(`[publish:site] ${ledger.tokens.length} tokens loaded`)

  console.log('[publish:site] Loading latest drift report...')
  const drift = loadLatestDrift()
  if (drift) console.log(`[publish:site] drift ${drift.generatedAt.slice(0, 10)} · ${drift.totalItems} items`)

  mkdirSync(OUT_DIR, { recursive: true })

  const pages: Array<[string, string]> = [
    ['index.html', layout('Overview', 'home', renderHome(ledger, drift))],
    ['colors.html', layout('Color', 'colors', renderColors(ledger))],
    ['typography.html', layout('Typography', 'typography', renderTypographyMatrix(ledger))],
    ['surfaces.html', layout('Surfaces', 'surfaces-student', renderSurfaces(ledger, drift))],
  ]

  for (const [filename, content] of pages) {
    writeFileSync(path.join(OUT_DIR, filename), content)
    console.log(`  ✓ ${filename}`)
  }
  writeFileSync(path.join(OUT_DIR, 'styles.css'), styles)
  console.log(`  ✓ styles.css`)
  console.log(`\n[publish:site] Done. Output in ${OUT_DIR}`)
  console.log(`[publish:site] Preview: npx serve ${OUT_DIR}`)
}

main()
