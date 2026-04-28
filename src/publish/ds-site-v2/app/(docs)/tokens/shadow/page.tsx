import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Tokens · Shadow',
  description: 'Elevation token reference. Five shadow levels for surface raise / overlay / modal hierarchy.',
}

const TOC = [
  { id: 'overview', label: 'Overview',     level: 2 as const },
  { id: 'levels',   label: 'Five levels',  level: 2 as const },
  { id: 'usage',    label: 'Usage rules',  level: 2 as const },
]

const SHADOWS = [
  { token: 'shadow/none', value: 'none',                                                       z: 0,  use: 'Flat surfaces, paper-feel components' },
  { token: 'shadow/sm',   value: '0 1px 2px rgba(13, 29, 45, 0.06)',                            z: 1,  use: 'Cards on canvas — adds subtle separation' },
  { token: 'shadow/md',   value: '0 2px 4px rgba(13, 29, 45, 0.06), 0 4px 8px rgba(13, 29, 45, 0.08)', z: 2, use: 'Raised cards, hover states' },
  { token: 'shadow/lg',   value: '0 4px 8px rgba(13, 29, 45, 0.08), 0 12px 24px rgba(13, 29, 45, 0.12)', z: 3, use: 'Dropdowns, popovers, floating menus' },
  { token: 'shadow/xl',   value: '0 16px 32px rgba(13, 29, 45, 0.16), 0 32px 64px rgba(13, 29, 45, 0.20)', z: 4, use: 'Modals, dialogs, overlays' },
]

export default function TokensShadowPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Reference · Tokens</div>
        <h1 className="text-h1 text-chrome-text">Shadow tokens</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Five elevation levels — none → xl — establish the surface hierarchy. Each token combines two box-shadows
          (close + ambient) for a more grounded look. Disabled in dark mode by default; rebound to subtle borders.
        </p>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Levels</div>
              <div className="text-[28px] font-bold text-chrome-text">{SHADOWS.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Modes</div>
              <div className="text-[28px] font-bold text-chrome-accent">2</div>
              <div className="text-[11px] text-chrome-text-subtlest">light · dark</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Coverage</div>
              <div className="text-[28px] font-bold text-chrome-text">~50</div>
              <div className="text-[11px] text-chrome-text-subtlest">Components / surfaces</div>
            </div>
          </div>
        </section>

        <section id="levels" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Five levels</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {SHADOWS.map(s => (
              <article key={s.token} className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
                <div className="text-overline text-chrome-text-subtlest">z-{s.z}</div>
                <div className="mt-1 font-mono text-[14px] font-bold text-chrome-text">{s.token}</div>
                <div className="mt-5 mb-7 flex justify-center">
                  <div className="h-20 w-32 rounded-card bg-white" style={{ boxShadow: s.value === 'none' ? undefined : s.value, border: s.value === 'none' ? '1px solid var(--chrome-border)' : undefined }} />
                </div>
                <code className="mt-3 block font-mono text-[10.5px] text-chrome-text-subtle leading-tight break-all">{s.value}</code>
                <p className="mt-2 text-body-s text-chrome-text-subtle">{s.use}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="usage" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Usage rules</h2>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li>Use the smallest level that creates the needed separation. Too much shadow = floating mess.</li>
            <li>Pair shadow with a corresponding <code className="font-mono">surface/bg/raised</code> background — never shadow on a plain canvas without a contrast surface.</li>
            <li>Hover state typically raises by one level (sm → md, md → lg). Active / pressed drops by one.</li>
            <li>In dark mode, all shadow tokens map to subtle borders (<code className="font-mono">border/subtle</code>) — shadows are invisible on near-black surfaces.</li>
            <li>Modal scrim (<code className="font-mono">color/overlay/dark</code>) replaces shadow for full-screen overlays.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
