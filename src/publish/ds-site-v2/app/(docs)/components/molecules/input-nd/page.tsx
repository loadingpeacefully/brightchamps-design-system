import type { Metadata } from 'next'
import { LiveComponentPage } from '@/components/chrome/LiveComponentPage'

export const metadata: Metadata = {
  title: 'Input',
  description: 'Form input — default, filled, error, disabled. Floating-label pattern.',
}

const styleBlock = `
.bc-input { font-family: 'Nunito', sans-serif; display: flex; flex-direction: column; gap: 4px; width: 280px; }
.bc-input__label { font-size: 12px; font-weight: 600; color: #485767; }
.bc-input__field { font-family: 'Nunito'; font-size: 14px; padding: 12px 14px; border-radius: 8px; border: 1.5px solid #e7e7e7; background: #ffffff; color: #0d1d2d; transition: border-color 0.15s; outline: none; }
.bc-input__field:hover { border-color: #c9cbce; }
.bc-input__field:focus { border-color: #4e3bc2; }
.bc-input__field--error { border-color: #FF5C5C; }
.bc-input__field:disabled { background: #f5f4fa; color: #8e8e8e; cursor: not-allowed; }
.bc-input__hint { font-size: 11px; font-weight: 500; color: #8e8e8e; }
.bc-input__hint--error { color: #FF5C5C; }
`

const css = `.bc-input__field { font-family: 'Nunito'; font-size: 14px; padding: 12px 14px; border-radius: 8px; border: 1.5px solid #e7e7e7; background: #fff; color: #0d1d2d; outline: none; }`

const variants = [
  { label: 'default', css, render: (
    <div className="bc-input">
      <label className="bc-input__label">Email</label>
      <input className="bc-input__field" placeholder="you@example.com" />
    </div>
  )},
  { label: 'filled', css, render: (
    <div className="bc-input">
      <label className="bc-input__label">Full name</label>
      <input className="bc-input__field" defaultValue="Troy Darmawan" />
    </div>
  )},
  { label: 'error', css: css + ' .bc-input__field--error { border-color: #FF5C5C; }', render: (
    <div className="bc-input">
      <label className="bc-input__label">Password</label>
      <input className="bc-input__field bc-input__field--error" type="password" defaultValue="abc" />
      <span className="bc-input__hint bc-input__hint--error">Must be at least 8 characters.</span>
    </div>
  )},
  { label: 'disabled', css: css + ' .bc-input__field:disabled { background: #f5f4fa; color: #8e8e8e; }', render: (
    <div className="bc-input">
      <label className="bc-input__label">Account ID</label>
      <input className="bc-input__field" defaultValue="BC-2024-XXXX" disabled />
    </div>
  )},
]

const tokens = [
  { property: 'Background',      token: 'surface/bg/default', value: '#ffffff' },
  { property: 'Border',          token: 'border/default',     value: '1.5px solid #e7e7e7' },
  { property: 'Border (focus)',  token: 'border/brand',       value: '#4e3bc2' },
  { property: 'Border (error)',  token: 'border/error',       value: '#FF5C5C' },
  { property: 'Border radius',   token: 'radius/control/md',   value: '8px' },
]

export default function Page() {
  return (
    <LiveComponentPage
      name="Input"
      description="Form input — default, filled, error, disabled. 14px Nunito, 12px label above, 8px radius, focus turns border brand-purple."
      styleBlock={styleBlock}
      variants={variants}
      tokens={tokens}
      layout="grid"
    />
  )
}
