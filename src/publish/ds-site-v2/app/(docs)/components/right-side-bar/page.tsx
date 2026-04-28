import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'right-side-bar')!

export const metadata: Metadata = {
  title: 'RightSideBar',
  description: SPEC.description,
}

export default function RightSideBarPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 1 chrome"
      overview="The 460px right context panel on every authenticated student dashboard page. Hosts ProfileCard by default — student name, grade, certificates, switch-profile link. Can also show class info, teacher profile, or BrightBuddy chat panel depending on route."
    />
  )
}
