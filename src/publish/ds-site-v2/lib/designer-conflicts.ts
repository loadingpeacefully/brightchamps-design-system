import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const DRIFT_DIR = path.join(REPO_ROOT, 'ledger', 'drift')

export interface DesignerConflict {
  id: string
  title: string
  designerValue: string | null
  productionValue: string | null
  /** Optional, for three-way+ conflicts: the value extracted from production Figma. */
  productionFigmaValue?: string | null
  /** Optional, for three-way+ conflicts: the value found in production source code (feed repo). */
  productionCodeValue?: string | null
  /** Optional, for four-way conflicts: a second production-code value (e.g., the dashboard repo's shipping designer purple). */
  productionCodeValue2?: string | null
  /** True when designer / production-Figma / production-code all disagree. */
  threeWayConflict?: boolean
  /** True when a fourth value (e.g., the dashboard repo) is also shipping. Implies threeWayConflict. */
  fourWayConflict?: boolean
  deltaE: number | null
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: 'color' | 'system' | 'typography'
  action: string
  status: 'open' | 'pending-confirmation' | 'resolved'
  notes?: string
}

export interface DesignerConflictReport {
  id: string
  generatedAt: string
  source: string
  description: string
  tickets: DesignerConflict[]
}

export function loadLatestDesignerConflicts(): DesignerConflictReport | null {
  try {
    const files = readdirSync(DRIFT_DIR)
      .filter(f => f.endsWith('.json') && f.startsWith('designer-'))
      .sort()
    if (files.length === 0) return null
    const latest = files[files.length - 1]!
    return JSON.parse(readFileSync(path.join(DRIFT_DIR, latest), 'utf-8')) as DesignerConflictReport
  } catch {
    return null
  }
}
