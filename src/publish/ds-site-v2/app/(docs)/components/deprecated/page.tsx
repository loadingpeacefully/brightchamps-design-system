import type { Metadata } from 'next'
import { RightTOC } from '@/components/chrome/RightTOC'

export const metadata: Metadata = {
  title: 'Deprecated components',
  description: 'Legacy src/components/ entries with zero current import-graph usage. Candidates for removal.',
}

const TOC = [
  { id: 'unused',     label: '17 unused legacy components', level: 2 as const },
  { id: 'duplicates', label: 'Known duplicates',             level: 2 as const },
  { id: 'method',     label: 'Method',                       level: 2 as const },
]

const UNUSED = [
  { name: 'CertificateCard',         note: 'Likely superseded by /newDashboard/certificates/' },
  { name: 'ClassRatingFeedback',     note: '0 imports. Class-rating flow rebuilt elsewhere.' },
  { name: 'confirmationModal',       note: '0 imports. Replaced by newDashboard ConfirmationModal molecule.' },
  { name: 'CurrentTime',             note: '0 imports. Time-display utility (probably one-off).' },
  { name: 'EditContactInformation',  note: '0 imports. Replaced by newDashboard EditContactInformation molecule.' },
  { name: 'filter',                  note: '0 imports. Generic filter — likely test/dead code.' },
  { name: 'LearningExperience',      note: '0 imports. Replaced by /newDashboard/learn/.' },
  { name: 'MyRewardsCard',           note: '1 import (page-level). Verify if still wired.' },
  { name: 'NewExperience',           note: '0 imports. Onboarding-experience legacy.' },
  { name: 'ProjectModal',            note: '0 imports. Project-modal flow rebuilt.' },
  { name: 'Rating',                  note: '0 imports. Generic rating — likely replaced by StarRating.' },
  { name: 'RedeemGemsCard',          note: '0 imports (legacy). newDashboard has its own RedeemGemsCard molecule.' },
  { name: 'ResponsePicker',          note: '0 imports. Question-response picker (legacy onboarding).' },
  { name: 'RewardsReferralCard',     note: '0 imports. Replaced by /newDashboard/rewards/.' },
  { name: 'RewardsTabs',             note: '0 imports. Legacy rewards-tab structure.' },
  { name: 'RewardsWalkthroughCard',  note: '0 imports. Walkthrough flow legacy.' },
  { name: 'SummerCampCard',          note: '0 imports. Seasonal/promotional component.' },
  { name: 'TeacherDetail',           note: '0 imports. Replaced by /newDashboard/TeacherProfile/.' },
]

const DUPLICATES = [
  { component: 'SideBarPopup',     locations: 'src/components/SideBarPopup/ + src/newDashboard/components/atoms/SideBarPopup/', note: 'DC-028 candidate. Legacy has 16 imports; atom version coexists.' },
  { component: 'Gap',              locations: 'src/components/Gap/ + src/newDashboard/components/atoms/Gap (created with library)', note: 'DC-028. Two spacer utilities; consolidate.' },
  { component: 'ShowStarRating',   locations: 'src/components/ShowStarRating/ + src/newDashboard/components/atoms/ShowStarRating/', note: 'DC-028. Both display-only; one wins.' },
  { component: 'DropDown',         locations: 'src/components/DropDown/ + src/newDashboard/components/molecules/DropDown/ + src/newDashboard/components/atoms/dropdown/', note: 'TRIPLICATE. Plus Select (separate component) makes four dropdown implementations.' },
  { component: 'EditContactInformation', locations: 'src/components/EditContactInformation/ + src/newDashboard/components/molecules/EditContactInformation/', note: 'Two implementations of the same form.' },
  { component: 'CardImage',        locations: 'src/components/CardImage/ + src/newDashboard/components/molecules/CardImage/', note: 'Two image-display implementations.' },
  { component: 'ConfirmationModal', locations: 'src/components/confirmationModal/ + src/newDashboard/components/molecules/ConfirmationModal/', note: 'Casing differs (legacy lowercase). Two modals.' },
  { component: 'Button',           locations: 'src/components/Button/ + src/newDashboard/components/molecules/Button/', note: 'Already documented. Two Button implementations.' },
  { component: 'Card',             locations: 'src/components/Card/ + src/newDashboard/components/molecules/Card/', note: 'Already documented. Two Card implementations.' },
  { component: 'ProgressBar',      locations: 'src/components/ProgressBar/ + src/newDashboard/components/atoms/ProgressBar/', note: 'DC-021. Legacy uses brand-purple; newDashboard uses traffic-light. Different palettes.' },
]

export default function DeprecatedPage() {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[960px]">
        <div className="text-overline text-chrome-text-subtlest mb-2">Components · Deprecated</div>
        <h1 className="text-h1 text-chrome-text">Deprecated components</h1>
        <p className="mt-3 max-w-[62ch] text-body-l text-chrome-text-subtle">
          Triage of <code className="font-mono">src/components/</code> entries with zero or very low import-graph usage,
          and known duplicates between legacy and newDashboard. These are candidates for removal or consolidation.
        </p>

        <div className="mt-4 rounded-card border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-4 text-[13px]">
          <div className="text-overline text-[#8a5e00] mb-1">Caveat</div>
          <p className="text-chrome-text">
            Import-graph counts come from <code className="font-mono">grep -rln "components/Name" src</code>. Components used via dynamic
            imports, barrel files, or string-keyed lookups may show 0 imports but still be live. Do not delete on this evidence alone —
            run a build that fails on dead code, or a coverage pass on production routes, before removing anything.
          </p>
        </div>

        <section id="unused" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">17 components with 0 direct imports</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            All 0-import legacy components in <code className="font-mono">src/components/</code>. Most have a clear
            newDashboard replacement; a few (RewardsTabs, RewardsWalkthroughCard) appear to be dead promotional flows.
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Note</th>
                </tr>
              </thead>
              <tbody>
                {UNUSED.map(u => (
                  <tr key={u.name} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{u.name}</td>
                    <td className="p-3 text-chrome-text-subtle">{u.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="duplicates" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Known duplicates (legacy ↔ newDashboard)</h2>
          <p className="mt-2 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Ten components exist in both <code className="font-mono">src/components/</code> and{' '}
            <code className="font-mono">src/newDashboard/components/</code>. Some have already been documented as DC tickets
            (DC-021, DC-028); others surfaced from the legacy triage. <strong>Recommend per-pair audit + deprecation
            decision before any codemod.</strong>
          </p>
          <div className="mt-6 overflow-x-auto rounded-card border border-chrome-border">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-chrome-surface-sunken border-b border-chrome-border">
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Component</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Locations</th>
                  <th className="text-left p-3 font-bold text-overline text-chrome-text-subtlest">Note</th>
                </tr>
              </thead>
              <tbody>
                {DUPLICATES.map(d => (
                  <tr key={d.component} className="border-b border-chrome-border last:border-b-0">
                    <td className="p-3 font-mono">{d.component}</td>
                    <td className="p-3 font-mono text-chrome-text-subtle text-[11px]">{d.locations}</td>
                    <td className="p-3 text-chrome-text-subtle">{d.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="method" className="mt-12 scroll-mt-24">
          <h2 className="text-h2 text-chrome-text">Method</h2>
          <pre className="mt-2 rounded-card border border-chrome-border bg-chrome-surface-sunken p-3 text-[12px] font-mono text-chrome-text-subtle overflow-x-auto">{`for c in [46 legacy components]; do
  count=$(grep -rln "components/$c" src --include="*.tsx" --include="*.ts" | wc -l)
  echo "$count $c"
done | sort -rn`}</pre>
          <p className="mt-3 text-body-s text-chrome-text-subtle max-w-[62ch]">
            Excludes dynamic imports and barrel-file re-exports. Components with 1–2 imports are not listed as deprecated
            (they may be edge-case routes); they are tracked in the active-legacy Figma page (<em>Legacy / Components</em>)
            with usage-count badges.
          </p>
        </section>
      </article>
      <RightTOC items={TOC} />
    </div>
  )
}
