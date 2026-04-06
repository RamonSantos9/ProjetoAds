'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Upload, Mic, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/cn';
import { RecordingPopover } from './RecordingPopover';
import { UploadedFile } from '@/lib/db';


interface FilesPanelProps {
  onUpload?: (files: FileList | File[]) => void;
  onDeleteAsset?: (assetId: string) => void;
  onAddTrack?: (file: UploadedFile, duration: number) => void;
  assets?: UploadedFile[];
}

export function FilesPanel({ onUpload, onDeleteAsset, onAddTrack, assets = [] }: FilesPanelProps) {
  const [tab, setTab] = useState<'project' | 'workspace'>('project');
  const [search, setSearch] = useState('');
  const [recorderAnchor, setRecorderAnchor] = useState<HTMLElement | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onUpload?.(e.target.files);
  };

  const handleRecordingComplete = (blob: Blob, filename: string) => {
    // User requested "todos aparecem no File list com o mesmo nome de Recording.mp4"
    const finalName = 'Recording.mp4';
    const file = new File([blob], finalName, { type: blob.type });
    onUpload?.([file]);
    setRecorderAnchor(null);
  };

  const filteredFiles = assets.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Hidden file input */}
      <input
        ref={uploadRef}
        type="file"
        className="hidden"
        accept="video/mp4,audio/mp3,audio/mpeg,audio/wav,audio/flac,audio/aac,audio/m4a,audio/mp4,audio/opus,image/png,image/jpeg,image/gif,image/webp"
        multiple
        onChange={handleUploadChange}
      />

      {/* Recording Popover */}
      <RecordingPopover
        isOpen={Boolean(recorderAnchor)}
        anchorEl={recorderAnchor}
        onClose={() => setRecorderAnchor(null)}
        onRecordingComplete={handleRecordingComplete}
      />

      {/* ── Sticky Header ── */}
      <div
        data-sidebar-header="true"
        className="flex items-center justify-between px-3.5 h-11 shrink-0 sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-fd-border"
      >
          <span className="text-sm font-medium text-foreground cursor-default select-none">Files</span>

          <div className="flex items-center gap-0.5">
            {/* Mic — opens Recording Popover */}
            <button
              ref={micButtonRef}
              type="button"
              aria-label="New audio recording"
            title="Nova gravação de áudio"
              onClick={(e) => setRecorderAnchor(recorderAnchor ? null : e.currentTarget)}
              className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-lg font-medium transition-colors focus-visible:outline-none",
                Boolean(recorderAnchor)
                  ? "bg-fd-accent text-foreground"
                : "text-fd-muted-foreground hover:bg-fd-accent hover:text-foreground"
              )}
            >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1428 14.9189C12.2195 14.9189 14.0042 13.6181 14.7857 11.7568M10.1428 14.9189C8.06619 14.9189 6.28147 13.6181 5.5 11.7568M10.1428 14.9189V16.5M10.1428 12.6351C8.55793 12.6351 7.27311 11.298 7.27311 9.64865V6.48649C7.27311 4.8371 8.55793 3.5 10.1428 3.5C11.7277 3.5 13.0126 4.8371 13.0126 6.48649V9.64865C13.0126 11.298 11.7277 12.6351 10.1428 12.6351Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Upload */}
            <button
              type="button"
              aria-label="Upload to the project"
            title="Enviar arquivo"
              onClick={() => uploadRef.current?.click()}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-fd-muted-foreground hover:bg-fd-accent hover:text-foreground transition-colors"
            >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4V12M10 4L13 7M10 4L7 7M17 11.3333V13.4545C17 14.8604 15.8604 16 14.4545 16H5.54545C4.13964 16 3 14.8604 3 13.4545V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
        </div>
      </div>

      {/* ── Sticky Search ── */}
      <div
        data-sidebar-search="true"
        className="sticky top-11 z-10 flex shrink-0 items-center h-11 bg-background/95 backdrop-blur-xl border-b border-fd-border"
      >
          <div className="relative flex items-center h-full grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fd-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar..."
            className="h-full w-full pl-9 pr-3.5 text-sm bg-transparent border-none outline-none ring-0 placeholder:text-fd-muted-foreground focus:outline-none focus:ring-0"
            />
        </div>
      </div>

      {/* ── Tab Toggle ── */}
      <div className="px-3.5 pt-3.5 pb-2 shrink-0">
        <div
          role="radiogroup"
          aria-required="false"
          className="flex gap-0.5 p-1 rounded-[10px] bg-fd-accent/60 text-xs w-full"
        >
          {(['project', 'workspace'] as const).map(t => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 h-7 px-2 rounded-md font-medium transition-colors duration-75 cursor-pointer',
                tab === t
                  ? 'bg-white dark:bg-black border border-fd-border text-foreground shadow-sm'
                  : 'text-fd-muted-foreground hover:bg-fd-accent/40'
              )}
            >
              {t === 'project' ? 'Este projeto' : 'Workspace'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-3.5 pb-20">
        {tab === 'workspace' ? (
          <WorkspaceTabContent assets={assets} onAddTrack={onAddTrack} />
        ) : (
          <ProjectTabContent
            assets={assets}
            filteredFiles={filteredFiles}
            search={search}
            setSearch={setSearch}
            uploadRef={uploadRef}
            setRecorderAnchor={setRecorderAnchor}
            onAddTrack={onAddTrack}
            onDeleteAsset={onDeleteAsset}
          />
        )}
      </div>

    </div>
  );
}

interface AssetCardProps {
  file: UploadedFile;
  onAddTrack?: (file: UploadedFile, duration: number) => void;
  onDeleteAsset?: (assetId: string) => void;
}

function AssetCard({ file, onAddTrack, onDeleteAsset }: AssetCardProps) {
  const [bars, setBars] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!file.url || !file.type.startsWith('audio')) return;
    
    let isCancelled = false;
    const fetchWaveform = async () => {
      try {
        const response = await fetch(file.url!);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (isCancelled) return;
        
        setDuration(audioBuffer.duration);
        const rawData = audioBuffer.getChannelData(0); 
        const samples = 35; // 35 vertical lines for aesthetics
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < Math.min(blockSize, rawData.length - blockStart); j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }
        
        const multiplier = Math.max(...filteredData) || 1;
        // Normalize heights between 10% and 90%
        const normalized = filteredData.map(n => Math.max(10, (n / multiplier) * 90));
        setBars(normalized);
      } catch (err) {
        console.error("Error generating waveform:", err);
      }
    };
    
    fetchWaveform();
    return () => { isCancelled = true; };
  }, [file.url, file.type]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const fakeBars = bars.length > 0 ? bars : [20,30,40,30,30,40,50,60,70,50,45,40,30,40,50,80,60,70,80,90,85,90,70,60,50,70,80,90,85,75,60,50,40,30,20];

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-1 group/asset-item relative" ref={cardRef}>
      <div 
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify(file));
          e.dataTransfer.effectAllowed = 'copy';
        }}
        className="aspect-[16/9] shrink-0 w-full bg-fd-accent/50 rounded-[10px] flex items-center justify-center overflow-hidden relative group/item cursor-pointer"
        onClick={togglePlay}
        title={isPlaying ? "Pause" : "Play"}
      >
        <div role="gridcell" tabIndex={-1} aria-disabled="false" className="w-full h-full flex">
          <div className="flex w-full h-full relative">
            {file.type?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <div className="w-full h-full flex items-center justify-center">
                <img src={file.url} alt={file.name} className="max-w-full max-h-full h-auto w-auto rounded-[4px] object-contain pointer-events-none" />
              </div>
            ) : (
              <div className={cn("w-full h-full pointer-events-none transition-opacity duration-200 flex items-center justify-center py-4 gap-[1px]", isPlaying ? "opacity-100" : "opacity-80")}>
                {fakeBars.map((h, i) => (
                  <div key={i} className={cn("w-[3px] rounded-full transition-all duration-300", isPlaying ? "bg-foreground/50 dark:bg-foreground/60" : "bg-gray-300 dark:bg-gray-600")} style={{ height: `${h}%` }} />
                ))}
                {file.url && (
                  <audio 
                    ref={audioRef}
                    src={file.url} 
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden" 
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute top-1.5 right-1.5 z-[20]" onClick={e => e.stopPropagation()}>
          <div className={cn("justify-self-end flex items-center transition-all duration-75", isMenuOpen ? "opacity-100 translate-x-0" : "md:opacity-0 group-hover/item:opacity-100 md:translate-x-1 group-hover/item:translate-x-0")}>
            <div className="flex w-full items-center shadow-sm rounded-md bg-white dark:bg-black h-7 pointer-events-auto border border-fd-border relative">
              <button
                aria-disabled="false"
                onClick={() => onAddTrack && onAddTrack(file, duration || 10)}
                className="relative inline-flex items-center justify-center whitespace-nowrap bg-transparent text-xs px-2 rounded-l-md font-medium h-full border-r border-fd-border hover:bg-fd-accent text-fd-muted-foreground hover:text-foreground transition-all duration-75 active:scale-90 cursor-pointer"
                title="Add to timeline"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M8.0045 3.5L8.0045 12.5M12.5 8.0045L3.5 8.0045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative inline-flex items-center justify-center whitespace-nowrap bg-transparent text-xs px-2 rounded-r-md font-medium h-full hover:bg-fd-accent text-fd-muted-foreground hover:text-foreground transition-colors duration-75 cursor-pointer"
                title="More actions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
              
              {/* Dropdown Menu directly attached relative to button */}
              {isMenuOpen && (
                <div role="menu" className="absolute top-full right-0 mt-1 min-w-[7rem] z-50 bg-white dark:bg-black shadow-popover-sm animate-in fade-in-0 zoom-in-95 duration-100 p-0.5 rounded-lg border bg-fd-accent">
                  <div 
                    role="menuitem" 
                    onClick={() => { onDeleteAsset?.(file.id); setIsMenuOpen(false); }}
                    className="relative transition-colors text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-gray-alpha-100 px-2 py-1 text-xs rounded-md" 
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Thumbnail title/duration */}
      <button className="flex flex-col items-center justify-center w-full overflow-hidden min-w-0 focus-visible:outline-none rounded-lg mt-0.5" onClick={togglePlay}>
        <span className="text-foreground font-medium line-clamp-1 w-full inline-flex items-center justify-center text-center cursor-pointer hover:text-fd-muted-foreground transition-colors">
          <div className="relative line-clamp-1 text-center text-[13px] truncate max-w-full">{file.name}</div>
        </span>
        <p className="text-fd-muted-foreground font-normal text-[11px] h-4 items-center inline-flex tabular-nums truncate">
          {duration !== null 
            ? formatDuration(duration) 
            : (file.size < 1024 * 1024
                ? `${(file.size / 1024).toFixed(1)} KB` 
                : `${(file.size / 1024 / 1024).toFixed(2)} MB`)
          }
        </p>
      </button>
    </div>
  );
}

function WorkspaceTabContent({ assets, onAddTrack }: { assets: UploadedFile[], onAddTrack?: (file: UploadedFile, duration: number) => void }) {
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  return (
    <div tabIndex={-1} aria-label="Arquivos" className="flex flex-col flex-shrink-0 h-full relative focus:outline-none w-full">
      <input accept="image/*,video/*,audio/*" multiple tabIndex={-1} type="file" style={{ display: 'none' }} />
      <div role="presentation" className="flex-1 overflow-y-auto min-h-0 relative py-2 pb-20">
        <div className="p-2 rounded min-h-full">
          <div className="flex flex-col gap-2">
            
            {/* Folder Toggle Button */}
            <button 
              onClick={() => setIsFolderOpen(!isFolderOpen)}
              className="transition-colors duration-150 text-left cursor-pointer group relative select-none text-foreground hover:text-foreground w-full flex items-center gap-2 px-2 py-3 -mt-px first:mt-0 hover:bg-fd-accent/40 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-fd-border"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-7 h-7">
                {isFolderOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open text-fd-muted-foreground w-6 h-6">
                    <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder text-fd-muted-foreground w-6 h-6">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium truncate text-foreground group-hover:text-foreground">
                {isFolderOpen ? '...' : 'Uploads'}
              </span>
            </button>

            {/* Folder Contents rendered conditionally */}
            {isFolderOpen && (
              <div style={{ opacity: 1, transform: 'none' }} className="flex flex-col gap-1">
                {assets.length === 0 ? (
                  <div className="text-xs text-fd-muted-foreground pl-10 py-2">
                    Nenhum arquivo na nuvem
                  </div>
                ) : (
                  assets.map((file) => (
                    <div key={file.id} className="w-full" data-state="open">
                      <div 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify(file));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        role="button" tabIndex={0} aria-roledescription="draggable" data-file-item="true" className="w-full transition-colors duration-150 group/item relative select-none rounded-lg flex items-center gap-2 px-2 py-3 -mt-px first:mt-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-fd-border text-foreground hover:text-foreground hover:bg-fd-accent/50 border-transparent cursor-pointer"
                      >
                        <div className="relative flex-shrink-0 flex items-center justify-center overflow-hidden w-7 h-7 rounded">
                          {file.type?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img alt={file.name} draggable="false" className="w-full h-full rounded-[4px] object-cover" src={file.url} />
                          ) : file.type?.startsWith('video/') || file.name.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={file.url} className="w-full h-full rounded-[4px] object-cover" />
                          ) : (
                            <div className="w-full h-full bg-fd-accent rounded flex items-center justify-center text-fd-muted-foreground">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                            </div>
                          )}
                        </div>
                        <div className="relative line-clamp-1 flex-1 min-w-0">
                          <span className="text-sm font-medium leading-[16.7px] block truncate text-foreground group-hover/item:text-foreground">{file.name}</span>
                        </div>

                        {/* Hover Actions inside the item */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 z-50">
                          <div data-list-group-actions="true" className="justify-self-end flex items-center md:opacity-0 group-hover/item:opacity-100 transition-all duration-75 md:translate-x-1 group-hover/item:translate-x-0">
                            <div className="flex w-full items-center shadow-sm rounded-md bg-white dark:bg-black border h-7 pointer-events-auto">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onAddTrack?.(file, 5); }}
                                className="relative inline-flex items-center justify-center whitespace-nowrap text-xs px-2 rounded-l-md font-medium h-full border-r border-fd-border hover:bg-fd-accent text-fd-muted-foreground hover:text-foreground transition-colors duration-75 cursor-pointer" title="Adicionar à linha do tempo"
                              >
                                <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M8.0045 3.5L8.0045 12.5M12.5 8.0045L3.5 8.0045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path></svg>
                              </button>
                              <button className="relative inline-flex items-center justify-center whitespace-nowrap text-xs px-2 rounded-r-md font-medium h-full hover:bg-fd-accent text-fd-muted-foreground hover:text-foreground transition-colors duration-75 cursor-pointer" title="Pré-visualização">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-3.5 h-3.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectTabContent({
  assets,
  filteredFiles,
  search,
  setSearch,
  uploadRef,
  setRecorderAnchor,
  onAddTrack,
  onDeleteAsset
}: {
  assets: UploadedFile[];
  filteredFiles: UploadedFile[];
  search: string;
  setSearch: (value: string) => void;
  uploadRef: React.RefObject<HTMLInputElement | null>;
  setRecorderAnchor: (el: HTMLElement | null) => void;
  onAddTrack?: (file: UploadedFile, duration: number) => void;
  onDeleteAsset?: (assetId: string) => void;
}) {
  return (
    <>
      {assets.length === 0 ? (
        /* Initial Empty state - no files in workspace yet */
        <div className="flex flex-col items-center justify-center h-full gap-2.5 py-8 text-center">
          <div
            data-icon="true"
            className="flex shrink-0 w-9 h-9 ring-1 ring-inset ring-fd-border rounded-[10px] items-center justify-center text-fd-muted-foreground bg-fd-accent/60"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.8037 9.32258V7.51613C16.8037 6.51845 16.0463 5.70968 15.1119 5.70968H10.7303C10.1646 5.70968 9.63635 5.40782 9.32259 4.90526L8.88635 4.20662C8.41568 3.45279 7.6233 3 6.77479 3H4.53778C3.13621 3 2 4.21317 2 5.70968V15.5792C2 16.3639 2.59575 17 3.33065 17M16.8037 9.32258H7.70703C6.9565 9.32258 6.29569 9.85052 6.08391 10.6193L4.60724 15.9801C4.44068 16.5848 3.92094 17 3.33065 17M16.8037 9.32258H17.1535C17.7182 9.32258 18.1245 9.90218 17.9651 10.4807L16.5265 15.7032C16.3147 16.4721 15.6538 17 14.9033 17H3.33065" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-0.5 items-center justify-center select-none">
            <p className="text-sm font-medium text-foreground">Enviar ou gravar</p>
            <p
              className="text-[11px] text-fd-muted-foreground max-w-[200px] leading-tight text-center"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Arraste e solte arquivos de áudio, vídeo ou imagem na janela para enviá-los
            </p>
          </div>

          <div className="flex flex-col w-full max-w-[160px] gap-1 mt-0.5">
            <div className="flex flex-col gap-1.5 w-full">
              <button
                type="button"
                onClick={() => uploadRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-black dark:bg-white border border-fd-border text-white dark:text-black hover:bg-fd-accent transition-colors w-full"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 shrink-0">
                  <path d="M10 4V12M10 4L13 7M10 4L7 7M17 11.3333V13.4545C17 14.8604 15.8604 16 14.4545 16H5.54545C4.13964 16 3 14.8604 3 13.4545V11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Enviar Arquivo
              </button>

              <button
                type="button"
                onClick={(e) => setRecorderAnchor(e.currentTarget)}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-white dark:bg-black border border-fd-border text-foreground hover:bg-fd-accent transition-colors w-full"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 shrink-0">
                  <path d="M10.1428 14.9189C12.2195 14.9189 14.0042 13.6181 14.7857 11.7568M10.1428 14.9189C8.06619 14.9189 6.28147 13.6181 5.5 11.7568M10.1428 14.9189V16.5M10.1428 12.6351C8.55793 12.6351 7.27311 11.298 7.27311 9.64865V6.48649C7.27311 4.8371 8.55793 3.5 10.1428 3.5C11.7277 3.5 13.0126 4.8371 13.0126 6.48649V9.64865C13.0126 11.298 11.7277 12.6351 10.1428 12.6351Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Gravar
              </button>
            </div>
          </div>
        </div>
      ) : filteredFiles.length === 0 ? (
        /* Search Empty state - no results match the filter */
        <div className="flex flex-col grow shrink-0 w-full gap-5 py-3.5 isolate peer empty:hidden h-full">
          <div data-orientation="vertical" className="rounded-[10px] border border-gray-alpha-150 bg-background dark:bg-gray-alpha-50 dark:border-gray-alpha-50 flex flex-col !bg-transparent border-none grow">
            <div className="flex flex-col w-full items-center justify-center h-full px-6 py-4 gap-2.5">
              <div data-icon="true" className="flex shrink-0 w-9 h-9 ring-1 ring-inset ring-gray-alpha-100 rounded-[10px] items-center justify-center text-gray-alpha-500 bg-gray-alpha-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 items-center justify-center select-none">
                <div className="text-foreground font-medium text-sm border-none shadow-none grow group-[:has(div[data-icon])]/item:pl-0 pl-1 h-5 group-aria-disabled/row:text-gray-400">
                  <div className="relative w-fit line-clamp-1">Nenhum resultado</div>
                </div>
                <div data-subtext="true" className="relative line-clamp-4 text-[11px] group-aria-disabled/row:text-gray-400 select-none cursor-default empty:hidden text-gray-400 text-center h-auto">
                  Nenhum arquivo corresponde à sua busca. Tente ajustar os termos de busca.
                </div>
              </div>
              <div className="flex flex-col max-w-[160px] mt-2.5 w-full gap-1 items-center justify-center select-none">
                <button 
                  onClick={() => setSearch('')}
                  data-agent-id="button-_r_q8_" 
                  className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-fd-border hover:bg-fd-accent active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none disabled:text-gray-300 disabled:border-gray-alpha-200 h-8 px-3 rounded-[8px] text-xs"
                >
                  Limpar busca
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* File list / Grid Layout */
        <div className="flex flex-col grow shrink-0 w-full gap-5 py-3.5 pb-20 isolate peer empty:hidden overflow-y-auto">
          {(() => {
            const audioFiles = filteredFiles.filter(f => f.type?.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i));
            const imageFiles = filteredFiles.filter(f => f.type?.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
            const videoFiles = filteredFiles.filter(f => f.type?.startsWith('video/') || f.name.match(/\.(mp4|webm|mkv|mov)$/i));
            const otherFiles = filteredFiles.filter(f => !audioFiles.includes(f) && !imageFiles.includes(f) && !videoFiles.includes(f));

            return (
              <>
                {audioFiles.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="flex items-center w-fit select-none gap-0.5 rounded-md group/item-title text-foreground font-medium text-sm cursor-default">
                      Áudio
                    </span>
                    <div className="grid grid-cols-2 @[520px]:grid-cols-3 gap-2">
                      {audioFiles.map(file => (
                        <AssetCard 
                          key={file.id} 
                          file={file} 
                          onAddTrack={onAddTrack}
                          onDeleteAsset={onDeleteAsset}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {imageFiles.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="flex items-center w-fit select-none gap-0.5 rounded-md group/item-title text-foreground font-medium text-sm cursor-default">
                      Imagens
                    </span>
                    <div className="grid grid-cols-2 @[520px]:grid-cols-3 gap-2">
                      {imageFiles.map(file => (
                        <AssetCard 
                          key={file.id} 
                          file={file} 
                          onAddTrack={onAddTrack}
                          onDeleteAsset={onDeleteAsset}
                        />
                      ))}
                    </div>
                  </div>
                )}
 
                {videoFiles.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="flex items-center w-fit select-none gap-0.5 rounded-md group/item-title text-foreground font-medium text-sm cursor-default">
                      Vídeos
                    </span>
                    <div className="grid grid-cols-2 @[520px]:grid-cols-3 gap-2">
                      {videoFiles.map(file => (
                        <AssetCard 
                          key={file.id} 
                          file={file} 
                          onAddTrack={onAddTrack}
                          onDeleteAsset={onDeleteAsset}
                        />
                      ))}
                    </div>
                  </div>
                )}
 
                {otherFiles.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <span className="flex items-center w-fit select-none gap-0.5 rounded-md group/item-title text-foreground font-medium text-sm cursor-default">
                      Outros
                    </span>
                    <div className="grid grid-cols-2 @[520px]:grid-cols-3 gap-2">
                      {otherFiles.map(file => (
                        <AssetCard 
                          key={file.id} 
                          file={file} 
                          onAddTrack={onAddTrack}
                          onDeleteAsset={onDeleteAsset}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}
