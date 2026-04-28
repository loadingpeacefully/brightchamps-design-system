import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Patterns',
  description: 'Composed design patterns — multi-component arrangements that solve specific user-experience problems across BrightChamps surfaces.',
}

const PATTERNS = [
  {
    href: '/patterns/student-dashboard/',
    title: 'Student dashboard',
    desc: 'The 3-column shell + per-route content slot that powers all 7 authenticated student routes.',
    status: 'shipped',
  },
  {
    href: '/patterns/landing-hero/',
    title: 'Landing hero',
    desc: 'Marketing hero with one shape and six course-vertical skins — token-driven per vertical.',
    status: 'shipped',
  },
  {
    href: '/patterns/teacher-grading/',
    title: 'Teacher grading',
    desc: 'Submission review + scoring + feedback flow for the teacher app — pending Figma file ID.',
    status: 'pending',
  },
]

export default function PatternsPage() {
  return (
    <article className="min-w-0 flex-1 max-w-[960px]">
      <div className="text-overline text-chrome-text-subtlest mb-2">Reference</div>
      <h1 className="text-h1 text-chrome-text">Patterns</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Composed arrangements that solve specific UX problems — bigger than a single component, smaller than a
        full surface. Each pattern documents the components it uses, token bindings, and Do/Don&rsquo;t guidance
        with examples from production.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {PATTERNS.map(p => (
          <Link key={p.href} href={p.href} className="rounded-card border border-chrome-border bg-chrome-surface-raised hover:bg-chrome-surface-sunken hover:border-chrome-accent p-5 transition-colors block">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="text-body-l font-bold text-chrome-text">{p.title}</div>
              <span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (p.status === 'shipped' ? 'bg-[rgba(36,194,110,0.15)] text-[#0e6a32]' : 'bg-[rgba(255,205,106,0.30)] text-[#8a5e00]')}>{p.status}</span>
            </div>
            <p className="text-body-s text-chrome-text-subtle">{p.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
        <h2 className="text-h3 text-chrome-text">When to write a new pattern</h2>
        <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text">
          A pattern earns a page when:
        </p>
        <ul className="mt-3 ml-4 list-disc text-body-m text-chrome-text space-y-1.5 max-w-[62ch]">
          <li>It composes 3+ DS components in a recurring arrangement.</li>
          <li>It appears on 2+ surfaces (or is canonical for one surface that ships to many users).</li>
          <li>The arrangement has Do/Don&rsquo;t edges that would be lost if every team had to redesign it.</li>
        </ul>
      </section>
    </article>
  )
}
