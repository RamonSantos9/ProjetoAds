'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

export interface UpdateWorkspaceNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onUpdate?: (name: string) => void | Promise<void>;
}

export function UpdateWorkspaceNameModal({ 
  isOpen, 
  onClose, 
  currentName,
  onUpdate
}: UpdateWorkspaceNameModalProps) {
  const [newName, setNewName] = React.useState(currentName);

  React.useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [currentName, isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        data-state="open"
        onClick={onClose}
      ></div>
      
      <div 
        role="dialog" 
        data-state="open" 
        className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0" 
        tabIndex={-1} 
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-6 tracking-tight text-foreground">Alterar Nome do Workspace</h2>
          <p className="text-sm text-black/50 dark:text-white/50">Insira um novo nome para o seu espaço de trabalho global.</p>
        </div>
        
        <div>
          <span className="block text-sm font-normal text-gray-700 dark:text-gray-300 mb-1">Novo nome do workspace</span>
          <input 
            className="block w-full rounded-md bg-transparent border border-gray-200 dark:border-white/10 sm:text-sm px-3 py-2 outline-none focus:border-black dark:focus:border-white transition-colors text-foreground" 
            placeholder="Exemplo: Portal Administrativo" 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button 
            onClick={onClose}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-background border border-gray-100 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px] inline-flex"
          >
            Cancelar
          </button>
          <button 
            disabled={!newName.trim() || newName.trim() === currentName}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-3 rounded-[10px] inline-flex disabled:opacity-50"
            onClick={async () => {
              if (onUpdate && newName.trim() !== currentName) {
                await onUpdate(newName);
              }
              onClose();
            }}
          >
            Atualizar
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-sm opacity-70 hover:opacity-100 outline-none text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </>,
    document.body
  );
}
