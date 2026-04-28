import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'ProfileAvatar',
  description: 'Circular avatar — image or initials. 5 sizes from 24 to 80.',
}

const styleBlock = `
.bc-avatar { font-family: 'Nunito', sans-serif; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; background: #4e3bc2; color: #ffffff; font-weight: 800; flex-shrink: 0; }
.bc-avatar--xs  { width: 24px; height: 24px; font-size: 10px; }
.bc-avatar--sm  { width: 32px; height: 32px; font-size: 12px; }
.bc-avatar--md  { width: 48px; height: 48px; font-size: 16px; }
.bc-avatar--lg  { width: 64px; height: 64px; font-size: 20px; }
.bc-avatar--xl  { width: 80px; height: 80px; font-size: 24px; }
.bc-avatar--coding   { background: #3a86ff; }
.bc-avatar--maths    { background: #11AC69; }
.bc-avatar--robotics { background: #FF7C35; }
`

const css = `.bc-avatar { width: SIZEpx; height: SIZEpx; border-radius: 9999px; background: #4e3bc2; color: #fff; font-family: 'Nunito'; font-weight: 800; font-size: FSpx; display: inline-flex; align-items: center; justify-content: center; }`

const variants = [
  { label: 'xs · 24',  css: css.replace(/SIZE/g, '24').replace('FS', '10'), render: <div className="bc-avatar bc-avatar--xs">TD</div> },
  { label: 'sm · 32',  css: css.replace(/SIZE/g, '32').replace('FS', '12'), render: <div className="bc-avatar bc-avatar--sm">TD</div> },
  { label: 'md · 48',  css: css.replace(/SIZE/g, '48').replace('FS', '16'), render: <div className="bc-avatar bc-avatar--md">TD</div> },
  { label: 'lg · 64',  css: css.replace(/SIZE/g, '64').replace('FS', '20'), render: <div className="bc-avatar bc-avatar--lg">TD</div> },
  { label: 'xl · 80',  css: css.replace(/SIZE/g, '80').replace('FS', '24'), render: <div className="bc-avatar bc-avatar--xl">TD</div> },
  { label: 'coding · md', css: '.bc-avatar { background: #3a86ff; }', render: <div className="bc-avatar bc-avatar--md bc-avatar--coding">ZK</div> },
  { label: 'maths · md',  css: '.bc-avatar { background: #11AC69; }', render: <div className="bc-avatar bc-avatar--md bc-avatar--maths">PP</div> },
  { label: 'robotics · md', css: '.bc-avatar { background: #FF7C35; }', render: <div className="bc-avatar bc-avatar--md bc-avatar--robotics">SR</div> },
]

const tokens = [
  { property: 'Background (default)', token: 'surface/bg/brand',  value: '#4e3bc2' },
  { property: 'Text color',           token: 'text/on/brand',      value: '#ffffff' },
  { property: 'Border radius',        token: 'radius/pill',         value: '9999px' },
  { property: 'Font weight',          token: 'font/weight/extrabold', value: '800' },
  { property: 'Sizes',                token: 'icon/size/{xs,sm,md,lg,xl}', value: '24 / 32 / 48 / 64 / 80px' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="ProfileAvatar"
      description="Circular avatar — initials when no photo. 5 sizes (24/32/48/64/80) and per-course color variants."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="grid"
    />
  )
}
