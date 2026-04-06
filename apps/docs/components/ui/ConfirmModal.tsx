'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { ActionButton } from './ActionButton';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4  backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="flex flex-col bg-fd-background border border-border rounded-lg w-full max-w-[400px] animate-in zoom-in-95 duration-200 overflow-hidden">
        <header className="flex items-center justify-between px-4 mt-4">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-foreground">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-fd-muted transition-colors text-fd-muted-foreground hover:text-fd-foreground"
          >
            <X className="size-5" />
          </button>
        </header>

        <main className="px-4 py-4">
          <p className="text-sm text-foreground leading-relaxed">
            {description}
          </p>
        </main>

        <footer className="px-4 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            {cancelText}
          </button>
          <ActionButton
            type="button"
            label={confirmText}
            onClick={onConfirm}
            variant="primary"
            showIcon={false}
            className={
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-white border-0'
                : ''
            }
          />
        </footer>
      </div>
    </div>,
    document.body,
  );
}
