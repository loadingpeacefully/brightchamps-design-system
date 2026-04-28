import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'class-details')!

export const metadata: Metadata = {
  title: 'ClassDetails',
  description: SPEC.description,
}

export default function ClassDetailsPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Class info panel — appears in the RightSideBar on 3 of 7 student pages. Source SCSS is minimal (just .userAvatar 37.867×38). The Figma component composes the live state pill, class title, time row, ProfileAvatar instance, and Join button (Button instance) per production usage in ClassJoiningCard."
    />
  )
}
