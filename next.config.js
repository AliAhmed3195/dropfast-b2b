/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Preserve CSS imports and ensure proper CSS generation
  experimental: {
    // For Tailwind CSS 4 compatibility
  },
  // Optimize CSS output (works for both staging and production)
  swcMinify: true,
  // Ensure CSS is properly extracted and optimized
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console in production
  },
}

module.exports = nextConfig

