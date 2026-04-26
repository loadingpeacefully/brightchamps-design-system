import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { CheckCircle2, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Decisions',
  description: 'Frozen design system decisions (DR-NNN). Smaller than TDRs — these are working agreements, not full architecture decisions.',
}

const TOC = [
  { id: 'dr-001', label: 'DR-001 · Migration target',     level: 2 as const },
  { id: 'dr-002', label: 'DR-002 · ledger:build guard',   level: 2 as const },
  { id: 'dr-003', label: 'DR-003 · AI Generator scope',   level: 2 as const },
]

type Status = 'decided' | 'pending'

function StatusPill({ status }: { status: Status }) {
  if (status === 'decided') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(36,194,110,0.14)] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] text-[#16803c]">
        <CheckCircle2 size={11} strokeWidth={2.5} />
        Decided
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,187,58,0.18)] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] text-[#8a5e00]">
      <Clock size={11} strokeWidth={2.5} />
      Pending
    </span>
  )
}

export default function DecisionsPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[820px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Get started</div>
        <h1 className="text-h1 text-chrome-text">Decisions</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Working agreements about how the design system runs day-to-day. Smaller than{' '}
          <a className="text-chrome-accent underline underline-offset-4" href="/tdr/0001-taxonomy-migration/">TDRs</a> —
          a TDR is an architecture decision that ships in the ledger; a DR is a process or scoping decision the team froze
          so we stop relitigating it.
        </p>

        {/* ─── DR-001 ────────────────────────────────────────────────────── */}
        <section id="dr-001" className="mt-12 scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-chrome-text-subtlest">DR-001</span>
              <h2 className="text-h3 text-chrome-text">Migration target — newDashboard or sections</h2>
            </div>
            <StatusPill status="decided" />
          </div>
          <p className="text-body-s text-chrome-text-subtle">
            Decided 2026-04-26. The dashboard repo has two parallel implementations:
            {' '}<code className="font-mono text-[12px]">src/newDashboard/*</code> (the active rewrite) and
            {' '}<code className="font-mono text-[12px]">src/sections/*</code> (legacy composed pages). All component-spec verification and codemod work targets <strong>newDashboard</strong> first; sections-only components are deprioritized.
          </p>
          <div className="mt-4 grid gap-2 text-[13px]">
            <div className="flex items-baseline gap-2">
              <span className="inline-block rounded-[4px] bg-[rgba(78,59,194,0.10)] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] text-[#4e3bc2] shrink-0">newDashboard</span>
              <span className="text-chrome-text">Button · ProgressLine · Accordion · Layout</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="inline-block rounded-[4px] bg-[rgba(132,153,174,0.18)] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtle shrink-0">sections</span>
              <span className="text-chrome-text">LessonList · GreenLine (no clean newDashboard match yet)</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-chrome-text-subtlest italic">
            Implementation: <code className="font-mono">target</code> field on every entry in <code className="font-mono">lib/componentSpecs.ts</code>.
          </p>
        </section>

        {/* ─── DR-002 ────────────────────────────────────────────────────── */}
        <section id="dr-002" className="mt-8 scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-chrome-text-subtlest">DR-002</span>
              <h2 className="text-h3 text-chrome-text">ledger:build guard — block accidental TDR-0001 overwrite</h2>
            </div>
            <StatusPill status="decided" />
          </div>
          <p className="text-body-s text-chrome-text-subtle">
            Decided 2026-04-26. The resolver still emits flat names (<code className="font-mono text-[12px]">color.NN</code>);
            running <code className="font-mono text-[12px]">npm run ledger:build</code> would erase the TDR-0001 semantic
            rename. Two-layer guard:
          </p>
          <ol className="mt-3 list-decimal pl-6 space-y-1.5 text-body-s text-chrome-text">
            <li>
              <strong>npm script:</strong> <code className="font-mono text-[12px]">ledger:build</code> in
              <code className="font-mono text-[12px]"> package.json</code> prepends a
              <code className="font-mono text-[12px]"> node -e "console.error(...)"</code> warning.
            </li>
            <li>
              <strong>Resolver runtime:</strong> <code className="font-mono text-[12px]">src/resolver/index.ts</code>
              {' '}exits with code 2 unless <code className="font-mono text-[12px]">--force</code> is passed.
            </li>
            <li>
              <strong>Recovery:</strong> if you do rebuild, run <code className="font-mono text-[12px]">npm run migrate:tokens</code> immediately after to re-apply the rename.
            </li>
          </ol>
          <p className="mt-3 text-[11px] text-chrome-text-subtlest italic">
            Permanent fix is to integrate the rename into the resolver itself. Tracked as a follow-up.
          </p>
        </section>

        {/* ─── DR-003 ────────────────────────────────────────────────────── */}
        <section id="dr-003" className="mt-8 scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-bold text-chrome-text-subtlest">DR-003</span>
              <h2 className="text-h3 text-chrome-text">AI Generator — Layer 3 of the design system</h2>
            </div>
            <StatusPill status="decided" />
          </div>
          <p className="text-body-s text-chrome-text-subtle">
            Decided 2026-04-26. The DS site now has three layers:
            {' '}<strong>Layer 1</strong> the canonical ledger,
            {' '}<strong>Layer 2</strong> the typed component specs,
            {' '}<strong>Layer 3</strong> a prompt-to-component generator that consumes both and emits production-ready code.
            Lives at <a className="text-chrome-accent underline underline-offset-4" href="/tools/generate/">/tools/generate/</a>.
            Generator runs in the browser against Anthropic's API directly (the site is a static export — no backend),
            so users supply their own API key (stored in <code className="font-mono text-[12px]">localStorage</code> only).
          </p>
          <p className="mt-3 text-[11px] text-chrome-text-subtlest italic">
            System prompt is built from the live <code className="font-mono">componentSpecs.ts</code> — every spec change
            updates the generator on the next deploy.
          </p>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
