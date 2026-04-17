'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV } from '@/lib/nav'
import { StatusBadge } from './StatusBadge'

// Exact-match active state with trailing-slash normalization.
// /foundations/color/ activates "Color" only — parent section stays expanded
// but does not get the active highlight. No startsWith().
function normalize(p: string): string {
  return p.endsWith('/') ? p : p + '/'
}

export function Sidebar({ onNavigate, variant = 'desktop' }: { onNavigate?: () => void; variant?: 'desktop' | 'drawer' }) {
  const pathname = usePathname()
  const current = normalize(pathname)

  const asideClasses =
    variant === 'drawer'
      ? 'h-full w-full overflow-y-auto bg-chrome-surface py-4'
      : 'sticky top-topbar hidden h-[calc(100vh-theme(spacing.topbar))] w-sidebar shrink-0 overflow-y-auto border-r border-chrome-border bg-chrome-surface py-4 md:block'

  return (
    <aside
      className={asideClasses}
      aria-label="Primary navigation"
    >
      <nav>
        {NAV.map((section, i) => (
          <div key={section.label} className={i === 0 ? 'mt-2 mb-2' : 'mt-4 mb-2'}>
            {/* Section group label */}
            <div className="mb-2 pl-6 pr-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-chrome-text-subtlest">
              {section.label}
            </div>

            {/* Nav items */}
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
          </div>
        ))}
      </nav>
    </aside>
  )
}
