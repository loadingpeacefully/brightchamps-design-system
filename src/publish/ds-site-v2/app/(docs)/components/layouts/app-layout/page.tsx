import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'AppLayout',
  slug: 'app-layout',
  description: 'Outer shell selected by `pageLayoutConfig.ts` for every authenticated student route. Reads the route key, then dispatches to one of the 8 concrete layouts (DashboardLayout, FullWidthLayout, FullScreenLayout, etc.). Has no SCSS of its own — it\'s a thin TS dispatcher around `LayoutProviders`.',
  sourceFile: 'src/layouts/AppLayout/index.tsx',
  regions: [
    { name: 'AppLayout', size: 'wraps page', role: 'Reads `pageConfig[currentRoute].layout`, dispatches' },
    { name: 'LayoutProviders', size: 'inline', role: 'Per-route Redux/auth/toast/error-boundary providers' },
  ],
  tokens: [],
  routes: [
    { route: 'EVERY authenticated route', note: 'AppLayout is the umbrella; the concrete layout is per-route' },
  ],
  notes: [
    'AppLayout itself emits no markup — it\'s a router that picks one of: DASHBOARD, DEMODASHBOARD, LOGIN, FULLWIDTH, FULLSCREEN, ONBOARDING, GAME_DASHBOARD, NewDashboardLayout, FeedLayout.',
    'Per-route provider toggles (enableRedux / enableToast / enableErrorBoundaries / enableTimeDiff / etc.) live on `pageConfig[route].providers`. See pageLayoutConfig spec page for the full list.',
  ],
}

export const metadata: Metadata = {
  title: SPEC.name,
  description: SPEC.description,
}

export default function Page() {
  return <LayoutSpecPage spec={SPEC} />
}
