import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Designer-facing utilities: palette generator, contrast checker, token picker.',
}

export default function ToolsIndex() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Tools"
        title="Tools"
        step={7}
        stepDescription="Palette generator, contrast checker, token picker"
        description="Designer-facing utilities that plug into the system: a Radix-style 12-step palette generator from a seed hex, an APCA + WCAG contrast checker with foreground/background matrix, and a guided token picker that walks from 'what kind of element?' to a recommended token."
      />
    </div>
  )
}
