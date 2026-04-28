import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'DashboardLayout',
  slug: 'dashboard-layout-v2',
  description: 'The 3-column shell that wraps every authenticated student-dashboard route. Left rail (104px) + scrolling main (flex-grow) + right panel (460px), capped at 1440px max width. Includes a masquerade variant with a different background.',
  sourceFile: 'src/layouts/DashboardLayout/dashboardLayout.module.scss',
  regions: [
    { name: 'root',           size: 'max-w 1440px', role: 'Outer page frame, centered horizontally',         token: 'chrome/page-max' },
    { name: 'leftArea',       size: '104px',         role: 'NavigationBar rail (icon-only)',                  token: 'chrome/sidebar-rail' },
    { name: 'mainWrapper',    size: 'flex-grow',     role: 'Scrolling main content area',                     token: 'surface/bg/sunken (32×24 padding)' },
    { name: 'mainContentArea', size: 'max-w 880px',  role: 'Centered content column inside mainWrapper',      token: 'chrome/main-content-max' },
    { name: 'rightArea',      size: '460px',         role: 'ProfileCard / context panel',                     token: 'chrome/right-panel' },
    { name: 'masWrapper',     size: 'flex-grow',     role: 'Masquerade variant — admin-as-student preview',   token: 'imagekit BG + #f5f4fa fallback (DC-016)' },
  ],
  tokens: [
    { property: 'Page max-width',          token: 'chrome/page-max',         cssVar: '--chrome-page-max',         value: '1440px' },
    { property: 'Left rail width',         token: 'chrome/sidebar-rail',     cssVar: '--chrome-sidebar-rail',     value: '104px' },
    { property: 'Right panel width',       token: 'chrome/right-panel',      cssVar: '--chrome-right-panel',      value: '460px' },
    { property: 'Main content max-width',  token: 'chrome/main-content-max', cssVar: '--chrome-main-content-max', value: '880px' },
    { property: 'Container background',    token: 'surface/bg/default',      cssVar: '--surface-bg-default',      value: '#ffffff' },
    { property: 'Main wrapper background', token: 'surface/bg/sunken',       cssVar: '--surface-bg-sunken',       value: '#f5f4fa (DC-016 candidate)' },
    { property: 'Main wrapper padding',    token: 'space/inset/2xl + space/inset/xl', cssVar: '--space-inset-2xl, --space-inset-xl', value: '32px 24px' },
    { property: 'Right panel padding',     token: 'space/inset/lg',          cssVar: '--space-inset-lg',          value: '20px' },
  ],
  routes: [
    { route: '/dashboard',     note: 'pageConfig key dashboard' },
    { route: '/my-feed',        note: 'student dashboard primary' },
    { route: '/global-feed',    note: 'student dashboard primary' },
    { route: '/learn',          note: 'student dashboard primary' },
    { route: '/badges',         note: 'student dashboard primary' },
    { route: '/certificates',   note: 'student dashboard primary' },
    { route: '/rewards',        note: 'student dashboard primary' },
    { route: '/nano-skills',    note: 'student dashboard primary' },
  ],
  notes: [
    'Hardcoded white container background (line 12) is identical to neutral/100 — token binding is straightforward.',
    'Masquerade variant background-image is admin-only; not part of the canonical token system, kept inline.',
  ],
  drift: [
    'mainWrapper $app-background SCSS var resolves to #f5f4fa — this is DC-016 (lavender app-bg). Bound to surface/bg/sunken in the library; production CSS still references the SCSS variable directly.',
  ],
}

export const metadata: Metadata = {
  title: SPEC.name,
  description: SPEC.description,
}

export default function Page() {
  return <LayoutSpecPage spec={SPEC} />
}
