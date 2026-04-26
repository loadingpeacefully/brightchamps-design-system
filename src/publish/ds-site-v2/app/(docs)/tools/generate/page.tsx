import type { Metadata } from 'next'
import { GeneratorClient } from './GeneratorClient'

export const metadata: Metadata = {
  title: 'AI Generator',
  description: 'Generate on-brand BrightChamps components from a prompt. Outputs use canonical design tokens by default.',
}

export default function GeneratorPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1200px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Tools</div>
      <h1 className="text-h1 text-chrome-text">AI Generator</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Describe a component in plain English. The generator returns production-ready React (or HTML)
        code wired to BrightChamps design tokens — no hardcoded hex, no off-brand fonts, no token drift.
      </p>
      <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtlest">
        Layer 3 of the design system: Layer 1 is the ledger, Layer 2 is the component specs, this is the layer
        that turns prompts into shipping-ready surfaces.
      </p>

      <div className="mt-8">
        <GeneratorClient />
      </div>
    </article>
  )
}
