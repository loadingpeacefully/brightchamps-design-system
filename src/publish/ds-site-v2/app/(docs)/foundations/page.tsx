import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { FeedbackCard } from '@/components/chrome/FeedbackCard'

export const metadata: Metadata = {
  title: 'Foundations',
  description: 'Color, typography, spacing, elevation, motion — the primitives every BrightChamps component is built from.',
}

const TOC = [
  { id: 'overview',        label: 'Overview',    level: 2 as const },
  { id: 'principles',      label: 'Principles',  level: 2 as const },
  { id: 'sub-extracted',   label: 'Extracted, not invented',         level: 3 as const },
  { id: 'sub-governed',    label: 'Governed, never auto-resolved',   level: 3 as const },
  { id: 'sub-published',   label: 'Published, not hoarded',          level: 3 as const },
  { id: 'getting-started', label: 'Getting started',                  level: 2 as const },
]

export default function FoundationsPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[768px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Foundations</h1>
        <p className="mt-3 text-body-l text-chrome-text-subtle max-w-[62ch]">
          Every component in BrightChamps is built from the same small set of primitives. Foundations
          are the vocabulary of the system — color, typography, space, elevation, motion — that get
          composed into components and patterns.
        </p>

        <h2 id="overview" className="mt-16 text-h2 scroll-mt-24">Overview</h2>
        <p className="mt-3 text-body text-chrome-text">
          Start with color and typography — they carry the most design surface area. Spacing and
          radius build structure around those choices. Elevation and motion add the final depth.
          Each foundation page shows the canonical tokens, live specimens, and guidance for when
          and where to use them.
        </p>

        <h2 id="principles" className="mt-16 text-h2 scroll-mt-24">Principles</h2>
        <p className="mt-3 text-body text-chrome-text">
          The foundations share three commitments:
        </p>

        <h3 id="sub-extracted" className="mt-8 text-h3 scroll-mt-24">Extracted, not invented</h3>
        <p className="mt-2 text-body text-chrome-text">
          Every canonical token was pulled from a live surface or a Figma file that ships. The system
          reflects what BrightChamps is today.
        </p>

        <h3 id="sub-governed" className="mt-8 text-h3 scroll-mt-24">Governed, never auto-resolved</h3>
        <p className="mt-2 text-body text-chrome-text">
          Drift between Figma and DOM is always flagged, never silently reconciled. Every
          canonicalization is a human decision, documented as a TDR.
        </p>

        <h3 id="sub-published" className="mt-8 text-h3 scroll-mt-24">Published, not hoarded</h3>
        <p className="mt-2 text-body text-chrome-text">
          Every accepted token reaches engineers as a CSS variable, designers as a Figma style, and
          this site as a live specimen — automatically, on every build.
        </p>

        <h2 id="getting-started" className="mt-16 text-h2 scroll-mt-24">Getting started</h2>
        <p className="mt-3 text-body text-chrome-text">
          If you&apos;re designing a new surface, start with color and typography. If you&apos;re
          auditing an existing surface, start with the drift report for that surface.
        </p>
        <FeedbackCard pathname="/foundations/" />
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
