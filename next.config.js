/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Fix Netlify deployment issues
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable static optimization for all pages to prevent clientModules errors
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}

module.exports = nextConfig
