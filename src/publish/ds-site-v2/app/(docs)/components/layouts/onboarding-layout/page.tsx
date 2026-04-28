import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'OnboardingLayout',
  slug: 'onboarding-layout',
  description: 'Single-viewport overflow-hidden frame for the onboarding wizard. The wizard owns its own internal slide transitions and progress indicator — the layout is just a non-scrolling container.',
  sourceFile: 'src/layouts/OnboardingLayout/OnboardingLayout.module.scss',
  regions: [
    { name: 'root', size: '100% × 100vh', role: 'Non-scrolling container; the onboarding wizard manages its own viewports' },
  ],
  tokens: [
    { property: 'Width',    token: '—', cssVar: '—', value: '100%' },
    { property: 'Height',   token: '—', cssVar: '—', value: '100vh' },
    { property: 'Overflow', token: '—', cssVar: '—', value: 'hidden (no scroll, internal panels scroll)' },
  ],
  routes: [
    { route: '/onboarding',         note: 'pageConfig.onboarding.layout = ONBOARDING' },
    { route: '/onboarding/[step]',  note: 'sub-step routes inherit layout' },
  ],
  notes: [
    'overflow: hidden is critical — the wizard slide transitions count on a static viewport.',
    'No tokens because the wizard fills 100% × 100vh and provides its own bg / typography per step.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
