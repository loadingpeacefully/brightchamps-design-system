import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Teacher grading pattern',
  description: 'How feedback, scoring, and student-list components compose into the teacher grading flow. Pending — Figma file blocked on file ID.',
}

const TOC = [
  { id: 'status',     label: 'Status',                  level: 2 as const },
  { id: 'shape',      label: 'Expected shape',          level: 2 as const },
  { id: 'components', label: 'Component inventory',     level: 2 as const },
  { id: 'unblock',    label: 'How to unblock',          level: 2 as const },
]

export default function TeacherGradingPattern() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Patterns</div>
        <h1 className="text-h1 text-chrome-text">Teacher grading</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          The pattern teachers use to review submitted work, score, and leave feedback for students.
          The teacher app exists in production but its Figma file is not yet wired into{' '}
          <code className="font-mono text-[12.5px]">surfaces.config.ts</code>, so component-level extraction
          hasn&rsquo;t happened.
        </p>

        <section id="status" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Status</h2>
          <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[rgba(255,205,106,0.40)] text-[#8a5e00] px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.06em] shrink-0 mt-0.5">Pending</div>
              <div>
                <p className="text-body-m text-chrome-text">
                  This pattern is documented as <strong>pending</strong>. Component composition, token bindings,
                  and Do/Don&rsquo;t guidance arrive once the teacher Figma file is added to the extraction pipeline.
                </p>
                <p className="mt-2 text-body-s text-chrome-text-subtle">
                  Tracked in <code className="font-mono">memory-bank/activeContext.md</code> &mdash; teacher
                  Figma file ID is the open question.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="shape" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Expected shape</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Based on production reconnaissance and parity with the student dashboard pattern, we expect a
            three-region split:
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Region</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Width</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component (expected)</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">leftRail</td><td className="p-3 font-mono text-chrome-text-subtle">104px</td><td className="p-3 text-chrome-text">TeacherNav (rail)</td><td className="p-3 text-chrome-text-subtle">Switcher between students / classes / submissions</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">studentList</td><td className="p-3 font-mono text-chrome-text-subtle">280px</td><td className="p-3 text-chrome-text">SubmissionList (filterable)</td><td className="p-3 text-chrome-text-subtle">Pending / graded / overdue submissions</td></tr>
                <tr className="border-b border-chrome-border"><td className="p-3 font-mono">workViewer</td><td className="p-3 font-mono text-chrome-text-subtle">flex-grow</td><td className="p-3 text-chrome-text">SubmissionViewer + RubricEditor + FeedbackThread</td><td className="p-3 text-chrome-text-subtle">The actual grading surface</td></tr>
                <tr className="border-b border-chrome-border last:border-b-0"><td className="p-3 font-mono">rightPanel</td><td className="p-3 font-mono text-chrome-text-subtle">360px</td><td className="p-3 text-chrome-text">StudentSummary + ClassHistory</td><td className="p-3 text-chrome-text-subtle">Past performance, attendance, parent contact</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="components" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Component inventory (anticipated)</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle">
            Likely shared from the canonical library; teacher-specific additions flagged.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
              <div className="text-overline text-chrome-text-subtlest mb-2">Reused from library</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1">
                <li>Card, Button, Input, DropDown</li>
                <li>Accordion (rubric criteria)</li>
                <li>Avatar (student photos)</li>
                <li>SectionHeader</li>
                <li>ToggleSwitch (publish/save-draft)</li>
              </ul>
            </div>
            <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-4">
              <div className="text-overline text-chrome-text-subtlest mb-2">Teacher-specific (new)</div>
              <ul className="ml-4 list-disc text-body-s text-chrome-text space-y-1">
                <li>RubricEditor (criteria + score sliders)</li>
                <li>FeedbackThread (multi-turn review chat)</li>
                <li>SubmissionViewer (PDF / image / code preview)</li>
                <li>StudentSummary (compact metrics card)</li>
                <li>GradeBadge (A/B/C/D/F + color)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="unblock" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">How to unblock</h2>
          <ol className="mt-3 ml-4 space-y-1.5 list-decimal max-w-[62ch] text-body-m text-chrome-text">
            <li>Capture the teacher Figma file ID and update <code className="font-mono">surfaces.config.ts</code> &mdash; the placeholder is currently <code className="font-mono">REPLACE_WITH_TEACHER_FIGMA_FILE_ID</code>.</li>
            <li>Refresh teacher session via Playwright codegen so DOM extraction can run authenticated.</li>
            <li>Run <code className="font-mono">npm run extract:all</code> &amp; <code className="font-mono">npm run drift:detect</code>.</li>
            <li>Document the 3 net-new teacher-only components on this page (replace inventory section above).</li>
            <li>Add Do / Don&rsquo;t guidance based on the actual extracted Figma frames.</li>
          </ol>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
