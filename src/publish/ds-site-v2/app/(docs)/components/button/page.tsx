import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'Button',
  description: 'Primary action component. 5 variants: contained, outlined, danger, info, underline.',
}

const styleBlock = `
.bc-btn {
  font-family: 'Nunito', sans-serif;
  font-weight: 800;
  font-size: 14px;
  padding: 8px 24px;
  border-radius: 9999px;
  border: 2px solid transparent;
  cursor: pointer;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: filter 0.15s ease;
}
.bc-btn:hover { filter: brightness(0.95); }
.bc-btn--contained  { background: #4e3bc2; border-color: #4e3bc2; color: #ffffff; }
.bc-btn--outlined   { background: transparent; border-color: #4e3bc2; color: #4e3bc2; }
.bc-btn--danger     { background: transparent; border-color: #FF5C5C; color: #FF5C5C; }
.bc-btn--info       { background: transparent; border-color: #33CCFF; color: #33CCFF; }
.bc-btn--underline  { background: transparent; border: none; color: #4e3bc2; text-decoration: underline; padding: 8px 12px; }
.bc-btn:disabled    { background: #eff3f5; border-color: #eff3f5; color: #8e8e8e; cursor: not-allowed; }
`

const variants = [
  { label: 'contained',  css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 24px; border-radius: 9999px; border: 2px solid #4e3bc2; background: #4e3bc2; color: #fff; cursor: pointer; }`, render: <button className="bc-btn bc-btn--contained">Primary action</button> },
  { label: 'outlined',   css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 24px; border-radius: 9999px; border: 2px solid #4e3bc2; background: transparent; color: #4e3bc2; cursor: pointer; }`, render: <button className="bc-btn bc-btn--outlined">Outlined action</button> },
  { label: 'danger',     css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 24px; border-radius: 9999px; border: 2px solid #FF5C5C; background: transparent; color: #FF5C5C; cursor: pointer; }`, render: <button className="bc-btn bc-btn--danger">Cancel class</button> },
  { label: 'info',       css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 24px; border-radius: 9999px; border: 2px solid #33CCFF; background: transparent; color: #33CCFF; cursor: pointer; }`, render: <button className="bc-btn bc-btn--info">Learn more</button> },
  { label: 'underline',  css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 12px; background: transparent; border: none; color: #4e3bc2; text-decoration: underline; cursor: pointer; }`, render: <button className="bc-btn bc-btn--underline">Forgot password?</button> },
  { label: 'disabled',   css: `.bc-btn { font-family: 'Nunito'; font-weight: 800; font-size: 14px; padding: 8px 24px; border-radius: 9999px; border: 2px solid #eff3f5; background: #eff3f5; color: #8e8e8e; cursor: not-allowed; }`, render: <button className="bc-btn bc-btn--contained" disabled>Disabled</button> },
]

const tokens = [
  { property: 'Background (contained)', token: 'surface/bg/brand', value: '#4e3bc2' },
  { property: 'Border radius',          token: 'radius/pill',     value: '9999px' },
  { property: 'Padding',                token: 'space/inset/sm + space/inset/2xl', value: '8px 24px' },
  { property: 'Font family',            token: 'font/family/primary',  value: 'Nunito' },
  { property: 'Font weight',            token: 'font/weight/extrabold', value: '800' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="Button"
      description="Primary action component. Five variants from production: contained (filled brand), outlined, danger, info, underline. Pill-shaped, Nunito 14/800."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
    />
  )
}
