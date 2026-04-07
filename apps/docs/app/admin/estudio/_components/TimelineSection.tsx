'use client';

import React, { useRef, useCallback, memo } from 'react';
import { ListEnd, Play, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TimelineTrack {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  color: string;
  type?: string;
  url?: string;
  layerIndex?: number;
}

interface TimelineSectionProps {
  tracks: TimelineTrack[];
  height: number;
  onHeightChange: (h: number) => void;
  isTimelineCollapsed: boolean;
  toggleTimeline: () => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  isDragging: boolean;
  currentTime: number;
  playbackSpeed: number;
  togglePlaybackSpeed: () => void;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: () => void;
  formatTime: (s: number) => string;
  updateTrack?: (id: string, updates: Partial<TimelineTrack>) => void;
  onDeleteTracks?: (ids: string[]) => void;
  onAddTracks?: (tracks: TimelineTrack[]) => void;
  clipboardTracks?: TimelineTrack[];
  setClipboardTracks?: (tracks: TimelineTrack[]) => void;
  selectedTrackIds: string[];
  setSelectedTrackIds: React.Dispatch<React.SetStateAction<string[]>>;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

const TOOLBAR_HEIGHT = 54;
const MAX_HEIGHT_RATIO = 0.6;

// ── NEW: Real Waveform Analyzer & Renderer ──
const WaveformRenderer = memo(({ url, color }: { url: string; color: string }) => {
  const [peaks, setPeaks] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!url) return;

    let isMounted = true;
    const generateWaveform = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch audio
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        
        // 2. Decode at low sample rate for speed
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        // 3. Extract peaks (Sampling)
        const sampleCount = 200; // Number of bars to show
        const rawData = audioBuffer.getChannelData(0); // L channel
        const blockSize = Math.floor(rawData.length / sampleCount);
        const sampledPeaks = [];
        
        for (let i = 0; i < sampleCount; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }
          sampledPeaks.push(sum / blockSize);
        }
        
        // Normalize
        const max = Math.max(...sampledPeaks);
        const normalized = sampledPeaks.map(p => (p / max) * 0.8 + 0.1); // min 10% height

        if (isMounted) setPeaks(normalized);
      } catch (err) {
        console.error('[Studio] Waveform Error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    generateWaveform();
    return () => { isMounted = false; };
  }, [url]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center opacity-20 bg-blue-500/10 animate-pulse">
        <span className="text-[10px] font-mono">ANALYZING...</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-between px-1 opacity-60 pointer-events-none w-full">
      {peaks.map((p, i) => (
        <div
          key={i}
          className={cn("w-[1px] md:w-[2px] rounded-full", color)}
          style={{ height: `${p * 100}%` }}
        />
      ))}
    </div>
  );
});
WaveformRenderer.displayName = 'WaveformRenderer';

export function TimelineSection({
  tracks,
  height,
  onHeightChange,
  isTimelineCollapsed,
  toggleTimeline,
  isPlaying,
  setIsPlaying,
  isDragging,
  currentTime,
  playbackSpeed,
  togglePlaybackSpeed,
  timelineRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  formatTime,
  updateTrack,
  onDeleteTracks,
  onAddTracks,
  clipboardTracks,
  setClipboardTracks,
  selectedTrackIds,
  setSelectedTrackIds,
  audioRef,
}: TimelineSectionProps) {
  const [mutedLayers, setMutedLayers] = React.useState<number[]>([]);
  const [contextMenu, setContextMenu] = React.useState<{
    x: number;
    y: number;
    trackId: string;
  } | null>(null);

  const playheadRef = useRef<HTMLDivElement>(null);
  const timeBadgeRef = useRef<HTMLDivElement>(null);

  // ── High Performance 60FPS Playhead Animation ──
  React.useEffect(() => {
    let rafId: number;
    
    const updatePlayhead = () => {
      const audio = audioRef?.current;
      if (!audio || !playheadRef.current || !timeBadgeRef.current) return;
      
      const time = audio.currentTime;
      const x = time * 135.6;
      
      // Update DOM directly for zero-lag smooth glide
      // Removed the +16 offset to keep it perfectly aligned with track 0:0 origin
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${x}px)`;
      if (timeBadgeRef.current) {
        timeBadgeRef.current.style.transform = `translateX(${x}px)`;
        timeBadgeRef.current.innerText = formatTime(time);
      }
      
      if (isPlaying) {
        rafId = requestAnimationFrame(updatePlayhead);
      }
    };

    if (isPlaying) {
      rafId = requestAnimationFrame(updatePlayhead);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, audioRef]);
  const MIN_HEIGHT = TOOLBAR_HEIGHT + 60;
  const isResizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentHeightRef = useRef(height);

  // Close context menu on outside click
  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  // Keep ref in sync when parent changes height externally
  React.useEffect(() => {
    currentHeightRef.current = height;
  }, [height]);

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      )
        return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedTrackIds.length > 0) {
          e.preventDefault();
          onDeleteTracks?.(selectedTrackIds);
          setSelectedTrackIds([]);
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedTrackIds(tracks.map((t) => t.id));
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'x') {
        if (selectedTrackIds.length > 0) {
          e.preventDefault();
          const selected = tracks.filter((t) =>
            selectedTrackIds.includes(t.id),
          );
          setClipboardTracks?.(selected);
          onDeleteTracks?.(selectedTrackIds);
          setSelectedTrackIds([]);
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'c') {
        if (selectedTrackIds.length > 0) {
          e.preventDefault();
          setClipboardTracks?.(
            tracks.filter((t) => selectedTrackIds.includes(t.id)),
          );
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'v') {
        if (clipboardTracks && clipboardTracks.length > 0) {
          e.preventDefault();
          const clones = clipboardTracks.map((t) => ({
            ...t,
            id: Math.random().toString(36).substr(2, 9),
            startTime: currentTime,
          }));
          onAddTracks?.(clones);
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        if (selectedTrackIds.length > 0) {
          e.preventDefault();
          const selected = tracks.filter((t) =>
            selectedTrackIds.includes(t.id),
          );
          const clones = selected.map((t) => ({
            ...t,
            id: Math.random().toString(36).substr(2, 9),
            layerIndex: (t.layerIndex || 0) + 1,
          }));
          onAddTracks?.(clones);
        }
      } else if (e.key.toLowerCase() === 's') {
        // Split Shortcut
        if (selectedTrackIds.length > 0) {
          e.preventDefault();
          const selected = tracks.filter((t) =>
            selectedTrackIds.includes(t.id),
          );
          const newTracks: TimelineTrack[] = [];
          const idsToDelete: string[] = [];

          selected.forEach((track) => {
            // Only split if current time is within the track
            if (
              currentTime > track.startTime &&
              currentTime < track.startTime + track.duration
            ) {
              const firstPartDuration = currentTime - track.startTime;
              const secondPartDuration = track.duration - firstPartDuration;

              const part1: TimelineTrack = {
                ...track,
                id: Math.random().toString(36).substr(2, 9),
                duration: firstPartDuration,
              };

              const part2: TimelineTrack = {
                ...track,
                id: Math.random().toString(36).substr(2, 9),
                startTime: currentTime,
                duration: secondPartDuration,
              };

              newTracks.push(part1, part2);
              idsToDelete.push(track.id);
            }
          });

          if (newTracks.length > 0) {
            onDeleteTracks?.(idsToDelete);
            onAddTracks?.(newTracks);
            setSelectedTrackIds(newTracks.map((t) => t.id));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    tracks,
    selectedTrackIds,
    clipboardTracks,
    currentTime,
    onAddTracks,
    onDeleteTracks,
    setClipboardTracks,
  ]);

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;
    const { trackId } = contextMenu;
    const clickedTrack = tracks.find((t) => t.id === trackId);

    switch (action) {
      case 'download': {
        if (clickedTrack?.url) {
          const a = document.createElement('a');
          a.href = clickedTrack.url;
          a.download = clickedTrack.name;
          a.click();
        }
        break;
      }
      case 'copy': {
        const selected = tracks.filter((t) => selectedTrackIds.includes(t.id));
        setClipboardTracks?.(
          selected.length > 0 ? selected : clickedTrack ? [clickedTrack] : [],
        );
        break;
      }
      case 'paste': {
        if (clipboardTracks && clipboardTracks.length > 0) {
          const clones = clipboardTracks.map((t) => ({
            ...t,
            id: Math.random().toString(36).substr(2, 9),
            startTime: currentTime,
          }));
          onAddTracks?.(clones);
        }
        break;
      }
      case 'duplicate': {
        const selected = tracks.filter((t) => selectedTrackIds.includes(t.id));
        const toDup =
          selected.length > 0 ? selected : clickedTrack ? [clickedTrack] : [];
        const clones = toDup.map((t) => ({
          ...t,
          id: Math.random().toString(36).substr(2, 9),
          layerIndex: (t.layerIndex || 0) + 1,
        }));
        onAddTracks?.(clones);
        break;
      }
      case 'select_after': {
        if (clickedTrack) {
          const afterIds = tracks
            .filter((t) => t.startTime >= clickedTrack.startTime)
            .map((t) => t.id);
          setSelectedTrackIds(afterIds);
        }
        break;
      }
      case 'select_before': {
        if (clickedTrack) {
          const beforeIds = tracks
            .filter((t) => t.startTime <= clickedTrack.startTime)
            .map((t) => t.id);
          setSelectedTrackIds(beforeIds);
        }
        break;
      }
      case 'delete': {
        onDeleteTracks?.(
          selectedTrackIds.length > 0 ? selectedTrackIds : [trackId],
        );
        setSelectedTrackIds([]);
        break;
      }
      case 'comment':
      case 'shortcuts': {
        window.alert(action + ' is a placeholder interface');
        break;
      }
    }
    setContextMenu(null);
  };

  const kbdClass =
    'font-sans h-4 inline-flex justify-center items-center whitespace-nowrap text-fd-muted-foreground opacity-60';
  const shortcutSpanClass =
    'inline-flex items-center cursor-default text-[10px] gap-1 ml-auto';

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isTimelineCollapsed) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      isResizingRef.current = true;
      const startY = e.clientY;
      const startHeight = currentHeightRef.current;

      // Kill CSS transition during drag for zero-lag response
      if (containerRef.current) {
        containerRef.current.style.transition = 'none';
      }

      const onMove = (ev: PointerEvent) => {
        if (!isResizingRef.current) return;
        const delta = startY - ev.clientY;
        const maxH = window.innerHeight * MAX_HEIGHT_RATIO;
        const newHeight = Math.max(
          MIN_HEIGHT,
          Math.min(maxH, startHeight + delta),
        );
        currentHeightRef.current = newHeight;
        // Direct DOM update — zero React re-renders during drag
        if (containerRef.current) {
          containerRef.current.style.height = `${newHeight}px`;
        }
      };

      const onUp = () => {
        isResizingRef.current = false;
        // Restore CSS transition after releasing
        if (containerRef.current) {
          containerRef.current.style.transition = '';
        }
        // Sync React state only once on release
        onHeightChange(currentHeightRef.current);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [isTimelineCollapsed, onHeightChange],
  );

  const effectiveHeight = isTimelineCollapsed ? TOOLBAR_HEIGHT : height;

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-background w-full flex-shrink-0"
      style={{
        height: effectiveHeight,
        transition: 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'height',
      }}
    >
      <div className="flex flex-col w-full relative shrink-0">
        {/* Resize Handle */}
        <div
          className={cn(
            'absolute h-3 -top-1.5 w-full select-none group flex items-center z-20 touch-none',
            isTimelineCollapsed ? 'cursor-default' : 'cursor-row-resize',
          )}
          style={{ overscrollBehavior: 'none' }}
          onPointerDown={handleResizePointerDown}
        >
          <div className="h-px w-full bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity delay-75"></div>
        </div>

        {/* Timeline Toolbar */}
        <div
          className="relative grid px-4 border-b bg-background flex-shrink-0 py-2 border-t"
          style={{
            gridTemplateColumns: '1fr 2fr 1fr',
            transform: 'none',
            transformOrigin: '50% 50% 0px',
          }}
        >
          {/* Left: Split + mobile speed */}
          <div className="flex w-full items-center">
            <div className="flex items-center gap-1">
              <button
                aria-label="Split clip"
                data-state="closed"
                data-agent-tooltip="Split clip at current time"
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 active:bg-gray-alpha-200 rounded-[10px] center p-0 h-9 w-9"
              >
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
                  className="shrink-0 w-[18px] h-[18px] w-5 h-5"
                >
                  <path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3"></path>
                  <path d="M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3"></path>
                  <line x1="12" x2="12" y1="4" y2="20"></line>
                </svg>
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button
                aria-label="Playing until end"
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 active:bg-gray-alpha-200 rounded-[10px] center p-0 h-9 w-9"
              >
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
                  className="shrink-0 w-[18px] h-[18px] w-4 h-4"
                >
                  <path d="M16 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M10 18H3"></path>
                  <path d="M21 6v10a2 2 0 0 1-2 2h-5"></path>
                  <path d="m16 16-2 2 2 2"></path>
                </svg>
              </button>
              <button
                onClick={togglePlaybackSpeed}
                aria-label={`Playback speed ${playbackSpeed.toFixed(1)}x`}
                className="whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 active:bg-gray-alpha-200 h-9 rounded-[10px] text-xs flex items-center relative p-0 justify-center"
              >
                <div className="flex items-center w-12 shrink-0 relative">
                  <div
                    className="absolute inset-0 flex items-center justify-center font-num transition-all"
                    style={{ opacity: 1, transform: 'none' }}
                  >
                    {playbackSpeed.toFixed(1)}x
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="grid gap-1 mx-auto md:grid-cols-3 grid-cols-1">
            <div className="hidden md:flex items-center justify-end gap-2 w-full">
              <button
                aria-label="Playing until end"
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 active:bg-gray-alpha-200 rounded-[10px] center p-0 h-9 w-9"
              >
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
                  className="shrink-0 w-[18px] h-[18px] w-4 h-4"
                >
                  <path d="M16 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M10 18H3"></path>
                  <path d="M21 6v10a2 2 0 0 1-2 2h-5"></path>
                  <path d="m16 16-2 2 2 2"></path>
                </svg>
              </button>
              <button
                onClick={togglePlaybackSpeed}
                aria-label={`Playback speed ${playbackSpeed.toFixed(1)}x`}
                className="whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 active:bg-gray-alpha-200 h-9 rounded-[10px] text-xs flex items-center relative p-0 justify-center"
              >
                <div className="flex items-center w-12 shrink-0 relative">
                  <div
                    className="absolute inset-0 flex items-center justify-center font-num transition-all"
                    style={{ opacity: 1, transform: 'none' }}
                  >
                    {playbackSpeed.toFixed(1)}x
                  </div>
                </div>
              </button>
            </div>

            <div className="flex items-center md:gap-2 justify-center">
              <button
                aria-label="Skip backward"
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:text-gray-400 rounded-[10px] center p-0 h-9 w-9"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                  className="shrink-0 w-[18px] h-[18px] w-5 h-5"
                >
                  <path
                    d="M4.16536 4.16699V15.8337M13.8423 4.39582L7.19745 8.99491C6.48803 9.48599 6.48803 10.5147 7.19745 11.0057L13.8423 15.6048C14.6773 16.1828 15.832 15.5993 15.832 14.5994V5.40121C15.832 4.40132 14.6773 3.81787 13.8423 4.39582Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-black text-white dark:bg-white dark:text-black shadow-none hover:bg-gray-800 disabled:bg-gray-400 disabled:text-gray-100 rounded-full center h-10 w-10 p-0 shrink-0"
              >
                <div className="absolute">
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="shrink-0 w-5 h-5"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="shrink-0 w-[18px] h-[18px] translate-x-[5%]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </div>
              </button>
              <button
                aria-label="Skip forward"
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:text-gray-400 rounded-[10px] center p-0 h-9 w-9"
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                  className="shrink-0 w-[18px] h-[18px] w-5 h-5"
                >
                  <path
                    d="M15.8346 4.16699V15.8337M6.15769 4.39582L12.8026 8.99491C13.512 9.48599 13.512 10.5147 12.8026 11.0057L6.15769 15.6048C5.32265 16.1828 4.16797 15.5993 4.16797 14.5994V5.40121C4.16797 4.40132 5.32265 3.81787 6.15769 4.39582Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="text-xs tabular-nums hidden gap-1 md:flex font-medium pl-3 items-center text-fd-muted-foreground shrink-0">
              {formatTime(currentTime)}
              <span className="text-gray-400">/</span>
              {tracks.length > 0
                ? `0:${Math.max(
                    ...tracks.map((t) => Math.ceil(t.startTime + t.duration)),
                  )
                    .toString()
                    .padStart(2, '0')}`
                : '0:10'}
            </div>
          </div>

          {/* Right: Zoom + Collapse */}
          <div className="flex items-center justify-end w-full ml-auto">
            <button
              aria-label="Zoom out"
              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:text-gray-400 rounded-[10px] center p-0 h-9 w-9"
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                className="shrink-0 w-[18px] h-[18px] w-5 h-5"
              >
                <path
                  d="M5.83203 10H9.9987H14.1654"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
            <span
              dir="ltr"
              className="relative touch-none select-none items-center cursor-pointer w-16 hidden md:flex"
              style={
                { '--radix-slider-thumb-transform': 'translateX(-50%)' } as any
              }
            >
              <span className="relative grow overflow-hidden rounded-full bg-fd-accent w-full h-0.5">
                <span
                  className="absolute bg-fd-primary h-full"
                  style={{ left: '0%', right: '100%' }}
                ></span>
              </span>
              <span
                style={{
                  transform: 'var(--radix-slider-thumb-transform)',
                  position: 'absolute',
                  left: 'calc(0% + 4px)',
                }}
              >
                <span className="block scale-100 hover:scale-110 transition-transform rounded-full duration-100 focus-ring disabled:pointer-events-none disabled:opacity-50 w-2 h-2 bg-black dark:bg-white"></span>
              </span>
            </span>
            <button
              aria-label="Zoom in"
              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-fd-accent rounded-[10px] center p-0 h-9 w-9"
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                className="shrink-0 w-[18px] h-[18px] w-5 h-5"
              >
                <path
                  d="M9.9987 5.83301V9.99967M9.9987 9.99967V14.1663M9.9987 9.99967H5.83203M9.9987 9.99967H14.1654"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
            <button
              onClick={toggleTimeline}
              aria-label={
                isTimelineCollapsed ? 'Expand timeline' : 'Collapse timeline'
              }
              data-agent-tooltip={isTimelineCollapsed ? 'Expand' : 'Collapse'}
              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 rounded-[10px] center h-9 w-9 p-0"
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                className="shrink-0 w-5 h-5"
              >
                <path
                  d="M13.4269 2.85742H6.56975C4.51841 2.85742 2.85547 4.52036 2.85547 6.57171V13.4289C2.85547 15.4802 4.51841 17.1431 6.56975 17.1431H13.4269C15.4782 17.1431 17.1412 15.4802 17.1412 13.4289V6.57171C17.1412 4.52036 15.4782 2.85742 13.4269 2.85742Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></path>
                {isTimelineCollapsed ? (
                  <rect
                    x="5.5"
                    y="9.5"
                    width="9"
                    height="5"
                    rx="1.5"
                    fill="currentColor"
                  ></rect>
                ) : (
                  <rect
                    x="5.5"
                    y="12.5"
                    width="9"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  ></rect>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Tracks Area */}
      <div
        className={cn(
          'relative flex-1 bg-background overflow-auto transition-opacity duration-300',
          isTimelineCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
      >
        <div className="flex flex-col items-end min-w-max h-full">
          <div className="relative flex w-full h-full shrink-0 grow-0">
            {/* Sticky track sidebar */}
            <div className="flex flex-col shrink-0 md:sticky left-0 z-30 w-12 border-r border-fd-border bg-background">
              <div className="h-5 mb-[6px] border-b border-fd-border bg-background"></div>
              <div className="flex flex-col w-full">
                {(() => {
                  const maxLayer = Math.max(
                    2,
                    ...tracks.map((t) => t.layerIndex || 0),
                  );
                  const rows = Array.from({ length: maxLayer + 1 });
                  return rows.map((_, i) => {
                    const isMuted = mutedLayers.includes(i);
                    const hasTracksInLayer = tracks.some(
                      (t) => (t.layerIndex || 0) === i,
                    );

                    return (
                      <div
                        key={`mute-${i}`}
                        className={cn(
                          'flex items-center justify-center py-0.5 transition-colors',
                          hasTracksInLayer
                            ? 'border-b border-gray-alpha-100'
                            : 'border-none',
                        )}
                        style={{ height: 45 }}
                      >
                        {hasTracksInLayer && (
                          <button
                            onClick={() =>
                              setMutedLayers((prev) =>
                                isMuted
                                  ? prev.filter((l) => l !== i)
                                  : [...prev, i],
                              )
                            }
                            aria-label={isMuted ? 'Unmute layer' : 'Mute layer'}
                            className={cn(
                              'relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent rounded-md text-xs h-6 w-6 group',
                              isMuted
                                ? 'text-fd-muted-foreground/50'
                                : 'text-foreground hover:bg-gray-alpha-100',
                            )}
                          >
                            {isMuted ? (
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
                                className="lucide lucide-volume-off shrink-0 w-3.5 h-3.5 opacity-50 group-hover:opacity-100"
                              >
                                <path d="m2 2 20 20"></path>
                                <path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11"></path>
                                <path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686"></path>
                                <path d="M16 13.293A5 5 0 0 0 16 9"></path>
                                <path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>
                              </svg>
                            ) : (
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
                                className="lucide lucide-volume2 shrink-0 w-3.5 h-3.5"
                              >
                                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path>
                                <path d="M16 9a5 5 0 0 1 0 6"></path>
                                <path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path>
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div
                id="timeline-tracks"
                ref={timelineRef}
                className="relative flex flex-col w-full flex-1 cursor-pointer select-none"
                style={{ padding: '0px 0px 4px' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const data = e.dataTransfer.getData('application/json');
                  if (!data || !timelineRef.current) return;

                  try {
                    const file = JSON.parse(data);
                    const rect = timelineRef.current.getBoundingClientRect();
                    const dropX = e.clientX - rect.left - 12; // Compensate for sidebar
                    const dropY = e.clientY - rect.top - 20; // Compensate for ruler

                    const dropTime = Math.max(0, dropX / 135.6);
                    const dropLayer = Math.max(0, Math.floor(dropY / 45));

                    const newTrack: TimelineTrack = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: file.name,
                      duration: file.type?.startsWith('audio/') ? 10 : 5,
                      startTime: dropTime,
                      color: 'bg-blue-100',
                      type: file.type,
                      url: file.url,
                      layerIndex: dropLayer,
                    };

                    onAddTracks?.([newTrack]);
                    setSelectedTrackIds([newTrack.id]);
                  } catch (err) {
                    console.error('Failed to drop file:', err);
                  }
                }}
              >
                {/* Ruler */}
                <div
                  className="sticky top-0 bg-background z-[17]"
                  style={{ marginBottom: '6px' }}
                >
                  <div
                    className="z-[1] h-5 flex items-center relative select-none shrink-0 border-b border-gray-alpha-100"
                    style={{ width: '1366px', minHeight: '20px' }}
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0"
                      style={{ width: '1366px' }}
                    >
                      <div className="w-full h-full brightness-90 bg-striped-feint-timeline dark:invert-[0.4]"></div>
                    </div>
                    <div
                      className="relative h-full hstack items-center select-none"
                      style={{ width: '1366px' }}
                    >
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '-1px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '33.15px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '67.3px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '101.45px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '135.6px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:01
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '169.75px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '203.9px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '238.05px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '272.2px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:02
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '306.35px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '340.5px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '374.65px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '408.8px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:03
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '442.95px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '477.1px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '511.25px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '545.4px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:04
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '579.55px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '613.7px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '647.85px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '682px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:05
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '716.15px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '750.3px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '784.45px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '818.6px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:06
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '852.75px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '886.9px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '921.05px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '955.2px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:07
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '989.35px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1023.5px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1057.65px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1091.8px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:08
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1125.95px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1160.1px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1194.25px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1228.4px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:09
                        </span>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1262.55px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1296.7px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1330.85px' }}
                      >
                        <div className="w-[3px] h-[3px] rounded-full bg-gray-300"></div>
                      </div>
                      <div
                        className="absolute w-[1px] h-full center"
                        style={{ left: '1365px' }}
                      >
                        <span className="absolute text-gray-400 text-[10px] font-medium tabular-nums z-[1] bg-transparent">
                          0:10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div
                    ref={timeBadgeRef}
                    className={cn(
                      'z-[50] absolute top-0 flex items-center justify-center backdrop-blur pointer-events-none tabular-nums text-[10px] font-medium py-0.5 px-1.5',
                      !isPlaying && !isDragging && 'transition-transform duration-300 ease-out',
                    )}
                    style={{
                      width: '32px',
                      borderRadius: currentTime < 0.05 ? '0px 6px 6px 0px' : '6px',
                      backgroundColor: 'black',
                      color: 'white',
                      transform: `translateX(${currentTime * 135.6}px)`,
                    }}
                  >
                    {formatTime(currentTime)}
                  </div>
                </div>

                <div className="relative flex flex-col grow-0"></div>
                <div className="relative flex flex-col grow-0"></div>
                <div className="relative flex flex-col grow-0"></div>

                  {/* Playhead line */}
                  <div
                    ref={playheadRef}
                    className={cn(
                      'z-[15] absolute top-0 h-full w-[1px] pointer-events-none',
                      !isPlaying && 'transition-transform duration-75 ease-out'
                    )}
                    style={{
                      backgroundColor: 'hsl(var(--foreground))',
                      transform: `translateX(${currentTime * 135.6}px)`,
                    }}
                  >
                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-foreground" />
                  </div>

                <div
                  className="h-full bg-background flex-1 relative"
                  style={{ padding: '0px' }}
                >
                  {tracks.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none mt-8"></div>
                  ) : (
                    <div className="relative w-full mb-10 min-h-[135px]">
                      {(() => {
                        const maxLayer = Math.max(
                          2,
                          ...tracks.map((t) => t.layerIndex || 0),
                        );
                        const rows = Array.from({ length: maxLayer + 1 });

                        const isColliding = (
                          ignoreTrackId: string,
                          testStart: number,
                          testDuration: number,
                          testLayer: number,
                        ) => {
                          return tracks.some((t) => {
                            if (t.id === ignoreTrackId) return false;
                            if ((t.layerIndex || 0) !== testLayer) return false;
                            const tEnd = t.startTime + t.duration;
                            const testEnd = testStart + testDuration;
                            return (
                              testStart < tEnd - 0.05 &&
                              testEnd > t.startTime + 0.05
                            );
                          });
                        };

                        return (
                          <>
                            {/* Background lane markers */}
                            {rows.map((_, i) => (
                              <div
                                key={`bg-${i}`}
                                className="transition-all duration-150 absolute w-full border-b border-gray-alpha-100"
                                style={{ top: i * 45, height: 45 }}
                              />
                            ))}

                            {/* Clips grouped by layer sharing single namespace parent */}
                            {tracks.map((track) => {
                              const layerIndex = track.layerIndex || 0;
                              const pxWidth = Math.max(
                                30,
                                track.duration * 135.6,
                              );
                              const pxLeft = track.startTime * 135.6;
                              const isSelected = selectedTrackIds.includes(
                                track.id,
                              );

                              return (
                                <div
                                  key={track.id}
                                  className="transition-all duration-150 absolute shrink-0 grow-0 py-0.5"
                                  style={{
                                    height: 45,
                                    top: layerIndex * 45,
                                    left: 0,
                                    width: '100%',
                                  }}
                                >
                                  <div className="relative h-full">
                                    <div
                                      role="button"
                                      tabIndex={0}
                                      className="rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-gray-alpha-400 absolute h-full transition-all duration-75"
                                      style={{ left: pxLeft }}
                                      onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (
                                          !selectedTrackIds.includes(track.id)
                                        ) {
                                          setSelectedTrackIds([track.id]);
                                        }

                                        let cx = e.clientX;
                                        let cy = e.clientY;
                                        const menuW = 220;
                                        const menuH = 380;

                                        if (cx + menuW > window.innerWidth) {
                                          cx = e.clientX - menuW;
                                          if (cx < 0) cx = 10;
                                        }
                                        if (cy + menuH > window.innerHeight) {
                                          cy = e.clientY - menuH;
                                          if (cy < 0) cy = 10;
                                        }

                                        setContextMenu({
                                          x: cx,
                                          y: cy,
                                          trackId: track.id,
                                        });
                                      }}
                                      onPointerDown={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.setPointerCapture(
                                          e.pointerId,
                                        );

                                        const isMac =
                                          navigator.platform
                                            .toUpperCase()
                                            .indexOf('MAC') >= 0;
                                        const isCmdOrCtrl = isMac
                                          ? e.metaKey
                                          : e.ctrlKey;

                                        if (isCmdOrCtrl) {
                                          if (e.altKey) {
                                            if (e.shiftKey) {
                                              // Ctrl + Alt + Shift + Clique: Selecionar clipes anteriores
                                              const beforeIds = tracks
                                                .filter(
                                                  (t) =>
                                                    t.startTime <=
                                                    track.startTime,
                                                )
                                                .map((t) => t.id);
                                              setSelectedTrackIds((prev) =>
                                                Array.from(
                                                  new Set([
                                                    ...prev,
                                                    ...beforeIds,
                                                  ]),
                                                ),
                                              );
                                            } else {
                                              // Ctrl + Alt + Clique: Selecionar próximos clipes
                                              const afterIds = tracks
                                                .filter(
                                                  (t) =>
                                                    t.startTime >=
                                                    track.startTime,
                                                )
                                                .map((t) => t.id);
                                              setSelectedTrackIds((prev) =>
                                                Array.from(
                                                  new Set([
                                                    ...prev,
                                                    ...afterIds,
                                                  ]),
                                                ),
                                              );
                                            }
                                          } else {
                                            // Ctrl + Clique: Multiseleção individual
                                            setSelectedTrackIds((prev) =>
                                              prev.includes(track.id)
                                                ? prev.filter(
                                                    (id) => id !== track.id,
                                                  )
                                                : [...prev, track.id],
                                            );
                                          }
                                        } else {
                                          if (
                                            !selectedTrackIds.includes(track.id)
                                          ) {
                                            setSelectedTrackIds([track.id]);
                                          }
                                        }

                                        const startX = e.clientX;
                                        const startY = e.clientY;
                                        const startOffset = track.startTime;
                                        const startLayerIdx =
                                          track.layerIndex || 0;

                                        const onMove = (ev: PointerEvent) => {
                                          const deltaX = ev.clientX - startX;
                                          const deltaSeconds = deltaX / 135.6;
                                          const deltaY = ev.clientY - startY;
                                          const layerShift = Math.round(
                                            deltaY / 45,
                                          );

                                          let newStart =
                                            startOffset + deltaSeconds;
                                          if (newStart < 0) newStart = 0;

                                          let newLayer =
                                            startLayerIdx + layerShift;
                                          if (newLayer < 0) newLayer = 0;

                                          // Collision checking
                                          if (
                                            !isColliding(
                                              track.id,
                                              newStart,
                                              track.duration,
                                              newLayer,
                                            )
                                          ) {
                                            updateTrack?.(track.id, {
                                              startTime: newStart,
                                              layerIndex: newLayer,
                                            });
                                          } else if (
                                            !isColliding(
                                              track.id,
                                              startOffset,
                                              track.duration,
                                              newLayer,
                                            )
                                          ) {
                                            updateTrack?.(track.id, {
                                              layerIndex: newLayer,
                                            }); // X is blocked, allow Y
                                          } else if (
                                            !isColliding(
                                              track.id,
                                              newStart,
                                              track.duration,
                                              startLayerIdx,
                                            )
                                          ) {
                                            updateTrack?.(track.id, {
                                              startTime: newStart,
                                            }); // Y is blocked, allow X
                                          }
                                        };
                                        const onUp = () => {
                                          window.removeEventListener(
                                            'pointermove',
                                            onMove,
                                          );
                                          window.removeEventListener(
                                            'pointerup',
                                            onUp,
                                          );
                                        };
                                        window.addEventListener(
                                          'pointermove',
                                          onMove,
                                        );
                                        window.addEventListener(
                                          'pointerup',
                                          onUp,
                                        );
                                      }}
                                    >
                                      <div className="duration-150 absolute transition-all border-l-2 border-transparent hover:bg-white/10 dark:hover:bg-black/10 hover:border-l-fd-primary h-full w-[20px] max-w-[25%] -left-0.5 z-10 cursor-ew-resize"></div>
                                      <div className="duration-150 absolute transition-all border-r-2 border-transparent hover:bg-white/10 dark:hover:bg-black/10 hover:border-r-fd-primary h-full w-[20px] max-w-[25%] -right-0.5 z-10 cursor-ew-resize"></div>

                                      <div
                                        className="h-full items-center select-none flex relative group rounded-lg transition-all duration-75"
                                        style={
                                          isSelected
                                            ? {
                                                width: pxWidth,
                                                outline:
                                                  '2px solid hsl(var(--studio-blue-600, 217 91% 60%))',
                                                outlineOffset: '-1px',
                                              }
                                            : { width: pxWidth }
                                        }
                                      >
                                        <div
                                          className="h-full w-full flex items-center overflow-hidden relative rounded-lg cursor-grab active:cursor-grabbing"
                                          style={{
                                            background: isSelected
                                              ? 'hsl(var(--studio-blue-100, 214 100% 91%))'
                                              : 'hsl(var(--studio-blue-50, 214 100% 95%))',
                                            border:
                                              '1px solid hsl(var(--studio-blue-600, 217 91% 60%))',
                                            opacity: mutedLayers.includes(
                                              layerIndex,
                                            )
                                              ? 0.4
                                              : 1,
                                          }}
                                        >
                                          <div className="flex w-full items-center self-start truncate gap-1 px-2 pt-1 z-[2]">
                                            <p className="text-foreground line-clamp-1 font-medium text-xs dark:text-black">
                                              {track.name}
                                            </p>
                                          </div>

                                          <div className="absolute inset-0 flex items-end overflow-hidden pointer-events-none">
                                            <div
                                              className="absolute inset-0 w-full h-full"
                                              style={{ opacity: 1 }}
                                            >
                                              {/* Simulated native waveform in background */}
                                              {track.type?.startsWith(
                                                'image/',
                                              ) ||
                                              /\.(jpg|jpeg|png|gif|webp)$/i.test(
                                                track.name,
                                              ) ? (
                                                track.url && (
                                                  <div className="absolute inset-0 flex items-center justify-center opacity-50 overflow-hidden">
                                                    <img
                                                      src={track.url}
                                                      alt=""
                                                      className="w-full h-full object-cover"
                                                    />
                                                  </div>
                                                )
                                              ) : track.type?.startsWith(
                                                  'video/',
                                                ) ||
                                                /\.(mp4|webm|mkv|mov)$/i.test(
                                                  track.name,
                                                ) ? (
                                                track.url && (
                                                  <div className="absolute inset-0 flex items-center justify-center opacity-50 overflow-hidden bg-black/10">
                                                    <video
                                                      src={track.url}
                                                      className="w-[120%] h-full object-cover"
                                                    />
                                                  </div>
                                                )
                                              ) : (
                                                  <WaveformRenderer 
                                                    url={track.url || ''} 
                                                    color={isSelected ? 'bg-blue-800' : 'bg-blue-600'} 
                                                  />
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Resizers */}
                                        <div className="w-3 px-1 py-1 group cursor-ew-resize absolute left-px top-0 bottom-0 z-10 my-[3px]">
                                          <div
                                            className="h-full w-full rounded-xl"
                                            style={
                                              isSelected
                                                ? {
                                                    backgroundColor:
                                                      'hsl(var(--studio-blue-600, 217 91% 60%))',
                                                  }
                                                : {}
                                            }
                                          ></div>
                                        </div>
                                        <div
                                          className="w-3 px-1 py-1 group cursor-ew-resize absolute right-px top-0 bottom-0 z-10 my-[3px]"
                                          onPointerDown={(e) => {
                                            e.stopPropagation();
                                            e.currentTarget.setPointerCapture(
                                              e.pointerId,
                                            );
                                            if (
                                              !selectedTrackIds.includes(
                                                track.id,
                                              )
                                            ) {
                                              setSelectedTrackIds([track.id]);
                                            }

                                            const startX = e.clientX;
                                            const startDuration =
                                              track.duration;

                                            const onMove = (
                                              ev: PointerEvent,
                                            ) => {
                                              const deltaX =
                                                ev.clientX - startX;
                                              const deltaSeconds =
                                                deltaX / 135.6;
                                              let newDuration =
                                                startDuration + deltaSeconds;
                                              if (newDuration < 0.5)
                                                newDuration = 0.5; // Min size safety

                                              // Ensure we don't extend into another clip
                                              if (
                                                !isColliding(
                                                  track.id,
                                                  track.startTime,
                                                  newDuration,
                                                  track.layerIndex || 0,
                                                )
                                              ) {
                                                updateTrack?.(track.id, {
                                                  duration: newDuration,
                                                });
                                              }
                                            };
                                            const onUp = () => {
                                              window.removeEventListener(
                                                'pointermove',
                                                onMove,
                                              );
                                              window.removeEventListener(
                                                'pointerup',
                                                onUp,
                                              );
                                            };
                                            window.addEventListener(
                                              'pointermove',
                                              onMove,
                                            );
                                            window.addEventListener(
                                              'pointerup',
                                              onUp,
                                            );
                                          }}
                                        >
                                          <div
                                            className="h-full w-full rounded-xl"
                                            style={
                                              isSelected
                                                ? {
                                                    backgroundColor:
                                                      'hsl(var(--studio-blue-600, 217 91% 60%))',
                                                  }
                                                : {}
                                            }
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          data-radix-popper-content-wrapper=""
          dir="ltr"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            transform: `translate(${contextMenu.x}px, ${contextMenu.y}px)`,
            minWidth: 'max-content',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            data-side="top"
            data-align="start"
            role="menu"
            aria-orientation="vertical"
            data-state="open"
            dir="ltr"
            className="z-50 bg-white dark:bg-black border shadow-xl text-foreground p-1 rounded-[10px] min-w-[12rem] flex flex-col animate-in fade-in-0 zoom-in-95 duration-100"
            tabIndex={-1}
          >
            <div
              role="menuitem"
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
              onClick={() => handleContextMenuAction('download')}
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-download shrink-0 w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Download
              </div>
            </div>

            <div
              role="menuitem"
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
              onClick={() => handleContextMenuAction('copy')}
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-copy shrink-0 w-4 h-4"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                Copy
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>C</kbd>
              </span>
            </div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('paste')}
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-clipboard shrink-0 w-4 h-4"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                </svg>
                Paste
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>V</kbd>
              </span>
            </div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('duplicate')}
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-copy-plus shrink-0 w-4 h-4"
                >
                  <line x1="15" x2="15" y1="12" y2="18"></line>
                  <line x1="12" x2="18" y1="15" y2="15"></line>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
                Duplicate
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>D</kbd>
              </span>
            </div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('comment')}
              className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg"
            >
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
                className="lucide lucide-message-square-plus mr-2 h-4 w-4"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M12 7v6"></path>
                <path d="M9 10h6"></path>
              </svg>
              <span>Comment</span>
            </div>

            <div
              role="separator"
              aria-orientation="horizontal"
              className="h-px bg-border -mx-1 my-1"
            ></div>

            <div
              role="menuitem"
              onClick={() =>
                window.alert('You can hold CTRL/CMD and click tracks')
              }
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-mouse-pointer-click shrink-0 w-4 h-4"
                >
                  <path d="M14 4.1 12 6"></path>
                  <path d="m5.1 8-2.9-.8"></path>
                  <path d="m6 12-1.9 2"></path>
                  <path d="M7.2 2.2 8 5.1"></path>
                  <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"></path>
                </svg>
                Multi-select
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>Click</kbd>
              </span>
            </div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('select_after')}
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-list-plus shrink-0 w-4 h-4"
                >
                  <path d="M11 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M16 18H3"></path>
                  <path d="M18 9v6"></path>
                  <path d="M21 12h-6"></path>
                </svg>
                Select after
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>⌥</kbd>
                <kbd className={kbdClass}>Click</kbd>
              </span>
            </div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('select_before')}
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-list-plus shrink-0 w-4 h-4 transform scale-x-[-1]"
                >
                  <path d="M11 12H3"></path>
                  <path d="M16 6H3"></path>
                  <path d="M16 18H3"></path>
                  <path d="M18 9v6"></path>
                  <path d="M21 12h-6"></path>
                </svg>
                Select before
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Ctrl</kbd>
                <kbd className={kbdClass}>⌥</kbd>
                <kbd className={kbdClass}>⇧</kbd>
                <kbd className={kbdClass}>Click</kbd>
              </span>
            </div>

            <div
              role="separator"
              aria-orientation="horizontal"
              className="h-px bg-border -mx-1 my-1"
            ></div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('shortcuts')}
              className="relative transition-colors focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-fd-accent/50 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-keyboard shrink-0 w-4 h-4"
                >
                  <path d="M10 8h.01"></path>
                  <path d="M12 12h.01"></path>
                  <path d="M14 8h.01"></path>
                  <path d="M16 12h.01"></path>
                  <path d="M18 8h.01"></path>
                  <path d="M6 8h.01"></path>
                  <path d="M7 16h10"></path>
                  <path d="M8 12h.01"></path>
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                </svg>
                Shortcuts
              </div>
            </div>

            <div
              role="separator"
              aria-orientation="horizontal"
              className="h-px bg-border -mx-1 my-1"
            ></div>

            <div
              role="menuitem"
              onClick={() => handleContextMenuAction('delete')}
              className="relative transition-colors text-red-500 focus:text-foreground w-full cursor-pointer select-none outline-none hover:bg-red-500/10 hover:text-red-500 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
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
                  className="lucide lucide-trash shrink-0 w-4 h-4"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Delete
              </div>
              <span className={shortcutSpanClass}>
                <kbd className={kbdClass}>Del</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
