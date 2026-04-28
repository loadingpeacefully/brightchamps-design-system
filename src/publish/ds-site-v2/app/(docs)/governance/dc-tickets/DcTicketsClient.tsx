'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { DesignerConflict } from '@/lib/designer-conflicts'

type SeverityFilter = 'all' | DesignerConflict['severity']
type CategoryFilter = 'all' | DesignerConflict['category']
type StatusFilter = 'all' | DesignerConflict['status']

const SEVERITY: { id: SeverityFilter; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'high',     label: 'High' },
  { id: 'medium',   label: 'Medium' },
  { id: 'low',      label: 'Low' },
]
const CATEGORY: { id: CategoryFilter; label: string }[] = [
  { id: 'all',         label: 'All categories' },
  { id: 'color',       label: 'Color' },
  { id: 'system',      label: 'System' },
  { id: 'typography',  label: 'Typography' },
]
const STATUS: { id: StatusFilter; label: string }[] = [
  { id: 'all',                  label: 'All status' },
  { id: 'open',                 label: 'Open' },
  { id: 'pending-confirmation', label: 'Pending' },
  { id: 'resolved',             label: 'Resolved' },
]

function severityColor(s: DesignerConflict['severity']) {
  if (s === 'critical') return { bg: 'rgba(240,41,77,0.22)',  fg: '#a31836' }
  if (s === 'high')     return { bg: 'rgba(255,124,53,0.22)', fg: '#9c4500' }
  if (s === 'medium')   return { bg: 'rgba(255,205,106,0.30)', fg: '#8a5e00' }
  return { bg: 'rgba(13,108,161,0.14)', fg: '#0d47a1' }
}
function statusColor(s: DesignerConflict['status']) {
  if (s === 'open')                  return { bg: 'rgba(240,41,77,0.18)', fg: '#a31836' }
  if (s === 'pending-confirmation') return { bg: 'rgba(255,205,106,0.30)', fg: '#8a5e00' }
  return { bg: 'rgba(36,194,110,0.18)', fg: '#0e6a32' }
}

function isHex(v: string | null | undefined): boolean {
  return !!v && /^#[0-9a-fA-F]{6}$/.test(v)
}

export function DcTicketsClient({ tickets }: { tickets: DesignerConflict[] }) {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter(t => {
      if (severity !== 'all' && t.severity !== severity) return false
      if (category !== 'all' && t.category !== category) return false
      if (status !== 'all' && t.status !== status) return false
      if (!q) return true
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.designerValue?.toLowerCase().includes(q) ?? false) ||
        (t.productionValue?.toLowerCase().includes(q) ?? false) ||
        t.action.toLowerCase().includes(q)
      )
    })
  }, [tickets, query, severity, category, status])

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] items-end">
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Search</span>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-chrome-text-subtlest pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ID, title, hex, or action"
              className="w-full rounded-md border border-chrome-border bg-chrome-surface pl-8 pr-3 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Category</span>
          <select value={category} onChange={e => setCategory(e.target.value as CategoryFilter)}
            className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
            {CATEGORY.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-overline text-chrome-text-subtlest mb-1 block">Status</span>
          <select value={status} onChange={e => setStatus(e.target.value as StatusFilter)}
            className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
            {STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <div className="text-[11px] text-chrome-text-subtlest tabular-nums whitespace-nowrap">{filtered.length} / {tickets.length}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SEVERITY.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSeverity(s.id)}
            className={'rounded-full border px-3 py-1 text-[11.5px] font-semibold transition ' +
              (severity === s.id
                ? 'border-chrome-accent bg-chrome-accent text-white'
                : 'border-chrome-border bg-chrome-surface text-chrome-text-subtle hover:border-chrome-accent hover:text-chrome-accent')}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map(t => {
          const sev = severityColor(t.severity)
          const stt = statusColor(t.status)
          return (
            <article key={t.id} className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[13px] font-bold text-chrome-text">{t.id}</span>
                  <h3 className="text-body-l font-bold text-chrome-text leading-tight">{t.title}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: sev.bg, color: sev.fg }}>{t.severity}</span>
                  <span className="rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] bg-chrome-surface-sunken text-chrome-text-subtle">{t.category}</span>
                  <span className="rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: stt.bg, color: stt.fg }}>{t.status}</span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-center">
                <div className="flex items-center gap-2">
                  {isHex(t.designerValue) && (
                    <span aria-hidden className="block h-7 w-7 rounded-md border border-chrome-border shrink-0" style={{ background: t.designerValue ?? undefined }} />
                  )}
                  <div className="min-w-0">
                    <div className="text-overline text-chrome-text-subtlest">Designer intent</div>
                    <div className="font-mono text-[12.5px] text-chrome-text truncate">{t.designerValue ?? '—'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isHex(t.productionValue) && (
                    <span aria-hidden className="block h-7 w-7 rounded-md border border-chrome-border shrink-0" style={{ background: t.productionValue ?? undefined }} />
                  )}
                  <div className="min-w-0">
                    <div className="text-overline text-chrome-text-subtlest">Production</div>
                    <div className="font-mono text-[12.5px] text-chrome-text truncate">{t.productionValue ?? '—'}</div>
                  </div>
                </div>
                {t.deltaE != null && (
                  <div className="text-right">
                    <div className="text-overline text-chrome-text-subtlest">ΔE</div>
                    <div className="font-mono text-[14px] font-bold tabular-nums text-chrome-text">{t.deltaE}</div>
                  </div>
                )}
              </div>

              {(t.threeWayConflict || t.fourWayConflict || t.fiveWayConflict) && (
                <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-4">
                  {t.productionFigmaValue && (
                    <ExtraValue label="Prod Figma" hex={t.productionFigmaValue} />
                  )}
                  {t.productionCodeValue && (
                    <ExtraValue label="Prod code" hex={t.productionCodeValue} />
                  )}
                  {t.productionCodeValue2 && (
                    <ExtraValue label="Code (alt)" hex={t.productionCodeValue2} />
                  )}
                  {t.fifthVariant && (
                    <ExtraValue label="5th variant" hex={t.fifthVariant} />
                  )}
                </div>
              )}

              <p className="mt-3 text-body-s text-chrome-text"><strong>Action:</strong> {t.action}</p>
              {t.notes && <p className="mt-1 text-body-s text-chrome-text-subtle"><strong>Notes:</strong> {t.notes}</p>}
            </article>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-card border border-dashed border-chrome-border bg-chrome-surface px-4 py-8 text-center text-body-s text-chrome-text-subtle">
            No tickets match these filters.
          </div>
        )}
      </div>
    </div>
  )
}

function ExtraValue({ label, hex }: { label: string; hex: string }) {
  const showSwatch = isHex(hex)
  return (
    <div className="flex items-center gap-2 rounded-md border border-chrome-border bg-chrome-surface px-2 py-1.5">
      {showSwatch && <span aria-hidden className="block h-5 w-5 rounded-sm border border-chrome-border shrink-0" style={{ background: hex }} />}
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.04em] text-chrome-text-subtlest">{label}</div>
        <div className="font-mono text-[11px] text-chrome-text truncate">{hex}</div>
      </div>
    </div>
  )
}
