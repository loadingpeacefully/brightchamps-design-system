import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'tray')!

export const metadata: Metadata = {
  title: 'Tray',
  description: SPEC.description,
}

export default function TrayPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 3 feature-specific"
      overview="Bottom tray notification that overlaps the card above (margin-top -17px). Top corners flat, bottom corners rounded — designed to attach beneath a sibling card. Purple-alpha background with dark 12/800 text and a Button instance for the action."
    />
  )
}
