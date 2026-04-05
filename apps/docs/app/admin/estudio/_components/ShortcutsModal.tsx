'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'Editor',
    items: [
      { label: 'Desfazer', keys: ['Ctrl', 'z'] },
      { label: 'Refazer', keys: ['Ctrl', '<span>⇧</span>', 'z'] },
    ]
  },
  {
    category: 'Navegação',
    items: [
      { label: 'Ver atalhos', keys: ['Ctrl', '<span>⌥</span>', '.'] },
    ]
  },
  {
    category: 'Player',
    items: [
      { label: 'Play/Pause', keys: ['Ctrl', '<span>↵</span>'] },
      { label: 'Play/Pause', keys: ['Espaço'] },
      { label: 'Aumentar velocidade', keys: ['Ctrl', '.'] },
      { label: 'Diminuir velocidade', keys: ['Ctrl', ','] },
    ]
  },
  {
    category: 'Timeline',
    items: [
      { label: 'Multiseleção de clipe', keys: ['Ctrl', 'Clique'] },
      { label: 'Selecionar próximos clipes', keys: ['Ctrl', '<span>⌥</span>', 'Clique'] },
      { label: 'Selecionar clipes anteriores', keys: ['Ctrl', '<span>⌥</span>', '<span>⇧</span>', 'Clique'] },
      { label: 'Dividir clipe no cursor', keys: ['S'] },
      { label: 'Copiar clipes selecionados', keys: ['Ctrl', 'C'] },
      { label: 'Colar clipes selecionados', keys: ['Ctrl', 'V'] },
      { label: 'Duplicar clipes selecionados', keys: ['Ctrl', 'D'] },
      { label: 'Excluir clipes selecionados', keys: ['Backspace'] },
      { label: 'Avançar um frame', keys: ['→'] },
      { label: 'Retroceder um frame', keys: ['←'] },
    ]
  }
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] animate-in fade-in-0 duration-300">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Dialog */}
      <div 
        role="dialog" 
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "bg-white dark:bg-black p-5 shadow-natural-md duration-200 sm:rounded-3xl !rounded-2xl overflow-y-auto",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]",
          "max-h-[90vh] gap-3 pb-4 px-0 focus-visible:outline-0 border"
        )}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left px-5">
          <h2 className="text-lg font-semibold leading-6 tracking-tight">Guia de Atalhos de Teclado</h2>
        </div>

        <div className="max-h-96 px-5 flex flex-col w-full gap-6 overflow-auto relative no-scrollbar">
          {SHORTCUTS.map((section) => (
            <div key={section.category} className="flex flex-col gap-2 w-full">
              <h6 className="font-waldenburg-ht text-sm text-foreground font-semibold uppercase tracking-wider opacity-60">
                {section.category}
              </h6>
              {section.items.map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="flex justify-between items-center w-full py-1 border-b">
                  <p className="text-sm text-foreground font-normal">{item.label}</p>
                  <span className="inline-flex items-center cursor-default text-xs gap-1.5">
                    {item.keys.map((key, keyIdx) => (
                      <kbd 
                        key={keyIdx}
                        className="font-sans px-1.5 h-6 min-w-[24px] inline-flex justify-center items-center border border-gray-200 dark:border-white/10 border-b-4 bg-fd-accent rounded-md whitespace-nowrap text-foreground text-[11px] shadow-sm"
                        dangerouslySetInnerHTML={{ __html: key }}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          ))}
          
          {/* Scroll fade gradient per snippet */}
          <div className="sticky bottom-[-1px] h-0 z-10 pointer-events-none">
            <div 
              className="relative -translate-y-full bg-background" 
              style={{ 
                maskImage: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)', 
                opacity: 1, 
                height: '3rem' 
              }} 
            />
          </div>
        </div>

        <button 
          onClick={onClose}
          type="button" 
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
