import type { Metadata } from 'next'
import Link from 'next/link'
import { RightTOC } from '@/components/chrome/RightTOC'
import { loadLatestDrift } from '@/lib/drift'
import { loadLatestDesignerConflicts, type DesignerConflict } from '@/lib/designer-conflicts'
import { loadSourceDrift } from '@/lib/source-drift'
import { loadComponents, loadIcons, loadStates } from '@/lib/surface-data'
import { Terminal, Shield, AlertTriangle, HelpCircle, ArrowRight, Layers, Image, MousePointer } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Surfaces',
  description: 'Health dashboard for every BrightChamps surface — match rate, drift, component inventory, icon audit, interactive states.',
}

const TOC = [
  { id: 'student',             label: 'Student app',         level: 2 as const },
  { id: 'designer-conflicts',  label: 'Designer conflicts',  level: 2 as const },
  { id: 'landing',             label: 'Landing',             level: 2 as const },
  { id: 'teacher',             label: 'Teacher app',         level: 2 as const },
  { id: 'admin',               label: 'Admin',               level: 2 as const },
  { id: 'parent-hub',          label: 'Parent Hub',          level: 2 as const },
]

function isHex(v: string | null): v is string { return !!v && /^#[0-9a-f]{3,8}$/i.test(v) }

function SeverityBadge({ severity }: { severity: 'critical' | 'high' | 'medium' | 'low' }) {
  const cls =
    severity === 'critical' ? 'bg-[rgba(99,9,21,0.92)] text-white border border-[#a31836]' :
    severity === 'high'     ? 'bg-[rgba(240,41,77,0.12)] text-[#a31836]' :
    severity === 'medium'   ? 'bg-[rgba(255,187,58,0.18)] text-[#8a5e00]' :
                              'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle'
  return <span className={'inline-block rounded-[10px] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] ' + cls}>{severity}</span>
}

function StatusPill({ status }: { status: 'open' | 'pending-confirmation' | 'resolved' }) {
  if (status === 'pending-confirmation') {
    return <span className="inline-block rounded-[10px] bg-[rgba(255,187,58,0.2)] text-[#8a5e00] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">Awaiting brand team sign-off</span>
  }
  if (status === 'resolved') {
    return <span className="inline-block rounded-[10px] bg-[rgba(36,194,110,0.14)] text-[#16803c] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">Resolved</span>
  }
  return <span className="inline-block rounded-[10px] bg-[rgba(13,71,161,0.14)] text-[#0d47a1] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">Engineering action</span>
}

function Swatch({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest mb-1">{label}</div>
      {isHex(value ?? null) ? (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border border-chrome-border" style={{ background: value as string }} />
          <span className="font-mono text-[12px] text-chrome-text">{value}</span>
        </div>
      ) : (
        <span className="text-[12px] text-chrome-text-subtlest italic">{value ?? 'no match'}</span>
      )}
    </div>
  )
}

function ConflictRow({ ticket }: { ticket: DesignerConflict }) {
  const isFiveWay = ticket.fiveWayConflict === true
  const isFourWay = ticket.fourWayConflict === true || isFiveWay
  const isThreeWay = ticket.threeWayConflict === true || isFourWay
  const showSwatches = ticket.category === 'color' && (isHex(ticket.designerValue) || isHex(ticket.productionValue))
  const isCritical = ticket.severity === 'critical'
  // DC-008-style typo cases: values are visually identical (ΔE < 1) — render as text, not swatches.
  const isTypoCase = ticket.category === 'color' && typeof ticket.deltaE === 'number' && ticket.deltaE < 1
  return (
    <article
      className={
        isCritical
          ? 'rounded-card border-2 border-[#a31836] bg-[rgba(240,41,77,0.04)] p-5'
          : 'rounded-card border border-chrome-border bg-chrome-surface-raised p-5'
      }
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[11px] font-bold text-chrome-text-subtlest">{ticket.id}</span>
            <SeverityBadge severity={ticket.severity} />
            {isFiveWay ? (
              <span className="inline-block rounded-[10px] bg-[rgba(163,24,54,0.14)] text-[#a31836] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">
                5-way conflict
              </span>
            ) : isFourWay ? (
              <span className="inline-block rounded-[10px] bg-[rgba(78,59,194,0.14)] text-[#4e3bc2] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">
                4-way conflict
              </span>
            ) : isThreeWay ? (
              <span className="inline-block rounded-[10px] bg-[rgba(78,59,194,0.14)] text-[#4e3bc2] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em]">
                3-way conflict
              </span>
            ) : null}
            {ticket.deltaE !== null && (
              <span className="inline-block rounded-[10px] border border-chrome-border-bold bg-chrome-surface px-2 py-[1px] text-[10px] font-mono font-semibold text-chrome-text-subtle">ΔE {ticket.deltaE}</span>
            )}
          </div>
          <h3 className="text-[15px] font-bold text-chrome-text">{ticket.title}</h3>
        </div>
        <StatusPill status={ticket.status} />
      </div>

      {isFiveWay && ticket.category === 'color' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Swatch label="Designer DS"                     value={ticket.designerValue} />
            <Swatch label="Production · Figma"               value={ticket.productionFigmaValue ?? ticket.productionValue} />
            <Swatch label="Production · Code (feed)"         value={ticket.productionCodeValue} />
            <Swatch label="Production · Code (dashboard)"    value={ticket.productionCodeValue2} />
            <Swatch label="5th variant"                      value={ticket.fifthVariant} />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[#a31836]">
            <strong>FIVE-way conflict</strong> confirmed via deep source extraction (2026-04-28) — see{' '}
            <code className="font-mono">docs/deep-extraction-2026-04-28.md</code>. Codemod must touch ~138 files.
          </p>
        </>
      ) : isFourWay && ticket.category === 'color' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Swatch label="Designer DS"                     value={ticket.designerValue} />
            <Swatch label="Production · Figma"               value={ticket.productionFigmaValue ?? ticket.productionValue} />
            <Swatch label="Production · Code (feed)"         value={ticket.productionCodeValue} />
            <Swatch label="Production · Code (dashboard)"    value={ticket.productionCodeValue2} />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[#a31836]">
            Four-way conflict detected from source-code analysis — see{' '}
            <code className="font-mono">docs/repo-analysis-student-dashboard.md</code> and{' '}
            <code className="font-mono">docs/component-spec-verification.md</code>.
          </p>
        </>
      ) : isThreeWay && ticket.category === 'color' ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Swatch label="Designer DS"         value={ticket.designerValue} />
            <Swatch label="Production · Figma"   value={ticket.productionFigmaValue ?? ticket.productionValue} />
            <Swatch label="Production · Code"    value={ticket.productionCodeValue} />
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[#a31836]">
            Three-way conflict detected from source code analysis — see{' '}
            <code className="font-mono">docs/component-spec-verification.md</code>.
          </p>
        </>
      ) : isTypoCase ? (
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest mb-1">Intended</div>
            <div className="font-mono text-chrome-text">{ticket.designerValue}</div>
            <div className="text-[11px] text-chrome-text-subtlest italic mt-0.5">canonical brand</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest mb-1">Shipping (typo)</div>
            <div className="font-mono text-chrome-text">{ticket.productionValue}</div>
            <div className="text-[11px] text-chrome-text-subtlest italic mt-0.5">visually identical · ΔE {ticket.deltaE}</div>
          </div>
        </div>
      ) : showSwatches ? (
        <div className="grid grid-cols-2 gap-3">
          <Swatch label="Designer"   value={ticket.designerValue} />
          <Swatch label="Production" value={ticket.productionValue} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest mb-1">Designer</div>
            <div className="text-chrome-text">{ticket.designerValue ?? 'none'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest mb-1">Production</div>
            <div className="text-chrome-text">{ticket.productionValue ?? 'none'}</div>
          </div>
        </div>
      )}

      <p className="mt-3 text-[12px] leading-snug text-chrome-text-subtle"><strong className="text-chrome-text">Action:</strong> {ticket.action}</p>
      {ticket.notes && (
        <p className="mt-1.5 text-[11px] leading-snug italic text-chrome-text-subtlest">{ticket.notes}</p>
      )}
    </article>
  )
}

function ProgressBar({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-[12px] font-semibold text-chrome-text-subtle">{label}</span>
      <div className="flex-1 h-2 bg-chrome-surface-sunken rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-12 text-right font-mono text-[12px] font-semibold text-chrome-text tabular-nums">{value}</span>
    </div>
  )
}

function EmptyCard({ id, label, description, cmd }: { id?: string; label: string; description: string; cmd: string }) {
  return (
    <article id={id} className="scroll-mt-24 rounded-card border border-chrome-border p-6 bg-[repeating-linear-gradient(45deg,var(--chrome-surface)_0,var(--chrome-surface)_6px,var(--chrome-surface-sunken)_6px,var(--chrome-surface-sunken)_12px)]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-h4 text-chrome-text-subtle">{label}</h3>
        <span className="text-[11px] font-bold text-chrome-text-subtlest uppercase tracking-[0.06em]">Not extracted</span>
      </div>
      <p className="text-body-s text-chrome-text-subtlest">{description}</p>
      <div className="mt-4 rounded-md border border-chrome-border bg-chrome-surface p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Terminal size={12} className="text-chrome-text-subtlest" />
          <span className="text-[10px] font-bold text-chrome-text-subtlest uppercase tracking-[0.06em]">Run to populate</span>
        </div>
        <code className="block text-[12px] font-mono text-chrome-accent">{cmd}</code>
      </div>
    </article>
  )
}

export default function SurfacesPage() {
  const drift = loadLatestDrift()
  const sourceDrift = loadSourceDrift()
  const conflicts = loadLatestDesignerConflicts()
  const components = loadComponents()
  const icons = loadIcons()
  const states = loadStates()
  const criticalCount = drift ? (drift.unknown + drift.systemGap) : 0
  const statesChanged = states.filter(s => s.changed).length

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces</div>
        <h1 className="text-h1 text-chrome-text">Surfaces</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Health dashboard — 1 of 4 surfaces extracted. Teacher, Admin, and Landing pending.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* ─── Student (live) ──────────────────────────────── */}
          <article id="student" className="scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-raised p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-h3 text-chrome-text">Student app</h3>
              {drift && (
                <span className={'inline-flex rounded-full px-3 py-1 text-[13px] font-bold ' + (drift.matchPct >= 60 ? 'bg-[rgba(36,194,110,0.14)] text-[#16803c]' : drift.matchPct >= 40 ? 'bg-[rgba(255,187,58,0.18)] text-[#8a5e00]' : 'bg-[rgba(240,41,77,0.12)] text-[#a31836]')}>
                  {drift.matchPct}% match
                </span>
              )}
            </div>
            <p className="text-body-s text-chrome-text-subtle">
              champ.brightchamps.com · 7 URLs · DOM: {drift?.date ?? 'unknown'} · Source: {sourceDrift?.generatedAt?.slice(0, 10) ?? 'unknown'}
            </p>
            {sourceDrift && (
              <p className="mt-1 text-[12px] text-chrome-text-subtle">
                <span className="inline-block rounded-[3px] bg-[rgba(36,194,110,0.14)] text-[#16803c] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] mr-1.5">Source adoption</span>
                {sourceDrift.summary.tokenAdoption.adoptionRateAny} of {sourceDrift.summary.totalColorOccurrences.toLocaleString()} color declarations use tokens · {sourceDrift.summary.filesNeedingMigration} files need migration · {sourceDrift.summary.filesZeroAdoption} have zero adoption.
              </p>
            )}
            <p className="mt-1 text-[12px] text-amber-700 dark:text-amber-400">
              DOM data from {drift?.date ?? '—'} — 10 days stale. Re-run:{' '}
              <code className="font-mono text-[11px]">npm run extract:dom -- --surface=student</code>
            </p>

            {drift && (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-md border border-chrome-border bg-chrome-surface px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-[var(--brand-green)]" />
                      <span className="font-mono text-[18px] font-bold text-chrome-text">{drift.match}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-chrome-text-subtlest uppercase tracking-[0.06em]">Match</div>
                  </div>
                  <div className="rounded-md border border-chrome-border bg-chrome-surface px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-[#c07a00]" />
                      <span className="font-mono text-[18px] font-bold text-chrome-text">{drift.drift}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-chrome-text-subtlest uppercase tracking-[0.06em]">Drift</div>
                  </div>
                  <div className="rounded-md border border-chrome-border bg-chrome-surface px-4 py-3">
                    <span className="font-mono text-[18px] font-bold text-chrome-text">{drift.missing}</span>
                    <div className="text-[11px] font-semibold text-chrome-text-subtlest uppercase tracking-[0.06em]">Missing</div>
                  </div>
                  <div className="rounded-md border border-chrome-border bg-chrome-surface px-4 py-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-[var(--brand-red)]" />
                      <span className="font-mono text-[18px] font-bold text-chrome-text">{drift.unknown}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-chrome-text-subtlest uppercase tracking-[0.06em]">Unknown</div>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <ProgressBar value={drift.match}   total={drift.totalItems} color="var(--brand-green)" label="Match" />
                  <ProgressBar value={drift.drift}   total={drift.totalItems} color="#ffbb3a" label="Drift" />
                  <ProgressBar value={drift.missing} total={drift.totalItems} color="#8499ae" label="Missing" />
                  <ProgressBar value={drift.unknown} total={drift.totalItems} color="var(--brand-red)" label="Unknown" />
                </div>

                <div className="mt-5 flex items-center gap-2 text-[12px] text-chrome-text-subtlest">
                  <span>Critical issues: <strong className="text-[var(--brand-red)]">{criticalCount}</strong></span>
                  <span>·</span>
                  <span>Report: {drift.date} · {drift.totalItems.toLocaleString()} items</span>
                </div>
              </>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Link href="/surfaces/student/components/" className="flex items-center gap-3 rounded-md border border-chrome-border bg-chrome-surface px-4 py-3 text-body text-chrome-text hover:border-chrome-accent transition group">
                <Layers size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
                <div className="flex-1">
                  <div className="font-semibold">{components.length} components</div>
                  <div className="text-[11px] text-chrome-text-subtlest">All need spec</div>
                </div>
                <ArrowRight size={14} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
              </Link>
              <Link href="/surfaces/student/icons/" className="flex items-center gap-3 rounded-md border border-chrome-border bg-chrome-surface px-4 py-3 text-body text-chrome-text hover:border-chrome-accent transition group">
                <Image size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
                <div className="flex-1">
                  <div className="font-semibold">{icons.length} icons</div>
                  <div className="text-[11px] text-chrome-text-subtlest">No icon system</div>
                </div>
                <ArrowRight size={14} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
              </Link>
              <Link href="/surfaces/student/states/" className="flex items-center gap-3 rounded-md border border-chrome-border bg-chrome-surface px-4 py-3 text-body text-chrome-text hover:border-chrome-accent transition group">
                <MousePointer size={16} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
                <div className="flex-1">
                  <div className="font-semibold">{statesChanged}/{states.length} hover</div>
                  <div className="text-[11px] text-chrome-text-subtlest">{Math.round((statesChanged / states.length) * 100)}% coverage</div>
                </div>
                <ArrowRight size={14} className="text-chrome-text-subtlest group-hover:text-chrome-accent" />
              </Link>
            </div>
          </article>

        </div>

        {conflicts && conflicts.tickets.length > 0 && (
          <section id="designer-conflicts" className="mt-12 scroll-mt-24">
            <h2 className="text-h2 text-chrome-text">Design intent vs production</h2>
            <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
              {conflicts.tickets.length} tickets — designer-authored values vs what production ships.
              Source: {conflicts.source}
            </p>
            <div className="mt-6 grid gap-4">
              {conflicts.tickets.map(ticket => <ConflictRow key={ticket.id} ticket={ticket} />)}
            </div>
          </section>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* ─── Empty surfaces ──────────────────────────────── */}
          <EmptyCard id="landing" label="Landing pages" description="brightchamps.com · public marketing site" cmd="npm run extract:dom -- --surface=landing" />
          <EmptyCard id="teacher" label="Teacher app" description="Teacher dashboard and lesson management" cmd="npm run extract:dom -- --surface=teacher" />
          <EmptyCard id="admin" label="Admin dashboard" description="Internal admin — no Figma source, DOM is source of truth" cmd="npm run extract:dom -- --surface=admin" />
          <EmptyCard id="parent-hub" label="Parent Hub" description="src/newDashboard/parentHub · 53 SCSS modules · 8,140 lines · 99 unique colors · second product surface inside the dashboard codebase" cmd="npm run extract:dom -- --surface=parent-hub" />
        </div>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
