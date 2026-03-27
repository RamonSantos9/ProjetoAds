import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Bricolage_Grotesque } from 'next/font/google';
import { NextProvider } from '@xispedocs/core/framework/next';

export const metadata = createMetadata({
  title: {
    template: '%s | Podcast ADS',
    default: 'Podcast ADS',
  },
  description: 'Podcast ADS',
  metadataBase: baseUrl,
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
          <Provider>{children}</Provider>
        </NextProvider>
      </Body>
    </html>
  );
}
