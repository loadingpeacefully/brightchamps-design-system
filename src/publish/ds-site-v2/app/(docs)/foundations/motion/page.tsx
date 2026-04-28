import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Motion',
  description: 'Duration and easing tokens extracted from production CSS — 47 unique keyframes, 20 transition rules collapsed into a canonical motion system.',
}

const TOC = [
  { id: 'durations', label: 'Durations',   level: 2 as const },
  { id: 'easings',   label: 'Easings',     level: 2 as const },
  { id: 'presets',   label: 'Animation presets', level: 2 as const },
  { id: 'keyframes', label: 'Keyframe library',  level: 2 as const },
  { id: 'note',      label: 'Engineering migration note', level: 2 as const },
]

const DURATIONS = [
  { name: 'duration/instant', cssVar: '--motion-duration-instant', value: 0,    use: '—' },
  { name: 'duration/fast',    cssVar: '--motion-duration-fast',    value: 200,  use: 'Hover, focus, micro-interactions (33+ uses of 0.2s in source)' },
  { name: 'duration/base',    cssVar: '--motion-duration-base',    value: 300,  use: 'Default for state changes (27+ uses of 0.3s in source)' },
  { name: 'duration/slow',    cssVar: '--motion-duration-slow',    value: 500,  use: 'Page-level transitions, modals' },
  { name: 'duration/slower',  cssVar: '--motion-duration-slower',  value: 700,  use: 'Entrance animations like fadeInUp (5 uses)' },
  { name: 'duration/crawl',   cssVar: '--motion-duration-crawl',   value: 1500, use: 'Skeleton shimmer (13 uses), pulse (2 uses)' },
]

const EASINGS = [
  { name: 'easing/linear', cssVar: '--motion-easing-linear', value: 'linear',      use: 'Continuous loops (shimmer, spin)' },
  { name: 'easing/out',    cssVar: '--motion-easing-out',    value: 'ease',        use: 'Default for entrances and state changes (most-used)' },
  { name: 'easing/in-out', cssVar: '--motion-easing-in-out', value: 'ease-in-out', use: 'Symmetrical motion (fade-in-up, pulse)' },
  { name: 'easing/in',     cssVar: '--motion-easing-in',     value: 'ease-in',     use: 'Exits, dismissals' },
]

const PRESETS = [
  { name: 'shimmer',     duration: 'crawl (1500ms)',  easing: 'linear',      uses: '13 in source', usage: 'Skeleton loading on cards, lists, avatars' },
  { name: 'fade-in',     duration: 'base (300ms)',    easing: 'out',         uses: '8 in source',  usage: 'Modal/overlay entrance' },
  { name: 'fade-in-up',  duration: 'slower (700ms)',  easing: 'in-out',      uses: '5 in source',  usage: 'Card entrance, scroll-into-view reveals' },
  { name: 'slide-down',  duration: 'fast (200ms)',    easing: 'out',         uses: '4 in source',  usage: 'Dropdown, menu' },
  { name: 'slide-in',    duration: 'base (300ms)',    easing: 'out',         uses: '6 combined',   usage: 'Drawer, sidebar' },
  { name: 'scale-in',    duration: 'fast (200ms)',    easing: 'out',         uses: '2 in source',  usage: 'Pop-in (notifications)' },
  { name: 'star',        duration: 'slow (500ms)',    easing: 'in-out',      uses: '16 combined',  usage: 'StarRating component family (starFill / starRing / starStroke / starLine / star-fall-1)' },
  { name: 'pulse',       duration: 'crawl (1500ms)',  easing: 'in-out',      uses: '2 in source',  usage: 'Attention-getting subtle pulse' },
  { name: 'spin',        duration: 'crawl (1500ms)',  easing: 'linear',      uses: '2 in source',  usage: 'Loader spinners' },
]

const KEYFRAMES_FOUND = [
  ['fadeIn',                 8,  'core'],
  ['marquee',                5,  'core'],
  ['shimmer',                4,  'core'],
  ['slideIn',                4,  'core'],
  ['slideDown',              4,  'core'],
  ['starStroke',             4,  'star-rating family'],
  ['starRing',               4,  'star-rating family'],
  ['starLine',               4,  'star-rating family'],
  ['starFill',               4,  'star-rating family'],
  ['star-fall-1',            4,  'star-rating family'],
  ['steam',                  3,  'one-off'],
  ['slide',                  3,  'one-off'],
  ['successContainerSlideIn', 2, 'success state'],
  ['spin',                   2,  'core'],
  ['scaleIn',                2,  'core'],
  ['pulse',                  2,  'core'],
  ['fadeInUp',               2,  'core'],
  ['+ 27 single-use keyframes', 27, 'lockUnlock, crownWiggle, tadaAvatar, bubbleUp, etc.'],
]

export default function MotionPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Motion</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The motion system. Durations and easings come straight from production CSS — 47 unique <code className="font-mono">@keyframes</code> blocks
          collapsed into 9 canonical animation presets. Currently shipped to the Figma library
          (<code className="font-mono text-[12px]">8eNJf875iY9HISEsczDfOh</code>) as <code className="font-mono">primitives/motion</code> + <code className="font-mono">semantic/motion</code> collections.
        </p>

        <section id="durations" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Durations</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Six steps. Source production heavily favors 0.2s and 0.3s — captured as <code className="font-mono">fast</code> and <code className="font-mono">base</code>.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS var</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Value (ms)</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Usage</th>
                </tr>
              </thead>
              <tbody>
                {DURATIONS.map(d => (
                  <tr key={d.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{d.name}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{d.cssVar}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{d.value}</td>
                    <td className="p-3 text-chrome-text-subtle">{d.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="easings" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Easings</h2>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS var</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Value</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Usage</th>
                </tr>
              </thead>
              <tbody>
                {EASINGS.map(e => (
                  <tr key={e.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{e.name}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{e.cssVar}</td>
                    <td className="p-3 font-mono">{e.value}</td>
                    <td className="p-3 text-chrome-text-subtle">{e.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="presets" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Animation presets</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Each preset is two semantic variables: <code className="font-mono">animation/{'<name>'}/duration</code> + <code className="font-mono">animation/{'<name>'}/easing</code>.
            All alias to <code className="font-mono">primitives/motion</code> — change the duration or easing primitive, every preset that uses it updates.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Preset</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Duration</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Easing</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Source uses</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Usage</th>
                </tr>
              </thead>
              <tbody>
                {PRESETS.map(p => (
                  <tr key={p.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">animation/{p.name}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{p.duration}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{p.easing}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{p.uses}</td>
                    <td className="p-3 text-chrome-text-subtle">{p.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="keyframes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Keyframe library</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            47 unique <code className="font-mono">@keyframes</code> blocks live in production. Below: top blocks ranked by reuse + the count of single-use keyframes.
            The recommended canonical set is 9 (the presets above) — everything else should consolidate or stay as a one-off.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Keyframe</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Files</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Group</th>
                </tr>
              </thead>
              <tbody>
                {KEYFRAMES_FOUND.map(([name, count, group]) => (
                  <tr key={String(name)} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{String(name)}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{count}</td>
                    <td className="p-3 text-chrome-text-subtle">{String(group)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="note" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Engineering migration note</h2>
          <div className="mt-3 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4 text-[13px]">
            <div className="text-overline text-[#8a5e00] mb-1">Not yet in production CSS</div>
            <p className="text-chrome-text">
              These motion tokens are <strong>design intent</strong>. They exist in the Figma library but are NOT yet emitted as CSS variables in the dashboard repo.
              The engineering migration guide (<code className="font-mono">docs/engineering-migration-guide.md</code>) <strong>Step 6</strong> will add them as
              <code className="font-mono">--motion-duration-*</code> and <code className="font-mono">--motion-easing-*</code> custom properties, and codemod the
              ~20 transition rules + 20 animation rules to use the canonical durations/easings.
            </p>
            <p className="mt-2 text-chrome-text">
              Source state today: 20 transition rules across 4 different durations (0.2s, 0.3s, 0.5s, 1s). After codemod: 2 durations
              (<code className="font-mono">fast</code>, <code className="font-mono">base</code>) cover 95% of cases.
            </p>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
