import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Motion',
  description: 'Duration and easing tokens for BrightChamps animations, with reduced-motion rules built in.',
}

export default function MotionPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Foundations"
        title="Motion"
        step={4}
        stepDescription="Duration + easing tokens with demos"
        description="Three durations (fast 120ms, base 200ms, slow 320ms) and one easing curve. Respects prefers-reduced-motion. Not yet extracted from DOM; pending a separate pass through the student app's transitions."
      />
    </div>
  )
}
