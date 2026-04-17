import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/chrome/ThemeProvider'
import { TopBar } from '@/components/chrome/TopBar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BrightChamps Design System',
    template: '%s · BrightChamps Design System',
  },
  description:
    'The living design system for every BrightChamps surface. Tokens, components, patterns, and guidance — extracted from Figma, verified against production DOM.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <ThemeProvider>
          <TopBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
