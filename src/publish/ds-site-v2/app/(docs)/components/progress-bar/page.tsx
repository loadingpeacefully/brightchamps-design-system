import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'progress-bar')!

export const metadata: Metadata = {
  title: 'ProgressBar',
  description: SPEC.description,
}

export default function ProgressBarPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Horizontal progress bar with 5 status variants matching production: default, in-progress (#6651E4), completed (#11ac69), skipped (#ff752c), paused (#3b9af5). 10px tall with pill ends. Three of these colors collide with library values — DC-005 / DC-009 / DC-010 conflicts annotated on the component spec."
    />
  )
}
