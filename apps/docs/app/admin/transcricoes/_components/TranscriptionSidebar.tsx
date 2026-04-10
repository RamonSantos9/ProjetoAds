'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { FilesPanel } from '../../estudio/_components/FilesPanel';
import { UploadedFile } from '@/lib/db';

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
    id: 'edit',
    label: 'Edit',
    icon: (
      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M13.8057 4.55691C12.1471 4.15967 11.6952 3.71909 11.2877 2.10193C11.2362 1.89703 11.0497 1.75 10.8333 1.75C10.6169 1.75 10.4305 1.89703 10.3789 2.10193C9.97142 3.71909 9.51958 4.15967 7.86095 4.55691C7.6508 4.60724 7.5 4.78901 7.5 5C7.5 5.21099 7.6508 5.39276 7.86095 5.44309C9.51958 5.84033 9.97142 6.28091 10.3789 7.89807C10.4305 8.10297 10.6169 8.25 10.8333 8.25C11.0497 8.25 11.2362 8.10297 11.2877 7.89807C11.6952 6.28091 12.1471 5.84033 13.8057 5.44309C14.0158 5.39276 14.1667 5.21099 14.1667 5C14.1667 4.78901 14.0158 4.60724 13.8057 4.55691Z" fill="currentColor"></path>
        <path d="M15.9797 6.74133L16.3349 6.85567C17.8611 7.34689 17.8971 9.46512 16.3885 10.0066L12.1733 11.5195C11.9387 11.6038 11.7538 11.7863 11.6684 12.0179L10.053 16.4028C9.51355 17.867 7.41502 17.8653 6.87815 16.4002L2.60427 4.73727C2.11458 3.40096 3.43509 2.11151 4.78358 2.6092L5.95588 3.04186" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    ),
  },
  {
    id: 'chapters',
    label: 'Chapters',
    icon: (
      <svg width="1.2rem" height="1.2rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3333 4.06674H2" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M14 8.06674H2" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M10.0667 12H2" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    ),
  },
  {
    id: 'voices',
    label: 'Voices',
    icon: (
      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <circle cx="5.625" cy="5.625" r="3.125" stroke="currentColor" strokeWidth="1.5"></circle>
        <circle cx="5.625" cy="14.375" r="3.125" stroke="currentColor" strokeWidth="1.5"></circle>
        <circle cx="14.375" cy="5.625" r="3.125" stroke="currentColor" strokeWidth="1.5"></circle>
        <circle cx="14.375" cy="14.375" r="3.125" stroke="currentColor" strokeWidth="1.5"></circle>
      </svg>
    ),
  },
  {
    id: 'sfx',
    label: 'SFX',
    icon: (
      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M9.99984 2.29166L10.8007 3.84616C11.36 4.93178 12.6218 5.45443 13.7849 5.08227L15.4504 4.54938L14.9176 6.21488C14.5454 7.37802 15.0681 8.63983 16.1537 9.19916L17.7082 10L16.4892 10.628C15.2642 11.2592 14.7808 12.7627 15.4087 13.9894L16.8968 16.8969L13.9893 15.4088C12.7625 14.781 11.259 15.2643 10.6278 16.4893L9.99984 17.7083L9.199 16.1538C8.63967 15.0682 7.37786 14.5456 6.21472 14.9177L4.54922 15.4506L5.08211 13.7851C5.45427 12.622 4.93162 11.3602 3.846 10.8008L2.2915 10L3.51048 9.372C4.73554 8.74083 5.21882 7.23736 4.59097 6.01061L3.1029 3.10306L6.01045 4.59113C7.2372 5.21898 8.74067 4.7357 9.37184 3.51064L9.99984 2.29166Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
      </svg>
    ),
  },
  {
    id: 'music',
    label: 'Music',
    icon: (
      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M8.09023 15.3602C8.09023 16.542 6.95074 17.5 5.54512 17.5C4.13949 17.5 3 16.542 3 15.3602C3 14.1783 4.13949 13.2204 5.54512 13.2204C6.95074 13.2204 8.09023 14.1783 8.09023 15.3602ZM8.09023 15.3602V6.17012C8.09023 5.0236 8.84358 4.01601 9.93629 3.7011L13.7558 2.60032C15.3816 2.13176 17 3.36341 17 5.06933V12.7924M17 12.7924C17 13.9742 15.8606 14.9322 14.4549 14.9322C13.0492 14.9322 11.9098 13.9742 11.9098 12.7924C11.9098 11.6106 13.0492 10.6526 14.4549 10.6526C15.8606 10.6526 17 11.6106 17 12.7924Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
      </svg>
    ),
  },
  {
    id: 'files',
    label: 'Files',
    icon: (
      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M10 17V11.3548M10 11.3548L12.1622 13.6129M10 11.3548L7.83784 13.6129M6 17H4.59459C3.16164 17 2 15.7869 2 14.2903V5.70968C2 4.21317 3.16164 3 4.59459 3H6.88169C7.7492 3 8.55931 3.45279 9.04052 4.20662L9.48653 4.90526C9.80731 5.40782 10.3474 5.70968 10.9258 5.70968H15.4054C16.8384 5.70968 18 6.92284 18 8.41935V14.2903C18 15.7869 16.8384 17 15.4054 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    ),
  },
];

interface TranscriptionSidebarProps {
  onUpload?: (files: FileList | File[]) => void;
  onDeleteAsset?: (assetId: string) => void;
  onAddTrack?: (file: any, duration: number) => void;
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
  assets?: UploadedFile[];
}

export function TranscriptionSidebar({
  onUpload,
  onDeleteAsset,
  onAddTrack,
  activeTab,
  setActiveTab,
  assets = [],
}: TranscriptionSidebarProps) {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelWidthRef = useRef(PANEL_DEFAULT);
  const isResizingRef = useRef(false);

  useEffect(() => { panelWidthRef.current = panelWidth; }, [panelWidth]);

  const handleTabClick = (id: string) => {
    setActiveTab((prev: string | null) => (prev === id ? null : id));
  };

  const handleResizerPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isResizingRef.current = true;
    const startX = e.clientX;
    const startWidth = panelWidthRef.current;
    if (panelRef.current) panelRef.current.style.transition = 'none';

    const onMove = (ev: PointerEvent) => {
      if (!isResizingRef.current) return;
      const delta = ev.clientX - startX;
      const newWidth = Math.max(PANEL_MIN, Math.min(PANEL_MAX, startWidth + delta));
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
  }, []);

  return (
    <div className="z-20 sticky top-0 left-0 h-full hidden md:flex shrink-0">
      {/* Icon Strip */}
      <div className="h-full w-[68px] shrink-0 bg-[#FFFFFF] dark:bg-fd-background border-r border-[#E2E7F1] dark:border-[#2A2A38]">
        <div className="flex flex-col w-full h-full relative overflow-auto no-scrollbar">
          <div role="tablist" aria-orientation="vertical" className="py-3.5 px-1.5 gap-3 flex flex-col w-full">
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
                    "text-[11px] font-[550] rounded-lg pt-0.5 gap-[3px] flex flex-col items-center group/tag-trigger tracking-[-0.02em] transition-colors focus-ring select-none",
                    isActive ? "text-foreground" : "text-gray-500"
                  )}
                >
                  <div className="flex w-8 h-8 shrink-0 items-center justify-center">
                    <div className={cn(
                      "flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-75",
                      "group-hover/tag-trigger:bg-[#f6f8fa] dark:group-hover/tag-trigger:bg-white/5 group-hover/tag-trigger:w-8 group-hover/tag-trigger:h-8",
                      isActive ? "bg-black dark:bg-white text-white dark:text-black w-8 h-8" : "bg-transparent text-gray-500"
                    )}>
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
          "h-full bg-[#FFFFFF] dark:bg-fd-background flex flex-col relative isolate transition-[width,opacity] duration-300 ease-in-out",
          activeTab ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        style={{ width: activeTab ? panelWidth : 0 }}
      >
        <div className="absolute h-full w-px bg-gray-alpha-150 top-0 bottom-0 z-50 -left-px" />
        <div className="absolute h-full w-px bg-gray-alpha-150 top-0 bottom-0 z-50 -right-px" />

        <div className="w-full h-full overflow-hidden" style={{ width: activeTab ? panelWidth : 0 }}>
          <div className="h-full flex flex-col shrink-0" style={{ minWidth: 348 }}>
            <div className="flex flex-col w-full h-full overflow-y-auto no-scrollbar bg-[#FFFFFF] dark:bg-fd-background relative">
              
              {/* EDIT TAB CONTENT */}
              {activeTab === 'edit' && (
                <div className="flex flex-col h-full w-full px-3.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between px-3.5 h-11 shrink-0 -mx-3.5 sticky top-0 z-30 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-[#E2E7F1] dark:border-[#2A2A38]">
                    <div className="flex items-center gap-1 w-full min-w-0 font-medium text-xm">Editar Transcrição</div>
                  </div>
                  
                                    <div className="flex flex-col grow shrink-0 w-full gap-5 py-3.5 isolate peer empty:hidden">
                    <div className="flex flex-col gap-2 w-full">
                      <span className="flex items-center w-fit select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm cursor-default">Playback</span>
                      <div className="flex w-full items-center gap-2">
                        <p className="text-xs text-subtle font-medium w-14">Volume</p>
                        <button aria-label="Mute volume" type="button" className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 rounded-lg text-xm center p-0 h-8 w-8 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume2 shrink-0 w-4 h-4"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M16 9a5 5 0 0 1 0 6"></path><path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path></svg>
                        </button>
                        <div className="min-w-0 flex-1">
                          <span dir="ltr" data-orientation="horizontal" aria-disabled="false" className="relative flex touch-none select-none items-center cursor-pointer w-full" style={{ "--radix-slider-thumb-transform": "translateX(-50%)" } as any}>
                            <span data-orientation="horizontal" className="relative grow overflow-hidden rounded-full bg-gray-alpha-200 h-1 w-full">
                              <span data-orientation="horizontal" className="absolute bg-primary h-full" style={{ left: "0%", right: "50%" }}></span>
                            </span>
                            <span style={{ transform: "var(--radix-slider-thumb-transform)", position: "absolute", left: "calc(50% + 0px)" }}>
                              <span role="slider" aria-label="Change volume" aria-valuemin={0} aria-valuemax={2} aria-orientation="horizontal" data-orientation="horizontal" tabIndex={0} className="block h-3 w-3 scale-100 hover:scale-110 transition-transform rounded-full bg-primary duration-100 focus-ring disabled:pointer-events-none disabled:opacity-50" aria-valuenow={1}></span>
                            </span>
                          </span>
                        </div>
                        <div className="relative shrink-0 w-14 min-w-14">
                          <input className="flex border border-gray-alpha-200 bg-transparent shadow-none transition-colors file:border-0 file:bg-transparent file:font-medium placeholder:text-subtle focus-ring focus-visible:border-foreground hover:border-gray-alpha-300 focus-visible:ring-[0.5px] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 h-7 px-2 py-1 text-xs rounded-lg file:text-xs w-full pr-5" placeholder="" step="1" min="0" max="200" type="number" defaultValue="100" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-subtle text-xs">%</span>
                        </div>
                      </div>
                      <div className="flex w-full items-center gap-2">
                        <p className="text-xs text-subtle font-medium w-14">Fade In</p>
                        <span className="shrink-0 w-9 text-subtle flex items-center justify-center h-[32px]" aria-hidden="true">
                          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="10" x2="3" y2="5"></line><line x1="8" y1="10" x2="8" y2="3.5"></line><line x1="13" y1="10" x2="13" y2="1"></line></svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <span dir="ltr" data-orientation="horizontal" aria-disabled="false" className="relative flex touch-none select-none items-center cursor-pointer w-full" style={{ "--radix-slider-thumb-transform": "translateX(-50%)" } as any}>
                            <span data-orientation="horizontal" className="relative grow overflow-hidden rounded-full bg-gray-alpha-200 h-1 w-full">
                              <span data-orientation="horizontal" className="absolute bg-primary h-full" style={{ left: "0%", right: "100%" }}></span>
                            </span>
                            <span style={{ transform: "var(--radix-slider-thumb-transform)", position: "absolute", left: "calc(0% + 6px)" }}>
                              <span role="slider" aria-label="Fade in (seconds)" aria-valuemin={0} aria-valuemax={10} aria-orientation="horizontal" data-orientation="horizontal" tabIndex={0} className="block h-3 w-3 scale-100 hover:scale-110 transition-transform rounded-full bg-primary duration-100 focus-ring disabled:pointer-events-none disabled:opacity-50" aria-valuenow={0}></span>
                            </span>
                          </span>
                        </div>
                        <div className="relative shrink-0 w-14 min-w-14">
                          <input className="flex border border-gray-alpha-200 bg-transparent shadow-none transition-colors focus-ring focus-visible:border-foreground hover:border-gray-alpha-300 focus-visible:ring-[0.5px] disabled:cursor-not-allowed disabled:opacity-50 h-7 px-2 py-1 text-xs rounded-lg file:text-xs w-full pr-5" placeholder="0" step="0.01" min="0" max="10" aria-label="Fade in (seconds)" type="number" defaultValue="0" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-subtle text-xs">s</span>
                        </div>
                      </div>
                      <div className="flex w-full items-center gap-2">
                        <p className="text-xs text-subtle font-medium w-14">Fade Out</p>
                        <span className="shrink-0 w-9 text-subtle flex items-center justify-center h-[32px]" aria-hidden="true">
                          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="1" x2="3" y2="10"></line><line x1="8" y1="3.5" x2="8" y2="10"></line><line x1="13" y1="5" x2="13" y2="10"></line></svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <span dir="ltr" data-orientation="horizontal" aria-disabled="false" className="relative flex touch-none select-none items-center cursor-pointer w-full" style={{ "--radix-slider-thumb-transform": "translateX(-50%)" } as any}>
                            <span data-orientation="horizontal" className="relative grow overflow-hidden rounded-full bg-gray-alpha-200 h-1 w-full">
                              <span data-orientation="horizontal" className="absolute bg-primary h-full" style={{ left: "0%", right: "100%" }}></span>
                            </span>
                            <span style={{ transform: "var(--radix-slider-thumb-transform)", position: "absolute", left: "calc(0% + 6px)" }}>
                              <span role="slider" aria-label="Fade out (seconds)" aria-valuemin={0} aria-valuemax={10} aria-orientation="horizontal" data-orientation="horizontal" tabIndex={0} className="block h-3 w-3 scale-100 hover:scale-110 transition-transform rounded-full bg-primary duration-100 focus-ring disabled:pointer-events-none disabled:opacity-50" aria-valuenow={0}></span>
                            </span>
                          </span>
                        </div>
                        <div className="relative shrink-0 w-14 min-w-14">
                          <input className="flex border border-gray-alpha-200 bg-transparent shadow-none transition-colors focus-ring focus-visible:border-foreground hover:border-gray-alpha-300 focus-visible:ring-[0.5px] disabled:cursor-not-allowed disabled:opacity-50 h-7 px-2 py-1 text-xs rounded-lg file:text-xs w-full pr-5" placeholder="0" step="0.01" min="0" max="10" aria-label="Fade out (seconds)" type="number" defaultValue="0" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-subtle text-xs">s</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full">
                      <span className="flex items-center w-fit select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm cursor-default">Type</span>
                      <button type="button" role="combobox" aria-expanded="false" className="flex items-center justify-between whitespace-nowrap transition-colors shadow-none placeholder:text-muted-foreground focus-ring disabled:cursor-not-allowed duration-75 disabled:opacity-50 border border-gray-alpha-200 hover:border-gray-alpha-300 active:border-gray-alpha-300 hover:bg-gray-alpha-50 active:bg-gray-alpha-50 text-foreground disabled:bg-background disabled:border-gray-alpha-200 pl-2.5 w-full bg-background dark:bg-gray-alpha-50 rounded-[10px] py-2.5 dark:hover:bg-gray-alpha-100 gap-1.5 text-xm font-medium dark:border-gray-alpha-50 h-9 pr-2.5">
                        <span style={{ pointerEvents: "none" }}><div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-type w-4 h-4"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" x2="15" y1="20" y2="20"></line><line x1="12" x2="12" y1="4" y2="20"></line></svg><span>Text</span></div></span>
                        <div className="flex h-4 w-4 items-center justify-center opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 min-w-fit"><path d="m6 9 6 6 6-6"></path></svg></div>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <span className="flex items-center select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm w-full cursor-default">Model</span>
                      <div className="flex flex-col rounded-[10px] border border-[#E2E7F1] dark:border-[#2A2A38] bg-[#FFFFFF] dark:bg-fd-background">
                        <div className="flex w-full items-center flex-col relative isolate group/row">
                          <div className="flex w-full p-0.5 items-center flex-col">
                            <div className="flex w-full items-center relative group/item">
                              <div role="button" tabIndex={0} className="flex w-full text-left py-1.5 pl-1.5 pr-3 items-center gap-2 h-9 md:hover:bg-gray-alpha-100 rounded-lg !outline-none focus-visible:ring-[1.5px] focus-visible:ring-primary focus-within:bg-gray-alpha-100">
                                <div className="flex items-center relative justify-center shrink-0 w-[22px] h-[22px] rounded-md">
                                  <svg height="1.1rem" viewBox="0 0 27 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1313 11.143L16.6063 8.65869C16.9657 8.30848 17.2223 7.99111 17.3763 7.70657C17.5303 7.41473 17.6073 7.09735 17.6073 6.75445C17.6073 6.39694 17.5303 6.13064 17.3763 5.95554C17.2223 5.78044 17.0097 5.69289 16.7383 5.69289C16.4597 5.69289 16.2287 5.78773 16.0453 5.97743C15.8693 6.16712 15.7703 6.47355 15.7483 6.89672H14.1423C14.201 5.29891 15.0737 4.5 16.7603 4.5C17.523 4.5 18.1207 4.69334 18.5533 5.08003C18.9933 5.45942 19.2133 5.99567 19.2133 6.68878C19.2133 7.23598 19.107 7.71386 18.8943 8.12243C18.689 8.53101 18.3627 8.95417 17.9153 9.39193L16.0783 11.2414V11.2852H19.3343V12.5H14.1313V11.143Z" fill="currentColor"></path><path d="M7 4.68605H8.716L9.86 8.62586C10.058 9.34086 10.2303 10.0559 10.377 10.7709H10.421C10.531 10.1726 10.7033 9.4576 10.938 8.62586L12.038 4.68605H13.721L11.345 12.5H9.442L7 4.68605Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.24 0.5H18.24C22.7908 0.5 26.48 4.18917 26.48 8.74C26.48 13.2908 22.7908 16.98 18.24 16.98H8.24C3.68917 16.98 0 13.2908 0 8.74C0 4.18917 3.68917 0.5 8.24 0.5ZM8.24 1.74C4.37401 1.74 1.24 4.87401 1.24 8.74C1.24 12.606 4.37401 15.74 8.24 15.74H18.24C22.106 15.74 25.24 12.606 25.24 8.74C25.24 4.87401 22.106 1.74 18.24 1.74H8.24Z" fill="currentColor"></path></svg>
                                </div>
                                <div className="text-foreground font-medium text-xm grow pl-1 h-5"><div className="relative w-fit line-clamp-1">Eleven Multilingual v2</div></div>
                                <div className="flex w-4 h-4 text-gray-400 shrink-0 ml-auto -mr-1 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-3.5 h-3.5"><path d="m9 18 6-6-6-6"></path></svg></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <span className="flex items-center w-fit select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm cursor-default">Voice</span>
                      <div className="flex flex-col rounded-[10px] border border-[#E2E7F1] dark:border-[#2A2A38] bg-[#FFFFFF] dark:bg-fd-background">
                        <div className="p-0.5">
                          <button role="combobox" aria-label="Select voice" type="button" className="relative items-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 rounded-[10px] group/item flex w-full justify-between gap-2 overflow-hidden h-9 p-1.5 active:bg-gray-alpha-100">
                            <p className="text-sm text-subtle font-normal px-1 truncate w-full text-start">Voice unavailable</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 shrink-0 text-gray-alpha-500"><path d="m6 9 6 6 6-6"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <button className="flex items-center w-fit select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm cursor-pointer hover:text-foreground transition-colors duration-75">
                        Generation History
                        <div className="flex group-hover/item-title:translate-x-0.5 transition-transform duration-75"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-3.5 h-3.5"><path d="m9 18 6-6-6-6"></path></svg></div>
                      </button>
                      <div className="flex flex-col rounded-[10px] border border-gray-alpha-150 bg-background dark:bg-gray-alpha-50 dark:border-gray-alpha-50">
                        <div className="flex w-full items-center flex-col relative isolate group/row">
                          <div className="flex w-full p-0.5 items-center flex-col">
                            <div className="flex w-full items-center relative group/item">
                              <div role="button" tabIndex={0} className="flex w-full text-left py-1.5 pl-1.5 pr-3 items-center gap-2 h-9 md:hover:bg-gray-alpha-100 rounded-lg !outline-none focus-visible:ring-[1.5px] focus-visible:ring-primary focus-within:bg-gray-alpha-100">
                                <div className="flex items-center relative justify-center shrink-0 w-[22px] h-[22px] rounded-md">
                                  <button tabIndex={0} aria-label="Play" type="button" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-foreground text-background shadow-none hover:bg-gray-800 text-xm center p-0 relative rounded-full w-full h-full">
                                    <div className="absolute" style={{ opacity: 1, transform: "none" }}><svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-3.5 h-3.5"><path d="M8.38399 3.68914C7.05155 2.86616 5.33301 3.82463 5.33301 5.39074V14.6094C5.33301 16.1755 7.05155 17.134 8.38399 16.311L15.8467 11.7016C17.1121 10.9201 17.1121 9.07998 15.8467 8.29846L8.38399 3.68914Z" fill="currentColor"></path></svg></div>
                                  </button>
                                </div>
                                <div className="text-foreground font-medium text-xm grow pl-1 h-5"><div className="relative w-fit line-clamp-1">June 20, 2025, 12:50</div></div>
                                <div className="w-fit h-fit flex items-center justify-center shrink-0 ml-auto"><div className="flex w-[18px] h-[18px] shrink-0 bg-foreground rounded-full items-center justify-center text-background"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-2.5 h-2.5"><path d="M20 6 9 17l-5-5"></path></svg></div></div>
                              </div>
                              <div className="md:absolute empty:hidden flex w-fit h-full pr-1 items-center top-0 bottom-0 right-0 z-10 pointer-events-none">
                                <div className="justify-self-end flex items-center md:opacity-0 group-hover/item:opacity-100 transition-all duration-75 md:translate-x-1 group-hover/item:translate-x-0 focus-within:opacity-100 focus-within:translate-x-0 group/item">
                                  <div className="flex w-full items-center shadow-natural-xs rounded-md bg-background dark:bg-gray-300 h-7 pointer-events-auto empty:hidden">
                                     <button type="button" className="relative inline-flex items-center justify-center whitespace-nowrap focus-ring bg-transparent text-xs px-2 rounded-none first:rounded-l-md last:rounded-r-md font-medium h-full border-l hover:bg-gray-alpha-50 text-gray-alpha-500 hover:text-foreground transition-colors duration-75 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" data-agent-tooltip="Preview text"><svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M5.83333 9.33333H8.83333M5.83333 6.66667H10.1667M4.5 13.5H11.5C12.6046 13.5 13.5 12.6046 13.5 11.5V4.5C13.5 3.39543 12.6046 2.5 11.5 2.5H4.5C3.39543 2.5 2.5 3.39543 2.5 4.5V11.5C2.5 12.6046 3.39543 13.5 4.5 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg></button>
                                     <button type="button" className="relative inline-flex items-center justify-center whitespace-nowrap focus-ring bg-transparent text-xs px-2 rounded-none first:rounded-l-md last:rounded-r-md font-medium h-full border-l hover:bg-gray-alpha-50 text-gray-alpha-500 hover:text-foreground transition-colors duration-75 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" data-agent-tooltip="More actions"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis w-3.5 h-3.5"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <span className="flex items-center w-fit select-none gap-0.5 focus-ring rounded-md group/item-title text-foreground font-medium text-xm cursor-default">AI Tools</span>
                      <div className="flex flex-col rounded-[10px] border border-gray-alpha-150 bg-background dark:bg-gray-alpha-50 dark:border-gray-alpha-50">
                        {[{
                          label: 'Enhance text',
                          subtext: 'Enhance text to help guide delivery',
                          icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand w-5 h-5"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h.01"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>,
                          color50: 'hsl(var(--orange-50))',
                          color600: 'hsl(var(--orange-600))'
                        }, {
                          label: 'Remove background audio',
                          subtext: 'Use voice isolator to clean up audio',
                          icon: <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M10.625 6.45834C12.5776 8.41096 12.5776 11.5768 10.625 13.5294M8.26798 8.81537C8.91885 9.46624 8.91885 10.5215 8.26798 11.1724" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path><path d="M17 12.2V14.2C17 15.7464 15.7464 17 14.2 17H12.2M17 7.8V5.8C17 4.2536 15.7464 3 14.2 3H12.2M7.79999 17H5.79999C4.25359 17 2.99998 15.7464 2.99998 14.2V12.2M2.99998 7.8V5.8C2.99998 4.2536 4.25359 3 5.79999 3H7.79999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>,
                          color50: 'hsl(var(--purple-50))',
                          color600: 'hsl(var(--purple-600))'
                        }, {
                          label: 'Use voice changer',
                          subtext: 'Modify voice in existing audio',
                          icon: <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M10.3258 5.88235C10.3258 7.47423 9.06066 8.76471 7.5 8.76471C5.93934 8.76471 4.67418 7.47423 4.67418 5.88235C4.67418 4.29047 5.93934 3 7.5 3C9.06066 3 10.3258 4.29047 10.3258 5.88235Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path><path d="M7.5 11.2353C5.09526 11.2353 3.20018 12.515 2.19824 14.4158C1.52238 15.6981 2.67793 17 4.10519 17H10.8948C12.3221 17 13.4776 15.6981 12.8018 14.4158C11.7998 12.515 9.90473 11.2353 7.5 11.2353Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path><path d="M15.6187 5C17.5713 6.95262 17.5713 10.1184 15.6187 12.0711M13.2616 7.35702C13.9125 8.0079 13.9125 9.06317 13.2616 9.71405" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>,
                          color50: 'hsl(var(--blue-50))',
                          color600: 'hsl(var(--blue-600))'
                        }, {
                          label: 'Direct speech with your voice',
                          subtext: 'Record audio using your own voice',
                          icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-vocal w-5 h-5"><path d="m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12"></path><path d="M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5"></path><circle cx="16" cy="7" r="5"></circle></svg>,
                          color50: 'hsl(var(--green-50))',
                          color600: 'hsl(var(--green-600))'
                        }].map((tool, idx, arr) => (
                          <div key={idx} className="flex flex-col">
                            <div className="flex w-full items-center flex-col relative isolate group/row">
                              <div className="flex w-full p-0.5 items-center flex-col">
                                <div className="flex w-full items-center relative group/item">
                                  <div role="button" tabIndex={0} className="flex w-full text-left py-1.5 pl-1.5 pr-3 items-center gap-2 h-9 md:hover:bg-gray-alpha-100 rounded-lg !outline-none focus-visible:ring-[1.5px] focus-visible:ring-primary focus-within:bg-gray-alpha-100 group-[:has([data-subtext])]/row:h-[46px]">
                                    <div className="flex items-center relative justify-center shrink-0 w-[22px] h-[22px] rounded-md group-[:has([data-subtext])]/item:w-7 group-[:has([data-subtext])]/item:h-7 group-[:has([data-subtext])]/item:ml-1" style={{ color: tool.color50 }}>
                                      <span className="absolute inset-0 opacity-90 rounded-md block" style={{ backgroundColor: tool.color600 }}></span>
                                      <span className="relative z-10 dark:text-white opacity-90">{tool.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="text-foreground font-medium text-xm grow pl-1 h-5"><div className="relative w-fit line-clamp-1">{tool.label}</div></div>
                                      <div data-subtext="true" className="relative line-clamp-1 text-[11px] h-4 select-none cursor-default empty:hidden text-gray-500 -mt-0.5" style={{ textWrap: "pretty" }}>{tool.subtext}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {idx < arr.length - 1 && <div className="px-2 w-full flex shrink-0"><hr className="bg-gray-alpha-100 dark:bg-gray-alpha-50 w-full h-px border-none" /></div>}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* FILES TAB CONTENT */}
              {activeTab === 'files' && (
                <FilesPanel onUpload={onUpload} onDeleteAsset={onDeleteAsset} onAddTrack={onAddTrack} assets={assets} />
              )}

              {/* PLACEHOLDER CONTENT */}
              {activeTab && !['edit', 'files'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-subtle p-10 text-center animate-in fade-in">
                  <p className="text-sm font-medium">{SIDEBAR_TABS.find(t => t.id === activeTab)?.label}</p>
                  <p className="text-[11px]">Recurso disponível em breve</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div className="group/resizer absolute top-0 w-3 h-full z-50 transition-colors -right-1.5 cursor-grab active:cursor-grabbing" onPointerDown={handleResizerPointerDown}>
          <div className="absolute h-full flex items-center justify-center w-4 -right-3.5">
            <div className="flex w-[5px] h-10 bg-gray-alpha-200 group-hover/resizer:bg-gray-alpha-400 transition-colors duration-100 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
