'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { ColorToken } from '@/lib/tokens.generated'

function isAlphaHex(v: string): boolean { return /^#[0-9a-f]{8}$/i.test(v) }
function solidOf(v: string): string { return isAlphaHex(v) ? '#' + v.slice(1, 7) : v }
function luminance(hex: string): number {
  const h = solidOf(hex).replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function textOn(hex: string): string {
  return luminance(hex) > 0.55 ? '#0b1324' : '#ffffff'
}

export function ColorSwatch({ token }: { token: ColorToken }) {
  const [copied, setCopied] = useState<'hex' | 'var' | 'name' | null>(null)
  const fg = textOn(token.value)
  const isAlpha = isAlphaHex(token.value)

  const copy = (kind: 'hex' | 'var' | 'name', text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(kind)
      setTimeout(() => setCopied(null), 1200)
    }).catch(() => {})
  }

  const tierClass =
    token.tier === 'canonical' ? 'bg-[rgba(36,194,110,0.14)] text-[#16803c]' :
    token.tier === 'candidate' ? 'bg-[rgba(255,187,58,0.2)] text-[#8a5e00]' :
    'bg-[rgba(132,153,174,0.18)] text-chrome-text-subtle'

  return (
    <article className="overflow-hidden rounded-card border border-chrome-border bg-chrome-surface-raised transition hover:border-chrome-border-bold">
      <div
        className={'relative flex h-[88px] items-end px-3.5 pb-3 ' + (isAlpha ? 'bg-checker' : '')}
        style={{ backgroundColor: token.value, color: fg }}
      >
        <span className="font-mono text-[12px] font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
          {token.value}
        </span>
      </div>
      <div className="p-3.5">
        <button
          className="block w-full text-left font-mono text-[12px] font-semibold text-chrome-text hover:text-chrome-accent transition break-all"
          onClick={() => copy('name', token.name)}
          aria-label={`Copy token name ${token.name}`}
        >
          {copied === 'name' ? <span className="text-[color:var(--bc-brand-green)] inline-flex items-center gap-1"><Check size={11} /> Copied name</span> : token.name}
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={'inline-block rounded-[10px] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] ' + tierClass}>
            {token.tier}
          </span>
          <button
            className="inline-flex items-center gap-1 rounded-[4px] border border-chrome-border-bold bg-chrome-surface px-2 py-[2px] text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition"
            onClick={() => copy('hex', token.value)}
            aria-label="Copy hex"
          >
            {copied === 'hex' ? <><Check size={11} strokeWidth={2.5} /> Hex</> : <><Copy size={10} strokeWidth={2} /> Hex</>}
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-[4px] border border-chrome-border-bold bg-chrome-surface px-2 py-[2px] text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition"
            onClick={() => copy('var', `var(${token.cssVar})`)}
            aria-label="Copy CSS variable"
          >
            {copied === 'var' ? <><Check size={11} strokeWidth={2.5} /> Var</> : <><Copy size={10} strokeWidth={2} /> Var</>}
          </button>
        </div>
        <dl className="mt-2.5 grid grid-cols-[auto_auto] gap-x-3 gap-y-1 text-[11px]">
          <dt className="text-chrome-text-subtlest">Usage</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{token.usageCount.toLocaleString()}</dd>
          <dt className="text-chrome-text-subtlest">Confidence</dt>
          <dd className="m-0 font-mono font-semibold text-chrome-text">{token.confidence.toFixed(2)}</dd>
        </dl>
        {token.surfaces.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {token.surfaces.map(s => (
              <span key={s} className="inline-block rounded-[10px] border border-chrome-border-bold bg-chrome-surface px-2 py-[1px] text-[10px] font-semibold uppercase tracking-[0.04em] text-chrome-text-subtle">
                {s}
              </span>
            ))}
          </div>
        )}
        {token.description && !token.description.startsWith('Extracted from student') && (
          <p className="mt-2 text-[11px] leading-snug text-chrome-text-subtlest">{token.description}</p>
        )}
      </div>
    </article>
  )
}
