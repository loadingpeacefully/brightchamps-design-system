import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Drift review · 2026-04-16',
  description: 'First authenticated drift report for the student surface. 417 items across 65 matches, 37 drifts, 159 unknowns, and 2 system gaps.',
}

export default function DriftReport20260416Page() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Drift report · Historical"
        title="2026-04-16 · Student app"
        step={8}
        stepDescription="Drift review UI with approve / reject / defer controls"
        description="First authenticated drift report for the student surface. 417 items: 65 matches (16% exact), 37 drifts, 63 missing from DOM, 159 unknowns, 2 system gaps. The report JSON lives in ledger/drift/2026-04-16.json; this page renders it with approval controls once the drift review UI ships."
        next={[
          { href: '/foundations/color/', label: 'Live color tokens' },
          { href: '/whats-new/', label: 'All updates' },
        ]}
      />
    </div>
  )
}
