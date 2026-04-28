import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'For engineers',
  description: 'How to consume the BrightChamps token system in code, run the codemod, and adopt componentSpecs.ts.',
}

const TOC = [
  { id: 'install',     label: 'Install tokens.css',           level: 2 as const },
  { id: 'naming',      label: 'CSS variable naming',          level: 2 as const },
  { id: 'codemod',     label: 'Run the codemod',              level: 2 as const },
  { id: 'specs',       label: 'componentSpecs.ts',            level: 2 as const },
  { id: 'modes',       label: 'Light/dark mode wiring',       level: 2 as const },
  { id: 'motion',      label: 'Motion tokens',                level: 2 as const },
  { id: 'deprecate',   label: 'Deprecating components',       level: 2 as const },
]

export default function EngineersPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Get started</div>
        <h1 className="text-h1 text-chrome-text">For engineers</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          A 5-minute orientation for adopting the BrightChamps design system in the dashboard codebase. Covers the codemod,
          CSS-variable naming, componentSpecs.ts, and the deprecated-components plan.
        </p>

        <section id="install" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Install tokens.css</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            The DS publishes a CSS custom-property file at <code className="font-mono">src/publish/output/tokens.css</code>.
            It declares all 444 variables under <code className="font-mono">:root</code> for light mode and{' '}
            <code className="font-mono">[data-theme=&quot;dark&quot;]</code> for dark.
          </p>
          <pre className="mt-3 rounded-card border border-chrome-border bg-chrome-surface-sunken p-3 text-[12px] font-mono text-chrome-text-subtle overflow-x-auto">{`// In your app entry (e.g. _app.tsx):
import '@brightchamps/ds-tokens/tokens.css'

// Then in any component:
.button {
  background: var(--surface-bg-brand);
  color: var(--text-on-brand);
  padding: var(--space-inset-sm) var(--space-inset-2xl);
  border-radius: var(--radius-pill);
}`}</pre>
        </section>

        <section id="naming" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">CSS variable naming</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Slash-separated Figma names become hyphenated CSS custom properties. The library sets the <strong>WEB code syntax</strong> on every variable:
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Figma variable</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS custom property</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['primitives/color :: primary/500', 'var(--color-primary-500)'],
                  ['semantic/color :: surface/bg/default', 'var(--surface-bg-default)'],
                  ['semantic/color :: text/brand', 'var(--text-brand)'],
                  ['semantic/dimension :: space/inset/md', 'var(--space-inset-md)'],
                  ['semantic/typography :: body/md/font-size', 'var(--typography-body-md-font-size)'],
                  ['semantic/radius :: radius/card', 'var(--radius-card)'],
                  ['primitives/motion :: duration/fast', 'var(--motion-duration-fast)'],
                ].map(([f, c]) => (
                  <tr key={f} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-chrome-text">{f}</td>
                    <td className="p-3 font-mono text-chrome-accent">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="codemod" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Run the codemod</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            The migration guide at <code className="font-mono">docs/engineering-migration-guide.md</code> has 25 sed-based codemods grouped into steps:
          </p>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li><strong>Steps 0–3</strong>: zero visual change — replaces literal hex with CSS vars at canonical sites only.</li>
            <li><strong>Step 4</strong>: brand-purple consolidation — <strong>BLOCKED on DC-005 sign-off</strong> (5+ way conflict). Touches ~138 files.</li>
            <li><strong>Step 5</strong>: success/error/info green/red/blue consolidation. Mostly safe but verify per-screen.</li>
            <li><strong>Step 6</strong>: motion tokens (duration + easing CSS vars). Adds new vars; doesn't touch existing transitions.</li>
            <li><strong>Step 7</strong>: deprecate parallel implementations (legacy Button vs newDashboard Button — see <a className="text-chrome-accent hover:underline" href="/components/deprecated/">deprecated components</a>).</li>
          </ul>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Run each step in its own PR. Visual regression check after each.
          </p>
        </section>

        <section id="specs" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">componentSpecs.ts</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            <code className="font-mono">src/publish/ds-site-v2/lib/componentSpecs.ts</code> is the machine-readable source of truth for every documented component
            (65+ entries). It powers the AI generator at <a className="text-chrome-accent hover:underline" href="/tools/generate/">/tools/generate</a> and every <code className="font-mono">/components/&lt;slug&gt;/</code> spec page.
          </p>
          <pre className="mt-3 rounded-card border border-chrome-border bg-chrome-surface-sunken p-3 text-[12px] font-mono text-chrome-text-subtle overflow-x-auto">{`// Example: import a spec at runtime
import { componentSpecs } from '@/lib/componentSpecs'

const buttonSpec = componentSpecs.find(c => c.slug === 'button')
console.log(buttonSpec.tokens)  // [{ property, token, cssVar, value }, ...]
console.log(buttonSpec.verificationStatus)  // 'verified'`}</pre>
        </section>

        <section id="modes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Light/dark mode wiring</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            The CSS custom properties are emitted under both selectors:
          </p>
          <pre className="mt-3 rounded-card border border-chrome-border bg-chrome-surface-sunken p-3 text-[12px] font-mono text-chrome-text-subtle overflow-x-auto">{`:root {
  --surface-bg-default: #ffffff;
  --text-default: #0d1d2d;
  /* light-mode aliases */
}

[data-theme="dark"] {
  --surface-bg-default: #1d2d3d;
  --text-default: #f9fafb;
  /* dark-mode aliases for the same semantic tokens */
}`}</pre>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Set <code className="font-mono">data-theme=&quot;dark&quot;</code> on <code className="font-mono">&lt;html&gt;</code> or any subtree to flip modes.
          </p>
        </section>

        <section id="motion" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Motion tokens</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            New 2026-04-28: motion tokens are available as CSS custom properties.
          </p>
          <pre className="mt-3 rounded-card border border-chrome-border bg-chrome-surface-sunken p-3 text-[12px] font-mono text-chrome-text-subtle overflow-x-auto">{`.button {
  transition:
    background var(--motion-duration-fast) var(--motion-easing-out),
    transform   var(--motion-duration-fast) var(--motion-easing-out);
}

@keyframes shimmer {
  0%   { background-position: 0 0; }
  100% { background-position: -200% 0; }
}

.skeleton {
  animation: shimmer
    var(--animation-shimmer-duration)
    var(--animation-shimmer-easing)
    infinite;
}`}</pre>
        </section>

        <section id="deprecate" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Deprecating components</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            See <a className="text-chrome-accent hover:underline" href="/components/deprecated/">/components/deprecated</a> for the full list. <strong>Don't delete on grep evidence alone</strong> — components used via dynamic imports
            or barrel files may show 0 imports but still be live. Run a build with dead-code reporting first.
          </p>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Known duplicates (Button, Card, ProgressBar, SideBarPopup, Gap, ShowStarRating, DropDown, EditContactInformation, ConfirmationModal, CardImage)
            need a per-pair audit + deprecation decision before consolidation. DC-021 and DC-028 in the conflict ledger track these.
          </p>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
