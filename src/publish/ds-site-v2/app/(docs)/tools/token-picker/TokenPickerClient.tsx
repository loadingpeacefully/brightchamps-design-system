'use client'

import { useState } from 'react'
import { Sparkles, AlertTriangle, Settings, Check, Copy } from 'lucide-react'
import { colors, typographyTokens } from '@/lib/tokens.generated'

const API_KEY_STORAGE = 'bc-ds-anthropic-key'

const EXAMPLES = [
  'Body text on a dashboard card',
  'Primary CTA button background',
  'Error toast that needs a destructive accent',
  'Small label text on a sunken sidebar',
] as const

interface Recommendation {
  intent: string
  token: string
  cssVar: string
  reasoning: string
  alternatives?: { token: string; cssVar: string; when: string }[]
  warnings?: string[]
}

interface PickerState {
  loading: boolean
  result: Recommendation | null
  raw: string
  error: string | null
}

const buildSystemPrompt = (): string => {
  const colorList = colors
    .filter(c => c.tier !== 'deprecated')
    .map(c => `${c.name} = ${c.value} (${c.cssVar}) — ${c.category}, ${c.tier}, ${c.usageCount} uses`)
    .join('\n')

  const typoList = typographyTokens
    .filter(t => t.tier !== 'deprecated')
    .map(t => `${t.name} = ${t.size}px / ${t.weight} / lh ${t.lineHeight ?? '—'} (${t.cssVar}) — ${t.role}`)
    .join('\n')

  return `You are the BrightChamps design-system token picker.

Given a design intent in plain English, recommend the single best canonical token from the BrightChamps system, plus 1-2 alternatives if the intent is ambiguous. Always prefer canonical over candidate. Never recommend deprecated tokens.

CANONICAL COLOR TOKENS:
${colorList}

CANONICAL TYPOGRAPHY TOKENS:
${typoList}

DESIGN RULES:
- Body text → use neutral/1300+ on light, neutral/100/200 on dark
- Brand emphasis → primary/500 or brand/primary, never raw purple hex
- Surfaces → neutral/100 (default), surface/* (sunken/raised/lavender)
- Feedback → error/* (destructive), success/* (positive), warning/* (caution), info/* (informational)
- Course-specific UI → course/{ai|coding|finance|literature|maths|robotics}/{50|500|900}
- Small labels → font/body/xsmall, font/heading/xsmall/12-600
- Headings → font/heading/* sized to context

OUTPUT FORMAT — always respond with a single JSON object, no prose, no code fences:
{
  "intent": "<echo the user's intent in 1 short sentence>",
  "token": "<canonical token name, e.g. color/primary/500>",
  "cssVar": "<the --css-var-name>",
  "reasoning": "<one short sentence on why this token>",
  "alternatives": [
    { "token": "<name>", "cssVar": "<--var>", "when": "<when to use this instead>" }
  ],
  "warnings": ["<optional caveat — e.g. DC-005 brand-purple conflict, contrast risk, deprecated alias>"]
}

If the intent has no good match, return token = "none" with a reasoning explaining what's missing.`
}

export function TokenPickerClient() {
  const [intent, setIntent] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(API_KEY_STORAGE) ?? ''
  })
  const [keyDraft, setKeyDraft] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState<PickerState>({ loading: false, result: null, raw: '', error: null })

  const saveKey = (): void => {
    const k = keyDraft.trim()
    setApiKey(k)
    if (typeof window !== 'undefined') {
      if (k) localStorage.setItem(API_KEY_STORAGE, k)
      else localStorage.removeItem(API_KEY_STORAGE)
    }
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 1500)
  }

  const pick = async (overrideIntent?: string): Promise<void> => {
    const userIntent = (overrideIntent ?? intent).trim()
    if (!userIntent) {
      setState(s => ({ ...s, error: 'Describe the design intent first.' }))
      return
    }
    if (!apiKey) {
      setShowKeyInput(true)
      setKeyDraft('')
      setState(s => ({ ...s, error: 'Anthropic API key required. Click the gear icon to set it.' }))
      return
    }

    setState({ loading: true, result: null, raw: '', error: null })

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: userIntent }],
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text.slice(0, 200)}`)
      }

      const data = await res.json() as { content?: { type: string; text: string }[] }
      const text = (data.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim()
      const stripped = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/, '').trim()

      let parsed: Recommendation | null = null
      try {
        parsed = JSON.parse(stripped) as Recommendation
      } catch {
        // model returned non-JSON — show raw
      }

      setState({ loading: false, result: parsed, raw: stripped, error: parsed ? null : 'Model returned non-JSON output.' })
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Token pick failed.' }))
    }
  }

  const copy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const useExample = (e: string): void => {
    setIntent(e)
    void pick(e)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-h2 text-chrome-text">Describe an intent</h2>
            <p className="mt-2 text-body-s text-chrome-text-subtle">
              Plain language — the picker matches your description against canonical tokens and explains its choice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setKeyDraft(apiKey); setShowKeyInput(s => !s); setKeySaved(false) }}
            aria-label="Settings — API key"
            className="mt-1 inline-flex items-center justify-center rounded-md border border-chrome-border bg-chrome-surface p-2 text-chrome-text-subtle hover:border-chrome-accent hover:text-chrome-accent transition shrink-0"
            title={apiKey ? 'API key configured — click to edit' : 'Set Anthropic API key'}
          >
            <Settings size={16} strokeWidth={2} />
          </button>
        </div>

        {showKeyInput && (
          <div className="mt-3 rounded-md border border-chrome-border bg-chrome-surface-raised p-3">
            <label className="block">
              <span className="text-overline text-chrome-text-subtlest">Anthropic API key</span>
              <input
                type="password"
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                placeholder="sk-ant-..."
                className="mt-1 w-full rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 font-mono text-[12px] text-chrome-text outline-none focus:border-chrome-accent"
              />
            </label>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-[11px] text-chrome-text-subtlest leading-snug">
                Stored locally. Sent only to api.anthropic.com.
              </p>
              <button
                type="button"
                onClick={saveKey}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold text-white transition hover:brightness-110 shrink-0"
                style={{ background: 'var(--brand-primary)' }}
              >
                {keySaved ? <><Check size={12} strokeWidth={2.5} /> Saved</> : 'Save'}
              </button>
            </div>
          </div>
        )}

        <textarea
          value={intent}
          onChange={e => setIntent(e.target.value)}
          rows={4}
          placeholder="Example: card border on the student dashboard"
          className="mt-4 w-full rounded-md border border-chrome-border bg-chrome-surface p-3 text-[13px] text-chrome-text placeholder:text-chrome-text-subtlest outline-none focus:border-chrome-accent resize-none font-sans"
        />

        <button
          type="button"
          onClick={() => void pick()}
          disabled={state.loading}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'var(--brand-primary)' }}
        >
          <Sparkles size={14} strokeWidth={2.25} />
          {state.loading ? 'Picking…' : 'Recommend token'}
        </button>

        <div className="mt-5">
          <div className="text-overline text-chrome-text-subtlest mb-2">Try one of these</div>
          <div className="grid gap-1.5">
            {EXAMPLES.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => useExample(e)}
                className="rounded-md border border-chrome-border bg-chrome-surface px-3 py-2 text-left text-[12.5px] text-chrome-text hover:border-chrome-accent hover:bg-chrome-accent-subtle transition"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-card border border-chrome-border bg-chrome-surface-raised min-h-[400px] overflow-hidden">
          {state.loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-chrome-border border-t-chrome-accent" />
                <p className="text-body-s text-chrome-text-subtle">Picking the right token…</p>
              </div>
            </div>
          ) : state.error ? (
            <div className="m-5 rounded-md border-l-4 border-l-red-500 border border-chrome-border bg-[rgba(240,41,77,0.05)] p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-[13px] font-semibold text-[#a31836]">Pick failed</p>
                  <p className="mt-1 text-[12px] text-chrome-text">{state.error}</p>
                  {state.raw && (
                    <pre className="mt-2 max-h-[160px] overflow-auto rounded-sm bg-chrome-surface-sunken p-2 text-[10.5px] text-chrome-text-subtle whitespace-pre-wrap">{state.raw}</pre>
                  )}
                </div>
              </div>
            </div>
          ) : state.result ? (
            <ResultView result={state.result} onCopy={copy} copied={copied} />
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center p-6 text-center">
              <p className="text-body-s text-chrome-text-subtle max-w-[42ch]">
                Describe what you&rsquo;re styling — &ldquo;border of an info banner&rdquo;, &ldquo;hover state for a
                gem-balance pill&rdquo; — and the picker returns the best canonical token plus alternatives.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ResultView({
  result,
  onCopy,
  copied,
}: {
  result: Recommendation
  onCopy: (s: string) => Promise<void>
  copied: boolean
}): JSX.Element {
  const matched = colors.find(c => c.cssVar === result.cssVar)
  const swatch = matched?.value ?? null
  return (
    <div className="p-5">
      <div className="text-overline text-chrome-text-subtlest mb-1">Intent</div>
      <p className="text-body-m text-chrome-text">{result.intent}</p>

      <div className="mt-5 rounded-card border border-chrome-border bg-chrome-surface overflow-hidden">
        <div className="flex">
          {swatch && (
            <div className="w-[88px] shrink-0" style={{ background: swatch }} aria-hidden />
          )}
          <div className="flex-1 min-w-0 px-4 py-3.5">
            <div className="text-overline text-chrome-text-subtlest mb-0.5">Recommended</div>
            <div className="font-mono text-[14px] font-bold text-chrome-text break-all">{result.token}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <code className="font-mono text-[12px] text-chrome-text-subtle truncate">{`var(${result.cssVar})`}</code>
              <button
                type="button"
                onClick={() => void onCopy(`var(${result.cssVar})`)}
                className="inline-flex items-center gap-1 rounded-md border border-chrome-border-bold bg-chrome-surface-raised px-2 py-1 text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition shrink-0"
              >
                {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-body-s text-chrome-text">{result.reasoning}</p>

      {result.warnings && result.warnings.length > 0 && (
        <div className="mt-3 rounded-md border border-[#ffcd6a] bg-[rgba(255,231,153,0.18)] p-3">
          <div className="text-overline text-[#8a5e00] mb-1">Heads up</div>
          <ul className="ml-4 list-disc text-[12px] text-chrome-text space-y-0.5">
            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {result.alternatives && result.alternatives.length > 0 && (
        <div className="mt-4">
          <div className="text-overline text-chrome-text-subtlest mb-2">Alternatives</div>
          <ul className="space-y-2">
            {result.alternatives.map((a, i) => (
              <li key={i} className="rounded-md border border-chrome-border bg-chrome-surface px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <code className="font-mono text-[12.5px] text-chrome-text font-bold break-all">{a.token}</code>
                  <code className="font-mono text-[10.5px] text-chrome-text-subtle truncate">var({a.cssVar})</code>
                </div>
                <p className="mt-0.5 text-[12px] text-chrome-text-subtle">{a.when}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
