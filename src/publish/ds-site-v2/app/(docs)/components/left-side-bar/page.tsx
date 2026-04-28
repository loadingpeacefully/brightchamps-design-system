import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'left-side-bar')!

export const metadata: Metadata = {
  title: 'LeftSideBar',
  description: SPEC.description,
}

export default function LeftSideBarPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 1 chrome"
      overview="The 104px chrome rail on the left edge of every authenticated student dashboard page. Production reality is a thin wrapper that hosts <NavigationBar /> — no styling of its own, no background. Lives in dashboardLayout.module.scss as .leftArea."
    />
  )
}
