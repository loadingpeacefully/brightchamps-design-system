import type { NavItem } from '@/lib/nav'

const VARIANTS: Record<NonNullable<NavItem['badge']>, { bg: string; fg: string; label: string }> = {
  new:        { bg: 'var(--chrome-accent-subtle)', fg: 'var(--chrome-accent)', label: 'New' },
  beta:       { bg: 'rgba(13,108,161,0.12)',       fg: '#0d47a1',              label: 'Beta' },
  caution:    { bg: 'rgba(255,217,0,0.2)',         fg: '#7a5a00',              label: 'Caution' },
  deprecated: { bg: 'rgba(240,41,77,0.12)',        fg: '#a31836',              label: 'Deprecated' },
}

export function StatusBadge({ variant }: { variant: NonNullable<NavItem['badge']> }) {
  const v = VARIANTS[variant]
  return (
    <span
      className="shrink-0 inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-bold uppercase leading-[14px] tracking-[0.04em]"
      style={{ background: v.bg, color: v.fg }}
    >
      {v.label}
    </span>
  )
}
