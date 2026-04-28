import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { pendingDecisions, type PendingDecision } from '@/lib/pendingDecisions'

export const metadata: Metadata = {
  title: 'Pending decisions',
  description: 'Open questions blocking design system accuracy. Answer these to unblock downstream token updates, codemods, and screen rebuilds.',
}

const TOC = [
  { id: 'summary',   label: 'Summary',         level: 2 as const },
  { id: 'decisions', label: 'Open decisions',  level: 2 as const },
  { id: 'protocol',  label: 'Answer protocol', level: 2 as const },
]

function statusEmoji(s: PendingDecision['status']) {
  if (s === 'open') return '🔴'
  if (s === 'answered') return '🟡'
  return '🟢'
}
function statusColors(s: PendingDecision['status']) {
  if (s === 'open')      return { bg: 'rgba(240,41,77,0.18)',  fg: '#a31836', label: 'OPEN' }
  if (s === 'answered')  return { bg: 'rgba(255,205,106,0.30)', fg: '#8a5e00', label: 'ANSWERED' }
  return                       { bg: 'rgba(36,194,110,0.18)',  fg: '#0e6a32', label: 'RESOLVED' }
}

export default function PendingDecisionsPage() {
  const open = pendingDecisions.filter(p => p.status === 'open').length
  const answered = pendingDecisions.filter(p => p.status === 'answered').length
  const resolved = pendingDecisions.filter(p => p.status === 'resolved').length
  const blockingTickets = new Set(pendingDecisions.flatMap(p => p.blocks).filter(b => /^DC-/.test(b))).size
  const screensAffectedMax = Math.max(...pendingDecisions.map(p => p.screensAffected))
  const oldestDays = Math.max(...pendingDecisions.filter(p => p.status === 'open').map(p => p.daysOpen))

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[1120px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Governance</div>
        <h1 className="text-h1 text-chrome-text">Pending decisions</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Open questions blocking design system accuracy. Answer these to unblock downstream token updates,
          codemods, and screen rebuilds. When a decision is answered, the related DC tickets, components, and
          spec pages update automatically in the next session.
        </p>

        <section id="summary" className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">🔴 Open</div>
            <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>{open}</div>
            <div className="text-[11px] text-chrome-text-subtlest">{answered} answered · {resolved} resolved</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Blocking DC tickets</div>
            <div className="text-[28px] font-bold text-chrome-text">{blockingTickets}</div>
            <div className="text-[11px] text-chrome-text-subtlest">unique tickets blocked</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Screens affected</div>
            <div className="text-[28px] font-bold text-chrome-text">{screensAffectedMax}</div>
            <div className="text-[11px] text-chrome-text-subtlest">worst-case (whole app)</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Days open (oldest)</div>
            <div className="text-[28px] font-bold" style={{ color: oldestDays >= 3 ? '#a31836' : '#3d4d5d' }}>{oldestDays}</div>
            <div className="text-[11px] text-chrome-text-subtlest">days since filed</div>
          </div>
        </section>

        <section id="decisions" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Open decisions</h2>
          <div className="mt-4 space-y-4">
            {pendingDecisions.map(p => {
              const sc = statusColors(p.status)
              return (
                <article key={p.id} className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[14px] font-bold text-chrome-text">{p.id}</span>
                      <span className="text-[18px]" aria-hidden>{statusEmoji(p.status)}</span>
                      <span className="rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: sc.bg, color: sc.fg }}>{sc.label}</span>
                    </div>
                    <div className="text-[11px] text-chrome-text-subtlest tabular-nums">{p.daysOpen}d open · filed {p.filed}</div>
                  </div>
                  <p className="mt-3 text-body-m text-chrome-text font-semibold leading-snug">{p.question}</p>
                  <div className="mt-3 grid gap-1.5">
                    {p.options.map(o => (
                      <div key={o.letter} className="flex items-start gap-2 rounded-md border border-chrome-border bg-chrome-surface px-3 py-2">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-chrome-surface-sunken font-mono text-[11px] font-bold text-chrome-text">{o.letter}</span>
                        <span className="text-body-s text-chrome-text">{o.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 text-[11.5px]">
                    <div>
                      <div className="text-overline text-chrome-text-subtlest mb-0.5">Blocks</div>
                      <div className="font-mono text-chrome-text-subtle break-all">{p.blocks.join(' · ')}</div>
                    </div>
                    <div>
                      <div className="text-overline text-chrome-text-subtlest mb-0.5">Screens affected</div>
                      <div className="font-mono text-chrome-text-subtle">{p.screensAffected} {p.screensAffected === 35 ? '(all)' : ''}</div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="protocol" className="mt-12 scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <h2 className="text-h3 text-chrome-text">Answer protocol</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text">
            Reply in the design-system Slack channel with the PD-ID and option letter. Example:{' '}
            <code className="font-mono text-[13px] bg-chrome-surface-sunken px-1.5 py-0.5 rounded">PD-001: Option B</code>.
            The DS will update within one session — DC tickets transition to <em>resolved</em>, blocking codemods unblock,
            and screen rebuilds adopt the new token / variant.
          </p>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
