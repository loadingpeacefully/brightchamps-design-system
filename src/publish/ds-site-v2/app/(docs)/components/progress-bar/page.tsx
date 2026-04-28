import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'ProgressBar',
  description: '5 status variants: default, in-progress, completed, skipped, paused.',
}

const styleBlock = `
.bc-pb { font-family: 'Nunito', sans-serif; width: 240px; }
.bc-pb__label { display: flex; justify-content: space-between; font-size: 12px; color: #3d4d5d; margin-bottom: 6px; font-weight: 600; }
.bc-pb__track { height: 10px; background: #eff3f5; border-radius: 9999px; overflow: hidden; }
.bc-pb__fill { height: 100%; border-radius: 9999px; transition: width 0.3s ease; }
.bc-pb__fill--default     { background: #3d4d5d; }
.bc-pb__fill--in-progress { background: #6651E4; }
.bc-pb__fill--completed   { background: #11AC69; }
.bc-pb__fill--skipped     { background: #FF7C35; }
.bc-pb__fill--paused      { background: #33CCFF; }
`

const baseCSS = `.bc-pb__track { height: 10px; background: #eff3f5; border-radius: 9999px; overflow: hidden; } .bc-pb__fill { height: 100%; border-radius: 9999px; }`

const Bar = ({ pct, color, label }: { pct: number; color: string; label: string }) => (
  <div className="bc-pb">
    <div className="bc-pb__label"><span>{label}</span><span>{pct}%</span></div>
    <div className="bc-pb__track">
      <div className="bc-pb__fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  </div>
)

const variants = [
  { label: 'default',     css: baseCSS + ' .bc-pb__fill { background: #3d4d5d; }', render: <Bar pct={40} color="#3d4d5d" label="Default" /> },
  { label: 'in-progress', css: baseCSS + ' .bc-pb__fill { background: #6651E4; }', render: <Bar pct={60} color="#6651E4" label="In progress" /> },
  { label: 'completed',   css: baseCSS + ' .bc-pb__fill { background: #11AC69; }', render: <Bar pct={100} color="#11AC69" label="Completed" /> },
  { label: 'skipped',     css: baseCSS + ' .bc-pb__fill { background: #FF7C35; }', render: <Bar pct={20} color="#FF7C35" label="Skipped" /> },
  { label: 'paused',      css: baseCSS + ' .bc-pb__fill { background: #33CCFF; }', render: <Bar pct={45} color="#33CCFF" label="Paused" /> },
]

const tokens = [
  { property: 'Track background',    token: 'surface/bg/sunken',  value: '#eff3f5' },
  { property: 'Track height',        token: '—',                  value: '10px' },
  { property: 'Fill (in-progress)',  token: 'surface/bg/brand',   value: '#6651E4' },
  { property: 'Fill (completed)',    token: 'surface/bg/success', value: '#11AC69' },
  { property: 'Border radius',       token: 'radius/pill',        value: '9999px' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="ProgressBar"
      description="Horizontal progress bar with 5 status variants matching production. 10px tall, pill ends, color indicates state."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="column"
    />
  )
}
