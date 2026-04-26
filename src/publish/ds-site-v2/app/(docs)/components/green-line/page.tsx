import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'GreenLine',
  description: 'Thin accent line used as separator or success indicator. Variants, states, and token mapping.',
}

const TOC = [
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'states',   label: 'States',        level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'code',     label: 'Usage',         level: 2 as const },
  { id: 'a11y',     label: 'Accessibility', level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Color (default)',     token: 'color/success/500', cssVar: '--color-success-500', value: '#00B67A' },
  { property: 'Color (subtle)',      token: 'color/success/300', cssVar: '--color-success-300', value: '#24c26e' },
  { property: 'Color (disabled)',    token: 'color/neutral/200', cssVar: '--color-neutral-200', value: '#e7e7e7' },
  { property: 'Height',              token: 'space/1',           cssVar: '--space-1',           value: '4px' },
  { property: 'Height (compact)',    token: 'space/0-5',         cssVar: '--space-0-5',         value: '2px' },
  { property: 'Border radius',       token: 'radius/full',       cssVar: '--radius-full',       value: '9999px' },
  { property: 'Margin (above)',      token: 'space/4',           cssVar: '--space-4',           value: '16px' },
  { property: 'Margin (below)',      token: 'space/4',           cssVar: '--space-4',           value: '16px' },
  { property: 'Width (default)',     token: 'space/full',        cssVar: '--space-full',        value: '100%' },
]

function DemoLine({ color = '#00B67A', height = 4, label }: { color?: string; height?: number; label: string }) {
  return (
    <div>
      <div className="text-overline text-chrome-text-subtlest mb-2">{label}</div>
      <div className="w-full rounded-full" style={{ background: color, height }} />
    </div>
  )
}

export default function GreenLinePage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">GreenLine</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          A thin accent line. Functions as a visual separator between sections or as a positive
          progress / completion indicator. The success-green sibling of ProgressLine.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Section dividers in dense layouts where a hairline is too quiet</li>
              <li>Visual emphasis under success messages or earned badges</li>
              <li>Decorative accent under section headings</li>
            </ul>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When not to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Quantitative progress (use ProgressLine — it carries percentage semantics)</li>
              <li>Error or warning context (the green color signals success)</li>
              <li>Long horizontal rules across the whole page (use a 1px neutral border)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          Discovered from student surface DOM audit. 49 elements across 7 pages.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Three intent levels by tone — default, subtle, disabled.</p>
          <div className="mt-6 grid gap-6">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <DemoLine color="#00B67A" height={4} label="Default — color/success/500" />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <DemoLine color="#24c26e" height={4} label="Subtle — color/success/300" />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <DemoLine color="#e7e7e7" height={4} label="Disabled — color/neutral/200" />
            </div>
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Tone × density.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Tone</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Default (4px)</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Compact (2px)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Default</td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#00B67A', height: 4 }} /></td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#00B67A', height: 2 }} /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Subtle</td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#24c26e', height: 4 }} /></td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#24c26e', height: 2 }} /></td>
                </tr>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Disabled</td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#e7e7e7', height: 4 }} /></td>
                  <td className="p-4 align-middle"><div className="w-full rounded-full" style={{ background: '#e7e7e7', height: 2 }} /></td>
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
            <pre className="font-mono text-[13px] text-chrome-text leading-relaxed whitespace-pre">{`<div
  role="presentation"
  aria-hidden="true"
  className="w-full rounded-full"
  style={{
    background: 'var(--color-success-500)',
    height: 'var(--space-1)',
    margin: 'var(--space-4) 0',
  }}
/>`}</pre>
          </div>
        </section>

        <section id="a11y" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Accessibility</h2>
          <ul className="mt-4 ml-4 list-disc text-body text-chrome-text leading-relaxed">
            <li>Mark as <code className="font-mono text-[12px]">role=&quot;presentation&quot;</code> with <code className="font-mono text-[12px]">aria-hidden=&quot;true&quot;</code> — it&apos;s decorative, not informational.</li>
            <li>If used as a section divider, prefer a real <code className="font-mono text-[12px]">{`<hr>`}</code> styled with these tokens — assistive tech then knows it&apos;s a separator.</li>
            <li>Color alone never carries meaning here. If you need success communication, pair the line with a check icon and a label.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
