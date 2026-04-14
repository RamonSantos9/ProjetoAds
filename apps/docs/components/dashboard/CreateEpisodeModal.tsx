'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ActionButton } from '../ui/ActionButton';
import { ConfirmModal } from '../ui/ConfirmModal';
import { Trash, X, Mic, ImagePlus, Clock2Icon, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CategorySelector } from './CategorySelector';
import { GuestSelector } from './GuestSelector';
import { Guest } from '@/lib/db';
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface EpisodeFormData {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  duration: string;
  scheduledAt?: string | null;
  guests: Guest[];
  platforms?: string[];
  creator: string;
  imageFile: File | null;
  audioFile: File | null;
  audioUrl?: string;
  externalUrl?: string;
  transcriptionText?: string;
}

export interface CreateEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function CreateEpisodeModal({
  isOpen,
  onClose,
  onSave,
}: CreateEpisodeModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState<string>('12:00:00');
  const [creator, setCreator] = useState('Ramon Santos');

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
  const [showAudioConfirm, setShowAudioConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setSummary('');
      setCategory('');
      setScheduledDate(undefined);
      setScheduledTime('12:00:00');
      setImagePreview(null);
      setImageFile(null);
      setAudioFile(null);

      setSelectedGuests([]);
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
  }, [isOpen]);

  // GitHub / Fallback Avatar Sync Logic
  useEffect(() => {
    if (guestSocial && guestSocial.trim() !== '') {
      const username = guestSocial.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0]?.split('?')[0];
      if (username) {
        setGuestAvatar(`https://github.com/${username}.png`);
        return;
      }
    }
    // Fallback: Initial letter + random background
    if (guestName.trim() !== '') {
      setGuestAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(guestName)}&background=random&color=fff`);
    } else {
      setGuestAvatar('');
    }
  }, [guestSocial, guestName]);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Keep only numbers
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

  const audioPreviewUrl = useMemo(() => {
    if (audioFile) return URL.createObjectURL(audioFile);
    return null;
  }, [audioFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      }

      let finalScheduledAt = '';
      if (scheduledDate) {
        const d = new Date(scheduledDate);
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        d.setHours(hours || 0, minutes || 0, 0, 0);
        finalScheduledAt = d.toISOString();
      }

      let currentStatus = 'Produção';
      if (finalScheduledAt) {
        const isFuture = new Date(finalScheduledAt).getTime() > new Date().getTime() + 1000; // 1 second buffer
        if (isFuture) {
          currentStatus = 'Agendado';
        }
      }

      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('category', category);
      formData.append('status', currentStatus);
      if (finalScheduledAt) {
        formData.append('scheduledAt', finalScheduledAt);
      }
      formData.append('guests', JSON.stringify(guestsData));
      formData.append('creator', creator);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao criar episódio');
      }

      const result = await response.json();
      onSave?.({
        id: result.record.id,
        slug: result.record.slug,
        title: result.record.title,
        summary: result.record.summary,
        category: result.record.category,
        status: result.record.status,
        duration: result.record.duration,
        scheduledAt: result.record.scheduledAt,
        guests: result.record.guests,
        platforms: result.record.platforms,
        creator: creator,
        imageFile: imageFile,
        audioFile: audioFile,
        audioUrl: result.record.audioUrl,
        externalUrl: result.record.externalUrl,
        transcriptionText: result.record.transcriptionText,
      });
      handleClose();
    } catch (err: any) {
      console.error('Falha ao processar episódio:', err);
      toast.error(err.message || 'Erro ao criar dados.');
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
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="flex flex-col max-h-[90vh] bg-fd-background border border-border rounded-2xl w-full max-w-[550px] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b">
              <div className="flex flex-col">
                <h2 className="font-bold text-xl text-fd-foreground">
                  Novo Episódio
                </h2>
                <p className="text-xs text-fd-muted-foreground mt-0.5">
                  Preencha os detalhes para publicar seu conteúdo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-fd-muted transition-colors text-fd-muted-foreground hover:text-fd-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <form
            id="create-episode-form"
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
                  placeholder="Ex: Introdução ao IA"
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

            {/* Audio Upload */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">
                Arquivo de Áudio <span className="text-red-500">*</span>
              </label>
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
                        {audioFile ? audioFile.name : 'Selecionar Áudio'}
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
            </div>

            {/* Schedule / Agendamento */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold mb-2 block">
                  Agendamento (Opcional)
                </label>
                
                <Card className="w-full">
                  <CardContent className="pt-6">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={(newDate) => {
                        // Keep time if changing date, else defaults to 12:00
                        if (newDate) {
                          setScheduledDate(newDate);
                        } else {
                          setScheduledDate(undefined);
                        }
                      }}
                      locale={ptBR}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="p-0 flex justify-center"
                    />
                  </CardContent>
                  <CardFooter className="border-t border-border bg-fd-muted/30 p-4">
                    <FieldGroup className="mt-0 grid-cols-1 w-full">
                      <Field>
                        <FieldLabel htmlFor="time-from">Horário</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="time-from"
                            type="time"
                            step="60"
                            value={scheduledTime}
                            min={
                              scheduledDate &&
                              scheduledDate.toDateString() === new Date().toDateString()
                                ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                : undefined
                            }
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none bg-background"
                          />
                          <InputGroupAddon>
                            <Clock2Icon className="h-4 w-4 text-muted-foreground mr-1" />
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    </FieldGroup>
                  </CardFooter>
                </Card>

                <p className="text-xs text-fd-muted-foreground mt-1">
                  Se definir uma data/hora no futuro, o episódio ficará "Agendado" e mudará automaticamente para "Produção" quando a data chegar.
                </p>
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
                  <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                    <div className="flex items-center gap-3 mb-1">
                      {guestAvatar ? (
                        <img
                          src={guestAvatar}
                          className="size-10 rounded-full"
                          alt="Avatar Sync"
                        />
                      ) : (
                        <div className="size-10 rounded-full bg-fd-muted flex items-center justify-center text-fd-muted-foreground">
                          <User className="size-4" />
                        </div>
                      )}
                      <p className="text-xs text-fd-muted-foreground font-medium">
                        O avatar é gerado automaticamente pelo nome ou GitHub (se fornecido).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        className="w-full md:col-span-1 bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Nome do Novo Convidado *"
                        value={guestName}
                        maxLength={50}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                      <input
                        className="w-full md:col-span-1 bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Empresa (opcional)"
                        value={guestCompany}
                        onChange={(e) => setGuestCompany(e.target.value)}
                      />
                      <input
                        className="w-full md:col-span-1 bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all"
                        placeholder="Telefone / Contato"
                        value={guestPhone}
                        onChange={handlePhoneChange}
                      />
                    </div>
                    
                    <textarea
                      className="w-full bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all resize-none"
                      placeholder="Mini Bio"
                      rows={2}
                      maxLength={160}
                      value={guestBio}
                      onChange={(e) => setGuestBio(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center w-full bg-fd-muted/50 border border-border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[42px]">
                        <span className="px-3 text-[11px] text-fd-muted-foreground bg-fd-muted/80 h-full flex items-center border-r border-border select-none whitespace-nowrap">
                          github.com/
                        </span>
                        <input
                          placeholder="usuario"
                          value={guestSocial}
                          onChange={(e) => setGuestSocial(e.target.value)}
                          className="flex-1 bg-transparent px-2.5 py-2.5 text-sm text-fd-foreground focus:outline-none"
                        />
                      </div>
                      
                      <div className="flex items-center w-full bg-fd-muted/50 border border-border rounded-xl overflow-hidden focus-within:border-fd-primary transition-all h-[42px]">
                        <span className="px-3 text-[11px] text-fd-muted-foreground bg-fd-muted/80 h-full flex items-center border-r border-border select-none whitespace-nowrap">
                          linkedin.com/in/
                        </span>
                        <input
                          placeholder="usuario"
                          value={guestLinkedin}
                          onChange={(e) => setGuestLinkedin(e.target.value)}
                          className="flex-1 bg-transparent px-2.5 py-2.5 text-sm text-fd-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                    <input
                      className="w-full h-[42px] bg-fd-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-fd-foreground focus:outline-none focus:border-fd-primary transition-all mt-3"
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
            onClick={handleClose}
            className="px-5 py-2 text-sm font-semibold text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            Cancelar
          </button>
          <ActionButton
            type="submit"
            form="create-episode-form"
            label={loading ? 'Salvando...' : 'Criar Episódio'}
            variant="primary"
            showIcon={false}
            disabled={loading}
          />
        </footer>
      </div>

      <ConfirmModal
        isOpen={showAudioConfirm}
        title="Remover Áudio"
        description="Tem certeza de que deseja limpar o áudio selecionado?"
        confirmText="Sim, Remover"
        onConfirm={() => {
          setAudioFile(null);
          if (audioInputRef.current) audioInputRef.current.value = '';
          setShowAudioConfirm(false);
        }}
        onCancel={() => setShowAudioConfirm(false)}
      />
    </div>,
    document.body,
  );
}
