'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyCSSButton({ css, label = 'Copy CSS' }: { css: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={() => void handle()}
      className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border bg-chrome-surface px-2 py-1 text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition-colors"
    >
      {copied ? <><Check size={11} strokeWidth={2.5} /> Copied</> : <><Copy size={11} strokeWidth={2.25} /> {label}</>}
    </button>
  )
}
