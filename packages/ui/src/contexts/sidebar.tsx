'use client';
import * as React from 'react';
import {
  type ReactNode,
  type RefObject,
} from 'react';
import { createSafeContext, usePathname } from '@xispedocs/core/framework';
import { useOnChange } from '@xispedocs/core/utils/use-on-change';

interface SidebarContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * When set to false, don't close the sidebar when navigate to another page
   */
  closeOnRedirect: RefObject<boolean>;
}

const SidebarContext = createSafeContext<SidebarContext>('SidebarContext');

export function useSidebar(): SidebarContext {
  return SidebarContext.use();
}

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const closeOnRedirect = React.useRef(true);
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const pathname = usePathname();

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }
    closeOnRedirect.current = true;
  });

  return (
    <SidebarContext.Provider
      value={React.useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          closeOnRedirect,
        }),
        [open, collapsed],
      )}
    >
      {children}
    </SidebarContext.Provider>
  );
}
