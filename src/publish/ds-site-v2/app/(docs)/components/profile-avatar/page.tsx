import type { Metadata } from 'next'
import { ComponentSpecPage } from '@/components/chrome/ComponentSpecPage'
import { componentSpecs } from '@/lib/componentSpecs'

const SPEC = componentSpecs.find(c => c.slug === 'profile-avatar')!

export const metadata: Metadata = {
  title: 'ProfileAvatar',
  description: SPEC.description,
}

export default function ProfileAvatarPage() {
  return (
    <ComponentSpecPage
      spec={SPEC}
      kicker="Components · Tier 2 content"
      overview="Circular avatar from ProfileAvatar.module.scss. Production source uses width/height: 100% (sizes come from parent container) with brand-purple bg + white initials when no photo is available. The Figma component provides 5 explicit sizes (xs 24 → xl 80) × 2 types (image, initials) for designer convenience."
    />
  )
}
