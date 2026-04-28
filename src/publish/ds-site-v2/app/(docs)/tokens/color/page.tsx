import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { colors, colorsByCategory } from '@/lib/tokens.generated'

export const metadata: Metadata = {
  title: 'Tokens · Color',
  description: 'Machine-readable color token reference. Every canonical color, grouped by category with surfaces and usage counts.',
}

const TOC = [
  { id: 'overview',   label: 'Overview',     level: 2 as const },
  { id: 'brand',      label: 'Brand',         level: 2 as const },
  { id: 'neutral',    label: 'Neutral',       level: 2 as const },
  { id: 'feedback',   label: 'Feedback',      level: 2 as const },
  { id: 'surface',    label: 'Surface & overlay', level: 2 as const },
  { id: 'course',     label: 'Course',        level: 2 as const },
]

function isLight(hex: string): boolean {
  const m = hex.replace('#', '')
  if (m.length < 6) return true
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

interface RowToken {
  name: string
  value: string
  cssVar: string
  usageCount: number
  tier: string
}

function ColorTable({ rows }: { rows: RowToken[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-chrome-border">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest w-[60px]">Swatch</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Hex</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS variable</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Uses</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Tier</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(t => (
            <tr key={t.name} className="border-b border-chrome-border last:border-b-0">
              <td className="p-2.5"><span aria-hidden className="block h-7 w-7 rounded-md border border-chrome-border" style={{ background: t.value, boxShadow: isLight(t.value) ? 'inset 0 0 0 1px rgba(0,0,0,0.08)' : undefined }} /></td>
              <td className="p-3 font-mono text-[12.5px] text-chrome-text">{t.name}</td>
              <td className="p-3 font-mono text-[12px] text-chrome-text-subtle">{t.value}</td>
              <td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">{`var(${t.cssVar})`}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{t.usageCount.toLocaleString()}</td>
              <td className="p-3"><span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (t.tier === 'canonical' ? 'bg-[rgba(36,194,110,0.15)] text-[#0e6a32]' : t.tier === 'candidate' ? 'bg-[rgba(255,205,106,0.30)] text-[#8a5e00]' : 'bg-[rgba(240,41,77,0.20)] text-[#a31836]')}>{t.tier}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TokensColorPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference · Tokens</div>
        <h1 className="text-h1 text-chrome-text">Color tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Every canonical color in the system as a flat reference. For visual swatches, narrative, and DC-conflict
          callouts see <a className="text-chrome-accent hover:underline" href="/foundations/color/">Foundations · Color</a>.
          For interactive search + filter use the <a className="text-chrome-accent hover:underline" href="/tools/palette/">Palette explorer</a>.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Total color tokens</div>
              <div className="text-[28px] font-bold text-chrome-text">{colors.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Canonical</div>
              <div className="text-[28px] font-bold text-chrome-accent">{colors.filter(c => c.tier === 'canonical').length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Categories</div>
              <div className="text-[28px] font-bold text-chrome-text">7</div>
              <div className="text-[11px] text-chrome-text-subtlest">brand · neutral · feedback · surface · overlay · interactive · course</div>
            </div>
          </div>
        </section>

        <section id="brand" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Brand</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Primary identity colors. <strong>DC-005</strong> tracks the four-way primary purple conflict.</p>
          <div className="mt-4"><ColorTable rows={colorsByCategory.brand as RowToken[]} /></div>
        </section>

        <section id="neutral" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Neutral</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Greyscale ramp. <code className="font-mono">neutral/100</code> is the canonical surface white.</p>
          <div className="mt-4"><ColorTable rows={colorsByCategory.neutral as RowToken[]} /></div>
        </section>

        <section id="feedback" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Feedback</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Status colors — danger, warning, success, info. Each has an extended ramp.</p>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Danger / Error</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.feedback.danger as RowToken[]} /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Warning</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.feedback.warning as RowToken[]} /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Success</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.feedback.success as RowToken[]} /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Info</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.feedback.info as RowToken[]} /></div>
          </div>
        </section>

        <section id="surface" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Surface & overlay</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Backgrounds, modals, scrim, and translucent overlays.</p>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Surface</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.surface as RowToken[]} /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Overlay</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.overlay as RowToken[]} /></div>
          </div>
          <div className="mt-6">
            <h3 className="text-body-l font-bold text-chrome-text">Interactive</h3>
            <div className="mt-2"><ColorTable rows={colorsByCategory.interactive as RowToken[]} /></div>
          </div>
        </section>

        <section id="course" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Course</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Per-vertical accent colors — only one course color used per surface, never mixed.</p>
          <div className="mt-4"><ColorTable rows={colorsByCategory.course as RowToken[]} /></div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
