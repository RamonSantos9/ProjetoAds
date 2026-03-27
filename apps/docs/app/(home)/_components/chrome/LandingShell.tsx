import type { ReactNode } from 'react';
import { HomeLayout } from '@xispedocs/ui/layouts/home';
import {
  LandingFooter,
  LandingHeader,
  LandingLogo,
  landingLinks,
} from './LandingChrome';

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      links={landingLinks}
      style={
        {
          '--spacing-fd-container': '1120px',
        } as object
      }
      searchToggle={{
        enabled: false,
      }}
      themeSwitch={{
        enabled: false,
      }}
      nav={{
        title: <LandingLogo />,
        transparentMode: 'top',
        component: <LandingHeader />,
      }}
      className="min-h-screen bg-fd-background text-fd-foreground dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
    >
      {children}
      <LandingFooter />
    </HomeLayout>
  );
}
