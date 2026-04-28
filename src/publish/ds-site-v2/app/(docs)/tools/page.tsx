import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Palette, Check, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Designer + engineer utilities: AI generator, palette explorer, contrast checker, AI token picker.',
}

const TOOLS = [
  { href: '/tools/generate/',     title: 'AI Generator',     desc: 'Generate on-brand component code from a prompt. Outputs use canonical design tokens by default.', Icon: Sparkles, accent: '#722ED1' },
  { href: '/tools/palette/',       title: 'Palette explorer', desc: 'Browse, filter, and copy every canonical color token. Filter by category or tier; search by name, hex, or var.', Icon: Palette, accent: '#FF7C35' },
  { href: '/tools/contrast/',      title: 'Contrast checker', desc: 'Verify foreground/background pairs against WCAG 2.1 AA + AAA + UI-component thresholds with live preview.', Icon: Check, accent: '#0e6a32' },
  { href: '/tools/token-picker/',  title: 'Token picker',     desc: 'AI-recommended canonical tokens. Describe a design intent in plain English, get the best token + alternatives.', Icon: Search, accent: '#0d47a1' },
]

export default function ToolsPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[960px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Reference</div>
      <h1 className="text-h1 text-chrome-text">Tools</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Browser-based utilities that plug into the design system. Three AI-powered (Generator, Token picker)
        and two pure-data (Palette explorer, Contrast checker). All four ship with the site — no setup needed
        beyond an Anthropic API key for the AI ones.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} className="rounded-card border border-chrome-border bg-chrome-surface-raised hover:bg-chrome-surface-sunken hover:border-chrome-accent p-5 transition-colors block">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-md p-2" style={{ background: `${t.accent}20`, color: t.accent }}>
                <t.Icon size={20} strokeWidth={2} />
              </div>
              <div className="text-body-l font-bold text-chrome-text">{t.title}</div>
            </div>
            <p className="text-body-s text-chrome-text-subtle">{t.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <h2 className="text-h3 text-chrome-text">Anthropic API key</h2>
        <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text">
          AI Generator and Token picker require an Anthropic API key. The key is stored in browser localStorage
          and sent only to <code className="font-mono">api.anthropic.com</code> — no server proxy. Each tool has a gear
          icon to set or update the key.
        </p>
      </section>
    </article>
  )
}
