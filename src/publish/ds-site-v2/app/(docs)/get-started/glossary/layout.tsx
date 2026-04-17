export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 max-w-[768px] mdx-glossary">
        <div className="text-overline text-chrome-text-subtlest mb-2">Get started</div>
        {children}
      </article>
    </div>
  )
}
