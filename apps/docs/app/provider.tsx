'use client';

import { RootProvider } from '@xispedocs/ui/provider/base';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioProvider } from '@/lib/audio-context';
import { PodcastAudioPlayer } from '@/app/(home)/_components/podcast-dashboard/PodcastAudioPlayer';
import { SidebarProvider } from '@xispedocs/ui/contexts/sidebar';
import { Toaster } from 'sonner';

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
            <Toaster
              position="bottom-right"
              theme="dark"
              visibleToasts={1}
              toastOptions={{
                className:
                  'group toast group-[.toaster]:bg-gray-alpha-950 group-[.toaster]:text-background group-[.toaster]:border-subtle group-[.toaster]:shadow-lg font-sans',
                style: {
                  '--width': '356px',
                  '--offset': '32px',
                  '--gap': '14px',
                } as React.CSSProperties,
              }}
              icons={{
                success: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    height="20"
                    width="20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ),
              }}
            />
            <PodcastAudioPlayer />
          </AudioProvider>
        </SidebarProvider>
      </TooltipProvider>
    </RootProvider>
  );
}
