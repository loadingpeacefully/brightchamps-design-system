import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, Code2, GitPullRequest, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Get started',
  description: 'Onboarding for designers, engineers, and contributors. Pick your role to start.',
}

const ENTRY_POINTS = [
  { href: '/get-started/design/',     title: 'For designers',  desc: 'Find tokens, understand modes, propose new tokens. The 5-minute orientation if you work in Figma.', Icon: Compass,         accent: '#722ED1' },
  { href: '/get-started/develop/',    title: 'For engineers',  desc: 'Codemod, CSS naming, componentSpecs, dark mode. The migration playbook for the production codebase.', Icon: Code2,          accent: '#0e6a32' },
  { href: '/get-started/contribute/', title: 'Contributing',   desc: 'How tokens get added. The TDR (Token Decision Record) workflow + branch + review process.',          Icon: GitPullRequest,  accent: '#FF7C35' },
  { href: '/get-started/decisions/',  title: 'Decisions',      desc: 'Frozen architectural decisions: migration target, ledger guard, AI Generator scope, brand pending.', Icon: FileText,        accent: '#0d47a1' },
]

export default function GetStartedPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[960px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Onboarding</div>
      <h1 className="text-h1 text-chrome-text">Get started</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Pick the entry point that matches your role. Each is a 5–10 minute read that gets you productive.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {ENTRY_POINTS.map(e => (
          <Link key={e.href} href={e.href} className="rounded-card border border-chrome-border bg-chrome-surface-raised hover:bg-chrome-surface-sunken hover:border-chrome-accent p-5 transition-colors block">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-md p-2" style={{ background: `${e.accent}20`, color: e.accent }}>
                <e.Icon size={20} strokeWidth={2} />
              </div>
              <div className="text-body-l font-bold text-chrome-text">{e.title}</div>
            </div>
            <p className="text-body-s text-chrome-text-subtle">{e.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <h2 className="text-h3 text-chrome-text">Big picture</h2>
        <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text">
          The DS has three layers: a <Link className="text-chrome-accent hover:underline" href="/foundations/">foundations</Link> layer
          (color, typography, spacing, motion), a <Link className="text-chrome-accent hover:underline" href="/components/">components</Link> layer
          (130+ specs across atoms, molecules, layouts, sections), and a <Link className="text-chrome-accent hover:underline" href="/tools/">tools</Link> layer
          (AI Generator, Palette explorer, Contrast checker, Token picker). Governance lives at{' '}
          <Link className="text-chrome-accent hover:underline" href="/governance/pending-decisions/">/governance/pending-decisions/</Link>.
        </p>
      </section>
    </article>
  )
}
