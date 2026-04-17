'use client'

import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  label: string
  level: 2 | 3
}

export function RightTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return
    const headings = items
      .map(i => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 1] },
    )
    headings.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <aside className="sticky top-topbar hidden h-[calc(100vh-theme(spacing.topbar))] w-toc shrink-0 overflow-y-auto px-6 pt-10 xl:block">
      <div className="mb-3 text-overline text-chrome-text-subtlest">On this page</div>
      <ul className="m-0 list-none space-y-1.5 p-0 border-l border-chrome-border">
        {items.map(item => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? 20 : 12 }}>
            <a
              href={`#${item.id}`}
              className={
                'block -ml-[1px] border-l-2 pl-3 py-0.5 text-body-s transition-colors ' +
                (activeId === item.id
                  ? 'border-chrome-accent text-chrome-text'
                  : 'border-transparent text-chrome-text-subtle hover:text-chrome-text')
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
