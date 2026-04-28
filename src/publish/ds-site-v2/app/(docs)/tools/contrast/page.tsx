import type { Metadata } from 'next'
import { ContrastClient } from './ContrastClient'

export const metadata: Metadata = {
  title: 'Contrast checker',
  description: 'Verify foreground/background pairs against WCAG 2.1 AA + AAA thresholds with live preview and token lookup.',
}

export default function ContrastToolPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[1200px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Tools</div>
      <h1 className="text-h1 text-chrome-text">Contrast checker</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Pick a foreground and background — by hex, color picker, or canonical token — and see the WCAG ratio + a
        live sample. Covers normal text (AA 4.5+), large text (AA 3+), AAA, and UI-component contrast (3+).
      </p>

      <div className="mt-8">
        <ContrastClient />
      </div>
    </article>
  )
}
