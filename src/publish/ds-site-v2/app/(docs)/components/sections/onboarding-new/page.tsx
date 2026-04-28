import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'onboarding-new',
  slug: 'onboarding-new',
  description: 'The post-signup wizard. Multi-step flow that captures grade, course interest, schedule preference, and book-a-trial-class. Replaces the legacy onboarding section, hence "-new".',
  sourceFile: 'src/sections/onboarding-new/index.tsx',
  regions: [
    { name: 'Wizard frame',       size: '100% × 100vh',  role: 'overflow:hidden via OnboardingLayout',        token: '— (no chrome)' },
    { name: 'Progress indicator', size: 'inline',         role: 'Step counter / progress dots',                  token: 'ProgressLine + GreenLine atoms' },
    { name: 'Step screens',       size: 'slide region',  role: 'Each step rendered as a screen, slide-transitioned', token: 'space/inset/2xl' },
    { name: 'Bottom action bar',  size: 'sticky bottom', role: 'Primary CTA (next/submit) + skip link',         token: 'Button / contained' },
  ],
  tokens: [
    { property: 'Step background',   token: 'surface/bg/canvas',       cssVar: '--surface-bg-canvas',       value: '#ffffff' },
    { property: 'Step padding',      token: 'space/inset/2xl',          cssVar: '--space-inset-2xl',         value: '32px' },
    { property: 'Heading',           token: 'font/heading/large',       cssVar: '--font-heading-large',      value: 'Nunito 24 / 800' },
    { property: 'Body',              token: 'font/body/medium',         cssVar: '--font-body-medium',        value: 'Nunito 16 / 400' },
    { property: 'Action bar height', token: '—',                        cssVar: '—',                          value: '88px (no token, sticky)' },
  ],
  routes: [
    { route: '/onboarding',          note: 'pageConfig.onboarding.layout = ONBOARDING' },
    { route: '/onboarding/[step]',   note: 'Each wizard step has its own URL for browser-back behavior' },
  ],
  notes: [
    '`screens/` folder holds one TSX per step — they\'re drilled in based on `constants.ts` ordering.',
    'Wizard drives off React state + Redux for the in-flight onboarding profile. Submit posts to /api/onboarding-complete.',
    'The legacy onboarding section (no `-new` suffix) is deprecated; this is the production path.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
