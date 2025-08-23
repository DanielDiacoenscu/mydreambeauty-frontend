/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',  // Or 'http' if local dev
        hostname: 'api.mydreambeauty.net',  // Your Strapi domain
        port: '',  // Leave empty unless using a custom port
        pathname: '/**',  // Allow all paths (e.g., /uploads/*)
      },
    ],
    unoptimized: true,  // Add this: Disables optimizer to stop 400s for invalid srcs
  },
};

module.exports = nextConfig;
