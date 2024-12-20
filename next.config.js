/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: 'https://access.enaiblr.org/login',
        destination: 'https://access.enaiblr.org/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;