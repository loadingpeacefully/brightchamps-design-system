// Live registry of open pending decisions blocking DS accuracy.
// Surfaced at /governance/pending-decisions/ and consumed by audit dashboards.

export type PdStatus = 'open' | 'answered' | 'resolved'

export interface PendingDecision {
  id: string
  status: PdStatus
  question: string
  options: { letter: string; label: string }[]
  blocks: string[]            // DC ticket IDs / component slugs / token paths
  screensAffected: number
  daysOpen: number
  filed: string               // ISO date
  answeredOn?: string         // ISO when answered (status: answered or resolved)
  answer?: string             // option letter
}

export const pendingDecisions: PendingDecision[] = [
  {
    id: 'PD-001', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: 'Is Montserrat intentional as a second font for CTAs, or a mistake?',
    options: [
      { letter: 'A', label: 'Intentional — add font/family/cta = Montserrat to DS typography system' },
      { letter: 'B', label: 'Mistake — codemod all CTAs to Nunito (affects every Button CTA across 35 screens)' },
    ],
    blocks: ['DC-039', 'Button component spec', 'all screen rebuilds with CTAs'],
    screensAffected: 35,
  },
  {
    id: 'PD-002', status: 'open', filed: '2026-04-26', daysOpen: 3,
    question: 'Which purple is the canonical brand color?',
    options: [
      { letter: 'A', label: '#722ED1 (designer intent — Royal Amethyst)' },
      { letter: 'B', label: '#4e3bc2 (Figma extraction canonical)' },
      { letter: 'C', label: '#6651e4 (production in-progress state)' },
      { letter: 'D', label: '#4a3fb4 (5th variant)' },
    ],
    blocks: ['DC-005', 'DC-008', 'DC-018', 'all token migrations', 'all screen rebuilds with brand color'],
    screensAffected: 35,
  },
  {
    id: 'PD-003', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: 'Is the sidebar 240px (production) or 80/280px (DS collapsed/expanded)?',
    options: [
      { letter: 'A', label: '240px is canonical — update DS LeftSideBar to add 240px variant (chrome/sidebar-medium token)' },
      { letter: 'B', label: '80/280 is correct — production needs updating (engineering codemod)' },
    ],
    blocks: ['DC-040', 'LeftSideBar component', 'DashboardLayout', 'all screen rebuilds'],
    screensAffected: 35,
  },
  {
    id: 'PD-004', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: 'Should #222a33 (used 14+ times on Nano Skills alone) replace #0d1d2d as text/default, or codemod to existing text/default?',
    options: [
      { letter: 'A', label: 'Add color/neutral/950 = #222a33 as new canonical dark text' },
      { letter: 'B', label: 'Codemod all #222a33 → #0d1d2d (text/default). 45+ instances across 22 files.' },
    ],
    blocks: ['DC-014', 'text/default token', 'all heading text'],
    screensAffected: 35,
  },
  {
    id: 'PD-005', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: 'Are decorative ambient-blob backgrounds a DS pattern or one-off?',
    options: [
      { letter: 'A', label: 'DS pattern — add decorative/blob/* color tokens and effect/blur/ambient = 394px token' },
      { letter: 'B', label: 'One-off — exclude from DS, document as surface-specific ornament' },
    ],
    blocks: ['DC-045', 'background pattern token'],
    screensAffected: 1,
  },
  {
    id: 'PD-006', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: 'Is the SelfPaced card gradient (linear-gradient 253.85deg #FFAEC2→#E29ED9→#A86BD1) reusable or one-off?',
    options: [
      { letter: 'A', label: 'Reusable — add gradient/selfpaced token' },
      { letter: 'B', label: 'One-off — exclude from DS' },
    ],
    blocks: ['DC-034', 'SelfPacedHero component'],
    screensAffected: 2,
  },
  {
    id: 'PD-007', status: 'open', filed: '2026-04-28', daysOpen: 1,
    question: 'Harvard crimson #a51c30 — permanent partnership token or campaign-specific?',
    options: [
      { letter: 'A', label: 'Permanent — add color/partnership/harvard' },
      { letter: 'B', label: 'Campaign — exclude from DS, use surface/bg/error as nearest fallback' },
    ],
    blocks: ['DC-032', 'HarvardHero component'],
    screensAffected: 2,
  },
  {
    id: 'PD-008', status: 'open', filed: '2026-04-26', daysOpen: 3,
    question: 'DC-005 brand purple ships TWO values simultaneously on Nano Skills (#4d3bc2 heading + #6651e4 View Profile). Which is intentionally different and why?',
    options: [
      { letter: 'A', label: 'Both should be the same canonical — DC-005 resolution fixes both' },
      { letter: 'B', label: '#6651e4 is intentionally different for interactive/link states (not brand identity)' },
    ],
    blocks: ['DC-005', 'DC-008', 'entire codemod scope'],
    screensAffected: 35,
  },
  {
    id: 'PD-009', status: 'open', filed: '2026-04-29', daysOpen: 0,
    question: '/badges Homepage uses Poppins for course chips (alongside Nunito body). Add Poppins to DS or codemod?',
    options: [
      { letter: 'A', label: 'Add font/family/tertiary = Poppins (Game Dashboard already uses it). Three families total.' },
      { letter: 'B', label: 'Codemod chips to Nunito (preserves single-family system)' },
    ],
    blocks: ['DC-048 (new)', 'Chip component', 'all screens with course chips'],
    screensAffected: 7,
  },
]
