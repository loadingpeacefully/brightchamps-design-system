// Running registry of screen audits.
// Surfaced at /surfaces/audit-dashboard/ and per-screen pages.

export type AuditStatus = 'audited' | 'pending' | 'in-progress'

export interface ScreenAudit {
  route: string
  slug: string                  // for /surfaces/<slug>-audit/
  status: AuditStatus
  productionFrameId?: string
  productionFrameName?: string
  productionPage?: string
  matchPct?: number
  exact?: number
  drift?: number
  missing?: number
  cdn?: number
  newDcTickets?: string[]       // ticket IDs filed from this audit
  totalSampled?: number
  auditedOn?: string
  notes?: string
}

export const screenAudits: ScreenAudit[] = [
  {
    route: '/nano-skills', slug: 'nano-skills', status: 'audited',
    productionFrameId: '10989:8759', productionFrameName: 'Nano/Default', productionPage: 'Nano Skills',
    matchPct: 71, exact: 11, drift: 24, missing: 10, cdn: 4, totalSampled: 49,
    newDcTickets: ['DC-039', 'DC-040', 'DC-041', 'DC-042', 'DC-043', 'DC-044', 'DC-045', 'DC-046', 'DC-047'],
    auditedOn: '2026-04-29',
    notes: '776 layers walked. Montserrat font + 240px sidebar are the two highest-impact findings.',
  },
  {
    route: '/my-feed', slug: 'my-feed', status: 'audited',
    productionFrameId: '9325:8437', productionFrameName: 'My Feed', productionPage: 'Student Dashboard',
    matchPct: 72, exact: 2, drift: 11, missing: 5, cdn: 4, totalSampled: 18,
    newDcTickets: ['DC-049', 'DC-050', 'DC-051'],
    auditedOn: '2026-04-29',
    notes: 'Magenta + pink accent colors net new. Gray sprawl: 5 distinct grays on one screen.',
  },
  {
    route: '/learn', slug: 'learn', status: 'audited',
    productionFrameId: '9342:63313', productionFrameName: '2_a (interpreted)', productionPage: 'Student Dashboard',
    matchPct: 90, exact: 3, drift: 6, missing: 1, cdn: 4, totalSampled: 10,
    newDcTickets: [],
    auditedOn: '2026-04-29',
    notes: 'Same DashboardLayout shell as /my-feed. No net-new tickets — all drift inherits from /my-feed audit.',
  },
  {
    route: '/badges', slug: 'badges', status: 'audited',
    productionFrameId: '9631:11696', productionFrameName: 'Homepage', productionPage: 'Badges New 2025',
    matchPct: 84, exact: 3, drift: 12, missing: 2, cdn: 4, totalSampled: 18,
    newDcTickets: ['DC-048'],
    auditedOn: '2026-04-29',
    notes: 'Critical: Poppins font on course chips (DC-048). Sidebar = 80px (different from /nano-skills 240px).',
  },
  // Pending screens (31 remaining)
  { route: '/global-feed',     slug: 'global-feed',     status: 'pending' },
  { route: '/certificates',    slug: 'certificates',    status: 'pending' },
  { route: '/rewards',         slug: 'rewards',         status: 'pending' },
  { route: '/parent-hub',      slug: 'parent-hub',      status: 'pending' },
  { route: '/login',            slug: 'login',           status: 'pending' },
  { route: '/onboarding',      slug: 'onboarding',      status: 'pending' },
  { route: '/demo-dashboard',  slug: 'demo-dashboard',  status: 'pending' },
  { route: '/demo-dashboard-post', slug: 'demo-dashboard-post', status: 'pending' },
  { route: '/game-dashboard',  slug: 'game-dashboard',  status: 'pending' },
  { route: '/select-profile',  slug: 'select-profile',  status: 'pending' },
  { route: '/teacher-profile', slug: 'teacher-profile', status: 'pending' },
  { route: '/welcome-kit',     slug: 'welcome-kit',     status: 'pending' },
  { route: '/refer-and-earn',  slug: 'refer-and-earn',  status: 'pending' },
  { route: '/practice-zone',   slug: 'practice-zone',   status: 'pending' },
  { route: '/nano-skills/course-detail', slug: 'nano-skills-course-detail', status: 'pending' },
  { route: '/nano-skills/my-progress',   slug: 'nano-skills-my-progress',   status: 'pending' },
  { route: '/nano-skills/skills',        slug: 'nano-skills-skills',        status: 'pending' },
  { route: '/nano-skills/enrichment-classes', slug: 'nano-skills-enrichment-classes', status: 'pending' },
  { route: '/accounts',                  slug: 'accounts',                  status: 'pending' },
  { route: '/quiz',                      slug: 'quiz',                      status: 'pending' },
  { route: '/live-class',                slug: 'live-class',                status: 'pending' },
  { route: '/full-screen-activity',      slug: 'full-screen-activity',      status: 'pending' },
  { route: '/badges/detail',             slug: 'badges-detail',             status: 'pending' },
  { route: '/rewards/redeem',            slug: 'rewards-redeem',            status: 'pending' },
  { route: '/certificates/detail',       slug: 'certificates-detail',       status: 'pending' },
  { route: '/forgot-password',           slug: 'forgot-password',           status: 'pending' },
  { route: '/signup',                    slug: 'signup',                    status: 'pending' },
  { route: '/reschedule',                slug: 'reschedule',                status: 'pending' },
  { route: '/billing',                   slug: 'billing',                   status: 'pending' },
  { route: '/showcase',                  slug: 'showcase',                  status: 'pending' },
  { route: '/faq',                       slug: 'faq',                       status: 'pending' },
]
