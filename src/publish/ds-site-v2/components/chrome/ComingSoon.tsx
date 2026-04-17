import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'

interface Props {
  title: string
  kicker?: string
  step: number
  stepDescription: string
  description: string
  next?: { href: string; label: string }[]
}

export function ComingSoon({ title, kicker, step, stepDescription, description, next }: Props) {
  return (
    <article className="min-w-0 flex-1 max-w-[768px]">
      {kicker && <div className="text-overline text-chrome-text-subtlest mb-2">{kicker}</div>}
      <h1 className="text-h1 text-chrome-text">{title}</h1>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-chrome-border bg-chrome-surface-raised px-3 py-1.5 text-[12px] font-semibold text-chrome-accent">
        <Clock size={13} strokeWidth={2} />
        Coming in Step {step} · {stepDescription}
      </div>

      <p className="mt-6 max-w-[62ch] text-body-l text-chrome-text-subtle">{description}</p>

      {next && next.length > 0 && (
        <div className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
          <div className="text-overline text-chrome-text-subtlest mb-3">Available now</div>
          <ul className="space-y-2">
            {next.map(n => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex items-center gap-2 text-body text-chrome-accent hover:underline">
                  {n.label} <ArrowRight size={13} strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
