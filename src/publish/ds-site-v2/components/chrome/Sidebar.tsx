'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { NAV } from '@/lib/nav'
import { StatusBadge } from './StatusBadge'

function normalize(p: string): string {
  return p.endsWith('/') ? p : p + '/'
}

export function Sidebar({ onNavigate, variant = 'desktop' }: { onNavigate?: () => void; variant?: 'desktop' | 'drawer' }) {
  const pathname = usePathname()
  const current = normalize(pathname)

  // Track which collapsed sections the user has manually expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const asideClasses =
    variant === 'drawer'
      ? 'h-full w-full overflow-y-auto bg-chrome-surface py-4'
      : 'sticky top-topbar hidden h-[calc(100vh-theme(spacing.topbar))] w-sidebar shrink-0 overflow-y-auto border-r border-chrome-border bg-chrome-surface py-4 md:block'

  return (
    <aside className={asideClasses} aria-label="Primary navigation">
      <nav>
        {NAV.map((section, i) => {
          // Section is open if it's not collapsed-by-default OR if a child link is active OR if user expanded it
          const hasActiveChild = section.items.some(it => normalize(it.href) === current)
          const userExpanded = expanded[section.label]
          const isOpen = !section.collapsed || hasActiveChild || userExpanded === true

          return (
            <div key={section.label} className={i === 0 ? 'mt-2 mb-2' : 'mt-4 mb-2'}>
              {section.collapsed ? (
                <button
                  type="button"
                  onClick={() => setExpanded(s => ({ ...s, [section.label]: !s[section.label] && !hasActiveChild ? true : !isOpen }))}
                  className="mb-2 flex w-full items-center gap-1 pl-3 pr-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-chrome-text-subtlest hover:text-chrome-text transition-colors"
                  aria-expanded={isOpen}
                >
                  <ChevronRight
                    size={11}
                    strokeWidth={2.5}
                    className="transition-transform"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                  <span>{section.label}</span>
                  <span className="ml-auto font-mono normal-case tracking-normal text-[9px] text-chrome-text-subtlest">{section.items.length}</span>
                </button>
              ) : (
                <div className="mb-2 pl-6 pr-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-chrome-text-subtlest">
                  {section.label}
                </div>
              )}

              {isOpen && (
                <ul className="m-0 list-none p-0">
                  {section.items.map(item => {
                    const isActive = normalize(item.href) === current

                    if (item.disabled) {
                      return (
                        <li key={item.href}>
                          <span
                            className="flex h-8 items-center gap-2 rounded-md border-l-2 border-transparent pl-2.5 pr-2 text-[13px] font-normal text-chrome-text opacity-40 cursor-not-allowed select-none"
                            aria-disabled="true"
                          >
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && <StatusBadge variant={item.badge} />}
                          </span>
                        </li>
                      )
                    }

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={onNavigate}
                          className={
                            'flex h-8 items-center gap-2 rounded-md pl-2.5 pr-2 text-[13px] transition-colors duration-base ease-standard ' +
                            (isActive
                              ? 'border-l-2 border-chrome-accent bg-chrome-accent-subtle font-medium text-chrome-accent'
                              : 'border-l-2 border-transparent font-normal text-chrome-text hover:bg-[rgba(0,0,0,0.04)] dark:hover:bg-[rgba(255,255,255,0.05)]')
                          }
                        >
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && <StatusBadge variant={item.badge} />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
