import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'NavBar',
  description: 'Top utility bar — logo, page heading, lang/timezone selector, BrightBuddy.',
}

const styleBlock = `
.bc-navbar { font-family: 'Nunito', sans-serif; display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 24px; background: #ffffff; border-bottom: 1px solid #e7e7e7; width: 100%; }
.bc-navbar__brand { display: flex; align-items: center; gap: 8px; font-weight: 900; font-size: 17px; color: #3d4d5d; }
.bc-navbar__logo { width: 32px; height: 32px; border-radius: 9999px; background: #4e3bc2; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; }
.bc-navbar__center { font-size: 22px; font-weight: 900; color: #4d3bc2; }
.bc-navbar__actions { display: flex; align-items: center; gap: 12px; }
.bc-navbar__pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 9999px; background: #f5f4fa; font-size: 13px; font-weight: 600; color: #3d4d5d; }
.bc-navbar__buddy { width: 40px; height: 40px; border-radius: 9999px; background: #FF945B; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; }
`

const css = `.bc-navbar { display: flex; height: 60px; padding: 0 24px; background: #fff; border-bottom: 1px solid #e7e7e7; align-items: center; justify-content: space-between; font-family: 'Nunito'; }`

const variants = [
  { label: 'default', css, render: (
    <div className="bc-navbar" style={{ width: 920 }}>
      <div className="bc-navbar__brand">
        <span className="bc-navbar__logo">B</span>
        <span>BrightCHAMPS</span>
      </div>
      <div className="bc-navbar__center">Nano Skills</div>
      <div className="bc-navbar__actions">
        <span className="bc-navbar__pill">🌐 English</span>
        <span className="bc-navbar__pill">🕒 IST</span>
        <span className="bc-navbar__buddy">🤖</span>
      </div>
    </div>
  )},
]

const tokens = [
  { property: 'Height',           token: '—',                  value: '60px' },
  { property: 'Background',       token: 'surface/bg/default', value: '#ffffff' },
  { property: 'Bottom border',    token: 'border/default',     value: '1px solid #e7e7e7' },
  { property: 'Logo background',  token: 'surface/bg/brand',   value: '#4e3bc2' },
  { property: 'Page-title color', token: '— (DC-008 typo)',    value: '#4d3bc2' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="NavBar"
      description="Top utility bar — brand logo, current page heading, language + timezone pills, BrightBuddy mascot. 60px tall, full width, 1px bottom border."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="column"
    />
  )
}
