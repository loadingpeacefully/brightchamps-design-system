import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { loadComponents } from '@/lib/surface-data'

export const metadata: Metadata = {
  title: 'Student · Components',
  description: 'CSS Module component inventory for the student surface — 21 unique component prefixes extracted from 7 pages.',
}

const TOC = [
  { id: 'inventory', label: 'Component inventory', level: 2 as const },
]

export default function StudentComponentsPage() {
  const components = loadComponents()
  const totalElements = components.reduce((s, c) => s + c.elements, 0)

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Student</div>
        <h1 className="text-h1 text-chrome-text">Component inventory</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {components.length} unique CSS Module component prefixes detected across {totalElements.toLocaleString()} DOM
          elements on 7 student app pages. Each prefix maps to a React component in the student app codebase.
        </p>

        <section id="inventory" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Inventory</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Sorted by element count. &ldquo;Variants&rdquo; = unique CSS class suffixes within the component.
            &ldquo;Pages&rdquo; = how many of the 7 student URLs this component appears on.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Elements</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Variants</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Pages</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Found on</th>
                </tr>
              </thead>
              <tbody>
                {components.map(c => (
                  <tr key={c.prefix} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken transition-colors">
                    <td className="p-3 font-mono font-semibold text-chrome-text">{c.prefix}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text">{c.elements}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{c.localNames.length}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-chrome-text-subtle">{c.pages.length}/7</td>
                    <td className="p-3">
                      <span className="inline-flex rounded-full px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] bg-[rgba(255,187,58,0.18)] text-[#8a5e00]">
                        Needs spec
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-chrome-text-subtle max-w-[200px] truncate">
                      {c.pages.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
