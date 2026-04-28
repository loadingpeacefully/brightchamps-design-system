import type { Metadata } from 'next'
import { LayoutSpecPage, type LayoutSpec } from '@/components/chrome/LayoutSpecPage'

const SPEC: LayoutSpec = {
  kicker: 'Components · Sections',
  name: 'TeacherProfileSection',
  slug: 'teacher-profile-section',
  description: 'Public-facing teacher detail page. Composes TeacherProfileCard hero, Skills chips, AboutMe bio, RatingsAndReviews list, and the WriteTeacherReviewModal modal. Reads encrypted teacherId + studentClassBalanceId from URL params.',
  sourceFile: 'src/sections/TeacherProfileSection/index.tsx',
  regions: [
    { name: 'TeacherProfileCard',     size: 'full-width',     role: 'Hero — avatar, name, qualifications, primary CTA', token: 'surface/bg/raised + shadow/sm' },
    { name: 'Skills',                  size: 'inline-wrap',   role: 'Chip cluster — taught subjects + age groups',       token: 'Chip / radius/pill' },
    { name: 'AboutMe',                 size: 'full-width',     role: 'Multi-paragraph bio + intro video embed',           token: 'font/body/large + space/stack/md' },
    { name: 'RatingsAndReviews',       size: 'full-width',     role: 'Rating distribution + paginated review list',       token: 'Rating molecule + Avatar atom' },
    { name: 'WriteTeacherReviewModal', size: 'modal overlay', role: 'Authenticated review submission flow',              token: 'Modal / shadow/xl' },
  ],
  tokens: [
    { property: 'Hero background',   token: 'surface/bg/raised',     cssVar: '--surface-bg-raised',     value: '#ffffff (raised)' },
    { property: 'Hero shadow',       token: 'shadow/sm',              cssVar: '--shadow-sm',             value: '0 1px 2px rgba(13,29,45,.06)' },
    { property: 'Skill chip radius', token: 'radius/pill',            cssVar: '--radius-pill',           value: 'pill' },
    { property: 'Modal radius',      token: 'radius/container/xl',    cssVar: '--radius-container-xl',   value: '20px' },
    { property: 'Modal shadow',      token: 'shadow/xl',              cssVar: '--shadow-xl',             value: '0 16px 32px rgba(13,29,45,.16) + 0 32px 64px rgba(13,29,45,.20)' },
  ],
  routes: [
    { route: '/teacher-profile?teacherId=…&studentClassBalanceId=…', note: 'Primary teacher detail surface' },
  ],
  notes: [
    'Both URL params are AES-encrypted via decryptText() — the section decrypts before fetching.',
    'getTeacherProfile is a useQuery call; isFetching drives the loading state on the hero card.',
    'RatingsAndReviewsContextProvider wraps the section so the review modal + list share filter state.',
  ],
}

export const metadata: Metadata = { title: SPEC.name, description: SPEC.description }
export default function Page() { return <LayoutSpecPage spec={SPEC} /> }
