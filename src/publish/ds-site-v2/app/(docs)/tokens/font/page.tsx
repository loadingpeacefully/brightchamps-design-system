import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { typographyTokens } from '@/lib/tokens.generated'

export const metadata: Metadata = {
  title: 'Tokens · Font',
  description: 'Machine-readable typography token reference. Family, size, weight, line-height for every canonical text style.',
}

const TOC = [
  { id: 'overview', label: 'Overview',  level: 2 as const },
  { id: 'display',  label: 'Display',   level: 2 as const },
  { id: 'heading',  label: 'Heading',   level: 2 as const },
  { id: 'body',     label: 'Body',      level: 2 as const },
  { id: 'caption',  label: 'Caption',   level: 2 as const },
]

const ROLES = ['display', 'heading', 'body', 'caption'] as const

function FontTable({ role }: { role: typeof ROLES[number] }) {
  const rows = typographyTokens.filter(t => t.role === role)
  if (rows.length === 0) return null
  return (
    <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Size</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Weight</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Line height</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS variable</th>
            <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Uses</th>
            <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Sample</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(t => (
            <tr key={t.name} className="border-b border-chrome-border last:border-b-0">
              <td className="p-3 font-mono text-[12.5px] text-chrome-text">{t.name}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{t.size}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{t.weight}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{t.lineHeight ? Math.round(t.lineHeight * 100) / 100 : '—'}</td>
              <td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">{`var(${t.cssVar})`}</td>
              <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{t.usageCount.toLocaleString()}</td>
              <td className="p-3" style={{
                fontFamily: `'${t.family}', sans-serif`,
                fontSize: Math.min(t.size, 24),
                fontWeight: t.weight,
                lineHeight: 1.2,
                color: 'var(--chrome-text)',
              }}>Aa Bb 0123</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TokensFontPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference · Tokens</div>
        <h1 className="text-h1 text-chrome-text">Font tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {typographyTokens.length} canonical typography tokens. Family is Nunito across the system; weight + size +
          line-height combine into named styles. For visual specimens see <a className="text-chrome-accent hover:underline" href="/foundations/typography/">Foundations · Typography</a>.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Total tokens</div>
              <div className="text-[28px] font-bold text-chrome-text">{typographyTokens.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Family</div>
              <div className="text-[18px] font-bold text-chrome-text" style={{ fontFamily: 'Nunito, sans-serif' }}>Nunito</div>
              <div className="text-[11px] text-chrome-text-subtlest">Heading + body</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Sizes</div>
              <div className="text-[28px] font-bold text-chrome-text">10</div>
              <div className="text-[11px] text-chrome-text-subtlest">10–56px scale</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Weights</div>
              <div className="text-[28px] font-bold text-chrome-text">5</div>
              <div className="text-[11px] text-chrome-text-subtlest">400 / 500 / 600 / 700 / 800</div>
            </div>
          </div>
        </section>

        <section id="display" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Display</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Largest type — landing heroes, marketing.</p>
          <FontTable role="display" />
        </section>

        <section id="heading" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Heading</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Section + page hierarchy. Weight 600–800.</p>
          <FontTable role="heading" />
        </section>

        <section id="body" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Body</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Default reading sizes. Weight 400–500.</p>
          <FontTable role="body" />
        </section>

        <section id="caption" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Caption</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Secondary, helper, and metadata text.</p>
          <FontTable role="caption" />
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
