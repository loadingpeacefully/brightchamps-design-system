import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '/learn — design audit',
  description: 'Production /learn frame compared to DS library — 90% match rate (highest of audited screens).',
}

export default function LearnAuditPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Audit</div>
      <h1 className="text-h1 text-chrome-text">/learn — design audit</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Production frame: <code className="font-mono text-[12.5px]">EznPshYN5XVc49fQSUOSEQ → 2_a (9342:63313, 1440×2735)</code>.
        Single font family (Nunito ✓), 8 distinct text colors. Match rate <strong>90%</strong> — highest of the 4 audited screens.
      </p>

      <section className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Match rate</div>
          <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>90%</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">✅ Exact / ⚠️ Drift</div>
          <div className="text-[20px] font-bold text-chrome-text">3 / 6</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">❌ Missing</div>
          <div className="text-[20px] font-bold" style={{ color: '#a31836' }}>1</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">New DC tickets</div>
          <div className="text-[28px] font-bold text-chrome-text">0</div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 text-chrome-text">Why 0 new tickets</h2>
        <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
          /learn reuses the /my-feed DashboardLayout shell verbatim. Same course-progress cards, same right-sidebar
          profile, same calendar widget. All drift items inherit from the /my-feed audit (DC-005, DC-014, DC-040,
          DC-044, DC-047). This confirms course-progress-card is the highest-leverage pattern to extract as a
          Tier-5 DS molecule.
        </p>
      </section>

      <section className="mt-10 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <p className="text-body-s text-chrome-text">
          Full diff: <code className="font-mono text-[12px]">docs/figma-audit/learn-diff-2026-04-29.md</code><br />
          Production extract: <code className="font-mono text-[12px]">docs/figma-audit/learn-production-2026-04-29.json</code>
        </p>
      </section>
    </article>
  )
}
