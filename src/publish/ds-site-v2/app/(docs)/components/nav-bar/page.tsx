import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'nav-bar')!

export const metadata: Metadata = {
  title: 'NavBar',
  description: SPEC.description,
}

export default function NavBarPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 1 chrome"
      overview="Icon rail navigation. Collapses to 80px (icons only), expands to 280px on hover via overlay. Hosts the brand logo, a single nav item (Dashboard, per the real navData), and a BrightBuddy chatbot at the bottom."
    />
  )
}
