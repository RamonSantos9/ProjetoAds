'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, Download, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ActionButtonRefined } from '@/components/ui/RefinedComponents';

interface DashboardToolbarProps {
  // Search
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Filter (Origin)
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: string[];

  // Export
  onExport?: (format: 'JSON' | 'CSV') => void;

  // Action Button
  actionLabel?: string;
  onActionClick?: () => void;
  showAction?: boolean;
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = 'Pesquisar...',
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full md:max-w-[340px] max-w-full">
      <input
        className="w-full dark:bg-[#121212] border rounded-lg pl-3 pr-9 py-2 text-xs text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:border-fd-primary transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#83899f]" />
    </div>
  );
}

export function ToolbarFilter({
  value,
  onChange,
  options = [],
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
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

  return (
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 flex items-center justify-between gap-2 py-2 px-3 border rounded-lg text-xs text-fd-foreground hover:bg-fd-accent/50 transition-all w-full sm:min-w-[200px]"
      >
        <span className="truncate">{value}</span>
        <ChevronRight
          className={cn(
            'size-4 text-fd-muted-foreground transition-transform',
            isOpen ? 'rotate-270' : 'rotate-90',
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-fd-accent border-b last:border-0 border-fd-border/50 text-fd-foreground"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ToolbarExport({
  onExport,
}: {
  onExport?: (f: 'JSON' | 'CSV') => void;
}) {
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

  return (
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 flex items-center justify-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg px-4 text-xs text-fd-foreground hover:bg-fd-accent/50 transition-colors w-full"
      >
        <Download className="size-4" /> Exportar
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] right-0 w-full sm:w-40 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg z-50 overflow-hidden shadow-xl animate-in fade-in zoom-in-95">
          <button
            onClick={() => {
              onExport?.('JSON');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-fd-accent border-b border-fd-border text-fd-foreground"
          >
            JSON
          </button>
          <button
            onClick={() => {
              onExport?.('CSV');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-fd-accent text-fd-foreground"
          >
            CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  filterValue,
  onFilterChange,
  filterOptions = ['Todas Origens', 'Manual', 'Agendado', 'Importado'],
  onExport,
  actionLabel,
  onActionClick,
  showAction = false,
}: DashboardToolbarProps) {
  return (
    <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {onSearchChange && (
        <ToolbarSearch
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto justify-end gap-2">
        {onFilterChange && filterValue && (
          <ToolbarFilter
            value={filterValue}
            onChange={onFilterChange}
            options={filterOptions}
          />
        )}

        <ToolbarExport onExport={onExport} />

        {showAction && actionLabel && onActionClick && (
          <ActionButtonRefined
            label={actionLabel}
            onClick={onActionClick}
            icon={<Plus className="size-5" />}
          />
        )}
      </div>
    </section>
  );
}
