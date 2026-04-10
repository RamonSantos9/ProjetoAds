'use client';
import '../global.old.css';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@xispedocs/ui/contexts/sidebar';
import { PodcastSidebar } from '@/app/(home)/_components/podcast-dashboard/PodcastSidebar';
import { PodcastHeader } from '@/app/(home)/_components/podcast-dashboard/PodcastHeader';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

function GridLayout({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [isOnboardingChecked, setIsOnboardingChecked] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('pca_onboarding_completed');
    if (!hasCompletedOnboarding && !pathname.startsWith('/onboarding')) {
      router.push('/onboarding');
    } else {
      setIsOnboardingChecked(true);
    }
  }, [pathname, router]);

  // Only strip sidebar/header for the project editors (has an ID segment after /estudio/ or /transcricoes/)
  const isEditorMode = /^\/admin\/(estudio|transcricoes)\/[^/]+/.test(pathname);

  if (!isOnboardingChecked) return null;

  if (isEditorMode) {
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
      style={
        {
          '--fd-sidebar-width': '16rem',
          gridTemplate:
            '"sidebar main" 1fr / var(--fd-sidebar-col, 0px) minmax(0, 1fr)',
        } as CSSProperties
      }
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
      <Toaster richColors position="bottom-right" />
      <GridLayout>{children}</GridLayout>
    </SidebarProvider>
  );
}
