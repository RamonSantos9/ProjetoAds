import '../global.old.css';
import type { ReactNode } from 'react';
import { AdminLayoutClient } from './admin-layout-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | PodcastAds',
    default: 'Admin | PodcastAds',
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
