/**
 * src/publish/figma-variables.ts
 *
 * Publishes canonical tokens from ledger/tokens.json back to Figma
 * as a Variables collection via the Figma Variables REST API.
 *
 * SAFETY: Will not run if there are pending drift items (see ADR-0006).
 * Usage: npm run publish:figma
 */

import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import 'dotenv/config'
import { surfaces, figmaTokenEnvKey } from '../../surfaces.config.js'
import type { DesignToken, DriftReport, LedgerState } from '../types/index.js'

const LEDGER_DIR = 'ledger'

// ─── Safety check ─────────────────────────────────────────────────────────────

function checkNoPendingDrift(): void {
  const driftDir = path.join(LEDGER_DIR, 'drift')
  let pendingCount = 0

  try {
    const files = readdirSync(driftDir).filter(f => f.endsWith('.json'))
    for (const f of files) {
      const report = JSON.parse(readFileSync(path.join(driftDir, f), 'utf-8')) as DriftReport
      pendingCount += report.items.filter(i => !i.resolution).length
    }
  } catch {
    // No drift files — safe to proceed
    return
  }

  if (pendingCount > 0) {
    console.error(`[publish:figma] ⛔ ${pendingCount} drift items still pending review.`)
    console.error(`[publish:figma] Run 'npm run drift:review' and resolve all items first.`)
    process.exit(1)
  }
}

// ─── Figma Variables API ──────────────────────────────────────────────────────

async function postToFigma(fileId: string, body: unknown): Promise<unknown> {
  const token = process.env[figmaTokenEnvKey]
  if (!token) throw new Error(`${figmaTokenEnvKey} not set in .env`)

  const res = await fetch(`https://api.figma.com/v1/files/${fileId}/variables`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Figma API ${res.status}: ${text}`)
  }

  return res.json()
}

function tokenToFigmaValue(token: DesignToken): unknown {
  if (token.type === 'color') {
    const hex = token.value.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    return { r, g, b, a: 1 }
  }

  if (token.type === 'spacing' || token.type === 'radius') {
    return parseFloat(token.value)
  }

  return token.value
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('[publish:figma] Checking drift status...')
  checkNoPendingDrift()

  console.log('[publish:figma] Loading ledger...')
  let ledger: LedgerState
  try {
    const raw = readFileSync(path.join(LEDGER_DIR, 'tokens.json'), 'utf-8')
    ledger = JSON.parse(raw) as LedgerState
  } catch {
    console.error('[publish:figma] Ledger not found. Run npm run ledger:build first.')
    process.exit(1)
  }

  const approvedTokens = ledger.tokens.filter(t => !t.deprecated && t.confidence >= 0.8)
  console.log(`[publish:figma] Publishing ${approvedTokens.length} tokens...`)

  // Group tokens by surface, publish to each Figma file
  for (const surface of surfaces) {
    if (!surface.figmaFileId) continue

    const surfaceTokens = approvedTokens.filter(t => t.surface === surface.name)
    if (surfaceTokens.length === 0) continue

    console.log(`\n  → ${surface.displayName} (${surface.figmaFileId}): ${surfaceTokens.length} tokens`)

    const variablesPayload = {
      variableCollections: [{
        action: 'CREATE',
        id: 'bc-design-system',
        name: 'BrightChamps Design System',
        initialModeId: 'default',
      }],
      variables: surfaceTokens.map((token) => ({
        action: 'CREATE',
        id: token.id,
        name: token.name,
        variableCollectionId: 'bc-design-system',
        resolvedType: token.type === 'color' ? 'COLOR' : 'FLOAT',
        valuesByMode: {
          default: tokenToFigmaValue(token),
        },
      })),
    }

    try {
      await postToFigma(surface.figmaFileId, variablesPayload)
      console.log(`  ✓ Published`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ Error: ${message}`)
    }
  }

  console.log('\n[publish:figma] Done.')
}

main().catch(err => {
  console.error('[publish:figma] Fatal:', err)
  process.exit(1)
})
