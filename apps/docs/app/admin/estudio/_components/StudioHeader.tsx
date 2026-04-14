'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { ProjectPopover } from './ProjectPopover';
import { ShortcutsModal } from './ShortcutsModal';

interface StudioHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving?: boolean;
  projectTitle: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => Promise<void>;
  status?: string;
  scheduledAt?: Date | null;
  onStatusChange?: (status: string, date?: Date | null) => Promise<void>;
  onOpenShortcuts?: () => void;
  onOpenShare?: () => void;
}

export function StudioHeader({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  projectTitle,
  onTitleChange,
  status,
  scheduledAt,
  onStatusChange,
  onOpenShortcuts,
  onOpenShare,
}: StudioHeaderProps) {
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = React.useState(false);
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const toggleProjectPopover = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setIsProjectPopoverOpen(!isProjectPopoverOpen);
  };

  return (
    <div
      className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center w-full overflow-hidden relative px-2 min-w-0 border-b bg-background"
      style={{ minHeight: '48px' }}
    >
      {/* Left Section */}
      <div className="flex flex-row items-center gap-2 shrink min-w-0 overflow-hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Project options"
          onClick={toggleProjectPopover}
          className={cn(
            'relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent rounded-lg h-8 w-8 px-0 text-fd-muted-foreground hover:text-fd-foreground',
            isProjectPopoverOpen
              ? 'bg-fd-accent text-fd-foreground'
              : 'hover:bg-fd-accent',
          )}
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
          >
            <path
              d="M3 10H10.9459M3 5H17M3 15H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>

        <div className="h-3 bg-fd-border w-px rounded-full shrink-0"></div>

        <div className="flex items-center shrink-0 gap-0">
          <button
            aria-label="Undo history"
            onClick={onUndo}
            disabled={!canUndo}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-transparent text-fd-foreground hover:bg-fd-accent disabled:text-gray-400 disabled:hover:bg-transparent rounded-[10px] p-0 h-9 w-9"
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="shrink-0 w-[18px] h-[18px]"
            >
              <path
                d="M5.82368 4L3.58463 6.44021L2.75 7.32075M2.75 7.32075L5.82368 10.6415M2.75 7.32075H13.7269C15.6726 7.32075 17.25 9.03983 17.25 11.1604C17.25 13.2809 15.6726 15 13.7269 15H10.0133"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>

          <button
            aria-label="Redo history"
            onClick={onRedo}
            disabled={!canRedo}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-transparent text-fd-foreground hover:bg-fd-accent disabled:text-gray-400 disabled:hover:bg-transparent rounded-[10px] p-0 h-9 w-9"
          >
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
              className="shrink-0 w-[18px] h-[18px]"
            >
              <path
                d="M14.1763 4L16.4154 6.44021L17.25 7.32075M17.25 7.32075L14.1763 10.6415M17.25 7.32075H6.27313C4.32739 7.32075 2.75003 9.03983 2.75003 11.1604C2.75003 13.2809 4.32739 15 6.27313 15H9.98667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center justify-center min-w-0 px-1">
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative block w-fit text-sm font-medium min-w-0 md:max-w-[32ch] max-w-[18ch]">
            <button className="relative group/btn block w-full select-text cursor-text focus:outline-none">
              <div className="absolute -inset-y-1 -inset-x-2 h-auto w-auto rounded-lg transition-colors duration-200 bg-transparent group-hover/btn:bg-fd-accent group-focus-visible/btn:ring-[1.5px] ring-fd-primary"></div>
              <span className="relative block w-full whitespace-pre truncate">
                {projectTitle || 'Untitled project'}
              </span>
            </button>
          </div>
          {isSaving && (
            <span className="text-[10px] text-fd-muted-foreground animate-pulse leading-none">
              Saving...
            </span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-1.5 shrink-0 overflow-hidden justify-end">
        {/* Credits Status - HIDDEN ON MOBILE */}
        <div className="hidden md:flex gap-1.5 items-center cursor-default overflow-hidden">
          <div className="flex relative size-5">
            <div
              className="absolute [transform:rotate(18deg)] w-full h-full"
              role="progressbar"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-fd-accent"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDashoffset="66"
                  strokeDasharray="34.32 229.68"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-fd-primary"
                ></circle>
              </svg>
            </div>
            <div
              className="!absolute left-0 top-0 [transform:rotateY(180deg)] w-full h-full"
              role="progressbar"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-fd-accent/30"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDashoffset="66"
                  strokeDasharray="203.28 60.72"
                  stroke="currentColor"
                  fill="transparent"
                  className="text-fd-primary/50"
                ></circle>
              </svg>
            </div>
          </div>
          <p className="text-[11px] text-fd-muted-foreground font-medium truncate">
            8,226 credits remaining
          </p>
        </div>

        <button
          aria-label="Open comments"
          className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent text-fd-foreground hover:bg-fd-accent rounded-lg p-0 h-8 w-8"
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="currentColor"
            className="shrink-0 w-4 h-4"
          >
            <path
              d="M13.1515 7.03045H6.84848M13.1515 10.8632H6.84848M7.37621 16.1175L9.37872 17.7762C9.73741 18.0733 10.2598 18.0747 10.6203 17.7796L12.655 16.1139C12.8289 15.9715 13.0478 15.8936 13.2736 15.8936H15.0909C16.6976 15.8936 18 14.6067 18 13.0191V4.87455C18 3.28698 16.6976 2 15.0909 2H4.90909C3.30245 2 2 3.28698 2 4.87455V13.0191C2 14.6067 3.30245 15.8936 4.90909 15.8936H6.75328C6.98109 15.8936 7.20163 15.9729 7.37621 16.1175Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>

        <button 
          onClick={onOpenShare}
          className="hidden sm:inline-flex relative items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent text-fd-foreground hover:bg-fd-accent h-8 px-2.5 rounded-lg text-xs"
        >
          Share
        </button>

        <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-fd-primary text-white shadow-none hover:opacity-90 h-8 px-2.5 rounded-lg text-xs">
          Export
        </button>
      </div>

      <ProjectPopover
        isOpen={isProjectPopoverOpen}
        onClose={() => setIsProjectPopoverOpen(false)}
        onOpenShortcuts={onOpenShortcuts || (() => {})}
        triggerRect={triggerRect}
      />
    </div>
  );
}
