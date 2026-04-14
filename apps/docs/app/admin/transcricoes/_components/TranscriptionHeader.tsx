'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { ProjectPopover } from '../../estudio/_components/ProjectPopover';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';

interface TranscriptionHeaderProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isSaving?: boolean;
  projectTitle: string;
  onTitleChange?: (title: string) => void;
  onSave?: (newTitle?: string) => void;
  onOpenShortcuts?: () => void;
  onOpenShare?: () => void;
  status: string;
  scheduledAt?: string | null;
  onStatusChange?: (newStatus: string, scheduledAt?: string | null) => void;
  isLocked?: boolean;
}

export function TranscriptionHeader({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isSaving,
  projectTitle,
  onTitleChange,
  onSave,
  onOpenShortcuts,
  onOpenShare,
  status: currentStatus,
  scheduledAt,
  onStatusChange,
  isLocked,
}: TranscriptionHeaderProps) {
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [titleInput, setTitleInput] = useState(projectTitle);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);

  React.useEffect(() => {
    setTitleInput(projectTitle);
  }, [projectTitle]);

  const toggleProjectPopover = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
    setIsProjectPopoverOpen(!isProjectPopoverOpen);
  };

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center w-full overflow-hidden relative px-2 min-w-0 border-b border-[#E2E7F1] dark:border-[#2A2A38] bg-[#FFFFFF] dark:bg-fd-background shrink-0" style={{ minHeight: '48px' }}>
      {/* Left Section */}
      <div className="flex flex-row items-center gap-2 shrink min-w-0 overflow-hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-label="Project options"
          onClick={toggleProjectPopover}
          className={cn(
            "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent hover:bg-gray-alpha-100 rounded-lg text-xm text-gray-500 hover:text-foreground w-8 h-8 px-0",
            isProjectPopoverOpen && "text-foreground bg-gray-alpha-200"
          )}
        >
          <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
            <path d="M3 10H10.9459M3 5H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        
        <div className="h-3 bg-gray-300 w-px rounded-full shrink-0"></div>
        
        <div className="flex items-center shrink-0 gap-0">
          <button 
            aria-label="Undo history" 
            type="button" 
            onClick={onUndo}
            disabled={!canUndo}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:opacity-40 rounded-[10px] center p-0 h-9 w-9"
          >
            <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-[18px] h-[18px]">
              <path d="M5.82368 4L3.58463 6.44021L2.75 7.32075M2.75 7.32075L5.82368 10.6415M2.75 7.32075H13.7269C15.6726 7.32075 17.25 9.03983 17.25 11.1604C17.25 13.2809 15.6726 15 13.7269 15H10.0133" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          <button 
            aria-label="Redo history" 
            type="button" 
            onClick={onRedo}
            disabled={!canRedo}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-gray-alpha-100 disabled:opacity-40 rounded-[10px] center p-0 h-9 w-9"
          >
            <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-[18px] h-[18px]">
              <path d="M14.1763 4L16.4154 6.44021L17.25 7.32075M17.25 7.32075L14.1763 10.6415M17.25 7.32075H6.27313C4.32739 7.32075 2.75003 9.03983 2.75003 11.1604C2.75003 13.2809 4.32739 15 6.27313 15H9.98667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>

        <button 
          onClick={onOpenShortcuts}
          className="relative inline-flex items-center justify-center whitespace-nowrap text-xs font-medium transition-colors duration-75 focus-ring bg-transparent text-gray-500 hover:text-foreground hover:bg-gray-alpha-100 rounded-lg h-8 px-2 gap-1.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-keyboard">
            <rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>
          </svg>
          Atalhos
        </button>
      </div>

      {/* Center Section: Project Title */}
      <div className="flex items-center justify-center min-w-0">
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative block w-fit text-xm font-medium min-w-0 max-w-[32ch]">
            <div className="relative group/btn block w-full select-text cursor-text focus-within:outline-none" aria-label="Edit field">
              <div className="absolute -inset-y-1 -inset-x-2 h-auto w-auto rounded-lg transition-colors duration-200 bg-transparent group-focus-within/btn:bg-gray-alpha-100 group-hover/btn:bg-gray-alpha-100 group-focus-within/btn:ring-[1.5px] ring-foreground truncate pointer-events-none"></div>
              
              <div className="grid items-center w-full relative">
                <span className="invisible col-start-1 row-start-1 whitespace-pre truncate px-0">{titleInput || 'Projeto Sem Título'}</span>
                <input 
                  className="col-start-1 row-start-1 bg-transparent outline-none w-full relative z-10 text-xm font-medium truncate disabled:cursor-default"
                  value={titleInput}
                  disabled={isLocked}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={() => {
                    const finalTitle = titleInput.trim() || 'Projeto Sem Título';
                    setTitleInput(finalTitle);
                    if (onTitleChange) onTitleChange(finalTitle);
                    if (onSave) onSave(finalTitle);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                />
              </div>

            </div>
          </div>
          {isSaving && <span className="text-[10px] text-subtle animate-pulse">Salvando...</span>}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5 shrink-0 overflow-hidden justify-end">
        {/* Credits */}
        <div className="hidden lg:flex gap-1.5 items-center cursor-default overflow-hidden" title="8,226 créditos restantes">
          <div className="flex relative size-5">
            <div className="absolute [transform:rotate(18deg)] w-full h-full" role="progressbar">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" strokeWidth="10px" className="stroke-gray-alpha-100 fill-transparent"></circle>
                <circle cx="50" cy="50" r="42" strokeWidth="10px" strokeLinecap="round" strokeDashoffset="66" strokeDasharray="34.32 229.68" className="stroke-primary fill-transparent"></circle>
              </svg>
            </div>
            <div className="!absolute left-0 top-0 [transform:rotateY(180deg)] w-full h-full" role="progressbar">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" strokeWidth="10px" className="stroke-gray-alpha-100/30 fill-transparent"></circle>
                <circle cx="50" cy="50" r="42" strokeWidth="10px" strokeLinecap="round" strokeDashoffset="66" strokeDasharray="203.28 60.72" className="stroke-primary/50 fill-transparent"></circle>
              </svg>
            </div>
          </div>
          
        </div>

        <button 
          aria-label="Open comments" 
          className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent text-foreground hover:bg-zinc-100 rounded-lg text-xm center p-0 h-8 w-8" 
          title="Comments"
        >
          <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-4 h-4">
            <path d="M13.1515 7.03045H6.84848M13.1515 10.8632H6.84848M7.37621 16.1175L9.37872 17.7762C9.73741 18.0733 10.2598 18.0747 10.6203 17.7796L12.655 16.1139C12.8289 15.9715 13.0478 15.8936 13.2736 15.8936H15.0909C16.6976 15.8936 18 14.6067 18 13.0191V4.87455C18 3.28698 16.6976 2 15.0909 2H4.90909C3.30245 2 2 3.28698 2 4.87455V13.0191C2 14.6067 3.30245 15.8936 4.90909 15.8936H6.75328C6.98109 15.8936 7.20163 15.9729 7.37621 16.1175Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        
        <button 
          onClick={() => {
            console.log('[Header] Opening share modal');
            onOpenShare && onOpenShare();
          }}
          className="hidden sm:inline-flex relative items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent text-foreground hover:bg-zinc-100 h-8 px-2.5 rounded-lg text-xm"
        >
          Compartilhar
        </button>
        
        <div className="flex items-center gap-2 relative">
          {/* Status Picker */}
          <div className="relative">
            <button 
              type="button" 
              disabled={isLocked}
              onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
              className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 text-foreground h-8 px-2.5 rounded-lg text-xm disabled:opacity-70 disabled:cursor-default"
            >
              <span className="flex items-center gap-1.5 text-[12px]">
                <span className={cn(
                  "block h-2 w-2 shrink-0 rounded-full",
                  currentStatus === 'Publicado' ? "bg-green-500" : 
                  currentStatus === 'Agendado' ? "bg-purple-600" : "bg-blue-500 animate-pulse"
                )}></span>
                {currentStatus}
                {currentStatus === 'Agendado' && scheduledAt && (
                   <span className="opacity-50 font-normal">({new Date(scheduledAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' })})</span>
                )}
              </span>
            </button>

            {/* Status Dropdown Popover */}
            {isStatusPopoverOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#121212] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => {
                    onStatusChange?.('Produção');
                    setIsStatusPopoverOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Produção
                </button>
                <button 
                  onClick={() => {
                    onStatusChange?.('Publicado');
                    setIsStatusPopoverOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Publicado
                </button>
                <div className="h-px bg-[#E2E7F1] dark:bg-[#2A2A38] my-1" />
                <div className="px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Agendar Publicação</p>
                  <input 
                    type="date" 
                    className="w-full bg-transparent border border-[#E2E7F1] dark:border-[#2A2A38] rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-fd-primary"
                    value={scheduledAt ? new Date(scheduledAt).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      if (date) {
                         onStatusChange?.('Agendado', new Date(date).toISOString());
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          { !isLocked && (
            <button 
              type="button" 
              onClick={() => onSave && onSave(titleInput)}
              disabled={isSaving}
              className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-black text-white dark:bg-white dark:text-black shadow-none hover:bg-gray-800 h-8 px-2.5 rounded-lg text-xm disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          )}
        </div>
        
        <div className="h-4 w-px bg-[#E2E7F1] dark:bg-[#2A2A38] mx-1"></div>
        
        <ThemeToggle mode="light-dark" />
      </div>

      <ProjectPopover
        isOpen={isProjectPopoverOpen}
        onClose={() => setIsProjectPopoverOpen(false)}
        onOpenShortcuts={onOpenShortcuts || (() => {})}
        triggerRect={triggerRect}
      />
    </header>
  );
}
