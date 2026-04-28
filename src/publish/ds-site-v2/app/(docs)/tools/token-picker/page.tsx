import type { Metadata } from 'next'
import { TokenPickerClient } from './TokenPickerClient'

export const metadata: Metadata = {
  title: 'Token picker',
  description: 'AI-powered token recommendation. Describe a design intent, get the best canonical BrightChamps token plus alternatives.',
}

export default function TokenPickerPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1200px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Tools</div>
      <h1 className="text-h1 text-chrome-text">Token picker</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        <strong className="inline-block rounded-[3px] bg-[rgba(255,187,58,0.20)] text-[#8a5e00] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] mr-1.5 align-middle">Beta</strong>
        Describe what you&rsquo;re styling — &ldquo;hover background of a CTA&rdquo;, &ldquo;label on a sunken sidebar&rdquo; —
        and Claude returns the best canonical token, an explanation, and any caveats (DC tickets, deprecations, contrast risk).
      </p>
      <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtlest">
        Layer 3.5 — between the AI generator and the raw palette. Skips deprecated tokens automatically.
      </p>

      <div className="mt-8">
        <TokenPickerClient />
      </div>
    </article>
  )
}
