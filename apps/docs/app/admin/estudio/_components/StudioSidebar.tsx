'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { FilesPanel } from './FilesPanel';
import { UploadedFile } from '@/lib/db';
import { CaptionsPanel } from './CaptionsPanel';

const PANEL_MIN = 280;
const PANEL_MAX = 600;
const PANEL_DEFAULT = 405;

interface SidebarTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SIDEBAR_TABS: SidebarTab[] = [
  {
    id: 'video',
    label: 'Video',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
      >
        <path
          d="M2 6.48276C2 5.11157 3.18197 4 4.64 4H10.36C11.8181 4 13 5.11157 13 6.48276V13.5172C13 14.8885 11.8181 16 10.36 16H4.64C3.18197 16 2 14.8885 2 13.5172V6.48276Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M15.7283 6.36305L13 8V12L15.7283 13.637C16.728 14.2368 18 13.5167 18 12.3507V7.64929C18 6.48334 16.728 5.76317 15.7283 6.36305Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: 'speech',
    label: 'Speech',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
      >
        <path
          d="M16.2439 3.125C18.1965 5.07762 18.1965 8.24345 16.2439 10.1961M13.8868 5.48202C14.5377 6.1329 14.5377 7.18817 13.8868 7.83905"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.6297 14.3522C7.39353 14.3522 8.15735 13.9694 8.49936 13.3182H8.53357V13.6324C8.56777 14.1237 8.88128 14.375 9.33159 14.375C9.80471 14.375 10.141 14.0894 10.141 13.5353V10.045C10.141 8.81116 9.12069 8 7.55313 8C6.28769 8 5.30725 8.45128 5.02224 9.18246C4.96524 9.30813 4.93674 9.42809 4.93674 9.55948C4.93674 9.93649 5.22745 10.1993 5.63216 10.1993C5.90007 10.1993 6.11098 10.0964 6.29339 9.89079C6.6639 9.41095 6.97171 9.2453 7.47903 9.2453C8.10605 9.2453 8.50507 9.57661 8.50507 10.1479V10.5534L6.96601 10.6448C5.43836 10.7362 4.58333 11.3817 4.58333 12.4956C4.58333 13.5981 5.46686 14.3522 6.6297 14.3522ZM7.17692 13.1468C6.6183 13.1468 6.24209 12.8612 6.24209 12.4042C6.24209 11.9701 6.5955 11.6902 7.21682 11.6445L8.50507 11.5645V12.0101C8.50507 12.6727 7.90654 13.1468 7.17692 13.1468Z"
          fill="currentColor"
        />
        <path
          d="M10 3.33333H5C3.61929 3.33333 2.5 4.45262 2.5 5.83333V14.1667C2.5 15.5474 3.61929 16.6667 5 16.6667H15C16.3807 16.6667 17.5 15.5474 17.5 14.1667V13.3333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'sfx',
    label: 'SFX',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
      >
        <path
          d="M9.99984 2.29166L10.8007 3.84616C11.36 4.93178 12.6218 5.45443 13.7849 5.08227L15.4504 4.54938L14.9176 6.21488C14.5454 7.37802 15.0681 8.63983 16.1537 9.19916L17.7082 10L16.4892 10.628C15.2642 11.2592 14.7808 12.7627 15.4087 13.9894L16.8968 16.8969L13.9893 15.4088C12.7625 14.781 11.259 15.2643 10.6278 16.4893L9.99984 17.7083L9.199 16.1538C8.63967 15.0682 7.37786 14.5456 6.21472 14.9177L4.54922 15.4506L5.08211 13.7851C5.45427 12.622 4.93162 11.3602 3.846 10.8008L2.2915 10L3.51048 9.372C4.73554 8.74083 5.21882 7.23736 4.59097 6.01061L3.1029 3.10306L6.01045 4.59113C7.2372 5.21898 8.74067 4.7357 9.37184 3.51064L9.99984 2.29166Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'music',
    label: 'Music',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
      >
        <path
          d="M8.09023 15.3602C8.09023 16.542 6.95074 17.5 5.54512 17.5C4.13949 17.5 3 16.542 3 15.3602C3 14.1783 4.13949 13.2204 5.54512 13.2204C6.95074 13.2204 8.09023 14.1783 8.09023 15.3602ZM8.09023 15.3602V6.17012C8.09023 5.0236 8.84358 4.01601 9.93629 3.7011L13.7558 2.60032C15.3816 2.13176 17 3.36341 17 5.06933V12.7924M17 12.7924C17 13.9742 15.8606 14.9322 14.4549 14.9322C13.0492 14.9322 11.9098 13.9742 11.9098 12.7924C11.9098 11.6106 13.0492 10.6526 14.4549 10.6526C15.8606 10.6526 17 11.6106 17 12.7924Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-type w-4 h-4"
      >
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" x2="15" y1="20" y2="20"></line>
        <line x1="12" x2="12" y1="4" y2="20"></line>
      </svg>
    ),
  },
  {
    id: 'files',
    label: 'Files',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="currentColor"
      >
        <path
          d="M10 17V11.3548M10 11.3548L12.1622 13.6129M10 11.3548L7.83784 13.6129M6 17H4.59459C3.16164 17 2 15.7869 2 14.2903V5.70968C2 4.21317 3.16164 3 4.59459 3H6.88169C7.7492 3 8.55931 3.45279 9.04052 4.20662L9.48653 4.90526C9.80731 5.40782 10.3474 5.70968 10.9258 5.70968H15.4054C16.8384 5.70968 18 6.92284 18 8.41935V14.2903C18 15.7869 16.8384 17 15.4054 17H14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

interface StudioSidebarProps {
  onUpload?: (files: FileList | File[]) => void;
  onDeleteAsset?: (assetId: string) => void;
  onAddTrack?: (
    file: {
      id: string;
      name: string;
      url?: string;
      type: string;
      size: number;
    },
    duration: number,
  ) => void;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  assets?: UploadedFile[];
}

export function StudioSidebar({
  onUpload,
  onDeleteAsset,
  onAddTrack,
  activeTab,
  setActiveTab,
  assets = [],
}: StudioSidebarProps) {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelWidthRef = useRef(PANEL_DEFAULT);
  const isResizingRef = useRef(false);

  useEffect(() => {
    panelWidthRef.current = panelWidth;
  }, [panelWidth]);

  const handleTabClick = (id: string) => {
    setActiveTab((prev: string | null) => (prev === id ? null : id));
  };

  const handleResizerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      isResizingRef.current = true;
      const startX = e.clientX;
      const startWidth = panelWidthRef.current;

      if (panelRef.current) panelRef.current.style.transition = 'none';

      const onMove = (ev: PointerEvent) => {
        if (!isResizingRef.current) return;
        const delta = ev.clientX - startX;
        const newWidth = Math.max(
          PANEL_MIN,
          Math.min(PANEL_MAX, startWidth + delta),
        );
        panelWidthRef.current = newWidth;
        if (panelRef.current) panelRef.current.style.width = `${newWidth}px`;
      };

      const onUp = () => {
        isResizingRef.current = false;
        if (panelRef.current) panelRef.current.style.transition = '';
        setPanelWidth(panelWidthRef.current);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [],
  );

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <div className="z-20 sticky top-0 left-0 h-full hidden md:flex shrink-0">
        {/* Icon Strip */}
        <div className="h-full w-[68px] shrink-0 bg-background border-r border-fd-border">
          <div className="flex flex-col w-full h-full relative overflow-auto">
            <div
              role="tablist"
              aria-orientation="vertical"
              className="py-3.5 px-1.5 gap-3 flex flex-col w-full"
            >
              {SIDEBAR_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabClick(tab.id)}
                    className={cn(
                      'text-[11px] font-[550] rounded-lg pt-0.5 gap-[3px] flex flex-col items-center group/tag-trigger tracking-[-0.02em] transition-colors',
                      isActive ? 'text-foreground' : 'text-gray-500',
                    )}
                  >
                    <div className="flex w-8 h-8 shrink-0 items-center justify-center">
                      <div
                        className={cn(
                          'flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-75',
                          'group-hover/tag-trigger:bg-fd-accent group-hover/tag-trigger:w-8 group-hover/tag-trigger:h-8',
                          isActive && 'bg-foreground text-background w-8 h-8',
                        )}
                      >
                        {tab.icon}
                      </div>
                    </div>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slide-out Panel */}
        <div
          ref={panelRef}
          className={cn(
            'h-full bg-background overflow-hidden flex flex-col relative isolate',
            activeTab ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
          style={{
            width: activeTab ? panelWidth : 0,
            transition:
              'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease',
            willChange: 'width',
          }}
        >
          <div className="absolute h-full w-px bg-fd-border top-0 bottom-0 z-50 -left-px" />
          <div className="absolute h-full w-px bg-fd-border top-0 bottom-0 z-50 -right-px" />

          <div
            className="w-full h-full overflow-hidden border-r"
            style={{ width: activeTab ? panelWidth : 0 }}
          >
            <div
              className="h-full flex flex-col shrink-0"
              style={{ minWidth: PANEL_MIN }}
            >
              <div className="flex flex-col w-full h-full overflow-y-auto group/sidebar-content bg-background relative">
                {activeTab === 'files' && (
                  <FilesPanel
                    onUpload={onUpload}
                    onDeleteAsset={onDeleteAsset}
                    onAddTrack={onAddTrack}
                    assets={assets}
                  />
                )}
                {activeTab === 'captions' && <CaptionsPanel />}
                {activeTab &&
                  activeTab !== 'files' &&
                  activeTab !== 'captions' && (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-fd-muted-foreground select-none">
                      <p className="text-sm font-medium">
                        {SIDEBAR_TABS.find((t) => t.id === activeTab)?.label}
                      </p>
                      <p className="text-[11px]">Em breve</p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Resizer */}
          <div
            className="group/resizer absolute top-0 w-3 h-full z-50 transition-colors -right-1.5 cursor-grab active:cursor-grabbing"
            onPointerDown={handleResizerPointerDown}
          >
            <div className="absolute h-full flex items-center justify-center w-4 -right-3.5">
              <div className="flex w-[5px] bg-fd-border group-hover/resizer:bg-fd-muted-foreground/60 transition-colors duration-100 rounded-full h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar (Bottom) */}
      <div className="md:hidden border-t bg-background w-full z-40 flex flex-col shrink-0">
        <div className="flex h-13 w-full items-center relative overflow-x-auto no-scrollbar border-b">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="flex gap-1 px-3.5 py-1.5 w-full"
          >
            {SIDEBAR_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'text-xs font-[550] rounded-lg px-3 py-2 gap-1.5 flex flex-row items-center transition-colors select-none shrink-0',
                    isActive
                      ? 'bg-fd-accent text-fd-foreground'
                      : 'text-gray-500 hover:bg-fd-accent/50',
                  )}
                >
                  <div className="flex w-5 h-5 shrink-0 items-center justify-center">
                    {tab.icon}
                  </div>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      {activeTab && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-[45] animate-in fade-in duration-200 md:hidden"
            onClick={() => setActiveTab(null)}
          />

          <div
            role="dialog"
            className={cn(
              'md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white dark:bg-black rounded-t-[10px] animate-in slide-in-from-bottom duration-300',
              'border-t shadow-[0_-8px_30px_rgb(0,0,0,0.12)]',
            )}
            style={{ maxHeight: 'calc(100vh - 48px)' }}
          >
            {/* Handle bar */}
            <div
              className="py-2 shrink-0 cursor-grab active:cursor-grabbing"
              onClick={() => setActiveTab(null)}
            >
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Content Area */}
            <div className="relative h-[600px] max-h-[80vh] flex flex-col overflow-hidden">
              <div className="flex flex-col w-full flex-1 overflow-y-auto no-scrollbar bg-background">
                {activeTab === 'files' && (
                  <FilesPanel
                    onUpload={onUpload}
                    onDeleteAsset={onDeleteAsset}
                    onAddTrack={onAddTrack}
                    assets={assets}
                  />
                )}
                {activeTab === 'captions' && <CaptionsPanel />}
                {activeTab &&
                  activeTab !== 'files' &&
                  activeTab !== 'captions' && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-fd-muted-foreground p-10 text-center">
                      <p className="text-sm font-medium">
                        {SIDEBAR_TABS.find((t) => t.id === activeTab)?.label}
                      </p>
                      <p className="text-xs">
                        Recurso em desenvolvimento para mobile
                      </p>
                    </div>
                  )}
              </div>

              {/* Internal Tab Bar (at the bottom of the drawer) */}
              <div className="border-t bg-background shrink-0 pb-safe">
                <div className="flex h-13 w-full items-center relative overflow-x-auto no-scrollbar">
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="flex gap-1 px-3.5 py-1.5 w-full"
                  >
                    {SIDEBAR_TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'text-xs font-[550] rounded-lg px-3 py-2 gap-1.5 flex flex-row items-center transition-colors select-none shrink-0',
                            isActive
                              ? 'bg-fd-accent text-fd-foreground'
                              : 'text-gray-500 hover:bg-fd-accent/50',
                          )}
                        >
                          <div className="flex w-5 h-5 shrink-0 items-center justify-center">
                            {tab.icon}
                          </div>
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
