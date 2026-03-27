'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Voice {
  name: string;
  desc: string;
  img: string;
  hue: number;
  url?: string;
  sampleUrl?: string;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentVoice, setCurrentVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Store the actual audio element
  const [audio] = useState(() => typeof Audio !== 'undefined' ? new Audio() : null);

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

    const url = voice.sampleUrl || voice.url || "https://storage.googleapis.com/eleven-public-prod/database/workspace/9ffd9eb76f364648abbfb2c74b299b4a/voices/goT3UYdM9bhm0n2lmKQx/8e1e53b7-9320-4bab-acf2-86d7e77d1b8b.mp3";

    if (currentVoice?.name === voice.name) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      return;
    }

    setCurrentVoice(voice);
    setIsVisible(true);
    setIsMinimized(false);
    
    // Stop current track before changing src
    audio.pause();
    audio.src = url;
    audio.play().catch(console.error);
  };

  const pauseTrack = () => {
    audio?.pause();
  };

  const resumeTrack = () => {
    audio?.play().catch(console.error);
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
    <AudioContext.Provider value={{
      currentVoice, isPlaying, currentTime, duration,
      playTrack, pauseTrack, resumeTrack, seek, rewind, fastForward,
      isVisible, hidePlayer, isMinimized, minimizePlayer, expandPlayer
    }}>
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

