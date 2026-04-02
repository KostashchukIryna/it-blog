// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Дозволяємо Unsplash
        port: '',
        pathname: '/**', // Дозволяємо всі шляхи на цьому домені
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // The BACKEND_URL is set in docker-compose for production, 
        // and in .env.local for local development
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;