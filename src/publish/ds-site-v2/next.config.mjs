import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_REPOSITORY && process.env.GITHUB_ACTIONS
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
  : ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
