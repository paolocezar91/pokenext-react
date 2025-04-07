import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/**',
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
};

export default nextConfig;
