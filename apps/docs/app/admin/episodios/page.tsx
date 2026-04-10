'use client';

import React, { useState, useEffect } from 'react';
import { HomeBadge } from '@/components/home/HomeBadge';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { ContentToolbar } from '@/components/ui/ContentToolbar';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import { Check, Search, Trash2 } from 'lucide-react';
import { CreateEpisodeModal } from '@/components/dashboard/CreateEpisodeModal';
import { EditEpisodeModal } from '@/components/dashboard/EditEpisodeModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Badge } from '@/components/ui/Badge';
import { Episode } from '@/lib/db';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import {
  EpisodeCard,
  EpisodeListItem,
} from '@/components/episodes/EpisodeCard';

import * as Popover from '@radix-ui/react-popover';
import { Plus, X, User as UserIcon } from 'lucide-react';

export default function EpisodesDashboardPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');

  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);

  // Load real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [epRes, memRes] = await Promise.all([
          fetch('/api/episodes'),
          fetch('/api/workspace/members')
        ]);
        
        if (epRes.ok) {
          const epData = await epRes.json();
          setEpisodes(epData);
        }
        
        if (memRes.ok) {
          const memData = await memRes.json();
          setMembers(memData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(authorSearch.toLowerCase()) || 
    m.email?.toLowerCase().includes(authorSearch.toLowerCase())
  );

  const selectedAuthor = members.find(m => m.id === selectedAuthorId);

  const filtered = episodes.filter(
    (p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                            p.summary.toLowerCase().includes(search.toLowerCase());
      const matchesAuthor = selectedAuthorId ? p.ownerId === selectedAuthorId : true;
      return matchesSearch && matchesAuthor;
    }
  );

  const handleCreateSave = (data: any) => {
    if (data.id || data.slug) {
      setEpisodes((prev) => [data, ...prev]);
      toast.success('Episódio criado com sucesso!');
    }
  };

  const handleEditSave = (updated: Episode) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === updated.id ? updated : ep)),
    );
    toast.success('Episódio atualizado com sucesso!');
  };

  const handleDeleteClick = (ep: Episode) => {
    setEpisodeToDelete(ep);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!episodeToDelete) return;
    try {
      const res = await fetch(`/api/episodes/${episodeToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Falha ao excluir episódio');
      
      setEpisodes((prev) => prev.filter((ep) => ep.id !== episodeToDelete.id));
      setIsConfirmDeleteOpen(false);
      setEpisodeToDelete(null);
      toast.success('Episódio excluído com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir episódio.');
    }
  };

  return (
    <div className="rebrand-body flex min-h-[calc(100vh-64px)] flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 sm:px-8 py-8 text-fd-foreground">
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8 flex flex-col min-h-0">
        <div className="flex gap-4 mb-4 md:mb-8 justify-between max-w-full shrink-0">
          <HomeBadge
            text="Dashboard / Episódios"
            href={`${isAdmin ? '/admin' : '/dashboard'}/episodios`}
          />
          <ThemeToggle mode="light-dark" />
        </div>

        {/* Content Card matches modern PodcastAds rounded-[24px] box */}
        <div className="w-full p-0 flex flex-col flex-1 min-h-0">
          <section className="flex flex-col flex-1 min-h-0 h-full">
            <h1 className="text-2xl sm:text-3xl font-semibold text-fd-foreground tracking-tight mb-6 pb-8">
              Gerenciar Episódios
            </h1>

            <div className="flex flex-col gap-4 flex-1 min-h-0">
              <ContentToolbar
                search={search}
                onSearchChange={setSearch}
                placeholder="Pesquisar episódios..."
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showViewToggle
                action={
                  isAdmin ? (
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
                    >
                      Novo Episódio
                    </button>
                  ) : undefined
                }
              />

              {/* Barra de Filtros (High Fidelity) */}
              <div className="flex flex-wrap items-center gap-2 mt-2 -mb-2 empty:hidden py-1">
                {/* Filtro: Criado por */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <div 
                      tabIndex={0} 
                      className={cn(
                        "cursor-pointer select-none focus:outline-none transition-colors duration-200 max-w-full flex items-center justify-center h-7 rounded-lg whitespace-nowrap text-xs font-medium px-2 border",
                        selectedAuthorId 
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent" 
                          : "text-foreground bg-background hover:bg-fd-accent dark:hover:bg-white/5 border-fd-border"
                      )}
                      role="button"
                    >
                      <div className="w-4 h-4 relative flex items-center justify-center mr-1">
                        {selectedAuthorId ? (
                           <X 
                             className="w-3 h-3 hover:scale-110 transition-transform" 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedAuthorId(null);
                             }}
                           />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </div>
                      <div className="shrink-0">
                        {selectedAuthor 
                          ? `${selectedAuthor.name || selectedAuthor.email}${selectedAuthor.id === currentUserId ? ' (Eu)' : ''}` 
                          : 'Criado por'
                        }
                      </div>
                    </div>
                  </Popover.Trigger>
                  
                  <Popover.Portal>
                    <Popover.Content 
                      className="z-50 w-72 overflow-hidden rounded-[12px] border border-fd-border bg-fd-background/95 backdrop-blur-md p-0 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                      sideOffset={8}
                      align="start"
                    >
                      <div className="flex items-center border-b border-fd-border/50 px-3">
                        <UserIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-fd-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Buscar membros do workspace..."
                          value={authorSearch}
                          onChange={(e) => setAuthorSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[280px] overflow-y-auto overflow-x-hidden p-1">
                        {filteredMembers.length === 0 ? (
                          <div className="flex items-center justify-center py-6 text-xs text-fd-muted-foreground">
                            Nenhum membro encontrado.
                          </div>
                        ) : (
                          filteredMembers.map((member) => (
                            <div
                              key={member.id}
                              onClick={() => {
                                setSelectedAuthorId(member.id);
                              }}
                              className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2 text-sm outline-none transition-colors",
                                selectedAuthorId === member.id 
                                  ? "bg-fd-accent text-fd-accent-foreground" 
                                  : "hover:bg-fd-accent/50 text-fd-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {member.image ? (
                                  <img src={member.image} alt={member.name} className="w-5 h-5 rounded-full" />
                                ) : (
                                  <UserIcon className="w-4 h-4 opacity-50" />
                                )}
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium truncate">
                                    {member.name || member.email} {member.id === currentUserId ? "(Eu)" : ""}
                                  </span>
                                  {member.name && <span className="text-[10px] opacity-60 truncate">{member.email}</span>}
                                </div>
                              </div>
                              {selectedAuthorId === member.id && <Plus className="w-3 h-3 rotate-45" />}
                            </div>
                          ))
                        )}
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                {/* Filtro: Status */}
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <div 
                      tabIndex={0} 
                      className={cn(
                        "cursor-pointer select-none focus:outline-none transition-colors duration-200 max-w-full flex items-center justify-center h-7 rounded-lg whitespace-nowrap text-xs font-medium px-2 border",
                        selectedStatus 
                          ? "bg-black text-white dark:bg-white dark:text-black border-transparent" 
                          : "text-foreground bg-background hover:bg-fd-accent dark:hover:bg-white/5 border-fd-border"
                      )}
                      role="button"
                    >
                      <div className="w-4 h-4 relative flex items-center justify-center mr-1">
                        {selectedStatus ? (
                           <X 
                             className="w-3 h-3 hover:scale-110 transition-transform" 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedStatus(null);
                             }}
                           />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </div>
                      <div className="shrink-0">{selectedStatus || 'Status'}</div>
                    </div>
                  </Popover.Trigger>
                  
                  <Popover.Portal>
                    <Popover.Content 
                      className="z-50 w-48 overflow-hidden rounded-[12px] border border-fd-border bg-fd-background/95 backdrop-blur-md p-1 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                      sideOffset={8}
                      align="start"
                    >
                      {['Publicado', 'Produção', 'Revisão'].map((status) => (
                        <div
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={cn(
                            "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors",
                            selectedStatus === status 
                              ? "bg-fd-accent text-fd-accent-foreground" 
                              : "hover:bg-fd-accent/50 text-fd-foreground"
                          )}
                        >
                          <span className="text-xs font-medium">{status}</span>
                          {selectedStatus === status && <Check className="w-3 h-3 ml-auto" />}
                        </div>
                      ))}
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                
              </div>

              <hr className="w-full h-px bg-fd-border border-none opacity-30 hidden sm:block mt-2" />

              {/* List Wrapper Height Control so it scrolls internally */}
              <div className="w-full flex-1 overflow-y-auto min-h-0 pr-1 sm:pr-2 mt-2">
                {loading ? (
                  viewMode === 'grid' ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <li
                          key={i}
                          className="bg-background border border-[#E2E7F1] dark:border-[#2A2A38] rounded-2xl flex flex-col min-h-[280px] overflow-hidden"
                        >
                          <div className="p-[10px] flex flex-col gap-3 flex-1">
                            <Skeleton className="size-full rounded-xl h-[140px]" />
                            <Skeleton className="w-4/5 h-4 ml-1" />
                            <Skeleton className="w-2/3 h-3 ml-1" />
                          </div>
                          <div className="flex justify-between items-center mt-auto p-3 bg-[#F9FAFB] dark:bg-[#121212] border-t border-[#E2E7F1] dark:border-[#2A2A38]">
                            <Skeleton className="w-16 h-6 rounded-full" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-col gap-2 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <li
                          key={i}
                          className="bg-fd-background border border-border rounded-xl p-3 flex items-center gap-4"
                        >
                          <Skeleton className="w-14 h-14 rounded-lg" />
                          <div className="flex-1 flex flex-col gap-2">
                            <Skeleton className="w-1/3 h-4" />
                            <Skeleton className="w-1/2 h-3" />
                          </div>
                          <Skeleton className="w-20 h-6 rounded-full" />
                        </li>
                      ))}
                    </ul>
                  )
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-2xl gap-3 text-fd-muted-foreground">
                    <Search className="size-8" />
                    <p className="text-sm font-medium">
                      Nenhum episódio encontrado.
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full content-start">
                    {filtered.map((ep) => (
                      <li key={ep.id}>
                        <EpisodeCard
                          episode={ep}
                          href={`${isAdmin ? '/admin' : '/dashboard'}/episodios/${ep.id}`}
                          isAdmin={isAdmin}
                          onEdit={() => {
                            setSelectedEpisode(ep);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteClick(ep)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="flex flex-col gap-2.5 w-full">
                    {filtered.map((ep) => (
                      <li key={ep.id}>
                        <EpisodeListItem
                          episode={ep}
                          href={`${isAdmin ? '/admin' : '/dashboard'}/episodios/${ep.id}`}
                          isAdmin={isAdmin}
                          onEdit={() => {
                            setSelectedEpisode(ep);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteClick(ep)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <CreateEpisodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSave}
      />

      <EditEpisodeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEpisode(null);
        }}
        episode={selectedEpisode}
        onSave={handleEditSave}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Excluir Episódio"
        description={`Tem certeza que deseja excluir o episódio "${episodeToDelete?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteOpen(false);
          setEpisodeToDelete(null);
        }}
      />
    </div>
  );
}
