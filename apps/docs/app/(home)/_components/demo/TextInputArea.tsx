'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { type Language, languages } from '../../_data/landing';

interface TextInputAreaProps {
  text: string;
  onTextChange: (text: string) => void;
  onPlay: () => void;
  onStop: () => void;
  isLoading: boolean;
  isPlaying: boolean;
  highlightCharIndex: number;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function TextInputArea({
  text,
  onTextChange,
  onPlay,
  onStop,
  isLoading,
  isPlaying,
  highlightCharIndex,
  selectedLanguage,
  onLanguageChange,
}: TextInputAreaProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const renderHighlightedText = () => {
    const result: React.ReactNode[] = [];
    const regex = /\[.*?\]|\S+|\s+/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const part = match[0];
      const start = match.index;
      const end = start + part.length - 1;

      if (part.startsWith('[') && part.endsWith(']')) {
        result.push(
          <span key={start} className="rounded bg-fd-muted px-0.5 text-fd-muted-foreground">
            {part}
          </span>,
        );
        continue;
      }

      if (!part.trim()) {
        result.push(<span key={start}>{part}</span>);
        continue;
      }

      const isActive =
        isPlaying && highlightCharIndex >= start && highlightCharIndex <= end;
      const isPast = isPlaying && highlightCharIndex > end;

      result.push(
        <span
          key={start}
          className={cn(
            'rounded-sm transition-colors duration-75',
            isActive && 'bg-fd-foreground px-0.5 text-fd-background',
            isPast && 'text-fd-muted-foreground',
          )}
        >
          {part}
        </span>,
      );
    }

    return result;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onStop();
      return;
    }

    onPlay();
  };

  return (
    <div className="relative flex min-h-[20rem] w-full flex-none snap-start flex-col md:w-1/2">
      <div className="pointer-events-none absolute inset-x-0 z-50 hidden h-10 rounded-tr-3xl border-r-[0.5px] border-t-[0.5px] border-fd-border md:block" />

      <div className="flex h-60 flex-auto flex-col overflow-y-auto scroll-pb-6 scroll-pt-4 no-scrollbar">
        <div className="pointer-events-none sticky top-0 z-10 -mb-3 hidden h-11 flex-none items-end px-5 pb-3 md:flex">
          <div className="absolute inset-0 -z-10 ml-px rounded-t-3xl bg-gradient-to-b from-fd-card via-fd-card md:rounded-tl-none" />
          <p className="pointer-events-auto min-w-0 text-[10px] font-bold uppercase tracking-wider text-fd-muted-foreground">
            <span className="block truncate">Digite seu próprio texto</span>
          </p>
        </div>

        <div className="relative flex min-h-[10rem] flex-auto flex-col">
          <div
            ref={scrollRef}
            className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-5 text-base leading-normal text-fd-foreground select-none md:pt-3"
            aria-hidden="true"
          >
            {renderHighlightedText()}
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            onScroll={handleScroll}
            className="relative z-10 h-full w-full resize-none bg-transparent px-5 text-base leading-normal text-transparent caret-fd-foreground outline-none selection:bg-fd-accent md:pt-3"
            placeholder="Digite algo..."
            spellCheck="false"
            maxLength={1000}
          />
        </div>

        <div className="sticky bottom-0 mx-[0.5px] h-6 flex-none bg-gradient-to-t from-fd-card" />
      </div>

      <div className="relative z-10 flex items-center gap-2 px-3 pb-5 md:pb-3">
        <div className="relative z-50 flex-none">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="group flex h-9 w-full items-center gap-2 rounded-xl pl-3 pr-2 text-sm font-medium text-fd-foreground outline-none transition-colors hover:bg-fd-muted"
            type="button"
          >
            <div className="relative flex min-w-0 items-baseline gap-2">
              <img
                alt={selectedLanguage.code}
                src={selectedLanguage.flagUrl}
                className="size-4 flex-none self-center rounded-full bg-fd-muted object-cover"
              />
              <div className="max-sm:hidden truncate text-xs font-medium">
                {selectedLanguage.name}
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                'size-4 flex-none text-fd-muted-foreground transition group-hover:text-fd-foreground',
                isLangOpen && 'rotate-180',
              )}
              aria-hidden="true"
            >
              <path
                d="M8 10L11.2929 13.2929C11.6834 13.6834 12.3166 13.6834 12.7071 13.2929L16 10"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isLangOpen ? (
            <div className="absolute left-0 top-full z-[60] mt-2 w-48 animate-in rounded-2xl bg-fd-popover p-2 text-fd-popover-foreground ring-1 ring-fd-border fade-in slide-in-from-top-2">
              <div className="max-h-60 overflow-y-auto no-scrollbar">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang);
                      setIsLangOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                      selectedLanguage.code === lang.code
                        ? 'bg-fd-muted text-fd-foreground'
                        : 'text-fd-muted-foreground hover:bg-fd-muted',
                    )}
                  >
                    <img src={lang.flagUrl} alt="" className="size-4 rounded-full" />
                    {lang.name}
                    {selectedLanguage.code === lang.code ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="ml-auto size-4 text-fd-foreground"
                        aria-hidden="true"
                      >
                        <path
                          d="M6.75 13.0625L9.9 16.25L17.25 7.75"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-[10px] font-bold text-fd-muted-foreground sm:block">
            {text.length}/1000
          </div>
          <button
            onClick={handlePlayPause}
            disabled={isLoading || (!isPlaying && !text)}
            className={cn(
              'flex-none rounded-full px-5 text-sm font-semibold outline-none transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 h-9 flex items-center justify-center',
              isPlaying
                ? 'bg-fd-muted text-fd-foreground ring-1 ring-inset ring-fd-border hover:bg-fd-accent'
                : 'bg-fd-foreground text-fd-background hover:opacity-90',
              isLoading && 'relative bg-fd-foreground text-transparent',
            )}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-5 w-5 animate-spin text-fd-background"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : isPlaying ? (
              <span className="flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Pausar
              </span>
            ) : (
              'Reproduzir'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
