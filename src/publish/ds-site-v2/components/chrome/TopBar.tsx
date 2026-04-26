import Link from 'next/link'
import { Search, Github } from 'lucide-react'
import { ThemeSwitcher } from './ThemeSwitcher'
import { MobileDrawer } from './MobileDrawer'

const NAV_LINKS = [
  { href: '/foundations/', label: 'Foundations' },
  { href: '/tokens/', label: 'Tokens' },
  { href: '/surfaces/', label: 'Surfaces' },
  { href: '/components/', label: 'Components' },
  { href: '/patterns/', label: 'Patterns' },
  { href: '/tools/', label: 'Tools' },
  { href: '/whats-new/', label: "What's new" },
]

export function TopBar() {
  return (
    <header
      className="sticky top-0 z-50 h-topbar border-b backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--chrome-header-bg) 92%, transparent)',
        borderColor: 'var(--chrome-header-border)',
      }}
    >
      <div className="mx-auto flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-8">
          <MobileDrawer />
          <Link href="/" className="flex items-center gap-2.5 text-white no-underline">
            <span
              className="block h-2.5 w-2.5 rounded-full"
              style={{
                background: 'var(--brand-accent)',
                boxShadow: '0 0 0 3px rgba(102,81,228,0.30)',
              }}
            />
            <span className="font-sans text-[15px] font-bold tracking-tight">BrightChamps</span>
            <span className="text-[13px] font-medium text-[color:var(--chrome-header-fg-subtle)]">Design System</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-[13px] font-medium text-[color:var(--chrome-header-fg-subtle)] hover:text-white rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 rounded-md border px-2.5 py-1 text-[12px] font-medium text-[color:var(--chrome-header-fg-subtle)] transition hover:bg-white/10 hover:text-white"
            style={{
              background: 'var(--chrome-header-chip-bg)',
              borderColor: 'var(--chrome-header-chip-border)',
            }}
            aria-label="Search (Cmd+K)"
            type="button"
          >
            <Search size={13} strokeWidth={1.75} />
            <span className="hidden sm:inline">Search</span>
            <kbd
              className="rounded border px-1 py-0.5 text-[10px] font-mono"
              style={{
                background: 'var(--chrome-header-chip-bg)',
                borderColor: 'var(--chrome-header-chip-border)',
              }}
            >
              ⌘K
            </kbd>
          </button>
          <ThemeSwitcher />
          <a
            href="https://github.com/loadingpeacefully/brightchamps-design-system"
            target="_blank"
            rel="noreferrer noopener"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--chrome-header-fg-subtle)] hover:bg-white/10 hover:text-white transition"
            aria-label="GitHub"
          >
            <Github size={16} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </header>
  )
}
