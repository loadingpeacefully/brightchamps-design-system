import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Landing hero pattern',
  description: '6 course-vertical hero variants composed from headline + sub-copy + CTA + course-themed art. Token-driven per vertical.',
}

const TOC = [
  { id: 'shape',     label: 'Shape',         level: 2 as const },
  { id: 'verticals', label: 'Six verticals', level: 2 as const },
  { id: 'tokens',    label: 'Token composition', level: 2 as const },
  { id: 'do-dont',   label: 'Do / Don\'t',   level: 2 as const },
]

const VERTICALS = [
  { name: 'AI',         token: 'course/ai',         hue: '#7453d7', tag: 'AI for Kids' },
  { name: 'Coding',     token: 'course/coding',     hue: '#3a86ff', tag: 'Coding for Kids' },
  { name: 'Maths',      token: 'course/maths',      hue: '#11ac69', tag: 'Math Champ' },
  { name: 'Robotics',   token: 'course/robotics',   hue: '#ff7c35', tag: 'Robotics Lab' },
  { name: 'Finance',    token: 'course/finance',    hue: '#54bab9', tag: 'Money for Kids' },
  { name: 'Literature', token: 'course/literature', hue: '#a31836', tag: 'Reading Adventure' },
]

export default function LandingHeroPattern() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Patterns</div>
        <h1 className="text-h1 text-chrome-text">Landing hero</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The marketing pattern that opens every course landing page. One shape, six course-themed skins. Each
          vertical recolors the same composition via the <code className="font-mono">course/*</code> semantic
          tokens — never hand-painted.
        </p>

        <section id="shape" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Shape</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Slot</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token binding</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">eyebrow</td><td className="p-3 text-chrome-text">Course tag (capsule)</td><td className="p-3 font-mono text-chrome-text-subtle">surface = course/[v]/50, text = course/[v]/900</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">headline</td><td className="p-3 text-chrome-text">font/heading/xxlarge (40px)</td><td className="p-3 font-mono text-chrome-text-subtle">text/default</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">subcopy</td><td className="p-3 text-chrome-text">font/body/large (18px)</td><td className="p-3 font-mono text-chrome-text-subtle">text/muted</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">cta</td><td className="p-3 text-chrome-text">Button (variant=contained)</td><td className="p-3 font-mono text-chrome-text-subtle">surface = course/[v]/500, text = neutral/100</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">secondaryCta</td><td className="p-3 text-chrome-text">Button (variant=outlined)</td><td className="p-3 font-mono text-chrome-text-subtle">border = course/[v]/500, text = course/[v]/900</td></tr>
                <tr className="border-b border-chrome-border last:border-b-0"><td className="p-3 font-mono">heroArt</td><td className="p-3 text-chrome-text">Vertical-specific illustration</td><td className="p-3 font-mono text-chrome-text-subtle">bg fade = course/[v]/50</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="verticals" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Six verticals</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Same shape, six skins. The course token swaps in via the <code className="font-mono">data-course</code>
            attribute on the hero root — no per-vertical CSS.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {VERTICALS.map(v => (
              <div key={v.name} className="rounded-card border border-chrome-border bg-chrome-surface-raised overflow-hidden">
                <div className="px-4 py-5" style={{ background: `${v.hue}15` }}>
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]" style={{ background: `${v.hue}30`, color: v.hue }}>
                    {v.tag}
                  </div>
                  <h3 className="mt-2 text-[20px] font-extrabold leading-tight text-chrome-text">Build a future in {v.name.toLowerCase()}.</h3>
                  <p className="mt-1.5 text-[12.5px] text-chrome-text-subtle leading-snug max-w-[36ch]">Live classes, gamified progression, real projects.</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" className="rounded-full px-3 py-1.5 text-[11.5px] font-bold text-white" style={{ background: v.hue }}>Start free trial</button>
                    <button type="button" className="rounded-full border-2 px-3 py-1 text-[11.5px] font-bold" style={{ borderColor: v.hue, color: v.hue }}>See curriculum</button>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-chrome-border">
                  <div className="font-mono text-[10.5px] text-chrome-text-subtle">data-course=&quot;{v.name.toLowerCase()}&quot;</div>
                  <div className="font-mono text-[10.5px] text-chrome-text-subtlest">{v.token}/&#123;50,500,900&#125;</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tokens" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token composition</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Each vertical owns three semantic tokens (50 / 500 / 900). The hero composition references those
            three via CSS custom properties scoped to the surface root:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-card border border-chrome-border bg-chrome-surface-sunken p-4 font-mono text-[12px] text-chrome-text leading-relaxed">{`[data-course="ai"]       { --course-50: var(--color-course-ai-50);       --course-500: var(--color-course-ai-500);       --course-900: var(--color-course-ai-900); }
[data-course="coding"]   { --course-50: var(--color-course-coding-50);   --course-500: var(--color-course-coding-500);   --course-900: var(--color-course-coding-900); }
[data-course="maths"]    { --course-50: var(--color-course-maths-50);    --course-500: var(--color-course-maths-500);    --course-900: var(--color-course-maths-900); }
[data-course="robotics"] { --course-50: var(--color-course-robotics-50); --course-500: var(--color-course-robotics-500); --course-900: var(--color-course-robotics-900); }
[data-course="finance"]  { --course-50: var(--color-course-finance-50);  --course-500: var(--color-course-finance-500);  --course-900: var(--color-course-finance-900); }
[data-course="literature"]{--course-50: var(--color-course-literature-50);--course-500: var(--course-literature-500);    --course-900: var(--color-course-literature-900); }`}</pre>
          <p className="mt-3 text-body-s text-chrome-text-subtle">
            The hero component then references <code className="font-mono">var(--course-50/500/900)</code> for the
            eyebrow, CTA, and gradient — agnostic of which vertical is rendered.
          </p>
        </section>

        <section id="do-dont" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Do / Don&apos;t</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-[#16803c] bg-[rgba(36,194,110,0.08)] p-4">
              <div className="text-overline text-[#16803c] mb-2">Do</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1.5">
                <li>Always set <code className="font-mono">data-course</code> on the hero root.</li>
                <li>Reference <code className="font-mono">var(--course-*)</code> CSS vars only inside the hero.</li>
                <li>Keep the headline ≤ 8 words; sub-copy ≤ 16 words.</li>
                <li>Use the contained CTA for primary signup; outlined for secondary action.</li>
              </ul>
            </div>
            <div className="rounded-card border border-[#a31836] bg-[rgba(240,41,77,0.04)] p-4">
              <div className="text-overline text-[#a31836] mb-2">Don&apos;t</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1.5">
                <li>Hardcode any course color (<code className="font-mono">#7453d7</code>, etc) — always alias the token.</li>
                <li>Mix two course themes in one hero — one vertical per surface.</li>
                <li>Use brand <code className="font-mono">primary/500</code> for the CTA — that&rsquo;s reserved for app chrome, not marketing.</li>
                <li>Skip the eyebrow tag — the course tag is a strong wayfinding signal on a long landing page.</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
