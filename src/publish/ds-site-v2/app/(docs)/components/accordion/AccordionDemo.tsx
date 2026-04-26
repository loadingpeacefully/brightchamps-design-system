'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function AccordionDemo({ initiallyOpen = false, hover = false, disabled = false, title = 'Lesson 3 — Variables' }: {
  initiallyOpen?: boolean
  hover?: boolean
  disabled?: boolean
  title?: string
}) {
  const [open, setOpen] = useState(initiallyOpen)
  const isOpen = open || initiallyOpen
  const bg = isOpen ? '#e7e7e7' : hover ? '#e7e7e7' : '#ffffff'
  return (
    <div
      className={`w-full rounded-md border transition-colors ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
      style={{ borderColor: '#e7e7e7' }}
    >
      <button
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left transition-colors"
        style={{ background: bg }}
      >
        <span className="text-[14px] font-semibold" style={{ color: '#212121' }}>{title}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          style={{ color: '#3d4d5d', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms' }}
        />
      </button>
      {isOpen && (
        <div className="border-t px-4 py-4 text-[13px] leading-relaxed" style={{ borderColor: '#e7e7e7', color: '#3d4d5d' }}>
          A variable is a named container for a value. You assign a value once, then reuse it everywhere by its name.
        </div>
      )}
    </div>
  )
}
