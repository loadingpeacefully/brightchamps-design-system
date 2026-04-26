import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { AccordionDemo } from './AccordionDemo'

export const metadata: Metadata = {
  title: 'Accordion',
  description: 'Expandable content sections. Variants, states, and token mapping.',
}

const TOC = [
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'states',   label: 'States',        level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'code',     label: 'Usage',         level: 2 as const },
  { id: 'a11y',     label: 'Accessibility', level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Background (default)',  token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
  { property: 'Background (hover)',    token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Background (active)',   token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Border',                token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Title text',            token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
  { property: 'Body text',             token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
  { property: 'Chevron icon',          token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
  { property: 'Padding (block)',       token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Padding (inline)',      token: 'space/4',             cssVar: '--space-4',             value: '16px' },
  { property: 'Gap (icon → title)',    token: 'space/2',             cssVar: '--space-2',             value: '8px' },
  { property: 'Border radius',         token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
  { property: 'Disabled opacity',      token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
]

export default function AccordionPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">Accordion</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Expandable content sections. Used for lesson lists, FAQ blocks, and any place where you want
          to give learners scannable headings with on-demand detail.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Long lesson or module listings where most rows stay collapsed</li>
              <li>FAQs and policy pages — multiple short answers under one shared topic</li>
              <li>Forms with rarely-changed advanced sections</li>
            </ul>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When not to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Critical content that must always be visible (write it inline)</li>
              <li>Single-section disclosures (use a tooltip or popover instead)</li>
              <li>Navigation between pages — that&apos;s a tree or a tab list</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          Discovered from student surface DOM audit. 98 elements across 7 pages — the most-used
          interactive component in the student app.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Two visual states. Open/closed is the entire shape of this component.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Collapsed</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Title only; chevron points down.</p>
              <AccordionDemo />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Expanded</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Title sticky, body revealed; chevron rotates.</p>
              <AccordionDemo initiallyOpen />
            </div>
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Behavior across interaction states.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">State</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Collapsed</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Expanded</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Default</td>
                  <td className="p-4"><AccordionDemo /></td>
                  <td className="p-4"><AccordionDemo initiallyOpen /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Hover</td>
                  <td className="p-4"><AccordionDemo hover /></td>
                  <td className="p-4"><AccordionDemo initiallyOpen hover /></td>
                </tr>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Disabled</td>
                  <td className="p-4"><AccordionDemo disabled /></td>
                  <td className="p-4"><AccordionDemo initiallyOpen disabled /></td>
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
            <pre className="font-mono text-[13px] text-chrome-text leading-relaxed whitespace-pre">{`const [open, setOpen] = useState(false)

<div
  className="w-full rounded-md border"
  style={{ borderColor: 'var(--color-neutral-200)' }}
>
  <button
    type="button"
    aria-expanded={open}
    onClick={() => setOpen(!open)}
    className="flex w-full items-center justify-between px-4 py-4 text-left"
    style={{
      background: open ? 'var(--color-neutral-200)' : 'var(--color-neutral-100)',
      color: 'var(--color-neutral-1400)',
    }}
  >
    <span className="font-semibold">Lesson 3 — Variables</span>
    <ChevronDown style={{ color: 'var(--color-neutral-600)' }} />
  </button>
  {open && (
    <div
      className="border-t px-4 py-4"
      style={{ borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)' }}
    >
      A variable is a named container for a value.
    </div>
  )}
</div>`}</pre>
          </div>
        </section>

        <section id="a11y" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Accessibility</h2>
          <ul className="mt-4 ml-4 list-disc text-body text-chrome-text leading-relaxed">
            <li>Trigger must be a <code className="font-mono text-[12px]">{`<button>`}</code> with <code className="font-mono text-[12px]">aria-expanded</code> reflecting open state and <code className="font-mono text-[12px]">aria-controls</code> pointing at the panel ID.</li>
            <li>Title text on neutral-100 background passes WCAG AA at 4.5:1 (#212121 on #ffffff = 16.0:1 actual).</li>
            <li>Keyboard: Enter / Space toggles the panel. Tab moves focus out — accordions do not trap.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
