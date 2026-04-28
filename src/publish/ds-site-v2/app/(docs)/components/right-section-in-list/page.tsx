import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'right-section-in-list')!

export const metadata: Metadata = {
  title: 'RightSectionInList',
  description: SPEC.description,
}

export default function RightSectionInListPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Right-side row content on the learn page (paired with LeftSectionInList — 69 elements / 1 page, the highest-usage unspecced component until now). Variants: score readout, duration text + arrow, joinNow button, completed-icon overlay. The joinNow bg in production is #4D3BC2 — the DC-008 typo of #4E3BC2 — confirmed live."
    />
  )
}
