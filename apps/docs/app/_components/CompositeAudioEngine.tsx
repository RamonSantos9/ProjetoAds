'use client';

import React, { useRef, useEffect, memo } from 'react';
import { TimelineTrack } from '@/lib/db';

interface TrackAudioProps {
  track: TimelineTrack;
  globalTime: number;
  isPlaying: boolean;
  playbackRate: number;
  onDurationUpdate?: (id: string, duration: number) => void;
}

export const TrackAudio = memo(({ 
  track, 
  globalTime, 
  isPlaying, 
  playbackRate,
  onDurationUpdate
}: TrackAudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

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
      // Seek if drift is > 150ms to avoid micro-stuttering
      if (Math.abs(audio.currentTime - localTime) > 0.15) {
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

  return (
    <audio 
      ref={audioRef} 
      src={track.url} 
      preload="auto" 
      style={{ display: 'none' }} 
      onLoadedMetadata={(e) => {
        const dur = e.currentTarget.duration;
        if (dur > 0 && Math.abs(dur - track.duration) > 0.1) {
          onDurationUpdate?.(track.id, dur);
        }
      }}
    />
  );
});
TrackAudio.displayName = 'TrackAudio';

interface CompositeAudioEngineProps {
  tracks: TimelineTrack[];
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onDurationUpdate?: (id: string, duration: number) => void;
}

export function CompositeAudioEngine({ 
  tracks, 
  currentTime, 
  isPlaying, 
  playbackSpeed,
  onDurationUpdate 
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
        />
      ))}
    </>
  );
}
