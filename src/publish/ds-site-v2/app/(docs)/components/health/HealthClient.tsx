'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { ComponentSpec } from '@/lib/componentSpecs'

type StatusFilter = 'all' | ComponentSpec['verificationStatus']
type TargetFilter = 'all' | ComponentSpec['target']
type SortKey = 'name' | 'conflicts' | 'tokens' | 'status'

const STATUS: { id: StatusFilter; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'verified',  label: 'Verified' },
  { id: 'inferred',  label: 'Inferred' },
  { id: 'conflict',  label: 'Conflict' },
]
const TARGET: { id: TargetFilter; label: string }[] = [
  { id: 'all',           label: 'All targets' },
  { id: 'newDashboard',  label: 'newDashboard' },
  { id: 'sections',      label: 'sections' },
]

function statusColor(s: ComponentSpec['verificationStatus']) {
  if (s === 'verified') return { bg: 'rgba(36,194,110,0.15)', fg: '#0e6a32' }
  if (s === 'inferred') return { bg: 'rgba(255,205,106,0.30)', fg: '#8a5e00' }
  return { bg: 'rgba(240,41,77,0.18)', fg: '#a31836' }
}

export function HealthClient({ specs }: { specs: ComponentSpec[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [target, setTarget] = useState<TargetFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('status')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const arr = specs.filter(s => {
      if (status !== 'all' && s.verificationStatus !== status) return false
      if (target !== 'all' && s.target !== target) return false
      if (q && !s.name.toLowerCase().includes(q) && !s.slug.toLowerCase().includes(q)) return false
      return true
    })
    arr.sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'conflicts') return (b.conflicts?.length ?? 0) - (a.conflicts?.length ?? 0)
      if (sortKey === 'tokens') return b.tokens.length - a.tokens.length
      const order = { conflict: 0, inferred: 1, verified: 2 } as const
      return order[a.verificationStatus] - order[b.verificationStatus]
    })
    return arr
  }, [specs, query, status, target, sortKey])

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] items-end">
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Search</span>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-chrome-text-subtlest pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Name or slug"
              className="w-full rounded-md border border-chrome-border bg-chrome-surface pl-8 pr-3 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Target</span>
          <select value={target} onChange={e => setTarget(e.target.value as TargetFilter)}
            className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
            {TARGET.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Sort by</span>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
            <option value="status">Status (worst first)</option>
            <option value="name">Name</option>
            <option value="conflicts">Conflict count</option>
            <option value="tokens">Token count</option>
          </select>
        </label>
        <div className="text-[11px] text-chrome-text-subtlest tabular-nums whitespace-nowrap">{filtered.length} / {specs.length}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {STATUS.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStatus(s.id)}
            className={'rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ' +
              (status === s.id
                ? 'border-chrome-accent bg-chrome-accent text-white'
                : 'border-chrome-border bg-chrome-surface text-chrome-text-subtle hover:border-chrome-accent hover:text-chrome-accent')}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
              <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
              <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
              <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Target</th>
              <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Variants</th>
              <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Tokens</th>
              <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Conflicts</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const c = statusColor(s.verificationStatus)
              const conflictCount = s.conflicts?.length ?? 0
              const slug = (s.slug || s.name.toLowerCase().replace(/\s+/g, '-'))
              return (
                <tr key={s.slug + s.name} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken/50">
                  <td className="p-3">
                    <a href={`/components/${slug}/`} className="font-semibold text-chrome-text hover:text-chrome-accent hover:underline">
                      {s.name}
                    </a>
                    <div className="font-mono text-[11px] text-chrome-text-subtlest">{slug}</div>
                  </td>
                  <td className="p-3">
                    <span className="rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: c.bg, color: c.fg }}>
                      {s.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-chrome-text-subtle text-[12px]">{s.target}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{s.variants.length}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{s.tokens.length}</td>
                  <td className="p-3 text-right font-mono tabular-nums" style={{ color: conflictCount > 0 ? '#a31836' : 'var(--chrome-text-subtlest)' }}>{conflictCount}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-body-s text-chrome-text-subtle">No components match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
