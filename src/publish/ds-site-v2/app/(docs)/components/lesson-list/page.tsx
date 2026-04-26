import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { Lock, Play, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'LessonList',
  description: 'Ordered list of lessons with status indicators. Variants, states, and token mapping.',
}

const TOC = [
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'states',   label: 'States',        level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'code',     label: 'Usage',         level: 2 as const },
  { id: 'a11y',     label: 'Accessibility', level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Status (locked)',         token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
  { property: 'Status (available)',      token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
  { property: 'Status (in-progress)',    token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
  { property: 'Status (completed)',      token: 'color/success/500',   cssVar: '--color-success-500',   value: '#00B67A' },
  { property: 'Title text',              token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
  { property: 'Subtitle / meta text',    token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
  { property: 'Row background (hover)',  token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Divider',                 token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Padding (block)',         token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Padding (inline)',        token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Gap (icon → title)',      token: 'space/2',             cssVar: '--space-2',             value: '8px' },
  { property: 'Status icon size',        token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Border radius',           token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
]

type Status = 'locked' | 'available' | 'in-progress' | 'completed'

function StatusIcon({ status }: { status: Status }) {
  if (status === 'locked')      return <Lock        size={16} strokeWidth={2} style={{ color: '#c3c2b3' }} />
  if (status === 'available')   return <Circle      size={16} strokeWidth={2} style={{ color: '#3d4d5d' }} />
  if (status === 'in-progress') return <Play        size={16} strokeWidth={2.5} style={{ color: '#4e3bc2' }} />
  return                                <CheckCircle2 size={16} strokeWidth={2.5} style={{ color: '#00B67A' }} />
}

function LessonRow({ index, title, meta, status, hover = false }: {
  index: number
  title: string
  meta: string
  status: Status
  hover?: boolean
}) {
  const dim = status === 'locked'
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${dim ? 'opacity-60' : ''}`}
      style={{ background: hover ? '#e7e7e7' : 'transparent' }}
    >
      <span className="text-[12px] font-mono w-6 text-right" style={{ color: '#3d4d5d' }}>{String(index).padStart(2, '0')}</span>
      <StatusIcon status={status} />
      <div className="flex-1">
        <div className="text-[14px] font-semibold" style={{ color: '#212121' }}>{title}</div>
        <div className="text-[12px]" style={{ color: '#3d4d5d' }}>{meta}</div>
      </div>
    </div>
  )
}

function DemoLessonList() {
  return (
    <div className="overflow-hidden rounded-md border divide-y" style={{ borderColor: '#e7e7e7', background: '#ffffff' }}>
      <LessonRow index={1} title="What is a variable?"          meta="6 min · Reading" status="completed" />
      <LessonRow index={2} title="Naming conventions"            meta="4 min · Reading" status="completed" />
      <LessonRow index={3} title="Types and values"              meta="9 min · Video"   status="in-progress" />
      <LessonRow index={4} title="Reassigning variables"         meta="7 min · Practice" status="available" />
      <LessonRow index={5} title="Scope (advanced)"              meta="12 min · Reading" status="locked" />
    </div>
  )
}

export default function LessonListPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">LessonList</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Ordered list of lessons with per-row status. Used inside course detail pages and the
          /learn/ surface to give learners a clear sequence + their place in it.
        </p>

        <div className="mt-4 rounded-card border-l-4 border-l-amber-500 border border-chrome-border bg-amber-50/40 dark:bg-amber-950/15 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-body-s text-chrome-text">
              <strong className="uppercase tracking-[0.04em] text-[12px] text-amber-700 dark:text-amber-400">Spec conflict.</strong>{' '}
              Border-radius documented as 8px. Production uses <code className="font-mono text-[12px]">16px</code>{' '}
              (<code className="font-mono text-[12px]">$border-radius-medium</code>).
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Sequenced lessons inside one course</li>
              <li>Step-by-step modules where order matters</li>
              <li>Anywhere learners need to know what&apos;s done, what&apos;s next, what&apos;s locked</li>
            </ul>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When not to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Course catalogs (use a card grid instead)</li>
              <li>Unordered lists of resources (use a plain list)</li>
              <li>Search results (use a result list with snippets)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          Discovered from student surface DOM audit. 43 elements on /learn/ — exclusive to that page.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Four per-row statuses. The list itself has one shape; status carries all the variation.</p>
          <div className="mt-6 rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
            <DemoLessonList />
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Per-row status × interaction matrix.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Row state</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Default</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Hover</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Locked</td>
                  <td className="p-0"><LessonRow index={5} title="Scope (advanced)"     meta="12 min · Reading" status="locked" /></td>
                  <td className="p-0"><LessonRow index={5} title="Scope (advanced)"     meta="12 min · Reading" status="locked" hover /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Available</td>
                  <td className="p-0"><LessonRow index={4} title="Reassigning variables" meta="7 min · Practice" status="available" /></td>
                  <td className="p-0"><LessonRow index={4} title="Reassigning variables" meta="7 min · Practice" status="available" hover /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">In-progress</td>
                  <td className="p-0"><LessonRow index={3} title="Types and values"      meta="9 min · Video"   status="in-progress" /></td>
                  <td className="p-0"><LessonRow index={3} title="Types and values"      meta="9 min · Video"   status="in-progress" hover /></td>
                </tr>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Completed</td>
                  <td className="p-0"><LessonRow index={1} title="What is a variable?"   meta="6 min · Reading" status="completed" /></td>
                  <td className="p-0"><LessonRow index={1} title="What is a variable?"   meta="6 min · Reading" status="completed" hover /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="tokens" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token mapping</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Every visual property maps to a design token. Copy the CSS variable for use in your components.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Property</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS variable</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Value</th>
                </tr>
              </thead>
              <tbody>
                {TOKEN_MAP.map(row => (
                  <tr key={row.property} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken transition-colors">
                    <td className="p-3 text-chrome-text">{row.property}</td>
                    <td className="p-3 font-mono font-semibold text-chrome-accent">{row.token}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{row.cssVar}</td>
                    <td className="p-3">
                      {row.value.startsWith('#') ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-3 w-3 rounded-sm border border-chrome-border" style={{ background: row.value }} />
                          <span className="font-mono">{row.value}</span>
                        </span>
                      ) : (
                        <span className="font-mono">{row.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="code" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Usage</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Minimum viable implementation using the token system.</p>
          <div className="mt-4 rounded-card border border-chrome-border bg-chrome-surface-sunken p-5 overflow-x-auto">
            <pre className="font-mono text-[13px] text-chrome-text leading-relaxed whitespace-pre">{`const STATUS_COLOR = {
  locked:       'var(--color-neutral-400)',
  available:    'var(--color-neutral-600)',
  'in-progress':'var(--color-brand-primary)',
  completed:    'var(--color-success-500)',
}

<ol
  className="rounded-md border divide-y"
  style={{ borderColor: 'var(--color-neutral-200)' }}
>
  {lessons.map((l, i) => (
    <li
      key={l.id}
      className="flex items-center gap-3 px-4 py-3"
      aria-current={l.status === 'in-progress' ? 'step' : undefined}
    >
      <span className="font-mono w-6 text-right" style={{ color: 'var(--color-neutral-600)' }}>
        {String(i + 1).padStart(2, '0')}
      </span>
      <StatusIcon status={l.status} color={STATUS_COLOR[l.status]} />
      <div>
        <div style={{ color: 'var(--color-neutral-1400)', fontWeight: 600 }}>{l.title}</div>
        <div style={{ color: 'var(--color-neutral-600)', fontSize: 12 }}>{l.meta}</div>
      </div>
    </li>
  ))}
</ol>`}</pre>
          </div>
        </section>

        <section id="a11y" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Accessibility</h2>
          <ul className="mt-4 ml-4 list-disc text-body text-chrome-text leading-relaxed">
            <li>Use <code className="font-mono text-[12px]">{`<ol>`}</code> — order is meaningful. Mark the in-progress row with <code className="font-mono text-[12px]">aria-current=&quot;step&quot;</code>.</li>
            <li>Status must not rely on color alone — every row carries a status icon AND a label, so colorblind users can still parse it.</li>
            <li>Locked rows: render as non-interactive (no link, no button), with <code className="font-mono text-[12px]">aria-disabled=&quot;true&quot;</code> if a control wraps them.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
