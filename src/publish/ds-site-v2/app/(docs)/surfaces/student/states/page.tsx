import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { AlertTriangle } from 'lucide-react'
import { loadStates } from '@/lib/surface-data'

export const metadata: Metadata = {
  title: 'Student · Interactive states',
  description: 'Hover state audit for the student surface — 51 elements probed, 7 with color changes on hover (14%).',
}

const TOC = [
  { id: 'summary',  label: 'Summary',    level: 2 as const },
  { id: 'finding',  label: 'Key finding', level: 2 as const },
  { id: 'changed',  label: 'Color changes', level: 2 as const },
]

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!m) return rgb
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0')
  const hex = `#${toHex(m[1]!)}${toHex(m[2]!)}${toHex(m[3]!)}`
  const alphaMatch = rgb.match(/,\s*([\d.]+)\s*\)$/)
  if (alphaMatch && parseFloat(alphaMatch[1]!) < 1) {
    return `${hex}${Math.round(parseFloat(alphaMatch[1]!) * 255).toString(16).padStart(2, '0')}`
  }
  return hex
}

function normalizeColor(value: string): string {
  if (value.startsWith('rgb')) return rgbToHex(value)
  return value
}

function ColorPreview({ value }: { value: string }) {
  if (value === 'rgba(0, 0, 0, 0)' || value === 'transparent') {
    return <span className="text-chrome-text-subtlest italic">transparent</span>
  }
  const hex = normalizeColor(value)
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-3 w-3 rounded-sm border border-chrome-border" style={{ background: hex }} />
      <span className="font-mono text-[11px]">{hex}</span>
    </span>
  )
}

export default function StudentStatesPage() {
  const states = loadStates()
  const changed = states.filter(s => s.changed)
  const unchanged = states.filter(s => !s.changed)
  const pctChanged = states.length > 0 ? Math.round((changed.length / states.length) * 100) : 0

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Student</div>
        <h1 className="text-h1 text-chrome-text">Interactive states</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Hover state audit across 7 student app pages. {states.length} interactive elements
          (buttons, links, nav items) probed for computed color changes on hover.
        </p>

        <section id="summary" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Elements probed</div>
              <div className="text-[28px] font-bold text-chrome-text">{states.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">With color change</div>
              <div className="text-[28px] font-bold text-chrome-accent">{changed.length}</div>
              <div className="text-[12px] text-chrome-text-subtle">{pctChanged}%</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">No color change</div>
              <div className="text-[28px] font-bold text-chrome-text-subtle">{unchanged.length}</div>
              <div className="text-[12px] text-chrome-text-subtle">{100 - pctChanged}%</div>
            </div>
          </div>
        </section>

        <section id="finding" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Key finding</h2>
          <div className="mt-4 rounded-card border-l-4 border-l-[var(--bc-brand-red)] border border-chrome-border bg-[rgba(240,41,77,0.05)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} strokeWidth={1.75} className="text-[var(--bc-brand-red)]" />
              <span className="text-[13px] font-bold text-[#a31836] uppercase tracking-[0.04em]">Missing hover states</span>
            </div>
            <p className="text-body text-chrome-text">
              {100 - pctChanged}% of interactive elements ({unchanged.length} of {states.length}) show no
              hover color change. These elements either use opacity/transform-only hover transitions
              (invisible to computed-style extraction) or genuinely lack hover feedback.
            </p>
            <p className="mt-2 text-body-s text-chrome-text-subtle font-semibold">
              Recommendation: flag for engineering review. Children using touch-first devices may not
              notice the issue, but desktop users expect visual hover feedback on clickable elements.
            </p>
          </div>
        </section>

        {changed.length > 0 && (
          <section id="changed" className="mt-12 scroll-mt-24">
            <h2 className="text-h2 text-chrome-text">Elements with color changes</h2>
            <p className="mt-2 text-body-s text-chrome-text-subtle">
              {changed.length} elements that DO change color, background-color, or border-color on hover.
            </p>
            <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Element</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Page</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Property</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Before</th>
                    <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">After</th>
                  </tr>
                </thead>
                <tbody>
                  {changed.map((s, i) => {
                    const rows: Array<{ prop: string; before: string; after: string }> = []
                    if (s.baseline.color !== s.hovered.color) rows.push({ prop: 'color', before: s.baseline.color, after: s.hovered.color })
                    if (s.baseline.backgroundColor !== s.hovered.backgroundColor) rows.push({ prop: 'background', before: s.baseline.backgroundColor, after: s.hovered.backgroundColor })
                    if (s.baseline.borderColor !== s.hovered.borderColor) rows.push({ prop: 'border', before: s.baseline.borderColor, after: s.hovered.borderColor })
                    return rows.map((r, j) => (
                      <tr key={`${i}-${j}`} className="border-b border-chrome-border last:border-b-0">
                        {j === 0 && (
                          <>
                            <td className="p-3 font-mono font-semibold text-chrome-text align-top" rowSpan={rows.length}>
                              {s.text || s.selector}
                            </td>
                            <td className="p-3 text-chrome-text-subtle align-top" rowSpan={rows.length}>
                              {s.page}
                            </td>
                          </>
                        )}
                        <td className="p-3 font-mono text-[11px] text-chrome-text-subtle">{r.prop}</td>
                        <td className="p-3"><ColorPreview value={r.before} /></td>
                        <td className="p-3"><ColorPreview value={r.after} /></td>
                      </tr>
                    ))
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
