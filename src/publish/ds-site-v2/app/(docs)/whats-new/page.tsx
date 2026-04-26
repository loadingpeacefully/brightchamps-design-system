import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: "What's new",
  description: 'Changelog of the BrightChamps design system: TDRs, decisions, drift reports, surface extractions, releases.',
}

const TOC = [
  { id: 'changelog', label: 'Changelog', level: 2 as const },
]

type Status = 'shipped' | 'pending' | 'decided'

interface Entry {
  date: string
  version: string
  kind: 'TDR' | 'DECISION' | 'DRIFT' | 'TOKENS' | 'MERGE' | 'AUDIT' | 'SURFACE' | 'COMPONENT' | 'TOOL' | 'LEDGER'
  title: string
  status: Status
  note?: string
  href?: string
}

const ENTRIES: Entry[] = [
  // 2026-04-26 — Phase 1-6 source analysis pipeline
  { date: '2026-04-26', version: 'v0.6', kind: 'AUDIT',    title: 'Source-code drift analysis — 774 colors, 20% token adoption, 379 files ranked',  status: 'shipped', note: 'static analysis, no Playwright', href: '/surfaces/student/#source' },
  { date: '2026-04-26', version: 'v0.6', kind: 'TOOL',     title: 'Engineering migration guide — 25 copy-paste sed commands, 0 placeholders',       status: 'shipped', note: 'Steps 0-3 zero visual change',  href: '/surfaces/student/#migrate' },
  { date: '2026-04-26', version: 'v0.6', kind: 'COMPONENT', title: 'NavBar + LeftSideBar specs added (verified against source)',                    status: 'shipped', note: 'first VERIFIED entries',       href: '/components/' },
  { date: '2026-04-26', version: 'v0.6', kind: 'TOOL',     title: 'AI Generator system prompt: 5 real production SCSS modules embedded',            status: 'shipped', note: 'untested with real output yet', href: '/tools/generate/' },

  // 2026-04-26 — corrections pass (after full system audit)
  { date: '2026-04-26', version: 'v0.5', kind: 'AUDIT',    title: 'Full system audit — 16 site lies fixed',                       status: 'shipped', note: 'spec callouts + TDR-0001 frontmatter accepted', href: '/full-system-audit-2026-04-26' },
  { date: '2026-04-26', version: 'v0.5', kind: 'DECISION', title: 'DR-004 · Component spec accuracy standard',                    status: 'decided', href: '/get-started/decisions/#dr-004' },

  // 2026-04-26 — today's freeze
  { date: '2026-04-26', version: 'v0.4', kind: 'TOOL',     title: '/tools/generate — AI Generator (Layer 3)',                   status: 'shipped', note: 'Prompt → on-brand component', href: '/tools/generate/' },
  { date: '2026-04-26', version: 'v0.4', kind: 'DECISION', title: 'DR-001 · Migration target = newDashboard',                    status: 'decided', href: '/get-started/decisions/#dr-001' },
  { date: '2026-04-26', version: 'v0.4', kind: 'DECISION', title: 'DR-002 · ledger:build guard',                                 status: 'decided', href: '/get-started/decisions/#dr-002' },
  { date: '2026-04-26', version: 'v0.4', kind: 'DECISION', title: 'DR-003 · AI Generator scope = Layer 3',                       status: 'decided', href: '/get-started/decisions/#dr-003' },
  { date: '2026-04-26', version: 'v0.4', kind: 'DRIFT',    title: 'DC-005 frozen at #4e3bc2 pending brand team override',        status: 'shipped', note: 'four-way conflict documented',  href: '/surfaces/#designer-conflicts' },
  { date: '2026-04-26', version: 'v0.4', kind: 'TOKENS',   title: 'color/info/400 = #3b9af5 (provisional, DC-010)',              status: 'shipped', href: '/foundations/color/' },
  { date: 'TBD',        version: 'v0.4', kind: 'SURFACE',  title: 'Teacher surface extraction — NEXT',                            status: 'pending', note: '(session cookie required)' },

  // 2026-04-26 — earlier today
  { date: '2026-04-26', version: 'v0.3', kind: 'AUDIT',    title: 'Component spec verification — 5 of 6 vs dashboard repo',      status: 'shipped', href: '/components/' },
  { date: '2026-04-26', version: 'v0.3', kind: 'DRIFT',    title: 'DC-008 / DC-009 / DC-010 filed (typo, progress green, paused)', status: 'shipped', href: '/surfaces/#designer-conflicts' },
  { date: '2026-04-26', version: 'v0.3', kind: 'COMPONENT', title: '5 component specs shipped (ProgressLine / Accordion / LessonList / GreenLine / Layout)', status: 'shipped', href: '/components/' },
  { date: '2026-04-26', version: 'v0.3', kind: 'TDR',      title: 'TDR-0001 shipped — semantic token names live (color/primary/500 etc.)', status: 'shipped', note: 'frontmatter status now: accepted (2026-04-26)', href: '/tdr/0001-taxonomy-migration/' },
  { date: '2026-04-26', version: 'v0.3', kind: 'MERGE',    title: 'Designer DS merge — course colors, icons, spacing, button',   status: 'shipped', href: '/foundations/color/' },
  { date: '2026-04-26', version: 'v0.3', kind: 'AUDIT',    title: '7 designer-conflict tickets filed (DC-001–DC-007)',           status: 'shipped', href: '/surfaces/#designer-conflicts' },
  { date: '2026-04-26', version: 'v0.3', kind: 'TOKENS',   title: '329 canonical tokens — 112 colors, 21 typography',            status: 'shipped', href: '/foundations/color/' },

  // earlier
  { date: '2026-04-17', version: 'v0.2', kind: 'TDR',      title: 'TDR-0001 proposed (frequency-ranked → semantic names)',       status: 'shipped', href: '/tdr/0001-taxonomy-migration/' },
  { date: '2026-04-16', version: 'v0.2', kind: 'DRIFT',    title: 'First authenticated drift report · student surface',          status: 'shipped', href: '/drift-review/2026-04-16/' },
  { date: '2026-04-16', version: 'v0.2', kind: 'TOKENS',   title: '13 manual canonicals added (overlays, surfaces, interactive)', status: 'shipped', href: '/tokens/color/' },
  { date: '2026-04-15', version: 'v0.1', kind: 'LEDGER',   title: 'Canonical ledger built · 106 canonical tokens',               status: 'shipped' },
]

const KIND_COLOR: Record<Entry['kind'], string> = {
  TDR:       'bg-[rgba(78,59,194,0.14)] text-[#4e3bc2]',
  DECISION:  'bg-[rgba(13,71,161,0.14)] text-[#0d47a1]',
  DRIFT:     'bg-[rgba(255,187,58,0.18)] text-[#8a5e00]',
  TOKENS:    'bg-[rgba(36,194,110,0.14)] text-[#16803c]',
  MERGE:     'bg-[rgba(78,59,194,0.14)] text-[#4e3bc2]',
  AUDIT:     'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle',
  SURFACE:   'bg-[rgba(255,124,53,0.18)] text-[#a4380e]',
  COMPONENT: 'bg-[rgba(36,194,110,0.14)] text-[#16803c]',
  TOOL:      'bg-[rgba(78,59,194,0.14)] text-[#4e3bc2]',
  LEDGER:    'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle',
}

function StatusBadge({ status }: { status: Status }) {
  const cls =
    status === 'shipped' ? 'bg-[rgba(36,194,110,0.14)] text-[#16803c]' :
    status === 'decided' ? 'bg-[rgba(13,71,161,0.14)] text-[#0d47a1]' :
    'bg-[rgba(255,187,58,0.20)] text-[#8a5e00]'
  return (
    <span className={'inline-block rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + cls}>
      {status}
    </span>
  )
}

export default function WhatsNew() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Governance</div>
        <h1 className="text-h1 text-chrome-text">What&apos;s new</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Reverse-chronological log of TDRs, decisions, drift tickets, surface extractions, and component shipments.
          Every row links to its source artifact.
        </p>

        <section id="changelog" className="mt-10 scroll-mt-24 rounded-card border border-chrome-border overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Date</th>
                <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">v</th>
                <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Kind</th>
                <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Entry</th>
                <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((e, i) => (
                <tr key={i} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken transition-colors">
                  <td className="p-3 font-mono text-chrome-text-subtle whitespace-nowrap tabular-nums">{e.date}</td>
                  <td className="p-3 font-mono text-chrome-text-subtlest tabular-nums">{e.version}</td>
                  <td className="p-3 align-top">
                    <span className={'inline-block rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + KIND_COLOR[e.kind]}>
                      {e.kind}
                    </span>
                  </td>
                  <td className="p-3 align-top">
                    {e.href ? (
                      <a className="text-chrome-text hover:text-chrome-accent transition" href={e.href}>{e.title}</a>
                    ) : (
                      <span className="text-chrome-text">{e.title}</span>
                    )}
                    {e.note && (
                      <span className="ml-2 text-[11px] italic text-chrome-text-subtlest">{e.note}</span>
                    )}
                  </td>
                  <td className="p-3 align-top"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
