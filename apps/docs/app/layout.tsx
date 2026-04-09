import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque } from 'next/font/google';
import { TreeContextProvider } from '@xispedocs/ui/contexts/tree';
import { source } from '@/lib/source';
import { NextProvider } from '@xispedocs/core/framework/next';

export const metadata = createMetadata({
  title: {
    template: '%s | PodcastAds',
    default: 'PodcastAds - Faculdade Serra Dourada',
  },
  description:
    'O canal oficial de tecnologia e inovação dos alunos de ADS da Faculdade Serra Dourada.',
  metadataBase: baseUrl,
  verification: {
    google: 'p6Y5vf2dnChvlf2LHHO3nbhsCI7s-cudhbxb2XhMbq8',
  },
});

const geist = GeistSans;
const mono = GeistMono;

const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${mono.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.pageTree}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
