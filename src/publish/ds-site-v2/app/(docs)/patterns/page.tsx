import type { Metadata } from 'next'
import { ComingSoon } from '@/components/chrome/ComingSoon'

export const metadata: Metadata = {
  title: 'Patterns',
  description: 'Composed UX patterns per BrightChamps surface: student dashboard, teacher grading, admin reports, landing hero.',
}

export default function PatternsIndex() {
  return (
    <div className="flex">
      <ComingSoon
        kicker="Patterns"
        title="Patterns"
        step={6}
        stepDescription="Composed UX patterns per BrightChamps surface"
        description="Pattern pages document how components compose into complete flows: student dashboard, teacher grading, admin reports, landing hero. Each carries in-context product vignettes rendered with real tokens."
      />
    </div>
  )
}
