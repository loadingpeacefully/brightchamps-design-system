import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'SelectProfile',
  slug: 'select-profile',
  description: 'Multi-child profile picker shown after parent login. Lists each enrolled student as a NewProfileCard with avatar, name, age, course tag. Supports parent-vs-child profile dispatch + brand-new account-onboarding sub-flow (NewAccountSelectProfile).',
  sourceFile: 'src/sections/SelectProfile/index.tsx',
  regions: [
    { name: 'Hero',                  size: 'full-width',     role: 'BrightChamps logo + LOGIN_UFO ornament + LOGIN_BOTTOM_DESIGN' },
    { name: 'Card grid',              size: 'max-w 880px',   role: 'NewProfileCard list — one per student',  token: 'space/inset/md + radius/card' },
    { name: 'Parent profile CTA',     size: 'inline',         role: 'parentProfile sub-flow trigger' },
    { name: 'New account hint',       size: 'inline',         role: 'NewAccountSelectProfile when no children registered' },
  ],
  tokens: [
    { property: 'Card background',    token: 'surface/bg/default', cssVar: '--surface-bg-default', value: '#ffffff' },
    { property: 'Card padding',       token: 'space/inset/md',     cssVar: '--space-inset-md',     value: '16px' },
    { property: 'Card radius',        token: 'radius/card',         cssVar: '--radius-card',        value: '10px' },
    { property: 'Avatar size',        token: 'icon/size/2xl',       cssVar: '--icon-size-2xl',      value: '64px' },
    { property: 'Heading',            token: 'font/heading/medium', cssVar: '--font-heading-medium', value: 'Nunito 18 / 700' },
  ],
  routes: [
    { route: '/select-profile', note: 'Always reached post-login if multi-child account' },
  ],
  notes: [
    'Uses BOY_PROFILE_PIC / GIRL_PROFILE_PIC / PREFER_NOT_TO_SAY_PROFILE_PIC defaults when student has no uploaded avatar.',
    'Dispatches to /dashboard with selected student persisted in StudentListContext + Redux store via getStudentsAction.',
    'NewProfileCard is currently inlined; candidate to extract as a profile-card molecule.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
