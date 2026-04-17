import type { MDXComponents } from 'mdx/types'
import type { ReactNode, AnchorHTMLAttributes } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-h1 text-chrome-text">{children}</h1>
    ),
    h2: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <h2 id={id} className="mt-12 scroll-mt-24 text-h2 text-chrome-text">{children}</h2>
    ),
    h3: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <h3 id={id} className="mt-8 scroll-mt-24 text-h3 text-chrome-text">{children}</h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mt-3 text-body text-chrome-text">{children}</p>
    ),
    code: ({ children }: { children?: ReactNode }) => (
      <code className="font-mono text-[12.5px] bg-chrome-surface-sunken px-1.5 py-0.5 rounded">{children}</code>
    ),
    a: ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a href={href} className="text-chrome-accent underline underline-offset-4" {...rest}>{children}</a>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mt-3 list-disc pl-6 space-y-1 text-body text-chrome-text">{children}</ul>
    ),
    dl: ({ children }: { children?: ReactNode }) => (
      <dl className="mt-6 divide-y divide-chrome-border border-y border-chrome-border">{children}</dl>
    ),
    dt: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <dt id={id} className="scroll-mt-24 pt-4 pb-1 font-mono text-[13px] font-semibold text-chrome-accent">{children}</dt>
    ),
    dd: ({ children }: { children?: ReactNode }) => (
      <dd className="pb-4 text-body text-chrome-text-subtle max-w-[62ch]">{children}</dd>
    ),
    ...components,
  }
}
