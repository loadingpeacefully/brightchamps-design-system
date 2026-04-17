import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'TDR-0001 · Taxonomy migration',
  description: 'Semantic taxonomy migration from frequency-ranked to role-based token names. Proposed 2026-04-16.',
}

export default function TDR0001Page() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="TDR-0001 · Proposed"
        title="Semantic taxonomy migration"
        step={9}
        stepDescription="TDR index + MDX renderer"
        description="This TDR proposes replacing frequency-ranked token names (color.008) with a semantic taxonomy (color/brand/purple/primary) inspired by Atlassian + Primer + Radix. Dry-run migration ran on 2026-04-16. Currently awaiting design + engineering review before promotion to ADR. The rendered MDX view lands once the TDR index ships."
        next={[
          { href: '/whats-new/', label: 'All updates' },
        ]}
      />
    </div>
  )
}
