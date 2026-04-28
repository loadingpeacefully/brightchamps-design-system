import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Visual component gallery — every component rendered live with real production token values.',
}

// Production token values used by every preview. Inlined per page for fidelity.
const styleBlock = `
.cg-card { font-family: 'Nunito', sans-serif; }
.cg-preview { display: flex; align-items: center; justify-content: center; height: 120px; padding: 16px; background: #f9fafb; border-bottom: 1px solid #e7e7e7; overflow: hidden; }

/* Button */
.cg-btn { font-family: 'Nunito'; font-weight: 800; font-size: 13px; padding: 8px 20px; border-radius: 9999px; border: 2px solid #4e3bc2; background: #4e3bc2; color: #ffffff; }

/* Card */
.cg-card-demo { background: #fff; border-radius: 12px; box-shadow: 0 1px 2px rgba(13,29,45,0.06), 0 4px 8px rgba(13,29,45,0.08); width: 160px; overflow: hidden; }
.cg-card-demo__img { height: 60px; background: linear-gradient(135deg, #4e3bc2, #7453d7); }
.cg-card-demo__body { padding: 10px; }
.cg-card-demo__title { font-size: 12px; font-weight: 800; color: #0d1d2d; }
.cg-card-demo__meta { font-size: 10px; color: #3d4d5d; }

/* Accordion */
.cg-acc { width: 200px; background: #fff; border-radius: 8px; box-shadow: 0 1px 2px rgba(13,29,45,0.06); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }
.cg-acc__title { font-size: 12px; font-weight: 800; color: #0d1d2d; }
.cg-acc__pill { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: rgba(78,59,194,0.12); color: #4e3bc2; }

/* ProgressBar */
.cg-pb { width: 200px; }
.cg-pb__track { height: 8px; background: #eff3f5; border-radius: 9999px; overflow: hidden; }
.cg-pb__fill { width: 60%; height: 100%; background: #6651E4; border-radius: 9999px; }

/* Chip */
.cg-chip { display: inline-flex; padding: 4px 12px; border-radius: 9999px; font-family: 'Nunito'; font-size: 12px; font-weight: 700; background: rgba(78,59,194,0.12); color: #4e3bc2; }

/* ToggleSwitch */
.cg-toggle { display: inline-flex; padding: 4px; background: #fff; border-radius: 9999px; border: 1px solid #e7e7e7; gap: 2px; }
.cg-toggle__seg { padding: 6px 14px; border-radius: 9999px; border: none; cursor: pointer; font-weight: 700; font-size: 11px; }
.cg-toggle__seg--active { background: #4e3bc2; color: #fff; }
.cg-toggle__seg--inactive { background: transparent; color: #8499ae; }

/* ProfileAvatar */
.cg-avatar { width: 56px; height: 56px; border-radius: 9999px; background: #4e3bc2; color: #fff; font-family: 'Nunito'; font-weight: 800; font-size: 18px; display: inline-flex; align-items: center; justify-content: center; }

/* NavBar */
.cg-navbar { display: flex; height: 36px; padding: 0 12px; background: #fff; border-bottom: 1px solid #e7e7e7; align-items: center; justify-content: space-between; width: 240px; border-radius: 6px; border: 1px solid #e7e7e7; }
.cg-navbar__brand { display: inline-flex; align-items: center; gap: 4px; font-weight: 900; font-size: 11px; color: #3d4d5d; }
.cg-navbar__logo { width: 18px; height: 18px; border-radius: 9999px; background: #4e3bc2; color: #fff; font-size: 9px; display: inline-flex; align-items: center; justify-content: center; font-weight: 900; }
.cg-navbar__pill { padding: 2px 8px; background: #f5f4fa; border-radius: 9999px; font-size: 10px; font-weight: 600; color: #3d4d5d; }

/* LeftSideBar */
.cg-sb { width: 130px; background: #fff; border: 1px solid #c9cbce; border-radius: 8px; padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.cg-sb__item { display: flex; gap: 4px; padding: 5px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; color: #222a33; align-items: center; }
.cg-sb__item--active { background: #f8f7fa; font-weight: 800; border: 1px solid #000; }
.cg-sb__icon { width: 12px; height: 12px; border-radius: 2px; background: #e7e7e7; }
.cg-sb__icon--active { background: #4e3bc2; }

/* Input */
.cg-input { display: flex; flex-direction: column; gap: 3px; width: 180px; }
.cg-input__label { font-size: 9px; font-weight: 600; color: #485767; }
.cg-input__field { font-family: 'Nunito'; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: 1.5px solid #e7e7e7; background: #fff; color: #0d1d2d; outline: none; }
`

interface Item { name: string; href: string; preview: React.ReactNode; tag: string }

const COMPONENTS: Item[] = [
  { name: 'Button',         href: '/components/button/',         tag: 'Tier 2', preview: <button className="cg-btn">Primary action</button> },
  { name: 'Card',           href: '/components/card/',           tag: 'Tier 2', preview: (
    <div className="cg-card-demo"><div className="cg-card-demo__img" /><div className="cg-card-demo__body"><div className="cg-card-demo__title">Coding</div><div className="cg-card-demo__meta">12 lessons</div></div></div>
  )},
  { name: 'Accordion',      href: '/components/accordion/',      tag: 'Tier 2', preview: (
    <div className="cg-acc"><span className="cg-acc__title">Lesson 1</span><span className="cg-acc__pill">Active</span></div>
  )},
  { name: 'ProgressBar',    href: '/components/progress-bar/',   tag: 'Tier 2', preview: (
    <div className="cg-pb"><div className="cg-pb__track"><div className="cg-pb__fill" /></div></div>
  )},
  { name: 'Chip',           href: '/components/chip/',           tag: 'Tier 3', preview: <span className="cg-chip">Coding</span> },
  { name: 'ToggleSwitch',   href: '/components/toggle-switch/',  tag: 'Tier 3', preview: (
    <div className="cg-toggle"><button className="cg-toggle__seg cg-toggle__seg--active">Earned</button><button className="cg-toggle__seg cg-toggle__seg--inactive">Locked</button></div>
  )},
  { name: 'ProfileAvatar',  href: '/components/profile-avatar/', tag: 'Tier 2', preview: <div className="cg-avatar">TD</div> },
  { name: 'NavBar',         href: '/components/nav-bar/',        tag: 'Tier 1', preview: (
    <div className="cg-navbar"><div className="cg-navbar__brand"><span className="cg-navbar__logo">B</span> BrightCHAMPS</div><span className="cg-navbar__pill">EN</span></div>
  )},
  { name: 'LeftSideBar',    href: '/components/left-side-bar/',  tag: 'Tier 1', preview: (
    <div className="cg-sb">
      <div className="cg-sb__item"><span className="cg-sb__icon" />Explore</div>
      <div className="cg-sb__item cg-sb__item--active"><span className="cg-sb__icon cg-sb__icon--active" />Nano Skills</div>
      <div className="cg-sb__item"><span className="cg-sb__icon" />Rewards</div>
    </div>
  )},
  { name: 'Input',          href: '/components/molecules/input-nd/', tag: 'Form', preview: (
    <div className="cg-input"><label className="cg-input__label">Email</label><input className="cg-input__field" placeholder="you@example.com" /></div>
  )},
]

export default function ComponentsIndex() {
  return (
    <article className="min-w-0 flex-1 max-w-[1200px]">
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />

      <div className="text-overline text-chrome-text-subtlest mb-2">Components</div>
      <h1 className="text-h1 text-chrome-text">Components</h1>
      <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
        Live component gallery. Every preview below is rendered with the exact production token values.
        Click a card to see all variants, copy-paste CSS, and the key tokens for each.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="cg-card overflow-hidden rounded-card border border-chrome-border bg-chrome-surface-raised hover:border-chrome-accent hover:shadow-lg transition-all block"
          >
            <div className="cg-preview">
              {c.preview}
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-body-m font-bold text-chrome-text">{c.name}</span>
              <span className="text-[10px] font-mono text-chrome-text-subtlest uppercase">{c.tag}</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 max-w-[62ch] text-body-s text-chrome-text-subtle">
        Looking for atoms, molecules, layouts, or sections? Expand the corresponding nav section in the sidebar
        — every spec page lists tokens, source path, and (where built) a Figma frame.
      </p>
    </article>
  )
}
