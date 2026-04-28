'use client'

import { useMemo, useState } from 'react'
import { Check, X, Pipette, ArrowLeftRight } from 'lucide-react'
import { colors } from '@/lib/tokens.generated'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  }
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (c: number): number => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = hexToRgb(fg)
  const b = hexToRgb(bg)
  if (!a || !b) return null
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

interface Verdict {
  pass: boolean
  ratio: string
  rules: { label: string; threshold: number; pass: boolean }[]
}

function verdict(ratio: number | null): Verdict {
  if (ratio == null) return { pass: false, ratio: '—', rules: [] }
  return {
    pass: ratio >= 4.5,
    ratio: ratio.toFixed(2),
    rules: [
      { label: 'AA (normal text)',  threshold: 4.5, pass: ratio >= 4.5 },
      { label: 'AA (large text)',   threshold: 3,   pass: ratio >= 3 },
      { label: 'AAA (normal text)', threshold: 7,   pass: ratio >= 7 },
      { label: 'AAA (large text)',  threshold: 4.5, pass: ratio >= 4.5 },
      { label: 'UI components',     threshold: 3,   pass: ratio >= 3 },
    ],
  }
}

export function ContrastClient() {
  const colorOptions = useMemo(
    () => colors.filter(c => /^#[0-9a-fA-F]{6}$/.test(c.value)),
    [],
  )
  const defaultFg = colorOptions.find(c => c.name === 'color/neutral/1600')?.value ?? '#0d1d2d'
  const defaultBg = colorOptions.find(c => c.name === 'color/neutral/100')?.value ?? '#ffffff'

  const [fg, setFg] = useState<string>(defaultFg)
  const [bg, setBg] = useState<string>(defaultBg)

  const ratio = contrastRatio(fg, bg)
  const v = verdict(ratio)

  const swap = (): void => {
    setFg(bg)
    setBg(fg)
  }

  const handleHexInput = (value: string, setter: (v: string) => void): void => {
    let val = value.trim()
    if (val && !val.startsWith('#')) val = '#' + val
    setter(val)
  }

  const findToken = (hex: string): string | null => {
    const m = colorOptions.find(c => c.value.toLowerCase() === hex.toLowerCase())
    return m ? m.cssVar : null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ─── controls ───────────────────────────────────────────── */}
      <section>
        <div className="grid gap-4">
          <ColorPicker
            label="Foreground (text / icon)"
            value={fg}
            onChange={v => handleHexInput(v, setFg)}
            tokenVar={findToken(fg)}
            colorOptions={colorOptions}
          />
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={swap}
              className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border bg-chrome-surface px-3 py-1.5 text-[12px] font-semibold text-chrome-text-subtle hover:border-chrome-accent hover:text-chrome-accent transition"
              aria-label="Swap foreground and background"
            >
              <ArrowLeftRight size={12} /> Swap
            </button>
          </div>
          <ColorPicker
            label="Background (surface / fill)"
            value={bg}
            onChange={v => handleHexInput(v, setBg)}
            tokenVar={findToken(bg)}
            colorOptions={colorOptions}
          />
        </div>
      </section>

      {/* ─── result ─────────────────────────────────────────────── */}
      <section>
        <div
          className="rounded-card border border-chrome-border overflow-hidden"
          style={{ background: bg }}
        >
          <div className="px-5 py-7" style={{ color: fg }}>
            <div className="text-[28px] font-bold leading-tight">Sample heading</div>
            <p className="mt-2 text-[14px] leading-snug max-w-[34ch]">
              The quick brown fox jumps over the lazy dog — this preview uses your selected foreground over your
              selected background. Text contrast determines whether all your students can read this comfortably.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: fg, color: bg }}>
              <Pipette size={11} /> Reverse pill
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-overline text-chrome-text-subtlest">Contrast ratio</div>
              <div className="font-mono text-[36px] leading-none font-bold tabular-nums text-chrome-text mt-0.5">{v.ratio}</div>
            </div>
            <div
              className={'rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] ' +
                (v.pass ? 'bg-[rgba(36,194,110,0.18)] text-[#0e6a32]' : 'bg-[rgba(240,41,77,0.16)] text-[#a31836]')}
            >
              {v.pass ? 'AA pass' : 'AA fail'}
            </div>
          </div>
          <ul className="mt-4 space-y-1.5">
            {v.rules.map(r => (
              <li key={r.label} className="flex items-center justify-between text-[12.5px]">
                <span className="text-chrome-text">{r.label}</span>
                <span className="flex items-center gap-1.5 font-mono text-chrome-text-subtle tabular-nums">
                  {r.threshold}+
                  {r.pass
                    ? <Check size={13} className="text-[#0e6a32]" />
                    : <X size={13} className="text-[#a31836]" />}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-chrome-text-subtlest leading-snug">
            Large text = 18px+ regular or 14px+ bold. UI components covers focus indicators, icons, and graphical
            objects. WCAG 2.1 §1.4.3, §1.4.6, §1.4.11.
          </p>
        </div>
      </section>
    </div>
  )
}

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  tokenVar: string | null
  colorOptions: typeof colors
}

function ColorPicker({ label, value, onChange, tokenVar, colorOptions }: ColorPickerProps): JSX.Element {
  return (
    <label className="block">
      <span className="text-overline text-chrome-text-subtlest mb-1 block">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
          onChange={e => onChange(e.target.value)}
          className="h-10 w-10 rounded-md border border-chrome-border bg-chrome-surface cursor-pointer p-0.5"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={7}
          className="rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 font-mono text-[13px] text-chrome-text outline-none focus:border-chrome-accent w-[110px]"
        />
        <select
          value={value.toLowerCase()}
          onChange={e => onChange(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[12px] text-chrome-text outline-none focus:border-chrome-accent"
        >
          <option value={value.toLowerCase()}>{tokenVar ?? '— Pick a token —'}</option>
          {colorOptions.map(c => (
            <option key={c.name} value={c.value.toLowerCase()}>
              {c.name} · {c.value}
            </option>
          ))}
        </select>
      </div>
      {tokenVar && (
        <code className="mt-1.5 block font-mono text-[11px] text-chrome-text-subtle">var({tokenVar})</code>
      )}
    </label>
  )
}
