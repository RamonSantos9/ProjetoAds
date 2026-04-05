'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { StudioHeader } from '../_components/StudioHeader';
import { StudioSidebar } from '../_components/StudioSidebar';
import { TimelineSection } from '../_components/TimelineSection';
import { TimelineTrack, UploadedFile } from '@/lib/db';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check } from 'lucide-react';
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
  .bg-gray-alpha-100 { background-color: hsla(0,0%,50%,0.1); }
  .bg-gray-alpha-200 { background-color: hsla(0,0%,50%,0.2); }
  .border-gray-alpha-150 { border-color: hsla(0,0%,50%,0.15); }
`;

// ── Aspect ratio options ───────────────────────────────────────────────────────
export type AspectRatioOption = { label: string; subtext: string; ratio: string; icon: React.ReactNode };

export const aspectRatios: AspectRatioOption[] = [
  { label: 'Original', subtext: 'First video dimensions', ratio: 'auto', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"><rect x="2" y="2" width="16" height="16" rx="2"/></svg> },
  { label: '16:9', subtext: 'Youtube ads', ratio: '16 / 9', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5.5" width="16" height="9" rx="2"/></svg> },
  { label: '9:16', subtext: 'Tiktok, Reels, Shorts', ratio: '9 / 16', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5.5" y="2" width="9" height="16" rx="2"/></svg> },
  { label: '4:5', subtext: 'Linkedin, Facebook ads', ratio: '4 / 5', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2.5" width="12" height="15" rx="2"/></svg> },
  { label: '1:1', subtext: 'Instagram posts', ratio: '1 / 1', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="14" height="14" rx="2"/></svg> },
];

// ── Studio Project Editor Page ─────────────────────────────────────────────────
export default function EstudioProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState('00:00:00');
  const [tracks, setTracks] = useState<TimelineTrack[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [timelineHeight, setTimelineHeight] = useState(300);
  const [clipboardTracks, setClipboardTracks] = useState<TimelineTrack[]>([]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(aspectRatios[1]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  const [activeSidebarTab, setActiveSidebarTab] = useState<string | null>('files');
  const [lastActiveSidebarTab, setLastActiveSidebarTab] = useState<string>('files');
  const [projectTitle, setProjectTitle] = useState<string>('Untitled project');
  const [isSaving, setIsSaving] = useState(false);
  const [assets, setAssets] = useState<UploadedFile[]>([]);
  const [history, setHistory] = useState<TimelineTrack[][]>([]);
  const [redoStack, setRedoStack] = useState<TimelineTrack[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load project by ID ──
  useEffect(() => {
    if (!projectId) return;
    async function load() {
      try {
        const res = await fetch(`/api/studio/projects/${projectId}`);
        if (!res.ok) {
          toast.error('Projeto não encontrado');
          router.push('/admin/estudio');
          return;
        }
        const proj = await res.json();
        setProjectTitle(proj.name || 'Untitled project');
        setTracks(proj.tracks || []);
        setAssets(proj.assets || []);
        setSelectedRatio(aspectRatios.find(r => r.ratio === proj.aspectRatio) || aspectRatios[1]);
      } catch {
        toast.error('Falha ao carregar projeto');
        router.push('/admin/estudio');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [projectId, router]);

  // ── Upload asset ──
  const handleStudioUpload = async (files: FileList | File[]) => {
    if (!projectId) return;
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      const p = async () => {
        const res = await fetch('/api/studio/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Falha no upload');
        const asset = await res.json();
        setAssets(prev => [...prev, asset]);
        return asset;
      };
      toast.promise(p(), {
        loading: `Enviando ${file.name}...`,
        success: `${file.name} enviado!`,
        error: (e) => `Erro: ${e.message}`,
      });
    }
  };

  // ── Delete asset ──
  const handleDeleteAsset = async (assetId: string) => {
    const p = async () => {
      const res = await fetch(`/api/studio/upload?projectId=${projectId}&assetId=${assetId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erro');
      setAssets(prev => prev.filter(a => a.id !== assetId));
    };
    toast.promise(p(), {
      loading: 'Removendo...', success: 'Removido!', error: (e) => `Erro: ${e.message}`,
    });
  };

  // ── Auto-save ──
  useEffect(() => {
    if (!projectId || isLoading) return;
    const t = setTimeout(async () => {
      setIsSaving(true);
      try {
        await fetch(`/api/studio/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: projectTitle, tracks, aspectRatio: selectedRatio.ratio, lastModified: new Date().toISOString() }),
        });
      } finally {
        setTimeout(() => setIsSaving(false), 1000);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [tracks, projectTitle, selectedRatio, projectId, isLoading]);

  useEffect(() => {
    if (activeSidebarTab) setLastActiveSidebarTab(activeSidebarTab);
  }, [activeSidebarTab]);

  // ── Transform ref for canvas drag operations ──
  const transformRef = useRef<{
    type: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'rotate' | null;
    startX: number; startY: number;
    initialX: number; initialY: number;
    initialW: number; initialH: number; initialR: number;
    trackId: string;
  }>({ type: null, startX: 0, startY: 0, initialX: 0, initialY: 0, initialW: 0, initialH: 0, initialR: 0, trackId: '' });

  const saveHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-49), tracks]);
    setRedoStack([]);
  }, [tracks]);

  const handleUndo = useCallback(() => {
    if (!history.length) return;
    setRedoStack(prev => [...prev, tracks]);
    setTracks(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
  }, [history, tracks]);

  const handleRedo = useCallback(() => {
    if (!redoStack.length) return;
    setHistory(prev => [...prev, tracks]);
    setTracks(redoStack[redoStack.length - 1]);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, tracks]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const togglePlaybackSpeed = () => {
    const speeds = [0.8, 1.0, 1.2, 1.5, 2.0];
    setPlaybackSpeed(p => speeds[(speeds.indexOf(p) + 1) % speeds.length]);
  };

  // ── Playback timer ──
  useEffect(() => {
    if (!recording) { setTimer('00:00:00'); return; }
    const start = Date.now();
    const id = setInterval(() => {
      const d = Date.now() - start;
      const h = Math.floor(d / 3600000).toString().padStart(2, '0');
      const m = Math.floor((d % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((d % 60000) / 1000).toString().padStart(2, '0');
      setTimer(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, [recording]);

  // ── Animation frame for playback ──
  useEffect(() => {
    let rafId: number; let lastTs: number;
    const animate = (ts: number) => {
      if (lastTs === undefined) lastTs = ts;
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;
      setCurrentTime(prev => {
        const maxTime = tracks.length > 0 ? Math.max(...tracks.map(t => t.startTime + t.duration)) : 30;
        const next = prev + delta * playbackSpeed;
        return next > maxTime ? 0 : next;
      });
      rafId = requestAnimationFrame(animate);
    };
    if (isPlaying) rafId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafId); lastTs = undefined as unknown as number; };
  }, [isPlaying, playbackSpeed, tracks]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) return;
      const ctrl = navigator.platform.toUpperCase().includes('MAC') ? e.metaKey : e.ctrlKey;
      if (e.key === ' ' || (ctrl && e.key === 'Enter')) { e.preventDefault(); setIsPlaying(p => !p); }
      else if (ctrl && e.key === '.') { e.preventDefault(); togglePlaybackSpeed(); }
      else if (e.key === 'ArrowRight') setCurrentTime(p => Math.min(p + 0.1, 1000));
      else if (e.key === 'ArrowLeft') setCurrentTime(p => Math.max(p - 0.1, 0));
      else if (ctrl && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? handleRedo() : handleUndo(); }
      else if (ctrl && e.key.toLowerCase() === 'y') { e.preventDefault(); handleRedo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, playbackSpeed, handleUndo, handleRedo]);

  // ── Seek ──
  const seekTo = useCallback((clientX: number) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const maxTime = tracks.length > 0 ? Math.max(...tracks.map(t => t.startTime + t.duration), 30) : 30;
    setCurrentTime(Math.max(0, Math.min(maxTime, (clientX - rect.left) / 135.6)));
  }, [tracks]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true; setIsDragging(true); seekTo(e.clientX);
  }, [seekTo]);
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return; seekTo(e.clientX);
  }, [seekTo]);
  const handlePointerUp = useCallback(() => { isDraggingRef.current = false; setIsDragging(false); }, []);

  // ── Canvas transform ──
  const handleTransformPointerDown = (e: React.PointerEvent, type: typeof transformRef.current.type, track: TimelineTrack) => {
    e.stopPropagation(); e.preventDefault();
    const container = e.currentTarget.closest('.canvas-container');
    if (!container) return;
    transformRef.current = { type, startX: e.clientX, startY: e.clientY, initialX: track.x || 0, initialY: track.y || 0, initialW: track.width || 100, initialH: track.height || 100, initialR: track.rotation || 0, trackId: track.id };
    const onMove = (ev: PointerEvent) => {
      const s = transformRef.current;
      if (!s.type) return;
      const rect = container.getBoundingClientRect();
      const dx = ((ev.clientX - s.startX) / rect.width) * 100;
      const dy = ((ev.clientY - s.startY) / rect.height) * 100;
      const u: Partial<TimelineTrack> = {};
      if (s.type === 'move') { u.x = s.initialX + dx; u.y = s.initialY + dy; }
      else if (s.type === 'rotate') {
        const cx = rect.left + rect.width * (s.initialX + s.initialW / 2) / 100;
        const cy = rect.top + rect.height * (s.initialY + s.initialH / 2) / 100;
        u.rotation = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI) + 90;
      } else {
        if (s.type.includes('e')) u.width = Math.max(5, s.initialW + dx);
        if (s.type.includes('w')) { const nw = Math.max(5, s.initialW - dx); u.width = nw; u.x = s.initialX + (s.initialW - nw); }
        if (s.type.includes('s')) u.height = Math.max(5, s.initialH + dy);
        if (s.type.includes('n')) { const nh = Math.max(5, s.initialH - dy); u.height = nh; u.y = s.initialY + (s.initialH - nh); }
      }
      setTracks(prev => prev.map(t => t.id === s.trackId ? { ...t, ...u } : t));
    };
    const onUp = () => { saveHistory(); transformRef.current.type = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ── Track operations ──
  const handleAddTrack = (file: { id: string; name: string; url?: string; type: string; size: number }, duration: number) => {
    const start = currentTime;
    const dur = duration > 0 ? duration : 5;
    const isAudio = file.type?.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name);
    let layer = 0;
    if (!isAudio) {
      while (tracks.some(t => (t.layerIndex || 0) === layer && start < t.startTime + t.duration - 0.05 && start + dur > t.startTime + 0.05)) layer++;
    } else {
      layer = (tracks.length > 0 ? Math.max(...tracks.map(t => t.layerIndex || 0)) : 0) + 1;
    }
    const newTrack: TimelineTrack = { id: Math.random().toString(36).substr(2, 9), name: file.name, duration: dur, startTime: start, color: 'bg-blue-100', type: file.type, url: file.url, layerIndex: layer, x: 0, y: 0, width: 100, height: 100, rotation: 0 };
    saveHistory();
    setTracks(prev => [...prev, newTrack]);
    setSelectedTrackIds([newTrack.id]);
  };

  const handleUpdateTrack = (id: string, updates: Partial<TimelineTrack>) => { saveHistory(); setTracks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)); };
  const handleDeleteTracks = (ids: string[]) => { saveHistory(); setTracks(prev => prev.filter(t => !ids.includes(t.id))); };
  const handleAddTracks = (newTracks: TimelineTrack[]) => { saveHistory(); setTracks(prev => [...prev, ...newTracks]); };

  const handleUpload = (files: FileList) => Array.from(files).forEach(f => handleAddTrack({ id: Math.random().toString(36).substr(2, 9), name: f.name, url: URL.createObjectURL(f), type: f.type, size: f.size }, 5));

  const activeVisualTrack = tracks
    .filter(t => (t.type?.startsWith('image/') || t.type?.startsWith('video/') || /\.(jpg|jpeg|png|gif|webp|mp4|mkv|webm|mov)$/i.test(t.name)) && currentTime >= t.startTime && currentTime <= t.startTime + t.duration)
    .sort((a, b) => (a.layerIndex || 0) - (b.layerIndex || 0))[0];
  const hasVisualTrack = tracks.some(t => t.type?.startsWith('image/') || t.type?.startsWith('video/') || /\.(jpg|jpeg|png|gif|webp|mp4|mkv|webm|mov)$/i.test(t.name));

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-fd-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  const commonTimelineProps = {
    tracks, isTimelineCollapsed, toggleTimeline: () => setIsTimelineCollapsed(p => !p),
    isPlaying, setIsPlaying, isDragging, currentTime, playbackSpeed, togglePlaybackSpeed,
    timelineRef, handlePointerDown, handlePointerMove, handlePointerUp, formatTime,
    updateTrack: handleUpdateTrack, onDeleteTracks: handleDeleteTracks, onAddTracks: handleAddTracks,
    clipboardTracks, setClipboardTracks, selectedTrackIds, setSelectedTrackIds,
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground rebrand-body">
      <style>{studioStyles}</style>

      <StudioHeader
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSaving={isSaving}
        projectTitle={projectTitle}
        onTitleChange={setProjectTitle}
      />

      <div className="flex flex-1 md:flex-row flex-col min-h-0 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <StudioSidebar
            onUpload={handleStudioUpload}
            onDeleteAsset={handleDeleteAsset}
            onAddTrack={handleAddTrack}
            activeTab={activeSidebarTab}
            setActiveTab={setActiveSidebarTab}
            assets={assets}
          />
        </div>

        <div className="flex flex-col flex-1 min-w-0 relative">
          <div className="flex flex-col flex-1 min-h-0 relative">
            <main className="flex-1 overflow-hidden bg-fd-accent/10 flex flex-col items-center justify-center relative">
              {hasVisualTrack ? (
                <div className="w-full h-full flex flex-col min-h-0 min-w-0">
                  <div className="flex w-full min-h-0 h-full">
                    <div className="flex flex-col gap-3 flex-1 p-2 md:p-6 w-full h-full min-h-[200px]">
                      <div className="flex relative isolate h-full w-full justify-center items-center p-4 pt-16 min-h-0 min-w-0 pb-[90px] flex-col">
                        <div className="relative w-full h-full max-w-full max-h-full min-w-0 min-h-0 canvas-container">
                          <div
                            className="absolute inset-0 m-auto max-w-full max-h-full canvas-stage transition-all duration-300 shadow-2xl"
                            style={{ aspectRatio: selectedRatio.ratio === 'auto' ? 'auto' : selectedRatio.ratio }}
                          >
                            {/* Layer 1: Video (overflow hidden) */}
                            <div className="absolute inset-0 bg-black/50 rounded-lg overflow-hidden pointer-events-none">
                              {activeVisualTrack && (
                                <div className="absolute pointer-events-none" style={{ left: `${activeVisualTrack.x}%`, top: `${activeVisualTrack.y}%`, width: `${activeVisualTrack.width}%`, height: `${activeVisualTrack.height}%`, transform: `rotate(${activeVisualTrack.rotation}deg)` }}>
                                  <div className="w-full h-full overflow-hidden relative rounded-sm">
                                    {activeVisualTrack.type?.startsWith('video/') ? (
                                      <video src={activeVisualTrack.url} className="w-full h-full object-fill" autoPlay muted loop />
                                    ) : (
                                      <img src={activeVisualTrack.url!} className="w-full h-full object-fill" alt={activeVisualTrack.name} />
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Layer 2: Transform handles (overflow visible) */}
                            <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
                              {activeVisualTrack && selectedTrackIds.includes(activeVisualTrack.id) && (
                                <div className="absolute pointer-events-auto overflow-visible touch-none" style={{ left: `${activeVisualTrack.x}%`, top: `${activeVisualTrack.y}%`, width: `${activeVisualTrack.width}%`, height: `${activeVisualTrack.height}%`, transform: `rotate(${activeVisualTrack.rotation}deg)` }}>
                                  <div onPointerDown={e => handleTransformPointerDown(e, 'move', activeVisualTrack)} className="absolute inset-0 border-2 border-[#3b82f6] pointer-events-auto touch-none shadow-[0_0_0_1px_rgba(255,255,255,0.4)]" style={{ cursor: 'grab' }} />
                                  {/* Corner handles */}
                                  {(['nw','ne','sw','se'] as const).map(dir => (
                                    <div key={dir} onPointerDown={e => handleTransformPointerDown(e, dir, activeVisualTrack)} className="absolute bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none rounded-full shadow-md hover:scale-125 transition-transform" style={{ width: 14, height: 14, cursor: dir === 'nw' || dir === 'se' ? 'nwse-resize' : 'nesw-resize', ...(dir.includes('n') ? { top: -7 } : { bottom: -7 }), ...(dir.includes('w') ? { left: -7 } : { right: -7 }) }} />
                                  ))}
                                  {/* Edge handles */}
                                  <div onPointerDown={e => handleTransformPointerDown(e, 'n', activeVisualTrack)} className="absolute bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none rounded shadow-sm" style={{ left: '50%', top: -6, width: 24, height: 12, transform: 'translateX(-50%)', cursor: 'ns-resize' }} />
                                  <div onPointerDown={e => handleTransformPointerDown(e, 'e', activeVisualTrack)} className="absolute bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none rounded shadow-sm" style={{ right: -6, top: '50%', width: 12, height: 24, transform: 'translateY(-50%)', cursor: 'ew-resize' }} />
                                  <div onPointerDown={e => handleTransformPointerDown(e, 's', activeVisualTrack)} className="absolute bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none rounded shadow-sm" style={{ left: '50%', bottom: -6, width: 24, height: 12, transform: 'translateX(-50%)', cursor: 'ns-resize' }} />
                                  <div onPointerDown={e => handleTransformPointerDown(e, 'w', activeVisualTrack)} className="absolute bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none rounded shadow-sm" style={{ left: -6, top: '50%', width: 12, height: 24, transform: 'translateY(-50%)', cursor: 'ew-resize' }} />
                                  {/* Rotation handle */}
                                  <div onPointerDown={e => handleTransformPointerDown(e, 'rotate', activeVisualTrack)} className="absolute rounded-full bg-white border-2 border-[#3b82f6] pointer-events-auto touch-none flex items-center justify-center -top-16 left-1/2 -translate-x-1/2 shadow-xl hover:scale-110 transition-transform" style={{ width: 36, height: 36, cursor: 'grab' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="p-1 pointer-events-none">
                                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom toolbar */}
                        <div className="flex justify-center mt-3 w-full">
                          <div className="flex items-center gap-2 relative z-20">
                            <div className="flex rounded-[10px] border border-gray-alpha-150 bg-background flex-row divide-x">
                              <div className="flex items-center p-0.5">
                                <DropdownMenu.Root>
                                  <DropdownMenu.Trigger asChild>
                                    <button className="flex items-center gap-2 px-3 h-9 hover:bg-gray-alpha-100 rounded-lg outline-none">
                                      <div className="shrink-0">{selectedRatio.icon}</div>
                                      <span className="text-foreground font-medium text-xs">{selectedRatio.label}</span>
                                    </button>
                                  </DropdownMenu.Trigger>
                                  <DropdownMenu.Portal>
                                    <DropdownMenu.Content align="start" sideOffset={8} className="z-50 min-w-[220px] p-1.5 bg-white dark:bg-black border border-fd-border shadow-xl rounded-2xl animate-in fade-in-0 zoom-in-95">
                                      {aspectRatios.map(r => (
                                        <DropdownMenu.Item key={r.label} onSelect={() => setSelectedRatio(r)} className="flex items-center gap-3 px-2 py-2 rounded-md outline-none hover:bg-fd-accent/50 cursor-pointer">
                                          <div className="shrink-0">{r.icon}</div>
                                          <div className="flex flex-col">
                                            <span className="text-sm font-medium">{r.label}</span>
                                            <span className="text-xs opacity-60">{r.subtext}</span>
                                          </div>
                                          {selectedRatio.label === r.label && <Check className="ml-auto w-4 h-4" />}
                                        </DropdownMenu.Item>
                                      ))}
                                    </DropdownMenu.Content>
                                  </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                              </div>
                              <div className="flex items-center p-0.5">
                                <button onClick={() => setActiveSidebarTab('captions')} className="flex items-center gap-2 px-3 h-9 hover:bg-gray-alpha-100 rounded-lg outline-none">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0909 2H4.90909C3.30245 2 2 3.30245 2 4.90909V15.0909C2 16.6976 3.30245 18 4.90909 18H15.0909C16.6976 18 18 16.6976 18 15.0909V4.90909C18 3.30245 16.6976 2 15.0909 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round"/><path d="M9.17373 13.5672C7.85889 13.5672 6.85986 12.7164 6.85986 11.4725C6.85986 10.2156 7.82666 9.48731 9.554 9.38418L11.2942 9.28106V8.82344C11.2942 8.17891 10.8431 7.80508 10.1341 7.80508C9.56045 7.80508 9.2124 7.99199 8.79346 8.5334C8.58721 8.76543 8.34873 8.88145 8.0458 8.88145C7.58818 8.88145 7.25947 8.58496 7.25947 8.15957C7.25947 8.01133 7.2915 7.87598 7.35615 7.73418C7.67842 6.90918 8.78701 6.4 10.2179 6.4C11.9903 6.4 13.144 7.31524 13.144 8.70742V12.6455C13.144 13.2707 12.7638 13.593 12.2288 13.593C11.7196 13.593 11.3651 13.3094 11.3265 12.7551V12.4006H11.2878C10.9011 13.1354 10.0374 13.5672 9.17373 13.5672ZM9.79248 12.2072C10.6175 12.2072 11.2942 11.6723 11.2942 10.9246V10.4219L9.8376 10.5121C9.13506 10.5637 8.73545 10.8795 8.73545 11.3693C8.73545 11.885 9.16084 12.2072 9.79248 12.2072Z" fill="currentColor"/></svg>
                                  <span className="text-foreground font-medium text-xs">Legendas</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[13px] text-fd-muted-foreground mb-4">Comece a criar: adicione vídeos, fotos e trilhas sonoras para dar vida ao seu podcast.</p>
                  <button onClick={() => document.getElementById('main-video-upload-proj')?.click()} className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors bg-background border border-fd-border hover:bg-fd-accent text-foreground h-8 px-4 rounded-lg text-[13px]">
                    Enviar arquivo
                  </button>
                  <input id="main-video-upload-proj" className="sr-only" accept="video/*,image/*" multiple type="file" onChange={e => e.target.files && handleUpload(e.target.files)} />
                </div>
              )}

              {/* Mobile bottom bar */}
              <div className="absolute w-full left-0 grow-0 px-2 block md:hidden bottom-[10px]" style={{ opacity: 1 }}>
                <div className="w-full flex flex-row justify-between">
                  <button onClick={() => setActiveSidebarTab(lastActiveSidebarTab)} className="relative inline-flex items-center justify-center text-sm font-medium border border-gray-alpha-200 text-foreground h-9 px-3 rounded-[10px] bg-background">
                    Ações
                  </button>
                  <button className="relative inline-flex items-center justify-center text-sm font-medium border border-gray-alpha-200 text-foreground h-9 px-3 rounded-[10px] bg-background max-w-[40%]">
                    <span className="truncate">Selecionar voz...</span>
                  </button>
                </div>
              </div>
            </main>

            {/* Mobile timeline + sidebar */}
            <div className="flex flex-col shrink-0 md:hidden">
              <TimelineSection {...commonTimelineProps} height={150} onHeightChange={setTimelineHeight} />
              <StudioSidebar onUpload={handleStudioUpload} onAddTrack={handleAddTrack} activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} assets={assets} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop timeline */}
      <div className="hidden md:block shrink-0">
        <TimelineSection {...commonTimelineProps} height={timelineHeight} onHeightChange={setTimelineHeight} />
      </div>
    </div>
  );
}
