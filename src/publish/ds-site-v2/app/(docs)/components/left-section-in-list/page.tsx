import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'left-section-in-list')!

export const metadata: Metadata = {
  title: 'LeftSectionInList',
  description: SPEC.description,
}

export default function LeftSectionInListPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Left-side row content on the learn page (paired with RightSectionInList — 36 elements / 1 page). Title image (72×59, radius 4), lesson title (18/700 #222A33), purple-alpha tags, and an optional completedTag (#EAFFEC bg, #238B2E text — yet a fourth green not in the ledger; new ticket DC-014 candidate)."
    />
  )
}
