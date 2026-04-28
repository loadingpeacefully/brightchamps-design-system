import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'dashboard-layout')!

export const metadata: Metadata = {
  title: 'DashboardLayout',
  description: SPEC.description,
}

export default function DashboardLayoutPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 1 chrome"
      overview="The 3-column shell that wraps every authenticated student dashboard page. 104px nav rail (left) + flex-grow main wrapper (centered 880px content) + 460px right context panel. Production-faithful from dashboardLayout.module.scss; uses real instances of NavBar, LeftSideBar, and RightSideBar in the Figma library."
    />
  )
}
