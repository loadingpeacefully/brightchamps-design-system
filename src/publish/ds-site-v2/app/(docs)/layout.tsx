import { Sidebar } from '@/components/chrome/Sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px]">
      <Sidebar />
      <main id="main-content" className="min-w-0 flex-1 px-6 py-10 lg:px-16">
        {children}
      </main>
    </div>
  )
}
