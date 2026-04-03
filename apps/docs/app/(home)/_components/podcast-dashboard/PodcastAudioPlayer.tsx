'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAudioPlayer } from '@/lib/audio-context';
import { useSidebar } from '@xispedocs/ui/contexts/sidebar';
import { cn } from '@/lib/cn';
import { ChevronDown, Rewind, FastForward, Play, Pause, Download } from 'lucide-react';

export function PodcastAudioPlayer() {
  const pathname = usePathname();
  const { 
    currentVoice, isPlaying, currentTime, duration, 
    pauseTrack, resumeTrack, seek, rewind, fastForward,
    isVisible, hidePlayer, isMinimized, minimizePlayer, expandPlayer,
    isInlinePlayerVisible
  } = useAudioPlayer();
  
  const { collapsed } = useSidebar();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  if (!isVisible || !currentVoice || isInlinePlayerVisible) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress); // Optimistically update UI
    const newTime = (newProgress / 100) * duration;
    seek(newTime);
  };

  // Só aplicamos lógica de sidebar se estivermos em páginas de administração
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');
  const hasSidebar = isAdminPage && collapsed !== undefined;

  return (
    <div 
      className={cn(
        "fixed bottom-0 z-40 transition-all duration-300",
        !hasSidebar ? "w-full left-0 right-0" : "max-lg:!w-full max-lg:!left-0"
      )}
      style={hasSidebar ? { 
        width: collapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)',
        left: collapsed ? '4rem' : '16rem',
        opacity: 1 
      } : { 
        width: '100%',
        left: 0,
        right: 0,
        opacity: 1 
      }}
    >

      {/* Minimized Bar (Desktop Only) */}
      <div 
        className={cn(
          "absolute w-full bottom-0 left-0 right-0 h-0 justify-center items-center",
          isMinimized ? "hidden md:flex" : "hidden"
        )}
        aria-hidden="false" 
        style={{ opacity: 1, transform: 'translateY(-32px)' }}
      >
        <button 
          onClick={expandPlayer}
          aria-label="Expand audio player" 
          className="p-2 py-3 pb-5 outline-none rounded-full group focus-visible:outline-none" 
          data-state="closed"
        >
          <div className="relative w-[340px] h-[4px] rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden outline-none ring-foreground ring-offset-2 group-focus-visible:ring-2">
            <div 
              className="absolute h-full left-0 bg-gray-950 dark:bg-gray-100 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </button>
      </div>

      {/* Main Player (Desktop: hidden if minimized, Mobile: always visible) */}
      <div 
        className={cn(
          "bg-[#FFFFFF] dark:bg-fd-background border-t border-transparent md:border-fd-border md:border-gray-200",
          isMinimized ? "max-md:block md:hidden" : "block"
        )} 
        aria-label="audio player" role="region"
      >
        <div className="flex items-center gap-6 px-4 h-20 relative">
          <div className="hstack w-full gap-2 justify-between items-center">
            
            {/* Voice Info */}
            <div className="stack justify-center h-full md:basis-1/4 overflow-hidden">
              <div className="stack gap-1 items-start w-full">
                <span className="hstack gap-2 items-center max-w-full">
                  <div className="relative w-4 h-4 rounded-full overflow-hidden bg-[#FFFFFF] dark:bg-fd-background shrink-0">
                    <img 
                      alt={currentVoice.name} 
                      className="w-full h-full object-cover" 
                      style={{ filter: `hue-rotate(${currentVoice.hue}deg) saturate(120%)`, transform: `rotate(${currentVoice.hue}deg)` }}
                      src={`/images/home/${currentVoice.img}`} 
                    />
                  </div>
                  <p className="text-sm text-foreground font-medium line-clamp-1 truncate block max-w-full">
                    {currentVoice.name}
                  </p>
                </span>
                
              </div>
            </div>

            {/* Controls & Progress */}
            <div className="grow stack items-stretch md:basis-1/2">
              <div className="stack items-stretch">
                <div className="hstack justify-between items-center gap-0.5 px-2">
                  <div className="grow md:w-12"></div>
                  
                  <div className="hstack items-center gap-2 max-md:hidden">
                    <button onClick={rewind} aria-label="Rewind 10 seconds" data-testid="audio-player-rewind-button" className="relative center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 disabled:bg-transparent disabled:text-gray-400 w-9 h-9 p-0 hidden md:flex rounded-full">
                      <svg height="1.1rem" className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.33386 10C4.34525 10.0003 4.35662 10.0003 4.36795 10H8.25C8.66421 10 9 9.66421 9 9.25C9 8.83579 8.66421 8.5 8.25 8.5H5.43993C6.58986 6.11553 9.20412 4.5 12.0053 4.5C15.1589 4.5 17.8842 6.55843 18.9892 9.51275C19.1343 9.90072 19.5665 10.0976 19.9544 9.95247C20.3424 9.80735 20.5393 9.37521 20.3941 8.98725C19.0902 5.50112 15.8407 3 12.0053 3C8.96442 3 6.05937 4.59129 4.5 7.09919V4.75C4.5 4.33579 4.16421 4 3.75 4C3.33579 4 3 4.33579 3 4.75V9.25C3 9.66421 3.33579 10 3.75 10H4.33386Z" fill="currentColor"></path>
                        <path d="M7.66406 20.1558V13.9858H7.62598L6.75635 14.6016C6.4834 14.7793 6.32471 14.8364 6.14062 14.8364C5.7915 14.8364 5.53125 14.5762 5.53125 14.2271C5.53125 13.9604 5.69629 13.7256 6.02002 13.5098L7.15625 12.7163C7.61328 12.4053 7.9751 12.2783 8.33057 12.2783C8.94629 12.2783 9.35889 12.7036 9.35889 13.3447V20.1558C9.35889 20.7397 9.04785 21.0762 8.5083 21.0762C7.9751 21.0762 7.66406 20.7334 7.66406 20.1558Z" fill="currentColor"></path>
                        <path d="M10.8569 16.8804V16.4741C10.8569 13.8716 12.1011 12.1704 14.1641 12.1704C16.2334 12.1704 17.4522 13.8525 17.4522 16.4741V16.8804C17.4522 19.4766 16.1953 21.1841 14.1387 21.1841C12.0821 21.1841 10.8569 19.4956 10.8569 16.8804ZM12.5708 16.4805V16.8677C12.5708 18.6958 13.1675 19.7876 14.1514 19.7876C15.1353 19.7876 15.7319 18.6958 15.7319 16.8677V16.4805C15.7319 14.6587 15.1353 13.5669 14.1514 13.5669C13.1675 13.5669 12.5708 14.6523 12.5708 16.4805Z" fill="currentColor"></path>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
                       data-testid="audio-player-play-button" aria-label="Play"
                      className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-black text-white shadow-none hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 center h-10 w-10 p-0 rounded-full"
                    >
                      <div className="absolute" style={{ opacity: 1, transform: 'none' }}>
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 w-5 h-5 translate-x-[5%]">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    <button onClick={fastForward} aria-label="Fast-forward 10 seconds" data-testid="audio-player-fast-forward-button" className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 disabled:bg-transparent disabled:text-gray-400 center w-9 h-9 p-0 hidden md:flex rounded-full">
                      <svg height="1.1rem" className="shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.60615 8.98725C4.91012 5.50112 8.15961 3 11.995 3C15.0359 3 17.9409 4.59129 19.5003 7.09919V4.75C19.5003 4.33579 19.8361 4 20.2503 4C20.6645 4 21.0003 4.33579 21.0003 4.75V9.25C21.0003 9.66421 20.6645 10 20.2503 10H15.7503C15.3361 10 15.0003 9.66421 15.0003 9.25C15.0003 8.83579 15.3361 8.5 15.7503 8.5H18.5604C17.4104 6.11553 14.7962 4.5 11.995 4.5C8.84135 4.5 6.11613 6.55843 5.01108 9.51275C4.86597 9.90072 4.43382 10.0976 4.04586 9.95247C3.6579 9.80735 3.46103 9.37521 3.60615 8.98725Z" fill="currentColor"></path>
                        <path d="M8.16408 20.1558V13.9858H8.126L7.25637 14.6016C6.98342 14.7793 6.82473 14.8364 6.64065 14.8364C6.29152 14.8364 6.03127 14.5762 6.03127 14.2271C6.03127 13.9604 6.19631 13.7256 6.52004 13.5098L7.65627 12.7163C8.1133 12.4053 8.47512 12.2783 8.83059 12.2783C9.44631 12.2783 9.85891 12.7036 9.85891 13.3447V20.1558C9.85891 20.7397 9.54787 21.0762 9.00832 21.0762C8.47512 21.0762 8.16408 20.7334 8.16408 20.1558Z" fill="currentColor"></path>
                        <path d="M11.357 16.8804V16.4741C11.357 13.8716 12.6011 12.1704 14.6641 12.1704C16.7334 12.1704 17.9522 13.8525 17.9522 16.4741V16.8804C17.9522 19.4766 16.6953 21.1841 14.6387 21.1841C12.5821 21.1841 11.357 19.4956 11.357 16.8804ZM13.0708 16.4805V16.8677C13.0708 18.6958 13.6675 19.7876 14.6514 19.7876C15.6353 19.7876 16.232 18.6958 16.232 16.8677V16.4805C16.232 14.6587 15.6353 13.5669 14.6514 13.5669C13.6675 13.5669 13.0708 14.6523 13.0708 16.4805Z" fill="currentColor"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="hidden md:inline-flex justify-end grow w-12"></div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="w-full hstack grow flex-nowrap gap-2 -mb-3 max-md:absolute max-md:top-0 max-md:left-0 max-md:right-0 items-center">
                <span className="hidden md:block text-xs text-slate-500 w-12 text-center tabular-nums">
                  {formatTime(currentTime)}
                </span>
                
                <div className="relative flex w-full touch-none select-none items-center cursor-pointer group h-0.5 md:h-1">
                  <div className="relative z-0 h-full w-full bg-black/10 dark:bg-white/10 rounded-full max-md:rounded-none overflow-hidden">
                    <div 
                      className="absolute h-full bg-black dark:bg-white rounded-full max-md:rounded-none" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {/* Custom Thumb (visible on hover) */}
                  <div 
                    className="absolute z-30 h-2.5 w-2.5 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${progress}% - 5px)` }}
                  />
                </div>
                
                <span className="hidden md:block text-xs text-slate-500 w-12 text-center tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="hstack items-center justify-end gap-1 md:gap-2 basis-1/4">
              <button 
                title="Download"
                className="relative center w-9 h-9 p-0 rounded-[10px] hover:bg-black/5 dark:hover:bg-white/5 text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <div className="hstack items-center md:hidden ml-2 md:ml-0">
                <button 
                  onClick={() => isPlaying ? pauseTrack() : resumeTrack()}
                  data-testid="audio-player-play-button" aria-label="Play"
                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-black dark:bg-white text-white dark:text-gray-900 shadow-none hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 center h-10 w-10 p-0 rounded-full"
                >
                  <div className="absolute" style={{ opacity: 1, transform: 'none' }}>
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 w-5 h-5 translate-x-[5%]">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                </button>
              </div>

              <div className="hidden md:flex">
                <button 
                  onClick={minimizePlayer}
                  aria-label="Hide player"
                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring text-foreground bg-transparent hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 border border-transparent rounded-[10px] center w-9 h-9 p-0"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
