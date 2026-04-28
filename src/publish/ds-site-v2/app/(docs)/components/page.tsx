import type { Metadata } from 'next'
import Link from 'next/link'
import { RightTOC } from '@/components/chrome/RightTOC'
import { componentSpecs } from '@/lib/componentSpecs'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Every component spec in the BrightChamps design system, organized by tier and category. 130+ pages.',
}

const TOC = [
  { id: 'overview',  label: 'Overview',         level: 2 as const },
  { id: 'tier-1',    label: 'Tier 1 — Chrome',  level: 2 as const },
  { id: 'tier-2',    label: 'Tier 2 — Content', level: 2 as const },
  { id: 'tier-3',    label: 'Tier 3 — Feature', level: 2 as const },
  { id: 'atoms',     label: 'newDashboard atoms', level: 2 as const },
  { id: 'molecules', label: 'newDashboard molecules', level: 2 as const },
  { id: 'nano',      label: 'NanoSkills',      level: 2 as const },
  { id: 'practice',  label: 'Practice Zone',    level: 2 as const },
  { id: 'overlays',  label: 'Overlays',         level: 2 as const },
  { id: 'primitives', label: 'Primitives',     level: 2 as const },
  { id: 'inputs',    label: 'Inputs',           level: 2 as const },
  { id: 'feedback',  label: 'Feedback',         level: 2 as const },
  { id: 'navigation', label: 'Navigation',     level: 2 as const },
  { id: 'legacy',    label: 'Legacy',           level: 2 as const },
  { id: 'sections',  label: 'Sections',         level: 2 as const },
  { id: 'layouts',   label: 'Layouts',          level: 2 as const },
]

const TIER_1 = [
  { name: 'NavBar',                slug: 'nav-bar' },
  { name: 'LeftSideBar',           slug: 'left-side-bar' },
  { name: 'RightSideBar',          slug: 'right-side-bar' },
  { name: 'DashboardLayout',       slug: 'dashboard-layout' },
]
const TIER_2 = [
  { name: 'Button',                slug: 'button' },
  { name: 'Accordion',             slug: 'accordion' },
  { name: 'Card',                  slug: 'card' },
  { name: 'ProgressBar',           slug: 'progress-bar' },
  { name: 'ProgressLine',          slug: 'progress-line' },
  { name: 'GreenLine',             slug: 'green-line' },
  { name: 'LessonList',            slug: 'lesson-list' },
  { name: 'Layout',                slug: 'layout' },
  { name: 'ProfileAvatar',         slug: 'profile-avatar' },
  { name: 'FeedLayout',            slug: 'feed-layout' },
]
const TIER_3 = [
  { name: 'ModuleHeader',          slug: 'module-header' },
  { name: 'LockedModuleContainer', slug: 'locked-module-container' },
  { name: 'ToggleSwitch',          slug: 'toggle-switch' },
  { name: 'Tray',                  slug: 'tray' },
  { name: 'ClassDetails',          slug: 'class-details' },
  { name: 'SectionHeader',         slug: 'section-header' },
  { name: 'Chip',                  slug: 'chip' },
  { name: 'Timer',                 slug: 'timer' },
  { name: 'RightSectionInList',    slug: 'right-section-in-list' },
  { name: 'LeftSectionInList',     slug: 'left-section-in-list' },
]
const ATOMS = [
  { name: 'DateDropdown',          slug: 'atoms/date-dropdown' },
  { name: 'dropdown',              slug: 'atoms/dropdown-atom' },
  { name: 'Icon',                  slug: 'atoms/icon-atom' },
  { name: 'LoadingIndicator',      slug: 'atoms/loading-indicator' },
  { name: 'ProgressBar',           slug: 'atoms/progress-bar-atom' },
  { name: 'ProgressbarWithStar',   slug: 'atoms/progress-bar-with-star' },
  { name: 'SelectedTeacher',       slug: 'atoms/selected-teacher' },
  { name: 'ShowStarRating',        slug: 'atoms/show-star-rating' },
  { name: 'SideBarPopup',          slug: 'atoms/sidebar-popup' },
  { name: 'SpeechBubble',          slug: 'atoms/speech-bubble' },
  { name: 'TextTruncate',          slug: 'atoms/text-truncate' },
  { name: 'togglebutton',          slug: 'atoms/toggle-button' },
  { name: 'Tooltip',               slug: 'atoms/tooltip' },
  { name: 'TruncateText',          slug: 'atoms/truncate-text' },
]
const NANO = [
  { name: 'HarvardHero',           slug: 'nanoskills/harvard-hero' },
  { name: 'SelfPacedHero',         slug: 'nanoskills/self-paced-hero' },
  { name: 'TeacherLedHero',        slug: 'nanoskills/teacher-led-hero' },
  { name: 'SkillCard',             slug: 'nanoskills/nanoskills-skill-card' },
  { name: 'BookingModal',          slug: 'nanoskills/nanoskills-booking-modal' },
  { name: 'OnboardingModal',       slug: 'nanoskills/nanoskills-onboarding-modal' },
]
const PRACTICE = [
  { name: 'WorkSheetStep',         slug: 'practice-zone/worksheet-step' },
]
const OVERLAYS = [
  { name: 'Modal',                 slug: 'overlays/modal' },
  { name: 'MobileModal',           slug: 'overlays/mobile-modal' },
  { name: 'Popup',                 slug: 'overlays/popup' },
]
const PRIMITIVES = [
  { name: 'Text',                  slug: 'primitives/text' },
  { name: 'Gap',                   slug: 'primitives/gap' },
  { name: 'Loader',                slug: 'primitives/loader' },
]
const INPUTS = [
  { name: 'Select',                slug: 'inputs/select-legacy' },
  { name: 'DropDown (legacy)',     slug: 'inputs/dropdown-legacy' },
  { name: 'LanguageSelector',      slug: 'inputs/language-selector' },
]
const FEEDBACK = [
  { name: 'Rating',                slug: 'feedback/rating-legacy' },
  { name: 'StarRating',            slug: 'feedback/star-rating' },
]
const NAVIGATION = [
  { name: 'NavigationBar',         slug: 'navigation/navigation-bar' },
  { name: 'NavigationBarMobile',   slug: 'navigation/navigation-bar-mobile' },
]
const LEGACY = [
  { name: 'Badges (section)',          slug: 'legacy/badges-section' },
  { name: 'FlashButton',                slug: 'legacy/flash-button' },
  { name: 'LongTermScheduling',         slug: 'legacy/long-term-scheduling' },
  { name: 'ReferralCard (legacy)',      slug: 'legacy/referral-card-legacy' },
  { name: 'Reschedule',                  slug: 'legacy/reschedule-legacy' },
  { name: 'StudentProfile',              slug: 'legacy/student-profile' },
  { name: 'StudentProfileBarMobile',     slug: 'legacy/student-profile-bar-mobile' },
  { name: 'TeacherSearch',               slug: 'legacy/teacher-search' },
  { name: 'TimeZone (display)',          slug: 'legacy/time-zone-display' },
]
const SECTIONS = [
  { name: 'WelcomeKit',                  slug: 'sections/welcome-kit' },
  { name: 'SelectProfile',               slug: 'sections/select-profile' },
  { name: 'onboarding-new',              slug: 'sections/onboarding-new' },
  { name: 'TeacherProfileSection',       slug: 'sections/teacher-profile-section' },
  { name: 'ReferralSection',             slug: 'sections/referral-section' },
  { name: 'GameDashboardPage',           slug: 'sections/game-dashboard-page' },
]
const LAYOUTS = [
  { name: 'pageLayoutConfig',            slug: 'layouts/page-layout-config' },
  { name: 'AppLayout',                    slug: 'layouts/app-layout' },
  { name: 'DashboardLayout (3-col)',     slug: 'layouts/dashboard-layout-v2' },
  { name: 'DemoDashboardLayout',         slug: 'layouts/demo-dashboard-layout' },
  { name: 'FullScreenLayout',             slug: 'layouts/full-screen-layout' },
  { name: 'FullWidthLayout',              slug: 'layouts/full-width-layout' },
  { name: 'GameDashboardLayout',         slug: 'layouts/game-dashboard-layout' },
  { name: 'LoginLayout',                  slug: 'layouts/login-layout' },
  { name: 'OnboardingLayout',             slug: 'layouts/onboarding-layout' },
]

// Molecules — 49 newDashboard molecule pages from componentSpecs.ts
const MOLECULES_RAW = componentSpecs
  .filter(s => s.slug.startsWith('') && (s.target === 'newDashboard' || s.target === 'sections'))
  .filter(s => /molecules\//.test('/' + s.slug) === false) // we'll match by directory existence below
  .map(s => ({ name: s.name, slug: s.slug }))

// Hard list since the molecule spec pages live under /components/molecules/<slug>/
const MOLECULES = [
  'account-validity-label','add-more-classes','add-more-classes-v2','animated-gems','badges-card',
  'button-nd','button-tag','calendar-molecule','card-image','card-nd','checklist-for-joining-class',
  'class-card-info','class-joining-card','class-rating-feedback','classes-to-reschedule',
  'confirmation-modal','counsellor-card','demo-sidebar-popup','diamond-purchase-header',
  'diamond-reward','dropdown-nd','edit-contact-information','edit-demo-user-form','edit-timezone',
  'empty-state','get-callback','get-certificate-callback-pre-demo','input-nd','my-rewards-card',
  'redeem-gems-card','redeem-rewards-modal','referral-status-card','response-picker','reward-card',
  'rewards-referral-card','rewards-tabs','rewards-walkthrough-card','sharing-buttons','slot-picker',
  'slot-selector','subscription-banner','subscription-status-banner','summer-camp-banner',
  'summer-camp-card','switch-profile-item-card','teacher-detail','trustpilot-popup',
  'trustpilot-sidebar','upcoming-certificate-card',
].map(slug => {
  const spec = componentSpecs.find(s => s.slug === slug)
  return { name: spec?.name ?? slug, slug: 'molecules/' + slug }
})

interface Item { name: string; slug: string }

function Section({ id, title, count, items, hint }: { id: string; title: string; count?: number; items: Item[]; hint?: string }) {
  if (items.length === 0) return null
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-h2 text-chrome-text">{title}</h2>
        <span className="font-mono text-[11px] text-chrome-text-subtlest tabular-nums">{count ?? items.length} pages</span>
      </div>
      {hint && <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">{hint}</p>}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(it => (
          <Link
            key={it.slug}
            href={`/components/${it.slug}/`}
            className="rounded-md border border-chrome-border bg-chrome-surface-raised hover:bg-chrome-surface-sunken hover:border-chrome-accent px-3 py-2 text-[13px] text-chrome-text font-mono transition-colors"
          >
            {it.name}
            <span className="block font-mono text-[10.5px] text-chrome-text-subtlest mt-0.5 truncate">/{it.slug}/</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function ComponentsIndex() {
  const totalPages = TIER_1.length + TIER_2.length + TIER_3.length + ATOMS.length + MOLECULES.length + NANO.length + PRACTICE.length + OVERLAYS.length + PRIMITIVES.length + INPUTS.length + FEEDBACK.length + NAVIGATION.length + LEGACY.length + SECTIONS.length + LAYOUTS.length

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[1120px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">Component index</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Every component spec in the BrightChamps design system. {totalPages} pages organized by tier and category.
          Each spec page shows the production source, token bindings, variants, and (where built) the live Figma frame.
        </p>

        <section id="overview" className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Total spec pages</div>
            <div className="text-[28px] font-bold text-chrome-text">{totalPages}</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">In-scope SYSTEM</div>
            <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>117</div>
            <div className="text-[11px] text-chrome-text-subtlest"><Link className="text-chrome-accent hover:underline" href="/governance/scope-boundary/">scope boundary</Link></div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Health</div>
            <div className="text-[28px] font-bold text-chrome-text">95<span className="text-chrome-text-subtlest text-[14px] font-mono ml-1">/ 117</span></div>
            <div className="text-[11px] text-chrome-text-subtlest"><Link className="text-chrome-accent hover:underline" href="/components/health/">health dashboard</Link></div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">DC tickets</div>
            <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>51</div>
            <div className="text-[11px] text-chrome-text-subtlest"><Link className="text-chrome-accent hover:underline" href="/governance/dc-tickets/">tickets</Link></div>
          </div>
        </section>

        <Section id="tier-1"  title="Tier 1 — Chrome"   items={TIER_1}  hint="The shell every authenticated route mounts inside." />
        <Section id="tier-2"  title="Tier 2 — Content"  items={TIER_2}  hint="Reusable content primitives — buttons, cards, progress." />
        <Section id="tier-3"  title="Tier 3 — Feature"  items={TIER_3}  hint="Feature-specific molecules used by the student app shell." />
        <Section id="atoms"   title="newDashboard atoms" items={ATOMS}  hint="14 atomic primitives from src/newDashboard/components/atoms/." />
        <Section id="molecules" title="newDashboard molecules" items={MOLECULES} hint="49 molecule patterns from src/newDashboard/components/molecules/." />
        <Section id="nano"    title="NanoSkills"        items={NANO}    hint="The Nano Skills surface — Harvard, self-paced, teacher-led." />
        <Section id="practice" title="Practice Zone"   items={PRACTICE} hint="Practice surface — worksheet step pattern." />
        <Section id="overlays" title="Overlays"        items={OVERLAYS} hint="Modal, MobileModal, Popup." />
        <Section id="primitives" title="Primitives"   items={PRIMITIVES} hint="System primitives — Text, Gap, Loader." />
        <Section id="inputs"  title="Inputs"           items={INPUTS}   hint="Form input components." />
        <Section id="feedback" title="Feedback"       items={FEEDBACK}  hint="Rating + StarRating display patterns." />
        <Section id="navigation" title="Navigation"   items={NAVIGATION} hint="NavigationBar (desktop) + NavigationBarMobile." />
        <Section id="legacy"  title="Legacy"           items={LEGACY}   hint="Pre-DS components still used in 3+ places — pending migration to newDashboard." />
        <Section id="sections" title="Sections"       items={SECTIONS}  hint="Page-level compositions — onboarding, profile, welcome kit." />
        <Section id="layouts" title="Layouts"          items={LAYOUTS}  hint="Outer-shell layouts that AppLayout dispatches against." />

        <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <h2 className="text-h3 text-chrome-text">Other entry points</h2>
          <ul className="mt-3 ml-4 list-disc space-y-1 text-body-m text-chrome-text">
            <li><Link className="text-chrome-accent hover:underline" href="/components/health/">Health dashboard</Link> — verification status of every spec</li>
            <li><Link className="text-chrome-accent hover:underline" href="/components/deprecated/">Deprecated components</Link> — flagged for removal, still in production</li>
            <li><Link className="text-chrome-accent hover:underline" href="/governance/scope-boundary/">Scope boundary</Link> — what's in vs out of DS scope</li>
            <li><Link className="text-chrome-accent hover:underline" href="/tools/generate/">AI Generator</Link> — generate components from prompts</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
