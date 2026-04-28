import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '/badges — design audit',
  description: 'Production /badges frame compared to DS library — 84% match rate. Critical: Poppins font (DC-048).',
}

export default function BadgesAuditPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Audit</div>
      <h1 className="text-h1 text-chrome-text">/badges — design audit</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Production frame: <code className="font-mono text-[12.5px]">EznPshYN5XVc49fQSUOSEQ → Homepage on Badges New 2025 page (9631:11696, 1440×1767)</code>.
        TWO font families (Nunito + <strong>Poppins</strong>) — Poppins is critical net-new finding (DC-048). Match rate 84%.
      </p>

      <section className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Match rate</div>
          <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>84%</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">✅ Exact / ⚠️ Drift</div>
          <div className="text-[20px] font-bold text-chrome-text">3 / 12</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">❌ Missing</div>
          <div className="text-[20px] font-bold" style={{ color: '#a31836' }}>2</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Sidebar width</div>
          <div className="text-[20px] font-bold text-chrome-text">80px</div>
          <div className="text-[11px] text-chrome-text-subtlest">vs 240px on Nano Skills</div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 text-chrome-text">Critical finding: DC-048 (Poppins)</h2>
        <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text">
          Course chips (&ldquo;Coding&rdquo;, &ldquo;Codimath&rdquo;) use <strong>Poppins Medium</strong>. Production now ships THREE fonts:
        </p>
        <ul className="mt-3 ml-4 list-disc text-body-m text-chrome-text space-y-1 max-w-[62ch]">
          <li><strong>Nunito</strong> — canonical, in DS</li>
          <li><strong>Montserrat</strong> — CTAs on /nano-skills (DC-039)</li>
          <li><strong>Poppins</strong> — chips on /badges (DC-048) + Game Dashboard surface</li>
        </ul>
        <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text">
          Decision pending at <a className="text-chrome-accent hover:underline" href="/governance/pending-decisions/">PD-009</a>:
          add Poppins as <code className="font-mono">font/family/tertiary</code>, OR codemod chips to Nunito.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 text-chrome-text">Other findings</h2>
        <ul className="mt-3 ml-4 list-disc text-body-m text-chrome-text space-y-1.5 max-w-[62ch]">
          <li><strong>Sidebar = 80px</strong> here, but 240px on /nano-skills + /my-feed + /learn. Two production widths shipping inconsistently. PD-003 covers.</li>
          <li><strong>Different student name</strong>: &ldquo;Sarah&rdquo; on /badges vs &ldquo;Troy Darmawan&rdquo; everywhere else. Designer canonical example student is not consistent.</li>
          <li><strong>Warm-gray sprawl</strong>: <code className="font-mono">#424242</code>, <code className="font-mono">#8e8e8e</code>, <code className="font-mono">#b5b5b5</code> on one screen — DC-050 family</li>
          <li>Brand purple <code className="font-mono">#4e3bc2</code> (production canonical) confirmed live for &ldquo;Codimath&rdquo; chip — DC-005</li>
        </ul>
      </section>

      <section className="mt-10 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <p className="text-body-s text-chrome-text">
          Full diff: <code className="font-mono text-[12px]">docs/figma-audit/badges-diff-2026-04-29.md</code><br />
          Production extract: <code className="font-mono text-[12px]">docs/figma-audit/badges-production-2026-04-29.json</code>
        </p>
      </section>
    </article>
  )
}
