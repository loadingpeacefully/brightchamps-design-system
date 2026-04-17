import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Tokens · Color',
  description: 'Machine-readable color token reference with filter, search, and copy actions.',
}

export default function TokensColorPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Tokens · Reference"
        title="Color tokens"
        step={5}
        stepDescription="All-tokens index with filter, search, and export"
        description="A machine-readable reference for every color token, filterable by category, tier, and surface. Until this lands, the Color foundation renders the same data grouped semantically for browsing."
        next={[
          { href: '/foundations/color/', label: 'Color foundation (live)' },
        ]}
      />
    </div>
  )
}
