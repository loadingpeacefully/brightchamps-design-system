import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'Accordion',
  description: 'Expandable lesson/milestone container. Default + milestone variants.',
}

const styleBlock = `
.bc-acc { font-family: 'Nunito', sans-serif; width: 360px; background: #ffffff; border-radius: 12px; box-shadow: 0 1px 2px rgba(13,29,45,0.06); overflow: hidden; }
.bc-acc__head { display: flex; align-items: center; justify-content: space-between; padding: 16px; cursor: pointer; }
.bc-acc__title { font-size: 16px; font-weight: 800; color: #0d1d2d; }
.bc-acc__pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; }
.bc-acc__body { padding: 0 16px 16px 16px; font-size: 14px; color: #3d4d5d; line-height: 1.5; border-top: 1px solid #f0f1f3; padding-top: 12px; }
.bc-acc__chevron { font-size: 12px; color: #8499ae; transition: transform 0.2s; }
.bc-acc.is-open .bc-acc__chevron { transform: rotate(90deg); }
`

const css = `.bc-acc { width: 360px; background: #fff; border-radius: 12px; box-shadow: 0 1px 2px rgba(13,29,45,0.06); overflow: hidden; font-family: 'Nunito'; }`

const variants = [
  { label: 'default · expanded', css, render: (
    <div className="bc-acc is-open">
      <div className="bc-acc__head">
        <span className="bc-acc__title">Lesson 1 — Intro to Python</span>
        <span className="bc-acc__chevron">▶</span>
      </div>
      <div className="bc-acc__body">5 topics · 20 minutes — Variables, types, operators, conditions, loops.</div>
    </div>
  )},
  { label: 'default · collapsed', css, render: (
    <div className="bc-acc">
      <div className="bc-acc__head">
        <span className="bc-acc__title">Lesson 2 — Functions</span>
        <span className="bc-acc__chevron">▶</span>
      </div>
    </div>
  )},
  { label: 'milestone', css, render: (
    <div className="bc-acc">
      <div className="bc-acc__head">
        <span className="bc-acc__title">Milestone 3 — Build a Calculator</span>
        <span className="bc-acc__pill" style={{ background: 'rgba(78,59,194,0.12)', color: '#4e3bc2' }}>In progress</span>
      </div>
    </div>
  )},
  { label: 'milestone · completed', css, render: (
    <div className="bc-acc">
      <div className="bc-acc__head">
        <span className="bc-acc__title">Milestone 1 — Hello World</span>
        <span className="bc-acc__pill" style={{ background: 'rgba(17,172,105,0.12)', color: '#11AC69' }}>Completed</span>
      </div>
    </div>
  )},
]

const tokens = [
  { property: 'Container radius',  token: 'radius/container/md', value: '12px' },
  { property: 'Container bg',       token: 'surface/bg/default', value: '#ffffff' },
  { property: 'Title weight',       token: 'font/weight/extrabold', value: '800' },
  { property: 'Pill (in-progress)', token: 'surface/bg/brand/subtle', value: 'rgba(78,59,194,0.12)' },
  { property: 'Pill (completed)',   token: 'surface/bg/success/subtle', value: 'rgba(17,172,105,0.12)' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="Accordion"
      description="Expandable lesson or milestone container. Default variant for lessons; milestone variant adds a status pill (in-progress / completed)."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="column"
    />
  )
}
