'use client';

import React, { useRef, useEffect, memo } from 'react';
import { TimelineTrack } from '@/lib/db';

interface TrackAudioProps {
  track: TimelineTrack;
  globalTime: number;
  isPlaying: boolean;
  playbackRate: number;
  onDurationUpdate?: (id: string, duration: number) => void;
  forwardedRef?: React.RefObject<HTMLAudioElement | null>;
}

const TrackAudioComponent = ({ 
  track, 
  globalTime, 
  isPlaying, 
  playbackRate,
  onDurationUpdate,
  forwardedRef
}: TrackAudioProps) => {
  const internalRef = useRef<HTMLAudioElement>(null);
  const audioRef = forwardedRef || internalRef;

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Sync playback state and time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track.url) return;

    const start = track.startTime;
    const end = track.startTime + track.duration;

    if (globalTime >= start && globalTime < end) {
      const localTime = globalTime - start;
      // Seek if drift is > 300ms to avoid micro-stuttering
      // CRITICAL: We only sync secondary tracks. The Master track (forwardedRef) 
      // is the clock source and should NEVER be "corrected" during playback.
      if (!forwardedRef && Math.abs(audio.currentTime - localTime) > 0.3) {
        audio.currentTime = localTime;
      }
      
      if (isPlaying) {
        if (audio.paused) audio.play().catch(() => {});
      } else {
        if (!audio.paused) audio.pause();
      }
    } else {
      // Out of range
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [globalTime, isPlaying, track.startTime, track.duration, track.url]);

  if (!track.url || (!track.url.startsWith('http') && !track.url.startsWith('/') && !track.url.startsWith('blob:'))) {
    return null;
  }

  // Use the raw URL to avoid double-encoding issues
  const audioSrc = track.url;

  return (
    <audio 
      ref={audioRef as any} 
      src={audioSrc} 
      preload="auto" 
      style={{ display: 'none' }} 
      onLoadedMetadata={(e) => {
        const dur = e.currentTarget.duration;
        if (dur > 0 && Math.abs(dur - track.duration) > 0.1) {
          onDurationUpdate?.(track.id, dur);
        }
      }}
      onError={(e) => {
        console.error(`Audio Track Error (${track.id}):`, e);
      }}
    />
  );
};

export const TrackAudio = memo(TrackAudioComponent);
TrackAudio.displayName = 'TrackAudio';

interface CompositeAudioEngineProps {
  tracks: TimelineTrack[];
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onDurationUpdate?: (id: string, duration: number) => void;
  masterAudioRef?: React.RefObject<HTMLAudioElement | null>;
}

export function CompositeAudioEngine({ 
  tracks, 
  currentTime, 
  isPlaying, 
  playbackSpeed,
  onDurationUpdate,
  masterAudioRef
}: CompositeAudioEngineProps) {
  return (
    <>
      {tracks.map(track => (
        <TrackAudio 
          key={track.id}
          track={track}
          globalTime={currentTime}
          isPlaying={isPlaying}
          playbackRate={playbackSpeed}
          onDurationUpdate={onDurationUpdate}
          forwardedRef={track.id === 'audio-main' ? masterAudioRef : undefined}
        />
      ))}
    </>
  );
}
