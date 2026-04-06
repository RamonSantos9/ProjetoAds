'use client';

import React, { useState } from 'react';
import { X, User, Mail, Globe, Info, Save } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ActionButtonRefined } from '@/components/ui/RefinedComponents';
import { Guest } from '@/lib/db';

interface CreateGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Guest) => void;
  initialData?: Guest | null;
}

export function CreateGuestModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreateGuestModalProps) {
  const [formData, setFormData] = useState<Partial<Guest>>(
    initialData || {
      name: '',
      bio: '',
      social: '',
      avatar: '',
      email: '',
    },
  );

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const guestData: Guest = {
      id: initialData?.id || `guest-${Date.now()}`,
      name: formData.name || '',
      bio: formData.bio || '',
      social: formData.social || '',
      avatar: formData.avatar || '',
      email: formData.email || '',
    };

    try {
      const method = initialData ? 'PUT' : 'POST';
      const body = initialData
        ? JSON.stringify({ id: initialData.id, updates: guestData })
        : JSON.stringify(guestData);

      const res = await fetch('/api/guests', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (res.ok) {
        onSave(guestData);
        onClose();
      }
    } catch (error) {
      console.error('Error saving guest:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-2xl shadow-2xl border border-fd-border overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-fd-border bg-fd-accent/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-fd-primary/10 text-fd-primary">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-fd-foreground">
                {initialData ? 'Editar Convidado' : 'Novo Convidado'}
              </h2>
              <p className="text-xs text-fd-muted-foreground">
                Cadastre perfis para vincular aos episódios.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-fd-accent rounded-full transition-colors text-fd-muted-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-fd-foreground flex items-center gap-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="w-full bg-fd-accent/5 dark:bg-white/5 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary/20 transition-all"
                placeholder="Ex: Prof. Ricardo Santos"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-fd-foreground flex items-center gap-2">
                Email de Contato
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
                <input
                  type="email"
                  className="w-full bg-fd-accent/5 dark:bg-white/5 border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary/20 transition-all"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-fd-foreground flex items-center gap-2">
                URL da Bio / Redes Sociais
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
                <input
                  className="w-full bg-fd-accent/5 dark:bg-white/5 border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary/20 transition-all"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.social}
                  onChange={(e) =>
                    setFormData({ ...formData, social: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-fd-foreground">
                Breve Biografia
              </label>
              <textarea
                className="w-full bg-fd-accent/5 dark:bg-white/5 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-fd-primary/20 transition-all min-h-[100px] resize-none"
                placeholder="Destaque as principais áreas de atuação e conquistas..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border rounded-xl font-semibold text-sm hover:bg-fd-accent transition-all"
            >
              Cancelar
            </button>
            <ActionButtonRefined
              type="submit"
              label={loading ? 'Salvando...' : 'Salvar Convidado'}
              className="flex-1 h-11 rounded-xl"
              icon={<Save className="size-4" />}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
