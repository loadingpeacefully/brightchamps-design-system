import type { Metadata } from 'next'
import { ColorSwatch } from '@/components/tokens/ColorSwatch'
import { BulkExport } from '@/components/tokens/BulkExport'
import { RightTOC } from '@/components/chrome/RightTOC'
import { colors, colorsByCategory, metadata as tokenMeta, type ColorToken, type FeedbackRole } from '@/lib/tokens.generated'

export const metadata: Metadata = {
  title: 'Color',
  description: 'Every canonical BrightChamps color, grouped into six semantic roles: brand, neutral, feedback, overlay, surface, and interactive. Extracted from Figma, verified against production DOM.',
}

const TOC = [
  { id: 'brand',       label: 'Brand',       level: 2 as const },
  { id: 'neutral',     label: 'Neutral',     level: 2 as const },
  { id: 'feedback',    label: 'Feedback',    level: 2 as const },
  { id: 'feedback-danger',  label: 'Danger',  level: 3 as const },
  { id: 'feedback-warning', label: 'Warning', level: 3 as const },
  { id: 'feedback-success', label: 'Success', level: 3 as const },
  { id: 'feedback-info',    label: 'Info',    level: 3 as const },
  { id: 'surface',     label: 'Surface',     level: 2 as const },
  { id: 'overlay',     label: 'Overlay',     level: 2 as const },
  { id: 'interactive', label: 'Interactive', level: 2 as const },
  { id: 'course',      label: 'Course verticals', level: 2 as const },
]

function Section({ id, title, description, tokens, children }: {
  id: string
  title: string
  description: string
  tokens?: ColorToken[]
  children?: React.ReactNode
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24 first:mt-10">
      <div className="flex items-baseline gap-3">
        <h2 className="text-h2 text-chrome-text">{title}</h2>
        {tokens && (
          <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">
            {tokens.length}
          </span>
        )}
      </div>
      <p className="mt-2 max-w-[62ch] text-body text-chrome-text-subtle">{description}</p>
      {tokens && (
        <div className="mt-6 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {tokens.map(t => <ColorSwatch key={t.name} token={t} />)}
        </div>
      )}
      {children}
    </section>
  )
}

const ROLE_DESCRIPTIONS: Record<FeedbackRole, string> = {
  danger:  'Errors, destructive actions, validation failures. Reserved for non-ambiguous negative states.',
  warning: 'Cautionary states. Signals attention without blocking the user.',
  success: 'Positive confirmation, completion states, achievement markers.',
  info:    'Neutral notifications and general-purpose accents. Use sparingly to avoid blue-on-blue UI.',
}

function FeedbackSubSection({ role, tokens }: { role: FeedbackRole; tokens: ColorToken[] }) {
  if (tokens.length === 0) return null
  return (
    <div id={`feedback-${role}`} className="mt-10 scroll-mt-24">
      <div className="flex items-baseline gap-3">
        <h3 className="text-h3 text-chrome-text capitalize">{role}</h3>
        <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">
          {tokens.length}
        </span>
      </div>
      <p className="mt-1 max-w-[62ch] text-body-s text-chrome-text-subtle">{ROLE_DESCRIPTIONS[role]}</p>
      <div className="mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {tokens.map(t => <ColorSwatch key={t.name} token={t} />)}
      </div>
    </div>
  )
}

export default function ColorPage() {
  const feedbackTotal =
    colorsByCategory.feedback.danger.length +
    colorsByCategory.feedback.warning.length +
    colorsByCategory.feedback.success.length +
    colorsByCategory.feedback.info.length

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Color</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {tokenMeta.totalColors} canonical colors across six semantic roles, extracted from the
          student Figma file and verified against live DOM. Frequency-ranked tokens come from the
          extractor; named tokens (<code className="font-mono text-[12.5px]">color/overlay/*</code>,
          {' '}<code className="font-mono text-[12.5px]">color/interactive/*</code>, etc.) were added
          through drift review.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-[12px]">
          <InfoChip label="Ledger" value={tokenMeta.ledgerLastBuilt.slice(0, 10)} />
          <InfoChip label="Total canonical" value={tokenMeta.totalCanonical.toLocaleString()} />
          <InfoChip label="Colors" value={tokenMeta.totalColors.toLocaleString()} />
        </div>
        <p className="mt-2 text-[11px] text-chrome-text-subtlest leading-snug max-w-[62ch]">
          {tokenMeta.totalCanonical.toLocaleString()} canonical tokens includes 145 spacing shorthand
          values (e.g. <code className="font-mono">'5px 0px'</code>) that are not usable as design
          tokens. Single-value spacing canonicals: 12.
        </p>
        <div className="mt-4">
          <BulkExport
            label={`${tokenMeta.totalColors} color`}
            cssContent={colors.map(c => `${c.cssVar}: ${c.value};`).join('\n')}
            jsonContent={JSON.stringify(colors.map(c => ({ name: c.name, value: c.value, category: c.category })), null, 2)}
          />
        </div>

        <div className="mt-8 rounded-card border border-chrome-border bg-chrome-surface-sunken p-4 text-[13px]">
          <div className="text-overline text-chrome-text-subtlest mb-1">Figma library — live</div>
          <p className="text-chrome-text">
            These tokens are now live in the BrightChamps Figma variable library
            (<code className="font-mono text-[12.5px]">8eNJf875iY9HISEsczDfOh</code>). <strong>444 variables across 12 collections</strong>,
            light + dark modes, 16 text styles, 5 effect styles, plus a new <strong>motion collection</strong> (durations + easings + 9 animation presets),
            and 20 production-verified component sets. Open the library to use them in your designs:
          </p>
          <p className="mt-2">
            <a
              className="text-chrome-accent hover:underline font-mono text-[12.5px]"
              href="https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/"
              target="_blank"
              rel="noreferrer"
            >
              figma.com/design/8eNJf875iY9HISEsczDfOh →
            </a>
          </p>
        </div>

        <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4 text-[13px]">
          <div className="text-overline text-[#8a5e00] mb-1">Open color drift — 12 tickets</div>
          <p className="text-chrome-text">
            Two new tickets surfaced during Tier 2 component build (2026-04-28):
          </p>
          <ul className="mt-2 ml-4 space-y-1 list-disc text-chrome-text">
            <li>
              <strong>DC-011</strong> · Danger button color: <code className="font-mono">#ff8480</code> production vs{' '}
              <code className="font-mono">#FF5C5C</code> design (ΔE ~4, medium severity).
            </li>
            <li>
              <strong>DC-012</strong> · Info button color: <code className="font-mono">#60bfbd</code> production vs{' '}
              <code className="font-mono">#33CCFF</code> design (ΔE ~25, <strong>HIGH severity</strong> — cyan vs teal, different hue family).
            </li>
          </ul>
          <p className="mt-2">
            <a className="text-chrome-accent hover:underline" href="/surfaces/#designer-conflicts">See all 19 conflict tickets →</a>
          </p>
        </div>

        <div className="mt-4 rounded-card border border-chrome-border bg-chrome-surface-sunken p-4 text-[13px]">
          <div className="text-overline text-chrome-text-subtlest mb-1">Extended neutrals (added 2026-04-28)</div>
          <p className="text-chrome-text">
            Source-extraction surfaced 8 widely-used grays that had no library tokens. Added as half-step variants to fill the scale:
          </p>
          <ul className="mt-2 ml-4 space-y-1 list-disc text-chrome-text">
            <li><code className="font-mono">color/neutral/150</code> = #e3e2e9 (21 uses)</li>
            <li><code className="font-mono">color/neutral/250</code> = #d9d9d9 (15 uses)</li>
            <li><code className="font-mono">color/neutral/350</code> = #bdbdbd (28 uses)</li>
            <li><code className="font-mono">color/neutral/450</code> = #8e8e8e (18 uses, <code className="font-mono">$text-disabled</code>)</li>
            <li><code className="font-mono">color/neutral/650</code> = #64717d (17 uses, <code className="font-mono">$notstarted-state-dark</code>)</li>
            <li><code className="font-mono">color/neutral/750</code> = #7d8892 (12 uses, <code className="font-mono">$text-gray</code>)</li>
            <li><code className="font-mono">color/neutral/850</code> = <strong>#384655</strong> (<strong>70 uses</strong> — biggest unmapped, DC-013)</li>
            <li><code className="font-mono">color/neutral/950</code> = #222a33 (45 uses — title near-black, DC-014)</li>
          </ul>
          <p className="mt-2 text-chrome-text">
            Extended primary purples: <code className="font-mono">primary/150</code> (#f5f3fc), <code className="font-mono">primary/250</code> (#8a78f9, DC-015),
            <code className="font-mono">primary/350</code> (#e1e2ff), <code className="font-mono">primary/450</code> (#4a3fb4, <strong>DC-018 — 5th brand purple</strong>).
            Extended secondary: <code className="font-mono">secondary/250</code> (#ffd02b), <code className="font-mono">secondary/350</code> (#ffc200).
            New surface: <code className="font-mono">color/surface/app-bg</code> (#f5f4fa) and semantic alias <code className="font-mono">surface/bg/app</code>.
          </p>
        </div>

        <Section
          id="brand"
          title="Brand"
          description="The BrightChamps identity — purples that define the product. Primary button backgrounds, selected navigation, brand moments. Everything else steps back so these can lead."
          tokens={colorsByCategory.brand}
        />

        <Section
          id="neutral"
          title="Neutral"
          description="Whites, grays, and near-blacks. Use for text, surfaces, borders, and structural elements. Ordered from lightest to darkest — treat as a continuous ramp, not discrete steps."
          tokens={colorsByCategory.neutral}
        />

        <Section
          id="feedback"
          title="Feedback"
          description={`Status and semantic colors across ${feedbackTotal} tokens. Sub-grouped by role to keep the narrative clear: danger / warning / success / info.`}
        >
          <FeedbackSubSection role="danger"  tokens={colorsByCategory.feedback.danger} />
          <FeedbackSubSection role="warning" tokens={colorsByCategory.feedback.warning} />
          <FeedbackSubSection role="success" tokens={colorsByCategory.feedback.success} />
          <FeedbackSubSection role="info"    tokens={colorsByCategory.feedback.info} />
        </Section>

        <Section
          id="surface"
          title="Surface"
          description="Tinted background colors for cards, containers, and page regions. Usually near-white with a brand-adjacent hue. Layer on top of the neutral ramp to build depth."
          tokens={colorsByCategory.surface}
        />

        <Section
          id="overlay"
          title="Overlay"
          description="Translucent colors for modals, scrims, and layered effects. Stored as 8-digit hex (#RRGGBBAA). Composite on top of any content."
          tokens={colorsByCategory.overlay}
        />

        <Section
          id="interactive"
          title="Interactive"
          description="Colors reserved for UI state — hover, active, selected. Semantic meaning for interaction, not decoration."
          tokens={colorsByCategory.interactive}
        />

        {colorsByCategory.course.length > 0 && (
          <Section
            id="course"
            title="Course verticals"
            description="Per-course identity colors for BrightChamps learning tracks. Three scales per course: 50 (surface), 500 (base), 900 (heading). Source: designer DS."
            tokens={colorsByCategory.course}
          />
        )}
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-chrome-border bg-chrome-surface-raised px-2.5 py-1 text-chrome-text-subtle">
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-text-subtlest">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-chrome-text">{value}</span>
    </span>
  )
}
