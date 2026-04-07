'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';

interface ProjectPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts: () => void;
  triggerRect: DOMRect | null;
}

export function ProjectPopover({
  isOpen,
  onClose,
  onOpenShortcuts,
  triggerRect,
}: ProjectPopoverProps) {
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRect) {
      const top = triggerRect.bottom + 4; // Ajustado para translate(8px, 44px) aproximado
      const left = triggerRect.left;
      setPosition({ top, left });
    }
  }, [isOpen, triggerRect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        'fixed z-50 min-w-[7rem] p-0.5 bg-white dark:bg-[#1A1A24] text-foreground shadow-sm rounded-lg border border-[#E2E7F1] dark:border-[#2A2A38] animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-100',
      )}
      style={{
        top: position.top,
        left: position.left,
        outline: 'none',
        pointerEvents: 'auto',
        boxShadow:
          '0 0px 0px 1px rgba(0, 0, 0, 0.06), 0 1px 1px -0.5px rgba(0, 0, 0, 0.06), 0 3px 3px 0 rgba(0, 0, 0, 0.06), 0 6px 6px 0 rgba(0, 0, 0, 0.06), 0 12px 12px 0 rgba(0, 0, 0, 0.04), 0 24px 24px 0px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="flex flex-col w-full">
        <div
          role="menuitem"
          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-[#f6f8fa] dark:hover:bg-white/5 focus:bg-[#f6f8fa] dark:focus:bg-white/5 data-[state=open]:bg-[#f6f8fa] dark:data-[state=open]:bg-white/5 px-2 py-1.5 text-sm rounded-md"
          onClick={() => {
            onClose();
            router.push('/admin/transcricoes');
          }}
        >
          Voltar para projetos
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px bg-[#E2E7F1] dark:bg-[#2A2A38] -mx-0.5 my-1"
        ></div>

        <div
          role="menuitem"
          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-[#f6f8fa] dark:hover:bg-white/5 focus:bg-[#f6f8fa] dark:focus:bg-white/5 data-[state=open]:bg-[#f6f8fa] dark:data-[state=open]:bg-white/5 px-2 py-1.5 text-sm rounded-md"
          onClick={onClose}
        >
          Histórico de versões
        </div>

        <div
          role="menuitem"
          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-[#f6f8fa] dark:hover:bg-white/5 focus:bg-[#f6f8fa] dark:focus:bg-white/5 data-[state=open]:bg-[#f6f8fa] dark:data-[state=open]:bg-white/5 px-2 py-1.5 text-sm rounded-md"
          onClick={() => {
            onClose();
            onOpenShortcuts();
          }}
        >
          Atalhos de teclado
        </div>

        <div
          role="menuitem"
          className="flex cursor-pointer select-none items-center outline-none focus:bg-gray-alpha-100 data-[state=open]:bg-gray-alpha-100 px-2 py-1 text-sm rounded-md"
          onClick={onClose}
        >
          Tema
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right ml-auto shrink-0 text-gray-alpha-500 w-3.5 h-3.5 -mr-0.5"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px bg-black/10 dark:bg-white/10 -mx-0.5 my-0.5"
        ></div>

        <div
          role="menuitem"
          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-[#f6f8fa] dark:hover:bg-white/5 focus:bg-[#f6f8fa] dark:focus:bg-white/5 data-[state=open]:bg-[#f6f8fa] dark:data-[state=open]:bg-white/5 px-2 py-1.5 text-sm rounded-md"
          onClick={onClose}
        >
          Documentação
        </div>

        <div
          role="menuitem"
          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-[#f6f8fa] dark:hover:bg-white/5 focus:bg-[#f6f8fa] dark:focus:bg-white/5 data-[state=open]:bg-[#f6f8fa] dark:data-[state=open]:bg-white/5 px-2 py-1.5 text-sm rounded-md"
          onClick={onClose}
        >
          Enviar feedback
        </div>
      </div>
    </div>
  );
}
