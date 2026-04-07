'use client';

import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { TranscriptionHeader } from '../_components/TranscriptionHeader';
import { TranscriptionSidebar } from '../_components/TranscriptionSidebar';
import { TranscriptionEditorToolbar } from '../_components/TranscriptionEditorToolbar';
import { TimelineSection } from '../../estudio/_components/TimelineSection';
import { TranscriptionShortcutsModal } from '../_components/TranscriptionShortcutsModal';
import { TimelineTrack, UploadedFile, TranscriptionSegment, Episode } from '@/lib/db';
import { toast } from 'sonner';

// ── Inline styles ──────────────────────────────────────────────────────────────
const studioStyles = `
  .duration-75 {
    animation-duration: 75ms;
    transition-duration: 75ms;
  }
  .transition-colors {
    transition-property: color, background-color, border-color, fill, stroke;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
  }
  .font-num { font-variant-numeric: tabular-nums; }
  .bg-striped-feint-timeline {
    background-image: repeating-linear-gradient(-45deg,rgba(255,255,255,.3),rgba(255,255,255,.3) 4px,rgba(255,255,255,0) 0,rgba(255,255,255,0) 8px);
  }
  .center { display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .hstack { display:flex; flex-direction:row; align-items:center; }
  .bg-gray-alpha-50 { background-color: hsla(0,0%,50%,0.05); }
  .bg-gray-alpha-100 { background-color: hsla(0,0%,50%,0.1); }
  .bg-gray-alpha-150 { background-color: hsla(0,0%,50%,0.15); }
  .bg-gray-alpha-200 { background-color: hsla(0,0%,50%,0.2); }
  .border-gray-alpha-150 { border-color: hsla(0,0%,50%,0.15); }
  .bg-background-alt { background-color: var(--fd-background); opacity: 0.95; }
  .text-xm { font-size: 13px; }
  .text-subtle { color: var(--fd-muted-foreground); }
  .memo-seg {
    content-visibility: auto;
    contain-intrinsic-size: 0 40px;
  }
`;

// ── Memoized internal segment component for performance ──
const MemoizedSegment = memo(({ 
  seg, 
  isActive, 
  onBlur, 
  onClick 
}: { 
  seg: TranscriptionSegment; 
  isActive: boolean; 
  onBlur: (id: string, text: string) => void;
  onClick: (start: number) => void;
}) => (
  <div className="react-renderer node-ttsBlock memo-seg" suppressContentEditableWarning={true}>
    <div className="relative" style={{ whiteSpace: 'normal' }}>
      <div 
        className={cn(
          "tts-block group group/tts-block outline-none transition-all duration-300 rounded-lg p-1 -m-1",
          isActive ? "bg-accent/15 ring-[1.5px] ring-gray-400/30" : "hover:bg-accent/10"
        )}
        contentEditable="true"
        suppressContentEditableWarning={true}
        onBlur={(e) => onBlur(seg.id, e.currentTarget.innerText)}
        onClick={() => onClick(seg.start)}
      >
        <p dir="ltr" className="text-md mb-4" style={{ whiteSpace: 'pre-wrap' }}>
           <span data-isttsnode="true" className={cn(
             "tts-node group/tts-node rounded-[6px] box-decoration-clone bg-clip-content py-[3px] transition-all duration-300",
             isActive ? "!bg-gray-500/10 border-b border-gray-500/40 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.2)]" : ""
           )}>
             {seg.text}
           </span>
           <br className="ProseMirror-trailingBreak" />
        </p>
      </div>
    </div>
  </div>
));
MemoizedSegment.displayName = 'MemoizedSegment';


export default function TranscriptionStudioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [tracks, setTracks] = useState<TimelineTrack[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineHeight, setTimelineHeight] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<string | null>('edit');
  const [projectTitle, setProjectTitle] = useState<string>('Carregando...');
  const [isSaving, setIsSaving] = useState(false);
  const [assets, setAssets] = useState<UploadedFile[]>([]);
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Sync playback rate ──
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  useEffect(() => {
    console.log('[Studio] State Update - Tracks:', tracks.length, 'Segments:', segments.length);
  }, [tracks, segments]);

  // ── Load episode by ID ──
  useEffect(() => {
    if (!id) return;
    const cleanId = id.startsWith('scr-') ? id.replace('scr-', '') : id;
    console.log('[Studio] Iniciando carregamento. ID:', cleanId);

    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/episodes/${cleanId}`, { cache: 'no-store' });
        if (res.ok) {
          const ep: Episode = await res.json();
          console.log('[Studio] Episódio carregado:', ep.id, ep.title);
          
          setEpisode(ep);
          setProjectTitle(ep.title || 'Projeto de Transcrição');
          
          // Transcription Setup
          let newSegments: TranscriptionSegment[] = [];
          if (ep.segments && ep.segments.length > 0) {
            newSegments = ep.segments;
          } else if (ep.transcriptionText) {
            newSegments = parseTranscriptionToSegments(ep.transcriptionText);
          }
          console.log('[Studio] Segmentos definidos:', newSegments.length);
          setSegments(newSegments);
          
          // Audio Track Setup
          if (ep.audioUrl) {
            const audioTrack: TimelineTrack = {
              id: 'audio-main',
              name: 'Áudio Principal',
              duration: parseDuration(ep.duration || '0:00') + 60, // 1 min padding
              startTime: 0,
              type: 'audio/mpeg',
              url: ep.audioUrl,
              layerIndex: 0,
              color: 'bg-blue-600/20',
            };
            console.log('[Studio] Definindo tracks de áudio');
            setTracks([audioTrack]);
          } else {
            setTracks([]);
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error('[Studio] Falha ao carregar episódio:', res.status, errorData.error);
          const resProj = await fetch(`/api/studio/projects/${id}`);
          if (resProj.ok) {
            const proj = await resProj.json();
            setProjectTitle(proj.name || 'Projeto');
            setTracks(proj.tracks || []);
            setAssets(proj.assets || []);
            setSegments([]);
          }
        }
      } catch (error) {
        console.error('[Studio] Erro crítico:', error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const parseDuration = (d: string): number => {
    if (!d) return 600;
    const parts = d.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return isNaN(parts[0]) ? 600 : parts[0];
  };

  const parseTranscriptionToSegments = (text: string): TranscriptionSegment[] => {
    if (!text) return [];
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const match = line.match(/\[(\d{2}):(\d{2})\]\s*(.*)/);
      if (match) {
        const mins = parseInt(match[1]);
        const secs = parseInt(match[2]);
        const start = mins * 60 + secs;
        return {
          id: `seg-${i}-${start}`,
          start,
          end: start + 4, 
          speaker: 'Revisão',
          text: match[3]
        };
      }
      return {
        id: `seg-raw-${i}`,
        start: i * 5,
        end: (i + 1) * 5,
        speaker: 'Revisão',
        text: line
      };
    }).filter(Boolean) as TranscriptionSegment[];
  };

  const handleSaveTranscription = async (passedTitle?: string) => {
    if (!id) return;
    const cleanId = id.startsWith('scr-') ? id.replace('scr-', '') : id;
    setIsSaving(true);
    
    // We use the passed title if available (from child component), otherwise fallback to state
    const titleToSave = passedTitle || projectTitle;

    try {
      const res = await fetch(`/api/episodes/${cleanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToSave,
          segments,
          transcriptionText: segments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')
        })
      });
      if (res.ok) {
        toast.success('Transcrição salva com sucesso!');
        setProjectTitle(titleToSave); // Ensure state stays synchronized
      } else {
        toast.error('Erro ao salvar transcrição');
      }
    } catch (err) {
      toast.error('Erro de conexão ao salvar');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSegmentText = (segId: string, newText: string) => {
    setSegments(prev => prev.map(s => s.id === segId ? { ...s, text: newText } : s));
  };

  const handleStudioUpload = async (files: FileList | File[]) => {
    toast.info('Upload em desenvolvimento para transcrições');
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleAddTrack = (file: any, duration: number) => {
    const newTrack: TimelineTrack = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      duration: duration || 5,
      startTime: currentTime,
      type: file.type,
      url: file.url,
      layerIndex: tracks.length,
      color: 'bg-blue-100',
    };
    setTracks((prev) => [...prev, newTrack]);
  };

  const handleUpdateTrack = (id: string, updates: Partial<TimelineTrack>) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleDeleteTracks = (ids: string[]) => {
    setTracks((prev) => prev.filter((t) => !ids.includes(t.id)));
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, '0')}`;

  const togglePlaybackSpeed = () => {
    const speeds = [0.8, 1.0, 1.2, 1.5, 2.0];
    setPlaybackSpeed((p) => speeds[(speeds.indexOf(p) + 1) % speeds.length]);
  };

  // ── Native Audio Sync ──
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => toast.error('Erro ao tocar áudio.'));
      }
    }
    setIsPlaying(!isPlaying);
  };

  // ── Global Keyboard Shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl?.tagName === 'INPUT' || 
        activeEl?.tagName === 'TEXTAREA' || 
        activeEl?.isContentEditable
      ) {
        return;
      }
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const isAlt = e.altKey;

      if (e.key === ' ' && !isCmdOrCtrl) {
        e.preventDefault();
        togglePlay();
      } else if (isCmdOrCtrl && e.key === '.') {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      } else if (e.key.toLowerCase() === 's' && !isCmdOrCtrl) {
        e.preventDefault();
        toast.info('Split: Dividindo segmento no tempo atual...');
      } else if (e.key === 'ArrowRight') {
        onSeek(currentTime + 0.1);
      } else if (e.key === 'ArrowLeft') {
        onSeek(Math.max(0, currentTime - 0.1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const onSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      lastTimeUpdateRef.current = newTime;
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const realDuration = e.currentTarget.duration;
    if (realDuration && !isNaN(realDuration)) {
      console.log('[Studio] Duração real detectada:', realDuration);
      setTracks(prev => prev.map(t => t.id === 'audio-main' ? { ...t, duration: realDuration } : t));
    }
  };

  const lastTimeUpdateRef = useRef(0);
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const time = e.currentTarget.currentTime;
    // Throttle React state updates to 150ms for the editor
    // The timeline cursor still glides at 60FPS via DOM Ref
    if (Math.abs(time - lastTimeUpdateRef.current) > 0.15 || isPlaying === false) {
      setCurrentTime(time);
      lastTimeUpdateRef.current = time;
    }
  };

  const activeSegmentId = useMemo(() => {
    return segments.find(s => currentTime >= s.start && currentTime <= s.end)?.id;
  }, [segments, currentTime]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const seekTo = (clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const maxTime = tracks.length > 0
      ? Math.max(...tracks.map((t) => t.startTime + t.duration), 30)
      : 30;
    setCurrentTime(Math.max(0, Math.min(maxTime, (clientX - rect.left) / 135.6)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    seekTo(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    seekTo(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground">
      <style>{studioStyles}</style>

      <TranscriptionHeader 
        canUndo={false}
        canRedo={false}
        onUndo={() => {}}
        onRedo={() => {}}
        isSaving={isSaving}
        projectTitle={projectTitle}
        onTitleChange={setProjectTitle}
        onSave={handleSaveTranscription}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Debug Badge */}
      <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white text-[10px] px-2 py-1 rounded flex gap-3 font-mono">
        <span>ID: {id}</span>
        <span>TRK: {tracks.length}</span>
        <span>SEG: {segments.length}</span>
        <span>LDR: {isLoading ? 'Y' : 'N'}</span>
      </div>

      <div className="flex flex-1 md:flex-row flex-col min-h-0 overflow-hidden relative">
        <TranscriptionSidebar 
          onUpload={handleStudioUpload}
          onDeleteAsset={handleDeleteAsset}
          onAddTrack={handleAddTrack}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          assets={assets}
        />

        <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-background-alt/5 overflow-hidden">
          <TranscriptionEditorToolbar 
             onGenerate={() => toast.info('Gerando transcrição...')}
             onInsertBreak={() => {}}
          />
          
          <div className="flex-1 overflow-y-auto no-scrollbar relative w-full">
            <div className="max-w-[860px] w-full pl-[60px] md:pl-[80px] mx-auto pr-[10px] md:pr-[20px] h-full relative">
              <div style={{ opacity: 1 }}>
                <div 
                  contentEditable="false" 
                  suppressContentEditableWarning={true}
                  className="tiptap ProseMirror min-h-full focus:outline-none py-16 text-foreground" 
                >
                  {segments.length === 0 && !isLoading && (
                    <div className="text-center py-20 opacity-50">
                      Nenhuma transcrição encontrada para este episódio.
                    </div>
                  )}
                  
                  {segments.map((seg) => (
                    <MemoizedSegment 
                      key={seg.id}
                      seg={seg}
                      isActive={seg.id === activeSegmentId}
                      onBlur={updateSegmentText}
                      onClick={(start) => {
                         setCurrentTime(start);
                         if (audioRef.current) audioRef.current.currentTime = start;
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <TimelineSection 
        tracks={tracks}
        height={timelineHeight}
        onHeightChange={setTimelineHeight}
        isTimelineCollapsed={isTimelineCollapsed}
        toggleTimeline={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isDragging={isDragging}
        currentTime={currentTime}
        playbackSpeed={playbackSpeed}
        togglePlaybackSpeed={togglePlaybackSpeed}
        timelineRef={timelineRef}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        formatTime={formatTime}
        updateTrack={handleUpdateTrack}
        onDeleteTracks={handleDeleteTracks}
        onAddTracks={(newTracks) => setTracks([...tracks, ...newTracks])}
        clipboardTracks={[]}
        setClipboardTracks={() => {}}
        selectedTrackIds={selectedTrackIds}
        setSelectedTrackIds={setSelectedTrackIds}
        audioRef={audioRef}
      />

      <TranscriptionShortcutsModal 
        isOpen={isShortcutsModalOpen} 
        onClose={() => setIsShortcutsModalOpen(false)} 
      />

      {/* Hidden Audio for Clock/Playback Sync */}
      {tracks.length > 0 && (
        <audio
          ref={audioRef}
          src={tracks[0].url}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
