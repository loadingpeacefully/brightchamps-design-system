import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Elevation',
  description: 'Tonal surfaces and shadow scales for visual layering and depth.',
}

export default function ElevationPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Foundations"
        title="Elevation"
        step={4}
        stepDescription="Surface tiers + shadow ramp"
        description="Material-3-inspired tonal elevation: surface/lowest through surface/highest, paired with a shadow ramp (shadow/1 through shadow/5). Ten canonical shadow tokens already live in the ledger."
      />
    </div>
  )
}
