import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'module-header')!

export const metadata: Metadata = {
  title: 'ModuleHeader',
  description: SPEC.description,
}

export default function ModuleHeaderPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Sticky module header on the learn page. Gradient outer wrapper (purple-to-blue) contains a brand-purple inner container with white title, white-alpha subtitle, and an embedded ProgressBar instance. Used once per module on the learn surface."
    />
  )
}
