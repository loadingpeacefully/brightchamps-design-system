// surfaces.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all surfaces: URLs to crawl + Figma file IDs.
// Replace placeholder values with real URLs and Figma file IDs before running.
// Figma file IDs: copy from Figma URL → figma.com/file/{FILE_ID}/...
// ─────────────────────────────────────────────────────────────────────────────

export type Surface = 'landing' | 'student' | 'teacher' | 'admin'

export interface SurfaceConfig {
  name: Surface
  displayName: string
  hasFigma: boolean
  figmaFileId?: string          // required if hasFigma: true
  urls: string[]                // all pages to crawl
  crawlDepth?: number           // how many levels deep Playwright should follow links
  authRequired?: boolean        // if true, Playwright needs session cookie
  cookieEnvKey?: string         // env var holding the cookie string (e.g. STUDENT_COOKIE)
  cookieFormat?: 'header'       // how to inject the cookie; 'header' → Cookie: <value>
  storageStatePath?: string     // Playwright storage state file (preferred over cookieEnvKey)
  extractionMode?: 'static' | 'interactive'  // default 'static'; interactive adds click-through probes
  notes?: string
}

export const surfaces: SurfaceConfig[] = [
  {
    name: 'landing',
    displayName: 'Landing Pages (Website)',
    hasFigma: true,
    figmaFileId: 'REPLACE_WITH_LANDING_FIGMA_FILE_ID',
    urls: [
      'https://brightchamps.com',
      'https://brightchamps.com/coding-for-kids',
      'https://brightchamps.com/maths',
      'https://brightchamps.com/about',
      // Add more landing page URLs
    ],
    crawlDepth: 1,
    authRequired: false,
    notes: 'Public marketing site. No auth needed.',
  },
  {
    name: 'student',
    displayName: 'Student App',
    hasFigma: true,
    figmaFileId: 'EznPshYN5XVc49fQSUOSEQ',
    urls: [
      'https://champ.brightchamps.com/my-feed/',
      'https://champ.brightchamps.com/global-feed/',
      'https://champ.brightchamps.com/badges/',
      'https://champ.brightchamps.com/nano-skills/',
      'https://champ.brightchamps.com/learn/',
      'https://champ.brightchamps.com/certificates/',
      'https://champ.brightchamps.com/rewards/',
    ],
    crawlDepth: 0,
    authRequired: true,
    storageStatePath: '.playwright-auth/student.json',
    extractionMode: 'interactive',
    notes: 'Auth via Playwright storageState. Refresh with: npx playwright codegen --save-storage=.playwright-auth/student.json https://champ.brightchamps.com/login/',
  },
  {
    name: 'teacher',
    displayName: 'Teacher App',
    hasFigma: true,
    figmaFileId: 'REPLACE_WITH_TEACHER_FIGMA_FILE_ID',
    urls: [
      'https://REPLACE_WITH_TEACHER_APP_URL/dashboard',
      'https://REPLACE_WITH_TEACHER_APP_URL/students',
      'https://REPLACE_WITH_TEACHER_APP_URL/lessons',
      // Add more teacher app URLs
    ],
    crawlDepth: 0,
    authRequired: true,
    notes: 'Requires teacher session cookie. Set TEACHER_COOKIE in .env',
  },
  {
    name: 'admin',
    displayName: 'Admin Dashboard',
    hasFigma: false,   // NO Figma design exists — DOM is the source of truth
    urls: [
      'https://REPLACE_WITH_ADMIN_URL/dashboard',
      'https://REPLACE_WITH_ADMIN_URL/users',
      'https://REPLACE_WITH_ADMIN_URL/reports',
      'https://REPLACE_WITH_ADMIN_URL/settings',
      // Add more admin pages
    ],
    crawlDepth: 0,
    authRequired: true,
    notes: 'NO Figma file. DOM extraction becomes canonical. Set ADMIN_COOKIE in .env',
  },
]

export const figmaApiBase = 'https://api.figma.com/v1'
export const figmaTokenEnvKey = 'FIGMA_ACCESS_TOKEN'
