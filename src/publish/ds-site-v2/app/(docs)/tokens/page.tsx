import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Browseable index of every canonical token: color, typography, space, radius, shadow, motion.',
}

export default function TokensIndex() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Reference"
        title="Tokens"
        step={5}
        stepDescription="All-tokens index with filter + search"
        description="A single browseable index of every canonical token across color, typography, space, radius, shadow, and motion. Filterable by category, tier, and surface. Until this is built, use the foundations page for each type — the color foundation lands in this session."
        next={[
          { href: '/foundations/color/', label: 'Color (live with real tokens)' },
          { href: '/foundations/', label: 'Foundations overview' },
        ]}
      />
    </div>
  )
}
