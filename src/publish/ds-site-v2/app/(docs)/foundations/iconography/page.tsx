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
  { id: 'production-icons', label: 'Production icons (CDN)', level: 2 as const },
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

        <section id="production-icons" className="mt-10 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Production icons (CDN-hosted)</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Production uses <strong>217 _ICON / _LOGO / _IMAGE exports</strong> from{' '}
            <code className="font-mono text-[12px]">src/constants/images.tsx</code>, totaling{' '}
            <strong>765 unique CDN URLs</strong> hosted on ImageKit. None are part of the SVG icon library above —
            they are PNG / WebP / SVG assets fetched at runtime.
          </p>

          <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4 text-[13px]">
            <div className="text-overline text-[#8a5e00] mb-1">DC-006 — icon system not implemented as SVGs</div>
            <p className="text-chrome-text">
              The designer icon library above (1,215+ icons) is aspirational. Production ships CDN image assets that
              don&apos;t correspond 1:1 to the designer set. Migration plan: build an SVG sprite from the designer library,
              codemod every <code className="font-mono">_ICON</code> import to the SVG component, retire the CDN URLs.
              Multi-sprint engineering effort. See{' '}
              <a className="text-chrome-accent hover:underline" href="/surfaces/#designer-conflicts">DC-006 ticket</a>.
            </p>
          </div>

          <p className="mt-4 max-w-[62ch] text-body-s text-chrome-text-subtle">
            <strong>Top 30 most-used CDN icons</strong> are catalogued on a Figma reference page (file{' '}
            <code className="font-mono text-[12px]">8eNJf875iY9HISEsczDfOh</code>, page <em>Icon Reference</em>). Each
            frame shows the constant name, CDN URL fragment, and source-usage count.
          </p>

          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Constant</th>
                  <th className="text-right p-3 font-bold text-overline text-chrome-text-subtlest">Uses</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">CDN path</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Category</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['DROPDOWN_ARROW',     39, '/dropdown_arrow.webp', 'NAVIGATION'],
                  ['GEMS_ICON',          37, '/gems_icon.svg',       'REWARDS'],
                  ['COPY_ICON',          30, '/copyIcon.svg',        'COMMUNICATION'],
                  ['CLOSE_ICON',         24, '/close_icon.svg',      'NAVIGATION'],
                  ['BACK_BUTTON_ARROW',  23, '/backBtnIcon.svg',     'NAVIGATION'],
                  ['DIALOGUE_BOX_SHADOW_IMAGE', 21, '/dialogueBoxWithShadow.svg', 'OTHER'],
                  ['WHITE_BLANK_IMAGE',  17, '/Solid_white.png',     'IDENTITY'],
                  ['CONFETTI_SMALL_IMAGE', 16, '/confettiSmall.svg', 'OTHER'],
                  ['SHARE_ICON',         13, '/share_icon.svg',      'COMMUNICATION'],
                  ['SEND_EMAIL_ICON',    12, '/sendMailImage.svg',   'COMMUNICATION'],
                  ['CHATBOT_ICON',       12, '/ChatBot_Icon.webp',   'COMMUNICATION'],
                  ['SEARCH_ICON',        11, '/search-icon.svg',     'COMMUNICATION'],
                  ['HAND_SHAKE_ICON',    11, '/handShakeImage.svg',  'OTHER'],
                  ['GMAIL_ICON',         11, '/gmail_icon.svg',      'SOCIAL'],
                  ['TELEGRAM_ICON',      10, '/telegram_icon.svg',   'SOCIAL'],
                  ['FACEBOOK_ICON',      10, '/facebook_icon.svg',   'SOCIAL'],
                  ['WHATSAPP_SHARE_ICON', 9, '/whatsapp_icon.svg',   'SOCIAL'],
                  ['TIMER_ICON',          8, '/timer_icon.svg',      'TIME'],
                  ['ZOOM_ICON',           7, '/pre_demo_zoom.webp',  'COMMUNICATION'],
                  ['WHITE_TIMER_ICON',    7, '/white_timer_icon.svg','TIME'],
                  ['WHITE_CALENDER_ICON', 7, '/white_calender_icon.svg', 'TIME'],
                  ['WHATSAPP_ICON',       7, '/whatsapp_icon.png',   'SOCIAL'],
                  ['CHATBOT_EDIT_ICON',   7, '/chatbot_edit_icon.svg','COMMUNICATION'],
                  ['BRIGHTCHAMPS_LOGO',   7, '/brightchamps_logo.svg','IDENTITY'],
                  ['ADD_SCHEDULE_ICON',   7, '/plusIcon.webp',       'NAVIGATION'],
                  ['PLUS_ICON',           6, '/plus_blue_icon.svg',  'NAVIGATION'],
                  ['CLOCK_ICON',          6, '/pre_demo_clock.webp', 'TIME'],
                  ['LOGO_ICON',           5, '/logo-icon.png',       'IDENTITY'],
                  ['LOGOUT_ICON',         5, '/logout_icon.svg',     'NAVIGATION'],
                  ['HARVARD_LOGO',        5, '/harvard_logo.svg',    'IDENTITY'],
                ].map(([name, uses, url, cat]) => (
                  <tr key={String(name)} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{String(name)}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{String(uses)}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{String(url)}</td>
                    <td className="p-3 text-chrome-text-subtle">{String(cat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
