import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'self-paced-hero')!

export const metadata: Metadata = {
  title: SPEC.name,
  description: SPEC.description,
}

export default function Page() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · NanoSkills surface"
      overview={SPEC.description}
    />
  )
}
