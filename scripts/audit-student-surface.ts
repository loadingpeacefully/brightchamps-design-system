/**
 * scripts/audit-student-surface.ts
 *
 * Three additional extraction passes for the student surface:
 *   1. Icon audit       → ledger/surfaces/student/icons.json
 *   2. Component inventory → ledger/surfaces/student/components.json
 *   3. Interactive states  → ledger/surfaces/student/states.json
 *
 * Uses the same storageState auth as the DOM extractor.
 *
 * Usage: npm run audit:student
 */

import { chromium } from 'playwright'
import type { Page } from 'playwright'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import 'dotenv/config'

const STORAGE_STATE = '.playwright-auth/student.json'
const OUT_DIR = 'ledger/surfaces/student'
const URLS = [
  'https://champ.brightchamps.com/my-feed/',
  'https://champ.brightchamps.com/global-feed/',
  'https://champ.brightchamps.com/badges/',
  'https://champ.brightchamps.com/nano-skills/',
  'https://champ.brightchamps.com/learn/',
  'https://champ.brightchamps.com/certificates/',
  'https://champ.brightchamps.com/rewards/',
]

function urlLabel(url: string): string {
  return url.replace('https://champ.brightchamps.com/', '').replace(/\/$/, '') || 'root'
}

// ─── Pass 1: Icon audit ──────────────────────────────────────────────────────

interface IconEntry {
  type: 'svg' | 'img'
  identifier: string
  width: number
  height: number
  viewBox: string | null
  pages: string[]
  count: number
  src?: string
  markup?: string
}

async function auditIcons(page: Page, url: string): Promise<Array<{ type: 'svg' | 'img'; identifier: string; width: number; height: number; viewBox: string | null; src?: string; markup?: string }>> {
  return page.evaluate(() => {
    const results: Array<{ type: 'svg' | 'img'; identifier: string; width: number; height: number; viewBox: string | null; src?: string; markup?: string }> = []

    document.querySelectorAll('svg').forEach(svg => {
      const rect = svg.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      const inner = svg.innerHTML.replace(/\s+/g, ' ').trim()
      const hash = inner.length > 0 ? inner.slice(0, 120) : '(empty)'
      const outerHTML = svg.outerHTML
      results.push({
        type: 'svg',
        identifier: hash,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        viewBox: svg.getAttribute('viewBox'),
        markup: outerHTML.length < 10000 ? outerHTML : undefined,
      })
    })

    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || img.currentSrc || ''
      if (!src) return
      const rect = img.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      results.push({
        type: 'img',
        identifier: src,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        viewBox: null,
        src,
      })
    })

    return results
  })
}

// ─── Pass 2: Component inventory ──────────────────────────────────────────────

interface ComponentEntry {
  prefix: string
  elements: number
  localNames: string[]
  pages: string[]
}

async function auditComponents(page: Page): Promise<Array<{ prefix: string; localName: string }>> {
  return page.evaluate(() => {
    const results: Array<{ prefix: string; localName: string }> = []
    const modulePattern = /^([A-Z][a-zA-Z0-9]+)_([a-zA-Z0-9]+)__[a-zA-Z0-9]+$/

    document.querySelectorAll('[class]').forEach(el => {
      const classes = el.getAttribute('class')?.split(/\s+/) ?? []
      for (const cls of classes) {
        const match = cls.match(modulePattern)
        if (match) {
          results.push({ prefix: match[1]!, localName: match[2]! })
        }
      }
    })
    return results
  })
}

// ─── Pass 3: Interactive states ───────────────────────────────────────────────

interface StateEntry {
  selector: string
  text: string
  page: string
  baseline: { color: string; backgroundColor: string; borderColor: string }
  hovered: { color: string; backgroundColor: string; borderColor: string }
  changed: boolean
}

async function auditStates(page: Page, url: string): Promise<StateEntry[]> {
  const interactives = await page.evaluate(() => {
    const selectors = 'button, a[href], [role="button"], input[type="submit"], nav a'
    const els = Array.from(document.querySelectorAll(selectors))
    const visible = els.filter(el => {
      const s = getComputedStyle(el)
      const he = el as HTMLElement
      return s.display !== 'none' && s.visibility !== 'hidden' && he.offsetWidth > 0 && he.offsetHeight > 0
    })
    return visible.slice(0, 10).map((el, i) => ({
      index: i,
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 40),
      classes: el.className?.toString().slice(0, 80) ?? '',
    }))
  })

  const results: StateEntry[] = []
  const targets = 'button, a[href], [role="button"], input[type="submit"], nav a'

  for (const info of interactives) {
    try {
      const allMatching = page.locator(targets)
      const el = allMatching.nth(info.index)
      await el.scrollIntoViewIfNeeded({ timeout: 2000 })

      const baseline = await el.evaluate(node => {
        const s = getComputedStyle(node)
        return { color: s.color, backgroundColor: s.backgroundColor, borderColor: s.borderColor }
      })

      await el.hover({ timeout: 2000 })
      await page.waitForTimeout(150)

      const hovered = await el.evaluate(node => {
        const s = getComputedStyle(node)
        return { color: s.color, backgroundColor: s.backgroundColor, borderColor: s.borderColor }
      })

      const changed =
        baseline.color !== hovered.color ||
        baseline.backgroundColor !== hovered.backgroundColor ||
        baseline.borderColor !== hovered.borderColor

      results.push({
        selector: `${info.tag}[${info.index}]`,
        text: info.text,
        page: urlLabel(url),
        baseline,
        hovered,
        changed,
      })
    } catch {
      // element might have scrolled away or been covered
    }
  }
  return results
}

// ─── Navigate + hydrate helper ────────────────────────────────────────────────

async function navigateAndHydrate(page: Page, url: string): Promise<boolean> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
  try {
    await page.waitForSelector(
      '[class*="feed"], [class*="dashboard"], [class*="course"], main, #root > div > div',
      { timeout: 10_000 },
    )
  } catch { /* proceed */ }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(2000)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)

  const landed = page.url()
  if (landed.includes('/login')) {
    console.error(`  ✗ Auth failed on ${url} — redirected to ${landed}`)
    return false
  }
  return true
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!existsSync(STORAGE_STATE)) {
    console.error(`[audit] Storage state not found at ${STORAGE_STATE}`)
    console.error(`[audit] Run: npx playwright codegen --save-storage=${STORAGE_STATE} https://champ.brightchamps.com/login/`)
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ storageState: STORAGE_STATE })
  const page = await ctx.newPage()

  // Aggregators
  const iconMap = new Map<string, IconEntry>()
  const componentMap = new Map<string, { elements: number; localNames: Set<string>; pages: Set<string> }>()
  const allStates: StateEntry[] = []

  for (const url of URLS) {
    const label = urlLabel(url)
    console.log(`\n[audit] ${label}`)

    const ok = await navigateAndHydrate(page, url)
    if (!ok) continue

    // Pass 1: Icons
    console.log('  → icons...')
    const icons = await auditIcons(page, url)
    for (const icon of icons) {
      const existing = iconMap.get(icon.identifier)
      if (existing) {
        existing.count++
        if (!existing.pages.includes(label)) existing.pages.push(label)
        if (!existing.markup && icon.markup) existing.markup = icon.markup
      } else {
        iconMap.set(icon.identifier, {
          ...icon,
          pages: [label],
          count: 1,
        })
      }
    }
    console.log(`    ${icons.length} icons (${iconMap.size} unique total)`)

    // Pass 2: Components
    console.log('  → components...')
    const comps = await auditComponents(page)
    for (const { prefix, localName } of comps) {
      const existing = componentMap.get(prefix)
      if (existing) {
        existing.elements++
        existing.localNames.add(localName)
        existing.pages.add(label)
      } else {
        componentMap.set(prefix, { elements: 1, localNames: new Set([localName]), pages: new Set([label]) })
      }
    }
    console.log(`    ${comps.length} CSS module elements (${componentMap.size} unique prefixes total)`)

    // Pass 3: Interactive states
    console.log('  → interactive states...')
    const states = await auditStates(page, url)
    allStates.push(...states)
    const changed = states.filter(s => s.changed).length
    console.log(`    ${states.length} elements probed, ${changed} with color changes on hover`)
  }

  await browser.close()

  // ── Write outputs ──

  // Icons
  const iconsList = [...iconMap.values()]
    .sort((a, b) => b.count - a.count)
  writeFileSync(path.join(OUT_DIR, 'icons.json'), JSON.stringify(iconsList, null, 2))
  console.log(`\n[audit] ✓ icons.json — ${iconsList.length} unique icons`)
  console.log(`    SVGs: ${iconsList.filter(i => i.type === 'svg').length}`)
  console.log(`    Images: ${iconsList.filter(i => i.type === 'img').length}`)
  console.log(`    Most common: ${iconsList[0]?.type} ${iconsList[0]?.width}×${iconsList[0]?.height} (${iconsList[0]?.count} occurrences)`)

  // Components
  const componentsList: ComponentEntry[] = [...componentMap.entries()]
    .map(([prefix, data]) => ({
      prefix,
      elements: data.elements,
      localNames: [...data.localNames].sort(),
      pages: [...data.pages].sort(),
    }))
    .sort((a, b) => b.elements - a.elements)
  writeFileSync(path.join(OUT_DIR, 'components.json'), JSON.stringify(componentsList, null, 2))
  console.log(`\n[audit] ✓ components.json — ${componentsList.length} unique component prefixes`)
  console.log(`    Top 5:`)
  for (const c of componentsList.slice(0, 5)) {
    console.log(`      ${c.prefix.padEnd(28)} ${String(c.elements).padStart(4)} elements  ${c.localNames.length} variants  ${c.pages.length} pages`)
  }

  // States
  writeFileSync(path.join(OUT_DIR, 'states.json'), JSON.stringify(allStates, null, 2))
  const changedTotal = allStates.filter(s => s.changed).length
  console.log(`\n[audit] ✓ states.json — ${allStates.length} interactive elements probed`)
  console.log(`    ${changedTotal} with hover color changes (${(allStates.length > 0 ? ((changedTotal / allStates.length) * 100).toFixed(0) : 0)}%)`)

  console.log(`\n[audit] All outputs in ${OUT_DIR}/`)
}

main().catch(err => {
  console.error('[audit] Fatal:', err)
  process.exit(1)
})
