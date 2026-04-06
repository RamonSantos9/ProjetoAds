'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Check, ChevronDown } from 'lucide-react';

// ─── Custom Brand Icons ────────────────────────────────────────────────────────

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.354-.675.467-1.03.249-2.862-1.748-6.464-2.144-10.707-1.176-.406.092-.814-.165-.906-.57-.091-.406.165-.814.571-.906 4.646-1.063 8.623-.61 11.82 1.341.355.218.468.675.252 1.062zm1.464-3.262c-.271.442-.846.582-1.288.31-3.275-2.013-8.267-2.6-12.138-1.424-.495.15-1.022-.128-1.172-.622-.15-.495.129-1.022.622-1.172 4.428-1.344 10.02-.667 13.666 1.573.44.272.581.847.31 1.29zm.128-3.403C15.42 8.441 9.387 8.243 5.864 9.31c-.569.174-1.179-.153-1.353-.722-.174-.57.153-1.179.722-1.353 4.04-1.226 10.706-1.002 15.273 1.708.513.303.681.968.377 1.482-.303.513-.969.681-1.481.377z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const PLATFORMS_OPTIONS = [
  { id: 'Spotify', icon: SpotifyIcon },
  { id: 'YouTube', icon: YoutubeIcon },
];

interface PlatformSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function PlatformSelector({
  selected,
  onChange,
}: PlatformSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlatform = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground flex items-center justify-between hover:border-fd-primary/50 transition-colors"
      >
        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-primary text-[12px] font-bold truncate">
              Selecione as plataformas
            </span>
          ) : (
            selected.map((p) => {
              const opt = PLATFORMS_OPTIONS.find((o) => o.id === p);
              const Icon = opt?.icon || SpotifyIcon;
              return (
                <span
                  key={p}
                  className="inline-flex items-center text-primary text-[12px] font-bold truncate"
                >
                  {p},
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={cn(
            'size-4 text-fd-muted-foreground transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-fd-background border border-border rounded-lg z-[1100] p-1 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 gap-0.5">
            {PLATFORMS_OPTIONS.map((opt) => {
              const isSelected = selected.includes(opt.id);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => togglePlatform(opt.id)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                    isSelected
                      ? 'bg-fd-primary/10 text-fd-primary'
                      : 'hover:bg-fd-muted text-fd-foreground',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {opt.id}
                  </div>
                  {isSelected && <Check className="size-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
