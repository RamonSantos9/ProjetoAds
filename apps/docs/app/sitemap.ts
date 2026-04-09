import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/metadata';
import { source } from '@/lib/source';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string => new URL(path, baseUrl).toString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: url('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/episodios'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: url('/privacidade'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: url('/termos'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const docsPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: url(page.url),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...docsPages];
}
