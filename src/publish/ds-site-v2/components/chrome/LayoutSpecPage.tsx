import { RightTOC } from '@/components/chrome/RightTOC'

const FIGMA_URL = 'https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/'

const TOC = [
  { id: 'overview',  label: 'Overview',          level: 2 as const },
  { id: 'regions',   label: 'Regions',           level: 2 as const },
  { id: 'tokens',    label: 'Token bindings',    level: 2 as const },
  { id: 'routes',    label: 'Routes using this', level: 2 as const },
  { id: 'notes',     label: 'Notes & drift',     level: 2 as const },
]

export interface LayoutRegion {
  name: string
  size: string
  role: string
  token?: string
}

export interface LayoutTokenBinding {
  property: string
  token: string
  cssVar: string
  value: string
}

export interface LayoutSpec {
  kicker: string
  name: string
  slug: string
  description: string
  sourceFile?: string
  regions: LayoutRegion[]
  tokens: LayoutTokenBinding[]
  routes: { route: string; note?: string }[]
  notes?: string[]
  drift?: string[]
}

export function LayoutSpecPage({ spec }: { spec: LayoutSpec }) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">{spec.kicker}</div>
        <h1 className="text-h1 text-chrome-text">{spec.name}</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">{spec.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px]">
          <a className="text-chrome-accent hover:underline" href={FIGMA_URL} target="_blank" rel="noreferrer">View in Figma library →</a>
          {spec.sourceFile && (
            <span className="text-chrome-text-subtlest">
              Source: <code className="font-mono text-[12px]">{spec.sourceFile}</code>
            </span>
          )}
        </div>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">{spec.description}</p>
        </section>

        <section id="regions" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Regions</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Region</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Size</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Role</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                </tr>
              </thead>
              <tbody>
                {spec.regions.map(r => (
                  <tr key={r.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-chrome-text">{r.name}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{r.size}</td>
                    <td className="p-3 text-chrome-text">{r.role}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{r.token ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="tokens" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token bindings</h2>
          {spec.tokens.length === 0
            ? <p className="mt-2 text-body-s text-chrome-text-subtle">No semantic tokens — this layout is structural-only (positioning + sizing).</p>
            : (
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
                    {spec.tokens.map(t => (
                      <tr key={t.property} className="border-b border-chrome-border last:border-b-0">
                        <td className="p-3 text-chrome-text">{t.property}</td>
                        <td className="p-3 font-mono text-chrome-text">{t.token}</td>
                        <td className="p-3 font-mono text-chrome-text-subtle">{t.cssVar}</td>
                        <td className="p-3 font-mono text-chrome-text-subtle">{t.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>

        <section id="routes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Routes using this</h2>
          {spec.routes.length === 0
            ? <p className="mt-2 text-body-s text-chrome-text-subtle">Not currently mapped from <code className="font-mono">pageLayoutConfig</code>.</p>
            : (
              <ul className="mt-3 ml-4 space-y-1.5 list-disc text-body-m text-chrome-text">
                {spec.routes.map(r => (
                  <li key={r.route}>
                    <code className="font-mono">{r.route}</code>
                    {r.note && <span className="ml-2 text-chrome-text-subtle">— {r.note}</span>}
                  </li>
                ))}
              </ul>
            )}
        </section>

        {(spec.notes || spec.drift) && (
          <section id="notes" className="mt-12 scroll-mt-24">
            <h2 className="text-h2 text-chrome-text">Notes &amp; drift</h2>
            {spec.notes && spec.notes.length > 0 && (
              <ul className="mt-3 ml-4 space-y-1.5 list-disc text-body-m text-chrome-text">
                {spec.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
            {spec.drift && spec.drift.length > 0 && (
              <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4">
                <div className="text-overline text-[#8a5e00] mb-1">Drift</div>
                <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1">
                  {spec.drift.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
