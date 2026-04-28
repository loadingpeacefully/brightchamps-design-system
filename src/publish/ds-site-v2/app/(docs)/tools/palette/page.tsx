import type { Metadata } from 'next'
import { PaletteClient } from './PaletteClient'

export const metadata: Metadata = {
  title: 'Palette explorer',
  description: 'Browse, filter, and copy every canonical color token in the BrightChamps system.',
}

export default function PaletteToolPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1200px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Tools</div>
      <h1 className="text-h1 text-chrome-text">Palette explorer</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Every canonical color token, browsable. Filter by category or tier, search by name / hex / var, and copy
        the CSS reference straight to clipboard. Source: <code className="font-mono text-[12.5px]">ledger/tokens.json</code>.
      </p>

      <div className="mt-8">
        <PaletteClient />
      </div>
    </article>
  )
}
