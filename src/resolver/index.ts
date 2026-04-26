/**
 * src/resolver/index.ts
 *
 * Reads all extraction results from ledger/.extractions/ and synthesizes
 * the canonical ledger/tokens.json.
 *
 * Tiering policy (see ADR-0008):
 *   COLORS      — cluster at ΔE < 5 (CIE76); top 80 clusters canonical (conf 0.9);
 *                 rest deprecated (conf 0.2). Non-canonical cluster members
 *                 are persisted as deprecated tokens mapped to their canonical.
 *   TYPOGRAPHY  — group by (family + size + weight). Rank 1–16 canonical (conf 1.0);
 *                 17–60 candidate (conf 0.5); 61+ deprecated (conf 0.1).
 *   SHADOWS     — cluster at ±4px tolerance + exact color. Top 10 canonical;
 *                 rest deprecated.
 *   OTHER TYPES — pass through with no tiering; confidence from extractor.
 *
 * Usage: npm run ledger:build
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { deduplicateTokens } from '../extractors/normalize.js'
import { clusterColors, clusterShadows, groupTypography } from './cluster.js'
import type {
  DesignToken,
  ExtractionResult,
  LedgerState,
  LedgerToken,
  Surface,
  TokenSource,
  TokenType,
} from '../types/index.js'

const EXTRACTIONS_DIR = 'ledger/.extractions'
const LEDGER_DIR = 'ledger'
const MANUAL_CANONICALS_FILE = 'ledger/manual-canonicals.json'

const COLOR_DELTA_E = 5
const COLOR_CANONICAL_TOP_N = 80

const TYPO_CANONICAL_TOP_N = 16
const TYPO_CANDIDATE_TOP_N = 60

const SHADOW_TOLERANCE_PX = 4
const SHADOW_CANONICAL_TOP_N = 10

// ─── Load extractions ─────────────────────────────────────────────────────────

function loadExtractions(): ExtractionResult[] {
  const files = readdirSync(EXTRACTIONS_DIR).filter(f => f.endsWith('.json'))
  return files.map(f => {
    const raw = readFileSync(path.join(EXTRACTIONS_DIR, f), 'utf-8')
    return JSON.parse(raw) as ExtractionResult
  })
}

// ─── Ledger token factory ─────────────────────────────────────────────────────

interface TierAssignment {
  confidence: number
  deprecated: boolean
  raw?: Record<string, unknown>
  nameOverride?: string
  valueOverride?: string
  usageCount?: number
  elements?: number
  pages?: string[]
}

function makeLedgerToken(source: DesignToken, tier: TierAssignment): LedgerToken {
  const now = new Date().toISOString()
  const confidence = tier.confidence
  const canonical = confidence >= 0.9
  const value = tier.valueOverride ?? source.value
  const name = tier.nameOverride ?? source.name
  const mergedRaw = {
    ...(source.raw ?? {}),
    ...(tier.raw ?? {}),
  }

  const token: LedgerToken = {
    name,
    value,
    type: source.type,
    source: source.source,
    surface: source.surface,
    confidence,
    extractedAt: source.extractedAt ?? now,
    id: randomUUID(),
    firstSeen: source.extractedAt ?? now,
    lastSeen: source.extractedAt ?? now,
    sources: [source.source],
    surfaces: [source.surface],
    canonical,
  }
  if (tier.deprecated) token.deprecated = true
  if (Object.keys(mergedRaw).length > 0) token.raw = mergedRaw
  const usage = tier.usageCount ?? source.usageCount
  if (usage !== undefined) token.usageCount = usage
  const elements = tier.elements ?? source.elements
  if (elements !== undefined) token.elements = elements
  const pages = tier.pages ?? source.pages
  if (pages !== undefined) token.pages = pages
  return token
}

// ─── Tiering ──────────────────────────────────────────────────────────────────

interface TierCounts { canonical: number; candidate: number; deprecated: number }

function tierColors(tokens: DesignToken[]): { ledger: LedgerToken[]; counts: TierCounts } {
  if (tokens.length === 0) return { ledger: [], counts: { canonical: 0, candidate: 0, deprecated: 0 } }

  const clusters = clusterColors(tokens, COLOR_DELTA_E)
  const counts: TierCounts = { canonical: 0, candidate: 0, deprecated: 0 }
  const ledger: LedgerToken[] = []

  clusters.forEach((cluster, idx) => {
    const rank = idx + 1
    const isTop = rank <= COLOR_CANONICAL_TOP_N
    const rankStr = String(rank).padStart(3, '0')

    // Canonical (or top-of-cluster if beyond threshold) token
    const canonMemberCount = cluster.members.length
    ledger.push(makeLedgerToken(cluster.canonical, {
      confidence: isTop ? 0.9 : 0.2,
      deprecated: !isTop,
      nameOverride: `color.${rankStr}`,
      usageCount: cluster.totalCount,
      elements: cluster.totalCount,
      pages: cluster.mergedPages,
      raw: {
        clusterRank: rank,
        clusterMembers: canonMemberCount,
        mergedFromValues: cluster.members
          .filter(m => m.value !== cluster.canonical.value)
          .map(m => ({ value: m.value, usageCount: m.usageCount ?? 0 })),
      },
    }))
    if (isTop) counts.canonical++
    else counts.deprecated++

    // Non-canonical cluster members → persisted as deprecated, mapped to canonical
    for (const member of cluster.members) {
      if (member.value === cluster.canonical.value) continue
      ledger.push(makeLedgerToken(member, {
        confidence: 0.1,
        deprecated: true,
        nameOverride: `color.${rankStr}.variant.${member.value.replace('#', '')}`,
        raw: {
          mergedInto: cluster.canonical.value,
          canonicalRank: rank,
          canonicalName: `color.${rankStr}`,
        },
      }))
      counts.deprecated++
    }
  })

  return { ledger, counts }
}

function tierTypography(tokens: DesignToken[]): { ledger: LedgerToken[]; counts: TierCounts } {
  if (tokens.length === 0) return { ledger: [], counts: { canonical: 0, candidate: 0, deprecated: 0 } }

  const groups = groupTypography(tokens)
  const counts: TierCounts = { canonical: 0, candidate: 0, deprecated: 0 }
  const ledger: LedgerToken[] = []

  groups.forEach((group, idx) => {
    const rank = idx + 1
    const rankStr = String(rank).padStart(2, '0')
    let confidence: number
    if (rank <= TYPO_CANONICAL_TOP_N) { confidence = 1.0; counts.canonical++ }
    else if (rank <= TYPO_CANDIDATE_TOP_N) { confidence = 0.5; counts.candidate++ }
    else { confidence = 0.1; counts.deprecated++ }
    const deprecated = confidence < 0.4

    ledger.push(makeLedgerToken(group.representative, {
      confidence,
      deprecated,
      nameOverride: `typography.${rankStr}`,
      usageCount: group.totalCount,
      elements: group.totalCount,
      pages: group.mergedPages,
      raw: {
        groupKey: group.key,
        family: group.family,
        size: group.size,
        weight: group.weight,
        rank,
        variantCount: group.members.length,
      },
    }))

    // Members beyond the representative → deprecated sub-variants
    for (const member of group.members) {
      if (member === group.representative) continue
      ledger.push(makeLedgerToken(member, {
        confidence: 0.1,
        deprecated: true,
        nameOverride: `typography.${rankStr}.variant.${randomUUID().slice(0, 8)}`,
        raw: {
          mergedIntoGroup: group.key,
          canonicalName: `typography.${rankStr}`,
        },
      }))
      counts.deprecated++
    }
  })

  return { ledger, counts }
}

function tierShadows(tokens: DesignToken[]): { ledger: LedgerToken[]; counts: TierCounts } {
  if (tokens.length === 0) return { ledger: [], counts: { canonical: 0, candidate: 0, deprecated: 0 } }

  const clusters = clusterShadows(tokens, SHADOW_TOLERANCE_PX)
  const counts: TierCounts = { canonical: 0, candidate: 0, deprecated: 0 }
  const ledger: LedgerToken[] = []

  clusters.forEach((cluster, idx) => {
    const rank = idx + 1
    const isTop = rank <= SHADOW_CANONICAL_TOP_N
    const rankStr = String(rank).padStart(2, '0')

    ledger.push(makeLedgerToken(cluster.canonical, {
      confidence: isTop ? 0.9 : 0.2,
      deprecated: !isTop,
      nameOverride: `shadow.${rankStr}`,
      usageCount: cluster.totalCount,
      elements: cluster.totalCount,
      pages: cluster.mergedPages,
      raw: {
        clusterRank: rank,
        clusterMembers: cluster.members.length,
        mergedFromValues: cluster.members
          .filter(m => m.value !== cluster.canonical.value)
          .map(m => ({ value: m.value, usageCount: m.usageCount ?? 0 })),
      },
    }))
    if (isTop) counts.canonical++
    else counts.deprecated++

    for (const member of cluster.members) {
      if (member.value === cluster.canonical.value) continue
      ledger.push(makeLedgerToken(member, {
        confidence: 0.1,
        deprecated: true,
        nameOverride: `shadow.${rankStr}.variant.${randomUUID().slice(0, 8)}`,
        raw: {
          mergedInto: cluster.canonical.value,
          canonicalName: `shadow.${rankStr}`,
        },
      }))
      counts.deprecated++
    }
  })

  return { ledger, counts }
}

// ─── Manual canonicals (always win, never overwritten) ───────────────────────

interface ManualCanonical {
  name: string
  value: string
  type?: TokenType
  source?: TokenSource
  surface?: Surface
  confidence?: number
  description?: string
  notes?: string
  openQuestion?: string
}

function loadManualCanonicals(): LedgerToken[] {
  if (!existsSync(MANUAL_CANONICALS_FILE)) return []
  const raw = readFileSync(MANUAL_CANONICALS_FILE, 'utf-8')
  let parsed: ManualCanonical[]
  try { parsed = JSON.parse(raw) as ManualCanonical[] }
  catch (err) {
    console.error(`[resolver] Failed to parse ${MANUAL_CANONICALS_FILE}:`, err)
    return []
  }
  const now = new Date().toISOString()
  const result: LedgerToken[] = []
  for (const m of parsed) {
    // Infer type from value format if not provided (hex → color)
    const type: TokenType = m.type ?? (/^#[0-9a-f]{3,8}$/i.test(m.value) ? 'color' : 'color')
    const source: TokenSource = m.source ?? 'dom'
    const surface: Surface = m.surface ?? 'student'
    const confidence = m.confidence ?? 0.8
    const token: LedgerToken = {
      name: m.name,
      value: m.value,
      type,
      source,
      surface,
      confidence,
      extractedAt: now,
      id: randomUUID(),
      firstSeen: now,
      lastSeen: now,
      sources: [source],
      surfaces: [surface],
      // Manual canonicals are always canonical regardless of confidence tier.
      // They override the default isCanonical() rule intentionally — they exist
      // because we explicitly decided to canonicalize them.
      canonical: true,
    }
    if (m.description) token.description = m.description
    token.raw = { manual: true, ...(m.notes ? { notes: m.notes } : {}), ...(m.openQuestion ? { openQuestion: m.openQuestion } : {}) }
    result.push(token)
  }
  return result
}

function mergeManualCanonicals(auto: LedgerToken[], manual: LedgerToken[]): LedgerToken[] {
  if (manual.length === 0) return auto
  // Drop any auto-generated token whose (name) or (type+value) collides with a
  // manual entry. Manual wins.
  const manualNames = new Set(manual.map(m => m.name))
  const manualTypeValue = new Set(manual.map(m => `${m.type}|${m.value.toLowerCase()}`))
  const survivors = auto.filter(t => {
    if (manualNames.has(t.name)) return false
    if (manualTypeValue.has(`${t.type}|${t.value.toLowerCase()}`)) return false
    return true
  })
  return [...survivors, ...manual]
}

function passthroughTier(tokens: DesignToken[]): { ledger: LedgerToken[]; counts: TierCounts } {
  const counts: TierCounts = { canonical: 0, candidate: 0, deprecated: 0 }
  const ledger = tokens.map(t => {
    const tier: TierAssignment = { confidence: t.confidence, deprecated: !!t.deprecated }
    const result = makeLedgerToken(t, tier)
    if (result.confidence >= 0.9) counts.canonical++
    else if (result.confidence >= 0.4) counts.candidate++
    else counts.deprecated++
    return result
  })
  return { ledger, counts }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('[resolver] Loading extractions...')
  mkdirSync(LEDGER_DIR, { recursive: true })

  let extractions: ExtractionResult[]
  try {
    extractions = loadExtractions()
  } catch {
    console.error('[resolver] No extractions found. Run npm run extract:all first.')
    process.exit(1)
  }

  const allTokens = extractions.flatMap(e => e.tokens)
  console.log(`[resolver] Loaded ${allTokens.length} raw tokens from ${extractions.length} extractions`)

  const deduplicated = deduplicateTokens(allTokens)
  console.log(`[resolver] ${deduplicated.length} tokens after deduplication`)

  const byType = new Map<TokenType, DesignToken[]>()
  for (const t of deduplicated) {
    const bucket = byType.get(t.type) ?? []
    bucket.push(t)
    byType.set(t.type, bucket)
  }

  const colorResult = tierColors(byType.get('color') ?? [])
  const typoResult = tierTypography(byType.get('typography') ?? [])
  const shadowResult = tierShadows(byType.get('shadow') ?? [])

  const otherTokens: DesignToken[] = []
  for (const [type, bucket] of byType) {
    if (type === 'color' || type === 'typography' || type === 'shadow') continue
    otherTokens.push(...bucket)
  }
  const otherResult = passthroughTier(otherTokens)

  const autoLedger: LedgerToken[] = [
    ...colorResult.ledger,
    ...typoResult.ledger,
    ...shadowResult.ledger,
    ...otherResult.ledger,
  ]

  const manualCanonicals = loadManualCanonicals()
  if (manualCanonicals.length > 0) {
    console.log(`[resolver] Merging ${manualCanonicals.length} manual canonical(s) from ${MANUAL_CANONICALS_FILE}`)
  }
  const allLedger = mergeManualCanonicals(autoLedger, manualCanonicals)

  const now = new Date().toISOString()
  const ledger: LedgerState = {
    version: '0.1.0',
    lastBuilt: now,
    tokenCount: allLedger.length,
    componentCount: 0,
    tokens: allLedger,
  }

  const ledgerPath = path.join(LEDGER_DIR, 'tokens.json')
  writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2))

  const surfaces = [...new Set(allLedger.map(t => t.surface))] as Surface[]

  console.log(`\n[resolver] Ledger built → ${ledgerPath}`)
  console.log(`  Total tokens: ${allLedger.length}`)
  console.log(`  Surfaces:     ${surfaces.join(', ')}`)
  console.log('')
  console.log('  Tier counts by type:')
  console.log(`    colors      canonical: ${colorResult.counts.canonical.toString().padStart(4)}  candidate: ${colorResult.counts.candidate.toString().padStart(4)}  deprecated: ${colorResult.counts.deprecated.toString().padStart(5)}`)
  console.log(`    typography  canonical: ${typoResult.counts.canonical.toString().padStart(4)}  candidate: ${typoResult.counts.candidate.toString().padStart(4)}  deprecated: ${typoResult.counts.deprecated.toString().padStart(5)}`)
  console.log(`    shadows     canonical: ${shadowResult.counts.canonical.toString().padStart(4)}  candidate: ${shadowResult.counts.candidate.toString().padStart(4)}  deprecated: ${shadowResult.counts.deprecated.toString().padStart(5)}`)
  if (otherResult.ledger.length > 0) {
    console.log(`    other       canonical: ${otherResult.counts.canonical.toString().padStart(4)}  candidate: ${otherResult.counts.candidate.toString().padStart(4)}  deprecated: ${otherResult.counts.deprecated.toString().padStart(5)}`)
  }

  // Report — top 10 canonical colors
  const canonicalColors = allLedger
    .filter(t => t.type === 'color' && t.canonical)
    .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
    .slice(0, 10)
  console.log('\n  Top 10 canonical colors:')
  for (const t of canonicalColors) {
    console.log(`    ${t.name.padEnd(10)} ${t.value.padEnd(12)} ${t.usageCount?.toLocaleString().padStart(8)} uses`)
  }

  // Report — canonical typography
  const canonicalTypo = allLedger
    .filter(t => t.type === 'typography' && t.canonical)
    .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
  console.log('\n  Canonical typography scale:')
  console.log('    rank  family         size  weight  uses')
  for (const t of canonicalTypo) {
    const raw = t.raw as { family?: string; size?: number | null; weight?: number | null; rank?: number } | undefined
    const family = String(raw?.family ?? '—').padEnd(14)
    const size = String(raw?.size ?? '—').padStart(4)
    const weight = String(raw?.weight ?? '—').padStart(6)
    const uses = (t.usageCount ?? 0).toLocaleString().padStart(6)
    console.log(`    ${t.name.padEnd(14)} ${family} ${size} ${weight}  ${uses}`)
  }
}

main().catch(err => {
  console.error('[resolver] Fatal:', err)
  process.exit(1)
})
