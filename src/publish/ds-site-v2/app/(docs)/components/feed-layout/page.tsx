import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'feed-layout')!

export const metadata: Metadata = {
  title: 'FeedLayout',
  description: SPEC.description,
}

export default function FeedLayoutPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Feed container from FeedLayout.module.scss. 682px max-width centered (note: narrower than the 880px main content area). 6 variants: my-feed / global-feed × populated / empty / loading. Populated state uses real Card instances — swapping the Card variant cascades through every feed."
    />
  )
}
