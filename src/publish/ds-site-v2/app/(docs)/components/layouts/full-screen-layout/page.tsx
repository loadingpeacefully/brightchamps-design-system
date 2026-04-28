import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'FullScreenLayout',
  slug: 'full-screen-layout',
  description: 'Edge-to-edge layout with a 72px left rail and a white background gradient. Used for live-class joining flows and full-screen activity surfaces. Below 1224px the rail collapses and a mobile top-nav (88px) replaces it.',
  sourceFile: 'src/layouts/FullScreenLayout/fullScreenLayout.module.scss',
  regions: [
    { name: 'root',          size: 'max-w 1440px',                       role: 'Outer page frame',                token: 'chrome/page-max' },
    { name: 'leftArea',      size: '72px (≥1224px) / hidden (<1224px)',  role: 'Compact left rail',               token: '— (variant of chrome/sidebar-rail)' },
    { name: 'mainWrapper',   size: 'flex-grow',                          role: 'Full-bleed white surface, ml 16px', token: 'surface/bg/default (linear-gradient stub)' },
    { name: 'mobileNavWrapper', size: '88px top (mobile)',              role: 'Mobile-only top nav',             token: '— (DC-031 candidate)' },
  ],
  tokens: [
    { property: 'Page max-width',           token: 'chrome/page-max',     cssVar: '--chrome-page-max',     value: '1440px' },
    { property: 'Main wrapper background',  token: 'surface/bg/default',  cssVar: '--surface-bg-default',  value: '#ffffff' },
    { property: 'Main wrapper padding',     token: 'space/inset/2xl + space/inset/xl', cssVar: '--space-inset-2xl, --space-inset-xl', value: '32px 24px' },
    { property: 'Left rail width',          token: '—',                   cssVar: '—',                     value: '72px (no token; smaller than chrome/sidebar-rail)' },
    { property: 'Mobile top-nav height',    token: '—',                   cssVar: '—',                     value: '88px (no token)' },
  ],
  routes: [
    { route: '/live-class',           note: 'Tier-5 inferred (not yet wired in pageLayoutConfig sample)' },
    { route: '/full-screen-activity', note: 'Tier-5 inferred' },
  ],
  notes: [
    'Background uses a linear-gradient(0deg, #fff 0%, #fff 100%) — effectively a solid white. Likely a vestige of an earlier gradient experiment.',
  ],
  drift: [
    'Left rail = 72px here vs 104px in DashboardLayout. Two different rail widths exist in production. Either bind both to chrome/sidebar-rail-compact + chrome/sidebar-rail or document the variance as intentional per-layout.',
    'Mobile breakpoint = 1224px. This conflicts with the rest of the system using 768px / 1024px breakpoints. DC-031 candidate.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
