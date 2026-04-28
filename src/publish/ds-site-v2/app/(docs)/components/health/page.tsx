import type { Metadata } from 'next'
import { componentSpecs } from '@/lib/componentSpecs'
import { HealthClient } from './HealthClient'

export const metadata: Metadata = {
  title: 'Component health',
  description: 'Verification status of every component spec — verified vs inferred vs conflict, conflict counts, and target migration tier.',
}

export default function ComponentHealthPage() {
  const total = componentSpecs.length
  const verified = componentSpecs.filter(c => c.verificationStatus === 'verified').length
  const inferred = componentSpecs.filter(c => c.verificationStatus === 'inferred').length
  const conflict = componentSpecs.filter(c => c.verificationStatus === 'conflict').length
  const totalConflicts = componentSpecs.reduce((sum, c) => sum + (c.conflicts?.length ?? 0), 0)
  const newDashboard = componentSpecs.filter(c => c.target === 'newDashboard').length
  const sections = componentSpecs.filter(c => c.target === 'sections').length

  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Components · Reference</div>
      <h1 className="text-h1 text-chrome-text">Component health</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Every component spec in <code className="font-mono text-[12.5px]">componentSpecs.ts</code> with its
        verification status, target migration tier, conflict count, and quick links to the spec page. Use this as
        the punch list for upgrading <strong>inferred</strong> entries to <strong>verified</strong> by reading the
        source SCSS.
      </p>

      <section className="mt-10">
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Total specs</div>
            <div className="text-[28px] font-bold text-chrome-text">{total}</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Verified</div>
            <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>{verified}</div>
            <div className="text-[11px] text-chrome-text-subtlest">{Math.round((verified / total) * 100)}% of total</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Inferred</div>
            <div className="text-[28px] font-bold" style={{ color: '#8a5e00' }}>{inferred}</div>
            <div className="text-[11px] text-chrome-text-subtlest">verification debt</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Conflict</div>
            <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>{conflict}</div>
            <div className="text-[11px] text-chrome-text-subtlest">spec disagrees with source</div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 grid-cols-3">
          <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">Migration target · newDashboard</div>
            <div className="text-[20px] font-bold text-chrome-text">{newDashboard}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {total}</span></div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">Migration target · sections</div>
            <div className="text-[20px] font-bold text-chrome-text">{sections}<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ {total}</span></div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">Total conflicts annotated</div>
            <div className="text-[20px] font-bold text-chrome-text">{totalConflicts}</div>
            <div className="text-[11px] text-chrome-text-subtlest">across all specs</div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <HealthClient specs={componentSpecs} />
      </section>

      <section className="mt-10 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <h2 className="text-h3 text-chrome-text">Verification protocol</h2>
        <ol className="mt-3 ml-4 list-decimal text-body-m text-chrome-text space-y-1.5">
          <li>Pick an <code className="font-mono">inferred</code> entry from the table above.</li>
          <li>Open the linked source file (path is on the spec page).</li>
          <li>Confirm every value in the <em>Token mapping</em> table matches the source SCSS.</li>
          <li>If everything matches: change <code className="font-mono">verificationStatus</code> to <code className="font-mono">verified</code>.</li>
          <li>If something disagrees: change to <code className="font-mono">conflict</code>, add the discrepancy to <code className="font-mono">conflicts[]</code>.</li>
          <li>If the source has more or fewer values than the spec: update the spec, then mark <code className="font-mono">verified</code>.</li>
        </ol>
      </section>
    </article>
  )
}
