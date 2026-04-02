'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActionButton } from '../ui/ActionButton';
import { X, Info, ImagePlus } from 'lucide-react';

export interface Episode {
  id: string; // Internal id for mock tracking
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  duration: string;
  guests: string[]; 
  platforms: string[]; 
  creator?: string; // New field
  imageFile?: File | null;
}

interface EditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: Episode) => void;
  episode: Episode | null;
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="relative inline-block group" tabIndex={-1}>
      <button type="button" tabIndex={-1} className="cursor-help flex items-center text-fd-muted-foreground">
        <Info className="size-4" />
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-fd-foreground text-fd-background text-xs font-medium rounded-md px-3 py-2 whitespace-nowrap shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-fd-foreground" />
      </div>
    </div>
  );
}

export function EditEpisodeModal({ isOpen, onClose, onSave, episode }: EditEpisodeModalProps) {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [guests, setGuests] = useState('');
  const [platforms, setPlatforms] = useState('');
  const [creator, setCreator] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Populate form on open
  useEffect(() => {
    if (isOpen && episode) {
      setSlug(episode.slug || '');
      setTitle(episode.title || '');
      setSummary(episode.summary || '');
      setCategory(episode.category || '');
      setStatus(episode.status || 'Produção');
      setDuration(episode.duration || '00:00');
      setGuests((episode.guests || []).join(', '));
      setPlatforms((episode.platforms || []).join(', '));
      setCreator(episode.creator || '');
      setImageFile(episode.imageFile || null);
      if (episode.imageFile) {
         setImagePreview(URL.createObjectURL(episode.imageFile));
      } else {
         setImagePreview(null);
      }
    }
  }, [isOpen, episode]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

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

  const handleClose = () => {
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !episode) return;
    
    setLoading(true);
    setTimeout(() => {
      onSave?.({
        ...episode,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        title,
        summary,
        category,
        status,
        duration,
        guests: guests.split(',').map(g => g.trim()).filter(Boolean),
        platforms: platforms.split(',').map(p => p.trim()).filter(Boolean),
        creator,
        imageFile
      });
      setLoading(false);
      handleClose();
    }, 600);
  };

  if (!isOpen || !episode || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="flex flex-col max-h-[90vh] bg-fd-background border border-border rounded-xl shadow-xl w-full max-w-[500px] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-lg text-fd-foreground">Editar episódio</h2>
          <button onClick={handleClose} className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">
            <X className="size-5" />
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-5 py-6">
          <form id="edit-episode-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-fd-foreground">Título do Episódio *</label>
              <input
                required
                className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                placeholder="Ex: Introdução ao IA"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-fd-foreground">Resumo *</label>
              <textarea
                required
                rows={3}
                className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary resize-none"
                placeholder="Uma breve descrição sobre o conteúdo"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-fd-foreground">Categoria</label>
                 <input
                   className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-fd-foreground">Status</label>
                 <select
                   className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                   value={status}
                   onChange={(e) => setStatus(e.target.value)}
                 >
                   <option>Rascunho</option>
                   <option>Produção</option>
                   <option>Publicado</option>
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <div className="flex gap-1.5 items-center">
                    <label className="text-sm font-medium text-fd-foreground">Duração</label>
                 </div>
                 <input
                   className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                   value={duration}
                   onChange={(e) => setDuration(e.target.value)}
                 />
               </div>
               <div className="space-y-1.5">
                 <div className="flex gap-1.5 items-center">
                    <label className="text-sm font-medium text-fd-foreground">Plataformas</label>
                 </div>
                 <input
                   className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                   value={platforms}
                   onChange={(e) => setPlatforms(e.target.value)}
                 />
               </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-fd-foreground">Convidados</label>
              <input
                className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-fd-foreground">Criador / Autor</label>
              <input
                className="w-full bg-fd-muted border border-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none focus:ring-1 focus:ring-fd-primary"
                placeholder="Nome do responsável"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-fd-foreground">Capa do Episódio</label>
              <div>
                <input ref={fileInputRef} accept="image/*" className="hidden" type="file" onChange={handleImageChange} />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-fd-primary/50 text-center flex flex-col items-center justify-center min-h-[140px]"
                >
                  {imagePreview ? (
                     <div className="flex flex-col items-center gap-2">
                       <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md border border-border" />
                       <span className="text-xs text-fd-primary font-medium mt-1">Alterar imagem</span>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-fd-muted-foreground cursor-pointer">
                      <ImagePlus className="size-8" />
                      <p className="text-sm font-medium text-fd-foreground">Nova imagem de capa</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>

        <footer className="px-5 py-4 border-t border-border flex justify-end gap-3 bg-fd-muted/30">
          <ActionButton type="button" label="Cancelar" variant="secondary" onClick={handleClose} showIcon={false} />
          <ActionButton type="submit" form="edit-episode-form" label={loading ? 'Salvando...' : 'Salvar Alterações'} variant="primary" showIcon={false} disabled={loading} />
        </footer>
      </div>
    </div>,
    document.body
  );
}
