'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const GridViewIcon = () => (
  <svg
    width="16.5"
    height="16.5"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M.75 3A2.25 2.25 0 0 1 3 .75h2.25A2.25 2.25 0 0 1 7.5 3v2.25A2.25 2.25 0 0 1 5.25 7.5H3A2.25 2.25 0 0 1 .75 5.25zm0 9.75A2.25 2.25 0 0 1 3 10.5h2.25a2.25 2.25 0 0 1 2.25 2.25V15a2.25 2.25 0 0 1-2.25 2.25H3A2.25 2.25 0 0 1 .75 15zM10.5 3A2.25 2.25 0 0 1 12.75.75H15A2.25 2.25 0 0 1 17.25 3v2.25A2.25 2.25 0 0 1 15 7.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H15a2.25 2.25 0 0 1 2.25 2.25V15A2.25 2.25 0 0 1 15 17.25h-2.25A2.25 2.25 0 0 1 10.5 15z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ListViewIcon = () => (
  <svg
    width="16.5"
    height="15"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M.75 8.25h16.5M.75 12h16.5M.75 15.75h16.5M2.625.75h12.75a1.875 1.875 0 1 1 0 3.75H2.625a1.875 1.875 0 0 1 0-3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function ViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: ViewToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center w-[76px] h-9 rounded-lg border border-fd-border bg-fd-muted p-1 gap-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'flex items-center justify-center w-full h-full rounded-md cursor-pointer transition-colors',
          viewMode === 'grid'
            ? 'bg-fd-background text-fd-foreground shadow-sm'
            : 'bg-transparent text-fd-muted-foreground hover:text-fd-foreground',
        )}
        aria-label="Visualização em grade"
      >
        <GridViewIcon />
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange('list')}
        className={cn(
          'flex items-center justify-center w-full h-full rounded-md cursor-pointer transition-colors',
          viewMode === 'list'
            ? 'bg-fd-background text-fd-foreground shadow-sm'
            : 'bg-transparent text-fd-muted-foreground hover:text-fd-foreground',
        )}
        aria-label="Visualização em lista"
      >
        <ListViewIcon />
      </button>
    </div>
  );
}
