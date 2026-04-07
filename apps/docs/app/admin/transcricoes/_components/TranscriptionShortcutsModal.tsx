'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TranscriptionShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
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
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0 !rounded-2xl overflow-y-auto gap-3 pb-4 px-0"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left px-5">
          <h2 className="text-lg font-semibold leading-6 tracking-tight">Guia de Atalhos de Teclado</h2>
        </div>
        
        <div className="max-h-[70vh] px-5 flex flex-col w-full gap-6 overflow-auto relative no-scrollbar">
          {/* Editor Category */}
          <div className="flex flex-col gap-2 w-full">
            <h6 className="font-waldenburg-ht text-sm text-foreground font-semibold">Editor</h6>
            {[
              { label: "Alternar Título 1", keys: ["Ctrl", "⌥", "1"] },
              { label: "Alternar Título 2", keys: ["Ctrl", "⌥", "2"] },
              { label: "Alternar Título 3", keys: ["Ctrl", "⌥", "3"] },
              { label: "Alternar Parágrafo", keys: ["Ctrl", "⌥", "4"] },
              { label: "Bloquear Seção", keys: ["Ctrl", "'"] },
              { label: "Dicionários de Pronúncia", keys: ["Ctrl", "⇧", "P"] },
              { label: "Inserir Quebra de Fala", keys: ["Ctrl", ";"] },
              { label: "Adicionar Texto Acima", keys: ["Ctrl", "⇧", "↵"] },
              { label: "Adicionar Texto Abaixo", keys: ["⇧", "↵"] },
              { label: "Desfazer", keys: ["Ctrl", "z"] },
              { label: "Refazer", keys: ["Ctrl", "⇧", "z"] },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center w-full py-1 border-b">
                <p className="text-sm text-foreground font-normal">{item.label}</p>
                <span className="inline-flex items-center cursor-default text-xs gap-1.5">
                  {item.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-sans px-1.5 h-6 inline-flex justify-center items-center border border-b-4 rounded-md whitespace-nowrap border-gray-200 text-foreground">
                      {k === '⌥' ? <span>⌥</span> : k === '⇧' ? <span>⇧</span> : k === '↵' ? <span>↵</span> : k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation Category */}
          <div className="flex flex-col gap-2 w-full">
            <h6 className="font-waldenburg-ht text-sm text-foreground font-semibold">Navegação</h6>
            {[
              { label: "Capítulo Anterior", keys: ["Ctrl", "⇧", ","] },
              { label: "Próximo Capítulo", keys: ["Ctrl", "⇧", "."] },
              { label: "Configurações de Visualização", keys: ["Ctrl", "⌥", ","] },
              { label: "Ver Atalhos", keys: ["Ctrl", "⌥", "."] },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center w-full py-1 border-b">
                <p className="text-sm text-foreground font-normal">{item.label}</p>
                <span className="inline-flex items-center cursor-default text-xs gap-1.5">
                  {item.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-sans px-1.5 h-6 inline-flex justify-center items-center border border-b-4 rounded-md whitespace-nowrap border-gray-200 text-foreground">
                      {k === '⌥' ? <span>⌥</span> : k === '⇧' ? <span>⇧</span> : k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Player Category */}
          <div className="flex flex-col gap-2 w-full">
            <h6 className="font-waldenburg-ht text-sm text-foreground font-semibold">Player</h6>
            {[
              { label: "Play/Pause", keys: ["Ctrl", "↵"] },
              { label: "Play/Pause", keys: ["Espaço"] },
              { label: "Gerar/Regerar", keys: ["⌥", "↵"] },
              { label: "Aumentar Velocidade", keys: ["Ctrl", "."] },
              { label: "Diminuir Velocidade", keys: ["Ctrl", ","] },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center w-full py-1 border-b">
                <p className="text-sm text-foreground font-normal">{item.label}</p>
                <span className="inline-flex items-center cursor-default text-xs gap-1.5">
                  {item.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-sans px-1.5 h-6 inline-flex justify-center items-center border border-b-4 rounded-md whitespace-nowrap border-gray-200 text-foreground">
                       {k === '⌥' ? <span>⌥</span> : k === '↵' ? <span>↵</span> : k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline Category */}
          <div className="flex flex-col gap-2 w-full">
            <h6 className="font-waldenburg-ht text-sm text-foreground font-semibold">Linha do Tempo (Timeline)</h6>
            {[
              { label: "Multiseleção de Clipe", keys: ["Ctrl", "Clique"] },
              { label: "Selecionar Próximos Clipes", keys: ["Ctrl", "⌥", "Clique"] },
              { label: "Selecionar Clipes Anteriores", keys: ["Ctrl", "⌥", "⇧", "Click"] },
              { label: "Dividir Clipe no Tempo Atual", keys: ["S"] },
              { label: "Copiar Clipes Selecionados", keys: ["Ctrl", "C"] },
              { label: "Colar Clipes Selecionados", keys: ["Ctrl", "V"] },
              { label: "Duplicar Clipes Selecionados", keys: ["Ctrl", "D"] },
              { label: "Excluir Clipes Selecionados", keys: ["Backspace"] },
              { label: "Avançar um Frame", keys: ["→"] },
              { label: "Retroceder um Frame", keys: ["←"] },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center w-full py-1 border-b">
                <p className="text-sm text-foreground font-normal">{item.label}</p>
                <span className="inline-flex items-center cursor-default text-xs gap-1.5">
                  {item.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="font-sans px-1.5 h-6 inline-flex justify-center items-center border border-b-4 rounded-md whitespace-nowrap border-gray-200 text-foreground">
                      {k === '⌥' ? <span>⌥</span> : k === '⇧' ? <span>⇧</span> : k}
                    </kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div className="sticky bottom-[-1px] h-0 z-10 pointer-events-none">
            <div className="relative -translate-y-full bg-background" style={{ maskImage: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)', opacity: 1, height: '3rem' }}></div>
          </div>
        </div>

        <button 
          onClick={onClose}
          type="button" 
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  );
}
