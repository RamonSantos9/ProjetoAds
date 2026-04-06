'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ActionButton } from '../ui/ActionButton';
import { ConfirmModal } from '../ui/ConfirmModal';
import { X, ImagePlus, Mic, Link as LinkIcon, Trash } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PlatformSelector } from './PlatformSelector';
import { StatusSelector } from './StatusSelector';
import { CategorySelector } from './CategorySelector';
import { GuestSelector } from './GuestSelector';
import { Episode, Guest } from '@/lib/db';

export interface EditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  onSave?: (data: any) => void;
}

function CheckBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-fd-primary/20 text-fd-primary px-2 py-1 rounded-lg border border-fd-primary/20">
      <div className="size-2 rounded-full bg-fd-primary animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-wider">
        PRONTO
      </span>
    </div>
  );
}

export function EditEpisodeModal({
  isOpen,
  onClose,
  episode,
  onSave,
}: EditEpisodeModalProps) {
  const [sourceType, setSourceType] = useState<'file' | 'link'>('file');
  const [externalUrl, setExternalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Produção');
  const [platforms, setPlatforms] = useState<string[]>([]);

  // Guest states
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestBio, setGuestBio] = useState('');
  const [guestSocial, setGuestSocial] = useState('');
  const [guestAvatar, setGuestAvatar] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [removeExistingAudio, setRemoveExistingAudio] = useState(false);
  const [showAudioConfirm, setShowAudioConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (episode && isOpen) {
      setTitle(episode.title);
      setSummary(episode.summary);
      setCategory(episode.category || '');
      setStatus(episode.status);
      setPlatforms(episode.platforms || []);
      setSourceType(episode.externalUrl ? 'link' : 'file');
      setExternalUrl(episode.externalUrl || '');
      setImagePreview(null);
      setImageFile(null);
      setAudioFile(null);
      setRemoveExistingAudio(false);

      const allGuestNames =
        episode.guests?.map((g) =>
          typeof g === 'object' && g !== null ? g.name : g,
        ) || [];
      setSelectedGuests(allGuestNames);
      setGuestName('');
      setGuestBio('');
      setGuestSocial('');
      setGuestAvatar('');
      setIsNewGuest(false);
    }
  }, [episode, isOpen]);

  // GitHub Avatar Sync Logic
  useEffect(() => {
    if (guestSocial.includes('github.com/')) {
      const username = guestSocial
        .split('github.com/')[1]
        ?.split('/')[0]
        ?.split('?')[0];
      if (username) {
        setGuestAvatar(`https://github.com/${username}.png`);
      }
    }
  }, [guestSocial]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const audioPreviewUrl = useMemo(() => {
    if (audioFile) return URL.createObjectURL(audioFile);
    if (!removeExistingAudio && episode?.audioUrl) return episode.audioUrl;
    return null;
  }, [audioFile, episode, removeExistingAudio]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!episode) return;

    setLoading(true);

    try {
      const guestsData: Guest[] = selectedGuests.map((name) => ({
        id: `guest-${Math.random().toString(36).substr(2, 5)}`,
        name,
      }));
      if (isNewGuest && guestName.trim() !== '') {
        guestsData.push({
          id: `guest-${Math.random().toString(36).substr(2, 5)}`,
          name: guestName,
          bio: guestBio || undefined,
          social: guestSocial || undefined,
          avatar: guestAvatar || undefined,
        });
      }

      const formData = new FormData();
      if (sourceType === 'file' && audioFile) {
        formData.append('audio', audioFile);
      } else if (sourceType === 'file' && removeExistingAudio) {
        formData.append('removeAudio', 'true');
      } else if (sourceType === 'link') {
        formData.append('externalUrl', externalUrl);
      }

      formData.append('id', episode.id); // Send ID for update logic
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('category', category);
      formData.append('status', status);
      formData.append('guests', JSON.stringify(guestsData));
      formData.append('platforms', JSON.stringify(platforms));

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Falha ao atualizar episódio');

      const result = await response.json();
      onSave?.(result.record);
      onClose();
    } catch (err) {
      console.error('Falha ao atualizar episódio:', err);
      alert('Erro ao atualizar dados.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex flex-col max-h-[90vh] bg-fd-background border border-border rounded-2xl w-full max-w-[550px] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-fd-muted/30">
          <div>
            <h2 className="font-bold text-xl text-fd-foreground">
              Editar Episódio
            </h2>
            <p className="text-xs text-fd-muted-foreground mt-0.5">
              Atualize as informações do seu conteúdo profissional.
            </p>
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
          <form
            id="edit-episode-form"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/20 focus:border-fd-primary transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <CategorySelector
                  value={category}
                  onChange={(val) => setCategory(val as any)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">
                Resumo <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/20 focus:border-fd-primary transition-all resize-none"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Audio Source Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">
                  Fonte do Áudio <span className="text-red-500">*</span>
                </label>
                <div className="flex bg-background dark:bg-[#212121] p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setSourceType('file')}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5',
                      sourceType === 'file'
                        ? 'dark:bg-fd-background bg-black/5 text-fd-primary'
                        : 'text-foreground',
                    )}
                  >
                    <Mic className="size-3" /> Arquivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType('link')}
                    className={cn(
                      'px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5',
                      sourceType === 'link'
                        ? 'dark:bg-fd-background bg-black/5 text-fd-primary'
                        : 'text-foreground',
                    )}
                  >
                    <LinkIcon className="size-3" /> Link Externo
                  </button>
                </div>
              </div>

              {sourceType === 'file' ? (
                <div className="relative group">
                  <input
                    ref={audioInputRef}
                    accept="audio/*"
                    className="hidden"
                    type="file"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className={cn(
                      'w-full flex items-center justify-between p-2 border rounded-lg transition-all',
                      audioFile
                        ? 'border-border'
                        : 'border-dashed border-border bg-fd-muted/20',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2 rounded-lg text-foreground')}>
                        <Mic className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {audioFile
                            ? audioFile.name
                            : episode?.audioUrl
                              ? 'Manter Áudio Atual'
                              : 'Selecionar Áudio'}
                        </p>
                      </div>
                    </div>
                    {audioFile && <CheckBadge />}
                  </button>

                  {/* Audio Preview and Remove */}
                  {audioPreviewUrl && (
                    <div className="mt-3 p-3 bg-fd-muted/30 border border-border rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
                      <audio
                        src={audioPreviewUrl}
                        controls
                        className="w-full h-8 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAudioConfirm(true)}
                        className="p-2 hover:bg-fd-muted text-red-500 rounded-lg transition-colors border border-transparent hover:border-border shrink-0"
                        title="Remover áudio"
                      >
                        <Trash className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                  <div className="relative">
                    <input
                      className="w-full bg-fd-muted border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/20 focus:border-fd-primary transition-all"
                      placeholder="URL do YouTube ou Spotify"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">
                  Status <span className="text-red-500">*</span>
                </label>
                <StatusSelector value={status} onChange={setStatus} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Plataformas</label>
                <PlatformSelector
                  selected={platforms}
                  onChange={setPlatforms}
                />
              </div>
            </div>

            {/* Guest Management */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Convidado</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewGuest(!isNewGuest)}
                  className={cn(
                    'w-10 h-5 rounded-full p-1 transition-colors duration-200',
                    isNewGuest
                      ? 'bg-fd-primary'
                      : 'bg-fd-muted border border-border',
                  )}
                >
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full bg-white transition-transform duration-200',
                      isNewGuest ? 'translate-x-5' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <GuestSelector
                  selected={selectedGuests}
                  onChange={setSelectedGuests}
                />

                {isNewGuest && (
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-3 border-t border-border mt-4">
                    <p className="text-xs text-fd-muted-foreground font-medium mb-1">
                      Cadastrar e adicionar novo convidado
                    </p>
                    <input
                      className="w-full bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                      placeholder="Nome do Novo Convidado"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                    />
                    <input
                      className="w-full bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                      placeholder="Mini Bio"
                      value={guestBio}
                      onChange={(e) => setGuestBio(e.target.value)}
                    />
                    <div className="relative">
                      <input
                        className="w-full bg-fd-muted/50 border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="github.com/usuario"
                        value={guestSocial}
                        onChange={(e) => setGuestSocial(e.target.value)}
                      />
                      {guestAvatar && (
                        <img
                          src={guestAvatar}
                          className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-full border border-fd-primary"
                          alt="Social Sync"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 block">
                Capa do Episódio
              </label>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleImageChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full h-[140px] rounded-lg border-1 border-dashed border-border transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-fd-muted/20"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-fd-muted-foreground">
                    <ImagePlus className="size-8 stroke-[1.5]" />
                    <p className="text-xs font-bold text-fd-foreground">
                      Alterar Capa
                    </p>
                  </div>
                )}
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
          <ActionButton
            type="submit"
            form="edit-episode-form"
            label={loading ? 'Salvando...' : 'Atualizar Episódio'}
            variant="primary"
            showIcon={false}
            disabled={loading}
          />
        </footer>
      </div>

      <ConfirmModal
        isOpen={showAudioConfirm}
        title="Remover Áudio"
        description="Tem certeza de que deseja remover o áudio deste episódio? Esta ação não pode ser desfeita após salvar as alterações."
        confirmText="Sim, Remover"
        onConfirm={() => {
          setAudioFile(null);
          setRemoveExistingAudio(true);
          if (audioInputRef.current) audioInputRef.current.value = '';
          setShowAudioConfirm(false);
        }}
        onCancel={() => setShowAudioConfirm(false)}
      />
    </div>,
    document.body,
  );
}
