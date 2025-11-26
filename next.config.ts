import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  allowedDevOrigins: [
    '*.replit.dev',
    '*.pike.replit.dev',
  ],
};

export default nextConfig;
