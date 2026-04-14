'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface TranscriptionEditorToolbarProps {
  onGenerate?: () => void;
  onInsertBreak?: () => void;
  onLockParagraphs?: () => void;
  onOpenPronunciations?: () => void;
  isGenerating?: boolean;
  isLocked?: boolean;
}

export function TranscriptionEditorToolbar({
  onGenerate,
  onInsertBreak,
  onLockParagraphs,
  onOpenPronunciations,
  isGenerating,
  isLocked
}: TranscriptionEditorToolbarProps) {
  return (
    <div className="flex items-center sticky top-0 overflow-auto gap-1 justify-center backdrop-blur w-full text-foreground user-select-none z-10 shrink-0 bg-white/80 dark:bg-fd-background/80 border-b border-[#E2E7F1] dark:border-[#2A2A38]" style={{ height: '48px' }}>
      {!isLocked && (
        <>
          <button 
            type="button" 
            onClick={onGenerate}
            disabled={isGenerating}
            className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:opacity-50 h-8 px-2.5 rounded-lg text-xm min-w-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("shrink-0 w-4 h-4 -ml-[3px] mr-[5px]", isGenerating && "animate-spin")}>
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            <span className="truncate">Generate</span>
          </button>

          <div className="h-4 border-r border-gray-alpha-200"></div>
        </>
      )}

      <button 
        aria-label={isLocked ? 'Bloqueado (Somente Leitura)' : 'Bloquear parágrafos'}
        type="button" 
        onClick={isLocked ? undefined : onLockParagraphs}
        disabled={isLocked}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto rounded-[10px] center p-0 h-9 w-9",
          isLocked
            ? "bg-foreground/5 text-foreground/40 cursor-default"
            : (onLockParagraphs ? "bg-transparent text-foreground hover:bg-gray-alpha-100" : "bg-foreground/10 text-foreground")
        )}
      >
        {isLocked ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock shrink-0 w-[18px] h-[18px]">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-open shrink-0 w-[18px] h-[18px]">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
