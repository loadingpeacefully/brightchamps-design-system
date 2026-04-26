import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProgressLine',
  description: 'Horizontal progress bar for lessons and courses. Variants, states, and token mapping.',
}

const TOC = [
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'states',   label: 'States',        level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'code',     label: 'Usage',         level: 2 as const },
  { id: 'a11y',     label: 'Accessibility', level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Fill (in-progress)',  token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
  { property: 'Fill (completed)',    token: 'color/success/500',   cssVar: '--color-success-500',   value: '#00B67A' },
  { property: 'Track',               token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Height (default)',    token: 'space/2',             cssVar: '--space-2',             value: '8px' },
  { property: 'Height (compact)',    token: 'space/1',             cssVar: '--space-1',             value: '4px' },
  { property: 'Border radius',       token: 'radius/full',         cssVar: '--radius-full',         value: '9999px' },
  { property: 'Margin (block)',      token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Label text color',    token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
  { property: 'Disabled opacity',    token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
]

function DemoProgress({ pct, variant = 'in-progress', height = 'default' }: {
  pct: number
  variant?: 'in-progress' | 'completed' | 'default'
  height?: 'default' | 'compact'
}) {
  const fill =
    variant === 'completed'    ? '#00B67A' :
    variant === 'in-progress'  ? '#4e3bc2' :
    '#c3c2b3'
  const h = height === 'compact' ? 4 : 8
  return (
    <div className="w-full overflow-hidden rounded-full" style={{ background: '#e7e7e7', height: h }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: fill }} />
    </div>
  )
}

export default function ProgressLinePage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">ProgressLine</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Horizontal progress bar that shows lesson or course completion. Used wherever a learner has a
          quantifiable goal — lessons inside a course, modules inside a lesson, percentages on dashboards.
        </p>

        <div className="mt-4 rounded-card border-l-4 border-l-amber-500 border border-chrome-border bg-amber-50/40 dark:bg-amber-950/15 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-body-s text-chrome-text">
              <strong className="uppercase tracking-[0.04em] text-[12px] text-amber-700 dark:text-amber-400">Missing variants.</strong>{' '}
              Skipped (<code className="font-mono text-[12px]">#ff752c</code>) and Paused
              (<code className="font-mono text-[12px]">#3b9af5</code>) variants not documented. Completed fill shows
              <code className="font-mono text-[12px]"> #00B67A</code> but production ships
              <code className="font-mono text-[12px]"> #11ac69</code> (
              <a href="/surfaces/#designer-conflicts" className="text-chrome-accent underline underline-offset-4">DC-009</a>).
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Quantifiable progress toward a known goal</li>
              <li>Inside lesson cards, course detail pages, dashboard widgets</li>
              <li>When the percentage carries meaning (60% done is different from 65%)</li>
            </ul>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When not to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Indeterminate work (use a spinner instead)</li>
              <li>Streak counters or step indicators (use a stepper)</li>
              <li>Pure visual separators (use GreenLine)</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          Discovered from student surface DOM audit. 63 elements across 7 pages.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Three intent levels. Pick by meaning, not by the percentage value.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Default</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Empty / not started.</p>
              <DemoProgress pct={0} variant="default" />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">In progress</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Brand primary fill.</p>
              <DemoProgress pct={60} variant="in-progress" />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Completed</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Success green at 100%.</p>
              <DemoProgress pct={100} variant="completed" />
            </div>
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Behavior across interaction and density states.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">State</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Default density</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Compact density</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Default</td>
                  <td className="p-4"><DemoProgress pct={0}   variant="default" /></td>
                  <td className="p-4"><DemoProgress pct={0}   variant="default" height="compact" /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Active (60%)</td>
                  <td className="p-4"><DemoProgress pct={60}  variant="in-progress" /></td>
                  <td className="p-4"><DemoProgress pct={60}  variant="in-progress" height="compact" /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Completed</td>
                  <td className="p-4"><DemoProgress pct={100} variant="completed" /></td>
                  <td className="p-4"><DemoProgress pct={100} variant="completed" height="compact" /></td>
                </tr>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Empty</td>
                  <td className="p-4"><DemoProgress pct={0}   variant="default" /></td>
                  <td className="p-4"><DemoProgress pct={0}   variant="default" height="compact" /></td>
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
  role="progressbar"
  aria-valuenow={60}
  aria-valuemin={0}
  aria-valuemax={100}
  className="w-full h-[var(--space-2)] rounded-full overflow-hidden"
  style={{ background: 'var(--color-neutral-200)' }}
>
  <div
    className="h-full rounded-full transition-all"
    style={{
      width: '60%',
      background: 'var(--color-brand-primary)',
    }}
  />
</div>`}</pre>
          </div>
        </section>

        <section id="a11y" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Accessibility</h2>
          <ul className="mt-4 ml-4 list-disc text-body text-chrome-text leading-relaxed">
            <li>Always pair with a visible label or aria-label — the bar alone doesn&apos;t carry meaning.</li>
            <li>Set <code className="font-mono text-[12px]">role=&quot;progressbar&quot;</code> with <code className="font-mono text-[12px]">aria-valuenow</code>, <code className="font-mono text-[12px]">aria-valuemin</code>, <code className="font-mono text-[12px]">aria-valuemax</code>.</li>
            <li>Brand-primary fill on the neutral-200 track passes 4.5:1 WCAG AA at 8px height for non-text content.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
