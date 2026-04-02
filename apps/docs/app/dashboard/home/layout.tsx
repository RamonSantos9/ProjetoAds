import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'PodcastAds',
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
