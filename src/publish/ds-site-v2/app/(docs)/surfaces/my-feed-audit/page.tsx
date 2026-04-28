import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '/my-feed — design audit',
  description: 'Production /my-feed frame compared to DS library — 72% match rate, 3 new DC tickets.',
}

export default function MyFeedAuditPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Audit</div>
      <h1 className="text-h1 text-chrome-text">/my-feed — design audit</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Production frame: <code className="font-mono text-[12.5px]">EznPshYN5XVc49fQSUOSEQ → My Feed (9325:8437, 1440×1065)</code>.
        80 text nodes, single font family (Nunito ✓), 14 distinct text colors. Match rate 72%.
      </p>

      <section className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">Match rate</div>
          <div className="text-[28px] font-bold" style={{ color: '#8a5e00' }}>72%</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">✅ Exact / ⚠️ Drift</div>
          <div className="text-[20px] font-bold text-chrome-text">2 / 11</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">❌ Missing</div>
          <div className="text-[20px] font-bold" style={{ color: '#a31836' }}>5</div>
        </div>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-1">🔲 CDN images</div>
          <div className="text-[20px] font-bold text-chrome-text">4</div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 text-chrome-text">New DC tickets</h2>
        <ul className="mt-3 ml-4 list-disc text-body-m text-chrome-text space-y-1.5 max-w-[62ch]">
          <li><strong>DC-049</strong> — magenta <code className="font-mono">#d227ba</code> + pink <code className="font-mono">#e866ff</code> feed accents (no DS equivalent)</li>
          <li><strong>DC-050</strong> — gray sprawl: 5 distinct grays (<code className="font-mono">#4d4d4d</code>, <code className="font-mono">#7d8892</code>, <code className="font-mono">#7e858d</code>, <code className="font-mono">#51667b</code>, <code className="font-mono">#28333e</code>) on a single screen</li>
          <li><strong>DC-051</strong> — electric blue <code className="font-mono">#409cf2</code> + coral <code className="font-mono">#f76969</code> for course-progress accents</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-h2 text-chrome-text">Highest-impact patterns</h2>
        <ul className="mt-3 ml-4 list-disc text-body-m text-chrome-text space-y-1.5 max-w-[62ch]">
          <li><strong>CourseProgressCard</strong> — Coding Fundamentals / App Development / Speak Translate App. Tier 5 component candidate; reused on /learn.</li>
          <li><strong>CommentBox</strong> — Comment as Troy Darmawan placeholder, Teacher Jacob author, timestamp. Tier 5 candidate.</li>
          <li>Sidebar = 240px (DC-040, same as /nano-skills)</li>
        </ul>
      </section>

      <section className="mt-10 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <p className="text-body-s text-chrome-text">
          Full diff: <code className="font-mono text-[12px]">docs/figma-audit/student-dashboard-diff-2026-04-29.md</code><br />
          Production extract: <code className="font-mono text-[12px]">docs/figma-audit/student-dashboard-production-2026-04-29.json</code>
        </p>
      </section>
    </article>
  )
}
