import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'GameDashboardPage',
  slug: 'game-dashboard-page',
  description: 'The MemoryGame surface — a guided memory/match game shown after demo class booking. The only dashboard surface that runs Poppins (not Nunito). Reads bookingUUID + gameId from query params, fetches demo details, dispatches into MemoryGame.',
  sourceFile: 'src/sections/GameDashboardPage/index.tsx',
  regions: [
    { name: 'MemoryGame component', size: '100% × 100vh', role: 'Owns the canvas, score, timer, and modal congratulations',  token: 'Poppins font override' },
  ],
  tokens: [
    { property: 'Width',  token: '—',                       cssVar: '—',                       value: '100% (via GameDashboardLayout)' },
    { property: 'Height', token: '—',                       cssVar: '—',                       value: '100vh (via GameDashboardLayout)' },
    { property: 'Font',   token: 'font/family/secondary',   cssVar: '--font-family-secondary', value: 'Poppins (per-surface override)' },
  ],
  routes: [
    { route: '/game-dashboard?bookingUUID=…&gameId=…', note: 'pageConfig.game-dashboard.layout = GAME_DASHBOARD' },
  ],
  notes: [
    'Pulls demo details via useQuery → getDemoDetails(bookingUUID). On success writes to DemoDashboardDetailContext.',
    'Poppins is enforced by the surface itself — the layout exposes 100vh and the surface decides typography.',
    'No semantic-color tokens — game art uses raw hex inside MemoryGame components. Tier-5 candidate for token migration.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
