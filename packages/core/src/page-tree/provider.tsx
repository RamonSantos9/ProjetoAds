'use client';
import type { ReactNode } from 'react';
import type { Root } from './definitions';
import { createSafeContext } from '../framework';

export interface TreeContextType {
  tree: Root;
}

export const TreeContext = createSafeContext<TreeContextType>('TreeContext');

export function TreeProvider({
  tree,
  children,
}: {
  tree: Root;
  children: ReactNode;
}) {
  return (
    <TreeContext.Provider value={{ tree }}>
      {children}
    </TreeContext.Provider>
  );
}
