'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface TranscriptionEditorToolbarProps {
  onGenerate?: () => void;
  onInsertBreak?: () => void;
  onLockParagraphs?: () => void;
  onOpenPronunciations?: () => void;
  isGenerating?: boolean;
}

export function TranscriptionEditorToolbar({
  onGenerate,
  onInsertBreak,
  onLockParagraphs,
  onOpenPronunciations,
  isGenerating
}: TranscriptionEditorToolbarProps) {
  return (
    <div className="flex items-center sticky top-0 overflow-auto gap-1 justify-center backdrop-blur w-full text-foreground user-select-none z-10 shrink-0 bg-background-alt/90 dark:bg-background/90" style={{ height: '48px' }}>
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

      <button 
        aria-label="Insert break" 
        type="button" 
        onClick={onInsertBreak}
        className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 rounded-[10px] center p-0 h-9 w-9 shrink-0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-[18px] h-[18px]">
          <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M10 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M14 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M16.5 5H21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M19 2.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </button>

      <button 
        aria-label="Lock paragraph" 
        type="button" 
        onClick={onLockParagraphs}
        className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 rounded-[10px] center p-0 h-9 w-9"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-open shrink-0 w-[18px] h-[18px]">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
        </svg>
      </button>

      <div className="h-4 border-r border-gray-alpha-200"></div>

      <button 
        aria-label="Open pronunciations editor" 
        type="button" 
        onClick={onOpenPronunciations}
        className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 rounded-[10px] center p-0 h-9 w-9"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-audio shrink-0 w-[18px] h-[18px]">
          <path d="M12 6v7"></path>
          <path d="M16 8v3"></path>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
          <path d="M8 8v3"></path>
        </svg>
      </button>
    </div>
  );
}
