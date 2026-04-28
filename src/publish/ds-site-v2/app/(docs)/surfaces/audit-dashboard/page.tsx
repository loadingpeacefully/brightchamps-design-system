import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { screenAudits } from '@/lib/audits'

export const metadata: Metadata = {
  title: 'Design audit dashboard',
  description: 'Production Figma vs DS library — screen-by-screen match analysis. Running totals across all audited screens.',
}

const TOC = [
  { id: 'overall',  label: 'Overall stats',     level: 2 as const },
  { id: 'screens',  label: 'Per-screen table',  level: 2 as const },
  { id: 'top',      label: 'Top issues',        level: 2 as const },
]

const TOTAL_SCREENS = 35  // total target

const TOP_ISSUES = [
  { issue: 'DC-014 #222a33 near-black sprawl',           ticket: 'DC-014',  screens: 4, priority: 'critical' },
  { issue: 'DC-005 brand purple — multi-value shipping', ticket: 'DC-005',  screens: 4, priority: 'critical' },
  { issue: 'DC-039 Montserrat font on CTAs',              ticket: 'DC-039',  screens: 1, priority: 'high' },
  { issue: 'DC-048 Poppins font on chips',                ticket: 'DC-048',  screens: 1, priority: 'high' },
  { issue: 'DC-038 CDN images blocked',                   ticket: 'DC-038',  screens: 4, priority: 'high' },
  { issue: 'DC-040 sidebar width 240 vs 80/280',           ticket: 'DC-040',  screens: 3, priority: 'medium' },
  { issue: 'Gray sprawl (DC-043/044/047/050)',             ticket: 'DC-050',  screens: 3, priority: 'medium' },
  { issue: 'DC-034 SelfPaced gradient — no token',         ticket: 'DC-034',  screens: 1, priority: 'medium' },
]

export default function AuditDashboardPage() {
  const audited = screenAudits.filter(a => a.status === 'audited')
  const pending = screenAudits.filter(a => a.status === 'pending')
  const totalSampled = audited.reduce((s, a) => s + (a.totalSampled ?? 0), 0)
  const totalExact   = audited.reduce((s, a) => s + (a.exact ?? 0), 0)
  const totalDrift   = audited.reduce((s, a) => s + (a.drift ?? 0), 0)
  const totalMissing = audited.reduce((s, a) => s + (a.missing ?? 0), 0)
  const totalCdn     = audited.reduce((s, a) => s + (a.cdn ?? 0), 0)
  const avgMatch     = audited.length > 0
    ? Math.round(audited.reduce((s, a) => s + (a.matchPct ?? 0), 0) / audited.length)
    : 0

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[1200px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Audit</div>
        <h1 className="text-h1 text-chrome-text">Design audit dashboard</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Production Figma vs DS library — screen-by-screen match analysis. {audited.length} of {TOTAL_SCREENS} screens
          audited so far. Each row links to the per-screen diff. Updates as more screens are walked.
        </p>

        <section id="overall" className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Screens audited</div>
            <div className="text-[28px] font-bold text-chrome-text">{audited.length}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {TOTAL_SCREENS}</span></div>
            <div className="text-[11px] text-chrome-text-subtlest">{Math.round((audited.length / TOTAL_SCREENS) * 100)}% complete</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Avg match rate</div>
            <div className="text-[28px] font-bold" style={{ color: avgMatch >= 75 ? '#0e6a32' : '#8a5e00' }}>{avgMatch}%</div>
            <div className="text-[11px] text-chrome-text-subtlest">{totalSampled} elements sampled</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Drift items</div>
            <div className="text-[28px] font-bold" style={{ color: '#8a5e00' }}>{totalDrift}</div>
            <div className="text-[11px] text-chrome-text-subtlest">{totalExact} exact · {totalMissing} missing</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">CDN images pending</div>
            <div className="text-[28px] font-bold text-chrome-text">{totalCdn}</div>
            <div className="text-[11px] text-chrome-text-subtlest">manual upload (DC-038)</div>
          </div>
        </section>

        <section id="screens" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Per-screen audit</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Screen</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Match %</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Exact</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Drift</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Missing</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">CDN</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">New DC tickets</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
                </tr>
              </thead>
              <tbody>
                {screenAudits.map(a => {
                  const isAudited = a.status === 'audited'
                  return (
                    <tr key={a.route} className="border-b border-chrome-border last:border-b-0">
                      <td className="p-3 font-mono text-[12.5px]">
                        {isAudited
                          ? <a className="text-chrome-text hover:text-chrome-accent hover:underline" href={`/surfaces/${a.slug}-audit/`}>{a.route}</a>
                          : <span className="text-chrome-text-subtlest">{a.route}</span>}
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums" style={{ color: a.matchPct == null ? 'var(--chrome-text-subtlest)' : a.matchPct >= 80 ? '#0e6a32' : a.matchPct >= 70 ? '#8a5e00' : '#a31836' }}>{a.matchPct != null ? `${a.matchPct}%` : '—'}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{a.exact ?? '—'}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{a.drift ?? '—'}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{a.missing ?? '—'}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{a.cdn ?? '—'}</td>
                      <td className="p-3 font-mono text-[11px] text-chrome-text-subtle">{(a.newDcTickets ?? []).length > 0 ? a.newDcTickets!.join(', ') : '—'}</td>
                      <td className="p-3"><span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (isAudited ? 'bg-[rgba(36,194,110,0.18)] text-[#0e6a32]' : 'bg-chrome-surface-sunken text-chrome-text-subtlest')}>{a.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="top" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Top issues across audited screens</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Drift items appearing on 3+ audited screens, sorted by priority.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Issue</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Ticket</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Screens affected</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Priority</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ISSUES.map(i => (
                  <tr key={i.issue} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 text-chrome-text">{i.issue}</td>
                    <td className="p-3 font-mono"><a className="text-chrome-accent hover:underline" href="/governance/dc-tickets/">{i.ticket}</a></td>
                    <td className="p-3 text-right font-mono tabular-nums">{i.screens}</td>
                    <td className="p-3"><span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (i.priority === 'critical' ? 'bg-[rgba(240,41,77,0.22)] text-[#a31836]' : i.priority === 'high' ? 'bg-[rgba(255,124,53,0.22)] text-[#9c4500]' : 'bg-[rgba(255,205,106,0.30)] text-[#8a5e00]')}>{i.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
