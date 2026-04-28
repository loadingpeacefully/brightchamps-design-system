import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'Card',
  description: 'Base content container with optional image area, body, and footer CTA.',
}

const styleBlock = `
.bc-card { font-family: 'Nunito', sans-serif; background: #ffffff; border-radius: 16px; min-width: 240px; max-width: 280px; box-shadow: 0 1px 2px rgba(13,29,45,0.06), 0 4px 8px rgba(13,29,45,0.08); overflow: hidden; }
.bc-card__img { height: 140px; background: linear-gradient(135deg, #4e3bc2 0%, #7453d7 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 18px; }
.bc-card__body { padding: 16px; }
.bc-card__title { font-size: 16px; font-weight: 800; color: #0d1d2d; margin: 0 0 4px 0; }
.bc-card__meta { font-size: 12px; color: #3d4d5d; margin: 0 0 12px 0; }
.bc-card__cta { font-family: 'Nunito'; font-weight: 800; font-size: 13px; padding: 6px 18px; border-radius: 9999px; border: 2px solid #4e3bc2; background: #4e3bc2; color: #fff; cursor: pointer; }
`

const baseCSS = `.bc-card { background: #fff; border-radius: 16px; min-width: 240px; max-width: 280px; box-shadow: 0 1px 2px rgba(13,29,45,0.06), 0 4px 8px rgba(13,29,45,0.08); overflow: hidden; font-family: 'Nunito'; }`

const variants = [
  { label: 'with-image', css: baseCSS, render: (
    <div className="bc-card">
      <div className="bc-card__img">📚 Course</div>
      <div className="bc-card__body">
        <h3 className="bc-card__title">Coding Fundamentals</h3>
        <p className="bc-card__meta">12 lessons · Beginner</p>
        <button className="bc-card__cta">Continue →</button>
      </div>
    </div>
  )},
  { label: 'base', css: baseCSS, render: (
    <div className="bc-card">
      <div className="bc-card__body">
        <h3 className="bc-card__title">App Development</h3>
        <p className="bc-card__meta">7 of 24 lessons complete</p>
        <button className="bc-card__cta">Continue →</button>
      </div>
    </div>
  )},
  { label: 'lesson', css: baseCSS, render: (
    <div className="bc-card" style={{ minWidth: 320 }}>
      <div className="bc-card__body">
        <h3 className="bc-card__title">Lesson 4 — Variables</h3>
        <p className="bc-card__meta" style={{ marginBottom: 8 }}>20 min · Self-paced</p>
        <div style={{ height: 6, background: '#e7e7e7', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ width: '60%', height: '100%', background: '#11AC69' }} />
        </div>
        <button className="bc-card__cta" style={{ background: 'transparent', color: '#4e3bc2' }}>Resume</button>
      </div>
    </div>
  )},
]

const tokens = [
  { property: 'Background',     token: 'surface/bg/default', value: '#ffffff' },
  { property: 'Border radius',   token: 'radius/container/lg', value: '16px' },
  { property: 'Shadow',          token: 'shadow/md',           value: '0 4px 8px rgba(13,29,45,.08)' },
  { property: 'Padding',         token: 'space/inset/md',      value: '16px' },
  { property: 'Title weight',    token: 'font/weight/extrabold', value: '800' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="Card"
      description="Base content container. Three variants: with-image (course thumbnail), base (no image), lesson (with progress bar). 16px radius, soft shadow, white bg."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
    />
  )
}
