'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ViewMode = 'grid' | 'list';

export interface ContentToolbarProps {
  /** Valor atual do input de busca */
  search: string;
  /** Callback chamado ao alterar o input de busca */
  onSearchChange: (value: string) => void;
  /** Placeholder do input de busca */
  placeholder?: string;
  /** Modo de visualização atual */
  viewMode?: ViewMode;
  /** Callback chamado ao alternar o modo de visualização */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Exibe os botões de toggle de visualização */
  showViewToggle?: boolean;
  /** Ação primária (ex: botão "Novo Episódio") */
  action?: React.ReactNode;
  /** Conteúdo extra abaixo da barra (filtros, tags, etc.) */
  filters?: React.ReactNode;
  /** Classes adicionais para o container */
  className?: string;
}

// ─── ContentToolbar ───────────────────────────────────────────────────────────

export function ContentToolbar({
  search,
  onSearchChange,
  placeholder = 'Buscar...',
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  action,
  filters,
  className = '',
}: ContentToolbarProps) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* Linha principal: busca + toggles + ação */}
      <div className="relative flex w-full justify-between gap-1.5">
        {/* Input de busca */}
        <div className="relative flex-1">
          {/* Ícone de busca — esquerda */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="search"
            autoComplete="off"
            placeholder={placeholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex w-full h-10 pl-8 pr-3 py-1 text-sm rounded-[10px] border border-gray-200 dark:border-white/10 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-foreground/40 hover:border-gray-300 dark:hover:border-white/20 transition-colors max-sm:text-base"
          />
        </div>

        {/* Botões de toggle de visualização + ação */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showViewToggle && onViewModeChange && (
            <>
              <button
                type="button"
                aria-label="Visualização em grade"
                onClick={() => onViewModeChange('grid')}
                className={`relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors duration-75 focus-visible:outline-none ${
                  viewMode === 'grid'
                    ? 'bg-foreground/5 border-gray-300 dark:border-white/20'
                    : 'bg-transparent border-gray-200 dark:border-white/10 hover:bg-foreground/5 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-foreground shrink-0" />
              </button>

              <button
                type="button"
                aria-label="Visualização em lista"
                onClick={() => onViewModeChange('list')}
                className={`relative inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors duration-75 focus-visible:outline-none ${
                  viewMode === 'list'
                    ? 'bg-foreground/5 border-gray-300 dark:border-white/20'
                    : 'bg-transparent border-gray-200 dark:border-white/10 hover:bg-foreground/5 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <List className="w-4 h-4 text-foreground shrink-0" />
              </button>
            </>
          )}

          {/* Ação primária */}
          {action && action}
        </div>
      </div>

      {/* Linha de filtros (opcional) */}
      {filters && (
        <div className="flex flex-wrap gap-2 empty:hidden">
          {filters}
        </div>
      )}
    </div>
  );
}

// ─── FilterChip — chip reutilizável para filtros ──────────────────────────────

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  onClick?: () => void;
}

export function FilterChip({ label, onRemove, onClick }: FilterChipProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="cursor-pointer select-none flex items-center gap-1 h-6 rounded-lg px-2 border border-gray-200 dark:border-white/10 bg-background hover:bg-foreground/5 transition-colors text-xs font-medium text-foreground"
    >
      {onRemove && (
        <button
          type="button"
          aria-label={`Remover filtro ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
      <span>{label}</span>
    </div>
  );
}
