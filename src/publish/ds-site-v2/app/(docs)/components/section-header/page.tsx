import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'section-header')!

export const metadata: Metadata = {
  title: 'SectionHeader',
  description: SPEC.description,
}

export default function SectionHeaderPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Generic section header from src/components/SectionHeader. Title (24/800) + optional subtitle (16/500) on the left, optional right-side action wrapper. marginBottom 24. Used as a section divider on feed and detail pages."
    />
  )
}
