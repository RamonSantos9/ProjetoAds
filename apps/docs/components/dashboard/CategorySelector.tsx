'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';
import {
  Check,
  ChevronDown,
  Building,
  Briefcase,
  GraduationCap,
  Users,
  Tag,
} from 'lucide-react';

export type CategoryOption = {
  id: string;
  label: string;
  icon: React.ElementType;
};

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'Institucional', label: 'Institucional', icon: Building },
  { id: 'Carreira', label: 'Carreira', icon: Briefcase },
  { id: 'Formação', label: 'Formação', icon: GraduationCap },
  { id: 'Entrevista', label: 'Entrevista', icon: Users },
  { id: 'Geral', label: 'Geral', icon: Tag },
];

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
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

  const toggleCategory = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground flex items-center justify-between hover:border-fd-primary/50 transition-colors"
      >
        <div className="flex flex-wrap gap-1 items-center overflow-hidden">
          {!value ? (
            <span className="text-primary text-[12px] font-bold truncate">
              Categoria
            </span>
          ) : (
            <span className="inline-flex items-center text-primary text-[12px] font-bold truncate">
              {value}
            </span>
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
            {CATEGORY_OPTIONS.map((opt) => {
              const isSelected = value === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleCategory(opt.id)}
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
