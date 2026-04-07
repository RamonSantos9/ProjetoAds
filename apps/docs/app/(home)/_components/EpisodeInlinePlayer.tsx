'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pause } from 'lucide-react';
import { cn } from '@/lib/cn';

import { useAudioPlayer } from '@/lib/audio-context';

interface Episode {
  title: string;
  summary: string;
  duration: string;
  audioUrl: string;
  category: string;
  tracks?: import('@/lib/db').TimelineTrack[];
}

interface EpisodeInlinePlayerProps {
  episode: Episode;
}

export function EpisodeInlinePlayer({ episode }: EpisodeInlinePlayerProps) {
  const {
    currentVoice,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    rewind,
    fastForward,
    seek,
    isMuted,
    toggleMute,
    playbackRate,
    setPlaybackRate,
    setInlinePlayerVisible,
  } = useAudioPlayer();

  const [isSticky, setIsSticky] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer para o estado Sticky
    const stickyObserver = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      { threshold: [1] },
    );

    // Observer para visibilidade global (se o player sumiu da tela por completo)
    const visibilityObserver = new IntersectionObserver(
      ([e]) => {
        setInlinePlayerVisible(e.isIntersecting);
      },
      { threshold: [0] },
    );

    if (playerRef.current) {
      stickyObserver.observe(playerRef.current);
      visibilityObserver.observe(playerRef.current);
    }

    return () => {
      stickyObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [setInlinePlayerVisible]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (!episode) return;

    const isCurrentTrack = currentVoice?.url === episode.audioUrl;

    if (isCurrentTrack) {
      if (isPlaying) pauseTrack();
      else resumeTrack();
    } else {
      playTrack({
        name: episode.title,
        desc: episode.category,
        img: 'default-voice.png',
        hue: 140,
        url: episode.audioUrl,
        tracks: episode.tracks,
      });
    }
  };

  const isCurrentEpisodePlaying =
    isPlaying && currentVoice?.url === episode?.audioUrl;
  const progress = duration ? currentTime / duration : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  return (
    <div
      ref={playerRef}
      aria-label="Audio Player"
      className="w-full overflow-hidden"
    >
      <div className="flex items-center bg-background">
        {/* Play Button Container */}
        <div className="w-auto h-full p-2 flex items-center justify-center">
          <button
            type="button"
            aria-label="Play audio"
            className="w-[60px] h-[60px] border-none rounded-full cursor-pointer relative overflow-hidden flex items-center justify-center bg-black dark:bg-white text-white dark:text-black transition-transform"
            onClick={handleTogglePlay}
          >
            {/* Play Button Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

            {isCurrentEpisodePlaying ? (
              <Pause className="w-7 h-7 fill-current relative z-10" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0"
                fontSize="2rem"
                viewBox="0 0 24 24"
                className="ml-1 w-10 h-10 relative z-10"
              >
                <path stroke="none" d="M7 6v12l10-6z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center gap-1 pt-[2px] relative h-full">
          {/* Title and Author */}
          <div className="flex justify-center items-center h-4">
            <div className="flex justify-center items-center max-w-[60vw] tracking-tight">
              <span className="max-w-[40vw] truncate">{episode.title}</span>
              <div className="inline-block h-[1px] w-[1ch] mx-[1ch] self-center" />
              <span className="max-w-[30vw] truncate opacity-50 font-medium">
                {episode.category}
              </span>
            </div>
          </div>

          {/* Progress Bar and Times */}
          <div className="flex items-center gap-3 w-full mt-1">
            <time className="text-[0.75rem] w-[5ch] text-end select-none tabular-nums">
              {formatTime(currentTime)}
            </time>

            <div
              role="button"
              className="relative flex flex-1 h-[10px] rounded-full cursor-pointer group/progress"
              onClick={handleSeek}
            >
              {/* Rail */}
              <div className="absolute top-[3px] h-[4px] w-full rounded-full overflow-hidden pointer-events-none bg-current/10" />

              {/* Bar */}
              <div className="absolute top-[3px] h-[4px] w-full rounded-full overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0 bg-current origin-left"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>

              {/* Handle */}
              <div
                className="absolute top-[5px] h-[10px] w-[2px] bg-current rounded-full pointer-events-none transition-all group-hover/progress:h-[12px] group-hover/progress:w-[4px]"
                style={{
                  left: `${progress * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>

            <time className="text-[0.75rem] w-[5ch] text-start select-none tabular-nums">
              {duration > 0
                ? formatTime(duration)
                : (episode as any).duration.replace(' min', ':00')}
            </time>
          </div>

          {/* Actions */}
          <div className="flex gap-7 mx-auto text-[0.9rem] items-center mt-1">
            <button
              onClick={rewind}
              type="button"
              aria-label="Rewind 15 seconds"
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.1em"
                height="1.1em"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <path d="M8 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H8v-3h3M15 18a6 6 0 100-12H4M5 14v6"></path>
                <path d="M7 9L4 6l3-3"></path>
              </svg>
            </button>

            <div className="relative group inline-block">
              {/* Tooltip Speed Options */}
              <div className="absolute left-[-0.5rem] top-[-1.9rem] h-[1.5rem] rounded-[8px] px-[0.5rem] backdrop-blur-[4px] bg-black text-white hidden group-hover:flex items-center justify-center shadow-lg -translate-x-[4ch] transition-all">
                {[0.8, 1.0, 1.2, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={cn(
                      'w-[4ch] text-center cursor-pointer select-none text-[0.8rem] font-bold hover:opacity-100 transition-opacity',
                      playbackRate === rate ? 'opacity-100' : 'opacity-70',
                    )}
                  >
                    <span>{rate.toFixed(1)}x</span>
                  </button>
                ))}
              </div>

              {/* Main Speed Button - Now with Cycle logic */}
              <button
                type="button"
                onClick={() => {
                  const rates = [0.8, 1.0, 1.2, 1.5, 2.0];
                  const currentIndex = rates.indexOf(playbackRate);
                  const nextIndex = (currentIndex + 1) % rates.length;
                  setPlaybackRate(rates[nextIndex]);
                }}
                className="relative inline-block text-[0.8rem] font-black w-[4ch] text-center select-none cursor-pointer hover:opacity-70 transition-opacity"
              >
                {playbackRate.toFixed(1)}x
              </button>
            </div>

            <button
              onClick={fastForward}
              type="button"
              aria-label="Fast forward 15 seconds"
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.1em"
                height="1.1em"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <path d="M17 9l3-3-3-3"></path>
                <path d="M9 18A6 6 0 119 6h11M16 20h2a1 1 0 001-1v-1a1 1 0 00-1-1h-2v-3h3M13 14v6"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Volume Container */}
        <div className="w-auto min-w-[60px] h-full p-3 flex items-center justify-center text-[1.2rem] opacity-70 hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="cursor-pointer -mt-1 scale-110 active:scale-95 transition-transform"
            onClick={toggleMute}
          >
            {isMuted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                width="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M0.102122,9.10212v6l3.55271e-14,4.52987e-07c2.50178e-07,1.65685 1.34315,3 3,3h2.65l6.35,5v-5.38l-10.91,-10.91l-2.60839e-07,2.15336e-07c-0.683992,0.56467 -1.08305,1.40307 -1.09,2.29Zm21.38,11l2.57883e-07,-3.48565e-07c4.41117,-5.96232 3.16798,-14.3695 -2.78,-18.8l4.23752e-08,3.17814e-08c-0.441828,-0.331371 -1.06863,-0.241828 -1.4,0.2c-0.331371,0.441828 -0.241828,1.06863 0.2,1.4c1.29779e-08,9.7334e-09 1.62223e-08,1.21668e-08 2.92002e-08,2.19001e-08l6.32019e-07,4.69153e-07c4.96483,3.68544 6.11484,10.643 2.6,15.73l-1.6,-1.59l5.16025e-07,-6.88458e-07c2.41371,-3.22027 2.15172,-7.71217 -0.620001,-10.63l4.49398e-08,4.72193e-08c-0.381076,-0.400406 -1.01459,-0.416077 -1.415,-0.0350001c-0.400406,0.381076 -0.416077,1.01459 -0.0350001,1.415l9.88607e-08,1.03887e-07c2.02516,2.12812 2.29169,5.38058 0.64,7.81l-4.97,-4.91v-9.59l-5.37,4.22l-4.92,-4.93l6.9121e-08,6.91211e-08c-0.392122,-0.392122 -1.02788,-0.392122 -1.42,-1.38242e-07c-0.392122,0.392122 -0.392122,1.02788 -1.38242e-07,1.42c0,0 0,0 0,0l22,22l-3.12092e-08,-3.14662e-08c0.38892,0.392122 1.02208,0.394718 1.4142,0.00579839c0.00194069,-0.00192484 0.00385763,-0.00385763 0.00579832,-0.00579832l4.18882e-08,-4.15461e-08c0.392122,-0.38892 0.394718,-1.02208 0.00579824,-1.4142c-0.00192484,-0.00194069 -0.00385763,-0.00385763 -0.00579832,-0.00579832Z"
                  transform="translate(-0.102122, -0.102122)"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                width="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3,5.13137l-1.31134e-07,3.55271e-15c-1.65685,7.24234e-08 -3,1.34315 -3,3c0,0 0,1.77636e-15 0,1.77636e-15v6l3.19744e-14,4.52987e-07c2.50178e-07,1.65685 1.34315,3 3,3h2.65l6.35,5v-22l-6.35,5Zm17,6l3.22943e-07,0.000513405c-0.00126608,-2.11713 -0.81346,-4.15334 -2.26965,-5.69014l4.49398e-08,4.72193e-08c-0.381076,-0.400406 -1.01459,-0.416077 -1.415,-0.0350001c-0.400406,0.381076 -0.416077,1.01459 -0.0350001,1.415l3.56262e-08,3.74132e-08c2.29841,2.4137 2.29841,6.2063 -7.12523e-08,8.62l2.29995e-08,-2.28117e-08c-0.392122,0.38892 -0.394718,1.02208 -0.00579837,1.4142c0.00192484,0.00194069 0.00385763,0.00387348 0.00579832,0.00579832l1.49479e-08,1.40058e-08c0.194393,0.182142 0.453427,0.279193 0.719647,0.269627l5.01314e-08,3.09438e-10c0.27566,0.00170152 0.539796,-0.110466 0.73,-0.31l2.80721e-07,-2.96224e-07c1.45628,-1.53671 2.2686,-3.57287 2.27,-5.69Zm-1.4,-10.8l3.78218e-08,2.83663e-08c-0.441828,-0.331371 -1.06863,-0.241828 -1.4,0.2c-0.331371,0.441828 -0.241828,1.06863 0.2,1.4c1.00526e-08,7.53946e-09 2.76447e-08,2.07335e-08 3.76973e-08,2.8273e-08l6.40586e-07,4.8044e-07c5.08102,3.81077 6.11076,11.019 2.3,16.1c-0.653824,0.871765 -1.42823,1.64618 -2.3,2.3l-7.79577e-08,5.84683e-08c-0.441828,0.331371 -0.531371,0.958172 -0.2,1.4l5.13133e-08,6.84178e-08c0.188854,0.251806 0.485243,0.4 0.8,0.4l-4.37114e-08,3.55271e-15c0.21637,9.45784e-09 0.426904,-0.0701779 0.6,-0.2l7.51993e-07,-5.63995e-07c5.96467,-4.47351 7.17351,-12.9353 2.7,-18.9c-0.767532,-1.02338 -1.67662,-1.93247 -2.7,-2.7Z"
                  transform="translate(-7.24234e-08, 0.868629)"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
