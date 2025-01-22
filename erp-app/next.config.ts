import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',  // Semua request yang menuju /api/* akan diteruskan
        destination: 'http://localhost:8080/api/:path*',  // Backend API Anda
      },
    ];
  },
};

export default nextConfig;
