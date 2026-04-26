import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Palette, Type, Ruler, Layers, CircleDot, Waves, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: { absolute: 'BrightChamps Design System' },
  description: 'The token-first design system for every BrightChamps surface — extracted from Figma, verified against production DOM, governed by token decision records.',
}

const WHATS_NEW = [
  {
    date: '2026-04-26',
    kind: 'Tokens',
    label: 'TDR-0001 shipped — semantic token names live',
    description: 'color.008 → color/primary/500. All 329 canonical tokens now have semantic names. CSS variables emit as --color-primary-500 (legacy --bc-* aliases coexist for 90 days).',
    href: '/tdr/0001-taxonomy-migration/',
  },
  {
    date: '2026-04-26',
    kind: 'Merge',
    label: 'Designer DS merge — course colors, icons, spacing, component docs',
    description: '18 course vertical tokens, 1,215 icon library, spacing visualization, Button component page. 7 designer conflict tickets filed.',
    href: '/surfaces/#designer-conflicts',
  },
  {
    date: '2026-04-26',
    kind: 'Audit',
    label: '7 designer conflict tickets filed (DC-001–DC-007)',
    description: 'Status color mismatches, icon system gap, and brand primary open question formally tracked.',
    href: '/surfaces/#designer-conflicts',
  },
  {
    date: '2026-04-26',
    kind: 'Tokens',
    label: '329 canonical tokens — 112 colors, 21 typography',
    description: 'Heading scale (24/32/40/56px) added. Course vertical colors for all 6 verticals. Per-swatch descriptions.',
    href: '/foundations/color/',
  },
  { date: '2026-04-17', label: 'TDR-0001 proposed', href: '/tdr/0001-taxonomy-migration/', kind: 'TDR' },
  { date: '2026-04-16', label: 'First authenticated drift report · student surface', href: '/drift-review/2026-04-16/', kind: 'Drift' },
  { date: '2026-04-16', label: '13 manual canonicals added (overlays, surfaces, interactive)', href: '/tokens/color/', kind: 'Tokens' },
  { date: '2026-04-15', label: 'Canonical ledger built · 106 canonical tokens', href: '/whats-new/', kind: 'Ledger' },
]

const FOUNDATIONS = [
  { href: '/foundations/color/',        title: 'Color',        sub: 'Brand, neutral, feedback, overlay, surface, interactive', Icon: Palette,  hue: 'rgba(78,59,194,0.15)',  accent: '#4e3bc2' },
  { href: '/foundations/typography/',   title: 'Typography',   sub: 'Nunito across 6 sizes and 5 weights',                     Icon: Type,     hue: 'rgba(240,41,77,0.12)',  accent: '#f0294d' },
  { href: '/foundations/spacing/',      title: 'Spacing',      sub: '4px base, multiplier scale from 050 to 2000',             Icon: Ruler,    hue: 'rgba(13,71,161,0.12)',  accent: '#0d47a1' },
  { href: '/foundations/elevation/',    title: 'Elevation',    sub: 'Tonal surfaces and shadow scales',                        Icon: Layers,   hue: 'rgba(36,194,110,0.12)', accent: '#24c26e' },
  { href: '/foundations/radius/',       title: 'Radius',       sub: 'From sharp edges to fully pill-shaped',                   Icon: CircleDot, hue: 'rgba(255,187,58,0.18)', accent: '#b5870e' },
  { href: '/foundations/motion/',       title: 'Motion',       sub: 'Durations, easing, reduced-motion rules',                 Icon: Waves,    hue: 'rgba(102,81,228,0.14)', accent: '#6651e4' },
]

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-chrome-border"
        style={{
          background:
            'radial-gradient(900px 360px at 15% 0%, rgba(102,81,228,0.18), transparent 60%), radial-gradient(700px 300px at 85% 10%, rgba(255,217,0,0.14), transparent 60%), var(--chrome-surface)',
        }}
      >
        <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-16 lg:px-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-chrome-border bg-chrome-surface px-3 py-1 text-[12px] font-semibold text-chrome-text-subtle">
            <Sparkles size={12} strokeWidth={2} style={{ color: 'var(--brand-primary)' }} />
            Phase 1 · v0.2 · DS site rebuild
          </div>
          <h1 className="font-display text-display max-w-[16ch] text-chrome-text">
            The design system for every BrightChamps surface.
          </h1>
          <p className="mt-5 max-w-[60ch] text-body-l text-chrome-text-subtle">
            A token-first design system built from what BrightChamps actually ships. Extracted from
            Figma, verified against production DOM, governed by token decision records.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/foundations/"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110"
              style={{ background: 'var(--brand-primary)' }}
            >
              Explore foundations <ArrowRight size={14} strokeWidth={2.25} />
            </Link>
            <Link
              href="/get-started/"
              className="inline-flex items-center gap-2 rounded-md border border-chrome-border-bold bg-chrome-surface px-4 py-2.5 text-[14px] font-semibold text-chrome-text transition hover:bg-chrome-surface-sunken"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S NEW STRIP ─────────────────────────────────────────────── */}
      <section className="border-b border-chrome-border bg-chrome-surface-raised">
        <div className="mx-auto max-w-[1120px] px-6 py-8 lg:px-16">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-overline text-chrome-text-subtlest">What&apos;s new</div>
            <Link href="/whats-new/" className="text-[13px] font-semibold text-chrome-accent hover:underline">
              View changelog →
            </Link>
          </div>
          <ul className="divide-y divide-chrome-border">
            {WHATS_NEW.map(item => (
              <li key={item.date + item.label}>
                <Link
                  href={item.href}
                  className="group flex items-start gap-4 py-3 text-body text-chrome-text hover:text-chrome-accent transition"
                >
                  <time className="mt-[2px] w-24 shrink-0 font-mono text-[12px] text-chrome-text-subtlest tabular-nums">
                    {item.date}
                  </time>
                  <span
                    className="mt-[2px] inline-flex items-center rounded-[3px] px-2 py-[1px] text-[10px] font-bold uppercase tracking-[0.04em] shrink-0"
                    style={{
                      background: 'var(--chrome-accent-subtle)',
                      color: 'var(--chrome-accent)',
                    }}
                  >
                    {item.kind}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block">{item.label}</span>
                    {'description' in item && item.description && (
                      <span className="mt-0.5 block text-[12px] leading-snug text-chrome-text-subtlest">{item.description}</span>
                    )}
                  </span>
                  <ArrowRight size={14} className="mt-[5px] shrink-0 text-chrome-text-subtlest transition group-hover:text-chrome-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FOUNDATIONS GRID ─────────────────────────────────────────────── */}
      <section className="border-b border-chrome-border">
        <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-16">
          <div className="mb-2 text-overline text-chrome-text-subtlest">Foundations</div>
          <h2 className="mb-2 text-h2 text-chrome-text">Start with the primitives.</h2>
          <p className="mb-10 max-w-[62ch] text-body-l text-chrome-text-subtle">
            Every component in BrightChamps is built from the same small set of tokens. Master these
            foundations and the rest of the system falls into place.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FOUNDATIONS.map(f => (
              <Link
                key={f.href}
                href={f.href}
                className="group block rounded-card border border-chrome-border bg-chrome-surface p-6 transition hover:-translate-y-0.5 hover:border-chrome-accent hover:shadow-2"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ background: f.hue, color: f.accent }}
                >
                  <f.Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-2 text-h4 text-chrome-text">
                  {f.title}
                  <ArrowRight size={16} className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 text-chrome-accent" />
                </div>
                <p className="mt-1.5 text-body text-chrome-text-subtle">{f.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRINCIPLES / CTA ─────────────────────────────────────────────── */}
      <section className="bg-chrome-surface-raised">
        <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-16">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="mb-2 text-overline text-chrome-text-subtlest">Principle 01</div>
              <h3 className="mb-2 text-h3 text-chrome-text">Extracted, not invented.</h3>
              <p className="text-body text-chrome-text-subtle">
                Every canonical token in the system was either pulled from a live surface or from a
                Figma file that ships. Nothing is aspirational — the system reflects what
                BrightChamps is today.
              </p>
            </div>
            <div>
              <div className="mb-2 text-overline text-chrome-text-subtlest">Principle 02</div>
              <h3 className="mb-2 text-h3 text-chrome-text">Governed, never auto-resolved.</h3>
              <p className="text-body text-chrome-text-subtle">
                Drift between Figma and DOM is always flagged, never silently reconciled. Every
                canonicalization is a human decision, documented as a Token Decision Record.
              </p>
            </div>
            <div>
              <div className="mb-2 text-overline text-chrome-text-subtlest">Principle 03</div>
              <h3 className="mb-2 text-h3 text-chrome-text">Published, not hoarded.</h3>
              <p className="text-body text-chrome-text-subtle">
                Every accepted token reaches engineers as a CSS variable, designers as a Figma style,
                and this site as a live specimen — automatically, on every build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
