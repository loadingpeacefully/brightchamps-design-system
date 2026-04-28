import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'card')!

export const metadata: Metadata = {
  title: 'Card',
  description: SPEC.description,
}

export default function CardPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Base content container from card.module.scss. 280px min-width, 16px border-radius ($border-radius-medium), white bg. The Figma component has 4 variants (base / with-image / elevated / lesson) and uses real Button instances for the footer CTA — when you swap a Button variant, the Card's CTA updates everywhere."
    />
  )
}
