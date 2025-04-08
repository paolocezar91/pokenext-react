import nextI18nextConfig from './next-i18next.config.js';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/pokedex',
        permanent: true,
      },
    ];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/sprites/**',
        search: '',
      },
    ],
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 360 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1,
  },
  i18n: nextI18nextConfig.i18n
};

export default nextConfig;
