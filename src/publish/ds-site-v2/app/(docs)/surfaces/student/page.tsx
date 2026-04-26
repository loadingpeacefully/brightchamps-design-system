import type { Metadata } from 'next'
import Link from 'next/link'
import { RightTOC } from '@/components/chrome/RightTOC'
import { loadLatestDrift } from '@/lib/drift'
import { loadDriftItems } from '@/lib/surface-data'
import { Shield, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Student surface',
  description: 'Student app surface overview — drift metrics, top critical issues, and links to component, icon, and state audits.',
}

const TOC = [
  { id: 'metrics',   label: 'Metrics',         level: 2 as const },
  { id: 'critical',  label: 'Critical issues',  level: 2 as const },
  { id: 'explore',   label: 'Explore',          level: 2 as const },
]

export default function StudentOverviewPage() {
  const drift = loadLatestDrift()
  const items = loadDriftItems()

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
          Last extracted {drift?.date ?? 'unknown'}.
        </p>

        <section id="metrics" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Drift metrics</h2>
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
