import { RightTOC } from '@/components/chrome/RightTOC'
import type { ComponentSpec } from '@/lib/componentSpecs'

const FIGMA_URL = 'https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/'

const TOC = [
  { id: 'overview', label: 'Overview',     level: 2 as const },
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'notes',    label: 'Notes & drift', level: 2 as const },
]

export function ComponentSpecPage({ spec, kicker, overview }: { spec: ComponentSpec; kicker: string; overview: string }) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">{kicker}</div>
        <h1 className="text-h1 text-chrome-text">{spec.name}</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">{spec.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px]">
          <span className="inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(36,194,110,0.14)] text-[#16803c]">
            {spec.verificationStatus.toUpperCase()}
          </span>
          <a className="text-chrome-accent hover:underline" href={FIGMA_URL} target="_blank" rel="noreferrer">View in Figma library →</a>
          {spec.sourceFile && (
            <span className="text-chrome-text-subtlest">
              Source: <code className="font-mono text-[12px]">{spec.sourceFile}</code>
            </span>
          )}
        </div>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">{overview}</p>
        </section>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <ul className="mt-3 space-y-1.5 text-body-m text-chrome-text">
            {spec.variants.map(v => (
              <li key={v}>· <code className="font-mono">{v}</code></li>
            ))}
          </ul>
        </section>

        <section id="tokens" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token mapping</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Every visual property bound to a Figma library variable. The <code className="font-mono">var(--*)</code> column
            is the CSS custom property emitted by Figma Dev Mode.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Property</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS var</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Resolved value</th>
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
        </section>

        {spec.conflicts && spec.conflicts.length > 0 && (
          <section id="notes" className="mt-12 scroll-mt-24">
            <h2 className="text-h2 text-chrome-text">Notes & drift</h2>
            <ul className="mt-3 space-y-2 max-w-[62ch] text-body-s text-chrome-text">
              {spec.conflicts.map((c, i) => (
                <li key={i}>· {c}</li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
