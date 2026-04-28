import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'button')!

export const metadata: Metadata = {
  title: 'Button',
  description: SPEC.description,
}

export default function ButtonPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Five production button variants from button.module.scss. The earlier primary/secondary/ghost taxonomy was aspirational — production actually ships contained, outlined, danger, info, and underline. All wired to the Figma library with bound semantic tokens. Two color drifts flagged: danger (#ff8480 vs library #FF5C5C) and info (#60bfbd vs library #33CCFF) — recommend new tickets DC-011 / DC-012."
    />
  )
}
