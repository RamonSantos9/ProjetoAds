'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { HomeBadge } from '@/components/home/HomeBadge';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { ActionButton } from '@/components/ui/ActionButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { EditEpisodeModal } from '@/components/dashboard/EditEpisodeModal';
import { Badge } from '@/components/ui/Badge';
import { Episode } from '@/lib/db';
import {
  ChevronLeft,
  Info,
  Mic,
  Users,
  Clock,
  Tag,
  FileText,
  ExternalLink,
} from 'lucide-react';

// ─── Icons ────────────────────────────────────────────────────────────────────

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m14.052 3.74 1.406-1.407a1.563 1.563 0 1 1 2.21 2.21l-8.85 8.849a3.75 3.75 0 0 1-1.58.942L5 15l.667-2.237a3.75 3.75 0 0 1 .941-1.581zm0 0 2.198 2.198M15 11.667v3.958a1.875 1.875 0 0 1-1.875 1.875h-8.75A1.875 1.875 0 0 1 2.5 15.625v-8.75A1.875 1.875 0 0 1 4.375 5h3.958"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 49 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m1.75 28 12.038-12.038a5.25 5.25 0 0 1 7.424 0L33.25 28m-3.5-3.5 3.288-3.288a5.25 5.25 0 0 1 7.424 0L47.25 28m-42 8.75h38.5a3.5 3.5 0 0 0 3.5-3.5v-28a3.5 3.5 0 0 0-3.5-3.5H5.25a3.5 3.5 0 0 0-3.5 3.5v28a3.5 3.5 0 0 0 3.5 3.5m24.5-26.25h.019v.019h-.019zm.875 0a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlaceholderIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 49 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m1.75 28 12.038-12.038a5.25 5.25 0 0 1 7.424 0L33.25 28m-3.5-3.5 3.288-3.288a5.25 5.25 0 0 1 7.424 0L47.25 28m-42 8.75h38.5a3.5 3.5 0 0 0 3.5-3.5v-28a3.5 3.5 0 0 0-3.5-3.5H5.25a3.5 3.5 0 0 0-3.5 3.5v28a3.5 3.5 0 0 0 3.5 3.5m24.5-26.25h.019v.019h-.019zm.875 0a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Page Component ───────────────────────────────────────────────────────────

export default function EpisodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchEpisode = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/episodes/id/${id}`);
      if (!res.ok) throw new Error('Episode not found');
      const data = await res.json();
      setEpisode(data);
    } catch (error) {
      console.error(error);
      setEpisode(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchEpisode();
  }, [id, fetchEpisode]);

  const handleEditSave = (updated: Episode) => {
    setEpisode(updated);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 sm:px-8 py-8 items-center justify-center">
        <div className="text-[#8A8AA3] animate-pulse font-medium">
          Carregando detalhes do episódio...
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 sm:px-8 py-8 items-center justify-center gap-4">
        <p className="text-[#8A8AA3] font-medium">Episódio não encontrado.</p>
        <Link
          href="/admin/episodios"
          className="px-4 py-2 bg-fd-primary text-white rounded-lg hover:bg-fd-primary/90 transition-colors"
        >
          Voltar para Episódios
        </Link>
      </div>
    );
  }

  return (
    <div className="rebrand-body flex min-h-[calc(100vh-64px)] flex-col bg-background px-4 sm:px-8 py-8 text-foreground">
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8 flex flex-col min-h-0">
        {/* Header mimicking PageHeader */}
        <div className="flex gap-4 mb-4 md:mb-8 justify-between max-w-full shrink-0 items-center">
          <div className="flex items-center gap-3">
            <HomeBadge
              text={`${episode.title.slice(0, 20)}...`}
              href="/admin/episodios"
            />
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-background w-full flex-1 overflow-y-auto min-h-0">
          <section
            className="flex flex-col gap-8"
            aria-label="Detalhes do episódio"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-[32px] text-[#121217] dark:text-white tracking-tight">
                Detalhes do conteúdo
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="leading-[24px] relative group cursor-pointer border flex items-center justify-center gap-2 transition-all duration-200 bg-background text-foreground border-border hover:bg-muted rounded-lg h-[36px] px-4 py-2 text-xs w-fit"
                >
                  <InfoIcon />
                  Editar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Info - Col spans 2 */}
              <div className="flex flex-col gap-6 col-span-1 md:col-span-2 bg-background">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  Informações básicas
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-foreground">ID do episódio</p>
                    <p className="text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 py-2 rounded-lg cursor-not-allowed">
                      {episode.id}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-foreground">Slug / Link</p>
                    <p className="text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 py-2 rounded-lg cursor-not-allowed">
                      {episode.slug}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-foreground">Título do episódio</p>
                  <p className="text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 py-2 rounded-lg cursor-not-allowed">
                    "{episode.title}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-foreground">Categoria</p>
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 h-9 rounded-lg cursor-not-allowed">
                      <Tag className="size-3.5 text-[#6b7280]" />
                      {episode.category || 'Geral'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-foreground">Duração</p>
                    <div className="flex items-center gap-2 text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 h-9 rounded-lg cursor-not-allowed">
                      <Clock className="size-3.5 text-[#6b7280]" />
                      {episode.duration}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-foreground">Status</p>
                    <div className="flex h-9 items-center">
                      <Badge
                        variant={
                          episode.status === 'Publicado' ? 'success' : 'warning'
                        }
                        className="w-fit px-4 text-xs cursor-not-allowed h-full"
                      >
                        {episode.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-foreground">Convidados</p>
                  <div className="flex text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 py-2 rounded-lg cursor-not-allowed">
                    <Users className="size-4 text-[#6b7280]" />
                    {episode.guests?.map((g: any, i) => {
                      const name = typeof g === 'object' ? g.name : g;
                      return (
                        <span
                          key={i}
                          className="px-1 text-[11px] text-[#6b7280]"
                        >
                          {name},
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-foreground">Resumo / Descrição</p>
                  <div className="text-sm text-[#6b7280] bg-[#F6F8FA] dark:bg-[#1F2122] border px-3 py-2 rounded-lg cursor-not-allowed">
                    {episode.summary}
                  </div>
                </div>
              </div>

              {/* Sidebar Info - Col spans 1 */}
              <div className="flex flex-col gap-6 col-span-1">
                <div className="flex flex-col gap-4 bg-background">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                    Capa
                  </h2>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#F6F8FA] dark:bg-[#1F2122] border flex items-center justify-center relative cursor-not-allowed text-[#6b7280]">
                    {episode.image ? (
                      <img
                        src={episode.image}
                        className="w-full h-full object-cover"
                        alt="Capa"
                      />
                    ) : (
                      <PlaceholderIcon />
                    )}
                  </div>
                  <p className="text-[11px] text-foreground text-center">
                    Resolução recomendada: 1280x720 (16:9)
                  </p>
                </div>

                <div className="flex flex-col gap-4 bg-background">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                    Áudio
                  </h2>
                  {episode.audioUrl ? (
                    <div className="flex flex-col gap-3 p-4 bg-[#F6F8FA] dark:bg-[#1F2122] border rounded-xl cursor-not-allowed">
                      <audio
                        src={episode.audioUrl}
                        controls
                        className="w-full h-8"
                      />
                      <div className="flex items-center gap-2 overflow-hidden">
                        <p className="text-[10px] text-[#6b7280] flex-1">
                          {episode.audioUrl}
                        </p>
                      </div>
                    </div>
                  ) : episode.externalUrl ? (
                    <div className="flex flex-col gap-2 p-4 bg-[#F6F8FA] dark:bg-[#1F2122] border rounded-xl shadow-sm">
                      <p className="text-[11px] text-foreground font-semibold uppercase tracking-wider opacity-70">
                        Link Externo
                      </p>
                      <a
                        href={episode.externalUrl}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-fd-primary hover:underline group"
                      >
                        <span className="truncate flex-1">
                          {episode.externalUrl}
                        </span>
                        <ExternalLink className="size-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl bg-[#F6F8FA]/50 dark:bg-[#1F2122]/50 border-2 border-dashed border-[#E2E7F1] dark:border-[#2A2A38] text-center cursor-not-allowed">
                      <Mic className="size-8 text-[#8A8AA3] mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[#8A8AA3] font-medium">
                        Nenhum áudio vinculado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <EditEpisodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        episode={episode}
        onSave={handleEditSave}
      />
    </div>
  );
}
