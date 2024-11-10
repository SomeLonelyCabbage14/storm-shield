/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/owner',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;