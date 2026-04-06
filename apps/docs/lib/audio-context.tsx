'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

interface Voice {
  name: string;
  desc: string;
  img: string;
  hue: number;
  url?: string;
  sampleUrl?: string;
  audioUrl?: string;
  slug?: string;
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

  useEffect(() => {
    if (!audio) return;

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
  }, [audio]);

  const playTrack = (voice: Voice) => {
    if (!audio) return;

    const url = voice.audioUrl || voice.url || voice.sampleUrl;

    if (!url) {
      console.warn('No audio URL found for this track');
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

    audio.src = url;
    playPromiseRef.current = audio.play();
    playPromiseRef.current.catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  };

  const pauseTrack = () => {
    if (!audio) return;

    if (playPromiseRef.current !== null) {
      playPromiseRef.current
        .then(() => {
          audio.pause();
          playPromiseRef.current = null;
        })
        .catch(() => {
          // Play was already aborted, safely clear ref
          playPromiseRef.current = null;
        });
    } else {
      audio.pause();
    }
  };

  const resumeTrack = () => {
    if (audio) {
      playPromiseRef.current = audio.play();
      playPromiseRef.current.catch(console.error);
    }
  };

  const seek = (time: number) => {
    if (audio) {
      audio.currentTime = time;
    }
  };

  const rewind = () => {
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const fastForward = () => {
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
  };

  const hidePlayer = () => {
    setIsVisible(false);
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
