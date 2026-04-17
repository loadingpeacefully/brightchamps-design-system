import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: "What's new",
  description: 'Changelog of the BrightChamps design system: accepted TDRs, drift reports, token changes, and releases.',
}

export default function WhatsNew() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Governance"
        title="What's new"
        step={9}
        stepDescription="TDR index + auto-generated changelog"
        description="The changelog will pull accepted Token Decision Records and npm release notes into a reverse-chronological feed. Until then, the landing page carries the most recent system events."
        next={[
          { href: '/', label: 'See recent events on the home page' },
          { href: '/tdr/', label: 'Token Decision Records (coming soon)' },
        ]}
      />
    </div>
  )
}
