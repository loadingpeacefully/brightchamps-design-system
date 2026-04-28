import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'pageLayoutConfig',
  description: 'Maps every route to a layout + per-route provider toggles. The single source of truth that AppLayout dispatches against.',
}

const TOC = [
  { id: 'overview',  label: 'Overview',           level: 2 as const },
  { id: 'layouts',   label: 'Layout enum',         level: 2 as const },
  { id: 'mapping',   label: 'Route → layout',      level: 2 as const },
  { id: 'providers', label: 'Provider toggles',    level: 2 as const },
  { id: 'gotchas',   label: 'Gotchas',             level: 2 as const },
]

const LAYOUT_KEYS = [
  { key: 'DASHBOARD',          link: '/components/layouts/dashboard-layout-v2/' },
  { key: 'DEMODASHBOARD',      link: '/components/layouts/demo-dashboard-layout/' },
  { key: 'LOGIN',              link: '/components/layouts/login-layout/' },
  { key: 'FULLWIDTH',          link: '/components/layouts/full-width-layout/' },
  { key: 'FULLSCREEN',         link: '/components/layouts/full-screen-layout/' },
  { key: 'ONBOARDING',         link: '/components/layouts/onboarding-layout/' },
  { key: 'GAME_DASHBOARD',     link: '/components/layouts/game-dashboard-layout/' },
  { key: 'NewDashboardLayout', link: '/components/dashboard-layout/' },
  { key: 'FeedLayout',         link: '/components/feed-layout/' },
]

const ROUTES = [
  { route: 'accounts',            layout: 'FULLWIDTH',     protected: true,  notes: '—' },
  { route: 'dashboard',           layout: 'DASHBOARD',     protected: true,  notes: '—' },
  { route: 'login',               layout: 'LOGIN',         protected: false, notes: '—' },
  { route: 'demo-dashboard',      layout: 'FULLWIDTH',     protected: false, notes: 'Custom provider toggles for public route optimization' },
  { route: 'demo-dashboard-post', layout: 'DEMODASHBOARD', protected: true,  notes: 'Post-trial authenticated dashboard' },
  { route: 'onboarding',          layout: 'ONBOARDING',    protected: true,  notes: 'overflow:hidden viewport' },
  { route: 'game-dashboard',      layout: 'GAME_DASHBOARD', protected: true, notes: 'Poppins font override' },
]

const PROVIDERS = [
  { key: 'enableRedux',                desc: 'Mounts Redux store for the route. Default true; set false for public marketing-style routes.' },
  { key: 'enableAuth',                  desc: 'Wires in the session check. Set false on /login, /demo-dashboard, /signup.' },
  { key: 'enableStudentList',           desc: 'Loads the student-list query (used by parent multi-child accounts).' },
  { key: 'enableLearningProgress',      desc: 'Subscribes to learning-progress reducer. Off on demo + auth routes.' },
  { key: 'enableGurukulAppStatus',      desc: 'Polls the Gurukul installation/version state.' },
  { key: 'enableClassList',             desc: 'Loads upcoming-class data. Off on routes that don\'t show ClassJoiningCard.' },
  { key: 'enableCertificatePopup',      desc: 'Mounts the celebratory CertificatePopup overlay listener.' },
  { key: 'enableClarityTracking',       desc: 'Microsoft Clarity session-replay snippet.' },
  { key: 'enableGscScript',             desc: 'Google Search Console verification meta — only on indexable routes.' },
  { key: 'enableToast',                 desc: 'Mounts the toast renderer slot.' },
  { key: 'enableErrorBoundaries',       desc: 'Wraps the route in error boundaries (default true).' },
  { key: 'enableTimeDiff',              desc: 'Subscribes to clock-skew detection.' },
  { key: 'enableDemoDashboardDetail',   desc: 'Demo-only — mounts the demo-detail panel.' },
]

export default function PageLayoutConfigPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components · Layouts</div>
        <h1 className="text-h1 text-chrome-text">pageLayoutConfig</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Maps every route key to a layout and a set of per-route provider toggles. AppLayout reads this on every
          navigation and dispatches to the matching layout + mounts only the providers the route needs.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px]">
          <span className="text-chrome-text-subtlest">Source: <code className="font-mono text-[12px]">src/layouts/pageLayoutConfig.ts</code></span>
        </div>

        <section id="overview" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Overview</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            One file, two exports: <code className="font-mono">layouts</code> (the enum of valid layout keys) and{' '}
            <code className="font-mono">pageConfig</code> (the route → &#123; layout, protected, providers? &#125; map).
          </p>
        </section>

        <section id="layouts" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Layout enum</h2>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc text-body-m text-chrome-text">
            {LAYOUT_KEYS.map(l => (
              <li key={l.key}><a className="text-chrome-accent hover:underline font-mono" href={l.link}>{l.key}</a></li>
            ))}
          </ul>
        </section>

        <section id="mapping" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Route → layout</h2>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Route key</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Layout</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Protected?</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Notes</th>
                </tr>
              </thead>
              <tbody>
                {ROUTES.map(r => (
                  <tr key={r.route} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{r.route}</td>
                    <td className="p-3 font-mono">{r.layout}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle">{r.protected ? 'true' : 'false'}</td>
                    <td className="p-3 text-chrome-text-subtle">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="providers" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Provider toggles</h2>
          <p className="mt-2 max-w-[62ch] text-body-s text-chrome-text-subtle">
            Per-route flags that AppLayout / LayoutProviders read to mount or skip individual providers. Defaults
            assume an authenticated dashboard route — public routes opt out for performance.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Toggle</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Description</th>
                </tr>
              </thead>
              <tbody>
                {PROVIDERS.map(p => (
                  <tr key={p.key} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px]">{p.key}</td>
                    <td className="p-3 text-chrome-text">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="gotchas" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Gotchas</h2>
          <ul className="mt-3 ml-4 space-y-1.5 list-disc text-body-m text-chrome-text">
            <li><code className="font-mono">pageConfig: any</code> — the file types the map as <code className="font-mono">any</code> to allow per-route arbitrary keys (e.g. demo-only fields). Tighten this if migrating to strict-mode.</li>
            <li>Adding a new route requires both: (1) a key in <code className="font-mono">pageConfig</code>, and (2) a layout component handled in <code className="font-mono">AppLayout</code>. Forgetting either ends in the layout falling back to FULLWIDTH or rendering nothing.</li>
            <li><code className="font-mono">protected: true</code> means the route falls behind a login gate. Public marketing pages set <code className="font-mono">protected: false</code> AND opt out of redux/auth/clarity providers.</li>
          </ul>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
