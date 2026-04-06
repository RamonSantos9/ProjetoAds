'use client';

import React, { useState } from 'react';
import { Ban, Settings2, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CaptionTemplate {
  id: string;
  name: string;
  previewText: string;
  style: React.CSSProperties;
  textStyle?: React.CSSProperties;
  highlights?: { text: string; color: string }[];
}

const TEMPLATES: CaptionTemplate[] = [
  {
    id: 'lazy',
    name: 'One word after another',
    previewText: 'lazy',
    style: { backgroundColor: '#000' },
    textStyle: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 900,
      textTransform: 'uppercase',
      fontSize: '18px',
      color: '#fff',
      textShadow: '1.6px 1.6px 0px #000',
      WebkitTextStroke: '3.8px #000',
      paintOrder: 'stroke',
    },
  },
  {
    id: 'hype',
    name: 'Hype',
    previewText: 'jumps over the lazy',
    style: { backgroundColor: '#000' },
    highlights: [{ text: 'over', color: '#f71c53' }],
    textStyle: {
      fontFamily: 'Oswald, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '16px',
      color: '#fff',
      textShadow: '1.7px 1.7px 1.7px #000',
      WebkitTextStroke: '1.4px #000',
    },
  },
  {
    id: 'negative',
    name: 'Negative',
    previewText: 'jumps',
    style: { backgroundColor: '#000' },
    textStyle: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 900,
      textTransform: 'uppercase',
      mixBlendMode: 'difference',
      fontSize: '40px',
      color: '#fff',
    },
  },
  {
    id: 'punchy',
    name: 'Punchy',
    previewText: 'jumps over the lazy',
    style: { backgroundColor: '#000' },
    textStyle: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 900,
      textTransform: 'uppercase',
      fontSize: '16px',
      color: '#feca01',
      textShadow: '2px 1.6px 0px #c90303',
      WebkitTextStroke: '1px #c90303',
    },
  },
  {
    id: 'yellow-highlight',
    name: 'Yellow highlight',
    previewText: 'The quick brown fox jumps over the lazy dog.',
    style: { backgroundColor: '#000' },
    highlights: [{ text: 'jumps', color: '#fff900' }],
    textStyle: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 900,
      fontSize: '14px',
      color: '#fff',
      textShadow: '1.6px 1.6px 0px #000',
      WebkitTextStroke: '1.8px #000',
    },
  },
  {
    id: 'peach',
    name: 'Peach',
    previewText: 'jumps over',
    style: { backgroundColor: '#000' },
    textStyle: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '24px',
      color: '#ffb07c',
      textShadow: '2.5px 2.5px 0px #000',
      WebkitTextStroke: '1.1px #000',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    previewText: 'The quick brown fox jumps over the lazy dog.',
    style: { backgroundColor: '#000' },
    textStyle: {
      fontFamily: 'Source Sans 3, sans-serif',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '14px',
      color: '#fff',
      textShadow: '1.6px 1.6px 0px #000',
      WebkitTextStroke: '3.8px #000',
    },
  },
];

export function CaptionsPanel() {
  const [selectedId, setSelectedId] = useState<string | null>('none');

  return (
    <div className="flex flex-col h-full w-full px-3.5">
      {/* Header */}
      <div
        data-sidebar-header="true"
        className="flex items-center justify-between px-3.5 h-11 shrink-0 -mx-3.5 sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-fd-border"
      >
        <div className="flex items-center gap-1 w-full min-w-0">
          <div className="flex gap-1 items-center">
            <button className="relative items-center justify-center whitespace-nowrap bg-transparent text-foreground shadow-none !p-0 !h-auto rounded-lg text-[13px] font-medium transition-colors flex gap-1 cursor-default">
              Captions
              <span className="text-fd-muted-foreground ml-1 font-normal opacity-60">
                Classic (legacy)
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-full relative overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-3 py-3.5 pb-10">
          {/* None option */}
          <div
            onClick={() => setSelectedId('none')}
            aria-selected={selectedId === 'none'}
            className={cn(
              'rounded-[10px] cursor-pointer overflow-hidden border transition-all duration-75 p-2 flex items-center gap-3',
              selectedId === 'none'
                ? 'border-foreground bg-fd-accent/20'
                : 'border-fd-border bg-background hover:border-fd-muted-foreground/50',
            )}
          >
            <div className="h-8 w-8 flex justify-center items-center bg-fd-accent/50 rounded-md">
              <Ban className="h-4 w-4 text-fd-muted-foreground" />
            </div>
            <p className="text-xs text-foreground font-medium">None</p>
            {selectedId === 'none' && (
              <Check className="ml-auto w-4 h-4 text-foreground" />
            )}
          </div>

          {/* Templates */}
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedId(template.id)}
              className={cn(
                'rounded-[10px] cursor-pointer overflow-hidden border transition-all duration-75 flex flex-col group',
                selectedId === template.id
                  ? 'border-foreground bg-fd-accent/10'
                  : 'border-fd-border bg-background hover:border-fd-muted-foreground/50',
              )}
            >
              {/* Preview Area */}
              <div className="pt-1 px-1 h-28 w-full overflow-hidden flex">
                <div className="relative overflow-hidden h-full w-full rounded-lg flex items-center justify-center text-center p-4 bg-black">
                  <p style={template.textStyle}>
                    {template.highlights
                      ? template.previewText.split(' ').map((word, i) => {
                          const highlight = template.highlights?.find(
                            (h) => h.text.toLowerCase() === word.toLowerCase(),
                          );
                          return (
                            <span
                              key={i}
                              style={
                                highlight
                                  ? {
                                      backgroundColor: highlight.color,
                                      color:
                                        template.id === 'hype'
                                          ? '#fff'
                                          : undefined,
                                      padding: '0.1em 0.15em',
                                      borderRadius: '0.25em',
                                    }
                                  : { padding: '0.1em 0.15em' }
                              }
                            >
                              {word}{' '}
                            </span>
                          );
                        })
                      : template.previewText}
                  </p>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="flex justify-between items-center py-2 px-3">
                <p className="text-foreground font-medium truncate text-[11px]">
                  {template.name}
                </p>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="h-7 w-7 rounded-lg hover:bg-fd-accent flex items-center justify-center transition-colors">
                    <Settings2 className="w-3.5 h-3.5 text-fd-muted-foreground" />
                  </button>
                  <button className="h-7 w-7 rounded-lg hover:bg-fd-accent flex items-center justify-center transition-colors">
                    <RotateCcw className="w-3.5 h-3.5 text-fd-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
