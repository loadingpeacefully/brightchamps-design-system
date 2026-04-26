'use client'

import { useState } from 'react'
import { Check, Copy, FileJson, FileCode } from 'lucide-react'

export function BulkExport({ cssContent, jsonContent, label }: {
  cssContent: string
  jsonContent: string
  label: string
}) {
  const [copiedCss, setCopiedCss] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)

  const copy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true)
      setTimeout(() => setter(false), 1500)
    }).catch(() => {})
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => copy(cssContent, setCopiedCss)}
        className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border-bold bg-chrome-surface px-3 py-1.5 text-[12px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition"
      >
        {copiedCss
          ? <><Check size={13} strokeWidth={2.5} /> Copied {label} CSS</>
          : <><FileCode size={13} strokeWidth={1.75} /> Copy all CSS</>}
      </button>
      <button
        type="button"
        onClick={() => copy(jsonContent, setCopiedJson)}
        className="inline-flex items-center gap-1.5 rounded-md border border-chrome-border-bold bg-chrome-surface px-3 py-1.5 text-[12px] font-semibold text-chrome-text-subtle hover:bg-chrome-accent hover:text-white hover:border-chrome-accent transition"
      >
        {copiedJson
          ? <><Check size={13} strokeWidth={2.5} /> Copied {label} JSON</>
          : <><FileJson size={13} strokeWidth={1.75} /> Copy all JSON</>}
      </button>
    </div>
  )
}
