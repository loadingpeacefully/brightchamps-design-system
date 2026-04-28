import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Tokens · Space',
  description: 'Machine-readable spacing token reference. Primitive scale + semantic inset/stack/inline/section.',
}

const TOC = [
  { id: 'overview',  label: 'Overview',                level: 2 as const },
  { id: 'primitive', label: 'Primitive (4px scale)',  level: 2 as const },
  { id: 'inset',     label: 'Inset',                   level: 2 as const },
  { id: 'stack',     label: 'Stack & inline',          level: 2 as const },
  { id: 'section',   label: 'Section',                 level: 2 as const },
  { id: 'chrome',    label: 'Chrome',                  level: 2 as const },
]

const PRIMITIVE = [
  { name: 'space/4',   value: 4,   rem: '0.25rem' },
  { name: 'space/8',   value: 8,   rem: '0.5rem' },
  { name: 'space/12',  value: 12,  rem: '0.75rem' },
  { name: 'space/16',  value: 16,  rem: '1rem' },
  { name: 'space/20',  value: 20,  rem: '1.25rem' },
  { name: 'space/24',  value: 24,  rem: '1.5rem' },
  { name: 'space/32',  value: 32,  rem: '2rem' },
  { name: 'space/40',  value: 40,  rem: '2.5rem' },
  { name: 'space/48',  value: 48,  rem: '3rem' },
  { name: 'space/64',  value: 64,  rem: '4rem' },
  { name: 'space/80',  value: 80,  rem: '5rem' },
  { name: 'space/96',  value: 96,  rem: '6rem' },
  { name: 'space/128', value: 128, rem: '8rem' },
  { name: 'space/160', value: 160, rem: '10rem' },
  { name: 'space/200', value: 200, rem: '12.5rem' },
]

const INSET = [
  { name: 'space/inset/2xs', value: 4,  use: 'Icon-text gap inside chips' },
  { name: 'space/inset/xs',  value: 8,  use: 'Compact button padding' },
  { name: 'space/inset/sm',  value: 12, use: 'Tag, pill, small button' },
  { name: 'space/inset/md',  value: 16, use: 'Default card / list-item padding' },
  { name: 'space/inset/lg',  value: 20, use: 'Card content padding' },
  { name: 'space/inset/xl',  value: 24, use: 'Modal padding, large card' },
  { name: 'space/inset/2xl', value: 32, use: 'Section padding' },
  { name: 'space/inset/3xl', value: 40, use: 'Hero / dashboard sections' },
]

const STACK = [
  { name: 'space/stack/xs',  value: 4,  use: 'Tight label-and-value pairs' },
  { name: 'space/stack/sm',  value: 8,  use: 'List item label / metadata' },
  { name: 'space/stack/md',  value: 12, use: 'Default vertical rhythm' },
  { name: 'space/stack/lg',  value: 20, use: 'Content blocks inside cards' },
  { name: 'space/stack/xl',  value: 32, use: 'Section gap' },
]

const INLINE = [
  { name: 'space/inline/xs', value: 4,  use: 'Icon-text / chip-icon gap' },
  { name: 'space/inline/sm', value: 8,  use: 'Button content gap' },
  { name: 'space/inline/md', value: 12, use: 'Default horizontal rhythm' },
  { name: 'space/inline/lg', value: 20, use: 'Toolbar items, tag groups' },
]

const SECTION = [
  { name: 'space/section/sm', value: 32 },
  { name: 'space/section/md', value: 48 },
  { name: 'space/section/lg', value: 64 },
  { name: 'space/section/xl', value: 96 },
]

const CHROME = [
  { name: 'chrome/sidebar-rail',     value: 104, role: 'Collapsed left rail (icon-only)' },
  { name: 'chrome/sidebar-expanded', value: 280, role: 'Expanded left sidebar with labels' },
  { name: 'chrome/right-panel',      value: 460, role: 'Right rail (ProfileCard area)' },
  { name: 'chrome/main-content-max', value: 880, role: 'Centered content max width' },
  { name: 'chrome/page-max',         value: 1440, role: 'Full canvas max width' },
  { name: 'chrome/page-min',         value: 80,   role: 'Mobile-min footprint' },
]

const MAX_PX = 200

function ScaleBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-chrome-surface-sunken overflow-hidden w-[160px]">
      <div className="h-full" style={{ width: `${Math.min(100, (value / MAX_PX) * 100)}%`, background: 'var(--brand-primary, #4e3bc2)' }} />
    </div>
  )
}

interface SimpleRow { name: string; value: number; use?: string; role?: string; rem?: string }

function SpaceTable({ rows, showBar = true, showRem = false }: { rows: SimpleRow[]; showBar?: boolean; showRem?: boolean }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Value</th>
            {showRem && <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">rem</th>}
            {showBar && <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Scale</th>}
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Use</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name} className="border-b border-chrome-border last:border-b-0">
              <td className="p-3 font-mono text-[12.5px] text-chrome-text">{r.name}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{r.value}<span className="text-chrome-text-subtlest">px</span></td>
              {showRem && <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{r.rem}</td>}
              {showBar && <td className="p-3"><ScaleBar value={r.value} /></td>}
              <td className="p-3 text-chrome-text-subtle">{r.use ?? r.role ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TokensSpacePage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference · Tokens</div>
        <h1 className="text-h1 text-chrome-text">Space tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          15 primitive 4px-scale values + 30 semantic tokens. Use semantic <code className="font-mono">space/inset/*</code>,{' '}
          <code className="font-mono">space/stack/*</code>, <code className="font-mono">space/inline/*</code>, and{' '}
          <code className="font-mono">space/section/*</code> in components. For visual examples see{' '}
          <a className="text-chrome-accent hover:underline" href="/foundations/spacing/">Foundations · Spacing</a>.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Primitives</div>
              <div className="text-[28px] font-bold text-chrome-text">{PRIMITIVE.length}</div>
              <div className="text-[11px] text-chrome-text-subtlest">4px base, 4–200px</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Semantic</div>
              <div className="text-[28px] font-bold text-chrome-text">{INSET.length + STACK.length + INLINE.length + SECTION.length}</div>
              <div className="text-[11px] text-chrome-text-subtlest">inset · stack · inline · section</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Chrome</div>
              <div className="text-[28px] font-bold text-chrome-accent">{CHROME.length}</div>
              <div className="text-[11px] text-chrome-text-subtlest">Layout architecture</div>
            </div>
          </div>
        </section>

        <section id="primitive" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Primitive (4px scale)</h2>
          <SpaceTable rows={PRIMITIVE} showRem />
        </section>

        <section id="inset" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Inset</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Padding inside a component — uniform on all sides.</p>
          <SpaceTable rows={INSET} />
        </section>

        <section id="stack" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Stack & inline</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Gap between siblings — vertical (stack) or horizontal (inline).</p>
          <SpaceTable rows={STACK} />
          <SpaceTable rows={INLINE} />
        </section>

        <section id="section" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Section</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Major page-level rhythm — between unrelated content blocks.</p>
          <SpaceTable rows={SECTION} />
        </section>

        <section id="chrome" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Chrome</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Layout architecture: the rail / sidebar / content / panel widths shared across every authenticated student page.</p>
          <SpaceTable rows={CHROME} showBar={false} />
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
