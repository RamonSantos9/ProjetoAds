'use client';

import { RootProvider } from '@xispedocs/ui/provider/base';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioProvider } from '@/lib/audio-context';
import { PodcastAudioPlayer } from '@/app/(home)/_components/podcast-dashboard/PodcastAudioPlayer';
import { SidebarProvider } from '@xispedocs/ui/contexts/sidebar';

const SearchDialog = dynamic(() => import('@/components/search'), {
  ssr: false,
});

const inject = `
const urlParams = new URLSearchParams(window.location.search);
const uwuParam = urlParams.get("uwu");

if (typeof uwuParam === 'string') {
    localStorage.setItem('uwu', uwuParam);
}

const item = localStorage.getItem('uwu')

if (item === 'true') {
    document.documentElement.classList.add("uwu")
}
`;

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        defaultTheme: 'light',
        enableSystem: false,
      }}
    >
      <TooltipProvider>
        <SidebarProvider>
          <AudioProvider>
            <script
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: inject }}
            />
            {children}
            <PodcastAudioPlayer />
          </AudioProvider>
        </SidebarProvider>
      </TooltipProvider>
    </RootProvider>
  );
}
