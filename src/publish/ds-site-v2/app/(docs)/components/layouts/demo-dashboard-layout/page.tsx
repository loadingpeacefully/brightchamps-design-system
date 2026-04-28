import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'DemoDashboardLayout',
  slug: 'demo-dashboard-layout',
  description: 'Shell for the post-demo authenticated dashboard. Mirrors DashboardLayout but with a 432px right area and a smooth-scroll behavior. Used for /demo-dashboard-post and the post-trial onboarding flow.',
  sourceFile: 'src/layouts/DemoDashboardLayout/demoDashboardLayout.module.scss',
  regions: [
    { name: 'root',           size: 'max-w 1440px', role: 'Outer page frame, centered',                token: 'chrome/page-max' },
    { name: 'leftArea',       size: '104px',         role: 'NavigationBar rail (icon-only)',           token: 'chrome/sidebar-rail' },
    { name: 'mainWrapper',    size: 'flex-grow',     role: 'Scrolling main, height 101.8vh, smooth scroll', token: 'surface/bg/sunken' },
    { name: 'mainContentArea', size: 'max-w 880px',  role: 'Centered content column',                  token: 'chrome/main-content-max' },
    { name: 'rightArea',      size: '432px',         role: 'Right panel (different from DashboardLayout 460px)', token: '— (no token, see drift)' },
  ],
  tokens: [
    { property: 'Page max-width',          token: 'chrome/page-max',         cssVar: '--chrome-page-max',         value: '1440px' },
    { property: 'Left rail width',         token: 'chrome/sidebar-rail',     cssVar: '--chrome-sidebar-rail',     value: '104px' },
    { property: 'Main wrapper background', token: 'surface/bg/sunken',       cssVar: '--surface-bg-sunken',       value: '#f5f4fa (DC-016)' },
    { property: 'Main wrapper padding',    token: 'space/inset/2xl + space/inset/xl', cssVar: '--space-inset-2xl, --space-inset-xl', value: '32px 24px' },
    { property: 'Right panel padding',     token: 'space/inset/lg',          cssVar: '--space-inset-lg',          value: '20px' },
  ],
  routes: [
    { route: '/demo-dashboard-post', note: 'pageConfig.demo-dashboard-post.layout = DEMODASHBOARD' },
  ],
  notes: [
    'Identical to DashboardLayout except: rightArea is 432px (not 460px), mainWrapper height is 101.8vh (not 100vh), and `scroll-behavior: smooth` is applied.',
  ],
  drift: [
    'rightArea = 432px in this layout vs 460px in DashboardLayout. The 28px delta is unintentional — both should bind to chrome/right-panel = 460px or a new chrome/right-panel-narrow = 432px token. Open question for design team.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
