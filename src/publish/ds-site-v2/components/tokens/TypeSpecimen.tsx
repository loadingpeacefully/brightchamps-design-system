'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { TypographyToken } from '@/lib/tokens.generated'

export function TypeSpecimen({ token }: { token: TypographyToken }) {
  const [copied, setCopied] = useState<'name' | 'css' | null>(null)
  const lh = token.lineHeight ?? token.size * 1.2

  const copy = (kind: 'name' | 'css', text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(kind)
      setTimeout(() => setCopied(null), 1200)
    }).catch(() => {})
  }

  const isDesigner = token.source === 'designer'
  const tierClass = isDesigner
    ? 'bg-[rgba(78,59,194,0.14)] text-[#4e3bc2]'
    : token.tier === 'canonical' ? 'bg-[rgba(36,194,110,0.14)] text-[#16803c]'
    : token.tier === 'candidate' ? 'bg-[rgba(255,187,58,0.2)] text-[#8a5e00]'
    : 'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle'
  const tierLabel = isDesigner ? 'Designer' : token.tier

  return (
    <article className="grid gap-6 rounded-card border border-chrome-border bg-chrome-surface-raised p-5 transition hover:border-chrome-border-bold md:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => copy('name', token.name)}
          className="text-left font-mono text-[13px] font-semibold text-chrome-text hover:text-chrome-accent transition truncate"
          aria-label={`Copy ${token.name}`}
        >
          {copied === 'name'
            ? <span className="text-[color:var(--brand-green)] inline-flex items-center gap-1"><Check size={12} /> Copied</span>
            : token.name}
        </button>
        <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 text-[11px]">
          <dt className="text-chrome-text-subtlest">Family</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{token.family}</dd>
          <dt className="text-chrome-text-subtlest">Size</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{token.size}px</dd>
          <dt className="text-chrome-text-subtlest">Weight</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{token.weight}</dd>
          <dt className="text-chrome-text-subtlest">Line height</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{lh.toFixed(1)}px</dd>
          {isDesigner ? (
            <>
              <dt className="text-chrome-text-subtlest">Status</dt>
              <dd className="m-0 italic text-chrome-text-subtle">Not yet in production</dd>
            </>
          ) : (
            <>
              <dt className="text-chrome-text-subtlest">Usage</dt>
              <dd className="m-0 font-mono font-semibold text-chrome-text">{token.usageCount.toLocaleString()}</dd>
            </>
          )}
        </dl>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={'inline-block rounded-[10px] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] ' + tierClass}
            title={isDesigner ? 'Added from designer source. Production usage pending implementation.' : undefined}
          >
            {tierLabel}
          </span>
          <button
            className="inline-flex items-center gap-1 rounded-[4px] border border-chrome-border-bold bg-chrome-surface px-2 py-[2px] text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition"
            onClick={() => copy('css', `var(${token.cssVar})`)}
            aria-label="Copy CSS variable"
          >
            {copied === 'css' ? <><Check size={11} strokeWidth={2.5} /> Var</> : <><Copy size={10} strokeWidth={2} /> Var</>}
          </button>
        </div>
      </div>
      <div
        className="flex items-center text-chrome-text overflow-hidden"
        style={{
          fontFamily: `'${token.family}', sans-serif`,
          fontSize: `${token.size}px`,
          fontWeight: token.weight,
          lineHeight: `${lh}px`,
          letterSpacing: token.letterSpacing ? `${token.letterSpacing}em` : undefined,
        }}
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </article>
  )
}
