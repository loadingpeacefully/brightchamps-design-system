import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { AlertTriangle } from 'lucide-react'
import { iconNames, iconCategories } from '@/lib/icons.data'
import { IconSearch } from './IconSearch'

export const metadata: Metadata = {
  title: 'Iconography',
  description: `${iconNames.length} icons across ${iconCategories.length} categories from the BrightChamps designer icon library.`,
}

const TOC = [
  { id: 'summary',    label: 'Summary',          level: 2 as const },
  { id: 'drift',      label: 'Production gap',   level: 2 as const },
  { id: 'browse',     label: 'Browse icons',     level: 2 as const },
]

// Deduplicate icons that appear in both line and fill sets (same name)
const uniqueNames = [...new Set(iconNames.map(i => i.name))]
const categoryCount: Record<string, number> = {}
for (const icon of iconNames) {
  categoryCount[icon.category] = (categoryCount[icon.category] ?? 0) + 1
}

export default function IconographyPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Foundations</div>
        <h1 className="text-h1 text-chrome-text">Iconography</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {iconNames.length.toLocaleString()} icons across {iconCategories.length} categories,
          sourced from the designer&apos;s icon library.
        </p>

        <section id="summary" className="mt-10 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Total icon entries</div>
              <div className="text-[28px] font-bold text-chrome-text">{iconNames.length.toLocaleString()}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Unique icon names</div>
              <div className="text-[28px] font-bold text-chrome-accent">{uniqueNames.length.toLocaleString()}</div>
              <div className="text-[11px] text-chrome-text-subtlest">After deduplication</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Categories</div>
              <div className="text-[28px] font-bold text-chrome-text">{iconCategories.length}</div>
            </div>
          </div>
        </section>

        <section id="drift" className="mt-10 scroll-mt-24">
          <div className="rounded-card border-l-4 border-l-[var(--brand-red)] border border-chrome-border bg-[rgba(240,41,77,0.05)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} strokeWidth={1.75} className="text-[var(--brand-red)]" />
              <span className="text-[13px] font-bold text-[#a31836] uppercase tracking-[0.04em]">Production gap — drift ticket DC-006</span>
            </div>
            <p className="text-body text-chrome-text">
              The student app uses 153 image assets (PNG/CDN) rather than this SVG icon system.
              Only 7 inline SVGs were found in production. This icon library shows what&apos;s available;
              the <a href="/surfaces/student/icons/" className="text-chrome-accent underline underline-offset-4">student icon audit</a> shows
              what&apos;s actually deployed.
            </p>
            <p className="mt-2 text-body-s text-chrome-text-subtle font-semibold">
              Engineering action: migrate from image assets to SVG icon components.
            </p>
          </div>
        </section>

        <section id="browse" className="mt-10 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Browse icons</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Search by name or filter by category. SVG rendering deferred — icon components will ship with
            the component library. Click an icon name to copy it.
          </p>
          <IconSearch />
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
