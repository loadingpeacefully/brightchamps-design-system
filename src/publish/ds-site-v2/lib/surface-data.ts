import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..')
const STUDENT_DIR = path.join(REPO_ROOT, 'ledger', 'surfaces', 'student')
const DRIFT_DIR = path.join(REPO_ROOT, 'ledger', 'drift')

export interface ComponentEntry {
  prefix: string
  elements: number
  localNames: string[]
  pages: string[]
}

export interface IconEntry {
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

export interface StateEntry {
  selector: string
  text: string
  page: string
  baseline: { color: string; backgroundColor: string; borderColor: string }
  hovered: { color: string; backgroundColor: string; borderColor: string }
  changed: boolean
}

export interface DriftItem {
  tokenName: string
  tokenType: string
  domValue: string | null
  figmaValue: string | null
  delta?: number
  status?: string
  severity: string
  domPages?: string[]
}

function loadJSON<T>(filepath: string): T {
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T
}

export function loadComponents(): ComponentEntry[] {
  return loadJSON(path.join(STUDENT_DIR, 'components.json'))
}

export function loadIcons(): IconEntry[] {
  return loadJSON(path.join(STUDENT_DIR, 'icons.json'))
}

export function loadStates(): StateEntry[] {
  return loadJSON(path.join(STUDENT_DIR, 'states.json'))
}

export function loadDriftItems(): DriftItem[] {
  try {
    const files = require('fs').readdirSync(DRIFT_DIR).filter((f: string) => f.endsWith('.json')).sort() as string[]
    if (files.length === 0) return []
    const latest = files[files.length - 1]!
    const data = loadJSON<{ items: DriftItem[] }>(path.join(DRIFT_DIR, latest))
    return data.items
  } catch {
    return []
  }
}
