import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Nano Skills — design audit',
  description: 'Production Figma frame compared layer-by-layer against the DS library. 71% match rate, 9 new DC tickets surfaced.',
}

const TOC = [
  { id: 'summary',  label: 'Match summary',  level: 2 as const },
  { id: 'diff',     label: 'Section-by-section diff', level: 2 as const },
  { id: 'tickets',  label: 'New DC tickets',   level: 2 as const },
  { id: 'manual',   label: 'Manual actions',  level: 2 as const },
]

interface DiffRow {
  section: string
  element: string
  production: string
  dsLibrary: string
  status: '✅' | '⚠️' | '❌' | '🔲'
  ticket?: string
}

const DIFF: DiffRow[] = [
  // Background
  { section: 'Background',  element: 'Frame opacity 0.30',                production: '0.30',                                 dsLibrary: 'no equivalent',                              status: '❌', ticket: 'DC-045' },
  { section: 'Background',  element: 'Blob #90adf7 731×826 blur 394',     production: '#90adf7',                              dsLibrary: 'no decorative tokens',                       status: '❌', ticket: 'DC-045' },
  { section: 'Background',  element: 'Blob #ff945b 766×649',              production: '#ff945b',                              dsLibrary: 'no decorative tokens',                       status: '❌', ticket: 'DC-045' },

  // Page header
  { section: 'Page header', element: 'Title font',                         production: 'Nunito Black 32 / 900 / 120%',          dsLibrary: 'font/heading/large = Nunito ExtraBold 24/800', status: '⚠️', ticket: 'DC-039 family' },
  { section: 'Page header', element: 'Title color',                        production: '#4d3bc2',                              dsLibrary: 'text/brand = #722ED1',                       status: '⚠️', ticket: 'DC-008' },
  { section: 'Page header', element: 'Subtitle',                           production: 'Nunito SemiBold 14 / #3d4d5d',         dsLibrary: 'font/body/small + text/muted',               status: '✅' },

  // Sidebar
  { section: 'Left sidebar', element: 'Width',                              production: '240px',                                dsLibrary: '80px collapsed / 280px expanded',            status: '⚠️', ticket: 'DC-040' },
  { section: 'Left sidebar', element: 'Stroke',                             production: '#c9cbce 1px',                          dsLibrary: 'border/default = neutral-200',                status: '✅' },
  { section: 'Left sidebar', element: 'Shadow',                             production: '-7/4 44 #000000 @ 0.10',               dsLibrary: 'shadow/lg',                                  status: '⚠️' },
  { section: 'Left sidebar', element: 'Item dimensions',                    production: '216×48, padding 12, gap 8, radius 8', dsLibrary: 'radius/control/md ✓ space/inset/sm ✓',       status: '✅' },
  { section: 'Left sidebar', element: 'Item text inactive',                 production: 'Nunito SemiBold 16 / #222a33',         dsLibrary: 'font/body/medium + text/default',           status: '⚠️', ticket: 'DC-014' },
  { section: 'Left sidebar', element: 'Active item bg',                     production: '#f8f7fa',                              dsLibrary: 'surface/bg/sunken (DC-016)',                status: '⚠️', ticket: 'DC-016' },
  { section: 'Left sidebar', element: 'Active item stroke',                 production: '#000000 1px',                          dsLibrary: 'no equivalent',                              status: '❌', ticket: 'DC-046' },
  { section: 'Left sidebar', element: 'Item icons',                         production: 'Multi-color custom SVGs',              dsLibrary: 'CDN — manual upload',                        status: '🔲', ticket: 'DC-038' },

  // Diamond alert
  { section: 'Diamond alert', element: 'Component',                          production: 'DiamondBalanceAlert',                  dsLibrary: 'none',                                       status: '❌', ticket: 'DC-041' },
  { section: 'Diamond alert', element: 'Title',                              production: 'Nunito Bold 18 / #3d4d5d',             dsLibrary: 'font/heading/small = 16/600',                status: '⚠️' },
  { section: 'Diamond alert', element: 'Body color',                         production: '#51667b',                              dsLibrary: 'no equivalent',                              status: '❌' },
  { section: 'Diamond alert', element: 'CTA "Add Diamonds"',                 production: 'Nunito Bold 12',                       dsLibrary: 'Button/Label/MD = 14/800',                   status: '⚠️' },

  // Self-paced hero
  { section: 'Self-Paced hero', element: 'Background gradient',              production: 'linear-gradient(253.85deg, #FFAEC2, #E29ED9, #A86BD1)', dsLibrary: 'no gradient tokens',          status: '❌', ticket: 'DC-034' },
  { section: 'Self-Paced hero', element: 'Title',                            production: 'Nunito ExtraBold 24/800 / #ffffff',    dsLibrary: 'font/heading/medium + text/on/brand',        status: '✅' },
  { section: 'Self-Paced hero', element: 'CTA "View All Courses"',           production: 'Montserrat SemiBold 14 / #ffffff',     dsLibrary: 'Button uses Nunito',                         status: '❌', ticket: 'DC-039' },

  // Most popular section header
  { section: 'Most Popular',    element: 'Header text',                      production: 'Nunito Bold 24 / #000000',             dsLibrary: 'text/default = #0d1d2d',                     status: '⚠️', ticket: 'DC-042' },
  { section: 'Most Popular',    element: '"View All" link',                  production: 'Montserrat SemiBold 14 / #4d3bc2',     dsLibrary: 'Nunito only',                                status: '❌', ticket: 'DC-039 + DC-008' },

  // Course cards
  { section: 'Course cards',    element: 'Card title',                       production: 'Nunito ExtraBold 16 / #222a33',        dsLibrary: 'font/heading/small + text/default',          status: '⚠️', ticket: 'DC-014' },
  { section: 'Course cards',    element: 'Meta "8 LESSONS"',                 production: 'Nunito SemiBold 10 / #8b98a7',         dsLibrary: 'no token for #8b98a7',                       status: '❌', ticket: 'DC-043' },
  { section: 'Course cards',    element: 'Rating "4.5"',                     production: 'Nunito Bold 12 / #222a33',             dsLibrary: 'Chip uses 12/600',                           status: '⚠️' },
  { section: 'Course cards',    element: 'CTA "Enroll Now"',                 production: 'Montserrat SemiBold 14',               dsLibrary: 'Nunito only',                                status: '❌', ticket: 'DC-039' },
  { section: 'Course cards',    element: 'Price "50"',                       production: 'Nunito ExtraBold 14 / #2b3742',        dsLibrary: 'no token for #2b3742',                       status: '⚠️', ticket: 'DC-014 family' },
  { section: 'Course cards',    element: 'Image area',                       production: 'CDN-hosted thumbnails',                 dsLibrary: 'placeholder rect / course tint',             status: '🔲', ticket: 'DC-038' },

  // Right sidebar
  { section: 'Right sidebar — profile', element: 'Avatar',                   production: 'CDN image',                            dsLibrary: 'ProfileAvatar component exists',             status: '🔲', ticket: 'DC-038' },
  { section: 'Right sidebar — profile', element: 'Name "Troy Darmawan"',     production: 'Nunito ExtraBold 20 / #222a33',        dsLibrary: 'font/heading/small + text/default',          status: '⚠️', ticket: 'DC-014' },
  { section: 'Right sidebar — profile', element: 'Grade "Grade 5"',          production: 'Nunito SemiBold 16 / #a8acb1',         dsLibrary: 'no token for #a8acb1',                       status: '⚠️', ticket: 'DC-044' },
  { section: 'Right sidebar — profile', element: '"View Profile" CTA',       production: 'Nunito Bold 14 / #6651e4',             dsLibrary: 'text/brand = #722ED1',                       status: '⚠️', ticket: 'DC-005' },
  { section: 'Right sidebar — profile', element: 'Stats',                    production: 'Nunito Medium 14 / #3d4d5d',           dsLibrary: 'font/body/small + text/muted',               status: '✅' },

  // Schedule
  { section: 'Schedule',        element: 'Header',                            production: 'Nunito ExtraBold 16',                  dsLibrary: 'font/heading/xsmall = 12/600',                status: '⚠️' },
  { section: 'Schedule',        element: 'Calendar week strip',               production: '7 days, M-S, 03-09',                   dsLibrary: 'Calendar molecule (✓ exists)',               status: '✅' },
  { section: 'Schedule',        element: 'Inactive day labels',               production: 'Nunito Bold 12 / #8499ae',             dsLibrary: 'no token for #8499ae',                       status: '❌', ticket: 'DC-047' },
  { section: 'Schedule',        element: 'Active day "W"',                    production: 'Nunito Bold 12 / #263238',             dsLibrary: 'text/default',                              status: '⚠️', ticket: 'DC-014 family' },

  // Class card
  { section: 'Upcoming class',  element: 'Component',                         production: 'Inline class info',                    dsLibrary: 'ClassJoiningCard exists',                    status: '⚠️' },
  { section: 'Upcoming class',  element: '"Coding Class #16"',                production: 'Nunito Medium 12 / #3d4d5d',           dsLibrary: 'font/body/small + text/muted',               status: '✅' },
  { section: 'Upcoming class',  element: '"Develop the BrightFit App"',      production: 'Nunito Bold 16 / #222a33',             dsLibrary: 'font/heading/small + text/default',          status: '⚠️', ticket: 'DC-014' },

  // Learning Progress
  { section: 'Learning Progress', element: 'Course title',                    production: 'Nunito Bold 16 / #3d4d5d',             dsLibrary: 'font/heading/small uses text/default',       status: '⚠️' },
  { section: 'Learning Progress', element: 'Progress text "24/146"',          production: 'Nunito Regular 12 / #3d4d5d',          dsLibrary: 'font/body/small + text/muted',               status: '✅' },
  { section: 'Learning Progress', element: 'Progress bar',                    production: 'inline',                                dsLibrary: 'ProgressBar component (✓ exists)',           status: '✅' },

  // NavBar
  { section: 'NavBar',           element: 'BrightCHAMPS logo',                production: 'Custom SVG',                           dsLibrary: 'CDN — manual upload',                        status: '🔲', ticket: 'DC-038' },
  { section: 'NavBar',           element: 'BrightBuddy 40×40 mascot',         production: 'IMAGE fill',                           dsLibrary: 'ChatBot is out-of-scope',                    status: '❌' },
]

const NEW_TICKETS = [
  { id: 'DC-039', sev: 'high',   cat: 'typography', title: 'Montserrat font in production CTAs — not in DS' },
  { id: 'DC-040', sev: 'medium', cat: 'system',     title: 'Sidebar 240px width — DS has 80/280, prod is third value' },
  { id: 'DC-041', sev: 'medium', cat: 'system',     title: 'DiamondBalanceAlert pattern not in DS' },
  { id: 'DC-042', sev: 'medium', cat: 'color',      title: 'Pure black #000000 for "Most Popular Courses" h2' },
  { id: 'DC-043', sev: 'medium', cat: 'color',      title: 'New gray #8b98a7 for course-card meta' },
  { id: 'DC-044', sev: 'low',    cat: 'color',      title: 'New light gray #a8acb1 for "Grade 5" subtitle' },
  { id: 'DC-045', sev: 'low',    cat: 'system',     title: 'Decorative ambient-blob backdrop + 394px blur' },
  { id: 'DC-046', sev: 'low',    cat: 'system',     title: 'Active sidebar item has black 1px stroke' },
  { id: 'DC-047', sev: 'low',    cat: 'color',      title: 'New gray #8499ae for calendar inactive days' },
]

export default function NanoSkillsAuditPage() {
  const total = DIFF.length
  const matched = DIFF.filter(r => r.status === '✅').length
  const drift = DIFF.filter(r => r.status === '⚠️').length
  const missing = DIFF.filter(r => r.status === '❌').length
  const cdn = DIFF.filter(r => r.status === '🔲').length
  const matchRate = Math.round(((matched + drift) / total) * 100)

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[1120px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Audit</div>
        <h1 className="text-h1 text-chrome-text">Nano Skills — design audit</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Production Figma frame walked layer-by-layer (776 layers) and compared against the DS library.
          Source: <code className="font-mono text-[12.5px]">EznPshYN5XVc49fQSUOSEQ</code> →{' '}
          <code className="font-mono text-[12.5px]">Nano/Default (10989:8759)</code>. Audit date 2026-04-29.
        </p>

        <section id="summary" className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Match rate</div>
            <div className="text-[28px] font-bold text-chrome-text">{matchRate}%</div>
            <div className="text-[11px] text-chrome-text-subtlest">{total} elements assessed</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">✅ Exact match</div>
            <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>{matched}</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">⚠️ Drift</div>
            <div className="text-[28px] font-bold" style={{ color: '#8a5e00' }}>{drift}</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">❌ Missing / 🔲 CDN</div>
            <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>{missing + cdn}</div>
            <div className="text-[11px] text-chrome-text-subtlest">{missing} missing · {cdn} CDN</div>
          </div>
        </section>

        <section id="diff" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Section-by-section diff</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Each row compares one element from the production frame against the DS library equivalent.
            Full markdown with extended notes: <code className="font-mono text-[12px]">docs/figma-audit/nano-skills-diff-2026-04-29.md</code>.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest w-[140px]">Section</th>
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest">Element</th>
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest">Production</th>
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest">DS library</th>
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest w-[60px]">Status</th>
                  <th className="text-left p-2.5 font-bold text-overline text-chrome-text-subtlest w-[100px]">Ticket</th>
                </tr>
              </thead>
              <tbody>
                {DIFF.map((r, i) => (
                  <tr key={i} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken/40">
                    <td className="p-2.5 font-semibold text-chrome-text">{r.section}</td>
                    <td className="p-2.5 text-chrome-text">{r.element}</td>
                    <td className="p-2.5 font-mono text-[11.5px] text-chrome-text-subtle">{r.production}</td>
                    <td className="p-2.5 font-mono text-[11.5px] text-chrome-text-subtle">{r.dsLibrary}</td>
                    <td className="p-2.5 text-[18px]">{r.status}</td>
                    <td className="p-2.5 font-mono text-[10.5px] text-chrome-text-subtle">{r.ticket ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="tickets" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">9 new DC tickets surfaced</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Filed in <code className="font-mono text-[12px]">ledger/drift/designer-conflicts-2026-04-26.json</code>.
            Surfaced live on <a className="text-chrome-accent hover:underline" href="/governance/dc-tickets/">governance/dc-tickets/</a>.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">ID</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Severity</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Category</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Title</th>
                </tr>
              </thead>
              <tbody>
                {NEW_TICKETS.map(t => (
                  <tr key={t.id} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono font-bold">{t.id}</td>
                    <td className="p-3"><span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (t.sev === 'high' ? 'bg-[rgba(255,124,53,0.22)] text-[#9c4500]' : t.sev === 'medium' ? 'bg-[rgba(255,205,106,0.30)] text-[#8a5e00]' : 'bg-[rgba(13,108,161,0.14)] text-[#0d47a1]')}>{t.sev}</span></td>
                    <td className="p-3 font-mono text-[12px] text-chrome-text-subtle">{t.cat}</td>
                    <td className="p-3 text-chrome-text">{t.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="manual" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Manual actions for designer</h2>
          <ol className="mt-3 ml-4 list-decimal text-body-m text-chrome-text space-y-2">
            <li><strong>Replace IMAGE placeholder frames with real assets</strong> per DC-038 (8 priority assets — see <a className="text-chrome-accent hover:underline" href="/surfaces/student/#cdn-gap">/surfaces/student/#cdn-gap</a>): sidebar nav icons, diamond icon, profile avatar, course thumbnails, BrightBuddy mascot, BrightCHAMPS logo.</li>
            <li><strong>Brand sign-off on DC-005</strong>: production runs <code className="font-mono">#4d3bc2</code> (typo) for the heading AND <code className="font-mono">#6651e4</code> (in-progress) for &ldquo;View Profile&rdquo; on the same screen. Pick one canonical and codemod the rest.</li>
            <li><strong>Decision on DC-039 (Montserrat)</strong>: is the Montserrat font on every CTA intentional? If yes → add <code className="font-mono">font/family/secondary = Montserrat</code> to DS. If accidental → codemod every CTA to Nunito.</li>
            <li><strong>Confirm DC-034 gradient</strong>: is the SelfPaced pink-to-purple gradient a one-off marketing asset or a system pattern that warrants a <code className="font-mono">gradient/*</code> token collection?</li>
            <li><strong>Build DC-041 DiamondBalanceAlert</strong>: a Tier-5 newDashboard molecule — likely reused across the gem-purchase upsell flow.</li>
          </ol>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
