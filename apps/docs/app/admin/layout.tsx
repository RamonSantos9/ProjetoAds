'use client';
import '../global.old.css';
import type { CSSProperties, ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@xispedocs/ui/contexts/sidebar';
import { PodcastSidebar } from '@/app/(home)/_components/podcast-dashboard/PodcastSidebar';
import { PodcastHeader } from '@/app/(home)/_components/podcast-dashboard/PodcastHeader';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

function GridLayout({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  // Only strip sidebar/header for the project editor (has an ID segment after /estudio/)
  const isStudio = /^\/admin\/estudio\/.+/.test(pathname);

  if (isStudio) {
    return (
      <main className="relative flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-[#121212]">
        {children}
      </main>
    );
  }
  
  return (
    <div 
      data-sidebar-collapsed={collapsed}
      className="grid min-h-screen overflow-x-clip bg-[#FFFFFF] dark:bg-[#121212] text-fd-foreground transition-[grid-template-columns] duration-300 ease-in-out"
      style={{
        '--fd-sidebar-width': '16rem',
        gridTemplate: '"sidebar main" 1fr / var(--fd-sidebar-col, 0px) minmax(0, 1fr)',
      } as CSSProperties}
    >
      <PodcastSidebar />
      <PodcastHeader />
      <main className="[grid-area:main] relative z-10 flex min-h-screen min-w-0 flex-col bg-[#FFFFFF] dark:bg-fd-background pt-[var(--podcastads-header-height)] max-[1023px]:pt-[calc(var(--podcastads-header-height)+var(--podcastads-banner-height)+var(--podcastads-mobile-tabs-height))]">
        {children}
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <GridLayout>{children}</GridLayout>
      <Toaster 
        position="bottom-right" 
        theme="dark"
        visibleToasts={1}
        toastOptions={{
          className: "group toast group-[.toaster]:bg-gray-alpha-950 group-[.toaster]:text-background group-[.toaster]:border-subtle group-[.toaster]:shadow-lg font-sans",
          style: {
            '--width': '356px',
            '--offset': '32px',
            '--gap': '14px',
          } as React.CSSProperties
        }}
        icons={{
          success: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"></path>
            </svg>
          ),
        }}
      />
    </SidebarProvider>
  );
}
