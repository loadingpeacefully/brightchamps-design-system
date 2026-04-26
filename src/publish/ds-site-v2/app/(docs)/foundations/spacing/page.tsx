import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { Copy, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spacing',
  description: '4px base spacing scale for padding, margin, and gap across every BrightChamps surface.',
}

const TOC = [
  { id: 'scale',     label: 'Scale',               level: 2 as const },
  { id: 'reference', label: 'Component reference',  level: 2 as const },
  { id: 'guidelines', label: 'Guidelines',          level: 2 as const },
]

// TODO: Switch to tokens.generated.ts once spacing canonicalization is complete (see FINDING-006).
// For now, hardcoded from the designer's SpacingSection to match the approved 4px base scale.
const SPACING_TOKENS = [
  { name: 'spacing/1',  value: '4px',  px: 4,  rem: '0.25rem', uses: ['Icon-text gaps', 'Badge internal padding'] },
  { name: 'spacing/2',  value: '8px',  px: 8,  rem: '0.5rem',  uses: ['Small button padding', 'Tag spacing', 'Avatar gaps'] },
  { name: 'spacing/3',  value: '12px', px: 12, rem: '0.75rem', uses: ['Button padding', 'Input padding', 'List item gaps'] },
  { name: 'spacing/4',  value: '16px', px: 16, rem: '1rem',    uses: ['Card padding', 'Form field spacing', 'Default margins'] },
  { name: 'spacing/5',  value: '20px', px: 20, rem: '1.25rem', uses: ['Card content padding', 'Section spacing', 'Component gaps'] },
  { name: 'spacing/6',  value: '24px', px: 24, rem: '1.5rem',  uses: ['Large card padding', 'Header spacing', 'Modal padding'] },
  { name: 'spacing/8',  value: '32px', px: 32, rem: '2rem',    uses: ['Section padding', 'Page margins', 'Large card gaps'] },
  { name: 'spacing/10', value: '40px', px: 40, rem: '2.5rem',  uses: ['Dashboard sections', 'Page header padding', 'Hero spacing'] },
  { name: 'spacing/12', value: '48px', px: 48, rem: '3rem',    uses: ['Major sections', 'Page top/bottom spacing', 'Feature blocks'] },
  { name: 'spacing/16', value: '64px', px: 16, rem: '4rem',    uses: ['Landing sections', 'Major page dividers', 'Hero padding'] },
  { name: 'spacing/20', value: '80px', px: 80, rem: '5rem',    uses: ['Large hero sections', 'Major page sections'] },
  { name: 'spacing/24', value: '96px', px: 96, rem: '6rem',    uses: ['Jumbo sections', 'Landing page blocks'] },
]

const COMPONENT_REFERENCE = [
  { component: 'Learning Progress Card', padding: 'spacing/6 (24px)', gap: 'spacing/4 (16px)' },
  { component: 'Class Joining Card',     padding: 'spacing/6 (24px)', gap: 'spacing/5 (20px)' },
  { component: 'Primary Button',         padding: 'spacing/3 × spacing/6 (12×24px)', gap: 'spacing/2 (8px)' },
  { component: 'Dashboard Sections',     padding: 'spacing/8 (32px)', gap: 'spacing/6 (24px)' },
  { component: 'Lesson List Items',       padding: 'spacing/4 (16px)', gap: 'spacing/3 (12px)' },
  { component: 'Modal Content',          padding: 'spacing/6 (24px)', gap: 'spacing/5 (20px)' },
]

const MAX_PX = 96

function SpacingCard({ token }: { token: typeof SPACING_TOKENS[0] }) {
  return (
    <article className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5 hover:border-chrome-border-bold transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-[13px] font-semibold text-chrome-accent">{token.name}</div>
          <div className="text-[11px] text-chrome-text-subtlest mt-0.5">{token.rem}</div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[22px] font-bold text-chrome-text">{token.px}</span>
          <span className="text-[12px] font-semibold text-chrome-text-subtlest">px</span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-chrome-surface-sunken overflow-hidden mb-4">
        <div
          className="h-full rounded-full"
          style={{
            width: `${(token.px / MAX_PX) * 100}%`,
            background: 'var(--brand-primary, #4e3bc2)',
          }}
        />
      </div>
      <div>
        <div className="text-[10px] font-bold text-chrome-text-subtlest uppercase tracking-[0.06em] mb-1">Common uses</div>
        <ul className="m-0 p-0 list-none space-y-0.5">
          {token.uses.map(use => (
            <li key={use} className="text-[12px] text-chrome-text-subtle flex items-start gap-1.5">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-chrome-text-subtlest shrink-0" />
              {use}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function SpacingPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Spacing</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          A 4px base scale from spacing/1 (4px) to spacing/24 (96px). Use these tokens for
          all padding, margin, and gap values to maintain consistent rhythm across every surface.
        </p>

        <section id="scale" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Scale</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            12 spacing tokens with proportional visual bars. Each token includes pixel value, rem equivalent,
            and recommended component uses from the designer&apos;s system.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPACING_TOKENS.map(t => <SpacingCard key={t.name} token={t} />)}
          </div>
        </section>

        <section id="reference" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Component reference</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Recommended spacing for common student app components.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Padding</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Gap</th>
                </tr>
              </thead>
              <tbody>
                {COMPONENT_REFERENCE.map(c => (
                  <tr key={c.component} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-semibold text-chrome-text">{c.component}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{c.padding}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{c.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="guidelines" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Guidelines</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-l-4 border-l-[var(--brand-green)] border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-[12px] font-bold text-[#16803c] uppercase tracking-[0.06em] mb-2">Do</div>
              <ul className="m-0 p-0 list-none space-y-1.5 text-body-s text-chrome-text">
                <li>Use spacing tokens for all padding, margin, and gap values</li>
                <li>Prefer spacing/4 (16px) as the default card padding</li>
                <li>Use spacing/2 (8px) for tight inline layouts like tag groups</li>
                <li>Scale up proportionally — spacing/6 for sections, spacing/8 for page-level</li>
              </ul>
            </div>
            <div className="rounded-card border border-l-4 border-l-[var(--brand-red)] border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-[12px] font-bold text-[#a31836] uppercase tracking-[0.06em] mb-2">Don&apos;t</div>
              <ul className="m-0 p-0 list-none space-y-1.5 text-body-s text-chrome-text">
                <li>Don&apos;t use arbitrary pixel values — always use a spacing token</li>
                <li>Don&apos;t use spacing/1 (4px) for component padding — too tight for touch targets</li>
                <li>Don&apos;t mix pixel and rem values in the same layout context</li>
                <li>Don&apos;t use spacing/24 (96px) inside cards — reserve for page-level sections</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
