'use client';

import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import { TranscriptionHeader } from '../_components/TranscriptionHeader';
import { TranscriptionSidebar } from '../_components/TranscriptionSidebar';
import { TranscriptionEditorToolbar } from '../_components/TranscriptionEditorToolbar';
import { TimelineSection } from '../../estudio/_components/TimelineSection';
import { TranscriptionShortcutsModal } from '../_components/TranscriptionShortcutsModal';
import { TimelineTrack, UploadedFile, TranscriptionSegment, Episode, SharingConfig } from '@/lib/db';
import { toast } from 'sonner';
import { ShareProjectModal } from '../_components/ShareProjectModal';

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
    /* Removed content-visibility auto to prevent clipping of sidebar indicators */
  }
`;

// ── Memoized internal segment component for performance ──
const MemoizedSegment = memo(({ 
  seg, 
  isActive, 
  isLocked, 
  currentTime,
  forceCapitalize,
  onBlur, 
  onClick 
}: { 
  seg: TranscriptionSegment; 
  isActive: boolean;
  isLocked: boolean;
  currentTime: number;
  forceCapitalize?: boolean;
  onBlur: (id: string, text: string) => void;
  onClick: (start: number) => void;
}) => (
  <div 
    className={cn(
      "tts-block group group/tts-block outline-none transition-all duration-300 inline p-0",
      isLocked && "opacity-80 cursor-default"
    )}
    contentEditable={isLocked ? false : true}
    suppressContentEditableWarning={true}
    onBlur={isLocked ? undefined : (e) => onBlur(seg.id, e.currentTarget.innerText)}
    onClick={() => onClick(seg.start)}
  >
    <p dir="ltr" className={cn("text-md transition-colors", isLocked ? "text-fd-muted-foreground/80" : "text-foreground")} style={{ whiteSpace: 'pre-wrap', display: 'inline' }}>
       {seg.words && seg.words.length > 0 ? (
         seg.words.map((w, wIdx) => {
           const isWordActive = currentTime >= w.start && currentTime <= w.end;
           let displayWord = w.word;
           
           // Apply intelligent capitalization
           if (forceCapitalize && wIdx === 0 && displayWord) {
             displayWord = displayWord.charAt(0).toUpperCase() + displayWord.slice(1);
           }

           return (
             <span 
               key={`${seg.id}-w-${wIdx}`}
               data-isttsnode="true" 
               className={cn(
                 "tts-node group/tts-node rounded-[3px] box-decoration-clone bg-clip-content py-[1px] px-[0.5px] transition-all duration-300",
                 isWordActive && !isLocked ? "!bg-gray-500/15 border-b-2 border-gray-500/50 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.2)]" : ""
               )}
             >
               {displayWord}{' '}
             </span>
           );
         })
       ) : (
         <span data-isttsnode="true" className={cn(
           "tts-node group/tts-node rounded-[4px] box-decoration-clone bg-clip-content py-[2px] px-[1px] transition-all duration-300",
           isActive && !isLocked ? "!bg-gray-500/10 border-b border-gray-500/40 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.2)]" : ""
         )}>
           {forceCapitalize && seg.text ? seg.text.charAt(0).toUpperCase() + seg.text.slice(1) : seg.text}
         </span>
       )}
    </p>
  </div>
));
MemoizedSegment.displayName = 'MemoizedSegment';

// ── NEW: Individual Track Audio Sync Component ──
import { CompositeAudioEngine, TrackAudio } from '@/app/_components/CompositeAudioEngine';


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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingConfig, setSharingConfig] = useState<SharingConfig | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  // ── History (Undo/Redo) ──
  const [history, setHistory] = useState<{ tracks: TimelineTrack[], segments: TranscriptionSegment[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const takeSnapshot = useCallback((currentTracks: TimelineTrack[], currentSegments: TranscriptionSegment[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      // Limit history to 50 items
      if (newHistory.length >= 50) newHistory.shift();
      return [...newHistory, { tracks: JSON.parse(JSON.stringify(currentTracks)), segments: JSON.parse(JSON.stringify(currentSegments)) }];
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    if (prev) {
      setTracks(JSON.parse(JSON.stringify(prev.tracks)));
      setSegments(JSON.parse(JSON.stringify(prev.segments)));
      setHistoryIndex(historyIndex - 1);
      toast.info('Desfeito', { duration: 1000 });
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    if (next) {
      setTracks(JSON.parse(JSON.stringify(next.tracks)));
      setSegments(JSON.parse(JSON.stringify(next.segments)));
      setHistoryIndex(historyIndex + 1);
      toast.info('Refeito', { duration: 1000 });
    }
  }, [historyIndex, history]);

  // Initial Snapshot after first load
  useEffect(() => {
    if (!isLoading && tracks.length > 0 && historyIndex === -1) {
      setHistory([{ tracks: JSON.parse(JSON.stringify(tracks)), segments: JSON.parse(JSON.stringify(segments)) }]);
      setHistoryIndex(0);
    }
  }, [isLoading, tracks, historyIndex, segments]);

  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── High Accuracy Global Clock Loop ──
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (isPlaying && !isDragging) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime(prev => {
          const next = prev + delta * playbackSpeed;
          
          // Calculate max duration based only on tracks for stopping logic
          const audioDuration = tracks.length > 0 
            ? Math.max(...tracks.map(t => t.startTime + t.duration)) 
            : 0;

          // If we reached the end of the last track, stop and reset (looping or sticking at 0 is common)
          if (audioDuration > 0 && next >= audioDuration) {
            setIsPlaying(false);
            return audioDuration; // Stop exactly at the end
          }
          
          // If no tracks, use a default 60s cap for the playhead if play is clicked
          if (tracks.length === 0 && next >= 60) {
            setIsPlaying(false);
            return 0;
          }

          return next;
        });
      }
      lastTime = now;
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isDragging, playbackSpeed, tracks]);

  useEffect(() => {
    console.log('[Studio] State Update - Tracks:', tracks.length, 'Segments:', segments.length);
  }, [tracks, segments]);

  // ── Sync state to refs for stable keyboard listener ──
  const tracksRef = useRef(tracks);
  const segmentsRef = useRef(segments);
  const currentTimeRef = useRef(currentTime);
  const projectTitleRef = useRef(projectTitle);
  const isSavingRefState = useRef(isSaving); // renamed from isSaving to avoid clash if any
  const isLoadingRef = useRef(isLoading);

  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { segmentsRef.current = segments; }, [segments]);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);
  useEffect(() => { projectTitleRef.current = projectTitle; }, [projectTitle]);
  useEffect(() => { isSavingRefState.current = isSaving; }, [isSaving]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

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
          
          // Audio Track Setup - Prioritize saved tracks
          if (ep.tracks && ep.tracks.length > 0) {
            console.log('[Studio] Carregando tracks salvas:', ep.tracks.length);
            setTracks(ep.tracks);
          } else if (ep.audioUrl) {
            const audioTrack: TimelineTrack = {
              id: 'audio-main',
              name: 'Áudio Principal',
              duration: parseDuration(ep.duration || '0:00'),
              startTime: 0,
              type: 'audio/mpeg',
              url: ep.audioUrl,
              layerIndex: 0,
              color: 'bg-blue-600/20',
            };
            console.log('[Studio] Definindo track de áudio padrão');
            setTracks([audioTrack]);
          } else {
            setTracks([]);
          }

          if (ep.assets) {
            setAssets(ep.assets);
          }

          // ── Load Sharing Config and handle Token ──
          const shareRes = await fetch(`/api/episodes/${cleanId}/share`);
          if (shareRes.ok) {
            const shareData = await shareRes.json();
            setSharingConfig(shareData);

            if (token) {
              if (shareData.isEnabled && shareData.token === token) {
                setIsGuest(true);
                if (shareData.publicAccess === 'Visualizador') {
                  setIsLocked(true);
                } else if (shareData.publicAccess === 'Editor') {
                  setIsLocked(false);
                }
                toast.success('Acessando via link compartilhado');
              } else {
                toast.error('Link de compartilhamento inválido ou expirado');
                setIsLocked(true);
              }
            }
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
    if (!id || isLoadingRef.current) return;
    
    // Safety check: Never save 'Carregando...' title
    const titleToSave = passedTitle || projectTitleRef.current;
    if (titleToSave === 'Carregando...') {
      console.warn('[Studio] Tentativa de salvar com título "Carregando...". Abortado.');
      return;
    }

    const cleanId = id.startsWith('scr-') ? id.replace('scr-', '') : id;
    setIsSaving(true);

    // Calculate exact duration for public display
    const finalDuration = tracks.length > 0 
      ? Math.max(...tracks.map(t => t.startTime + t.duration)) 
      : 0;

    try {
      const res = await fetch(`/api/episodes/${cleanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToSave,
          duration: formatTime(finalDuration), // Update the episode duration field
          segments,
          transcriptionText: segments.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n'),
          tracks,
          assets
        })
      });
      if (res.ok) {
        if (!isGuest) toast.success('Transcrição salva com sucesso!');
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

  const handleUpdateSharing = async (updates: Partial<SharingConfig>) => {
    if (!id) return;
    const cleanId = id.startsWith('scr-') ? id.replace('scr-', '') : id;
    try {
      const res = await fetch(`/api/episodes/${cleanId}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      setSharingConfig(data);
      toast.success('Configurações de compartilhamento atualizadas');
    } catch (err) {
      toast.error('Erro ao atualizar compartilhamento');
    }
  };

  const handleGenerateTranscription = async () => {
    if (!id) return;
    const cleanId = id.startsWith('scr-') ? id.replace('scr-', '') : id;
    
    setIsGenerating(true);
    const toastId = toast.loading('Gerando transcrição, isso pode levar alguns minutos...');
    try {
      const res = await fetch(`/api/episodes/${cleanId}/transcribe`, {
        method: 'POST',
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSegments(data.segments);
        toast.success('Transcrição gerada com sucesso!', { id: toastId });
      } else {
        toast.error(`Erro ao gerar: ${data.error || 'Erro desconhecido'}`, { id: toastId });
      }
    } catch (err) {
      toast.error('Erro de conexão ao gerar transcrição', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSegmentText = (segId: string, newText: string) => {
    takeSnapshot(tracks, segments);
    setSegments(prev => prev.map(s => s.id === segId ? { ...s, text: newText } : s));
  };

  const handleStudioUpload = async (files: FileList | File[]) => {
    toast.info('Upload em desenvolvimento para transcrições');
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  const handleAddTrack = (file: any, duration: number) => {
    takeSnapshot(tracks, segments);
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
    // Only snapshot if this isn't a high-frequency update like dragging (handled by pointerUp)
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleDeleteTracks = (ids: string[]) => {
    takeSnapshot(tracks, segments);
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

  // ── Stable Refs for Keyboard Listener ──
  const undoRef = useRef(undo);
  const redoRef = useRef(redo);
  const handleSaveRef = useRef(handleSaveTranscription);
  const togglePlayRef = useRef(togglePlay);

  useEffect(() => { undoRef.current = undo; }, [undo]);
  useEffect(() => { redoRef.current = redo; }, [redo]);
  useEffect(() => { handleSaveRef.current = handleSaveTranscription; }, [handleSaveTranscription]);
  useEffect(() => { togglePlayRef.current = togglePlay; }, [togglePlay]);

  // ── Global Keyboard Shortcuts (Stabilized with Refs) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Global Shortcuts (Even if focused, but not if in a text input like Title)
      if (isCmdOrCtrl) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (!isSavingRefState.current && !isLoadingRef.current) {
             handleSaveRef.current();
          }
          return;
        }
        if (!e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          undoRef.current();
          return;
        }
        if (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) {
          e.preventDefault();
          redoRef.current();
          return;
        }
        if (e.key === '.') {
          e.preventDefault();
          setIsShortcutsModalOpen(true);
          return;
        }
      }

      // Playback/Timeline Shortcuts (Only if not typing)
      if (isInputFocused || activeEl?.isContentEditable) return;

      if (e.key === ' ' && !isCmdOrCtrl) {
        e.preventDefault();
        togglePlayRef.current();
      } else if (e.key.toLowerCase() === 's' && !isCmdOrCtrl) {
        e.preventDefault();
        toast.info('Split: Dividindo segmento no tempo atual...');
      } else if (e.key === 'ArrowRight') {
        const current = currentTimeRef.current;
        onSeek(current + 0.1);
      } else if (e.key === 'ArrowLeft') {
        const current = currentTimeRef.current;
        onSeek(Math.max(0, current - 0.1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Truly stable listener

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
    // Clock logic handled by performance.now() loop above
  }, [isPlaying]);

  const seekTo = (clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const maxTime = tracks.length > 0
      ? Math.max(...tracks.map((t) => t.startTime + t.duration), 60)
      : 60;
    setCurrentTime(Math.max(0, Math.min(maxTime, (clientX - rect.left) / 136.5)));
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
    if (isDraggingRef.current) {
      // Snapshot only when dragging stops to capture final position
      takeSnapshot(tracks, segments);
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#FFFFFF] dark:bg-fd-background transition-colors duration-300 overflow-hidden text-foreground">
      <style>{studioStyles}</style>

      <TranscriptionHeader 
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        isSaving={isSaving}
        projectTitle={projectTitle}
        onTitleChange={setProjectTitle}
        onSave={handleSaveTranscription}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenShare={() => {
           console.log('[Studio] Triggering share modal state');
           setIsShareModalOpen(true);
        }}
      />

      <div className="flex flex-1 md:flex-row flex-col min-h-0 overflow-hidden relative">
        <TranscriptionSidebar 
          onUpload={handleStudioUpload}
          onDeleteAsset={handleDeleteAsset}
          onAddTrack={handleAddTrack}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          assets={assets}
        />

        <main className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#f6f8fa] dark:bg-[#121212] overflow-hidden">
          <TranscriptionEditorToolbar 
             onGenerate={handleGenerateTranscription}
             isGenerating={isGenerating}
             isLocked={isLocked}
             onLockParagraphs={() => setIsLocked(prev => !prev)}
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
                  
                  {/* Group segments into paragraphs */}
                  {(() => {
                    const paragraphs: TranscriptionSegment[][] = [];
                    let currentPara: TranscriptionSegment[] = [];
                    
                      segments.forEach((seg, idx) => {
                        const prevSeg = segments[idx - 1];
                        // INTERVAL DETECTION: Identifying switches between audio clips or natural pauses
                        const gap = prevSeg ? seg.start - prevSeg.end : 0;
                        
                        // New stanza (estrofe) at 1.0s silence or interval
                        if (gap > 1.0 && currentPara.length > 0) {
                          paragraphs.push(currentPara);
                          currentPara = [];
                        }
                        currentPara.push(seg);
                      });
                    if (currentPara.length > 0) paragraphs.push(currentPara);
                    
                    return paragraphs.map((para, pIdx) => {
                      const showLockIcon = isLocked;
                      return (
                        <div key={`para-${pIdx}`} className="mb-14 relative group/paragraph-container block">
                          {/* Paragraph Indicator & Timestamp Sidebar */}
                          <div
                            contentEditable={false}
                            suppressContentEditableWarning={true}
                            className="text-md absolute flex flex-col items-center select-none top-0 bottom-0 left-[-42px] pointer-events-none z-10"
                          >
                            {/* Subtle Timestamp Badge */}
                            <div className="absolute top-0 right-2 py-1 pr-4 translate-x-3 opacity-0 group-hover/paragraph-container:opacity-40 transition-opacity duration-300">
                               <span className="text-[12px] font-mono font-medium text-background tracking-tighter scale-90 block">
                                 {formatTime(para[0].start)}
                               </span>
                            </div>

                            <div 
                              className={cn(
                                "absolute left-0 w-[2px] rounded-full transition-all duration-300",
                                isLocked ? "bg-[#CCCCCC]" : "bg-black dark:bg-white"
                              )}
                              style={{ 
                                top: showLockIcon ? '26px' : '6px',
                                bottom: '4px'
                              }}
                            />
                            {showLockIcon && (
                              <div className="absolute top-0 left-[-9px] bg-background w-[18px] h-6 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-lock shrink-0 h-[14px] w-full text-foreground"
                                >
                                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              </div>
                            )}
                          </div>

                          {para.map((seg, sIdx) => {
                             const prevSegInPara = para[sIdx - 1];
                             const gap = prevSegInPara ? seg.start - prevSegInPara.end : 0;
                             // Line break at 0.4s silence for natural stanza flow
                             const needsLineBreak = gap > 0.4;
                             
                             return (
                               <React.Fragment key={seg.id}>
                                 {needsLineBreak && (
                                   <div className="block h-0 w-full" contentEditable={false} />
                                 )}
                                 <MemoizedSegment 
                                   seg={seg}
                                   isActive={seg.id === activeSegmentId}
                                   isLocked={isLocked}
                                   currentTime={currentTime}
                                   forceCapitalize={sIdx === 0 || needsLineBreak}
                                   onBlur={updateSegmentText}
                                   onClick={(start) => {
                                      setCurrentTime(start);
                                      if (audioRef.current) audioRef.current.currentTime = start;
                                   }}
                                 />
                               </React.Fragment>
                             );
                          })}
                        </div>
                      );
                    });
                  })()}
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
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      <TranscriptionShortcutsModal 
        isOpen={isShortcutsModalOpen} 
        onClose={() => setIsShortcutsModalOpen(false)} 
      />

      {/* Multi-Track Audio Engine */}
      <CompositeAudioEngine 
        tracks={tracks}
        currentTime={currentTime}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onDurationUpdate={(id, dur) => {
          setTracks(prev => prev.map(t => t.id === id ? { ...t, duration: dur } : t));
        }}
      />

      <ShareProjectModal 
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        scriptTitle={projectTitle}
        projectId={id}
        sharingConfig={sharingConfig}
        onSaveSharing={handleUpdateSharing}
      />
    </div>
  );
}
