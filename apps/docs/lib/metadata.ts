import type { Metadata } from 'next/types';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://podcastads.vercel.app',
      images: '/banner.png',
      siteName: 'PodcastADS',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@money_is_shark',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      types: {
        'application/rss+xml': [
          {
            title: 'PodcastADS Blog',
            url: 'https://podcastads.vercel.app/blog/rss.xml',
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://podcastads.vercel.app');
