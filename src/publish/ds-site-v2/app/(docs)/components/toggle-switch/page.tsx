import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'ToggleSwitch',
  description: 'Segmented two-pill toggle. White rounded container with brand-purple active segment.',
}

const styleBlock = `
.bc-toggle { font-family: 'Nunito', sans-serif; display: inline-flex; padding: 4px; background: #ffffff; border-radius: 9999px; border: 1px solid #e7e7e7; gap: 2px; }
.bc-toggle__seg { font-size: 13px; font-weight: 700; padding: 8px 20px; border-radius: 9999px; border: none; cursor: pointer; transition: all 0.15s; }
.bc-toggle__seg--inactive { background: transparent; color: #8499ae; }
.bc-toggle__seg--active   { background: #4e3bc2; color: #ffffff; }
.bc-toggle--shadow { box-shadow: 0 2px 8px rgba(13,29,45,0.08); }
`

const css = `.bc-toggle { display: inline-flex; padding: 4px; background: #fff; border-radius: 9999px; border: 1px solid #e7e7e7; gap: 2px; font-family: 'Nunito'; } .bc-toggle__seg { padding: 8px 20px; border-radius: 9999px; border: none; cursor: pointer; font-weight: 700; font-size: 13px; } .bc-toggle__seg--active { background: #4e3bc2; color: #fff; } .bc-toggle__seg--inactive { background: transparent; color: #8499ae; }`

const variants = [
  { label: 'left active', css, render: (
    <div className="bc-toggle">
      <button className="bc-toggle__seg bc-toggle__seg--active">Earned</button>
      <button className="bc-toggle__seg bc-toggle__seg--inactive">Locked</button>
    </div>
  )},
  { label: 'right active', css, render: (
    <div className="bc-toggle">
      <button className="bc-toggle__seg bc-toggle__seg--inactive">Lessons</button>
      <button className="bc-toggle__seg bc-toggle__seg--active">Quizzes</button>
    </div>
  )},
  { label: 'with shadow', css, render: (
    <div className="bc-toggle bc-toggle--shadow">
      <button className="bc-toggle__seg bc-toggle__seg--active">Daily</button>
      <button className="bc-toggle__seg bc-toggle__seg--inactive">Weekly</button>
    </div>
  )},
]

const tokens = [
  { property: 'Container bg',    token: 'surface/bg/default',  value: '#ffffff' },
  { property: 'Container radius', token: 'radius/pill',        value: '9999px' },
  { property: 'Active segment',   token: 'surface/bg/brand',   value: '#4e3bc2' },
  { property: 'Active text',      token: 'text/on/brand',      value: '#ffffff' },
  { property: 'Inactive text',    token: 'text/muted',         value: '#8499ae' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="ToggleSwitch"
      description="Segmented two-pill toggle. White rounded container, brand-purple active segment, transparent + muted-text inactive segment."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
    />
  )
}
