'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ActionButton } from '../ui/ActionButton';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Trash, X, Mic, ImagePlus, Clock2Icon, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CategorySelector } from './CategorySelector';
import { GuestSelector } from './GuestSelector';
import { Episode, Guest } from '@/lib/db';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Produção');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState<string>('12:00:00');

  // Guest states
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestBio, setGuestBio] = useState('');
  const [guestSocial, setGuestSocial] = useState('');
  const [guestCompany, setGuestCompany] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestLinkedin, setGuestLinkedin] = useState('');
  const [guestWebsite, setGuestWebsite] = useState('');
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

  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role || 'USUARIO';

  const isElevated = userRole === 'ADMIN' || userRole === 'PROFESSOR';
  const isOwner = !!currentUserId && episode?.ownerId === currentUserId;
  const canManage = isElevated || isOwner;

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
      setImagePreview(episode.image || null);
      setImageFile(null);
      setAudioFile(null);
      setRemoveExistingAudio(false);

      if (episode.scheduledAt) {
        const dateObj = new Date(episode.scheduledAt);
        setScheduledDate(dateObj);
        setScheduledTime(format(dateObj, 'HH:mm:ss'));
      } else {
        setScheduledDate(undefined);
        setScheduledTime('12:00:00');
      }

      const allGuestNames =
        episode.guests?.map((g) =>
          typeof g === 'object' && g !== null ? g.name : g,
        ) || [];
      setSelectedGuests(allGuestNames);
      
      // Reset new guest form
      setGuestName('');
      setGuestBio('');
      setGuestSocial('');
      setGuestCompany('');
      setGuestPhone('');
      setGuestLinkedin('');
      setGuestWebsite('');
      setGuestAvatar('');
      setIsNewGuest(false);
    }
  }, [episode, isOpen]);

  // GitHub / Fallback Avatar Sync Logic
  useEffect(() => {
    if (guestSocial && guestSocial.trim() !== '') {
      const username = guestSocial.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0]?.split('?')[0];
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
          id: `guest-${Math.random().toString(36).substr(2, 9)}`,
          name: guestName,
          bio: guestBio || undefined,
          social: guestSocial ? `https://github.com/${guestSocial.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')}` : undefined,
          company: guestCompany || undefined,
          phone: guestPhone || undefined,
          linkedin: guestLinkedin ? `https://linkedin.com/in/${guestLinkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')}` : undefined,
          website: guestWebsite || undefined,
          avatar: guestAvatar || undefined,
        });
      }

      const formData = new FormData();
      
      if (audioFile) {
        formData.append('audio', audioFile);
      } else if (removeExistingAudio) {
        formData.append('removeAudio', 'true');
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let finalScheduledAt = null;
      if (scheduledDate) {
        const combined = new Date(scheduledDate);
        const [h, m, s] = scheduledTime.split(':');
        combined.setHours(parseInt(h), parseInt(m), parseInt(s || '0'));
        finalScheduledAt = combined.toISOString();
      }

      let finalStatus = status;
      if (finalScheduledAt) {
        const isFuture = new Date(finalScheduledAt) > new Date();
        if (isFuture && status === 'Produção') {
          finalStatus = 'Agendado';
        }
      }

      formData.append('id', episode.id);
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('category', category);
      formData.append('status', finalStatus);
      formData.append('scheduledAt', finalScheduledAt || '');
      formData.append('guests', JSON.stringify(guestsData));

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao atualizar episódio');
      }

      const result = await response.json();
      onSave?.(result.record || result.finalEpisode);
      onClose();
      toast.success('Episódio atualizado com sucesso!');
    } catch (err: any) {
      console.error('Falha ao atualizar episódio:', err);
      toast.error(err.message || 'Erro ao atualizar dados.');
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
      <div className="flex flex-col max-h-[90vh] bg-fd-background border border-border rounded-2xl w-full max-w-[650px] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-border bg-fd-muted/30">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-fd-primary/10 text-fd-primary">
               <Mic className="size-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-fd-foreground">
                 {episode ? 'Editar Episódio' : 'Novo Episódio'}
               </h2>
               <p className="text-xs text-fd-muted-foreground">
                 {episode && !canManage ? 'Modo de visualização (Apenas Leitura)' : 'Atualize as informações do seu conteúdo profissional.'}
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
          <form
            id="edit-episode-form"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">TÍTULO *</label>
                <input
                  required
                  disabled={!canManage}
                  className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all disabled:opacity-50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">CATEGORIA *</label>
                <CategorySelector
                  value={category}
                  onChange={(val) => setCategory(val as any)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">RESUMO *</label>
              <textarea
                required
                disabled={!canManage}
                rows={3}
                className="w-full bg-fd-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fd-primary transition-all resize-none disabled:opacity-50"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            {/* Agendamento */}
            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-tight text-fd-muted-foreground">
                <Clock2Icon className="size-4" /> Agendamento e Produção
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-fd-foreground ml-1">Data de Lançamento</label>
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    className="rounded-xl border border-border bg-fd-muted/30"
                    locale={ptBR}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-fd-foreground ml-1">Horário</label>
                  <input
                    type="time"
                    step="1"
                    className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-fd-primary h-[40px]"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                  <div className="p-4 rounded-xl bg-fd-primary/5 border border-fd-primary/10 mt-4">
                    <p className="text-[11px] text-fd-muted-foreground leading-relaxed">
                      Selecione uma data futura para que o status mude automaticamente para 
                      <span className="text-fd-primary font-bold mx-1">Agendado</span>. 
                      No horário escolhido, o episódio entrará em Produção.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Upload */}
            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 block">ARQUIVO DE ÁUDIO</label>
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
                  disabled={!canManage}
                  onClick={() => audioInputRef.current?.click()}
                  className={cn(
                    'w-full flex items-center justify-between p-3 border rounded-xl transition-all',
                    audioFile
                      ? 'border-fd-primary bg-fd-primary/5'
                      : 'border-dashed border-border bg-fd-muted/20',
                    !canManage && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-fd-primary/10 text-fd-primary">
                      <Mic className="size-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-fd-foreground">
                        {audioFile
                          ? audioFile.name
                          : episode?.audioUrl
                            ? 'Manter Áudio Atual (vincular novo se desejar)'
                            : 'Selecionar Áudio'}
                      </p>
                    </div>
                  </div>
                  {audioFile && <CheckBadge />}
                </button>

                {audioPreviewUrl && (
                  <div className="mt-3 p-3 bg-fd-muted border border-border rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-1">
                    <audio
                      src={audioPreviewUrl}
                      controls
                      className="w-full h-8 flex-1"
                    />
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => setShowAudioConfirm(true)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100 shrink-0"
                      >
                        <Trash className="size-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Guest Management */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-fd-muted-foreground">Convidados do Episódio</span>
                <button
                  type="button"
                  disabled={!canManage}
                  onClick={() => setIsNewGuest(!isNewGuest)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                    isNewGuest 
                      ? 'bg-fd-primary text-white border-fd-primary' 
                      : 'bg-fd-muted text-fd-muted-foreground border-border hover:border-fd-primary/40'
                  )}
                >
                  {isNewGuest ? 'Cancelar Cadastro' : '+ Novo Convidado'}
                </button>
              </div>

              <div className="space-y-4">
                <GuestSelector
                  selected={selectedGuests}
                  onChange={setSelectedGuests}
                />

                {isNewGuest && (
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-3 border-t border-border mt-4">
                    <div className="flex items-center gap-3 mb-1">
                      {guestAvatar ? (
                        <img src={guestAvatar} className="size-10 rounded-full shadow-sm border border-fd-primary/20" alt="Preview"/>
                      ) : (
                        <div className="size-10 rounded-full bg-fd-muted flex items-center justify-center text-fd-muted-foreground border-border">
                          <User className="size-4" />
                        </div>
                      )}
                      <p className="text-xs text-fd-muted-foreground font-medium">O avatar é sincronizado via GitHub ou nome.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Nome *"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                      <input
                        className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Empresa"
                        value={guestCompany}
                        onChange={(e) => setGuestCompany(e.target.value)}
                      />
                      <input
                        className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Contato"
                        value={guestPhone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    
                    <textarea
                      className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all resize-none"
                      placeholder="Mini Bio (máx 160 caracteres)"
                      rows={2}
                      maxLength={160}
                      value={guestBio}
                      onChange={(e) => setGuestBio(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center w-full bg-fd-muted border border-border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[42px]">
                        <span className="px-3 text-[11px] text-fd-muted-foreground bg-fd-muted border-r border-border h-full flex items-center select-none">github.com/</span>
                        <input
                          placeholder="usuario"
                          value={guestSocial}
                          onChange={(e) => setGuestSocial(e.target.value)}
                          className="flex-1 bg-transparent px-2.5 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center w-full bg-fd-muted border border-border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[42px]">
                        <span className="px-3 text-[11px] text-fd-muted-foreground bg-fd-muted border-r border-border h-full flex items-center select-none">linkedin.com/in/</span>
                        <input
                          placeholder="usuario"
                          value={guestLinkedin}
                          onChange={(e) => setGuestLinkedin(e.target.value)}
                          className="flex-1 bg-transparent px-2.5 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <input
                      className="w-full bg-fd-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-fd-primary transition-all"
                      placeholder="Url do Website"
                      value={guestWebsite}
                      onChange={(e) => setGuestWebsite(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="pt-4 border-t border-border">
              <label className="text-sm font-semibold mb-3 block">CAPA DO EPISÓDIO</label>
              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleImageChange}
              />
              <div
                onClick={() => canManage && fileInputRef.current?.click()}
                className={cn(
                  "group relative w-full h-[140px] rounded-xl border-1 border-dashed border-border transition-all flex flex-col items-center justify-center overflow-hidden bg-fd-muted/20",
                  canManage ? "cursor-pointer hover:border-fd-primary/50" : "cursor-default opacity-80"
                )}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview"/>
                    {canManage && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImagePlus className="size-8 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-fd-muted-foreground">
                    <ImagePlus className="size-8" />
                    <p className="text-xs font-bold uppercase tracking-tight">Alterar Capa</p>
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
            Fechar
          </button>
          {canManage && (
            <ActionButton
              type="submit"
              form="edit-episode-form"
              label={loading ? 'Gravando...' : 'Salvar Alterações'}
              variant="primary"
              showIcon={false}
              disabled={loading}
              className="h-10 px-6 rounded-xl font-bold"
            />
          )}
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
