import type { Metadata } from 'next'
import { loadLatestDesignerConflicts } from '@/lib/designer-conflicts'
import { DcTicketsClient } from './DcTicketsClient'

export const metadata: Metadata = {
  title: 'Designer-conflict tickets',
  description: 'All open designer-conflict (DC) tickets — color, system, and typography drifts between designer intent and production. Filter by severity, category, status.',
}

export default function DcTicketsPage() {
  const report = loadLatestDesignerConflicts()
  if (!report) {
    return (
      <article className="min-w-0 flex-1 max-w-[1120px]">
        <h1 className="text-h1 text-chrome-text">Designer-conflict tickets</h1>
        <p className="mt-4 text-body-m text-chrome-text-subtle">No conflict report found in <code className="font-mono">ledger/drift/</code>.</p>
      </article>
    )
  }
  const tickets = report.tickets
  const open = tickets.filter(t => t.status === 'open').length
  const pending = tickets.filter(t => t.status === 'pending-confirmation').length
  const resolved = tickets.filter(t => t.status === 'resolved').length
  const critical = tickets.filter(t => t.severity === 'critical').length
  const high = tickets.filter(t => t.severity === 'high').length
  const color = tickets.filter(t => t.category === 'color').length
  const system = tickets.filter(t => t.category === 'system').length
  const typography = tickets.filter(t => t.category === 'typography').length

  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Governance</div>
      <h1 className="text-h1 text-chrome-text">Designer-conflict tickets</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Every disagreement between designer intent and production. Source: <code className="font-mono text-[12.5px]">{report.source}</code>.
        Generated <code className="font-mono text-[12.5px]">{report.generatedAt}</code>. Tickets must be resolved by the
        brand team or via codemod before the conflict closes.
      </p>

      <section className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Total tickets</div>
          <div className="text-[28px] font-bold text-chrome-text">{tickets.length}</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Open</div>
          <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>{open}</div>
          <div className="text-[11px] text-chrome-text-subtlest">{pending} pending confirmation</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Critical / High</div>
          <div className="text-[28px] font-bold" style={{ color: '#9c4500' }}>{critical + high}</div>
          <div className="text-[11px] text-chrome-text-subtlest">{critical} critical · {high} high</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Resolved</div>
          <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>{resolved}</div>
        </div>
      </section>

      <section className="mt-3 grid gap-3 grid-cols-3">
        <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
          <div className="text-overline text-chrome-text-subtlest mb-1">Color</div>
          <div className="text-[20px] font-bold text-chrome-text">{color}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {tickets.length}</span></div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
          <div className="text-overline text-chrome-text-subtlest mb-1">System</div>
          <div className="text-[20px] font-bold text-chrome-text">{system}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {tickets.length}</span></div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
          <div className="text-overline text-chrome-text-subtlest mb-1">Typography</div>
          <div className="text-[20px] font-bold text-chrome-text">{typography}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {tickets.length}</span></div>
        </div>
      </section>

      <section className="mt-10">
        <DcTicketsClient tickets={tickets} />
      </section>

      <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <h2 className="text-h3 text-chrome-text">Resolution protocol</h2>
        <ol className="mt-3 ml-4 list-decimal text-body-m text-chrome-text space-y-1.5">
          <li><strong>Color tickets</strong> require brand sign-off — engineers cannot ship a hex change without explicit approval. The brand team votes designer-intent vs production, and the loser becomes a one-pass codemod.</li>
          <li><strong>System tickets</strong> (radius, spacing, sizing) typically have an obvious answer; they’re engineering-resolvable.</li>
          <li><strong>Typography tickets</strong> require both teams — sizing/weight is an engineering call, but family + tracking are designer-owned.</li>
          <li>Resolution updates the ticket <code className="font-mono">status</code> to <code className="font-mono">resolved</code> and adds a <code className="font-mono">notes</code> entry pointing at the codemod commit or design decision.</li>
        </ol>
      </section>
    </article>
  )
}
