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

// Only keep links that have pages. Unbuilt routes are disabled (muted, not clickable)
// so the sidebar reads as a complete system without creating 404s.
export const NAV: NavSection[] = [
  {
    label: 'Get started',
    items: [
      { href: '/get-started/',            label: 'Overview',        badge: 'beta' },
      { href: '/get-started/design/',     label: 'For designers',   badge: 'new' },
      { href: '/get-started/develop/',    label: 'For engineers',   badge: 'new' },
      { href: '/get-started/contribute/', label: 'Contributing',    badge: 'new' },
      { href: '/get-started/decisions/',  label: 'Decisions',       badge: 'new' },
      { href: '/get-started/glossary/',   label: 'Glossary',        badge: 'new' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { href: '/foundations/',           label: 'Overview' },
      { href: '/foundations/color/',     label: 'Color',          badge: 'new' },
      { href: '/foundations/typography/', label: 'Typography',    badge: 'new' },
      { href: '/foundations/spacing/',   label: 'Spacing',        badge: 'new' },
      { href: '/foundations/elevation/', label: 'Elevation',      disabled: true, badge: 'beta' },
      { href: '/foundations/radius/',    label: 'Radius',         badge: 'new' },
      { href: '/foundations/iconography/', label: 'Iconography',  badge: 'new' },
      { href: '/foundations/motion/',    label: 'Motion',         badge: 'new' },
    ],
  },
  {
    label: 'Tokens',
    items: [
      { href: '/tokens/',                label: 'All tokens' },
      { href: '/tokens/color/',          label: 'Color',          badge: 'new' },
      { href: '/tokens/font/',           label: 'Font',           badge: 'new' },
      { href: '/tokens/space/',          label: 'Space',          badge: 'new' },
      { href: '/tokens/radius/',         label: 'Radius',         badge: 'new' },
      { href: '/tokens/shadow/',         label: 'Shadow',         badge: 'new' },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '/components/',                label: 'Overview' },
      { href: '/components/button/',         label: 'Button',        badge: 'new' },
      { href: '/components/accordion/',      label: 'Accordion',     badge: 'new' },
      { href: '/components/progress-line/',  label: 'ProgressLine',  badge: 'new' },
      { href: '/components/green-line/',     label: 'GreenLine',     badge: 'new' },
      { href: '/components/lesson-list/',    label: 'LessonList',    badge: 'new' },
      { href: '/components/layout/',         label: 'Layout',        badge: 'new' },
      { href: '/components/card/',           label: 'Card',          badge: 'new' },
      { href: '/components/input/',          label: 'Input',         disabled: true, badge: 'beta' },
    ],
  },
  {
    label: 'Layouts',
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
    items: [
      { href: '/components/sections/welcome-kit/',             label: 'WelcomeKit',                 badge: 'new' },
      { href: '/components/sections/select-profile/',          label: 'SelectProfile',              badge: 'new' },
      { href: '/components/sections/onboarding-new/',          label: 'onboarding-new',             badge: 'new' },
      { href: '/components/sections/teacher-profile-section/', label: 'TeacherProfileSection',      badge: 'new' },
      { href: '/components/sections/referral-section/',        label: 'ReferralSection',            badge: 'new' },
      { href: '/components/sections/game-dashboard-page/',     label: 'GameDashboardPage',          badge: 'new' },
    ],
  },
  {
    label: 'Patterns',
    items: [
      { href: '/patterns/',              label: 'Overview' },
      { href: '/patterns/student-dashboard/', label: 'Student dashboard', badge: 'new' },
      { href: '/patterns/teacher-grading/',   label: 'Teacher grading',   badge: 'caution' },
      { href: '/patterns/landing-hero/',      label: 'Landing hero',      badge: 'new' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/tools/',                 label: 'Overview' },
      { href: '/tools/generate/',        label: 'AI Generator',      badge: 'new' },
      { href: '/tools/palette/',         label: 'Palette explorer',  badge: 'new' },
      { href: '/tools/contrast/',        label: 'Contrast checker',  badge: 'new' },
      { href: '/tools/token-picker/',    label: 'Token picker',      badge: 'new' },
    ],
  },
  {
    label: 'Surfaces',
    items: [
      { href: '/surfaces/',                        label: 'Health dashboard',  badge: 'new' },
      { href: '/surfaces/student/',                label: 'Student overview',  badge: 'new' },
      { href: '/surfaces/student/components/',     label: 'Components',        badge: 'new' },
      { href: '/surfaces/student/icons/',          label: 'Icons',             badge: 'new' },
      { href: '/surfaces/student/states/',         label: 'Interactive states', badge: 'new' },
      { href: '/surfaces/student/landing/',        label: 'Landing',           disabled: true },
      { href: '/surfaces/student/teacher/',        label: 'Teacher',           disabled: true },
      { href: '/surfaces/student/admin/',          label: 'Admin',             disabled: true },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/whats-new/',             label: 'Changelog' },
      { href: '/tdr/',                   label: 'Token decision records', disabled: true },
      { href: '/drift-review/',          label: 'Drift review',           disabled: true, badge: 'beta' },
    ],
  },
]
