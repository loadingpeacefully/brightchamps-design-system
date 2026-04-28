import type { Metadata } from 'next'
import Link from 'next/link'
import { RightTOC } from '@/components/chrome/RightTOC'
import { loadComponents } from '@/lib/surface-data'

export const metadata: Metadata = {
  title: 'Student · Components',
  description: 'CSS Module component inventory for the student surface — 21 unique component prefixes extracted from 7 pages.',
}

const TOC = [
  { id: 'inventory', label: 'Component inventory', level: 2 as const },
]

// Components that have a fully-built spec page on the DS site. The component
// inventory shows DOCUMENTED + a link for these instead of NEEDS SPEC.
const DOCUMENTED: Record<string, string> = {
  // Tier 1 chrome (4)
  NavBar:                '/components/nav-bar/',
  LeftSideBar:           '/components/left-side-bar/',
  RightSideBar:          '/components/right-side-bar/',
  DashboardLayout:       '/components/dashboard-layout/',
  // Tier 2 content (6)
  Accordion:             '/components/accordion/',
  ProgressBar:           '/components/progress-bar/',
  ProfileAvatar:         '/components/profile-avatar/',
  FeedLayout:            '/components/feed-layout/',
  // Tier 3 feature-specific (10)
  ModuleHeader:          '/components/module-header/',
  ClassDetails:          '/components/class-details/',
  ToggleSwitch:          '/components/toggle-switch/',
  Tray:                  '/components/tray/',
  LockedModuleContainer: '/components/locked-module-container/',
  RightSectionInList:    '/components/right-section-in-list/',
  LeftSectionInList:     '/components/left-section-in-list/',
  Header:                '/components/section-header/',     // map "Header" inventory prefix to SectionHeader
  Module:                '/components/locked-module-container/', // Module inventory prefix shares LockedModule treatment
  Navbar:                '/components/nav-bar/',            // lowercase Navbar (different prefix) → NavBar
  // Earlier inferred / wrapper specs (still in inventory)
  ProgressLine:          '/components/progress-line/',
  GreenLine:             '/components/green-line/',
  LessonList:            '/components/lesson-list/',
  Layout:                '/components/layout/',
  // Routes that exist as concepts but no inventory prefix (don't increment count)
  Card:                  '/components/card/',
  Button:                '/components/button/',
  Chip:                  '/components/chip/',
  Timer:                 '/components/timer/',
  SectionHeader:         '/components/section-header/',
}

export default function StudentComponentsPage() {
  const components = loadComponents()
  const totalElements = components.reduce((s, c) => s + c.elements, 0)
  const documentedCount = components.filter(c => DOCUMENTED[c.prefix]).length

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Student</div>
        <h1 className="text-h1 text-chrome-text">Component inventory</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {components.length} unique CSS Module component prefixes detected across {totalElements.toLocaleString()} DOM
          elements on 7 student app pages. Each prefix maps to a React component in the student app codebase.
        </p>
        <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
          <strong className="text-chrome-text">{documentedCount}</strong> of {components.length} components documented.
          Full coverage achieved across Tier 1 chrome (NavBar, LeftSideBar, RightSideBar, DashboardLayout), Tier 2 content
          (Accordion, ProgressBar, Button, Card, ProfileAvatar, FeedLayout), and Tier 3 feature-specific (ModuleHeader,
          ClassDetails, ToggleSwitch, Tray, LockedModuleContainer, RightSectionInList, LeftSectionInList, SectionHeader,
          Chip, Timer). All wired to the Figma variable library
          (file <code className="font-mono text-[12px]">8eNJf875iY9HISEsczDfOh</code>) with semantic token bindings and
          DC-conflict annotations.
        </p>

        <section id="inventory" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Inventory</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Sorted by element count. &ldquo;Variants&rdquo; = unique CSS class suffixes within the component.
            &ldquo;Pages&rdquo; = how many of the 7 student URLs this component appears on.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Elements</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Variants</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Pages</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Found on</th>
                </tr>
              </thead>
              <tbody>
                {components.map(c => {
                  const docHref = DOCUMENTED[c.prefix]
                  return (
                    <tr key={c.prefix} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken transition-colors">
                      <td className="p-3 font-mono font-semibold text-chrome-text">
                        {docHref ? (
                          <Link href={docHref} className="text-chrome-accent hover:underline">{c.prefix}</Link>
                        ) : c.prefix}
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{c.elements}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{c.localNames.length}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{c.pages.length}/7</td>
                      <td className="p-3">
                        {docHref ? (
                          <Link
                            href={docHref}
                            className="inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(36,194,110,0.14)] text-[#16803c] hover:underline"
                          >
                            Documented
                          </Link>
                        ) : (
                          <span className="inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(255,187,58,0.18)] text-[#8a5e00]">
                            Needs spec
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-chrome-text-subtle max-w-[200px] truncate">
                        {c.pages.join(', ')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
