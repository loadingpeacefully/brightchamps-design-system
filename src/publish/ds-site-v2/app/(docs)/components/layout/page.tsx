import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { LayoutGrid, Star, Award, BookOpen, Bell, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Layout',
  description: 'Shell container for student dashboard pages. Variants, states, and token mapping.',
}

const TOC = [
  { id: 'variants', label: 'Variants',     level: 2 as const },
  { id: 'states',   label: 'States',        level: 2 as const },
  { id: 'tokens',   label: 'Token mapping', level: 2 as const },
  { id: 'code',     label: 'Usage',         level: 2 as const },
  { id: 'a11y',     label: 'Accessibility', level: 2 as const },
]

const TOKEN_MAP = [
  { property: 'Page background',       token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
  { property: 'Sidebar background',    token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
  { property: 'Sidebar active item bg', token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
  { property: 'Sidebar active item fg', token: 'color/neutral/100',  cssVar: '--color-neutral-100',  value: '#ffffff' },
  { property: 'Sidebar item text',     token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
  { property: 'Sidebar item meta text', token: 'color/neutral/600',  cssVar: '--color-neutral-600',   value: '#3d4d5d' },
  { property: 'Sidebar width (desktop)', token: 'space/sidebar',     cssVar: '--space-sidebar',       value: '240px' },
  { property: 'Sidebar width (mobile)', token: 'space/0',            cssVar: '--space-0',             value: '0px (drawer)' },
  { property: 'Page padding (block)',  token: 'space/8',             cssVar: '--space-8',             value: '32px' },
  { property: 'Page padding (inline)', token: 'space/6',             cssVar: '--space-6',             value: '24px' },
  { property: 'Sidebar item gap',      token: 'space/2',             cssVar: '--space-2',             value: '8px' },
  { property: 'Sidebar item radius',   token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
]

const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'My feed',        active: true },
  { icon: Star,       label: 'Badges',         active: false },
  { icon: Award,      label: 'Certificates',   active: false },
  { icon: BookOpen,   label: 'Learn',          active: false },
  { icon: Bell,       label: 'Notifications',  active: false },
]

function DemoLayout({ withSidebar = true, mobile = false }: { withSidebar?: boolean; mobile?: boolean }) {
  if (mobile) {
    return (
      <div className="overflow-hidden rounded-md border" style={{ borderColor: '#e7e7e7', background: '#ffffff' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#e7e7e7' }}>
          <div className="flex items-center gap-2">
            <span className="block h-5 w-5 rounded" style={{ background: '#4e3bc2' }} />
            <span className="text-[13px] font-semibold" style={{ color: '#212121' }}>BrightChamps</span>
          </div>
          <button className="h-6 w-6 grid place-items-center rounded" style={{ background: '#e7e7e7' }}>
            <span style={{ color: '#212121' }}>≡</span>
          </button>
        </div>
        <div className="px-4 py-6">
          <div className="text-[13px] font-semibold mb-2" style={{ color: '#212121' }}>My feed</div>
          <div className="h-3 w-2/3 rounded-full mb-1.5" style={{ background: '#e7e7e7' }} />
          <div className="h-3 w-1/2 rounded-full" style={{ background: '#e7e7e7' }} />
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-md border" style={{ borderColor: '#e7e7e7', background: '#ffffff' }}>
      <div className="grid" style={{ gridTemplateColumns: withSidebar ? '160px 1fr' : '1fr' }}>
        {withSidebar && (
          <aside className="px-2 py-3 space-y-1 border-r" style={{ background: '#e7e7e7', borderColor: '#e7e7e7', minHeight: 220 }}>
            <div className="px-2 pb-2 mb-1 flex items-center gap-1.5">
              <span className="block h-4 w-4 rounded" style={{ background: '#4e3bc2' }} />
              <span className="text-[11px] font-semibold" style={{ color: '#212121' }}>BrightChamps</span>
            </div>
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px]"
                  style={{
                    background: item.active ? '#4e3bc2' : 'transparent',
                    color: item.active ? '#ffffff' : '#212121',
                  }}
                >
                  <Icon size={12} strokeWidth={2} />
                  <span className="font-medium">{item.label}</span>
                </div>
              )
            })}
          </aside>
        )}
        <div className="px-6 py-6">
          <div className="text-[14px] font-semibold mb-3" style={{ color: '#212121' }}>My feed</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 rounded-md" style={{ background: '#e7e7e7' }} />
            <div className="h-12 rounded-md" style={{ background: '#e7e7e7' }} />
            <div className="h-12 rounded-md" style={{ background: '#e7e7e7' }} />
          </div>
          <div className="mt-3 h-3 w-1/2 rounded-full" style={{ background: '#e7e7e7' }} />
        </div>
      </div>
    </div>
  )
}

export default function LayoutPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
        <h1 className="text-h1 text-chrome-text">Layout</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The shell container for every student dashboard page. Provides the sidebar nav, the main
          content well, and the responsive switch to a drawer on mobile.
        </p>

        <div className="mt-4 rounded-card border-2 border-[#a31836] bg-[rgba(240,41,77,0.06)] p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-[#a31836]" />
            <p className="text-body-s text-chrome-text">
              <strong className="text-[#a31836] uppercase tracking-[0.04em] text-[12px]">Spec conflict.</strong>{' '}
              Sidebar documented as 240px. Production uses <strong>104px rail + 880px main + 460px right panel</strong>{' '}
              (3-column, not 2-column). <strong>8 Layout variants exist, not 3.</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Every authenticated student page (my-feed, learn, certificates, …)</li>
              <li>Anywhere learners need the persistent app nav alongside content</li>
            </ul>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
            <div className="text-overline text-chrome-text-subtlest mb-1">When not to use</div>
            <ul className="ml-4 list-disc text-body-s text-chrome-text leading-relaxed">
              <li>Marketing landing pages (use a hero + footer shell instead)</li>
              <li>Modal-style flows (login, onboarding, full-screen video)</li>
              <li>Print or PDF views — strip the sidebar entirely</li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-body-s text-chrome-text-subtlest italic">
          Discovered from student surface DOM audit. 35 elements across 7 pages — present on every
          authenticated route.
        </p>

        <section id="variants" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Variants</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Three layout modes — with sidebar (default), without sidebar, and mobile drawer.</p>
          <div className="mt-6 grid gap-6">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">With sidebar</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Default for authenticated student routes.</p>
              <DemoLayout />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Without sidebar</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Full-width content for focus modes (e.g. lesson playback).</p>
              <DemoLayout withSidebar={false} />
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-6">
              <div className="text-h4 text-chrome-text mb-1">Mobile</div>
              <p className="text-body-s text-chrome-text-subtle mb-4">Sidebar collapses into a drawer behind a menu button.</p>
              <DemoLayout mobile />
            </div>
          </div>
        </section>

        <section id="states" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">States</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Layout has no interaction states of its own — its sidebar items do. This grid shows them.</p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Sidebar item</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Default</th>
                  <th className="p-4 text-left text-overline text-chrome-text-subtlest">Active</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border last:border-b-0">
                  <td className="p-4 text-body-s font-semibold text-chrome-text">My feed</td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px]" style={{ color: '#212121' }}>
                      <LayoutGrid size={12} /> <span className="font-medium">My feed</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px]" style={{ background: '#4e3bc2', color: '#ffffff' }}>
                      <LayoutGrid size={12} /> <span className="font-medium">My feed</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="tokens" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Token mapping</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Every visual property maps to a design token. Copy the CSS variable for use in your components.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Property</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Token</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CSS variable</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Value</th>
                </tr>
              </thead>
              <tbody>
                {TOKEN_MAP.map(row => (
                  <tr key={row.property} className="border-b border-chrome-border last:border-b-0 hover:bg-chrome-surface-sunken transition-colors">
                    <td className="p-3 text-chrome-text">{row.property}</td>
                    <td className="p-3 font-mono font-semibold text-chrome-accent">{row.token}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{row.cssVar}</td>
                    <td className="p-3">
                      {row.value.startsWith('#') ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-3 w-3 rounded-sm border border-chrome-border" style={{ background: row.value }} />
                          <span className="font-mono">{row.value}</span>
                        </span>
                      ) : (
                        <span className="font-mono">{row.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="code" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Usage</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">Minimum viable implementation using the token system.</p>
          <div className="mt-4 rounded-card border border-chrome-border bg-chrome-surface-sunken p-5 overflow-x-auto">
            <pre className="font-mono text-[13px] text-chrome-text leading-relaxed whitespace-pre">{`<div
  className="grid min-h-screen"
  style={{
    gridTemplateColumns: 'var(--space-sidebar) 1fr',
    background: 'var(--color-neutral-100)',
  }}
>
  <aside
    style={{ background: 'var(--color-neutral-200)' }}
    className="p-2 space-y-1"
  >
    {nav.map(item => (
      <a
        key={item.href}
        href={item.href}
        aria-current={item.active ? 'page' : undefined}
        className="flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{
          background: item.active ? 'var(--color-brand-primary)' : 'transparent',
          color:      item.active ? 'var(--color-neutral-100)'   : 'var(--color-neutral-1400)',
        }}
      >
        <item.Icon size={16} />
        <span className="font-medium">{item.label}</span>
      </a>
    ))}
  </aside>
  <main
    style={{
      padding: 'var(--space-8) var(--space-6)',
      color: 'var(--color-neutral-1400)',
    }}
  >
    {children}
  </main>
</div>`}</pre>
          </div>
        </section>

        <section id="a11y" className="mt-16 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Accessibility</h2>
          <ul className="mt-4 ml-4 list-disc text-body text-chrome-text leading-relaxed">
            <li>Wrap the sidebar in <code className="font-mono text-[12px]">{`<aside>`}</code> with an <code className="font-mono text-[12px]">aria-label=&quot;Primary&quot;</code>. Mark the active item with <code className="font-mono text-[12px]">aria-current=&quot;page&quot;</code>.</li>
            <li>Provide a skip-to-content link as the first focusable element so keyboard users can jump past the nav.</li>
            <li>Active item: brand-primary on neutral-100 = 8.4:1 — exceeds WCAG AAA for body text.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
