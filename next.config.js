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
        source: '/login',
        destination: '/login',
        permanent: true,
        basePath: false,
      },
    ];
  },
};

module.exports = nextConfig;