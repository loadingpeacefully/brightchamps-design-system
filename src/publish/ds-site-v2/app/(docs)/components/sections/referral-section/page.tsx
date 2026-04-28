import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'ReferralSection',
  slug: 'referral-section',
  description: 'Referral landing surface — gem-rewards proposition + share CTAs + referral-status list. The /sections/ReferralSection folder ships only the skeleton-loader; the actual section composition is in `myReferrals` (newDashboard molecule) referenced by the legacy section.',
  sourceFile: 'src/sections/ReferralSection/skeletonLoader.tsx',
  regions: [
    { name: 'Skeleton',          size: 'full-width',  role: 'Loading state — replaced once myReferrals data arrives', token: 'shimmer animation preset' },
    { name: 'RewardsReferralCard', size: 'full-width', role: 'Hero promo (uses RewardsReferralCard newDashboard molecule)', token: 'surface/bg/brand + radius/container/lg' },
    { name: 'SharingButtons',     size: 'inline',     role: 'WhatsApp / Copy-link / Email share row',  token: 'icon/size/md + space/inline/md' },
    { name: 'ReferralStatusCard list', size: 'stack',  role: 'Per-referral row showing reward state (sent / signed / paid)', token: 'space/stack/md' },
  ],
  tokens: [
    { property: 'Hero background',   token: 'surface/bg/brand',         cssVar: '--surface-bg-brand',         value: 'DC-005 brand purple' },
    { property: 'Hero radius',       token: 'radius/container/lg',      cssVar: '--radius-container-lg',      value: '14px' },
    { property: 'Skeleton shimmer',  token: 'animation/shimmer/duration', cssVar: '--animation-shimmer-duration', value: '1500ms' },
    { property: 'Status pill bg',    token: 'surface/bg/success/subtle', cssVar: '--surface-bg-success-subtle', value: '#11AC69 @ 12% — DC-009' },
  ],
  routes: [
    { route: '/refer-and-earn', note: 'Primary referral landing' },
    { route: '/rewards/refer',  note: 'Aliased entry from rewards tab' },
  ],
  notes: [
    'The section folder itself is nearly empty (just skeleton). Real composition lives in myReferrals + RewardsReferralCard newDashboard molecules. Documentation here records the assembled surface, not the section file.',
    'Surfaces DC-005 (brand purple) + DC-009 (success green) + DC-015 (#8a78f9 purple variant) — three open conflicts on a single landing page.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
