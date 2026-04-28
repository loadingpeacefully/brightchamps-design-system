import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'toggle-switch')!

export const metadata: Metadata = {
  title: 'ToggleSwitch',
  description: SPEC.description,
}

export default function ToggleSwitchPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Segmented toggle pill from production. White rounded container with two pill segments — active uses brand-purple bg, inactive is transparent with muted text. Optional shadow variant. Used on Badges and Chatbot pages (3/7)."
    />
  )
}
