/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turboMode: false, // Disables Turbopack in production and forces Webpack to be used
  },
};

export default nextConfig;
