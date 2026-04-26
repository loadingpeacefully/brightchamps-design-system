import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { ArrowRight, Plus, Loader2 } from 'lucide-react'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Button',
  description: 'Button component documentation with variants, states, and token mapping. Template for all component pages.',
}

const TOC = [
  { id: 'variants',  label: 'Variants',       level: 2 as const },
  { id: 'states',    label: 'States',          level: 2 as const },
  { id: 'tokens',    label: 'Token mapping',   level: 2 as const },
  { id: 'code',      label: 'Usage',           level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Background (Primary)',  token: 'color/primary/500',   cssVar: '--color-primary-500',   value: '#4e3bc2' },
  { property: 'Background (Secondary)', token: 'color/secondary/500', cssVar: '--color-secondary-500', value: '#FFCE00' },
  { property: 'Background (Hover)',    token: 'color/primary/600',   cssVar: '--color-primary-600',   value: '#3f2eae' },
  { property: 'Text (Primary)',        token: 'color/neutral/50',    cssVar: '--color-neutral-50',    value: '#F9FAFB' },
  { property: 'Text (Secondary)',      token: 'color/neutral/900',   cssVar: '--color-neutral-900',   value: '#0D1D2D' },
  { property: 'Disabled bg',          token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#E7E7E7' },
  { property: 'Disabled text',        token: 'color/neutral/300',   cssVar: '--color-neutral-300',   value: '#BCC2CA' },
  { property: 'Padding (x)',          token: 'space/6',             cssVar: '--spacing-6',           value: '24px' },
  { property: 'Padding (y)',          token: 'space/3',             cssVar: '--spacing-3',           value: '12px' },
  { property: 'Icon gap (sm)',        token: 'space/1',             cssVar: '--spacing-1',           value: '4px' },
  { property: 'Icon gap (md)',        token: 'space/2',             cssVar: '--spacing-2',           value: '8px' },
  { property: 'Border radius',        token: 'radius/full',         cssVar: '--radius-full',         value: '100px' },
  { property: 'Font family',          token: 'font/family/primary', cssVar: '--font-family-primary', value: 'Nunito' },
  { property: 'Font weight',          token: 'font/weight/semibold', cssVar: '--font-weight-semibold', value: '600' },
  { property: 'Font size (md)',       token: 'font/body/md',        cssVar: '--font-size-body-md',   value: '16px' },
]

function DemoButton({ variant, label, disabled, loading, size = 'md' }: {
  variant: 'primary' | 'secondary' | 'ghost'
  label: string
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors'
  const sizeClass = size === 'sm' ? 'px-4 py-2 text-[14px]' : size === 'lg' ? 'px-8 py-4 text-[18px]' : 'px-6 py-3 text-[16px]'
  const variantClass =
    variant === 'primary'
      ? disabled ? 'bg-[#E7E7E7] text-[#BCC2CA] cursor-not-allowed' : 'bg-[#4e3bc2] text-white hover:bg-[#3f2eae]'
      : variant === 'secondary'
        ? disabled ? 'bg-[#E7E7E7] text-[#BCC2CA] cursor-not-allowed' : 'bg-[#FFCE00] text-[#0D1D2D] hover:bg-[#e6b800]'
        : disabled ? 'text-[#BCC2CA] cursor-not-allowed' : 'text-[#4e3bc2] hover:bg-[rgba(78,59,194,0.08)]'
  return (
    <button type="button" disabled={disabled} className={`${base} ${sizeClass} ${variantClass}`}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {label}
    </button>
  )
}

export default function ButtonPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">Button</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Three distinct button types for different action hierarchies. Use Primary for the main CTA,
          Secondary for supporting actions, and Ghost for tertiary or low-emphasis actions.
        </p>

        <div className="mt-4 rounded-card border border-l-4 border-l-chrome-accent border-chrome-border bg-chrome-accent-subtle p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-chrome-accent" />
            <p className="text-body-s text-chrome-text">
              <strong>Token names shown are the proposed standard</strong> (TDR-0001 pending).
              Current CSS variables are still in <code className="font-mono text-[12px]">--bc-color-001</code> format.
              Both will coexist during the 90-day deprecation window.
            </p>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          This page is the template. All other component pages follow this pattern:
          variants → states → token mapping → code snippet.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Three button types for action hierarchy.</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Primary</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Main call-to-action. Use sparingly — one per section.</p>
              <div className="flex flex-col items-start gap-3">
                <DemoButton variant="primary" label="Primary" size="sm" />
                <DemoButton variant="primary" label="Primary" />
                <DemoButton variant="primary" label="Primary" size="lg" />
              </div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Secondary</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Supporting action. Pair with Primary for hierarchy.</p>
              <div className="flex flex-col items-start gap-3">
                <DemoButton variant="secondary" label="Secondary" size="sm" />
                <DemoButton variant="secondary" label="Secondary" />
                <DemoButton variant="secondary" label="Secondary" size="lg" />
              </div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Ghost</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Minimal weight. Tertiary actions or inline links.</p>
              <div className="flex flex-col items-start gap-3">
                <DemoButton variant="ghost" label="Ghost" size="sm" />
                <DemoButton variant="ghost" label="Ghost" />
                <DemoButton variant="ghost" label="Ghost" size="lg" />
              </div>
            </div>
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Button behavior across interaction states.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">State</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Primary</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Secondary</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Ghost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Default</td>
                  <td className="p-4"><DemoButton variant="primary" label="Primary" /></td>
                  <td className="p-4"><DemoButton variant="secondary" label="Secondary" /></td>
                  <td className="p-4"><DemoButton variant="ghost" label="Ghost" /></td>
                </tr>
                <tr className="border-b border-chrome-border">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Disabled</td>
                  <td className="p-4"><DemoButton variant="primary" label="Primary" disabled /></td>
                  <td className="p-4"><DemoButton variant="secondary" label="Secondary" disabled /></td>
                  <td className="p-4"><DemoButton variant="ghost" label="Ghost" disabled /></td>
                </tr>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">Loading</td>
                  <td className="p-4"><DemoButton variant="primary" label="Loading…" loading /></td>
                  <td className="p-4"><DemoButton variant="secondary" label="Loading…" loading /></td>
                  <td className="p-4"><DemoButton variant="ghost" label="Loading…" loading /></td>
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
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Minimum viable implementation using the token system.
          </p>
          <div className="mt-4 rounded-card border border-chrome-border bg-chrome-surface-sunken p-5 overflow-x-auto">
            <pre className="font-mono text-[13px] text-chrome-text leading-relaxed whitespace-pre">{`<button
  className="
    bg-[var(--color-primary-500)]
    text-[var(--color-neutral-50)]
    px-[var(--spacing-6)]
    py-[var(--spacing-3)]
    rounded-full
    font-semibold
    text-[var(--font-size-body-md)]
    hover:bg-[var(--color-primary-600)]
    disabled:bg-[var(--color-neutral-200)]
    disabled:text-[var(--color-neutral-300)]
  "
>
  Primary Action
</button>`}</pre>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
