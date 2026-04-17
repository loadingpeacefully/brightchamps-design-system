'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Sidebar } from './Sidebar'

export function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--chrome-header-fg-subtle)] hover:bg-white/10 hover:text-white transition md:hidden"
          aria-label="Open navigation menu"
          type="button"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[90] bg-[rgba(10,10,30,0.45)] backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />
        <Dialog.Content
          className="fixed left-0 top-0 z-[100] flex h-full w-[min(320px,86vw)] flex-col border-r border-chrome-border bg-chrome-surface shadow-3 outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
          aria-describedby={undefined}
        >
          <div className="flex h-topbar items-center justify-between border-b border-chrome-border px-4">
            <Dialog.Title className="text-[13px] font-bold text-chrome-text">Navigation</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-chrome-text-subtle hover:bg-chrome-surface-sunken hover:text-chrome-text transition"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar variant="drawer" onNavigate={() => setOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
