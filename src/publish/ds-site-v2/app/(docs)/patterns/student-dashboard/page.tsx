import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Student dashboard pattern',
  description: 'How chrome + content + feature components compose into the full student dashboard. Sourced from the Figma screen rebuilds.',
}

const TOC = [
  { id: 'shell',     label: 'Shell — DashboardLayout', level: 2 as const },
  { id: 'content',   label: 'Content — per-route',     level: 2 as const },
  { id: 'tokens',    label: 'Token usage summary',     level: 2 as const },
  { id: 'do-dont',   label: 'Do / Don\'t',             level: 2 as const },
]

export default function StudentDashboardPattern() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Patterns</div>
        <h1 className="text-h1 text-chrome-text">Student dashboard</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The pattern that powers all 7 authenticated student routes. A 3-column shell + per-route content slot,
          composed from real component instances. Source for this pattern: the <em>Screens / Student Dashboard</em> page in the
          Figma library (<a className="text-chrome-accent hover:underline" href="https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/" target="_blank" rel="noreferrer">8eNJf875iY9HISEsczDfOh</a>).
        </p>

        <section id="shell" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Shell — DashboardLayout</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Every student-dashboard route uses one shell:{' '}
            <a className="text-chrome-accent hover:underline" href="/components/dashboard-layout/">DashboardLayout</a>.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Region</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Width</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">leftArea</td><td className="p-3 font-mono text-chrome-text-subtle">104px</td><td className="p-3 text-chrome-text">LeftSideBar (hosts NavBar)</td><td className="p-3 font-mono text-chrome-text-subtle">chrome/sidebar-rail</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">mainWrapper</td><td className="p-3 font-mono text-chrome-text-subtle">flex-grow</td><td className="p-3 text-chrome-text">Page content</td><td className="p-3 font-mono text-chrome-text-subtle">surface/bg/sunken bg, 32px / 24px padding</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">mainContentArea</td><td className="p-3 font-mono text-chrome-text-subtle">880px max</td><td className="p-3 text-chrome-text">Centered content</td><td className="p-3 font-mono text-chrome-text-subtle">chrome/main-content-max</td></tr>
                <tr className="border-b border-chrome-border last:border-b-0"><td className="p-3 font-mono">rightArea</td><td className="p-3 font-mono text-chrome-text-subtle">460px</td><td className="p-3 text-chrome-text">RightSideBar (ProfileCard)</td><td className="p-3 font-mono text-chrome-text-subtle">chrome/right-panel</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="content" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Content — per-route composition</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Each route fills the <code className="font-mono">mainContentArea</code> (max 880px) with a different composition. All 7 are built as
            real screen-rebuild frames in Figma.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Route</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Composition</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/my-feed</td><td className="p-3 text-chrome-text">SectionHeader + 3× <a className="text-chrome-accent hover:underline" href="/components/card/">Card</a> (with-image variant)</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/global-feed</td><td className="p-3 text-chrome-text">Heading/H2 + 4× Card</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/learn</td><td className="p-3 text-chrome-text"><a className="text-chrome-accent hover:underline" href="/components/module-header/">ModuleHeader</a> + 3× <a className="text-chrome-accent hover:underline" href="/components/accordion/">Accordion</a> (milestone variant)</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/badges</td><td className="p-3 text-chrome-text">SectionHeader + 8× <a className="text-chrome-accent hover:underline" href="/components/molecules/badges-card/">BadgesCard</a> grid</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/certificates</td><td className="p-3 text-chrome-text">SectionHeader + 2× Card</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">/rewards</td><td className="p-3 text-chrome-text">SectionHeader + gem-balance pill (surface/bg/accent/subtle) + 4× Card grid</td></tr>
                <tr className="border-b border-chrome-border last:border-b-0"><td className="p-3 font-mono">/nano-skills</td><td className="p-3 text-chrome-text"><a className="text-chrome-accent hover:underline" href="/components/nanoskills/harvard-hero/">HarvardHero</a> + SectionHeader + 3× <a className="text-chrome-accent hover:underline" href="/components/nanoskills/nanoskills-skill-card/">SkillCard</a></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="tokens" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token usage summary</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Every screen rebuild binds to semantic tokens — zero hardcoded hex, zero raw px where a token exists:
          </p>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li><code className="font-mono">surface/bg/canvas</code> on the outer 1440×900 frame</li>
            <li><code className="font-mono">surface/bg/sunken</code> on the mainWrapper area (replaces production's #f5f4fa lavender — DC-016 candidate)</li>
            <li><code className="font-mono">surface/bg/default</code> on every Card / panel</li>
            <li><code className="font-mono">surface/bg/brand</code> on the active NavBar item, ModuleHeader inner, and ButtonTag selected</li>
            <li><code className="font-mono">text/default</code>, <code className="font-mono">text/brand</code>, <code className="font-mono">text/muted</code> for hierarchy</li>
            <li><code className="font-mono">space/inset/{`{sm|md|lg|xl|2xl|3xl}`}</code> on every padding</li>
            <li><code className="font-mono">space/stack/md</code> + <code className="font-mono">space/inline/md</code> on every gap</li>
            <li><code className="font-mono">radius/card</code>, <code className="font-mono">radius/control/lg</code>, <code className="font-mono">radius/pill</code> on every rounded shape</li>
          </ul>
        </section>

        <section id="do-dont" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Do / Don't</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-[#16803c] bg-[rgba(36,194,110,0.08)] p-4">
              <div className="text-overline text-[#16803c] mb-2">Do</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1.5">
                <li>Use the <code className="font-mono">DashboardLayout</code> shell instance — never re-implement the 3-column structure.</li>
                <li>Bind every fill / stroke / radius / spacing to a semantic variable.</li>
                <li>Embed atom + molecule instances inside content compositions.</li>
                <li>Cap content at 880px width via <code className="font-mono">chrome/main-content-max</code>.</li>
              </ul>
            </div>
            <div className="rounded-card border border-[#a31836] bg-[rgba(240,41,77,0.04)] p-4">
              <div className="text-overline text-[#a31836] mb-2">Don't</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1.5">
                <li>Hardcode <code className="font-mono">#4e3bc2</code> brand purple — use <code className="font-mono">surface/bg/brand</code> (DC-005 will resolve).</li>
                <li>Build a fourth dropdown (we have legacy DropDown + newDashboard DropDown molecule + dropdown atom + Select already).</li>
                <li>Use Tailwind utility classes alongside SCSS modules — see DC-029 (parent-hub).</li>
                <li>Skip mode bindings — every color must work in light AND dark.</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
