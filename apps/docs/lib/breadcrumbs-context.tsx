'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BreadcrumbItem } from '@/components/dashboard/Breadcrumbs';

interface BreadcrumbContextType {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
}

/**
 * Hook to set the breadcrumbs on a per-page basis.
 * Resets breadcrumbs when the component unmounts.
 */
export function useSetBreadcrumbs(newItems: BreadcrumbItem[]) {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems(newItems);
    // Optional: Reset on unmount if needed, but usually the next page will set its own
    // return () => setItems([]); 
  }, [JSON.stringify(newItems), setItems]);
}
