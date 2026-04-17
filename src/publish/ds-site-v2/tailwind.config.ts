import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        chrome: {
          surface: 'var(--chrome-surface)',
          'surface-raised': 'var(--chrome-surface-raised)',
          'surface-sunken': 'var(--chrome-surface-sunken)',
          'surface-overlay': 'var(--chrome-surface-overlay)',
          border: 'var(--chrome-border)',
          'border-bold': 'var(--chrome-border-bold)',
          'border-focused': 'var(--chrome-border-focused)',
          text: 'var(--chrome-text)',
          'text-subtle': 'var(--chrome-text-subtle)',
          'text-subtlest': 'var(--chrome-text-subtlest)',
          'text-inverse': 'var(--chrome-text-inverse)',
          accent: 'var(--chrome-accent)',
          'accent-subtle': 'var(--chrome-accent-subtle)',
          'accent-hovered': 'var(--chrome-accent-hovered)',
          highlight: 'var(--chrome-highlight)',
          header: 'var(--chrome-header-bg)',
        },
        bc: {
          'brand-primary': 'var(--bc-brand-primary)',
          'brand-accent': 'var(--bc-brand-accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['56px', { lineHeight: '60px', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['36px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h4: ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-l': ['16px', { lineHeight: '24px' }],
        body: ['14px', { lineHeight: '22px' }],
        'body-s': ['12px', { lineHeight: '18px' }],
        overline: ['11px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      spacing: {
        'sidebar': '272px',
        'toc': '200px',
        'topbar': '56px',
      },
      boxShadow: {
        '1': '0 1px 2px rgba(12,18,36,0.04), 0 1px 1px rgba(12,18,36,0.06)',
        '2': '0 4px 12px rgba(12,18,36,0.08), 0 2px 4px rgba(12,18,36,0.06)',
        '3': '0 24px 48px rgba(12,18,36,0.16), 0 8px 16px rgba(12,18,36,0.10)',
      },
      borderRadius: {
        'card': '12px',
        'modal': '16px',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      transitionDuration: {
        'fast': '120ms',
        'base': '200ms',
        'slow': '320ms',
      },
    },
  },
  plugins: [],
}

export default config
