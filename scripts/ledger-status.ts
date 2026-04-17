/**
 * scripts/ledger-status.ts
 *
 * Prints the current state of ledger/tokens.json:
 * token count, last built date, and surfaces covered.
 *
 * Usage: npm run ledger:status
 */

import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { LedgerState } from '../src/types/index.js'

const LEDGER_PATH = path.join('ledger', 'tokens.json')

function main(): void {
  if (!existsSync(LEDGER_PATH)) {
    console.log('[ledger:status] No ledger found.')
    console.log(`[ledger:status] Expected at: ${LEDGER_PATH}`)
    console.log(`[ledger:status] Run 'npm run ledger:build' after extraction.`)
    return
  }

  let ledger: LedgerState
  try {
    const raw = readFileSync(LEDGER_PATH, 'utf-8')
    ledger = JSON.parse(raw) as LedgerState
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[ledger:status] Failed to read ledger: ${message}`)
    process.exit(1)
  }

  if (!ledger.tokens || !ledger.version) {
    console.log('[ledger:status] Ledger present but not yet built.')
    console.log(`[ledger:status] Run 'npm run ledger:build' after extraction.`)
    return
  }

  const surfaces = [...new Set(ledger.tokens.map(t => t.surface))].sort()
  const byType = new Map<string, number>()
  for (const t of ledger.tokens) {
    byType.set(t.type, (byType.get(t.type) ?? 0) + 1)
  }

  console.log('[ledger:status]')
  console.log(`  Version:     ${ledger.version}`)
  console.log(`  Last built:  ${ledger.lastBuilt}`)
  console.log(`  Tokens:      ${ledger.tokenCount}`)
  console.log(`  Components:  ${ledger.componentCount}`)
  console.log(`  Surfaces:    ${surfaces.join(', ') || '(none)'}`)
  console.log(`  By type:`)
  for (const [type, count] of [...byType].sort()) {
    console.log(`    ${type.padEnd(12)} ${count}`)
  }
}

main()
