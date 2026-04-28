import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { TypeSpecimen } from '@/components/tokens/TypeSpecimen'
import { typographyTokens, typoSizes, typoWeights, metadata as tokenMeta } from '@/lib/tokens.generated'

export const metadata: Metadata = {
  title: 'Typography',
  description: 'Nunito type scale across six sizes and five weights — 17 canonical type tokens extracted from the student Figma file.',
}

const TOC = [
  { id: 'matrix',   label: 'Size × weight matrix', level: 2 as const },
  { id: 'display',  label: 'Display',   level: 2 as const },
  { id: 'heading',  label: 'Heading',   level: 2 as const },
  { id: 'body',     label: 'Body',      level: 2 as const },
  { id: 'caption',  label: 'Caption',   level: 2 as const },
]

const WEIGHT_LABELS: Record<number, string> = {
  400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extrabold',
}

const SIZE_LABELS: Record<number, string> = {
  10: 'xs', 12: 'sm', 14: 'md', 16: 'base', 18: 'lg', 20: 'xl',
}

const cellLookup = new Map<string, typeof typographyTokens[number]>()
for (const t of typographyTokens) {
  const key = `${t.size}|${t.weight}`
  const existing = cellLookup.get(key)
  if (!existing || t.usageCount > existing.usageCount) cellLookup.set(key, t)
}

function RoleSection({ role, label, description }: { role: string; label: string; description: string }) {
  const tokens = typographyTokens.filter(t => t.role === role)
  if (tokens.length === 0) return null
  return (
    <section id={role} className="mt-16 scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <h2 className="text-h2 text-chrome-text">{label}</h2>
        <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">
          {tokens.length}
        </span>
      </div>
      <p className="mt-2 max-w-[62ch] text-body text-chrome-text-subtle">{description}</p>
      <div className="mt-6 flex flex-col gap-3">
        {tokens.map(t => <TypeSpecimen key={t.name} token={t} />)}
      </div>
    </section>
  )
}

export default function TypographyPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Typography</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {tokenMeta.totalTypography} canonical type tokens. Nunito is the sole font family across{' '}
          {typoSizes.length} sizes and {typoWeights.length} weights. Empty cells in the matrix below
          are size/weight combinations seen in the DOM but not yet canonical.
        </p>

        <section id="matrix" className="mt-12 scroll-mt-24">
          <div className="flex items-baseline gap-3">
            <h2 className="text-h2 text-chrome-text">Size × weight matrix</h2>
            <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">
              {tokenMeta.totalTypography}
            </span>
          </div>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Rows: size. Columns: weight. Each filled cell is a canonical token rendered as a live Nunito specimen.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse bg-chrome-surface">
              <thead>
                <tr>
                  <th className="border-b border-r border-chrome-border bg-chrome-surface-sunken p-3 text-left text-overline text-chrome-text-subtlest w-[80px]" />
                  {typoWeights.map(w => (
                    <th key={w} className="border-b border-r border-chrome-border last:border-r-0 bg-chrome-surface-sunken p-3 text-left text-[13px] font-bold text-chrome-text min-w-[140px]">
                      {w}
                      <span className="block text-[10px] font-medium text-chrome-text-subtlest mt-0.5">
                        {WEIGHT_LABELS[w] ?? ''}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typoSizes.map(size => (
                  <tr key={size}>
                    <th className="border-b border-r border-chrome-border last:border-b-0 bg-chrome-surface-sunken p-3 text-left text-[13px] font-bold text-chrome-text whitespace-nowrap">
                      {size}px
                      <span className="block text-[10px] font-medium text-chrome-text-subtlest uppercase tracking-[0.06em] mt-0.5">
                        {SIZE_LABELS[size] ?? ''}
                      </span>
                    </th>
                    {typoWeights.map(weight => {
                      const token = cellLookup.get(`${size}|${weight}`)
                      if (!token) {
                        return (
                          <td key={weight} className="border-b border-r border-chrome-border last:border-r-0 last:border-b-0 p-4 bg-[repeating-linear-gradient(45deg,var(--chrome-surface)_0,var(--chrome-surface)_6px,var(--chrome-surface-sunken)_6px,var(--chrome-surface-sunken)_12px)]">
                            <span className="text-[11px] text-chrome-text-subtlest">—</span>
                          </td>
                        )
                      }
                      const lh = token.lineHeight ?? size * 1.2
                      return (
                        <td key={weight} className="border-b border-r border-chrome-border last:border-r-0 last:border-b-0 p-4 align-top">
                          <div
                            className="text-chrome-text mb-3"
                            style={{
                              fontFamily: `'${token.family}', sans-serif`,
                              fontSize: `${size}px`,
                              fontWeight: weight,
                              lineHeight: `${lh}px`,
                            }}
                          >
                            Aa
                          </div>
                          <div className="border-t border-dashed border-chrome-border pt-2">
                            <div className="font-mono text-[10.5px] font-semibold text-chrome-text mb-1">{token.name}</div>
                            <div className="flex gap-2 font-mono text-[10.5px] text-chrome-text-subtle">
                              <span>{size}/{weight}</span>
                              <span>{lh.toFixed(1)}lh</span>
                              <span>{token.usageCount.toLocaleString()} uses</span>
                            </div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <RoleSection
          role="display"
          label="Display"
          description="Large headings and hero text. Use sparingly — typically one per page or section. Size 20px and above."
        />
        <RoleSection
          role="heading"
          label="Heading"
          description="Section headings and subheadings. Weight 600+ at 16–18px. The backbone of page hierarchy."
        />
        <RoleSection
          role="body"
          label="Body"
          description="Running text, labels, descriptions, and form elements. Weight 400–500 at 14–16px."
        />
        <RoleSection
          role="caption"
          label="Caption"
          description="Metadata, timestamps, helper text, and small labels. Size 10–12px. Keep readable — our users include children."
        />

        <section className="mt-12 scroll-mt-24 rounded-card border border-chrome-border bg-chrome-surface-sunken p-4">
          <div className="text-overline text-chrome-text-subtlest mb-1">New tokens — 2026-04-28</div>
          <p className="text-body-s text-chrome-text">
            Source-extraction added these primitives + a new text style to the Figma library:
          </p>
          <ul className="mt-2 ml-4 list-disc text-body-s text-chrome-text space-y-1">
            <li><code className="font-mono">font/size/2xs</code> = 10px (118 uses in source — status pills, captions on every page)</li>
            <li><code className="font-mono">font/weight/black</code> = 900 (108 uses — emphatic numbers, score readouts)</li>
            <li><code className="font-mono">font/lineheight/2xs</code> = 14px (paired with the new 10px size at 1.4× ratio)</li>
            <li>
              New text style <strong>Caption/SM</strong> — Nunito Medium 10/14, bound to <code className="font-mono">semantic/typography/caption/sm/*</code>
              (6 sub-tokens, all alias-only)
            </li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
