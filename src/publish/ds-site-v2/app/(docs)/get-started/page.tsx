import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Get started',
  description: 'Install the BrightChamps design system and use your first token.',
}

export default function GetStartedPage() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Onboarding"
        title="Get started"
        step={2}
        stepDescription="Install, first-token walkthrough, contributor guide"
        description="The onboarding track covers installing @brightchamps/tokens, wiring the CSS variables into your app, and contributing a new token via a TDR. Until this ships, the glossary is the best first stop for vocabulary."
        next={[
          { href: '/get-started/glossary/', label: 'Glossary — plain-English term definitions' },
          { href: '/foundations/', label: 'Foundations overview' },
        ]}
      />
    </div>
  )
}
