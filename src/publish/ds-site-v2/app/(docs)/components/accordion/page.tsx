import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'accordion')!

export const metadata: Metadata = {
  title: 'Accordion',
  description: SPEC.description,
}

export default function AccordionPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Expandable lesson/milestone container. Production has two variants: default (lesson grouping with neutral text) and milestone (with brand-purple status pill, used in PracticeZone). Built into the Figma library with 4 state×variant combinations. The milestone variant pulls in the DC-005 brand-purple conflict via its status text."
    />
  )
}
