export interface NavItem {
  href: string
  label: string
  badge?: 'beta' | 'new' | 'deprecated' | 'caution'
  disabled?: boolean
}
export interface NavSection {
  label: string
  items: NavItem[]
  collapsed?: boolean
}

// Nav must satisfy two rules:
// 1. Every href points at a real page (no 404s).
// 2. Every page worth surfacing is reachable in <=2 clicks (overview page → individual page).
//    Categories with many leaves (atoms / molecules / sections / overlays / etc.) link to the
//    overview at /components/, which renders an indexed grid of every spec page.

export const NAV: NavSection[] = [
  {
    label: 'Get started',
    items: [
      { href: '/get-started/',            label: 'Overview',     badge: 'new' },
      { href: '/get-started/design/',     label: 'For designers', badge: 'new' },
      { href: '/get-started/develop/',    label: 'For engineers', badge: 'new' },
      { href: '/get-started/contribute/', label: 'Contributing',  badge: 'new' },
      { href: '/get-started/decisions/',  label: 'Decisions',     badge: 'new' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { href: '/foundations/',            label: 'Overview' },
      { href: '/foundations/color/',      label: 'Color',          badge: 'new' },
      { href: '/foundations/typography/', label: 'Typography',     badge: 'new' },
      { href: '/foundations/spacing/',    label: 'Spacing',        badge: 'new' },
      { href: '/foundations/radius/',     label: 'Radius',         badge: 'new' },
      { href: '/foundations/iconography/', label: 'Iconography',   badge: 'new' },
      { href: '/foundations/motion/',     label: 'Motion',         badge: 'new' },
    ],
  },
  {
    label: 'Tokens',
    items: [
      { href: '/tokens/',         label: 'All tokens' },
      { href: '/tokens/color/',   label: 'Color',  badge: 'new' },
      { href: '/tokens/font/',    label: 'Font',   badge: 'new' },
      { href: '/tokens/space/',   label: 'Space',  badge: 'new' },
      { href: '/tokens/radius/',  label: 'Radius', badge: 'new' },
      { href: '/tokens/shadow/',  label: 'Shadow', badge: 'new' },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '/components/',        label: 'All components',   badge: 'new' },
      { href: '/components/health/', label: 'Health dashboard', badge: 'new' },
      { href: '/components/deprecated/', label: 'Deprecated',   badge: 'caution' },
    ],
  },
  {
    label: 'Tier 1 — Chrome',
    items: [
      { href: '/components/nav-bar/',          label: 'NavBar',          badge: 'new' },
      { href: '/components/left-side-bar/',    label: 'LeftSideBar',     badge: 'new' },
      { href: '/components/right-side-bar/',   label: 'RightSideBar',    badge: 'new' },
      { href: '/components/dashboard-layout/', label: 'DashboardLayout', badge: 'new' },
    ],
  },
  {
    label: 'Tier 2 — Content',
    items: [
      { href: '/components/button/',         label: 'Button',        badge: 'new' },
      { href: '/components/accordion/',      label: 'Accordion',     badge: 'new' },
      { href: '/components/card/',           label: 'Card',          badge: 'new' },
      { href: '/components/progress-bar/',   label: 'ProgressBar',   badge: 'new' },
      { href: '/components/progress-line/',  label: 'ProgressLine',  badge: 'new' },
      { href: '/components/green-line/',     label: 'GreenLine',     badge: 'new' },
      { href: '/components/lesson-list/',    label: 'LessonList',    badge: 'new' },
      { href: '/components/layout/',         label: 'Layout',        badge: 'new' },
      { href: '/components/profile-avatar/', label: 'ProfileAvatar', badge: 'new' },
      { href: '/components/feed-layout/',    label: 'FeedLayout',    badge: 'new' },
    ],
  },
  {
    label: 'Tier 3 — Feature',
    items: [
      { href: '/components/module-header/',          label: 'ModuleHeader',         badge: 'new' },
      { href: '/components/locked-module-container/', label: 'LockedModuleContainer', badge: 'new' },
      { href: '/components/toggle-switch/',          label: 'ToggleSwitch',         badge: 'new' },
      { href: '/components/tray/',                   label: 'Tray',                  badge: 'new' },
      { href: '/components/class-details/',          label: 'ClassDetails',         badge: 'new' },
      { href: '/components/section-header/',         label: 'SectionHeader',        badge: 'new' },
      { href: '/components/chip/',                   label: 'Chip',                  badge: 'new' },
      { href: '/components/timer/',                  label: 'Timer',                 badge: 'new' },
      { href: '/components/right-section-in-list/',  label: 'RightSectionInList',   badge: 'new' },
      { href: '/components/left-section-in-list/',   label: 'LeftSectionInList',    badge: 'new' },
    ],
  },
  {
    label: 'newDashboard atoms',
    collapsed: true,
    items: [
      { href: '/components/atoms/icon-atom/',              label: 'Icon',                badge: 'new' },
      { href: '/components/atoms/loading-indicator/',      label: 'LoadingIndicator',    badge: 'new' },
      { href: '/components/atoms/progress-bar-atom/',      label: 'ProgressBar (atom)',  badge: 'new' },
      { href: '/components/atoms/progress-bar-with-star/', label: 'ProgressbarWithStar', badge: 'new' },
      { href: '/components/atoms/selected-teacher/',       label: 'SelectedTeacher',     badge: 'new' },
      { href: '/components/atoms/show-star-rating/',       label: 'ShowStarRating',      badge: 'new' },
      { href: '/components/atoms/sidebar-popup/',          label: 'SideBarPopup',        badge: 'new' },
      { href: '/components/atoms/speech-bubble/',          label: 'SpeechBubble',        badge: 'new' },
      { href: '/components/atoms/text-truncate/',          label: 'TextTruncate',        badge: 'new' },
      { href: '/components/atoms/tooltip/',                label: 'Tooltip',             badge: 'new' },
      { href: '/components/atoms/truncate-text/',          label: 'TruncateText',        badge: 'new' },
      { href: '/components/atoms/date-dropdown/',          label: 'DateDropdown',        badge: 'new' },
      { href: '/components/atoms/dropdown-atom/',          label: 'dropdown',            badge: 'new' },
      { href: '/components/atoms/toggle-button/',          label: 'togglebutton',        badge: 'new' },
    ],
  },
  {
    label: 'newDashboard molecules',
    collapsed: true,
    items: [
      { href: '/components/#molecules', label: 'All 49 molecules →', badge: 'new' },
    ],
  },
  {
    label: 'NanoSkills',
    items: [
      { href: '/components/nanoskills/harvard-hero/',                label: 'HarvardHero',     badge: 'new' },
      { href: '/components/nanoskills/self-paced-hero/',             label: 'SelfPacedHero',   badge: 'new' },
      { href: '/components/nanoskills/teacher-led-hero/',            label: 'TeacherLedHero',  badge: 'new' },
      { href: '/components/nanoskills/nanoskills-skill-card/',       label: 'SkillCard',       badge: 'new' },
      { href: '/components/nanoskills/nanoskills-booking-modal/',    label: 'BookingModal',    badge: 'new' },
      { href: '/components/nanoskills/nanoskills-onboarding-modal/', label: 'OnboardingModal', badge: 'new' },
    ],
  },
  {
    label: 'Practice Zone',
    items: [
      { href: '/components/practice-zone/worksheet-step/', label: 'WorkSheetStep', badge: 'new' },
    ],
  },
  {
    label: 'Layouts',
    collapsed: true,
    items: [
      { href: '/components/layouts/page-layout-config/',     label: 'pageLayoutConfig',  badge: 'new' },
      { href: '/components/layouts/app-layout/',              label: 'AppLayout',         badge: 'new' },
      { href: '/components/layouts/dashboard-layout-v2/',     label: 'DashboardLayout',   badge: 'new' },
      { href: '/components/layouts/demo-dashboard-layout/',   label: 'DemoDashboardLayout', badge: 'new' },
      { href: '/components/layouts/full-screen-layout/',      label: 'FullScreenLayout',  badge: 'new' },
      { href: '/components/layouts/full-width-layout/',       label: 'FullWidthLayout',   badge: 'new' },
      { href: '/components/layouts/game-dashboard-layout/',   label: 'GameDashboardLayout', badge: 'new' },
      { href: '/components/layouts/login-layout/',            label: 'LoginLayout',       badge: 'new' },
      { href: '/components/layouts/onboarding-layout/',       label: 'OnboardingLayout',  badge: 'new' },
    ],
  },
  {
    label: 'Sections',
    collapsed: true,
    items: [
      { href: '/components/sections/welcome-kit/',             label: 'WelcomeKit',            badge: 'new' },
      { href: '/components/sections/select-profile/',          label: 'SelectProfile',         badge: 'new' },
      { href: '/components/sections/onboarding-new/',          label: 'onboarding-new',        badge: 'new' },
      { href: '/components/sections/teacher-profile-section/', label: 'TeacherProfileSection', badge: 'new' },
      { href: '/components/sections/referral-section/',        label: 'ReferralSection',       badge: 'new' },
      { href: '/components/sections/game-dashboard-page/',     label: 'GameDashboardPage',     badge: 'new' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { href: '/components/overlays/modal/',         label: 'Modal',        badge: 'new' },
      { href: '/components/overlays/mobile-modal/',  label: 'MobileModal',  badge: 'new' },
      { href: '/components/overlays/popup/',         label: 'Popup',        badge: 'new' },
    ],
  },
  {
    label: 'Primitives',
    items: [
      { href: '/components/primitives/text/',    label: 'Text',    badge: 'new' },
      { href: '/components/primitives/gap/',     label: 'Gap',     badge: 'new' },
      { href: '/components/primitives/loader/',  label: 'Loader',  badge: 'new' },
    ],
  },
  {
    label: 'Inputs',
    items: [
      { href: '/components/inputs/select-legacy/',      label: 'Select',            badge: 'new' },
      { href: '/components/inputs/dropdown-legacy/',    label: 'DropDown (legacy)', badge: 'new' },
      { href: '/components/inputs/language-selector/',  label: 'LanguageSelector',  badge: 'new' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { href: '/components/feedback/rating-legacy/',  label: 'Rating',     badge: 'new' },
      { href: '/components/feedback/star-rating/',    label: 'StarRating', badge: 'new' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { href: '/components/navigation/navigation-bar/',         label: 'NavigationBar',       badge: 'new' },
      { href: '/components/navigation/navigation-bar-mobile/',  label: 'NavigationBarMobile', badge: 'new' },
    ],
  },
  {
    label: 'Legacy',
    collapsed: true,
    items: [
      { href: '/components/legacy/long-term-scheduling/',     label: 'LongTermScheduling',     badge: 'new' },
      { href: '/components/legacy/student-profile/',           label: 'StudentProfile',         badge: 'new' },
      { href: '/components/legacy/student-profile-bar-mobile/', label: 'StudentProfileBarMobile', badge: 'new' },
      { href: '/components/legacy/flash-button/',              label: 'FlashButton',            badge: 'new' },
      { href: '/components/legacy/reschedule-legacy/',         label: 'Reschedule',             badge: 'new' },
      { href: '/components/legacy/badges-section/',            label: 'Badges (section)',       badge: 'new' },
      { href: '/components/legacy/teacher-search/',            label: 'TeacherSearch',          badge: 'new' },
      { href: '/components/legacy/referral-card-legacy/',      label: 'ReferralCard (legacy)',  badge: 'new' },
      { href: '/components/legacy/time-zone-display/',         label: 'TimeZone (display)',     badge: 'new' },
    ],
  },
  {
    label: 'Patterns',
    items: [
      { href: '/patterns/',                   label: 'Overview' },
      { href: '/patterns/student-dashboard/', label: 'Student dashboard', badge: 'new' },
      { href: '/patterns/teacher-grading/',   label: 'Teacher grading',   badge: 'caution' },
      { href: '/patterns/landing-hero/',      label: 'Landing hero',      badge: 'new' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/tools/',              label: 'Overview' },
      { href: '/tools/generate/',     label: 'AI Generator',     badge: 'new' },
      { href: '/tools/palette/',      label: 'Palette explorer', badge: 'new' },
      { href: '/tools/contrast/',     label: 'Contrast checker', badge: 'new' },
      { href: '/tools/token-picker/', label: 'Token picker',     badge: 'new' },
    ],
  },
  {
    label: 'Surfaces',
    items: [
      { href: '/surfaces/',                   label: 'Health dashboard',  badge: 'new' },
      { href: '/surfaces/audit-dashboard/',   label: 'Audit dashboard',   badge: 'new' },
      { href: '/surfaces/student/',           label: 'Student overview',  badge: 'new' },
      { href: '/surfaces/student/components/', label: 'Components',        badge: 'new' },
      { href: '/surfaces/student/icons/',     label: 'Icons',             badge: 'new' },
      { href: '/surfaces/student/states/',    label: 'Interactive states', badge: 'new' },
      { href: '/surfaces/nano-skills-audit/', label: 'Nano Skills audit', badge: 'new' },
      { href: '/surfaces/my-feed-audit/',     label: '/my-feed audit',    badge: 'new' },
      { href: '/surfaces/learn-audit/',       label: '/learn audit',      badge: 'new' },
      { href: '/surfaces/badges-audit/',      label: '/badges audit',     badge: 'new' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/whats-new/',                    label: 'Changelog' },
      { href: '/governance/pending-decisions/', label: 'Pending decisions', badge: 'new' },
      { href: '/governance/dc-tickets/',        label: 'DC tickets',        badge: 'new' },
      { href: '/governance/scope-boundary/',    label: 'Scope boundary',    badge: 'new' },
    ],
  },
]
