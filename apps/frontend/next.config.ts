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
    ],
  },
};

export default nextConfig;