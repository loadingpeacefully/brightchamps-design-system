'use client'

import { useState } from 'react'
import { Search, Check } from 'lucide-react'
import { iconNames, iconCategories } from '@/lib/icons.data'

export function IconSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = iconNames.filter(icon => {
    if (query && !icon.name.toLowerCase().includes(query.toLowerCase())) return false
    if (category && icon.category !== category) return false
    return true
  })

  const copy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name)
      setTimeout(() => setCopied(null), 1200)
    }).catch(() => {})
  }

  return (
    <div className="mt-6">
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-chrome-text-subtlest" />
          <input
            type="search"
            placeholder="Search icons by name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-md border border-chrome-border bg-chrome-surface pl-9 pr-3 py-2 text-[13px] text-chrome-text placeholder:text-chrome-text-subtlest outline-none focus:border-chrome-accent"
          />
        </div>
        <select
          value={category ?? ''}
          onChange={e => setCategory(e.target.value || null)}
          className="rounded-md border border-chrome-border bg-chrome-surface px-3 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent"
        >
          <option value="">All categories ({iconNames.length})</option>
          {iconCategories.map(cat => (
            <option key={cat} value={cat}>
              {cat} ({iconNames.filter(i => i.category === cat).length})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 text-[12px] text-chrome-text-subtlest">
        {filtered.length.toLocaleString()} icon{filtered.length !== 1 ? 's' : ''} shown
      </div>

      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
        {filtered.slice(0, 200).map((icon, i) => (
          <button
            key={`${icon.name}-${icon.category}-${i}`}
            type="button"
            onClick={() => copy(icon.name)}
            className="flex flex-col items-center justify-center rounded-md border border-chrome-border bg-chrome-surface-raised p-3 text-center hover:border-chrome-accent transition group"
            title={`${icon.name} · ${icon.category}`}
          >
            <div className="h-8 w-8 flex items-center justify-center rounded border border-dashed border-chrome-border-bold mb-2 text-[10px] font-mono text-chrome-text-subtlest">
              SVG
            </div>
            <div className="text-[11px] font-semibold text-chrome-text truncate w-full group-hover:text-chrome-accent">
              {copied === icon.name ? <span className="text-[color:var(--brand-green)] inline-flex items-center gap-0.5"><Check size={10} /> Copied</span> : icon.name}
            </div>
            <div className="text-[9px] text-chrome-text-subtlest truncate w-full">{icon.category}</div>
          </button>
        ))}
      </div>
      {filtered.length > 200 && (
        <p className="mt-4 text-[12px] text-chrome-text-subtlest text-center">
          Showing first 200 of {filtered.length.toLocaleString()}. Use search to narrow results.
        </p>
      )}
    </div>
  )
}
