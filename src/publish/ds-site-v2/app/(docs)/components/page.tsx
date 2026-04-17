import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Components',
  description: 'Component gallery with live examples, prop tables, accessibility notes, and Figma parity checks.',
}

export default function ComponentsIndex() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Components"
        title="Components"
        step={6}
        stepDescription="Component gallery with live examples + prop tables"
        description="Once token foundations are wired end-to-end, every BrightChamps component (Button, Card, Input, Modal, Tabs, etc.) gets a dedicated page with overview, live examples, prop tables, accessibility notes, and Figma parity checks."
      />
    </div>
  )
}
