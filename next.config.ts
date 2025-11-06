import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Skip static page generation for template
  // This allows building without environment variables
  experimental: {
    // Skip page generation errors during build
    skipTrailingSlashRedirect: true,
  },
  // eslint: {
  //   ignoreDuringBuilds: true, // This prevents ESLint errors from blocking builds
  // },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during build (useful for template)
  },
};

export default nextConfig;
