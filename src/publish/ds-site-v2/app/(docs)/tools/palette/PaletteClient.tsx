'use client'

import { useMemo, useState } from 'react'
import { Copy, Check, Search } from 'lucide-react'
import { colors, type ColorCategory, type Tier } from '@/lib/tokens.generated'

type CategoryFilter = ColorCategory | 'all'
type TierFilter = Tier | 'all'

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all',         label: 'All' },
  { id: 'brand',       label: 'Brand' },
  { id: 'neutral',     label: 'Neutral' },
  { id: 'feedback',    label: 'Feedback' },
  { id: 'surface',     label: 'Surface' },
  { id: 'overlay',     label: 'Overlay' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'course',      label: 'Course' },
]

const TIERS: { id: TierFilter; label: string }[] = [
  { id: 'all',        label: 'All tiers' },
  { id: 'canonical',  label: 'Canonical' },
  { id: 'candidate',  label: 'Candidate' },
  { id: 'deprecated', label: 'Deprecated' },
]

function isLight(hex: string): boolean {
  const m = hex.replace('#', '')
  if (m.length < 6) return true
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

export function PaletteClient() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [tier, setTier] = useState<TierFilter>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return colors.filter(c => {
      if (category !== 'all' && c.category !== category) return false
      if (tier !== 'all' && c.tier !== tier) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q) ||
        c.cssVar.toLowerCase().includes(q)
      )
    })
  }, [query, category, tier])

  const copy = async (text: string, key: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(c => (c === key ? null : c)), 1200)
    } catch {}
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] items-end">
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Search</span>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-chrome-text-subtlest pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, hex, or var"
              className="w-full rounded-md border border-chrome-border bg-chrome-surface pl-8 pr-3 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Tier</span>
          <select value={tier} onChange={e => setTier(e.target.value as TierFilter)}
            className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
            {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>
        <div className="text-[11px] text-chrome-text-subtlest tabular-nums">
          {filtered.length} / {colors.length}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={'rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ' +
              (category === c.id
                ? 'border-chrome-accent bg-chrome-accent text-white'
                : 'border-chrome-border bg-chrome-surface text-chrome-text-subtle hover:border-chrome-accent hover:text-chrome-accent')}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {filtered.map(c => {
          const lightOnDark = !isLight(c.value)
          const swatchTextColor = lightOnDark ? 'rgba(255,255,255,0.92)' : 'rgba(13,29,45,0.78)'
          return (
            <div key={c.name} className="rounded-card border border-chrome-border bg-chrome-surface-raised overflow-hidden">
              <div
                className="relative h-[72px] flex items-end justify-between p-2.5"
                style={{ background: c.value }}
              >
                <div style={{ color: swatchTextColor, fontSize: 11, fontFamily: 'var(--font-mono, monospace)' }}>
                  {c.value}
                </div>
                <span
                  className="rounded-[3px] px-1 py-[1px] text-[9.5px] font-bold uppercase tracking-[0.06em]"
                  style={{
                    background: c.tier === 'canonical' ? 'rgba(36,194,110,0.18)'
                              : c.tier === 'candidate' ? 'rgba(255,205,106,0.30)'
                              : 'rgba(240,41,77,0.22)',
                    color: c.tier === 'canonical' ? '#0e6a32'
                          : c.tier === 'candidate' ? '#8a5e00'
                          : '#a31836',
                  }}
                >
                  {c.tier}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <div className="font-mono text-[11.5px] text-chrome-text leading-tight break-all">{c.name}</div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <code className="font-mono text-[10.5px] text-chrome-text-subtle truncate">{`var(${c.cssVar})`}</code>
                  <button
                    type="button"
                    onClick={() => void copy(`var(${c.cssVar})`, c.name)}
                    className="inline-flex items-center gap-1 rounded-md border border-chrome-border-bold bg-chrome-surface px-1.5 py-0.5 text-[10px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition shrink-0"
                    aria-label={`Copy var(${c.cssVar})`}
                  >
                    {copied === c.name ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-chrome-text-subtlest">
                  <span className="capitalize">{c.category}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{c.usageCount.toLocaleString()} uses</span>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-card border border-dashed border-chrome-border bg-chrome-surface px-4 py-8 text-center text-body-s text-chrome-text-subtle">
            No tokens match these filters.
          </div>
        )}
      </div>
    </div>
  )
}
