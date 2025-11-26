import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '*.replit.dev',
    '*.replit.app',
    '*.pike.replit.dev',
    '*.worf.replit.dev',
    '*.picard.replit.dev',
    '*.janeway.replit.dev',
    '*.riker.replit.dev',
    '*.spock.replit.dev',
    '*.kirk.replit.dev',
  ],
};

export default nextConfig;
