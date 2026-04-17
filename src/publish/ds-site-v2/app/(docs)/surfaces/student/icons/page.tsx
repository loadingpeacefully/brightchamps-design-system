import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { AlertTriangle, Info } from 'lucide-react'
import { loadIcons, type IconEntry } from '@/lib/surface-data'

export const metadata: Metadata = {
  title: 'Student · Icons',
  description: 'Icon audit for the student surface — 160 unique icons, 7 inline SVGs, 153 image-based assets.',
}

const TOC = [
  { id: 'auth-note', label: 'Auth note',     level: 2 as const },
  { id: 'summary',   label: 'Summary',        level: 2 as const },
  { id: 'finding',   label: 'Key finding',    level: 2 as const },
  { id: 'svgs',      label: 'Inline SVGs',    level: 2 as const },
  { id: 'icons',     label: 'Icon-size',      level: 2 as const },
  { id: 'avatars',   label: 'Avatar/badge',   level: 2 as const },
  { id: 'thumbs',    label: 'Thumbnails',     level: 2 as const },
  { id: 'large',     label: 'Illustrations',  level: 2 as const },
]

type SizeBucket = 'icon' | 'avatar' | 'thumbnail' | 'illustration'

function bucketOf(entry: IconEntry): SizeBucket {
  const max = Math.max(entry.width, entry.height)
  if (max <= 32) return 'icon'
  if (max <= 80) return 'avatar'
  if (max <= 160) return 'thumbnail'
  return 'illustration'
}

const BUCKET_META: Record<SizeBucket, { id: string; label: string; description: string }> = {
  icon:         { id: 'icons',   label: 'Icon-size (≤32px)',       description: 'Navigation icons, action indicators, status glyphs. Should be an SVG icon system.' },
  avatar:       { id: 'avatars', label: 'Avatar / badge (33–80px)', description: 'User avatars, achievement badges, small illustrations in cards.' },
  thumbnail:    { id: 'thumbs',  label: 'Thumbnails (81–160px)',    description: 'Course thumbnails, certificate previews, mid-size illustrations.' },
  illustration: { id: 'large',   label: 'Illustrations (>160px)',   description: 'Hero banners, onboarding illustrations, full-width assets.' },
}

function resolveImgSrc(src: string): string {
  if (src.startsWith('http')) return src
  return `https://champ.brightchamps.com${src.startsWith('/') ? '' : '/'}${src}`
}

function ImageGrid({ entries }: { entries: IconEntry[] }) {
  return (
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,80px)] gap-2">
      {entries.map((entry, i) => (
        <div key={i} className="group relative flex h-20 w-20 items-center justify-center rounded-md border border-chrome-border bg-chrome-surface-sunken overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImgSrc(entry.src ?? entry.identifier)}
            alt={`${entry.width}×${entry.height}`}
            width={entry.width}
            height={entry.height}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="mb-1 font-mono text-[9px] font-semibold text-white">{entry.width}×{entry.height} · {entry.count}×</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StudentIconsPage() {
  const icons = loadIcons()
  const svgs = icons.filter(i => i.type === 'svg')
  const imgs = icons.filter(i => i.type === 'img')
  const totalOccurrences = icons.reduce((s, i) => s + i.count, 0)

  const buckets: Record<SizeBucket, IconEntry[]> = { icon: [], avatar: [], thumbnail: [], illustration: [] }
  for (const img of imgs) buckets[bucketOf(img)].push(img)

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Surfaces · Student</div>
        <h1 className="text-h1 text-chrome-text">Icon inventory</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          {icons.length} unique icons across {totalOccurrences.toLocaleString()} total occurrences on 7 student app pages.
        </p>

        <section id="auth-note" className="mt-8 scroll-mt-24">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-sunken p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0 text-chrome-accent" strokeWidth={1.75} />
              <p className="text-body-s text-chrome-text">
                Images load from <code className="font-mono text-[12px]">champ.brightchamps.com</code> and{' '}
                <code className="font-mono text-[12px]">ik.imagekit.io</code>.
                You must be logged in to the student app in this browser for authenticated images to appear.
                If thumbnails are blank, open{' '}
                <a href="https://champ.brightchamps.com" target="_blank" rel="noreferrer" className="text-chrome-accent underline underline-offset-4">
                  champ.brightchamps.com
                </a>{' '}
                first and authenticate.
              </p>
            </div>
          </div>
        </section>

        <section id="summary" className="mt-10 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Total unique</div>
              <div className="text-[28px] font-bold text-chrome-text">{icons.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Inline SVGs</div>
              <div className="text-[28px] font-bold text-chrome-accent">{svgs.length}</div>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
              <div className="text-overline text-chrome-text-subtlest mb-1">Image assets</div>
              <div className="text-[28px] font-bold text-chrome-text-subtle">{imgs.length}</div>
            </div>
          </div>
        </section>

        <section id="finding" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Key finding</h2>
          <div className="mt-4 rounded-card border-l-4 border-l-[#c07a00] border border-chrome-border bg-[rgba(255,187,58,0.06)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} strokeWidth={1.75} className="text-[#c07a00]" />
              <span className="text-[13px] font-bold text-[#8a5e00] uppercase tracking-[0.04em]">No icon system detected</span>
            </div>
            <p className="text-body text-chrome-text">
              The student app uses image assets ({imgs.length} unique) rather than an inline SVG sprite or icon
              component library. Only {svgs.length} inline SVGs were found — 3 of which are Lottie animations, not icons.
              This means icons cannot be themed, sized via CSS tokens, or tree-shaken at build time.
            </p>
            <p className="mt-2 text-body-s text-chrome-text-subtle font-semibold">
              Recommendation: audit with the design team. Adopt an SVG icon system to align with the token pipeline.
            </p>
          </div>
        </section>

        <section id="svgs" className="mt-12 scroll-mt-24">
          <div className="flex items-baseline gap-3">
            <h2 className="text-h2 text-chrome-text">Inline SVGs</h2>
            <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">{svgs.length}</span>
          </div>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            {svgs.filter(s => s.markup).length} have captured markup and render below. {svgs.filter(s => !s.markup).length} were too large (Lottie animations) and show as dimension placeholders.
          </p>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,120px)] gap-4">
            {svgs.map((svg, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
                <div className="flex h-16 w-16 items-center justify-center">
                  {svg.markup ? (
                    <div
                      className="[&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:h-12 [&>svg]:w-12"
                      dangerouslySetInnerHTML={{ __html: svg.markup }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-dashed border-chrome-border-bold text-[10px] font-mono text-chrome-text-subtlest">
                      {svg.width}×{svg.height}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-mono text-[10px] font-semibold text-chrome-text">{svg.width}×{svg.height}</div>
                  <div className="text-[10px] text-chrome-text-subtlest">{svg.count}× · {svg.pages.length} pages</div>
                  <div className="text-[9px] text-chrome-text-subtlest">{svg.viewBox ?? 'no viewBox'}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {(['icon', 'avatar', 'thumbnail', 'illustration'] as SizeBucket[]).map(bucket => {
          const entries = buckets[bucket]
          if (entries.length === 0) return null
          const meta = BUCKET_META[bucket]
          return (
            <section key={bucket} id={meta.id} className="mt-12 scroll-mt-24">
              <div className="flex items-baseline gap-3">
                <h2 className="text-h2 text-chrome-text">{meta.label}</h2>
                <span className="font-mono text-[12px] font-semibold rounded-[10px] bg-chrome-surface-sunken px-2 py-[1px] text-chrome-text-subtle">{entries.length}</span>
              </div>
              <p className="mt-2 text-body-s text-chrome-text-subtle">{meta.description}</p>
              <ImageGrid entries={entries} />
            </section>
          )
        })}
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
