import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const DRIFT_DIR = path.join(REPO_ROOT, 'ledger', 'drift')

export interface DriftSummary {
  date: string
  totalItems: number
  match: number
  drift: number
  missing: number
  unknown: number
  systemGap: number
  matchPct: number
  surfaces: string[]
}

export function loadLatestDrift(): DriftSummary | null {
  try {
    const files = readdirSync(DRIFT_DIR).filter(f => f.endsWith('.json')).sort()
    if (files.length === 0) return null
    const latest = files[files.length - 1]!
    const raw = JSON.parse(readFileSync(path.join(DRIFT_DIR, latest), 'utf-8'))
    const bs = raw.byStatus ?? {}
    const m = bs.match ?? 0
    const d = bs.drift ?? 0
    const mi = bs.missing ?? 0
    const u = bs.unknown ?? 0
    const sg = bs['system-gap'] ?? 0
    const total = m + d + mi + u + sg
    return {
      date: latest.replace('.json', ''),
      totalItems: raw.totalItems ?? total,
      match: m,
      drift: d,
      missing: mi,
      unknown: u,
      systemGap: sg,
      matchPct: total > 0 ? Math.round((m / total) * 100) : 0,
      surfaces: raw.surfaces ?? [],
    }
  } catch {
    return null
  }
}
