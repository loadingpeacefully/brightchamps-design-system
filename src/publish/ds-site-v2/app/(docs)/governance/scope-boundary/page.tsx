import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'
import { componentSpecs } from '@/lib/componentSpecs'

export const metadata: Metadata = {
  title: 'Component scope boundary',
  description: 'Which production components are in the design system scope, and which are not. Surfaces feature-level components and dead code that engineering can deprecate.',
}

const TOC = [
  { id: 'in-scope',     label: 'In scope (system)',  level: 2 as const },
  { id: 'out-of-scope', label: 'Out of scope (feature)', level: 2 as const },
  { id: 'deprecated',   label: 'Deprecated (unused)',    level: 2 as const },
]

interface FeatureRow { component: string; reason: string; usedOn: string }
interface DeprecatedRow { component: string; lastSeen: string; replacement: string }

const OUT_OF_SCOPE: FeatureRow[] = [
  { component: 'ChatBot',                  reason: 'AI chat feature, not a UI pattern. 17 child components, 1,151 SCSS lines.', usedOn: 'BrightBuddy on every authenticated page' },
  { component: 'Login',                    reason: 'Auth page, not a reusable component.',           usedOn: '/login' },
  { component: 'PreLogin',                 reason: 'Auth surface, not reusable.',                    usedOn: '/login (pre-auth state)' },
  { component: 'MyLearningProcess',        reason: 'Feature with 574 SCSS lines, API + Redux deps.', usedOn: '/learn' },
  { component: 'ParentHubProfile',         reason: 'Surface-specific feature.',                      usedOn: '/parent-hub' },
  { component: 'DemoDashboard',            reason: 'Cold-demo landing surface, not reusable.',       usedOn: '/demo-dashboard' },
  { component: 'NewExperience',            reason: 'Onboarding-specific composition.',               usedOn: '/onboarding' },
  { component: 'LearningExperience',       reason: 'Course-detail composition.',                     usedOn: '/learn/[course]' },
  { component: 'FAQ',                      reason: 'Marketing/help content surface.',                usedOn: '/faq' },
  { component: 'AppWrapper',               reason: 'App shell wrapper, framework-level.',            usedOn: 'every route' },
  { component: 'ThirdPartyScripts',        reason: 'Script tag injector, infra not UI.',             usedOn: 'every route' },
  { component: 'ErrorBoundaries',          reason: 'React error boundary, framework-level.',         usedOn: 'every route' },
  { component: 'CertificateCard',          reason: 'Single-page certificate display feature.',       usedOn: '/certificates' },
  { component: 'VideoModal',               reason: 'Single-flow video player feature.',              usedOn: 'demo-class flow' },
  { component: 'ProjectModal',             reason: 'Project showcase modal — surface-specific.',     usedOn: '/showcase' },
  { component: 'PaymentErrorPopup',        reason: 'Payment-flow error surface.',                    usedOn: 'checkout' },
  { component: 'MakeupClasses',            reason: 'Makeup-class workflow.',                         usedOn: '/reschedule' },
  { component: 'MakeupClassOptions',       reason: 'Makeup-class workflow.',                         usedOn: '/reschedule' },
  { component: 'MakeupStatusModal',        reason: 'Makeup-class workflow.',                         usedOn: '/reschedule' },
  { component: 'InstallmentCard',          reason: 'Billing-flow specific, payment service deps.',   usedOn: '/billing' },
  { component: 'InstallmentReminder',      reason: 'Billing-flow specific.',                         usedOn: '/billing' },
  { component: 'Onboarding',               reason: 'Onboarding-flow composition (use sections instead).', usedOn: '/onboarding' },
  { component: 'DemoCourseDetailModal',    reason: 'Cold-demo specific surface.',                    usedOn: '/demo-dashboard' },
  { component: 'PopupMenu',                reason: 'Right-click menu — single-surface utility.',     usedOn: '/dashboard' },
]

const DEPRECATED: DeprecatedRow[] = [
  { component: 'NavigationBar',         lastSeen: '0 imports',  replacement: 'NavBar (newDashboard atom) — covered by /components/nav-bar/' },
  { component: 'NavigationBarMobile',   lastSeen: '0 imports',  replacement: 'Use mobile nav from FeedLayout templates' },
  { component: 'TeacherProfileOld',     lastSeen: '0 imports',  replacement: 'TeacherProfile (current)' },
  { component: 'SectionHeaderOld',      lastSeen: '0 imports',  replacement: 'SectionHeader (current)' },
  { component: 'RewardsSkeletons',      lastSeen: '0 imports',  replacement: 'skeletons/ folder shared across rewards' },
  { component: 'ReschedulePopup',       lastSeen: '0 imports',  replacement: 'Reschedule (legacy) molecule' },
  { component: 'PaginationComponent',   lastSeen: '0 imports',  replacement: 'No replacement — never adopted' },
  { component: 'NanoSkillDiscountBanner', lastSeen: '0 imports', replacement: 'SummerCampBanner pattern (campaign banners)' },
  { component: 'filter',                lastSeen: '0 imports',  replacement: 'No replacement — never adopted' },
  { component: 'ErrorFallbackUi',       lastSeen: '0 imports',  replacement: 'ErrorBoundaries (out-of-scope)' },
  { component: 'NewExperience',         lastSeen: '0 imports',  replacement: 'Onboarding (also out-of-scope)' },
  { component: 'LearningExperience',    lastSeen: '0 imports',  replacement: 'No replacement — never adopted' },
  { component: 'modal (lowercase)',     lastSeen: '0 imports',  replacement: 'Modal (capitalized) — see /components/overlays/modal/' },
  { component: 'ModalV2',               lastSeen: '0 imports',  replacement: 'Modal — V2 was an experiment that never landed' },
  { component: 'toggleswitch',          lastSeen: '0 imports',  replacement: 'ToggleSwitch (capitalized)' },
  { component: 'toast',                 lastSeen: '0 imports',  replacement: 'react-hot-toast (external lib)' },
  { component: 'skeletons',             lastSeen: '0 imports',  replacement: 'Inline skeleton patterns per molecule' },
  { component: 'switchprofile',         lastSeen: '0 imports',  replacement: 'SwitchProfileItemCard' },
  { component: 'profiles',              lastSeen: '0 imports',  replacement: 'StudentProfile / ProfileAvatar' },
  { component: 'errorComponent',        lastSeen: '0 imports',  replacement: 'ErrorBoundaries (out-of-scope)' },
  { component: 'banners',               lastSeen: '0 imports',  replacement: 'SummerCampBanner / SubscriptionStatusBanner' },
  { component: 'Working',               lastSeen: '0 imports',  replacement: 'Loader' },
  { component: 'rate-us',               lastSeen: '0 imports',  replacement: 'TrustPilotPopup / Rating' },
  { component: 'refund-withdraw',       lastSeen: '0 imports',  replacement: 'Refund (also unused)' },
  { component: 'Refund',                lastSeen: '0 imports',  replacement: 'No replacement — never used in current codebase' },
]

export default function ScopeBoundaryPage() {
  const inScope = componentSpecs.length

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Governance</div>
        <h1 className="text-h1 text-chrome-text">Component scope boundary</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Which production components are in the design system scope, and which are not. The total component
          count in the dashboard repo is ~168, but only the system primitives (this page&rsquo;s in-scope set)
          belong in the DS. Feature components and dead code are surfaced here so the eng team can plan
          deprecations and the design team knows what NOT to expect coverage for.
        </p>

        <section className="mt-8 grid gap-3 grid-cols-3">
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">In scope · System</div>
            <div className="text-[28px] font-bold" style={{ color: '#0e6a32' }}>{inScope}</div>
            <div className="text-[11px] text-chrome-text-subtlest">spec&apos;d in /components/</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Out of scope · Feature</div>
            <div className="text-[28px] font-bold" style={{ color: '#8a5e00' }}>{OUT_OF_SCOPE.length}</div>
            <div className="text-[11px] text-chrome-text-subtlest">page-level, not reusable</div>
          </div>
          <div className="rounded-card border border-chrome-border bg-chrome-surface-raised p-5">
            <div className="text-overline text-chrome-text-subtlest mb-1">Deprecated · Unused</div>
            <div className="text-[28px] font-bold" style={{ color: '#a31836' }}>{DEPRECATED.length}</div>
            <div className="text-[11px] text-chrome-text-subtlest">0 imports — eng can remove</div>
          </div>
        </section>

        <section id="in-scope" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">In scope — System components</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Reusable UI primitives or patterns that appear across surfaces. All have spec pages — see <a className="text-chrome-accent hover:underline" href="/components/">/components/</a> overview, or <a className="text-chrome-accent hover:underline" href="/components/health/">component health dashboard</a> for verification status.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Status</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Has Figma preview?</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Target</th>
                </tr>
              </thead>
              <tbody>
                {componentSpecs.map(spec => (
                  <tr key={spec.slug} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px]">
                      <a className="text-chrome-text hover:text-chrome-accent hover:underline" href={`/components/${spec.slug}/`}>{spec.name}</a>
                    </td>
                    <td className="p-3"><span className={'rounded-[3px] px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] ' + (spec.verificationStatus === 'verified' ? 'bg-[rgba(36,194,110,0.15)] text-[#0e6a32]' : spec.verificationStatus === 'inferred' ? 'bg-[rgba(255,205,106,0.30)] text-[#8a5e00]' : 'bg-[rgba(240,41,77,0.20)] text-[#a31836]')}>{spec.verificationStatus}</span></td>
                    <td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">{spec.figmaNodeId ? '✓ ' + spec.figmaNodeId : '—'}</td>
                    <td className="p-3 font-mono text-[12px] text-chrome-text-subtle">{spec.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="out-of-scope" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Out of scope — Feature components</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Product features, not UI primitives. They have complex business logic, API dependencies, or are
            tied to a single route. The DS does not cover them — they should compose system components, not be
            generalized as system components themselves.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Reason out-of-scope</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Used on</th>
                </tr>
              </thead>
              <tbody>
                {OUT_OF_SCOPE.map(r => (
                  <tr key={r.component} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px] text-chrome-text">{r.component}</td>
                    <td className="p-3 text-chrome-text-subtle">{r.reason}</td>
                    <td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">{r.usedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="deprecated" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Deprecated — Unused components</h2>
          <p className="mt-2 max-w-[62ch] text-body-m text-chrome-text-subtle">
            Zero imports in the current codebase. Engineering can remove these on the next cleanup pass — the
            design system intentionally does NOT cover them.
          </p>
          <div className="mt-4 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Last seen</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Replacement</th>
                </tr>
              </thead>
              <tbody>
                {DEPRECATED.map(r => (
                  <tr key={r.component} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono text-[12.5px] text-chrome-text">{r.component}</td>
                    <td className="p-3 font-mono text-[11.5px] text-chrome-text-subtle">{r.lastSeen}</td>
                    <td className="p-3 text-chrome-text-subtle">{r.replacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
