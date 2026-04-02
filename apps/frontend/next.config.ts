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
      {
        protocol: 'https',
        // Dynamic hostname based on environment 
        hostname: process.env.BACKEND_HOSTNAME || 'capable-balance-production.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};


export default nextConfig;