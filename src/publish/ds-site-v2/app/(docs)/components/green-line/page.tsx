import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'GreenLine — Not found',
  description: 'GreenLine component not found in the production codebase. Spec retracted.',
}

export default function GreenLinePage() {
  return (
    <article className="min-w-0 flex-1 max-w-[760px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
      <h1 className="text-h1 text-chrome-text">GreenLine</h1>

      <div className="mt-6 rounded-card border-2 border-[#a31836] bg-[rgba(240,41,77,0.06)] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-[#a31836]" />
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#a31836]">Component not found</p>
            <p className="mt-2 text-body text-chrome-text leading-relaxed">
              No GreenLine component exists in the student dashboard codebase. This page was inferred from
              DOM class names. It will be removed or corrected once the source is located.
            </p>
            <p className="mt-3 text-body-s text-chrome-text-subtle">
              See{' '}
              <a href="/get-started/decisions/#dr-004" className="text-chrome-accent underline underline-offset-4">DR-004 — Component spec accuracy standard</a>{' '}
              and{' '}
              <a href="/surfaces/#designer-conflicts" className="text-chrome-accent underline underline-offset-4">designer conflicts</a>.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-body-s text-chrome-text-subtlest italic">
        DOM-audit signal: 49 elements across 7 student pages were classified as "GreenLine" by their CSS class
        prefix. Investigation against the dashboard repo found no matching React component or SCSS module —
        the elements appear to be inline patterns (toggle indicators, badge tab markers, prelogin accents)
        rendered per-component, not extracted into a reusable element.
      </p>
    </article>
  )
}
