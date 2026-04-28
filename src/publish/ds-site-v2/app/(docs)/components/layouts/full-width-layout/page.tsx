import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'FullWidthLayout',
  slug: 'full-width-layout',
  description: 'No-chrome edge-to-edge layout. The page itself owns its full chrome. Used for /accounts, /demo-dashboard, and other surfaces that handle their own navigation (e.g. landing-style demo pages).',
  sourceFile: 'src/layouts/FullWidthLayout/fullWidthLayout.module.scss',
  regions: [
    { name: 'root', size: '100% × 100vh', role: 'Single scrollable container, Nunito font enforced via !important' },
  ],
  tokens: [
    { property: 'Width',           token: '—',  cssVar: '—',  value: '100%' },
    { property: 'Height',          token: '—',  cssVar: '—',  value: '100vh' },
    { property: 'Overflow',        token: '—',  cssVar: '—',  value: 'auto' },
    { property: 'Font family',     token: 'font/family/primary', cssVar: '--font-family-primary', value: 'Nunito (forced via !important)' },
    { property: 'Scrollbar width', token: '—',  cssVar: '—',  value: '0 (hidden via webkit-scrollbar)' },
  ],
  routes: [
    { route: '/accounts',           note: 'pageConfig.accounts.layout = FULLWIDTH' },
    { route: '/demo-dashboard',     note: 'pageConfig.demo-dashboard.layout = FULLWIDTH' },
  ],
  notes: [
    'No left rail, no right panel. The route owns its own NavigationBar instance if it wants one.',
    'The `font-family !important` override prevents nested third-party widgets (e.g. Stripe Elements) from leaking their own font.',
    'Hidden scrollbars are intentional — content uses scroll-snap or its own scroll containers.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
