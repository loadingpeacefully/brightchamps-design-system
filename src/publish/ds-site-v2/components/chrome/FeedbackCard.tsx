'use client'

import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react'

type Vote = 'yes' | 'no' | null

export function FeedbackCard({ pathname }: { pathname: string }) {
  const key = `bc-feedback-${pathname}`
  const [vote, setVote] = useState<Vote>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(key)
      if (saved === 'yes' || saved === 'no') setVote(saved)
    } catch { /* localStorage may be blocked */ }
  }, [key])

  const cast = (v: 'yes' | 'no') => {
    setVote(v)
    try { localStorage.setItem(key, v) } catch { /* ignore */ }
  }

  return (
    <section className="mt-12 rounded-card border border-chrome-border bg-chrome-surface-raised p-5" aria-label="Page feedback">
      {!mounted || vote === null ? (
        <>
          <div className="text-[13px] font-semibold text-chrome-text">Was this page helpful?</div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => cast('yes')}
              className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border-bold bg-chrome-surface px-3 py-1.5 text-body text-chrome-text hover:bg-chrome-surface-sunken transition-colors"
            >
              <ThumbsUp size={13} strokeWidth={1.75} />
              Yes
            </button>
            <button
              type="button"
              onClick={() => cast('no')}
              className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border-bold bg-chrome-surface px-3 py-1.5 text-body text-chrome-text hover:bg-chrome-surface-sunken transition-colors"
            >
              <ThumbsDown size={13} strokeWidth={1.75} />
              No
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-[13px] text-chrome-text">
          <Check size={14} strokeWidth={2} className="text-[color:var(--bc-brand-green)]" />
          <span className="font-semibold">Thanks for your feedback.</span>
          <span className="text-chrome-text-subtle">
            You said this page was {vote === 'yes' ? 'helpful' : 'not helpful'}.
          </span>
          <button
            type="button"
            onClick={() => { setVote(null); try { localStorage.removeItem(key) } catch {} }}
            className="ml-auto text-[12px] font-medium text-chrome-accent hover:underline"
          >
            Change
          </button>
        </div>
      )}
    </section>
  )
}
