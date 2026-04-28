import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Layouts',
  name: 'LoginLayout',
  slug: 'login-layout',
  description: 'Two-column 60/40 split. Left = brand-purple panel with logo + kid hero illustration; Right = login form. Below 1200px the left panel collapses, leaving the right form full-width.',
  sourceFile: 'src/layouts/LoginLayout/loginLayout.module.scss',
  regions: [
    { name: 'root',            size: 'flex',                       role: 'Two-column container' },
    { name: 'leftContainer',   size: 'flex 60% / 100vh',           role: 'Brand panel with logo + hero', token: 'surface/bg/brand' },
    { name: 'blobImgContainer', size: 'absolute top:0 left:0',     role: 'Decorative blob shape' },
    { name: 'logoContainer',   size: 'absolute top:26 left:36',    role: 'BrightChamps logo placement' },
    { name: 'kidImgContainer', size: '100% × 100% (object-cover)', role: 'Hero kid illustration' },
    { name: 'rightContainer',  size: 'flex 40% / 100vh',           role: 'Form column', token: 'surface/bg/default' },
  ],
  tokens: [
    { property: 'Left container background', token: 'surface/bg/brand',    cssVar: '--surface-bg-brand',    value: 'get-color(primary-color) → #4e3bc2 (DC-005)' },
    { property: 'Logo top offset',           token: '—',                   cssVar: '—',                     value: '26px' },
    { property: 'Logo left offset',          token: '—',                   cssVar: '—',                     value: '36px' },
    { property: 'Mobile breakpoint',         token: '—',                   cssVar: '—',                     value: '1200px (left collapses below)' },
  ],
  routes: [
    { route: '/login',          note: 'pageConfig.login.layout = LOGIN' },
    { route: '/signup',         note: 'inferred from layout name' },
    { route: '/forgot-password',note: 'inferred from layout name' },
  ],
  notes: [
    'The 26 / 36px logo offsets are non-token but consistent across login flows. Could become chrome/login-logo-offset if reused elsewhere.',
    'Below 1200px the brand panel hides — login becomes a centered single-column form.',
  ],
  drift: [
    'leftContainer background-color via SCSS get-color(primary-color) → resolves to production #4e3bc2. Library-bound to surface/bg/brand which targets designer intent #722ED1 (DC-005). Brand sign-off blocks the convergence.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
