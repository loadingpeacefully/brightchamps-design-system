import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'GameDashboardLayout',
  slug: 'game-dashboard-layout',
  description: 'Minimal full-viewport layout for the gamified dashboard surface. The Game Dashboard runs Poppins (not Nunito) — a per-surface CSS override, NOT a token change.',
  sourceFile: 'src/layouts/GameDashboardLayout/gameDashboardLayout.module.scss',
  regions: [
    { name: 'root', size: '100% × 100vh', role: 'Single full-viewport container; the GameDashboard surface manages its own layout' },
  ],
  tokens: [
    { property: 'Width',  token: '—', cssVar: '—', value: '100%' },
    { property: 'Height', token: '—', cssVar: '—', value: '100vh' },
  ],
  routes: [
    { route: '/game-dashboard', note: 'pageConfig.game-dashboard.layout = GAME_DASHBOARD' },
  ],
  notes: [
    'GameDashboard is the only surface in the app that uses Poppins font. Override is applied via the surface\'s own root SCSS — the layout itself stays Nunito-agnostic.',
    'No chrome. The Game Dashboard owns its own canvas, navigation, and scrolling.',
  ],
  drift: [
    'Poppins on a Nunito-only design system is documented as a per-surface override, not a token. If Poppins becomes broader, file a TDR and add font/family/secondary to the typography primitives.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
