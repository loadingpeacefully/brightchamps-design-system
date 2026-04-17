import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Spacing',
  description: '4px base scale for padding, margin, and gap across every BrightChamps surface.',
}

export default function SpacingPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Foundations"
        title="Spacing"
        step={4}
        stepDescription="Scale diagram + live examples"
        description="A 4px base scale running from space/050 (2px) to space/3000 (120px). The extraction captured 157 DOM spacing values — most are CSS shorthand combinations and need cleanup before promotion to canonical. This page lands once the shorthand resolution flagged in FINDING-006 is fixed."
        next={[
          { href: '/foundations/color/', label: 'Color (live with real tokens)' },
          { href: '/foundations/', label: 'Foundations overview' },
        ]}
      />
    </div>
  )
}
