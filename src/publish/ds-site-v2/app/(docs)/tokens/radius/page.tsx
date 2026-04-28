import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Tokens · Radius',
  description: 'Mode-aware radius tokens (default / rounded / no-corner-radius) with primitive scales and semantic shape mapping.',
}

const TOC = [
  { id: 'overview',  label: 'Overview',         level: 2 as const },
  { id: 'modes',     label: 'Three modes',      level: 2 as const },
  { id: 'primitive', label: 'Primitive scales', level: 2 as const },
  { id: 'semantic',  label: 'Semantic shapes',  level: 2 as const },
]

const PRIMITIVES = [
  { token: 'radius/default/sm',   default: 6,  rounded: 10,    none: 0 },
  { token: 'radius/default/md',   default: 8,  rounded: 14,    none: 0 },
  { token: 'radius/default/lg',   default: 10, rounded: 18,    none: 0 },
  { token: 'radius/default/xl',   default: 14, rounded: 22,    none: 0 },
  { token: 'radius/default/2xl',  default: 20, rounded: 28,    none: 0 },
  { token: 'radius/default/3xl',  default: 28, rounded: 36,    none: 0 },
  { token: 'radius/default/4xl',  default: 36, rounded: 48,    none: 0 },
  { token: 'radius/default/full', default: 9999, rounded: 9999, none: 0 },
]

const SEMANTIC = [
  { token: 'radius/control/sm',   default: 6,    rounded: 10,    none: 0,   role: 'Small button, chip' },
  { token: 'radius/control/md',   default: 8,    rounded: 14,    none: 0,   role: 'Default button, input' },
  { token: 'radius/control/lg',   default: 10,   rounded: 18,    none: 0,   role: 'Large button, banner CTA' },
  { token: 'radius/control/xl',   default: 14,   rounded: 22,    none: 0,   role: 'Hero CTA, oversized button' },
  { token: 'radius/container/sm', default: 8,    rounded: 14,    none: 0,   role: 'List item, small card' },
  { token: 'radius/container/md', default: 10,   rounded: 18,    none: 0,   role: 'Default card' },
  { token: 'radius/container/lg', default: 14,   rounded: 22,    none: 0,   role: 'Module / section card' },
  { token: 'radius/container/xl', default: 20,   rounded: 28,    none: 0,   role: 'Modal, dialog' },
  { token: 'radius/container/2xl', default: 28,  rounded: 36,    none: 0,   role: 'Hero card, popup' },
  { token: 'radius/card',          default: 10,  rounded: 18,    none: 0,   role: 'Alias for container/md' },
  { token: 'radius/pill',          default: 9999, rounded: 9999, none: 0,   role: 'Pill / capsule shape' },
]

interface SwatchProps { radius: number }
function CornerSwatch({ radius }: SwatchProps) {
  const cap = Math.min(radius, 36)
  return (
    <div
      aria-hidden
      className="h-9 w-9 border-2 border-chrome-accent bg-chrome-accent-subtle"
      style={{ borderRadius: cap }}
    />
  )
}

export default function TokensRadiusPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference · Tokens</div>
        <h1 className="text-h1 text-chrome-text">Radius tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Three modes — <strong>default</strong>, <strong>rounded</strong>, <strong>no-corner-radius</strong> — let an
          entire surface re-skin its corner language without touching individual components. For the visual narrative see{' '}
          <a className="text-chrome-accent hover:underline" href="/foundations/radius/">Foundations · Radius</a>.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Primitive tokens</div>
              <div className="text-[28px] font-bold text-chrome-text">{PRIMITIVES.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Semantic tokens</div>
              <div className="text-[28px] font-bold text-chrome-text">{SEMANTIC.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Modes</div>
              <div className="text-[28px] font-bold text-chrome-accent">3</div>
              <div className="text-[11px] text-chrome-text-subtlest">default / rounded / no-corner-radius</div>
            </div>
          </div>
        </section>

        <section id="modes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Three modes</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Set <code className="font-mono">data-radius=&quot;rounded&quot;</code> on a surface root to switch every
            radius token in that subtree. Used to differentiate marketing landing (rounded) from authenticated app
            (default) without forking components.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { mode: 'default',          example: 8,    desc: 'Authenticated student app' },
              { mode: 'rounded',          example: 14,   desc: 'Landing pages, marketing' },
              { mode: 'no-corner-radius', example: 0,    desc: 'Print, accessibility, e-com retail' },
            ].map(m => (
              <div key={m.mode} className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
                <div className="text-overline text-chrome-text-subtlest mb-2">{m.mode}</div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-chrome-accent" style={{ borderRadius: m.example }} />
                  <div className="font-mono text-[18px] font-bold text-chrome-text">{m.example}px</div>
                </div>
                <p className="mt-3 text-body-s text-chrome-text-subtle">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="primitive" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Primitive scales</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">default</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">rounded</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">no-corner</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Preview</th>
                </tr>
              </thead>
              <tbody>
                {PRIMITIVES.map(r => (
                  <tr key={r.token} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px] text-chrome-text">{r.token}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{r.default >= 9999 ? '∞' : r.default}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{r.rounded >= 9999 ? '∞' : r.rounded}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{r.none}</td>
                    <td className="p-3"><CornerSwatch radius={r.default} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="semantic" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Semantic shapes</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Bind components to semantic tokens — they alias the primitives per active mode.</p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">default</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">rounded</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Role</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Preview</th>
                </tr>
              </thead>
              <tbody>
                {SEMANTIC.map(r => (
                  <tr key={r.token} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px] text-chrome-text">{r.token}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{r.default >= 9999 ? '∞' : r.default}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{r.rounded >= 9999 ? '∞' : r.rounded}</td>
                    <td className="p-3 text-chrome-text-subtle">{r.role}</td>
                    <td className="p-3"><CornerSwatch radius={r.default} /></td>
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
