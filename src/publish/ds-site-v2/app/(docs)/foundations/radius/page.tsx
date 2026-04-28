import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Radius',
  description: 'Border-radius scale with three modes (default / rounded / no-corner-radius). Wired to Figma library 8eNJf875iY9HISEsczDfOh as primitives/radius + semantic/radius collections.',
}

const TOC = [
  { id: 'primitives', label: 'Primitives',  level: 2 as const },
  { id: 'semantic',   label: 'Semantic',    level: 2 as const },
  { id: 'modes',      label: 'Mode system', level: 2 as const },
  { id: 'drift',      label: 'Source drift', level: 2 as const },
]

const PRIMITIVES = [
  { token: 'radius/default/sm',   value: 6,    visualPx: 6 },
  { token: 'radius/default/md',   value: 8,    visualPx: 8 },
  { token: 'radius/default/lg',   value: 10,   visualPx: 10 },
  { token: 'radius/default/xl',   value: 14,   visualPx: 14 },
  { token: 'radius/default/2xl',  value: 16,   visualPx: 16, badge: 'NEW' },
  { token: 'radius/default/3xl',  value: 20,   visualPx: 20, badge: 'NEW' },
  { token: 'radius/default/4xl',  value: 24,   visualPx: 24, badge: 'NEW' },
  { token: 'radius/default/full', value: 9999, visualPx: 9999 },
]

const SEMANTIC_MODES = [
  { token: 'radius/control/sm',     def: '6 (default/sm)',     rnd: '10 (rounded/sm)',  none: '0 (none/sm)',  use: 'Small buttons, inputs' },
  { token: 'radius/control/md',     def: '8 (default/md)',     rnd: '14 (rounded/md)',  none: '0 (none/md)',  use: 'Default control radius' },
  { token: 'radius/control/lg',     def: '10 (default/lg)',    rnd: '18 (rounded/lg)',  none: '0 (none/lg)',  use: 'Larger controls' },
  { token: 'radius/control/xl',     def: '14 (default/xl)',    rnd: '24 (rounded/xl)',  none: '0 (none/xl)',  use: 'Hero controls' },
  { token: 'radius/container/sm',   def: '6 (default/sm)',     rnd: '10 (rounded/sm)',  none: '0',            use: 'Small cards, chips' },
  { token: 'radius/container/md',   def: '8 (default/md)',     rnd: '14 (rounded/md)',  none: '0',            use: 'Default container' },
  { token: 'radius/container/lg',   def: '10 (default/lg)',    rnd: '18 (rounded/lg)',  none: '0',            use: 'Card containers' },
  { token: 'radius/container/xl',   def: '20 (default/3xl)',   rnd: '24 (rounded/3xl)', none: '0',            use: 'Large cards, panels (NEW)', badge: 'NEW' },
  { token: 'radius/container/2xl',  def: '24 (default/4xl)',   rnd: '28 (rounded/4xl)', none: '0',            use: 'Hero containers (NEW)', badge: 'NEW' },
  { token: 'radius/card',           def: '16 (default/2xl)',   rnd: '20 (rounded/2xl)', none: '0',            use: 'Card component canonical (was drifting to container/lg)', badge: 'NEW' },
  { token: 'radius/pill',           def: 'full (9999)',        rnd: 'full (9999)',      none: 'full (9999)',  use: 'Pill buttons, dots, avatars' },
]

const SOURCE_DRIFT = [
  { value: '50%',   uses: 193, status: '✓ semantic radius/pill' },
  { value: '20px',  uses: 154, status: '✓ NEW radius/3xl token' },
  { value: '16px',  uses: 146, status: '✓ NEW radius/2xl + radius/card token (was drifting to container/lg = 10)' },
  { value: '10px',  uses: 129, status: '✓ radius/default/lg' },
  { value: '8px',   uses: 127, status: '✓ radius/default/md' },
  { value: '12px',  uses: 91,  status: '✓ NavBar radius (uses radius/control/lg with +2 drift)' },
  { value: '24px',  uses: 90,  status: '✓ NEW radius/4xl token' },
  { value: '4px',   uses: 66,  status: 'No exact token — closest radius/default/sm = 6 (+2 drift)' },
  { value: '6px',   uses: 61,  status: '✓ radius/default/sm' },
  { value: '30px',  uses: 37,  status: 'No token — likely drift toward radius/3xl (20) or radius/full' },
  { value: '14px',  uses: 22,  status: '✓ radius/default/xl' },
  { value: '50px',  uses: 21,  status: 'Used by Button — bound to radius/pill (functionally pill at button heights)' },
  { value: '40px',  uses: 16,  status: 'No token — pill-equivalent at button heights' },
  { value: '32px',  uses: 14,  status: 'No token — between 24 and 40' },
  { value: '100px', uses: 13,  status: 'Notification dot, source $border-radius-full — likely radius/pill' },
  { value: '15px',  uses: 12,  status: 'Drift — should be radius/default/lg (10) or container/lg' },
]

function Swatch({ pxValue, label }: { pxValue: number; label: string }) {
  // Display: a 96×64 box with the radius applied (capped visually at 32 for pill display)
  const visualRadius = pxValue >= 9999 ? 32 : pxValue
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-[96px] h-[64px] border border-chrome-border bg-chrome-surface-sunken"
        style={{ borderRadius: visualRadius }}
      />
      <div className="text-[11px] font-mono text-chrome-text-subtle">{label}</div>
    </div>
  )
}

export default function RadiusPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Radius</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The corner-radius system has eight primitive steps × three modes (default / rounded / no-corner-radius).
          Eleven semantic tokens layer on top, including <code className="font-mono">radius/card</code>, <code className="font-mono">radius/container/xl</code>,
          and <code className="font-mono">radius/container/2xl</code> — added 2026-04-28 to close the source-drift gap on 16/20/24px values.
        </p>

        <section id="primitives" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Primitives</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Default-mode primitives. Each value also exists in <code className="font-mono">rounded</code> and <code className="font-mono">none</code> modes for the
            three-mode semantic system.
          </p>
          <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))]">
            {PRIMITIVES.map(p => (
              <Swatch key={p.token} pxValue={p.visualPx} label={`${p.token.replace('radius/default/','')} · ${p.value === 9999 ? 'full' : p.value}`} />
            ))}
          </div>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Value (px)</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest"></th>
                </tr>
              </thead>
              <tbody>
                {PRIMITIVES.map(p => (
                  <tr key={p.token} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{p.token}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{p.value === 9999 ? 'full (9999)' : p.value}</td>
                    <td className="p-3">{p.badge && <span className="inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(36,194,110,0.14)] text-[#16803c]">{p.badge}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="semantic" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Semantic radius</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Each semantic token resolves to a different primitive in each mode. Switch the file mode to <code className="font-mono">rounded</code> for a softer
            BrightChamps treatment, or <code className="font-mono">no-corner-radius</code> for sharp-corner mode (legacy / accessibility).
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">default</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">rounded</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">no-corner</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Usage</th>
                </tr>
              </thead>
              <tbody>
                {SEMANTIC_MODES.map(s => (
                  <tr key={s.token} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">
                      {s.token}
                      {s.badge && <span className="ml-2 inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(36,194,110,0.14)] text-[#16803c]">{s.badge}</span>}
                    </td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{s.def}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{s.rnd}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{s.none}</td>
                    <td className="p-3 text-chrome-text-subtle">{s.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="modes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Mode system</h2>
          <p className="mt-2 text-body-m text-chrome-text-subtle max-w-[62ch]">
            <strong>default</strong> matches the current production design — the standard BrightChamps radius. <strong>rounded</strong> is the future
            soft-corner treatment (~30% larger radii) being designed for the v2 brand refresh. <strong>no-corner-radius</strong> flattens everything
            to 0 for legacy or accessibility-mode contexts.
          </p>
          <p className="mt-3 text-body-m text-chrome-text-subtle max-w-[62ch]">
            Switching modes in Figma or via CSS data attribute (<code className="font-mono">data-radius-mode="rounded"</code>) cascades through every component
            that binds to a semantic radius token. Components built before 2026-04-28 may still use raw values — see drift table below.
          </p>
        </section>

        <section id="drift" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Source drift</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Source-extraction (2026-04-28) found 30+ unique radius values across 1,000+ uses. The most-used 12 are mapped to canonical tokens.
            The rest are drift — engineering codemod will snap them to the nearest token.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Source value</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Uses</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
                </tr>
              </thead>
              <tbody>
                {SOURCE_DRIFT.map(d => (
                  <tr key={d.value} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{d.value}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{d.uses}</td>
                    <td className="p-3 text-chrome-text-subtle">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
