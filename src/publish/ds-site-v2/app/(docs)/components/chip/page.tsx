import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'chip')!

export const metadata: Metadata = {
  title: 'Chip',
  description: SPEC.description,
}

export default function ChipPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Compact label component. Source SCSS has only a single .root style — the Figma library extends to 12 semantic variants (default + 5 status: brand/success/warning/error/info, plus 6 course verticals: coding/robotics/finance/ai/literature/maths). All semantic and course tokens already exist in the library."
    />
  )
}
