import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'WelcomeKit',
  slug: 'welcome-kit',
  description: 'Post-demo welcome carousel + downloadable PDF kit. Surfaces immediately after a parent completes their first booking. Composes WelcomeKitCard tiles, a react-slick carousel, and an html2pdf-driven downloadable WelcomeToBrightCHAMPS PDF.',
  sourceFile: 'src/sections/WelcomeKit/index.tsx',
  regions: [
    { name: 'Hero',                  size: 'full-width',          role: 'BrightChamps logo + WELCOME_KIT_TOP_BG_MOBILE + rocket art', token: 'surface/bg/brand' },
    { name: 'Carousel',               size: 'max-w 880px',        role: 'react-slick carousel of welcomeKitCarousel slides',          token: 'space/inset/lg + radius/container/lg' },
    { name: 'WelcomeKitCard grid',    size: 'auto-grid',           role: 'welcomeKitComponents tiles — what\'s included, schedule, contact', token: 'radius/card + shadow/sm' },
    { name: 'PDF download CTA',       size: 'inline',              role: 'Triggers html2pdf via HTML2PDF_CDN_URL',                       token: 'Button / contained' },
    { name: 'Copyright row',          size: 'full-width',          role: 'COPY_RIGHT_ICON + footer text',                               token: 'text/muted, font/body/xsmall' },
  ],
  tokens: [
    { property: 'Background',         token: 'surface/bg/canvas',   cssVar: '--surface-bg-canvas',   value: 'var fallback to #fff' },
    { property: 'Hero band background', token: 'surface/bg/brand',  cssVar: '--surface-bg-brand',    value: 'DC-005 brand purple' },
    { property: 'Card padding',       token: 'space/inset/lg',      cssVar: '--space-inset-lg',      value: '20px' },
    { property: 'Card radius',        token: 'radius/card',          cssVar: '--radius-card',         value: '10px' },
    { property: 'Card shadow',        token: 'shadow/sm',            cssVar: '--shadow-sm',           value: '0 1px 2px rgba(13,29,45,.06)' },
  ],
  routes: [
    { route: '/welcome-kit',     note: 'Direct route after first booking + email click-through' },
    { route: '/post-demo/kit',   note: 'Aliased entry from email CTA' },
  ],
  notes: [
    'Pulls postDemoDetails via useQuery → getPostDemoDetails(). Loader renders during fetch.',
    'PDF generation is client-only (html2pdf via CDN). Reads the WelcomeToBrightCHAMPS component as the printable surface.',
    'WelcomeKitCard pattern composes Image + heading + body + tag — generic enough to migrate to a Card variant in the library.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
