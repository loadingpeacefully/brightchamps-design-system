import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Radius',
  description: 'Border-radius scale from sharp edges to fully pill-shaped controls.',
}

export default function RadiusPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Foundations"
        title="Radius"
        step={4}
        stepDescription="Radius scale + live preview"
        description="A t-shirt scale from radius/none to radius/full, plus radius/pill for capsule-shaped controls. Twenty-nine extracted values from DOM — most fold cleanly onto the canonical scale."
      />
    </div>
  )
}
