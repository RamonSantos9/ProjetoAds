import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@xispedocs/mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@xispedocs/core', '@xispedocs/ui'],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  experimental: {
    cpus: 4,
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
