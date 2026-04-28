import { CopyCSSButton } from './CopyCSSButton'

export interface LiveVariant {
  /** Optional label rendered as a small caption above the variant */
  label?: string
  /** The CSS to copy when the user clicks "Copy CSS" — minimal, recreates this variant */
  css: string
  /** The actual rendered JSX for the variant */
  render: React.ReactNode
}

export interface LiveTokenRow {
  property: string
  token: string
  value: string
}

export interface LiveComponentPageProps {
  /** Component name */
  name: string
  /** One-sentence description */
  description: string
  /** Inline `<style>` block holding the CSS for the variants. Injected as raw CSS. */
  styleBlock: string
  /** Variants displayed side-by-side in a soft canvas */
  variants: LiveVariant[]
  /** 5 most-important tokens — small table at the bottom */
  tokens: LiveTokenRow[]
  /** Optional layout hint for the canvas — 'row' (default) | 'column' | 'grid' */
  layout?: 'row' | 'column' | 'grid'
}

export function LiveComponentPage({ name, description, styleBlock, variants, tokens, layout = 'row' }: LiveComponentPageProps) {
  const flexDir = layout === 'column' ? 'flex-col' : 'flex-row'
  const wrap = layout === 'grid' ? 'flex-wrap' : layout === 'row' ? 'flex-wrap' : ''

  return (
    <article className="min-w-0 flex-1 max-w-[1120px]">
      {/* Page-scoped style block defining the production token values + component CSS */}
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />

      <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
      <h1 className="text-h1 text-chrome-text">{name}</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">{description}</p>

      {/* Visual section — full-width soft canvas */}
      <section className="mt-10 rounded-card border border-chrome-border bg-chrome-surface-raised overflow-hidden">
        <div className={'flex items-start gap-6 p-10 bg-[#f9fafb] ' + flexDir + ' ' + wrap}>
          {variants.map((v, i) => (
            <div key={i} className="flex flex-col items-start gap-2">
              {v.render}
              {v.label && <div className="text-[10px] font-mono text-chrome-text-subtlest">{v.label}</div>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-chrome-border bg-chrome-surface-sunken">
          <span className="text-[11px] text-chrome-text-subtlest">Copy the minimal CSS for any variant:</span>
          {variants.map((v, i) => (
            <CopyCSSButton key={i} css={v.css} label={v.label ? `Copy: ${v.label}` : `Copy variant ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Tokens — minimal 5-row table */}
      {tokens.length > 0 && (
        <section className="mt-8">
          <h2 className="text-overline text-chrome-text-subtlest mb-2">Key tokens</h2>
          <div className="overflow-hidden rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-2.5 text-overline text-chrome-text-subtlest">Property</th>
                  <th className="text-left p-2.5 text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-2.5 text-overline text-chrome-text-subtlest">Value</th>
                </tr>
              </thead>
              <tbody>
                {tokens.slice(0, 5).map((t, i) => (
                  <tr key={i} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-2.5 text-chrome-text">{t.property}</td>
                    <td className="p-2.5 font-mono text-chrome-text-subtle">{t.token}</td>
                    <td className="p-2.5 font-mono text-chrome-text-subtle">{t.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </article>
  )
}
