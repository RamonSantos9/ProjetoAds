'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { CompositeAudioEngine } from '@/app/_components/CompositeAudioEngine';
import { TimelineTrack } from './db';
import { toast } from 'sonner';

interface Voice {
  name: string;
  desc: string;
  img: string;
  hue: number;
  url?: string;
  sampleUrl?: string;
  audioUrl?: string;
  slug?: string;
  tracks?: TimelineTrack[];
}

interface AudioContextType {
  currentVoice: Voice | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playTrack: (voice: Voice) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seek: (time: number) => void;
  rewind: () => void;
  fastForward: () => void;
  isVisible: boolean;
  hidePlayer: () => void;
  isMinimized: boolean;
  minimizePlayer: () => void;
  expandPlayer: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  isInlinePlayerVisible: boolean;
  setInlinePlayerVisible: (visible: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentVoice, setCurrentVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1.0);
  const [isInlinePlayerVisible, setIsInlinePlayerVisible] = useState(false);

  // Store the actual audio element
  const [audio] = useState(() =>
    typeof Audio !== 'undefined' ? new Audio() : null,
  );

  const setInlinePlayerVisible = (visible: boolean) => {
    setIsInlinePlayerVisible(visible);
  };
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const setPlaybackRate = (rate: number) => {
    if (audio) {
      audio.playbackRate = rate;
      setPlaybackRateState(rate);
    }
  };

  const toggleMute = () => {
    if (audio) {
      const newMuted = !isMuted;
      audio.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  // ── Single-Track Audio Event Listeners ──
  useEffect(() => {
    if (!audio) return;
    if (currentVoice?.tracks && currentVoice.tracks.length > 0) return; // Skip in multi-track mode

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, [audio, currentVoice?.tracks]);

  // ── Multi-Track Clock Loop ──
  useEffect(() => {
    if (!currentVoice?.tracks || currentVoice.tracks.length === 0) return;
    
    let rafId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setCurrentTime(prev => {
          const next = prev + delta * playbackRate;
          if (next >= duration) {
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
  }, [isPlaying, currentVoice?.tracks, duration, playbackRate]);

  const playTrack = (voice: Voice) => {
    if (!audio) return;

    const url = voice.audioUrl || voice.url || voice.sampleUrl;

    if (!url && (!voice.tracks || voice.tracks.length === 0)) {
      console.warn('No audio URL or tracks found for this track');
      return;
    }

    if (currentVoice?.name === voice.name) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
      return;
    }

    setCurrentVoice(voice);
    setIsVisible(true);
    setIsMinimized(false);

    if (voice.tracks && voice.tracks.length > 0) {
      // Multi-track mode
      const totalDur = Math.max(...voice.tracks.map(t => t.startTime + t.duration));
      setDuration(totalDur);
      setCurrentTime(0);
      setIsPlaying(true);
      audio.src = ''; // Clear single-track source
    } else if (url && (url.startsWith('http') || url.startsWith('/') || url.startsWith('blob:'))) {
      // Single-track mode - Only set if url looks valid
      const encodedUrl = encodeURI(url);
      audio.src = encodedUrl;
      playPromiseRef.current = audio.play();
      playPromiseRef.current.catch((e) => {
        if (e.name !== 'AbortError') {
          console.error('Audio Playback Error:', e);
          toast.error("Não foi possível reproduzir o áudio. Verifique se o arquivo ainda existe.", {
            description: "Erro: " + (e.message || "Arquivo não encontrado"),
            duration: 5000
          });
          setIsPlaying(false);
        }
      });
    } else {
      console.warn('Invalid or unsupported audio URL:', url);
      toast.error("Link de áudio inválido ou indisponível.");
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (!audio) return;

    if (playPromiseRef.current !== null) {
      playPromiseRef.current
        .then(() => {
          audio.pause();
          playPromiseRef.current = null;
        })
        .catch(() => {
          playPromiseRef.current = null;
        });
    } else {
      audio.pause();
    }
  };

  const resumeTrack = () => {
    setIsPlaying(true);
    if (currentVoice?.tracks && currentVoice.tracks.length > 0) return;

    if (audio) {
      playPromiseRef.current = audio.play();
      playPromiseRef.current.catch((e) => {
        console.error('Resume playback error:', e);
        toast.error("Erro ao retomar o áudio.", {
          description: "O arquivo pode estar inacessível."
        });
        setIsPlaying(false);
      });
    }
  };

  const seek = (time: number) => {
    if (currentVoice?.tracks && currentVoice.tracks.length > 0) {
      setCurrentTime(time);
    } else if (audio) {
      audio.currentTime = time;
    }
  };

  const rewind = () => {
    const newTime = Math.max(0, currentTime - 10);
    seek(newTime);
  };

  const fastForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    seek(newTime);
  };

  const hidePlayer = () => {
    setIsVisible(false);
    setIsPlaying(false);
    audio?.pause();
  };

  const minimizePlayer = () => setIsMinimized(true);
  const expandPlayer = () => setIsMinimized(false);

  return (
    <AudioContext.Provider
      value={{
        currentVoice,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        pauseTrack,
        resumeTrack,
        seek,
        rewind,
        fastForward,
        isVisible,
        hidePlayer,
        isMinimized,
        minimizePlayer,
        expandPlayer,
        isMuted,
        toggleMute,
        playbackRate,
        setPlaybackRate,
        isInlinePlayerVisible,
        setInlinePlayerVisible,
      }}
    >
      {children}
      {/* Global Multi-Track Engine */}
      {currentVoice?.tracks && (
        <CompositeAudioEngine
          tracks={currentVoice.tracks}
          currentTime={currentTime}
          isPlaying={isPlaying}
          playbackSpeed={playbackRate}
        />
      )}
    </AudioContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
}
