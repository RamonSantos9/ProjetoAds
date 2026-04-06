'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { type Voice, languages } from '../../_data/landing';

interface VoiceListProps {
  voices: Voice[];
  selectedVoiceId: string;
  onVoiceSelect: (id: string) => void;
  currentPreviewingId: string | null;
  onPreview: (url: string, id: string) => void;
}

export function VoiceList({
  voices,
  selectedVoiceId,
  onVoiceSelect,
  currentPreviewingId,
  onPreview,
}: VoiceListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [voices]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const amount = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative z-10 flex h-[20rem] w-full flex-none snap-start flex-col border-r border-fd-border md:w-1/2">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex h-72 snap-x snap-mandatory flex-col flex-wrap overflow-x-auto pt-2 no-scrollbar"
        role="radiogroup"
        aria-label="Voz"
      >
        {voices.map((voice, idx) => {
          const isSelected = voice.id === selectedVoiceId;

          return (
            <div
              key={voice.id}
              className="group relative w-full snap-start"
              onClick={() => onVoiceSelect(voice.id)}
            >
              <label
                className="block cursor-pointer px-3"
                style={{ paddingTop: '0.6875rem' }}
              >
                <span className="sr-only">
                  <input
                    type="radio"
                    value={voice.id}
                    checked={isSelected}
                    readOnly
                    name="voice-selection"
                  />
                </span>
                <div className="relative isolate flex h-12 items-center gap-2 rounded-xl pl-3 pr-4 transition-colors">
                  <div
                    className={cn(
                      'absolute inset-x-0 inset-y-0 -z-10 rounded-xl bg-fd-muted transition-opacity',
                      isSelected
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100',
                    )}
                  />
                  <div className="relative flex-none">
                    <img
                      alt={voice.name}
                      src={voice.image}
                      className="h-8 w-8 rounded-full object-cover"
                      style={{ filter: `hue-rotate(${idx * 72}deg)` }}
                    />
                    {isSelected ? (
                      <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-fd-foreground ring-2 ring-fd-card">
                        <svg
                          fill="none"
                          viewBox="0 0 12 12"
                          className="h-2.5 w-2.5"
                          aria-hidden="true"
                        >
                          <path
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m4 6.4 1.2 1.2L8 4.4"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-auto items-baseline justify-between gap-3">
                    <div
                      className={cn(
                        'truncate text-sm font-medium transition-colors',
                        isSelected
                          ? 'text-fd-foreground'
                          : 'text-fd-muted-foreground',
                      )}
                    >
                      {voice.name}
                    </div>
                    <div
                      className={cn(
                        'max-w-[100px] truncate text-[10px] font-medium text-fd-muted-foreground transition-all duration-200',
                        isSelected || currentPreviewingId === voice.id
                          ? 'invisible opacity-0'
                          : 'visible opacity-100 group-hover:invisible group-hover:opacity-0',
                      )}
                    >
                      {voice.description}
                    </div>
                  </div>
                </div>
              </label>
              <button
                type="button"
                className={cn(
                  'absolute right-5 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-fd-card text-fd-foreground outline-none ring-1 ring-fd-border shadow-sm transition-all',
                  isSelected || currentPreviewingId === voice.id
                    ? 'visible opacity-100 hover:bg-fd-muted'
                    : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 hover:bg-fd-muted',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(voice.previewUrl || '', voice.id);
                }}
                aria-label="Pré-visualizar"
              >
                {currentPreviewingId === voice.id ? (
                  <div className="h-2.5 w-2.5 animate-pulse rounded-sm bg-fd-foreground" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fill="currentColor"
                      d="M9.244 2.368C7.414 1.184 5 2.497 5 4.676v14.648c0 2.18 2.414 3.493 4.244 2.309l11.318-7.324c1.675-1.084 1.675-3.534 0-4.618z"
                    />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex px-3 pb-5 md:pb-3">
        <a
          href="#"
          className="hidden h-9 items-center justify-center rounded-full bg-fd-card px-3.5 text-sm/none text-fd-foreground transition-colors shadow-[0_0_1px_rgb(0_0_0_/_0.28),0_4px_4px_rgb(0_0_0_/_0.06)] hover:bg-fd-muted md:flex dark:shadow-[0_0_1px_rgb(255_255_255_/_0.12),0_10px_30px_rgb(0_0_0_/_0.25)]"
        >
          Explore {voices.length} vozes e {languages.length} idiomas
        </a>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
              canScrollLeft
                ? 'text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground'
                : 'text-fd-muted-foreground/40 disabled:opacity-50',
            )}
            disabled={!canScrollLeft}
          >
            <svg fill="none" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m13.586 16-3.293-3.293a1 1 0 0 1 0-1.414L13.586 8"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
              canScrollRight
                ? 'text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground'
                : 'text-fd-muted-foreground/40 disabled:opacity-50',
            )}
            disabled={!canScrollRight}
          >
            <svg fill="none" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m10 16 3.293-3.293a1 1 0 0 0 0-1.414L10 8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
