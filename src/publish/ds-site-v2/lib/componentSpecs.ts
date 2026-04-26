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
}

export const componentSpecs: ComponentSpec[] = [
  {
    name: 'Button',
    slug: 'button',
    description: 'Three distinct button types for different action hierarchies. Primary for the main CTA, Secondary for supporting actions, Ghost for tertiary or low-emphasis actions.',
    variants: ['primary', 'secondary', 'ghost'],
    tokens: [
      { property: 'Background (Primary)',        token: 'color/brand/primary', cssVar: '--color-brand-primary', value: '#4e3bc2' },
      { property: 'Background (Secondary)',      token: 'color/warning/500',   cssVar: '--color-warning-500',   value: '#ffd900' },
      { property: 'Background (Hover)',          token: 'color/primary/700',   cssVar: '--color-primary-700',   value: '#0d47a1' },
      { property: 'Text (Primary, on dark)',     token: 'color/neutral/100',   cssVar: '--color-neutral-100',   value: '#ffffff' },
      { property: 'Text (Secondary, on light)',  token: 'color/neutral/1400',  cssVar: '--color-neutral-1400',  value: '#212121' },
      { property: 'Disabled bg',                 token: 'color/neutral/200',   cssVar: '--color-neutral-200',   value: '#eeeeee' },
      { property: 'Disabled text',               token: 'color/neutral/400',   cssVar: '--color-neutral-400',   value: '#c3c2b3' },
      { property: 'Padding (x)',                 token: 'space/6',             cssVar: '--space-6',             value: '24px' },
      { property: 'Padding (y)',                 token: 'space/3',             cssVar: '--space-3',             value: '12px' },
      { property: 'Icon gap (sm)',               token: 'space/1',             cssVar: '--space-1',             value: '4px' },
      { property: 'Icon gap (md)',               token: 'space/2',             cssVar: '--space-2',             value: '8px' },
      { property: 'Border radius',               token: 'radius/full',         cssVar: '--radius-full',         value: '9999px' },
      { property: 'Font family',                 token: 'font/body/medium',    cssVar: '--font-body-medium',    value: 'Nunito 16px / 500' },
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
    sourceFile: 'repo-cloned/brightchamps-student-feed-b84495106f34/src/components/atoms/Button/Button.scss',
    verificationStatus: 'conflict',
    conflicts: [
      'Primary background: spec says color/brand/primary (#4e3bc2). Source uses #6651e4 (color/primary/500). Production de facto brand color is #6651e4 (used in 9 places across 7 files).',
      'No Secondary variant in source. Source has .submit (white bg) and .quiz (#f0ad4e bootstrap orange). Spec calls for color/warning/500 (#ffd900).',
      'No :hover rule in source. Spec defines hover background color/primary/700 (#0d47a1).',
      'Padding mismatch: spec says space/6 + space/3 (24px / 12px). Source uses 10px 15px (default) and 10px 20px (.primary).',
      'Border radius: spec says radius/full (9999px). Source has 5px on .btn base, 100px on .primary and .submit.',
      'Bug in source: Button.scss line ~31 has `color: 007bff;` (missing # — invalid CSS). Submit-variant text color is broken.',
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
    verificationStatus: 'inferred',
    conflicts: [
      'Source file not located. ProgressLine appears in the broader student-app surfaces (63 elements across 7 pages per DOM audit), but no matching React component exists in the brightchamps-student-feed repo. Likely lives in the /learn/ surface codebase.',
      'Per docs/component-spec-verification.md: success-fill spec value (#00B67A, color/success/500) disagrees with what production currently ships in CertificateCardBody (#24C26E, color/success/300). Same conflict tracked as DC-001.',
    ],
  },
  {
    name: 'Accordion',
    slug: 'accordion',
    description: 'Expandable content sections. Used for lesson lists, FAQ blocks, and any place where you want scannable headings with on-demand detail.',
    variants: ['collapsed', 'expanded'],
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
    verificationStatus: 'inferred',
    conflicts: [
      'Source file not located in brightchamps-student-feed. The 98 Accordion DOM elements counted in the audit live elsewhere (likely /learn/ lesson lists or /badges/).',
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
    verificationStatus: 'inferred',
    conflicts: [
      'Source file not located in brightchamps-student-feed. LessonList lives on the /learn/ surface only (43 elements per DOM audit). Only "lesson" reference in this repo is a comment in CompletionCardBody.',
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
    verificationStatus: 'inferred',
    conflicts: [
      'Source file not located in brightchamps-student-feed. No file matching GreenLine / green-line. The 49 elements counted in the audit live on the broader student-app surfaces.',
      'Production success color is #24C26E (color/success/300), not #00B67A (color/success/500) per the spec. Same conflict as ProgressLine and DC-001.',
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
    verificationStatus: 'inferred',
    conflicts: [
      'Source file not located in brightchamps-student-feed. The feed repo is mounted inside a parent shell — the Layout / sidebar / app frame is owned by another codebase.',
      'Per docs/component-spec-verification.md: spec uses color/brand/primary (#4e3bc2) for the active sidebar item, but production code uses #6651e4 (color/primary/500) for every brand-purple touch. Pending DC-005 resolution.',
    ],
  },
]
