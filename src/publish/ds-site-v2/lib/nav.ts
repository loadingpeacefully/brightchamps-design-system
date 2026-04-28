export interface NavItem {
  href: string
  label: string
  badge?: 'beta' | 'new' | 'deprecated' | 'caution'
  disabled?: boolean
}
export interface NavSection {
  label: string
  items: NavItem[]
  /** When true, the section starts collapsed in the sidebar — user must click to expand. */
  collapsed?: boolean
}

// Designer-first navigation. The four primary sections (Get started, Foundations,
// Components, Tokens) are always visible. Everything else — audit dashboards, DC
// tickets, governance, surfaces, internal tooling — is grouped under collapsed
// sections so a designer opening the site for the first time sees a focused index.
export const NAV: NavSection[] = [
  {
    label: 'Get started',
    items: [
      { href: '/get-started/',            label: 'Overview' },
      { href: '/get-started/design/',     label: 'For designers',  badge: 'new' },
      { href: '/get-started/develop/',    label: 'For engineers',  badge: 'new' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { href: '/foundations/',            label: 'Overview' },
      { href: '/foundations/color/',      label: 'Color' },
      { href: '/foundations/typography/', label: 'Typography' },
      { href: '/foundations/spacing/',    label: 'Spacing' },
      { href: '/foundations/radius/',     label: 'Radius' },
      { href: '/foundations/iconography/', label: 'Iconography' },
      { href: '/foundations/motion/',     label: 'Motion' },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '/components/',                  label: 'All components',   badge: 'new' },
      { href: '/components/button/',           label: 'Button' },
      { href: '/components/card/',             label: 'Card' },
      { href: '/components/accordion/',        label: 'Accordion' },
      { href: '/components/progress-bar/',     label: 'ProgressBar' },
      { href: '/components/chip/',             label: 'Chip' },
      { href: '/components/toggle-switch/',    label: 'ToggleSwitch' },
      { href: '/components/profile-avatar/',   label: 'ProfileAvatar' },
      { href: '/components/nav-bar/',          label: 'NavBar' },
      { href: '/components/left-side-bar/',    label: 'LeftSideBar' },
      { href: '/components/molecules/input-nd/', label: 'Input' },
    ],
  },
  {
    label: 'Tokens',
    items: [
      { href: '/tokens/',         label: 'All tokens' },
      { href: '/tools/token-picker/', label: 'Token picker', badge: 'new' },
      { href: '/tokens/color/',    label: 'Color' },
      { href: '/tokens/font/',     label: 'Font' },
      { href: '/tokens/space/',    label: 'Space' },
      { href: '/tokens/radius/',   label: 'Radius' },
      { href: '/tokens/shadow/',   label: 'Shadow' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/tools/',              label: 'Overview' },
      { href: '/tools/generate/',     label: 'AI Generator' },
      { href: '/tools/palette/',      label: 'Palette explorer' },
      { href: '/tools/contrast/',     label: 'Contrast checker' },
    ],
  },

  // ─── System internals (collapsed by default) ───────────────────────────

  {
    label: 'More components',
    collapsed: true,
    items: [
      { href: '/components/health/',       label: 'Health dashboard' },
      { href: '/components/deprecated/',    label: 'Deprecated' },
      { href: '/components/feed-layout/',   label: 'FeedLayout' },
      { href: '/components/dashboard-layout/', label: 'DashboardLayout' },
      { href: '/components/right-side-bar/', label: 'RightSideBar' },
      { href: '/components/lesson-list/',   label: 'LessonList' },
      { href: '/components/progress-line/', label: 'ProgressLine' },
      { href: '/components/green-line/',    label: 'GreenLine' },
      { href: '/components/section-header/', label: 'SectionHeader' },
      { href: '/components/timer/',         label: 'Timer' },
      { href: '/components/tray/',          label: 'Tray' },
      { href: '/components/module-header/', label: 'ModuleHeader' },
      { href: '/components/locked-module-container/', label: 'LockedModuleContainer' },
      { href: '/components/class-details/', label: 'ClassDetails' },
      { href: '/components/right-section-in-list/', label: 'RightSectionInList' },
      { href: '/components/left-section-in-list/',  label: 'LeftSectionInList' },
      { href: '/components/layout/',        label: 'Layout' },
    ],
  },
  {
    label: 'newDashboard atoms',
    collapsed: true,
    items: [
      { href: '/components/atoms/icon-atom/',              label: 'Icon' },
      { href: '/components/atoms/loading-indicator/',      label: 'LoadingIndicator' },
      { href: '/components/atoms/progress-bar-atom/',      label: 'ProgressBar (atom)' },
      { href: '/components/atoms/progress-bar-with-star/', label: 'ProgressbarWithStar' },
      { href: '/components/atoms/selected-teacher/',       label: 'SelectedTeacher' },
      { href: '/components/atoms/show-star-rating/',       label: 'ShowStarRating' },
      { href: '/components/atoms/sidebar-popup/',          label: 'SideBarPopup' },
      { href: '/components/atoms/speech-bubble/',          label: 'SpeechBubble' },
      { href: '/components/atoms/text-truncate/',          label: 'TextTruncate' },
      { href: '/components/atoms/tooltip/',                label: 'Tooltip' },
      { href: '/components/atoms/truncate-text/',          label: 'TruncateText' },
      { href: '/components/atoms/date-dropdown/',          label: 'DateDropdown' },
      { href: '/components/atoms/dropdown-atom/',          label: 'dropdown' },
      { href: '/components/atoms/toggle-button/',          label: 'togglebutton' },
    ],
  },
  {
    label: 'NanoSkills',
    collapsed: true,
    items: [
      { href: '/components/nanoskills/harvard-hero/',                label: 'HarvardHero' },
      { href: '/components/nanoskills/self-paced-hero/',             label: 'SelfPacedHero' },
      { href: '/components/nanoskills/teacher-led-hero/',            label: 'TeacherLedHero' },
      { href: '/components/nanoskills/nanoskills-skill-card/',       label: 'SkillCard' },
      { href: '/components/nanoskills/nanoskills-booking-modal/',    label: 'BookingModal' },
      { href: '/components/nanoskills/nanoskills-onboarding-modal/', label: 'OnboardingModal' },
    ],
  },
  {
    label: 'Layouts',
    collapsed: true,
    items: [
      { href: '/components/layouts/page-layout-config/',     label: 'pageLayoutConfig' },
      { href: '/components/layouts/app-layout/',              label: 'AppLayout' },
      { href: '/components/layouts/dashboard-layout-v2/',     label: 'DashboardLayout' },
      { href: '/components/layouts/demo-dashboard-layout/',   label: 'DemoDashboardLayout' },
      { href: '/components/layouts/full-screen-layout/',      label: 'FullScreenLayout' },
      { href: '/components/layouts/full-width-layout/',       label: 'FullWidthLayout' },
      { href: '/components/layouts/game-dashboard-layout/',   label: 'GameDashboardLayout' },
      { href: '/components/layouts/login-layout/',            label: 'LoginLayout' },
      { href: '/components/layouts/onboarding-layout/',       label: 'OnboardingLayout' },
    ],
  },
  {
    label: 'Sections',
    collapsed: true,
    items: [
      { href: '/components/sections/welcome-kit/',             label: 'WelcomeKit' },
      { href: '/components/sections/select-profile/',          label: 'SelectProfile' },
      { href: '/components/sections/onboarding-new/',          label: 'onboarding-new' },
      { href: '/components/sections/teacher-profile-section/', label: 'TeacherProfileSection' },
      { href: '/components/sections/referral-section/',        label: 'ReferralSection' },
      { href: '/components/sections/game-dashboard-page/',     label: 'GameDashboardPage' },
    ],
  },
  {
    label: 'Patterns',
    collapsed: true,
    items: [
      { href: '/patterns/',                   label: 'Overview' },
      { href: '/patterns/student-dashboard/', label: 'Student dashboard' },
      { href: '/patterns/teacher-grading/',   label: 'Teacher grading',   badge: 'caution' },
      { href: '/patterns/landing-hero/',      label: 'Landing hero' },
    ],
  },
  {
    label: 'System internals',
    collapsed: true,
    items: [
      { href: '/whats-new/',                    label: 'Changelog' },
      { href: '/get-started/contribute/',       label: 'Contributing' },
      { href: '/get-started/decisions/',        label: 'Decisions' },
      { href: '/governance/pending-decisions/', label: 'Pending decisions' },
      { href: '/governance/dc-tickets/',        label: 'DC tickets' },
      { href: '/governance/scope-boundary/',    label: 'Scope boundary' },
      { href: '/surfaces/',                     label: 'Surface health' },
      { href: '/surfaces/audit-dashboard/',     label: 'Audit dashboard' },
      { href: '/surfaces/student/',             label: 'Student surface' },
      { href: '/surfaces/student/components/',  label: 'Student · components' },
      { href: '/surfaces/student/icons/',       label: 'Student · icons' },
      { href: '/surfaces/student/states/',      label: 'Student · states' },
      { href: '/surfaces/nano-skills-audit/',   label: '/nano-skills audit' },
      { href: '/surfaces/my-feed-audit/',       label: '/my-feed audit' },
      { href: '/surfaces/learn-audit/',         label: '/learn audit' },
      { href: '/surfaces/badges-audit/',        label: '/badges audit' },
    ],
  },
]
