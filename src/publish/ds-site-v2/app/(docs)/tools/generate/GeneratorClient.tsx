'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, AlertTriangle, Code, Eye, Settings } from 'lucide-react'
import { componentSpecs } from '@/lib/componentSpecs'

const COMPONENT_TYPES = ['Card', 'Button', 'List item', 'Banner', 'Navigation', 'Form', 'Modal', 'Page section'] as const
const SURFACES = ['Student dashboard', 'Teacher dashboard', 'Landing page', 'Email'] as const
const OUTPUT_FORMATS = ['React (TSX)', 'HTML + CSS', 'CSS variables only'] as const

type ComponentType = typeof COMPONENT_TYPES[number]
type Surface = typeof SURFACES[number]
type OutputFormat = typeof OUTPUT_FORMATS[number]

const EXAMPLE_PROMPTS = [
  "A lesson progress card showing 60% completion, course name 'Introduction to Python', and a Continue button",
  'A primary CTA button with loading and disabled states using brand purple',
  'A navigation item showing active lesson with icon, title, and completion badge',
] as const

const SYSTEM_PROMPT = `You are a BrightChamps UI component generator.
You generate on-brand React components using BrightChamps design tokens.

BRAND GUIDELINES:
- Primary color: #4e3bc2 (var(--color-brand-primary))
- Font: Nunito (var(--font-family-primary))
- Border radius default: 8px (var(--radius-md))
- Spacing base: 4px scale

AVAILABLE TOKENS (use these CSS variables):
Colors:
--color-brand-primary: #4e3bc2
--color-primary-50: #FAF5FF
--color-primary-500: #6651e4
--color-neutral-50: #F9FAFB
--color-neutral-200: #E7E7E7
--color-neutral-600: #3d4d5d
--color-neutral-900: #0D1D2D
--color-success-500: #00B67A
--color-warning-500: #FF7C35
--color-error-500: #FF5C5C
--color-info-500: #33CCFF

Typography:
--font-family-primary: 'Nunito', sans-serif
--font-heading-xl: 56px / 800
--font-heading-lg: 40px / 700
--font-heading-md: 32px / 700
--font-heading-sm: 24px / 600
--font-body-lg: 18px / 400
--font-body-md: 16px / 400
--font-body-sm: 14px / 400
--font-label-md: 14px / 600

Spacing:
--spacing-1: 4px  --spacing-2: 8px
--spacing-3: 12px --spacing-4: 16px
--spacing-5: 20px --spacing-6: 24px
--spacing-8: 32px

Radius:
--radius-sm: 6px  --radius-md: 8px
--radius-lg: 10px --radius-xl: 14px
--radius-full: 100px

COMPONENT PATTERNS (use these as reference):
${JSON.stringify(componentSpecs, null, 2)}

RULES:
- Always use CSS variables, never hardcode hex values
- Use Nunito font family
- Keep components self-contained (no external imports)
- For React: use inline styles with CSS variables
- For HTML: include a <style> block with CSS variables
- Add aria attributes for accessibility
- Output ONLY the component code, no explanation
- Make it production-ready, not a mockup`

interface GenerateState {
  loading: boolean
  output: string
  error: string | null
  language: 'tsx' | 'html'
}

const API_KEY_STORAGE = 'bc-ds-anthropic-key'

export function GeneratorClient() {
  const [prompt, setPrompt] = useState('')
  const [componentType, setComponentType] = useState<ComponentType>('Card')
  const [surface, setSurface] = useState<Surface>('Student dashboard')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('React (TSX)')
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(API_KEY_STORAGE) ?? ''
  })
  const [keyDraft, setKeyDraft] = useState('')
  const [keySaved, setKeySaved] = useState(false)
  const [state, setState] = useState<GenerateState>({
    loading: false,
    output: '',
    error: null,
    language: 'tsx',
  })

  const openKeyPanel = (): void => {
    setKeyDraft(apiKey)
    setShowKeyInput(s => !s)
    setKeySaved(false)
  }

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

  const generate = async (overridePrompt?: string): Promise<void> => {
    const userPrompt = (overridePrompt ?? prompt).trim()
    if (!userPrompt) {
      setState(s => ({ ...s, error: 'Describe what you want to build first.' }))
      return
    }
    if (!apiKey) {
      setKeyDraft('')
      setShowKeyInput(true)
      setState(s => ({ ...s, error: 'Anthropic API key required to generate. Click the gear icon to set it.' }))
      return
    }

    setState({ loading: true, output: '', error: null, language: outputFormat === 'React (TSX)' ? 'tsx' : 'html' })

    try {
      const userMessage = `Generate a ${componentType} for ${surface}: ${userPrompt}\nOutput format: ${outputFormat}`

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
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text.slice(0, 200)}`)
      }

      const data = await res.json() as { content?: { type: string; text: string }[] }
      const text = (data.content ?? []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim()
      // Strip code fences if the model wrapped output
      const stripped = text
        .replace(/^```(?:tsx|jsx|javascript|html|css)?\n?/i, '')
        .replace(/\n?```\s*$/, '')

      setState(s => ({ ...s, loading: false, output: stripped }))
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Generation failed. Try a simpler prompt.' }))
    }
  }

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(state.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const usePrompt = (p: string): void => {
    setPrompt(p)
    void generate(p)
  }

  // Build the iframe srcdoc — wrap React/TSX in a minimal renderer if needed.
  // For HTML output, render directly. For React, render with a stripped preview.
  const previewSrcDoc = (() => {
    if (!state.output) return ''
    const isHtml = state.language === 'html' || /^<!doctype|^<html|^<style/i.test(state.output)
    const tokens = `
:root {
  --color-brand-primary: #4e3bc2;
  --color-primary-50: #FAF5FF;
  --color-primary-500: #6651e4;
  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #ffffff;
  --color-neutral-200: #E7E7E7;
  --color-neutral-600: #3d4d5d;
  --color-neutral-900: #0D1D2D;
  --color-neutral-1400: #212121;
  --color-success-500: #00B67A;
  --color-warning-500: #FF7C35;
  --color-error-500: #FF5C5C;
  --color-info-500: #33CCFF;
  --font-family-primary: 'Nunito', sans-serif;
  --spacing-1: 4px; --spacing-2: 8px; --spacing-3: 12px;
  --spacing-4: 16px; --spacing-5: 20px; --spacing-6: 24px; --spacing-8: 32px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px;
  --radius-sm: 6px; --radius-md: 8px; --radius-lg: 10px; --radius-xl: 14px; --radius-full: 100px;
}
body { margin: 0; padding: 16px; font-family: var(--font-family-primary); background: #fff; color: var(--color-neutral-1400); }
`
    if (isHtml) {
      return `<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"><style>${tokens}</style></head><body>${state.output}</body></html>`
    }
    // React/TSX: render via Babel + ReactDOM in the iframe
    return `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap">
<style>${tokens}</style>
</head><body>
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel" data-presets="react,typescript">
${state.output}

const __findExport = () => {
  if (typeof Component !== 'undefined') return Component;
  // Fall back: find first capitalized identifier that's a function
  return null;
};
const Comp = __findExport();
if (Comp) {
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Comp));
} else {
  document.getElementById('root').innerHTML = '<pre style="color:#a31836;font-size:12px">Could not auto-detect export. Switch to Code tab to view.</pre>';
}
</script>
</body></html>`
  })()

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      {/* ─── LEFT: input controls ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-h2 text-chrome-text">Generate a component</h2>
            <p className="mt-2 text-body-s text-chrome-text-subtle">
              Describe what you need. The generator returns production-ready code wired to BrightChamps tokens.
            </p>
          </div>
          <button
            type="button"
            onClick={openKeyPanel}
            aria-label="Settings — Anthropic API key"
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
                Key stored locally. Never sent to any server except api.anthropic.com.
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
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={6}
          placeholder="Describe what you want to build. Example: a lesson progress card showing a student's completion rate, course name, and a continue button"
          className="mt-4 w-full rounded-md border border-chrome-border bg-chrome-surface p-3 text-[13px] text-chrome-text placeholder:text-chrome-text-subtlest outline-none focus:border-chrome-accent resize-none font-sans"
        />

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="text-overline text-chrome-text-subtlest mb-1 block">Component type</span>
            <select value={componentType} onChange={e => setComponentType(e.target.value as ComponentType)}
              className="w-full rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
              {COMPONENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-overline text-chrome-text-subtlest mb-1 block">Surface</span>
            <select value={surface} onChange={e => setSurface(e.target.value as Surface)}
              className="w-full rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
              {SURFACES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-overline text-chrome-text-subtlest mb-1 block">Output format</span>
            <select value={outputFormat} onChange={e => setOutputFormat(e.target.value as OutputFormat)}
              className="w-full rounded-md border border-chrome-border bg-chrome-surface px-2 py-2 text-[13px] text-chrome-text outline-none focus:border-chrome-accent">
              {OUTPUT_FORMATS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => void generate()}
          disabled={state.loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'var(--brand-primary)' }}
        >
          <Sparkles size={14} strokeWidth={2.25} />
          {state.loading ? 'Generating…' : 'Generate'}
        </button>
        <p className="mt-2 text-[11px] text-chrome-text-subtlest text-center">
          Beta — uses BrightChamps design tokens. Output quality varies. Verify against production before shipping.
        </p>
      </section>

      {/* ─── RIGHT: output ────────────────────────────────────────────────── */}
      <section className="rounded-card border border-chrome-border bg-chrome-surface-raised overflow-hidden">
        <div className="flex items-center justify-between border-b border-chrome-border bg-chrome-surface-sunken px-3 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition ' +
                (tab === 'preview' ? 'bg-chrome-surface text-chrome-text' : 'text-chrome-text-subtle hover:text-chrome-text')}
            >
              <Eye size={12} /> Preview
            </button>
            <button
              type="button"
              onClick={() => setTab('code')}
              className={'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-semibold transition ' +
                (tab === 'code' ? 'bg-chrome-surface text-chrome-text' : 'text-chrome-text-subtle hover:text-chrome-text')}
            >
              <Code size={12} /> Code
            </button>
          </div>
          {state.output && (
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-[4px] bg-chrome-accent-subtle px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] text-chrome-accent">
                {state.language.toUpperCase()}
              </span>
              {tab === 'code' && (
                <button onClick={() => void copy()} className="inline-flex items-center gap-1 rounded-md border border-chrome-border-bold bg-chrome-surface px-2 py-1 text-[11px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition">
                  {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="min-h-[480px]">
          {state.loading ? (
            <div className="flex h-[480px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-chrome-border border-t-chrome-accent" />
                <p className="text-body-s text-chrome-text-subtle">Generating on-brand component…</p>
              </div>
            </div>
          ) : state.error ? (
            <div className="m-5 rounded-md border-l-4 border-l-red-500 border border-chrome-border bg-[rgba(240,41,77,0.05)] p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-500" />
                <div>
                  <p className="text-[13px] font-semibold text-[#a31836]">Generation failed</p>
                  <p className="mt-1 text-[12px] text-chrome-text">{state.error}</p>
                  <p className="mt-2 text-[11px] text-chrome-text-subtlest">Try a simpler prompt or check your API key.</p>
                </div>
              </div>
            </div>
          ) : !state.output ? (
            <div className="flex h-[480px] flex-col items-center justify-center p-6">
              <p className="text-overline text-chrome-text-subtlest mb-3">Try one of these</p>
              <div className="grid gap-2 w-full max-w-[420px]">
                {EXAMPLE_PROMPTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => usePrompt(p)}
                    className="rounded-md border border-chrome-border bg-chrome-surface px-3 py-2.5 text-left text-[13px] text-chrome-text hover:border-chrome-accent hover:bg-chrome-accent-subtle transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-[11px] text-chrome-text-subtlest text-center max-w-[360px]">
                Each example fills the textarea and runs Generate. The output panel switches to Preview when ready.
              </p>
            </div>
          ) : tab === 'preview' ? (
            <iframe
              key={state.output}
              srcDoc={previewSrcDoc}
              sandbox="allow-scripts"
              className="h-[480px] w-full border-0 bg-white"
              title="Component preview"
            />
          ) : (
            <pre className="m-0 h-[480px] overflow-auto bg-chrome-surface-sunken p-4 font-mono text-[12px] leading-relaxed text-chrome-text whitespace-pre">
              {state.output}
            </pre>
          )}
        </div>
      </section>
    </div>
  )
}
