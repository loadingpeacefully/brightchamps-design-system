import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'Chip',
  description: '12 semantic variants: default + 5 status + 6 course verticals.',
}

const styleBlock = `
.bc-chip { font-family: 'Nunito', sans-serif; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; line-height: 1.4; }
.bc-chip--default     { background: #f5f4fa; color: #3d4d5d; }
.bc-chip--brand       { background: rgba(78,59,194,0.12); color: #4e3bc2; }
.bc-chip--success     { background: rgba(17,172,105,0.12); color: #11AC69; }
.bc-chip--warning     { background: rgba(255,124,53,0.18); color: #9c4500; }
.bc-chip--error       { background: rgba(255,92,92,0.14); color: #a31836; }
.bc-chip--info        { background: rgba(51,204,255,0.16); color: #0d47a1; }
.bc-chip--coding      { background: rgba(58,134,255,0.14); color: #3a86ff; }
.bc-chip--robotics    { background: rgba(255,124,53,0.14); color: #FF7C35; }
.bc-chip--finance     { background: rgba(84,186,185,0.14); color: #54bab9; }
.bc-chip--ai          { background: rgba(116,83,215,0.14); color: #7453d7; }
.bc-chip--literature  { background: rgba(163,24,54,0.10); color: #a31836; }
.bc-chip--maths       { background: rgba(17,172,105,0.14); color: #11AC69; }
`

const css = (cls: string, bg: string, fg: string) => `.bc-chip { display: inline-flex; padding: 4px 12px; border-radius: 9999px; font-family: 'Nunito'; font-size: 12px; font-weight: 700; background: ${bg}; color: ${fg}; }`

const variants = [
  { label: 'default',    css: css('default', '#f5f4fa', '#3d4d5d'),                        render: <span className="bc-chip bc-chip--default">Default</span> },
  { label: 'brand',      css: css('brand', 'rgba(78,59,194,0.12)', '#4e3bc2'),              render: <span className="bc-chip bc-chip--brand">Brand</span> },
  { label: 'success',    css: css('success', 'rgba(17,172,105,0.12)', '#11AC69'),           render: <span className="bc-chip bc-chip--success">Completed</span> },
  { label: 'warning',    css: css('warning', 'rgba(255,124,53,0.18)', '#9c4500'),           render: <span className="bc-chip bc-chip--warning">Pending</span> },
  { label: 'error',      css: css('error', 'rgba(255,92,92,0.14)', '#a31836'),              render: <span className="bc-chip bc-chip--error">Cancelled</span> },
  { label: 'info',       css: css('info', 'rgba(51,204,255,0.16)', '#0d47a1'),              render: <span className="bc-chip bc-chip--info">Info</span> },
  { label: 'coding',     css: css('coding', 'rgba(58,134,255,0.14)', '#3a86ff'),            render: <span className="bc-chip bc-chip--coding">Coding</span> },
  { label: 'robotics',   css: css('robotics', 'rgba(255,124,53,0.14)', '#FF7C35'),          render: <span className="bc-chip bc-chip--robotics">Robotics</span> },
  { label: 'finance',    css: css('finance', 'rgba(84,186,185,0.14)', '#54bab9'),           render: <span className="bc-chip bc-chip--finance">Finance</span> },
  { label: 'ai',         css: css('ai', 'rgba(116,83,215,0.14)', '#7453d7'),                render: <span className="bc-chip bc-chip--ai">AI</span> },
  { label: 'literature', css: css('literature', 'rgba(163,24,54,0.10)', '#a31836'),         render: <span className="bc-chip bc-chip--literature">Literature</span> },
  { label: 'maths',      css: css('maths', 'rgba(17,172,105,0.14)', '#11AC69'),             render: <span className="bc-chip bc-chip--maths">Maths</span> },
]

const tokens = [
  { property: 'Padding',         token: 'space/inset/xs + space/inset/sm', value: '4px 12px' },
  { property: 'Border radius',   token: 'radius/pill', value: '9999px' },
  { property: 'Font size',       token: 'font/body/xsmall', value: '12px' },
  { property: 'Font weight',     token: 'font/weight/bold', value: '700' },
  { property: 'Background mix',  token: 'surface/bg/[role]/subtle', value: 'role color @ 12-18% opacity' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="Chip"
      description="Compact label component. 12 semantic variants — default, 5 status (brand, success, warning, error, info), and 6 course verticals (coding, robotics, finance, AI, literature, maths)."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="grid"
    />
  )
}
