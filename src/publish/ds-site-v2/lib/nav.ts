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
      { href: '/get-started/design/',     label: 'For designers',   disabled: true },
      { href: '/get-started/develop/',    label: 'For engineers',   disabled: true },
      { href: '/get-started/contribute/', label: 'Contributing',    disabled: true },
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
      { href: '/foundations/radius/',    label: 'Radius',         disabled: true },
      { href: '/foundations/iconography/', label: 'Iconography',  badge: 'new' },
      { href: '/foundations/motion/',    label: 'Motion',         disabled: true, badge: 'beta' },
    ],
  },
  {
    label: 'Tokens',
    items: [
      { href: '/tokens/',                label: 'All tokens' },
      { href: '/tokens/color/',          label: 'Color',          disabled: true },
      { href: '/tokens/font/',           label: 'Font',           disabled: true },
      { href: '/tokens/space/',          label: 'Space',          disabled: true },
      { href: '/tokens/radius/',         label: 'Radius',         disabled: true },
      { href: '/tokens/shadow/',         label: 'Shadow',         disabled: true },
    ],
  },
  {
    label: 'Components',
    items: [
      { href: '/components/',            label: 'Overview' },
      { href: '/components/button/',     label: 'Button',         badge: 'new' },
      { href: '/components/card/',       label: 'Card',           disabled: true },
      { href: '/components/input/',      label: 'Input',          disabled: true, badge: 'beta' },
    ],
  },
  {
    label: 'Patterns',
    items: [
      { href: '/patterns/',              label: 'Overview' },
      { href: '/patterns/student-dashboard/', label: 'Student dashboard', disabled: true },
      { href: '/patterns/teacher-grading/',   label: 'Teacher grading',   disabled: true },
      { href: '/patterns/landing-hero/',      label: 'Landing hero',      disabled: true },
    ],
  },
  {
    label: 'Tools',
    items: [
      { href: '/tools/',                 label: 'Overview' },
      { href: '/tools/palette/',         label: 'Palette generator', disabled: true },
      { href: '/tools/contrast/',        label: 'Contrast checker',  disabled: true },
      { href: '/tools/token-picker/',    label: 'Token picker',      disabled: true },
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
