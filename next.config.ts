import { locales, } from "@/i18n/config";
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
  },
  env: {
    npm_package_version: process.env.npm_package_version,
    POKEAPI_URL: process.env.POKEAPI_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 360 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1,
  }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);