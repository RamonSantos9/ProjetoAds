'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { Check, ChevronDown, User, Users } from 'lucide-react';
import { Guest, Episode } from '@/lib/db';

interface GuestSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function GuestSelector({ selected, onChange }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch unique guests from all episodes
    async function fetchGuests() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const data: Episode[] = await res.json();
          const allGuests: Guest[] = [];
          data.forEach((ep) => {
            if (ep.guests && Array.isArray(ep.guests)) {
              ep.guests.forEach((g) => {
                // DB might have stored them as string or object
                const guestObj =
                  typeof g === 'object'
                    ? (g as Guest)
                    : ({
                        id: `legacy-${Math.random().toString(36).substr(2, 9)}`,
                        name: g as string,
                      } as Guest);
                if (guestObj && guestObj.name) {
                  allGuests.push(guestObj);
                }
              });
            }
          });
          // Remove duplicates based on name
          const uniqueGuests = Array.from(
            new Map(allGuests.map((item) => [item.name, item])).values(),
          );
          setGuests(uniqueGuests);
        }
      } catch (err) {
        console.error('Failed to fetch guests', err);
      }
    }
    fetchGuests();
  }, []);

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

  const toggleGuest = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 h-10 text-sm text-foreground flex items-center justify-between hover:border-fd-primary/50 transition-colors"
      >
        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-primary text-[12px] font-bold truncate">
              Convidados
            </span>
          ) : (
            selected.map((name) => (
              <span
                key={name}
                className="inline-flex items-center text-primary text-[12px] font-bold truncate"
              >
                {name},
              </span>
            ))
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-fd-background border border-border rounded-xl z-[1100] p-1.5 animate-in fade-in zoom-in-95 duration-200 min-h-[50px] max-h-[200px] overflow-y-auto">
          {guests.length === 0 ? (
            <div className="px-2 py-2 text-center text-sm text-foreground flex flex-col items-center gap-2">
              <p>Nenhum convidado encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {guests.map((opt) => {
                const isSelected = selected.includes(opt.name);
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => toggleGuest(opt.name)}
                    className={cn(
                      'flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all group',
                      isSelected
                        ? 'bg-fd-primary/10 text-fd-primary'
                        : 'hover:bg-fd-muted text-fd-foreground',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="overflow-hidden flex items-center justify-center rounded-md transition-colors"></div>
                      <div className="flex flex-col items-start gap-0.5">
                        <span>{opt.name}</span>
                        {opt.bio && (
                          <span className="text-[10px] text-foreground opacity-70 truncate max-w-[150px]">
                            {opt.bio}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="size-4" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
