// Machine-readable component specs. Source of truth for the AI design generator.
//
// Every component documented at /components/<slug>/ has a matching entry here
// with the same token mapping the page renders. Adding a new component spec:
//   1. Build the page at app/(docs)/components/<slug>/page.tsx
//   2. Append an entry below
//   3. Keep `tokens` aligned with the page's TOKEN_MAP

export interface ComponentSpec {
  name: string
  slug: string
  description: string
  variants: string[]
  tokens: {
    property: string
    token: string
    cssVar: string
    value: string
  }[]
  usageExample: string
  /** Path inside the production student-app codebase, when located. */
  sourceFile?: string
  /**
   * - `verified`: spec was compared against the source file and matches it
   * - `inferred`: spec was authored from DOM audit / designer DS, not yet
   *   verified against real source
   * - `conflict`: source file located, but spec disagrees with it on at least
   *   one property — see `conflicts[]`
   */
  verificationStatus: 'verified' | 'inferred' | 'conflict'
  /** Discrepancies between this spec and the source file. */
  conflicts?: string[]
  /**
   * Migration target inside the dashboard repo (DR-001).
   * - `newDashboard`: source file lives in `src/newDashboard/*` or `src/components/*` —
   *   the new Next.js implementation. Migration codemods target this tree first.
   * - `sections`: source file lives in `src/sections/*` (older composed pages),
   *   or no source file located yet. Lower priority for the codemod sweep.
   */
  target: 'newDashboard' | 'sections'
}

export const componentSpecs: ComponentSpec[] = [
  {
    name: 'Button',
    slug: 'button',
    description: 'Five production button variants from button.module.scss. contained = filled brand. outlined = brand border. danger = red border (transparent). info = teal border (transparent). underline = link-style. All wired to Figma library 8eNJf875iY9HISEsczDfOh.',
    variants: ['contained', 'outlined', 'danger', 'info', 'underline'],
    tokens: [
      { property: 'Padding (block)',             token: 'space/inset/sm',         cssVar: '--space-inset-sm',         value: '8px' },
      { property: 'Padding (inline)',            token: 'space/inset/2xl',        cssVar: '--space-inset-2xl',        value: '24px' },
      { property: 'Border radius',               token: 'radius/pill',            cssVar: '--radius-pill',            value: 'pill (source: 50px, ~pill at button heights)' },
      { property: 'Border weight',               token: '—',                      cssVar: '—',                        value: '2px (source-exact, no token)' },
      { property: 'Font',                        token: 'Label/MD style + 14px override', cssVar: '—',               value: 'Nunito 14px / 800 (source-exact)' },
      { property: 'Contained bg',                token: 'surface/bg/brand',       cssVar: '--surface-bg-brand',       value: '#722ED1 (DC-005: prod #4e3bc2)' },
      { property: 'Contained text',              token: 'text/on/brand',          cssVar: '--text-on-brand',          value: '#ffffff' },
      { property: 'Outlined border',             token: 'border/brand',           cssVar: '--border-brand',           value: '#722ED1' },
      { property: 'Outlined text',               token: 'text/brand',             cssVar: '--text-brand',             value: '#722ED1' },
      { property: 'Danger border',               token: 'border/error',           cssVar: '--border-error',           value: '#FF5C5C (source: #ff8480, drift)' },
      { property: 'Danger text',                 token: 'text/error',             cssVar: '--text-error',             value: '#FF5C5C' },
      { property: 'Info border',                 token: 'border/info',            cssVar: '--border-info',            value: '#33CCFF (source: #60bfbd, significant drift — DC-012)' },
      { property: 'Info text',                   token: 'text/info',              cssVar: '--text-info',              value: '#33CCFF' },
      { property: 'Underline text',              token: 'text/brand',             cssVar: '--text-brand',             value: '#722ED1, text-decoration: underline' },
      { property: 'Disabled bg',                 token: 'surface/bg/disabled',    cssVar: '--surface-bg-disabled',    value: 'neutral-100 (source: $disabled-bg #eff3f5)' },
      { property: 'Disabled text',               token: 'text/disabled',          cssVar: '--text-disabled',          value: 'neutral-300 (source: #8e8e8e)' },
    ],
    usageExample: `<button
  className="
    bg-[var(--color-brand-primary)]
    text-[var(--color-neutral-100)]
    px-[var(--space-6)]
    py-[var(--space-3)]
    rounded-full
    font-semibold
    hover:bg-[var(--color-primary-700)]
    disabled:bg-[var(--color-neutral-200)]
    disabled:text-[var(--color-neutral-400)]
  "
>
  Primary Action
</button>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/Button/button.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Variants taxonomy CORRECTED 2026-04-28: production has 5 variants — contained, outlined, danger, info, underline. The earlier primary/secondary/ghost taxonomy was aspirational and is now retired.',
      'Border radius: source 50px → bound to radius/pill (9999) in Figma library. At typical button heights (36-48px) 50px is functionally pill; +9949px nominal drift but visual identity is preserved.',
      'Padding: 8px 24px (source) → bound to space/inset/sm (8) + space/inset/2xl (24). ✓ exact match.',
      'Font: 14px / 800 weight (source) → Label/MD style with overridden fontSize 14. Variance from semantic Label/MD which is 14×600.',
      'Danger color #ff8480: NOT in ledger. Bound to surface/bg/error → primary/error/500 = #FF5C5C. Drift +5% lightness from production. New ticket DC-011 recommended.',
      'Info color #60bfbd: NOT in ledger. Bound to surface/bg/info → #33CCFF. Drift is significant (cyan vs teal). New ticket DC-012 recommended.',
      'Disabled state: source bg $disabled-bg (#eff3f5) and text #8e8e8e. Bound to surface/bg/disabled and text/disabled. ✓ semantically correct, hex differs.',
      'DC-005 unresolved: contained variant uses #722ED1 (designer intent) via surface/bg/brand; production CSS resolves get-color("primary-color") = #4e3bc2.',
      'Shadow variant (.shadow): 0px 0px 12px 0px #0000003b — has no matching effect style. Flagged as Tier 3 work.',
    ],
  },
  {
    name: 'ProgressLine',
    slug: 'progress-line',
    description: 'Horizontal progress bar that shows lesson or course completion. Used wherever a learner has a quantifiable goal.',
    variants: ['default', 'in-progress', 'completed'],
    tokens: [
      { property: 'Fill (in-progress)',  token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
      { property: 'Fill (completed)',    token: 'color/success/500',   cssVar: '--color-success-500',   value: '#00B67A' },
      { property: 'Track',               token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Height (default)',    token: 'space/2',             cssVar: '--space-2',             value: '8px' },
      { property: 'Height (compact)',    token: 'space/1',             cssVar: '--space-1',             value: '4px' },
      { property: 'Border radius',       token: 'radius/full',         cssVar: '--radius-full',         value: '9999px' },
      { property: 'Margin (block)',      token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Label text color',    token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
      { property: 'Disabled opacity',    token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
    ],
    usageExample: `<div
  role="progressbar"
  aria-valuenow={60}
  aria-valuemin={0}
  aria-valuemax={100}
  className="w-full h-[var(--space-2)] rounded-full overflow-hidden"
  style={{ background: 'var(--color-neutral-200)' }}
>
  <div
    className="h-full rounded-full transition-all"
    style={{
      width: '60%',
      background: 'var(--color-brand-primary)',
    }}
  />
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/ProgressBar/progressbar.module.scss',
    target: 'newDashboard',
    verificationStatus: 'conflict',
    conflicts: [
      'Track: spec says color/neutral/200 (#e7e7e7). Production uses #e0e0e0.',
      'Height: spec says space/2 (8px). Production uses 10px.',
      'Border radius: spec says radius/full (9999px). Production uses 10px (rounded corners, not pill — different visual).',
      'Fill (in-progress): spec says color/brand/primary (#4e3bc2). Production uses #6651e4 (= color/primary/500, the de facto brand purple).',
      'Fill (completed): spec says color/success/500 (#00B67A). Production uses #11ac69 (a fourth green not in the ledger — and not the same as the feed repo\'s #24c26e).',
      'Variants: spec has 3 (default/in-progress/completed). Production has 5: completed, in-progress, notstarted, skipped, paused — plus an "openCard" inverted theme for each.',
      'Paused-state #3b9af5 is a brand-new color not in the ledger. Recommended new ticket DC-010.',
      'Completed-state #11ac69 is a brand-new green not in the ledger. Recommended new ticket DC-009.',
    ],
  },
  {
    name: 'Accordion',
    slug: 'accordion',
    description: 'Expandable lesson/milestone container. Production has two distinct accordion components: milestoneAccordion (with brand-purple status pill) and classAccordion. Used for lesson lists, milestone progression, FAQ blocks. Verified against milestoneAccordion.module.scss; figma library variants cover state × variant.',
    variants: ['collapsed', 'expanded', 'milestone-collapsed', 'milestone-expanded'],
    tokens: [
      { property: 'Background (default)',  token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
      { property: 'Background (hover)',    token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Background (active)',   token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Border',                token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Title text',            token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
      { property: 'Body text',             token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
      { property: 'Chevron icon',          token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
      { property: 'Padding (block)',       token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Padding (inline)',      token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Gap (icon → title)',    token: 'space/2',             cssVar: '--space-2',             value: '8px' },
      { property: 'Border radius',         token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
      { property: 'Disabled opacity',      token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
    ],
    usageExample: `const [open, setOpen] = useState(false)

<div
  className="w-full rounded-md border"
  style={{ borderColor: 'var(--color-neutral-200)' }}
>
  <button
    type="button"
    aria-expanded={open}
    onClick={() => setOpen(!open)}
    className="flex w-full items-center justify-between px-4 py-4 text-left"
    style={{
      background: open ? 'var(--color-neutral-200)' : 'var(--color-neutral-100)',
      color: 'var(--color-neutral-1400)',
    }}
  >
    <span className="font-semibold">Lesson 3 — Variables</span>
    <ChevronDown style={{ color: 'var(--color-neutral-600)' }} />
  </button>
  {open && (
    <div
      className="border-t px-4 py-4"
      style={{ borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)' }}
    >
      A variable is a named container for a value.
    </div>
  )}
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/PracticeZone/components/milestoneAccordion/milestoneAccordion.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Wrapper bg: production has none (transparent). Figma default variant has no fill, matching source.',
      'Bottom border #37255124 (brand purple at 14% alpha): bound to border/subtle. Color identity preserved at 1px stroke; alpha-vs-alpha mismatch.',
      'Padding 20px 0 → bound to space/inset/xl (20). ✓ exact match.',
      'Title font: source 16px / 500 → bound to fontSize 14 + Body/MD style. Variance documented for typography-token reconciliation.',
      'Status pill bg #ffffff99: bound to surface/bg/default with paint opacity 0.6. Approximation of 60% white over container.',
      'Status pill text #6651E4 (in_progress): bound to text/brand. Library resolves to #722ED1 (DC-005 designer intent). Production ships #6651E4.',
      'Status pill text #222A33 (not_started): bound to text/default.',
      'Proficient state (gold border + gradient + #AE6C00 text): NOT built in Tier 2 — flagged as Tier 3 since it requires a gradient + custom gold colors not in the ledger.',
      'flagIcon 32×32 circle: milestone variant uses #7D68FF bg → bound to surface/bg/brand. Default variant uses white bg → bound to surface/bg/default with border.',
      'classAccordion (a separate component) and FAQ accordion are NOT built — would be Tier 3 work.',
    ],
  },
  {
    name: 'LessonList',
    slug: 'lesson-list',
    description: 'Ordered list of lessons with per-row status. Used inside course detail pages and the /learn/ surface.',
    variants: ['locked', 'available', 'in-progress', 'completed'],
    tokens: [
      { property: 'Status (locked)',         token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
      { property: 'Status (available)',      token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
      { property: 'Status (in-progress)',    token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
      { property: 'Status (completed)',      token: 'color/success/500',   cssVar: '--color-success-500',   value: '#00B67A' },
      { property: 'Title text',              token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
      { property: 'Subtitle / meta text',    token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
      { property: 'Row background (hover)',  token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Divider',                 token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Padding (block)',         token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Padding (inline)',        token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Gap (icon → title)',      token: 'space/2',             cssVar: '--space-2',             value: '8px' },
      { property: 'Status icon size',        token: 'space/4',             cssVar: '--space-4',             value: '16px' },
      { property: 'Border radius',           token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
    ],
    usageExample: `const STATUS_COLOR = {
  locked:       'var(--color-neutral-400)',
  available:    'var(--color-neutral-600)',
  'in-progress':'var(--color-brand-primary)',
  completed:    'var(--color-success-500)',
}

<ol
  className="rounded-md border divide-y"
  style={{ borderColor: 'var(--color-neutral-200)' }}
>
  {lessons.map((l, i) => (
    <li
      key={l.id}
      className="flex items-center gap-3 px-4 py-3"
      aria-current={l.status === 'in-progress' ? 'step' : undefined}
    >
      <span className="font-mono w-6 text-right" style={{ color: 'var(--color-neutral-600)' }}>
        {String(i + 1).padStart(2, '0')}
      </span>
      <StatusIcon status={l.status} color={STATUS_COLOR[l.status]} />
      <div>
        <div style={{ color: 'var(--color-neutral-1400)', fontWeight: 600 }}>{l.title}</div>
        <div style={{ color: 'var(--color-neutral-600)', fontSize: 12 }}>{l.meta}</div>
      </div>
    </li>
  ))}
</ol>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/learn/components/LessonList/LessonList.module.scss',
    target: 'sections',
    verificationStatus: 'conflict',
    conflicts: [
      'Row background: spec says color/neutral/100 (#ffffff) for default — production .activeList uses #fff for active rows only; default rows are transparent over container.',
      'Border radius: spec says radius/md (8px). Production uses 16px (= $border-radius-medium).',
      'Padding (block): spec says space/4 (16px). Production uses 26px 0 (desktop) / 15px 0 (mobile) — no token.',
      'Divider: spec says color/neutral/200 (#e7e7e7). Production uses rgb(10, 13, 15, 0.1) (alpha overlay, not in ledger).',
      'Status icon size: spec says space/4 (16px). Production .upcomingIcon is 24px desktop / 16px mobile.',
      'Status colors per row (locked/available/in-progress/completed) live in LessonList/components/LeftSectionInList/ subcomponents — not yet read. Spec values for those statuses are still inferred.',
    ],
  },
  {
    name: 'GreenLine',
    slug: 'green-line',
    description: 'Thin accent line. Functions as a visual separator or as a positive progress / completion indicator. The success-green sibling of ProgressLine.',
    variants: ['default', 'subtle', 'disabled'],
    tokens: [
      { property: 'Color (default)',     token: 'color/success/500', cssVar: '--color-success-500', value: '#00B67A' },
      { property: 'Color (subtle)',      token: 'color/success/300', cssVar: '--color-success-300', value: '#24c26e' },
      { property: 'Color (disabled)',    token: 'color/neutral/200', cssVar: '--color-neutral-200', value: '#e7e7e7' },
      { property: 'Height',              token: 'space/1',           cssVar: '--space-1',           value: '4px' },
      { property: 'Height (compact)',    token: 'space/0-5',         cssVar: '--space-0-5',         value: '2px' },
      { property: 'Border radius',       token: 'radius/full',       cssVar: '--radius-full',       value: '9999px' },
      { property: 'Margin (above)',      token: 'space/4',           cssVar: '--space-4',           value: '16px' },
      { property: 'Margin (below)',      token: 'space/4',           cssVar: '--space-4',           value: '16px' },
      { property: 'Width (default)',     token: 'space/full',        cssVar: '--space-full',        value: '100%' },
    ],
    usageExample: `<div
  role="presentation"
  aria-hidden="true"
  className="w-full rounded-full"
  style={{
    background: 'var(--color-success-500)',
    height: 'var(--space-1)',
    margin: 'var(--space-4) 0',
  }}
/>`,
    target: 'sections',
    verificationStatus: 'inferred',
    conflicts: [
      'No reusable GreenLine component exists in either the feed or dashboard repos. Searched for green-line, GreenLine, greenline, separator, divider — none match.',
      'The 49 elements counted in the DOM audit are inline patterns (toggle indicators, badge tab indicators, prelogin markers) rendered per-component, not extracted.',
      'Production success colors disagree across repos: feed uses #24C26E (color/success/300), dashboard ProgressBar uses #11ac69 (a fourth green not yet in the ledger). Spec says #00B67A (color/success/500).',
      'Recommendation: either remove GreenLine from componentSpecs and merge its tokens into ProgressLine variants, or document it as a utility pattern with no source file.',
    ],
  },
  {
    name: 'Layout',
    slug: 'layout',
    description: 'The shell container for every student dashboard page. Provides the sidebar nav, main content well, and responsive switch to a mobile drawer.',
    variants: ['with-sidebar', 'without-sidebar', 'mobile'],
    tokens: [
      { property: 'Page background',         token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
      { property: 'Sidebar background',      token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#e7e7e7' },
      { property: 'Sidebar active item bg',  token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
      { property: 'Sidebar active item fg',  token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
      { property: 'Sidebar item text',       token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
      { property: 'Sidebar item meta text',  token: 'color/neutral/600',   cssVar: '--color-neutral-600',   value: '#3d4d5d' },
      { property: 'Sidebar width (desktop)', token: 'space/sidebar',       cssVar: '--space-sidebar',       value: '240px' },
      { property: 'Sidebar width (mobile)',  token: 'space/0',             cssVar: '--space-0',             value: '0px (drawer)' },
      { property: 'Page padding (block)',    token: 'space/8',             cssVar: '--space-8',             value: '32px' },
      { property: 'Page padding (inline)',   token: 'space/6',             cssVar: '--space-6',             value: '24px' },
      { property: 'Sidebar item gap',        token: 'space/2',             cssVar: '--space-2',             value: '8px' },
      { property: 'Sidebar item radius',     token: 'radius/md',           cssVar: '--radius-md',           value: '8px' },
    ],
    usageExample: `<div
  className="grid min-h-screen"
  style={{
    gridTemplateColumns: 'var(--space-sidebar) 1fr',
    background: 'var(--color-neutral-100)',
  }}
>
  <aside
    style={{ background: 'var(--color-neutral-200)' }}
    className="p-2 space-y-1"
  >
    {nav.map(item => (
      <a
        key={item.href}
        href={item.href}
        aria-current={item.active ? 'page' : undefined}
        className="flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{
          background: item.active ? 'var(--color-brand-primary)' : 'transparent',
          color:      item.active ? 'var(--color-neutral-100)'   : 'var(--color-neutral-1400)',
        }}
      >
        <item.Icon size={16} />
        <span className="font-medium">{item.label}</span>
      </a>
    ))}
  </aside>
  <main
    style={{
      padding: 'var(--space-8) var(--space-6)',
      color: 'var(--color-neutral-1400)',
    }}
  >
    {children}
  </main>
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/layouts/DashboardLayout/dashboardLayout.module.scss',
    target: 'newDashboard',
    verificationStatus: 'conflict',
    conflicts: [
      'Page background: spec says color/neutral/100 (#ffffff). Production uses $app-background (#f5f4fa) — a tinted lavender, not pure white.',
      'Sidebar width (desktop): spec says 240px. Production has a 104px chrome rail (icon + minimal labels), NOT a wide 240px sidebar. The IA is fundamentally different.',
      'Three-column layout: production has left rail (104px) + main (max 880px) + right context panel (460px). Spec describes only two columns (sidebar + main).',
      'Sidebar background / active item colors: spec describes them, but they live inside src/components/NavigationBar/ (a separate component), not in dashboardLayout.module.scss. Need separate verification pass.',
      'Variants: spec has with-sidebar / without-sidebar / mobile. Production has 8 distinct Layouts (AppLayout, LoginLayout, FullScreenLayout, FullWidthLayout, OnboardingLayout, DashboardLayout, DemoDashboardLayout, GameDashboardLayout) — each is its own component, not a variant.',
      'Padding (32px 24px) matches space/8 + space/6 ✓.',
      'Per docs/component-spec-verification-dashboard.md and DC-005: brand-primary touchpoints use #4e3bc2 / #6651e4 / #722ED1 inconsistently across this repo. Pending DC-005 four-way resolution.',
    ],
  },

  // ─── NavBar (Tier 1 chrome — wired to Figma variable library) ───────────
  {
    name: 'NavBar',
    slug: 'nav-bar',
    description: 'Icon rail navigation. Collapses to 80px (icons only), expands to 280px on hover (icons + labels). Appears on every authenticated student dashboard page (7/7). Wired to Figma library 8eNJf875iY9HISEsczDfOh.',
    variants: ['collapsed', 'expanded'],
    tokens: [
      { property: 'Width (collapsed)',         token: 'chrome/sidebar-collapsed', cssVar: '--chrome-sidebar-collapsed', value: '80px' },
      { property: 'Width (expanded)',          token: 'chrome/sidebar-expanded',  cssVar: '--chrome-sidebar-expanded',  value: '280px' },
      { property: 'Background',                token: 'surface/bg/default',       cssVar: '--surface-bg-default',       value: '#ffffff (light) / neutral-800 (dark)' },
      { property: 'Padding (block)',           token: 'space/inset/lg',           cssVar: '--space-inset-lg',           value: '16px (source: 18px)' },
      { property: 'Padding (inline)',          token: 'space/inset/md',           cssVar: '--space-inset-md',           value: '12px' },
      { property: 'Menu-item radius',          token: 'radius/control/lg',        cssVar: '--radius-control-lg',        value: '10px (source: 12px)' },
      { property: 'Menu-item icon container',  token: '—',                        cssVar: '—',                          value: '56×56 (source-exact, no token)' },
      { property: 'Menu-item gap',             token: 'space/stack/md',           cssVar: '--space-stack-md',           value: '12px' },
      { property: 'Active item bg',            token: 'surface/bg/brand',         cssVar: '--surface-bg-brand',         value: '#722ED1 (DC-005 designer intent; production ships #4e3bc2)' },
      { property: 'Active item text',          token: 'text/on/brand',            cssVar: '--text-on-brand',            value: '#ffffff' },
      { property: 'Active item icon',          token: 'icon/on/brand',            cssVar: '--icon-on-brand',            value: '#ffffff' },
      { property: 'Default text',              token: 'text/brand',               cssVar: '--text-brand',               value: '#722ED1 / brand-300 (dark)' },
      { property: 'Font weight (active)',      token: 'typography/body/md/font-weight', cssVar: '--typography-body-md-font-weight', value: '800 (source extra-bold)' },
      { property: 'Transition',                token: '—',                        cssVar: '—',                          value: 'all 0.3s ease-out (CSS only, not in Figma)' },
    ],
    usageExample: `<aside className={classes.container} aria-label="Primary">
  {navData.map(item => (
    <a key={item.href} href={item.href}
       aria-current={isActive(item.href) ? 'page' : undefined}
       className={classes.menuItem}>
      <div className={classes.iconWrapper}><item.Icon /></div>
      {expanded && <span>{item.label}</span>}
    </a>
  ))}
</aside>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/NavigationBar/navigation.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Production navData has only one entry: dashboard. The audit/spec listed 7 (learn, feed, badges, certificates, rewards, nano-skills, dashboard) — only dashboard is real. Other items referenced via nameKeyMap exist in i18n but not in navData[]. Figma component honors source.',
      'Padding 18px does not have an exact token (closest: space/inset/lg = 16px). Bound to space/inset/lg with a +2px production drift — flag for ledger reconciliation.',
      'Menu-item radius is 12px in source, closest semantic is radius/control/lg = 10px (+2px drift). Flag for ledger reconciliation.',
      'Active color is #722ED1 (DC-005 designer intent) in the Figma library; production CSS resolves get-color("primary-color") = #4e3bc2. DC-005 description on color/primary/500 documents this.',
      '56×56 icon container has no matching dimension token — source value used directly.',
    ],
  },

  // ─── LeftSideBar (Tier 1 chrome — 104px rail wrapper) ───────────────────
  {
    name: 'LeftSideBar',
    slug: 'left-side-bar',
    description: '104px chrome rail wrapper. Hosts <NavigationBar /> on every student dashboard page. Production-faithful from dashboardLayout.module.scss .leftArea.',
    variants: ['default'],
    tokens: [
      { property: 'Width',           token: 'chrome/sidebar-rail', cssVar: '--chrome-sidebar-rail', value: '104px' },
      { property: 'Height',          token: '—',                   cssVar: '—',                     value: '100vh (annotation only)' },
      { property: 'Background',      token: '—',                   cssVar: '—',                     value: 'transparent (production: no bg, inherits .container white)' },
      { property: 'Position',        token: '—',                   cssVar: '—',                     value: 'sticky left (annotation only)' },
      { property: 'Embedded NavBar', token: '—',                   cssVar: '—',                     value: '<NavigationBar /> instance, collapsed variant' },
    ],
    usageExample: `<div className={classes.leftArea}>
  <NavigationBar />
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/layouts/DashboardLayout/dashboardLayout.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Previous componentSpecs.ts entry pointed at src/newDashboard/templates/NewDashboard/LeftSideBar/LeftSideBar.module.scss — that is a different layout\'s sidebar. The student dashboard\'s left chrome is dashboardLayout.module.scss .leftArea (104px), now the canonical reference.',
      'Width 104px > NavigationBar collapsed width 80px. The 24px difference is the rail margin around the navbar. No padding on .leftArea itself in source.',
    ],
  },

  // ─── RightSideBar (Tier 1 chrome — 460px context panel) ─────────────────
  {
    name: 'RightSideBar',
    slug: 'right-side-bar',
    description: '460px right context panel. Appears on every student dashboard page (7/7). Hosts ProfileCard by default; can show class info, teacher profile, or BrightBuddy chat panel.',
    variants: ['empty', 'class-info'],
    tokens: [
      { property: 'Width',                 token: 'chrome/right-panel',     cssVar: '--chrome-right-panel',     value: '460px' },
      { property: 'Height',                token: '—',                      cssVar: '—',                        value: '100vh (annotation only)' },
      { property: 'Padding (all sides)',   token: 'space/inset/xl',         cssVar: '--space-inset-xl',         value: '20px' },
      { property: 'Background',            token: '—',                      cssVar: '—',                        value: 'transparent (inherits app-background #f5f4fa)' },
      { property: 'Overflow',              token: '—',                      cssVar: '—',                        value: 'overflow-y: scroll (annotation only)' },
      { property: 'ProfileCard radius',    token: 'radius/container/lg',    cssVar: '--radius-container-lg',    value: '10px (source: 16px = $border-radius-medium, +6px drift)' },
      { property: 'ProfileCard border',    token: 'border/subtle',          cssVar: '--border-subtle',          value: '1px #ededed' },
      { property: 'Cover image bg',        token: 'surface/bg/brand/subtle', cssVar: '--surface-bg-brand-subtle', value: '#FAF5FF (primary/50)' },
      { property: 'Profile pic border',    token: 'surface/bg/default',     cssVar: '--surface-bg-default',     value: '#ffffff, 4px' },
      { property: 'Switch profile text',   token: 'text/brand',             cssVar: '--text-brand',             value: '#722ED1' },
      { property: 'Certificate box bg',    token: 'surface/bg/brand/subtle', cssVar: '--surface-bg-brand-subtle', value: '#FAF5FF' },
      { property: 'Certificate box radius', token: 'radius/container/lg',   cssVar: '--radius-container-lg',    value: '10px (source: 16px)' },
    ],
    usageExample: `<div className={classes.rightArea}>
  <ProfileCard />
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/layouts/DashboardLayout/dashboardLayout.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Right-panel ProfileCard composed of many sub-components (cover image, profile pic, switch-profile, certificateBox, homeTab, menuItems, chatbotContainer). Tier 1 build covers the chrome shell + key surfaces — full sub-component breakdown is Tier 2.',
      'Source $border-radius-medium = 16px does not have an exact token (closest: radius/container/lg = 10px). +6px drift flagged for ledger reconciliation.',
      'Source $menu-hover-color (#edebf8) does not have an exact token (closest: surface/bg/brand/subtle = #FAF5FF). 5%-lightness drift, visually similar.',
    ],
  },

  // ─── DashboardLayout (Tier 1 chrome — 3-column shell) ───────────────────
  {
    name: 'DashboardLayout',
    slug: 'dashboard-layout',
    description: '3-column shell wrapping all 7 student dashboard pages. 104px nav rail + flex-grow main + 460px right panel. Production-faithful from dashboardLayout.module.scss.',
    variants: ['rightPanelVisible-true', 'rightPanelVisible-false'],
    tokens: [
      { property: 'Page max-width',          token: 'chrome/page-max',          cssVar: '--chrome-page-max',          value: '1440px' },
      { property: 'LeftArea width',          token: 'chrome/sidebar-rail',      cssVar: '--chrome-sidebar-rail',      value: '104px' },
      { property: 'RightArea width',         token: 'chrome/right-panel',       cssVar: '--chrome-right-panel',       value: '460px' },
      { property: 'MainContent max-width',   token: 'chrome/main-content-max',  cssVar: '--chrome-main-content-max',  value: '880px' },
      { property: 'Page background',         token: 'surface/bg/canvas',        cssVar: '--surface-bg-canvas',        value: '#ffffff (light) / neutral-900 (dark)' },
      { property: 'MainWrapper bg',          token: 'surface/bg/sunken',        cssVar: '--surface-bg-sunken',        value: '#F2F2F2 (source: $app-background #f5f4fa, ΔE small)' },
      { property: 'MainWrapper padding (block)', token: 'space/inset/3xl',     cssVar: '--space-inset-3xl',          value: '32px' },
      { property: 'MainWrapper padding (inline)', token: 'space/inset/2xl',    cssVar: '--space-inset-2xl',          value: '24px' },
    ],
    usageExample: `<div className={classes.root}>          {/* max-width: 1440px */}
  <div className={classes.container}>     {/* flex, 3 columns */}
    <div className={classes.leftArea}><NavigationBar /></div>
    <div className={classes.mainWrapper}>
      <div className={classes.mainContentArea}>{children}</div>
    </div>
    <div className={classes.rightArea}><ProfileCard /></div>
  </div>
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/layouts/DashboardLayout/dashboardLayout.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'mainWrapper bg in source is $app-background #f5f4fa — a tinted lavender. Closest semantic token is surface/bg/sunken = #F2F2F2 (neutral/100, no purple tint). Visually similar at thumbnail scale; flag for ledger reconciliation if brand wants the lavender tint preserved.',
      'Tablet-portrait media query (.media-tab-portrait) hides .leftArea and .rightArea, switches in .mobileNavWrapper. Tier 1 covers the desktop layout only; mobile/tablet variant is Tier 2.',
      'masWrapper variant (masquerade users) swaps mainWrapper bg to a teacher-impersonation image. Edge-case state, not built as a separate Figma variant.',
    ],
  },

  // ─── ProgressBar (Tier 2 — production-verified, 5 status variants) ──────
  {
    name: 'ProgressBar',
    slug: 'progress-bar',
    description: 'Horizontal progress bar with 5 status variants from progressbar.module.scss: default, in-progress (#6651E4), completed (#11ac69), skipped (#ff752c), paused (#3b9af5). 10px tall, pill ends, percentage label optional. Used on every page that shows lesson progression (7/7).',
    variants: ['default', 'in-progress', 'completed', 'skipped', 'paused'],
    tokens: [
      { property: 'Track height',                     token: '—',                       cssVar: '—',                          value: '10px (source-exact, no token)' },
      { property: 'Track bg',                         token: 'surface/bg/disabled',     cssVar: '--surface-bg-disabled',      value: 'neutral-100 (source: #e0e0e0)' },
      { property: 'Track radius',                     token: 'radius/pill',             cssVar: '--radius-pill',              value: 'pill (source: 10px = full at 10px height)' },
      { property: 'Fill (in-progress)',               token: 'surface/bg/brand',        cssVar: '--surface-bg-brand',         value: '#722ED1 (DC-005: production #6651e4)' },
      { property: 'Fill (completed)',                 token: 'surface/bg/success',      cssVar: '--surface-bg-success',       value: '#00B67A (DC-009: production #11ac69)' },
      { property: 'Fill (skipped)',                   token: 'surface/bg/warning',      cssVar: '--surface-bg-warning',       value: '#FF7C35 (production: #ff752c, ΔE small)' },
      { property: 'Fill (paused)',                    token: 'surface/bg/info',         cssVar: '--surface-bg-info',          value: '#33CCFF (DC-010: production #3b9af5, significant drift)' },
      { property: 'Value text (in-progress)',         token: 'text/brand',              cssVar: '--text-brand',               value: '#722ED1 (DC-005)' },
      { property: 'Value text (completed)',           token: 'text/success',            cssVar: '--text-success',             value: '#00B67A (DC-009)' },
      { property: 'Value text (skipped)',             token: 'text/warning',            cssVar: '--text-warning',             value: '#FF7C35' },
      { property: 'Value text (paused)',              token: 'text/info',               cssVar: '--text-info',                value: '#33CCFF (DC-010)' },
      { property: 'Value text (not_started)',         token: 'text/muted',              cssVar: '--text-muted',               value: 'neutral-500 (source: #64717d)' },
      { property: 'Value font',                       token: 'fontSize 16 / 800',       cssVar: '—',                          value: 'Nunito 16px / 800 (source-exact)' },
    ],
    usageExample: `<div className={classes.container}>
  <div className={classes.progressBar}>
    <div className={clsx(classes.progressBarFill, classes['progressBarFill' + statusKey])}
         style={{ width: percent + '%' }} />
  </div>
  <span className={clsx(classes.progressValue, classes['progressValue' + statusKey])}>
    {percent}%
  </span>
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/ProgressBar/progressbar.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Production track bg is #e0e0e0 (a fifth gray not in the ledger). Bound to surface/bg/disabled = neutral-100 #F2F2F2. ΔE small but non-zero.',
      'In-progress fill #6651E4 (production) vs #722ED1 (library): DC-005 four-way conflict. Library ships designer intent; engineering migration pending brand sign-off.',
      'Completed fill #11ac69 (production) vs #00B67A (library): DC-009 unresolved. Library ships designer intent — engineering must verify the ΔE before migrating.',
      'Paused fill #3b9af5 (production) vs #33CCFF (library): DC-010 unresolved. The two cyans are visibly different (ΔE ~ 12). Recommend keeping #3b9af5 if brand prefers the tinted production blue.',
      'Skipped fill #ff752c (production) vs #FF7C35 (library): ΔE ~ 2, visually identical. No ticket needed.',
      'Production has 5 inverted variants (progressBar*OpenCard) for use inside dark-themed cards — Tier 3 work, not built in Tier 2.',
    ],
  },

  // ─── Card (Tier 2 — base content container) ──────────────────────────────
  {
    name: 'Card',
    slug: 'card',
    description: 'Base content container from card.module.scss. 280px min-width, 16px border-radius ($border-radius-medium), white bg, 8px outer + 8px inner padding. Variants: base / with-image / elevated / lesson. Uses Button instances for footer CTA. Source includes demoClass (gradient bg) and fixedHeight (520px) modifiers — Tier 3.',
    variants: ['base', 'with-image', 'elevated', 'lesson'],
    tokens: [
      { property: 'Min width',                token: '—',                       cssVar: '—',                          value: '280px (source-exact, no token)' },
      { property: 'Background',               token: 'surface/bg/default',      cssVar: '--surface-bg-default',       value: '#ffffff' },
      { property: 'Border',                   token: 'border/subtle',           cssVar: '--border-subtle',            value: 'neutral-100 1px (source: no border, added for definition on canvas-bg)' },
      { property: 'Border radius',            token: 'radius/container/lg',     cssVar: '--radius-container-lg',      value: '10px (source: 16px = $border-radius-medium, +6px drift)' },
      { property: 'Outer padding',            token: 'space/inset/sm',          cssVar: '--space-inset-sm',           value: '8px (source-exact)' },
      { property: 'Inner content padding',    token: 'space/inset/sm',          cssVar: '--space-inset-sm',           value: '8px (source .cardContentWrapper)' },
      { property: 'Content gap',              token: 'space/stack/sm',          cssVar: '--space-stack-sm',           value: '8px' },
      { property: 'Image area radius',        token: 'radius/container/md',     cssVar: '--radius-container-md',      value: '8px' },
      { property: 'Image area bg (placeholder)', token: 'surface/bg/sunken',    cssVar: '--surface-bg-sunken',        value: 'neutral-100' },
      { property: 'Title',                    token: 'Title/MD',                cssVar: '—',                          value: 'Nunito 16px / 600' },
      { property: 'Subtitle',                 token: 'Body/SM',                 cssVar: '—',                          value: 'Nunito 14px / 400' },
      { property: 'Subtitle color',           token: 'text/muted',              cssVar: '--text-muted',               value: 'neutral-500' },
      { property: 'Elevated shadow',          token: 'shadow/lg effect style',  cssVar: '—',                          value: '0 10px 15px -3px rgba(0,0,0,0.1) (Figma effect style)' },
    ],
    usageExample: `<div className={clsx(classes.root, isElevated && classes.elevated)}>
  {imageSrc && <CardImage src={imageSrc} />}
  <div className={classes.cardContentWrapper}>
    <h3>{title}</h3>
    <p>{description}</p>
    <div className={classes.footer}>
      <span>{meta}</span>
      <Button variant="contained">{ctaLabel}</Button>
    </div>
  </div>
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/components/Card/card.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Source $border-radius-medium = 16px does not have an exact token (closest: radius/container/lg = 10px). +6px drift flagged for ledger reconciliation.',
      'Production has no border on .root — Figma adds a 1px border/subtle stroke for definition on canvas-bg. Cosmetic addition, flag for designer review.',
      'demoClass (gradient bg #fd8a8a → #cb4444) NOT built — gradient + non-ledger colors. Tier 3.',
      'fixedHeight (520px), shadow (.elevated), media-tab-portrait shadow — additional modifier classes from source. Elevated variant covers .elevated; fixedHeight is a positioning concern.',
      'Source padding flow: outer .root padding 8 + inner .cardContentWrapper padding 8 = effective 16px content inset. Figma component preserves both for Dev Mode parity.',
    ],
  },

  // ─── ProfileAvatar (Tier 2 — verified) ───────────────────────────────────
  {
    name: 'ProfileAvatar',
    slug: 'profile-avatar',
    description: 'Circular avatar from ProfileAvatar.module.scss. Source uses 100% w/h (sizes from parent) and brand-purple bg with white initials when name fallback. Figma component provides 5 sizes (xs 24 → xl 80) × 2 types (image, initials). Used on NavBar profile, sidebar, comment threads, teacher cards.',
    variants: ['xs-image', 'xs-initials', 'sm-image', 'sm-initials', 'md-image', 'md-initials', 'lg-image', 'lg-initials', 'xl-image', 'xl-initials'],
    tokens: [
      { property: 'Border radius',         token: 'radius/pill',           cssVar: '--radius-pill',           value: '50% (source-exact, mapped to pill)' },
      { property: 'Size xs',               token: '—',                     cssVar: '—',                       value: '24px (Figma component property)' },
      { property: 'Size sm',               token: '—',                     cssVar: '—',                       value: '32px' },
      { property: 'Size md',               token: '—',                     cssVar: '—',                       value: '40px' },
      { property: 'Size lg',               token: '—',                     cssVar: '—',                       value: '56px' },
      { property: 'Size xl',               token: '—',                     cssVar: '—',                       value: '80px (source uses 20px font for this size)' },
      { property: 'Initials bg',           token: 'surface/bg/brand',      cssVar: '--surface-bg-brand',      value: '#722ED1 (DC-005: production #4e3bc2)' },
      { property: 'Initials text',         token: 'text/on/brand',        cssVar: '--text-on-brand',         value: '#ffffff' },
      { property: 'Initials font',         token: 'Nunito SemiBold 600',   cssVar: '—',                       value: 'fontSize scales 0.4 × avatar size' },
      { property: 'Image placeholder bg',  token: 'surface/bg/sunken',     cssVar: '--surface-bg-sunken',     value: 'neutral-100' },
      { property: 'Image placeholder icon', token: 'icon/muted',          cssVar: '--icon-muted',             value: 'neutral-500' },
    ],
    usageExample: `<div className={classes.profileAvatarWithName}>
  {photoUrl ? <img src={photoUrl} /> : initials}
</div>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/components/molecules/ProfileAvatar/ProfileAvatar.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Source ProfileAvatar uses width: 100% / height: 100% — actual size comes from the parent container. Figma component provides explicit size variants for designer convenience.',
      'Source font-size is 20px on the .profileAvatarWithName variant only — that fits the lg/xl sizes. Smaller sizes scale font 0.4 × avatar size for legibility.',
      'Source has no status indicator (online/busy dot) — that\'s Tier 3 work.',
      'Border (1.5px solid border/default per spec) NOT in source — Figma adds nothing extra; matches source.',
    ],
  },

  // ─── FeedLayout (Tier 2 — verified) ──────────────────────────────────────
  {
    name: 'FeedLayout',
    slug: 'feed-layout',
    description: 'Feed container from FeedLayout.module.scss. 682px max-width centered, gap 15 between cards, marginTop 20 on section header, switchContainer divider. 6 variants: my-feed × {populated, empty, loading} + global-feed × {populated, empty, loading}. Populated state uses real Card instances.',
    variants: ['my-feed-populated', 'my-feed-empty', 'my-feed-loading', 'global-feed-populated', 'global-feed-empty', 'global-feed-loading'],
    tokens: [
      { property: 'Max width',                  token: '—',                          cssVar: '—',                              value: '682px (source-exact, no token)' },
      { property: 'Section header padding-top', token: 'space/inset/xl',            cssVar: '--space-inset-xl',               value: '20px' },
      { property: 'Switch container marginTop', token: '—',                          cssVar: '—',                              value: '15px (source-exact)' },
      { property: 'Switch container marginBottom', token: '—',                       cssVar: '—',                              value: '24px' },
      { property: 'Vertical line bg',           token: 'border/default',             cssVar: '--border-default',               value: 'neutral-200 (source: #c1ccd7)' },
      { property: 'Card gap',                   token: '—',                          cssVar: '—',                              value: '15px (source-exact)' },
      { property: 'Heading',                    token: 'Heading/H3',                 cssVar: '—',                              value: 'Nunito 24px / 600' },
      { property: 'Empty illustration bg',      token: 'surface/bg/sunken',          cssVar: '--surface-bg-sunken',            value: 'neutral-100' },
      { property: 'Skeleton card bg',           token: 'surface/bg/sunken',          cssVar: '--surface-bg-sunken',            value: 'neutral-100' },
      { property: 'Skeleton card radius',       token: 'radius/container/lg',        cssVar: '--radius-container-lg',          value: '10px (source: 16px on Card, drift)' },
    ],
    usageExample: `<section className={classes.exploreSections}>
  <header className={classes.sectionHeader}>
    <h2>{title}</h2>
    <div className={classes.switchContainer}>
      <span className={classes.verticalLine} />
    </div>
  </header>
  {state === 'populated' && <FeedCardList items={items} />}
  {state === 'empty' && <FeedEmpty />}
  {state === 'loading' && <FeedSkeleton count={3} />}
</section>`,
    sourceFile: 'repo-cloned/brightchamps-brightchamps-student-dashboard-7628991d99a8/src/newDashboard/templates/FeedLayout/FeedLayout.module.scss',
    target: 'newDashboard',
    verificationStatus: 'verified',
    conflicts: [
      'Vertical line bg #c1ccd7 (source) bound to border/default (neutral-200). The two are visually similar but ΔE non-zero.',
      'Active dot bg #4E3BC2 (production primary) vs library #722ED1 — DC-005 unresolved.',
      'Inactive dot bg #AB9DFF — not in ledger. Closest is primary/300 (#AA82E3). Not used in Figma component (carousel dots are visual chrome, deferred to Tier 3).',
      'Sticky header (fixed top, height 60, transitions) NOT built — animation/sticky is a runtime concern, not visual chrome.',
      'Carousel arrows (.prevArrow, .nextArrow) NOT built — Tier 3.',
      'Populated state uses Card with-image instances. Real feed items have richer composition (ClassJoiningCard, etc.) — those are sub-components for Tier 3.',
    ],
  },
]
