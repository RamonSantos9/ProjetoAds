'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Globe, Save } from 'lucide-react';
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
  const [guestName, setGuestName] = useState(initialData?.name || '');
  const [guestBio, setGuestBio] = useState(initialData?.bio || '');
  const [guestSocial, setGuestSocial] = useState(initialData?.social?.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '') || '');
  const [guestCompany, setGuestCompany] = useState(initialData?.company || '');
  const [guestPhone, setGuestPhone] = useState(initialData?.phone || '');
  const [guestLinkedin, setGuestLinkedin] = useState(initialData?.linkedin?.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '') || '');
  const [guestWebsite, setGuestWebsite] = useState(initialData?.website || '');
  const [guestAvatar, setGuestAvatar] = useState(initialData?.avatar || '');

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync state when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setGuestName(initialData.name || '');
      setGuestBio(initialData.bio || '');
      setGuestSocial(initialData.social?.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '') || '');
      setGuestCompany(initialData.company || '');
      setGuestPhone(initialData.phone || '');
      setGuestLinkedin(initialData.linkedin?.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '') || '');
      setGuestWebsite(initialData.website || '');
      setGuestAvatar(initialData.avatar || '');
    } else {
      setGuestName('');
      setGuestBio('');
      setGuestSocial('');
      setGuestCompany('');
      setGuestPhone('');
      setGuestLinkedin('');
      setGuestWebsite('');
      setGuestAvatar('');
    }
  }, [initialData, isOpen]);

  // GitHub / Fallback Avatar Sync Logic
  useEffect(() => {
    if (guestSocial && guestSocial.trim() !== '') {
      const username = guestSocial.split('/')[0]?.split('?')[0];
      if (username) {
        setGuestAvatar(`https://github.com/${username}.png`);
        return;
      }
    }
    if (guestName.trim() !== '') {
      setGuestAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random&color=fff`);
    } else {
      setGuestAvatar('');
    }
  }, [guestSocial, guestName]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    if (val.length > 2) {
      if (val.length > 6 && val.length < 11) {
        val = `(${val.substring(0, 2)}) ${val.substring(2, 6)}-${val.substring(6)}`;
      } else if (val.length === 11) {
        val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
      } else {
        val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
      }
    }
    setGuestPhone(val);
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const guestData: Guest = {
      id: initialData?.id || `guest-${Math.random().toString(36).substr(2, 9)}`,
      name: guestName,
      bio: guestBio || undefined,
      social: guestSocial ? `https://github.com/${guestSocial}` : undefined,
      company: guestCompany || undefined,
      phone: guestPhone || undefined,
      linkedin: guestLinkedin ? `https://linkedin.com/in/${guestLinkedin}` : undefined,
      website: guestWebsite || undefined,
      avatar: guestAvatar || undefined,
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

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col max-h-[90vh] bg-fd-background border border-border rounded-2xl w-full max-w-[650px] animate-in zoom-in-95 duration-200 overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-fd-muted/30">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-fd-foreground">
                {initialData ? 'Editar Perfil' : 'Novo Perfil de Convidado'}
              </h2>
              <p className="text-xs text-fd-muted-foreground">
                Mantenha as informações do convidado atualizadas no CRM.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-fd-muted transition-colors text-fd-muted-foreground hover:text-fd-foreground"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <form id="create-guest-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview Section */}
            <div className="flex items-center gap-4 transition-all">
              {guestAvatar ? (
                <img
                  src={guestAvatar}
                  className="size-12 rounded-full"
                  alt="Preview"
                />
              ) : (
                <div className="size-12 rounded-full flex items-center justify-center">
                  <User className="size-6" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-fd-foreground">Preview do Avatar</p>
                <p className="text-[11px] text-fd-muted-foreground leading-relaxed mt-1">
                  Gerado automaticamente com base no nome ou nome de usuário do GitHub.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-fd-foreground ml-1">Nome *</label>
                <input
                  required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all pr-10"
                  placeholder="Ex: Ramon Santos"
                  value={guestName}
                  maxLength={50}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-fd-foreground ml-1">Empresa</label>
                <input
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                  placeholder="Ex: Xispe"
                  value={guestCompany}
                  onChange={(e) => setGuestCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fd-foreground ml-1">Telefone</label>
              <input
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                placeholder="(00) 00000-0000"
                value={guestPhone}
                onChange={handlePhoneChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fd-foreground ml-1">Mini Bio</label>
              <textarea
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fd-primary transition-all min-h-[100px] resize-none"
                placeholder="Destaque as principais áreas de atuação..."
                value={guestBio}
                maxLength={160}
                onChange={(e) => setGuestBio(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-fd-foreground ml-1">GitHub</label>
                <div className="flex items-center w-full border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[44px]">
                  <input
                    placeholder="Usuario"
                    value={guestSocial}
                    onChange={(e) => setGuestSocial(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-fd-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-fd-foreground ml-1">LinkedIn</label>
                <div className="flex items-center w-full border border-border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[44px]">
                  <input
                    placeholder="Usuario"
                    value={guestLinkedin}
                    onChange={(e) => setGuestLinkedin(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-fd-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-fd-foreground ml-1 uppercase tracking-tight">Url do Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
                <input
                  className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                  placeholder="https://..."
                  value={guestWebsite}
                  onChange={(e) => setGuestWebsite(e.target.value)}
                />
              </div>
            </div>
          </form>
        </main>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-border flex justify-end gap-3 bg-fd-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            Cancelar
          </button>
          <ActionButtonRefined
            type="submit"
            form="create-guest-form"
            label={loading ? 'Gravando...' : 'Salvar'}
            className="h-10 px-6 rounded-xl font-bold"
            disabled={loading}
          />
        </footer>
      </div>
    </div>,
    document.body
  );
}
