/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    removeConsole: false, // Keep console for debugging
  },
}

export default nextConfig

