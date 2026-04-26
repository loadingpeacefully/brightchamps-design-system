import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const DRIFT_DIR = path.join(REPO_ROOT, 'ledger', 'drift')

export interface SourceDriftReport {
  generatedAt: string
  source: string
  repo: string
  summary: {
    totalUniqueColors: number
    solidHexCount: number
    threeDigitHexCount: number
    totalColorOccurrences: number
    exactTokenMatches: number
    closeMatches: number
    driftColors: number
    missingFromLedger: number
    tokenAdoption: {
      totalColorDeclarations: number
      usingHardcodedHex: number
      usingSCSSVar: number
      usingCSSVar: number
      adoptionRateScss: string
      adoptionRateCssVar: string
      adoptionRateAny: string
    }
    filesScanned: number
    filesNeedingMigration: number
    filesZeroAdoption: number
    brandPurpleBreakdown: Record<string, number>
  }
  colorDrift: Array<{
    value: string
    occurrences: number
    closestToken: string
    closestValue: string
    deltaE: number
    status: string
    dcTicket: string | null
    semanticRole: string | null
    recommendation: string
  }>
  missingTokens: Array<{
    value: string
    occurrences: number
    closestToken: string
    closestValue: string
    deltaE: number
    status: string
    dcTicket: string | null
    semanticRole: string | null
    recommendation: string
  }>
  adoptionByFile: Array<{
    file: string
    hardcodedColors: number
    scssVarColors: number
    cssVarColors: number
    adoptionRate: string
    adoptionRateNum: number
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  }>
}

export function loadSourceDrift(): SourceDriftReport | null {
  try {
    const files = readdirSync(DRIFT_DIR).filter(f => /^source-drift-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort()
    if (files.length === 0) return null
    const latest = files[files.length - 1]!
    return JSON.parse(readFileSync(path.join(DRIFT_DIR, latest), 'utf-8')) as SourceDriftReport
  } catch {
    return null
  }
}
