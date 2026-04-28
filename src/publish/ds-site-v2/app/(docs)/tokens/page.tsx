import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Index of all 446 canonical tokens across 12 collections — color, typography, space, radius, shadow, motion.',
}

const TOC = [
  { id: 'overview',     label: 'Overview',         level: 2 as const },
  { id: 'collections',  label: 'Collections',      level: 2 as const },
  { id: 'naming',       label: 'Naming convention', level: 2 as const },
  { id: 'where',        label: 'Where to browse',  level: 2 as const },
]

const COLLECTIONS = [
  { name: 'primitives/color',     count: 79, modes: ['value'], note: 'Raw color palette: primary/secondary/neutral/success/warning/error/info + 6 course verticals + utility' },
  { name: 'primitives/dimension', count: 25, modes: ['value'], note: 'spacing/control-height/icon-size + chrome/* architecture (104/80/280/460/880/1440)' },
  { name: 'primitives/radius',    count: 24, modes: ['value'], note: 'Default + rounded + none scales × {sm/md/lg/xl/2xl/3xl/4xl/full}' },
  { name: 'primitives/typography', count: 32, modes: ['value'], note: 'family + 9 sizes + 6 weights + 9 line-heights + letter-spacing + paragraph-spacing' },
  { name: 'primitives/number',    count: 16, modes: ['value'], note: 'opacity (12-step) + stroke (4-step)' },
  { name: 'primitives/motion',    count: 10, modes: ['value'], note: '6 durations + 4 easings (added 2026-04-28)' },
  { name: 'semantic/color',       count: 95, modes: ['light', 'dark'], note: 'surface/bg/* · text/* · text/on/* · icon/* · border/* · course/*/{bg,bg/subtle,text,border}' },
  { name: 'semantic/typography',  count: 96, modes: ['value'], note: '15 styles × 6 sub-tokens (family/weight/size/line-height/letter-spacing/paragraph-spacing) + caption/sm' },
  { name: 'semantic/dimension',   count: 32, modes: ['value'], note: 'space/inset · space/stack · space/inline · space/section · chrome/*' },
  { name: 'semantic/radius',      count: 11, modes: ['default', 'rounded', 'no-corner-radius'], note: 'control/{sm,md,lg,xl} · container/{sm,md,lg,xl,2xl} · card · pill' },
  { name: 'semantic/number',      count: 6,  modes: ['value'], note: 'opacity/{disabled,hover,pressed} · stroke/{sm,md,lg}' },
  { name: 'semantic/motion',      count: 18, modes: ['value'], note: '9 animation presets × 2 sub-tokens (duration + easing)' },
]

export default function TokensIndex() {
  const total = COLLECTIONS.reduce((s, c) => s + c.count, 0)
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference</div>
        <h1 className="text-h1 text-chrome-text">Tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The canonical token system — <strong>{total} variables across 12 collections</strong> in the Figma library
          (<code className="font-mono text-[12.5px]">8eNJf875iY9HISEsczDfOh</code>). Every Figma variable has a paired
          CSS custom property exposed via the <code className="font-mono">var()</code> wrapper.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Total variables</div>
              <div className="text-[28px] font-bold text-chrome-text">{total}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Collections</div>
              <div className="text-[28px] font-bold text-chrome-accent">12</div>
              <div className="text-[11px] text-chrome-text-subtlest">6 primitive · 6 semantic</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Multi-mode</div>
              <div className="text-[28px] font-bold text-chrome-text">2</div>
              <div className="text-[11px] text-chrome-text-subtlest">semantic/color (light/dark) + semantic/radius (3 modes)</div>
            </div>
          </div>
        </section>

        <section id="collections" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Collections</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Collection</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Count</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Modes</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Contents</th>
                </tr>
              </thead>
              <tbody>
                {COLLECTIONS.map(c => (
                  <tr key={c.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{c.name}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{c.count}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle text-[12px]">{c.modes.join(' / ')}</td>
                    <td className="p-3 text-chrome-text-subtle">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="naming" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Naming convention</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Slash-separated Figma names map directly to kebab-cased CSS custom properties via the{' '}
            <code className="font-mono">var()</code> wrapper. The <strong>WEB code syntax</strong> is set on every variable so Figma Dev Mode
            shows the exact CSS reference.
          </p>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li><strong>Primitives</strong> use the type as a prefix: <code className="font-mono">var(--color-primary-500)</code>, <code className="font-mono">var(--radius-default-md)</code>, <code className="font-mono">var(--font-size-md)</code></li>
            <li><strong>Semantics</strong> are self-prefixed: <code className="font-mono">var(--surface-bg-default)</code>, <code className="font-mono">var(--text-brand)</code>, <code className="font-mono">var(--space-inset-md)</code>, <code className="font-mono">var(--radius-card)</code></li>
            <li><strong>Typography semantics</strong> get the <code className="font-mono">typography</code> prefix: <code className="font-mono">var(--typography-body-md-font-size)</code></li>
            <li><strong>Motion</strong>: <code className="font-mono">var(--motion-duration-fast)</code>, <code className="font-mono">var(--animation-shimmer-duration)</code></li>
          </ul>
        </section>

        <section id="where" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Where to browse</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['/foundations/color/', 'Color', 'All semantic colors with light/dark swatches + extended-neutrals callout + 19-ticket DC link'],
              ['/foundations/typography/', 'Typography', '15 text styles + size/weight/lineheight scales with Caption/SM (10px) callout'],
              ['/foundations/spacing/', 'Spacing', 'inset/stack/inline/section semantic scales'],
              ['/foundations/radius/', 'Radius', 'Three-mode primitive table + semantic mode-aware system + drift inventory'],
              ['/foundations/iconography/', 'Iconography', 'Designer icon library + production CDN icons (217 _ICON exports)'],
              ['/foundations/motion/', 'Motion', 'Duration + easing + 9 animation presets + 47 keyframe inventory'],
            ].map(([href, label, desc]) => (
              <a key={href} href={href} className="rounded-card border border-chrome-border bg-chrome-surface-raised hover:bg-chrome-surface-sunken p-4 transition-colors block">
                <div className="text-overline text-chrome-text-subtlest mb-1">Foundations</div>
                <div className="text-body-l font-bold text-chrome-text">{label}</div>
                <div className="mt-1 text-body-s text-chrome-text-subtle">{desc}</div>
              </a>
            ))}
          </div>

          <div className="mt-6 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4 text-[13px]">
            <div className="text-overline text-[#8a5e00] mb-1">Coming soon</div>
            <p className="text-chrome-text">
              An interactive token browser with search + copy + Claude-API-powered token-picker is on the roadmap (Tools section). For now,
              browse via the foundation pages above or open the Figma library directly.
            </p>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
