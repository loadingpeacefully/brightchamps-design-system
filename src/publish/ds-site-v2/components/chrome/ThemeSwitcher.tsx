'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Contrast, Eye, Monitor } from 'lucide-react'

const OPTIONS = [
  { value: 'light',    label: 'Light',    icon: Sun },
  { value: 'dark',     label: 'Dark',     icon: Moon },
  { value: 'hc-light', label: 'HC Light', icon: Contrast },
  { value: 'hc-dark',  label: 'HC Dark',  icon: Eye },
  { value: 'system',   label: 'System',   icon: Monitor },
] as const

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-8 w-[76px]" aria-hidden />
  }

  const current = OPTIONS.find(o => o.value === theme) ?? OPTIONS[4]
  const Icon = current.icon

  const cycle = () => {
    const i = OPTIONS.findIndex(o => o.value === theme)
    const next = OPTIONS[(i + 1) % OPTIONS.length]!
    setTheme(next.value)
  }

  return (
    <button
      onClick={cycle}
      className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[11px] font-semibold text-[color:var(--chrome-header-fg-subtle)] hover:bg-white/10 hover:text-white transition"
      aria-label={`Theme: ${current.label}. Click to cycle to next theme.`}
      title={`Theme: ${current.label} · click to cycle`}
    >
      <Icon size={14} strokeWidth={1.75} />
      <span className="hidden sm:inline uppercase tracking-[0.04em]">{current.label}</span>
    </button>
  )
}
