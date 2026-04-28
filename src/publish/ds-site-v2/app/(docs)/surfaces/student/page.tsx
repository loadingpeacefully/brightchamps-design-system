import type { Metadata } from 'next'
import Link from 'next/link'
import { RightTOC } from '@/components/chrome/RightTOC'
import { loadLatestDrift } from '@/lib/drift'
import { loadDriftItems } from '@/lib/surface-data'
import { loadSourceDrift } from '@/lib/source-drift'
import { Shield, AlertTriangle, HelpCircle, ArrowRight, FileCode, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Student surface',
  description: 'Student app surface overview — drift metrics, top critical issues, source-code analysis, and links to component, icon, and state audits.',
}

const TOC = [
  { id: 'source',    label: 'Source analysis',  level: 2 as const },
  { id: 'brand',     label: 'Brand purples',     level: 3 as const },
  { id: 'drift',     label: 'Color drift',       level: 3 as const },
  { id: 'migrate',   label: 'Files to migrate',  level: 3 as const },
  { id: 'cdn-gap',   label: 'CDN asset gap',     level: 2 as const },
  { id: 'metrics',   label: 'DOM drift metrics', level: 2 as const },
  { id: 'critical',  label: 'Critical issues',   level: 2 as const },
  { id: 'explore',   label: 'Explore',           level: 2 as const },
]

export default function StudentOverviewPage() {
  const drift = loadLatestDrift()
  const items = loadDriftItems()
  const src = loadSourceDrift()

  const criticals = items
    .filter(i => i.severity === 'critical' && i.status === 'unknown' && i.tokenType === 'color')
    .sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))
    .slice(0, 5)

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces</div>
        <h1 className="text-h1 text-chrome-text">Student app</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          champ.brightchamps.com — 7 URLs crawled, authenticated via Playwright storageState.
          DOM drift: {drift?.date ?? 'unknown'} · Source: {src?.generatedAt?.slice(0, 10) ?? 'unknown'}.
        </p>

        {src && (
          <section id="source" className="mt-12 scroll-mt-24">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-h2 text-chrome-text">Source code analysis</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(36,194,110,0.14)] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] text-[#16803c]">
                <FileCode size={10} strokeWidth={2.5} />
                Live source
              </span>
            </div>
            <p className="text-body-s text-chrome-text-subtle">
              Static analysis of the dashboard repo — {src.generatedAt.slice(0, 10)}. Scans every <code className="font-mono text-[12px]">.scss</code> /
              {' '}<code className="font-mono text-[12px]">.module.scss</code> / <code className="font-mono text-[12px]">.tsx</code> file. Always fresh — no Playwright session, no auth.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
                <div className="text-overline text-chrome-text-subtlest mb-1">Unique colors in source</div>
                <div className="font-mono text-[24px] font-bold text-chrome-text">{src.summary.totalUniqueColors.toLocaleString()}</div>
                <div className="text-[11px] text-chrome-text-subtlest">{src.summary.totalColorOccurrences.toLocaleString()} total occurrences</div>
              </div>
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
                <div className="text-overline text-chrome-text-subtlest mb-1">Token adoption</div>
                <div className="font-mono text-[24px] font-bold text-chrome-text">{src.summary.tokenAdoption.adoptionRateAny}</div>
                <div className="text-[11px] text-chrome-text-subtlest">SCSS {src.summary.tokenAdoption.adoptionRateScss} · CSS-var {src.summary.tokenAdoption.adoptionRateCssVar}</div>
              </div>
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
                <div className="text-overline text-chrome-text-subtlest mb-1">Files needing migration</div>
                <div className="font-mono text-[24px] font-bold text-chrome-text">{src.summary.filesNeedingMigration}</div>
                <div className="text-[11px] text-chrome-text-subtlest">{src.summary.filesZeroAdoption} with zero adoption</div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <div className="rounded-md border border-chrome-border px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest">Exact matches</div>
                <div className="font-mono text-[18px] font-bold text-[#16803c]">{src.summary.exactTokenMatches}</div>
              </div>
              <div className="rounded-md border border-chrome-border px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest">Close (ΔE&lt;5)</div>
                <div className="font-mono text-[18px] font-bold text-chrome-text">{src.summary.closeMatches}</div>
              </div>
              <div className="rounded-md border border-chrome-border px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest">Drift</div>
                <div className="font-mono text-[18px] font-bold text-[#8a5e00]">{src.summary.driftColors}</div>
              </div>
              <div className="rounded-md border border-chrome-border px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest">Missing</div>
                <div className="font-mono text-[18px] font-bold text-[#a31836]">{src.summary.missingFromLedger}</div>
              </div>
            </div>

            {/* Brand-purple breakdown */}
            <div id="brand" className="mt-8 scroll-mt-24">
              <h3 className="text-h3 text-chrome-text">Brand purples — DC-005 four-way breakdown</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                {[
                  { hex: '#4e3bc2', label: 'Figma canonical', dc: '$primary-color' },
                  { hex: '#4d3bc2', label: 'Typo (DC-008)', dc: 'no token' },
                  { hex: '#6651e4', label: 'In-progress', dc: '$inprogress-state' },
                  { hex: '#722ed1', label: 'Designer', dc: '$button-primary' },
                ].map(({ hex, label, dc }) => {
                  const count = src.summary.brandPurpleBreakdown[hex] ?? 0
                  return (
                    <div key={hex} className="rounded-card border border-chrome-border bg-chrome-surface-raised p-3">
                      <div className="h-10 rounded-sm border border-chrome-border" style={{ background: hex }} />
                      <div className="mt-2 font-mono text-[12px] text-chrome-text">{hex}</div>
                      <div className="font-mono text-[18px] font-bold text-chrome-text">{count.toLocaleString()}</div>
                      <div className="text-[11px] text-chrome-text-subtle">{label}</div>
                      <div className="text-[10px] text-chrome-text-subtlest font-mono">{dc}</div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 rounded-md border-l-4 border-l-amber-500 border border-chrome-border bg-amber-50/40 dark:bg-amber-950/15 p-3">
                <p className="text-body-s text-chrome-text">
                  <strong className="uppercase tracking-[0.04em] text-[11px] text-amber-700 dark:text-amber-400">DC-005 pending.</strong>{' '}
                  Resolution will consolidate these into one canonical value across {(src.summary.brandPurpleBreakdown['#4e3bc2'] ?? 0) + (src.summary.brandPurpleBreakdown['#4d3bc2'] ?? 0) + (src.summary.brandPurpleBreakdown['#6651e4'] ?? 0) + (src.summary.brandPurpleBreakdown['#722ed1'] ?? 0)} occurrences.
                </p>
              </div>
            </div>

            {/* Top color drift */}
            <div id="drift" className="mt-8 scroll-mt-24">
              <h3 className="text-h3 text-chrome-text">Top 10 color drift</h3>
              <p className="mt-1 text-body-s text-chrome-text-subtle">Sorted by occurrences. ΔE 5–15 = perceptually distinct from the closest canonical.</p>
              <div className="mt-3 overflow-x-auto rounded-card border border-chrome-border">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Hex</th>
                      <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Uses</th>
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Closest token</th>
                      <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">ΔE</th>
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">DC</th>
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {src.colorDrift.slice(0, 10).map((d, i) => (
                      <tr key={i} className="border-b border-chrome-border last:border-b-0">
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block h-3.5 w-3.5 rounded-sm border border-chrome-border" style={{ background: d.value }} />
                            <span className="font-mono font-semibold text-chrome-text">{d.value}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums">{d.occurrences}</td>
                        <td className="p-3 font-mono text-chrome-accent">{d.closestToken}</td>
                        <td className="p-3 text-right font-mono tabular-nums">{d.deltaE.toFixed(1)}</td>
                        <td className="p-3">
                          {d.dcTicket ? (
                            <a href="/surfaces/#designer-conflicts" className="text-chrome-accent underline underline-offset-4 font-mono text-[11px]">{d.dcTicket}</a>
                          ) : <span className="text-chrome-text-subtlest">—</span>}
                        </td>
                        <td className="p-3 text-[11px] text-chrome-text-subtle max-w-[260px] truncate">{d.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Files to migrate */}
            <div id="migrate" className="mt-8 scroll-mt-24">
              <h3 className="text-h3 text-chrome-text">Files needing migration most</h3>
              <p className="mt-1 text-body-s text-chrome-text-subtle">
                Bottom 10 by token-adoption rate. Migrate these first per{' '}
                <a className="text-chrome-accent underline underline-offset-4" href="/get-started/contribute/">engineering migration guide</a>.
              </p>
              <div className="mt-3 overflow-x-auto rounded-card border border-chrome-border">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">File</th>
                      <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Hardcoded</th>
                      <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">SCSS vars</th>
                      <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Adoption</th>
                      <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {src.adoptionByFile.slice(0, 10).map((f, i) => (
                      <tr key={i} className="border-b border-chrome-border last:border-b-0">
                        <td className="p-3 font-mono text-[11px] text-chrome-text break-all">{f.file.replace(/^.*\/src\//, 'src/')}</td>
                        <td className="p-3 text-right font-mono tabular-nums text-[#a31836] font-bold">{f.hardcodedColors}</td>
                        <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{f.scssVarColors}</td>
                        <td className="p-3 text-right font-mono tabular-nums">{f.adoptionRate}</td>
                        <td className="p-3">
                          <span className={
                            'inline-block rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' +
                            (f.priority === 'HIGH' ? 'bg-[rgba(240,41,77,0.12)] text-[#a31836]' :
                             f.priority === 'MEDIUM' ? 'bg-[rgba(255,187,58,0.18)] text-[#8a5e00]' :
                             'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle')
                          }>
                            {f.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <section id="cdn-gap" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">CDN asset gap</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Production renders 765 image assets via the ImageKit CDN — the BrightChamps logo, course thumbnails,
            avatars, badges, BrightBuddy mascot, Harvard partnership marks, gem icons. The Figma library uses
            placeholder rectangles + course-color tints for these because the figma-mcp sandbox does not support{' '}
            <code className="font-mono text-[12.5px]">createImageAsync</code> or runtime <code className="font-mono text-[12.5px]">fetch()</code>.
          </p>
          <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4">
            <div className="text-overline text-[#8a5e00] mb-1">DC-038 — open</div>
            <p className="text-body-s text-chrome-text">
              Production uses 765 CDN-hosted image assets via ImageKit. The Figma library uses placeholder
              frames for these. To fully replicate production screens, download assets from the CDN URLs in{' '}
              <code className="font-mono">src/constants/images.tsx</code> and upload to Figma manually.
            </p>
          </div>
          <h3 className="mt-6 text-body-l font-bold text-chrome-text">Priority assets to upload</h3>
          <div className="mt-3 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Asset</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Where used in Figma</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CDN URL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">BRIGHTCHAMPS_LOGO</td><td className="p-3 text-chrome-text-subtle">NavBar / LeftSideBar / LoginLayout</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/brightchamps_logo.svg</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">AVATAR_BOY / AVATAR_GIRL</td><td className="p-3 text-chrome-text-subtle">ProfileAvatar / SelectProfile</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/avatar_boy.webp · avatar_girl.webp</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">LEARNING_PATH</td><td className="p-3 text-chrome-text-subtle">NanoSkills skill thumbnails</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/learningPath.png</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">LEVEL_1/2/3/4_BADGE</td><td className="p-3 text-chrome-text-subtle">/badges Screen + BadgesCard tiles</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/tr:w-182,h-170/level_N_badge.webp</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">GEMS_ICON / THREE_DIAMONDS_IMG</td><td className="p-3 text-chrome-text-subtle">RightSideBar / DiamondPurchaseHeader</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/gems_icon.svg · three_diamonds_img.svg</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">HARVARD_BRIGHTCHAMPS_LOGO</td><td className="p-3 text-chrome-text-subtle">NanoSkills harvard-hero, demo-dashboard PreDemo/PostDemo</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/harvard_brightchamps_logo.svg</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">BADGES_ONBOARDING_EXPLORE</td><td className="p-3 text-chrome-text-subtle">First-time-on-/badges hero</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/badges_onboarding_explore_02.webp</td></tr>
                <tr className="border-b border-chrome-border last:border-b-0"><td className="p-3 font-mono">CHATBOT_EDIT_ICON</td><td className="p-3 text-chrome-text-subtle">BrightBuddy bottom-right of every authenticated screen</td><td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">/dashboard/chatbot_edit_icon.svg</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-body-s text-chrome-text-subtle">
            All ~765 URLs in <code className="font-mono text-[12.5px]">src/constants/images.tsx</code>. Base path:{' '}
            <code className="font-mono text-[12.5px]">https://ik.imagekit.io/brightchamps/dashboard</code>.
          </p>
        </section>

        <section id="metrics" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">DOM drift metrics</h2>
          <p className="text-body-s text-chrome-text-subtle">
            Playwright DOM extraction — {drift?.date ?? '—'} (10 days stale). Static source analysis above is fresher and more complete.
          </p>
          {drift && (
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5 text-center">
                <Shield size={20} className="mx-auto text-[var(--brand-green)]" />
                <div className="mt-2 font-mono text-[28px] font-bold text-chrome-text">{drift.match}</div>
                <div className="text-overline text-chrome-text-subtlest">Match</div>
              </div>
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5 text-center">
                <AlertTriangle size={20} className="mx-auto text-[#c07a00]" />
                <div className="mt-2 font-mono text-[28px] font-bold text-chrome-text">{drift.drift}</div>
                <div className="text-overline text-chrome-text-subtlest">Drift</div>
              </div>
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5 text-center">
                <div className="mt-2 font-mono text-[28px] font-bold text-chrome-text">{drift.missing}</div>
                <div className="text-overline text-chrome-text-subtlest">Missing</div>
              </div>
              <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5 text-center">
                <HelpCircle size={20} className="mx-auto text-[var(--brand-red)]" />
                <div className="mt-2 font-mono text-[28px] font-bold text-chrome-text">{drift.unknown}</div>
                <div className="text-overline text-chrome-text-subtlest">Unknown</div>
              </div>
            </div>
          )}
        </section>

        {criticals.length > 0 && (
          <section id="critical" className="mt-12 scroll-mt-24">
            <h2 className="text-h2 text-chrome-text">Top critical issues</h2>
            <p className="mt-2 text-body-s text-chrome-text-subtle">
              Highest-ΔE unknown colors — DOM values with no close canonical match. Sorted by perceptual distance.
            </p>
            <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">DOM value</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Closest canonical</th>
                    <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">ΔE</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Pages</th>
                  </tr>
                </thead>
                <tbody>
                  {criticals.map((item, i) => (
                    <tr key={i} className="border-b border-chrome-border last:border-b-0">
                      <td className="p-3">
                        {item.domValue && (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block h-3.5 w-3.5 rounded-sm border border-chrome-border" style={{ background: item.domValue }} />
                            <span className="font-mono font-semibold text-chrome-text">{item.domValue}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {item.figmaValue ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block h-3.5 w-3.5 rounded-sm border border-chrome-border" style={{ background: item.figmaValue }} />
                            <span className="font-mono text-chrome-text-subtle">{item.figmaValue}</span>
                          </span>
                        ) : <span className="text-chrome-text-subtlest">—</span>}
                      </td>
                      <td className="p-3 text-right font-mono font-bold tabular-nums text-[var(--brand-red)]">
                        {item.delta !== undefined ? item.delta.toFixed(1) : '—'}
                      </td>
                      <td className="p-3 text-[11px] text-chrome-text-subtle max-w-[200px] truncate">
                        {item.domPages?.join(', ') ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section id="explore" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Explore</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/surfaces/student/components/" className="flex items-center gap-3 rounded-card border border-chrome-border bg-chrome-surface-raised px-5 py-4 hover:border-chrome-accent transition group">
              <div className="flex-1">
                <div className="text-h4 text-chrome-text">Components</div>
                <div className="text-body-s text-chrome-text-subtle">21 CSS Module prefixes, all need spec</div>
              </div>
              <ArrowRight size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
            </Link>
            <Link href="/surfaces/student/icons/" className="flex items-center gap-3 rounded-card border border-chrome-border bg-chrome-surface-raised px-5 py-4 hover:border-chrome-accent transition group">
              <div className="flex-1">
                <div className="text-h4 text-chrome-text">Icons</div>
                <div className="text-body-s text-chrome-text-subtle">160 unique — no icon system detected</div>
              </div>
              <ArrowRight size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
            </Link>
            <Link href="/surfaces/student/states/" className="flex items-center gap-3 rounded-card border border-chrome-border bg-chrome-surface-raised px-5 py-4 hover:border-chrome-accent transition group">
              <div className="flex-1">
                <div className="text-h4 text-chrome-text">Interactive states</div>
                <div className="text-body-s text-chrome-text-subtle">14% hover coverage — needs eng review</div>
              </div>
              <ArrowRight size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
            </Link>
            <Link href="/drift-review/2026-04-16/" className="flex items-center gap-3 rounded-card border border-chrome-border bg-chrome-surface-raised px-5 py-4 hover:border-chrome-accent transition group">
              <div className="flex-1">
                <div className="text-h4 text-chrome-text">Drift report</div>
                <div className="text-body-s text-chrome-text-subtle">2026-04-16 · {drift?.totalItems ?? 0} items</div>
              </div>
              <ArrowRight size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
            </Link>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
