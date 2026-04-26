import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { Github, MessageSquare, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contributing',
  description: 'How to propose a new token, request an icon, or report a bug in the BrightChamps design system.',
}

const TOC = [
  { id: 'propose-token', label: 'Proposing a new token',  level: 2 as const },
  { id: 'missing-icon',  label: 'Reporting a missing icon', level: 2 as const },
  { id: 'bugs',          label: 'Found a bug?',             level: 2 as const },
]

const REPO_URL = 'https://github.com/loadingpeacefully/brightchamps-design-system'

export default function ContributePage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[760px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Get started</div>
        <h1 className="text-h1 text-chrome-text">Contributing</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Three workflows for keeping the design system honest: propose a new token when one is missing,
          request an icon when you cannot find what you need, or open an issue when something is broken.
        </p>

        <section id="propose-token" className="mt-12 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-chrome-accent" strokeWidth={2} />
            <h2 className="text-h2 text-chrome-text">Proposing a new token</h2>
          </div>
          <p className="mt-2 max-w-[62ch] text-body text-chrome-text-subtle">
            When you need a color, spacing value, or type token that does not exist in the system,
            do not use a hardcoded value. File a Token Decision Record (TDR) so the token enters the
            ledger correctly.
          </p>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-body text-chrome-text">
            <li>
              <strong>Search this site first.</strong> Use search (⌘K) or browse{' '}
              <a className="text-chrome-accent underline underline-offset-4" href="/foundations/">Foundations</a>.
              Many tokens exist under different names than you expect.
            </li>
            <li>
              <strong>If it does not exist,</strong> message your design system maintainer in
              Slack, or open a GitHub issue with the label{' '}
              <code className="font-mono text-[12px] rounded bg-chrome-surface-sunken px-1 py-0.5">tdr-request</code>.
              Include: the proposed token name, the value, where you intend to use it, and a screenshot.
            </li>
            <li>
              <strong>A TDR will be drafted</strong> describing the proposal, the rationale, and the
              alternatives considered. See{' '}
              <a className="text-chrome-accent underline underline-offset-4" href="/tdr/0001-taxonomy-migration/">TDR-0001</a>{' '}
              for the format.
            </li>
            <li>
              <strong>Once accepted,</strong> the token is added to{' '}
              <code className="font-mono text-[12px] rounded bg-chrome-surface-sunken px-1 py-0.5">ledger/manual-canonicals.json</code>{' '}
              and ships in the next build of the design system.
            </li>
          </ol>
        </section>

        <section id="missing-icon" className="mt-12 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-chrome-accent" strokeWidth={2} />
            <h2 className="text-h2 text-chrome-text">Reporting a missing icon</h2>
          </div>
          <p className="mt-2 max-w-[62ch] text-body text-chrome-text-subtle">
            The icon library has 1,215 icons across 22 categories — but it is not exhaustive.
          </p>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-body text-chrome-text">
            <li>
              Search{' '}
              <a className="text-chrome-accent underline underline-offset-4" href="/foundations/iconography/">
                Foundations &gt; Iconography
              </a>
              . Try multiple variants (e.g., &quot;flame&quot; and &quot;fire&quot;).
            </li>
            <li>
              If it is not there, open a GitHub issue with the label{' '}
              <code className="font-mono text-[12px] rounded bg-chrome-surface-sunken px-1 py-0.5">icon-request</code>.
              Include: the icon name you searched for, the use case, and a sketch or reference image.
            </li>
            <li>
              The design team triages icon requests weekly. New icons land in the next ledger sync.
            </li>
          </ol>
        </section>

        <section id="bugs" className="mt-12 scroll-mt-24">
          <div className="flex items-center gap-2 mb-2">
            <Github size={16} className="text-chrome-accent" strokeWidth={2} />
            <h2 className="text-h2 text-chrome-text">Found a bug?</h2>
          </div>
          <p className="mt-2 max-w-[62ch] text-body text-chrome-text-subtle">
            If a token is wrong, a swatch is broken, or the site behaves unexpectedly, open an issue.
          </p>
          <a
            href={`${REPO_URL}/issues/new`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-chrome-border-bold bg-chrome-surface px-4 py-2 text-[13px] font-semibold text-chrome-text transition hover:bg-chrome-surface-sunken"
          >
            <Github size={14} strokeWidth={2} />
            Open a GitHub issue
          </a>
          <p className="mt-3 text-body-s text-chrome-text-subtlest">
            Repository:{' '}
            <a className="text-chrome-accent underline underline-offset-4" href={REPO_URL} target="_blank" rel="noreferrer">
              loadingpeacefully/brightchamps-design-system
            </a>
          </p>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
