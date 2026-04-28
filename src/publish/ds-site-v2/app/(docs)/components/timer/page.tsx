import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'timer')!

export const metadata: Metadata = {
  title: 'Timer',
  description: SPEC.description,
}

export default function TimerPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Countdown timer pill with a sand-timer icon and time text. Three states: counting (brand-tinted), expired (error-tinted), paused (disabled-tinted). Source SCSS is minimal (just typography + icon spacing); the Figma component bakes in the pill chrome that's common in class-joining and demo-class flows."
    />
  )
}
