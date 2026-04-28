import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'locked-module-container')!

export const metadata: Metadata = {
  title: 'LockedModuleContainer',
  description: SPEC.description,
}

export default function LockedModuleContainerPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Locked/premium module wrapper on the learn page. White card with 72×72 lock icon, h3 title, module-name chip, and a Book Now button (Button instance). Decorative diagonal yellow lockStrip flag indicates premium content."
    />
  )
}
