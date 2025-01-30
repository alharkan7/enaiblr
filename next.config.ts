import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  /* config options here */
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.enaiblr.org',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; manifest-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net https://*; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*; font-src 'self' data:; worker-src 'self' blob: https://*.enaiblr.org; frame-src 'self';"
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          }
        ],
      },
    ];
  },
  // Set a reasonable timeout for static generation
  staticPageGenerationTimeout: 120,
  generateEtags: false
};

export default nextConfig;