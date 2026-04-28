import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'LeftSideBar',
  description: '240px vertical navigation rail with 5 nav items + active state.',
}

const styleBlock = `
.bc-sb { font-family: 'Nunito', sans-serif; width: 240px; min-height: 380px; background: #ffffff; border: 1px solid #c9cbce; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px; box-shadow: -7px 4px 44px rgba(0,0,0,0.10); }
.bc-sb__item { display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 600; color: #222a33; cursor: pointer; transition: background 0.1s; }
.bc-sb__item:hover { background: rgba(0,0,0,0.04); }
.bc-sb__item--active { background: #f8f7fa; font-weight: 800; border: 1px solid #000000; }
.bc-sb__icon { width: 24px; height: 24px; border-radius: 4px; background: #e7e7e7; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; }
.bc-sb__icon--active { background: #4e3bc2; color: #ffffff; }
`

const css = `.bc-sb { width: 240px; background: #fff; border: 1px solid #c9cbce; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px; box-shadow: -7px 4px 44px rgba(0,0,0,0.10); font-family: 'Nunito'; } .bc-sb__item { display: flex; gap: 8px; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: 600; color: #222a33; } .bc-sb__item--active { background: #f8f7fa; font-weight: 800; border: 1px solid #000; }`

const Item = ({ icon, label, active }: { icon: string; label: string; active?: boolean }) => (
  <div className={`bc-sb__item${active ? ' bc-sb__item--active' : ''}`}>
    <span className={`bc-sb__icon${active ? ' bc-sb__icon--active' : ''}`}>{icon}</span>
    {label}
  </div>
)

const variants = [
  { label: 'default · Nano Skills active', css, render: (
    <div className="bc-sb">
      <Item icon="🔍" label="Explore" />
      <Item icon="📚" label="Learn" />
      <Item icon="📋" label="Assessment" />
      <Item icon="✨" label="Nano Skills" active />
      <Item icon="🏆" label="Rewards" />
    </div>
  )},
  { label: 'Learn active', css, render: (
    <div className="bc-sb">
      <Item icon="🔍" label="Explore" />
      <Item icon="📚" label="Learn" active />
      <Item icon="📋" label="Assessment" />
      <Item icon="✨" label="Nano Skills" />
      <Item icon="🏆" label="Rewards" />
    </div>
  )},
]

const tokens = [
  { property: 'Width',          token: '— (production canonical)', value: '240px' },
  { property: 'Background',     token: 'surface/bg/default',       value: '#ffffff' },
  { property: 'Border',         token: 'border/default',           value: '1px solid #c9cbce' },
  { property: 'Item radius',    token: 'radius/control/md',         value: '8px' },
  { property: 'Active bg',      token: 'surface/bg/sunken',         value: '#f8f7fa' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="LeftSideBar"
      description="240px vertical navigation rail. 5 nav items (Explore, Learn, Assessment, Nano Skills, Rewards). Active item gets light bg + 1px black border + ExtraBold weight + brand-purple icon background."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
    />
  )
}
