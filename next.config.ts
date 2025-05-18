/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here
// config options here
  eslint: {
    // ⛔ Ignore les erreurs ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },

  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
