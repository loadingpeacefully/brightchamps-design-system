import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'For designers',
  description: 'How to use the BrightChamps Figma variable library, switch modes, find the right token, and propose new ones.',
}

const TOC = [
  { id: 'open',          label: 'Open the Figma library', level: 2 as const },
  { id: 'modes',         label: 'Light, dark, and radius modes', level: 2 as const },
  { id: 'find-color',    label: 'Find the right color',    level: 2 as const },
  { id: 'find-spacing',  label: 'Find the right spacing',  level: 2 as const },
  { id: 'find-radius',   label: 'Find the right radius',   level: 2 as const },
  { id: 'find-text',     label: 'Find the right text style', level: 2 as const },
  { id: 'find-motion',   label: 'Find the right motion',   level: 2 as const },
  { id: 'compose',       label: 'Compose with components', level: 2 as const },
  { id: 'propose',       label: 'Propose a new token',     level: 2 as const },
]

export default function DesignersPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Get started</div>
        <h1 className="text-h1 text-chrome-text">For designers</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          A 5-minute orientation to the BrightChamps Figma library — what's in it, how to use it, and what to do
          when you need something that isn't there.
        </p>

        <section id="open" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Open the Figma library</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            The library is one Figma file:
          </p>
          <a
            className="mt-3 inline-flex items-center gap-2 rounded-card border border-chrome-border bg-chrome-surface-sunken px-4 py-3 hover:bg-chrome-surface transition-colors"
            href="https://www.figma.com/design/8eNJf875iY9HISEsczDfOh/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="font-mono text-[13px] text-chrome-accent">figma.com/design/8eNJf875iY9HISEsczDfOh</span>
          </a>
          <p className="mt-4 max-w-[62ch] text-body-m text-chrome-text-subtle">
            <strong>Publish it as a team library</strong> in Figma (Assets panel → ⓘ → Publish). After publishing, the
            444 variables, 16 text styles, 5 effect styles, and 30+ component sets become available in any other file
            that subscribes to the library. From there, every fill / stroke / radius / spacing input in Figma will
            offer the canonical token first.
          </p>
        </section>

        <section id="modes" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Light, dark, and radius modes</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Two collections have <strong>multiple modes</strong>:
          </p>
          <ul className="mt-3 ml-4 space-y-2 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li>
              <code className="font-mono text-[13px]">semantic/color</code> has <strong>light</strong> and <strong>dark</strong> modes.
              Switch a frame's mode in the right-hand inspector under <em>Selection colors</em>. Every bound color flips at once.
            </li>
            <li>
              <code className="font-mono text-[13px]">semantic/radius</code> has <strong>default</strong>, <strong>rounded</strong>, and{' '}
              <strong>no-corner-radius</strong> modes. Use <em>rounded</em> for the future v2 brand softer treatment, or{' '}
              <em>no-corner-radius</em> for legacy / accessibility scenarios.
            </li>
          </ul>
        </section>

        <section id="find-color" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Find the right color</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Always reach for a <strong>semantic</strong> token first, never a primitive:
          </p>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li><code className="font-mono">surface/bg/default</code> — page bg, card bg</li>
            <li><code className="font-mono">surface/bg/brand</code> — primary CTA backgrounds</li>
            <li><code className="font-mono">surface/bg/{`{success | warning | error | info}`}</code> + their <code className="font-mono">/subtle</code> variants — status states</li>
            <li><code className="font-mono">text/default</code>, <code className="font-mono">text/muted</code>, <code className="font-mono">text/brand</code>, <code className="font-mono">text/error</code> etc.</li>
            <li><code className="font-mono">border/default</code>, <code className="font-mono">border/subtle</code>, <code className="font-mono">border/focus</code></li>
            <li><code className="font-mono">course/{`{coding | robotics | finance | ai | literature | maths}`}</code> — for course-vertical theming</li>
          </ul>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Browse the full set at <a className="text-chrome-accent hover:underline" href="/foundations/color/">/foundations/color</a>.
          </p>
        </section>

        <section id="find-spacing" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Find the right spacing</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Spacing primitives go on auto-layout padding + gap. The semantic layer has 4 namespaces:
          </p>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc max-w-[62ch] text-body-m text-chrome-text">
            <li><code className="font-mono">space/inset/{`{xs|sm|md|lg|xl|2xl|3xl}`}</code> — padding</li>
            <li><code className="font-mono">space/stack/{`{xs..3xl}`}</code> — vertical gap</li>
            <li><code className="font-mono">space/inline/{`{xs..3xl}`}</code> — horizontal gap</li>
            <li><code className="font-mono">space/section/{`{sm|md|lg|xl|2xl}`}</code> — large vertical breaks between sections</li>
          </ul>
        </section>

        <section id="find-radius" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Find the right radius</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Use <code className="font-mono">radius/control/{`{sm|md|lg|xl}`}</code> for buttons / inputs,{' '}
            <code className="font-mono">radius/container/{`{sm|md|lg|xl|2xl}`}</code> for cards / panels,{' '}
            <code className="font-mono">radius/card</code> specifically for the canonical Card pattern, and{' '}
            <code className="font-mono">radius/pill</code> for full-rounded shapes (avatars, tags, segmented toggles).
          </p>
        </section>

        <section id="find-text" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Find the right text style</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Apply text styles directly — they bind to the typography variables under the hood:
          </p>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text">
            <strong>Display</strong> · <strong>Heading/H1–H4</strong> · <strong>Title/LG/MD</strong> ·{' '}
            <strong>Body/LG/MD/SM</strong> · <strong>Label/MD/SM</strong> · <strong>Caption</strong> ·{' '}
            <strong>Caption/SM</strong> · <strong>Code/MD/SM</strong>
          </p>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            For status pills and 10px caption text, reach for <strong>Caption/SM</strong> (added 2026-04-28).
          </p>
        </section>

        <section id="find-motion" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Find the right motion</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Browse the canonical motion presets at{' '}
            <a className="text-chrome-accent hover:underline" href="/foundations/motion/">/foundations/motion</a>.
            For most state changes use <strong>animation/fade-in</strong> (300ms ease) or <strong>animation/slide-down</strong> (200ms ease).
            For loading skeletons use <strong>animation/shimmer</strong> (1500ms linear).
          </p>
        </section>

        <section id="compose" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Compose with components</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            The library has 30+ component sets across pages: Tier 1 chrome (NavBar, LeftSideBar, RightSideBar, DashboardLayout),
            Tier 2 content (Accordion, ProgressBar, Button, Card, ProfileAvatar, FeedLayout), Tier 3 feature-specific
            (ModuleHeader, ClassDetails, ToggleSwitch, Tray, etc.), 14 newDashboard atoms, 20 newDashboard molecules, NanoSkills
            heroes (Harvard / SelfPaced / TeacherLed), and Practice Zone WorkSheetStep.
          </p>
          <p className="mt-3 max-w-[62ch] text-body-m text-chrome-text-subtle">
            <strong>When composing screens, use real instances of these components.</strong> See the{' '}
            <a className="text-chrome-accent hover:underline" href="/patterns/student-dashboard/">/patterns/student-dashboard</a>{' '}
            page for examples.
          </p>
        </section>

        <section id="propose" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Propose a new token</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            If a value you need genuinely isn't in the library:
          </p>
          <ol className="mt-3 ml-6 space-y-2 list-decimal max-w-[62ch] text-body-m text-chrome-text">
            <li>Confirm it's not in <a className="text-chrome-accent hover:underline" href="/foundations/color/">/foundations/color</a> already (we have many half-step neutrals).</li>
            <li>Check the <a className="text-chrome-accent hover:underline" href="/surfaces/#designer-conflicts">/surfaces/#designer-conflicts</a> page — it may already be a filed DC ticket.</li>
            <li>If not, file a new DC entry at <code className="font-mono text-[12px]">ledger/drift/designer-conflicts-2026-04-26.json</code> with severity, action, and notes. See the existing DC-013 through DC-033 entries as templates.</li>
            <li>Tag the brand team for sign-off if it's a brand-color question.</li>
          </ol>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
