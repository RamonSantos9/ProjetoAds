'use client';

import React, { useState, useEffect } from 'react';
import { HomeBadge } from '@/components/home/HomeBadge';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { ActionButton } from '@/components/ui/ActionButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { Edit2, Search, PlayCircle } from 'lucide-react';
import { CreateEpisodeModal, EpisodeFormData } from '@/components/dashboard/CreateEpisodeModal';
import { EditEpisodeModal, Episode } from '@/components/dashboard/EditEpisodeModal';
import { featuredEpisodes as initialEpisodes } from '../../(home)/_data/episodes';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

function EpisodeCard({ episode, onEdit, isAdmin }: { episode: Episode; onEdit: () => void; isAdmin: boolean }) {
  return (
    <article className="group flex flex-col w-full rounded-2xl border border-fd-border bg-fd-background p-3 gap-3 overflow-hidden transition-all hover:bg-fd-muted hover:border-fd-primary/30">
      {/* Image / Placeholder */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
         {episode.imageFile ? (
           <img src={URL.createObjectURL(episode.imageFile)} className="w-full h-full object-cover" alt={episode.title} />
         ) : (
           <PlayCircle className="size-10 text-fd-muted-foreground group-hover:text-fd-primary transition-colors" />
         )}
         <div className="absolute top-2 right-2 flex gap-1">
           <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-fd-primary/90 text-fd-primary-foreground backdrop-blur-md">
             {episode.duration}
           </span>
         </div>
      </div>

      {/* Info */}
      <div className="flex flex-col w-full gap-1.5 px-1 min-h-[60px] flex-1">
        <h3 className="font-semibold text-sm leading-tight text-fd-foreground line-clamp-2">
          {episode.title}
        </h3>
        <p className="text-xs text-fd-muted-foreground line-clamp-2">{episode.summary}</p>
      </div>

      <hr className="w-full h-px rounded-full border-0 bg-fd-border" />

      {/* Footer */}
      <footer className="flex items-center justify-between w-full px-1">
        <span className={cn(
          "text-xs font-semibold px-2 py-0.5 rounded-full border",
          episode.status === 'Publicado' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"
        )}>
          {episode.status}
        </span>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-md text-fd-muted-foreground hover:bg-fd-background hover:text-fd-primary transition-colors cursor-pointer border border-transparent hover:border-fd-border"
            aria-label={`Editar episódio ${episode.title}`}
          >
            <Edit2 className="size-4" />
          </button>
        )}
      </footer>
    </article>
  );
}

function EpisodeListItem({ episode, onEdit, isAdmin }: { episode: Episode; onEdit: () => void; isAdmin: boolean }) {
  return (
    <article className="group flex items-center w-full rounded-xl border border-fd-border bg-fd-background p-3 gap-4 transition-all hover:bg-fd-muted hover:border-fd-primary/30">
      <div className="w-14 h-14 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
         {episode.imageFile ? (
           <img src={URL.createObjectURL(episode.imageFile)} className="w-full h-full object-cover" alt={episode.title} />
         ) : (
           <PlayCircle className="size-6 text-fd-muted-foreground" />
         )}
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-semibold text-sm text-fd-foreground truncate mb-0.5">{episode.title}</h3>
        <div className="flex gap-2 items-center text-xs text-fd-muted-foreground">
           <span className="truncate max-w-[200px]">{episode.summary}</span>
           <span className="w-1 h-1 rounded-full bg-fd-border"></span>
           <span>{episode.duration}</span>
        </div>
      </div>
      <span className={cn(
          "shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border hidden sm:block",
          episode.status === 'Publicado' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"
      )}>
        {episode.status}
      </span>
      {isAdmin && (
        <button
          onClick={onEdit}
          className="p-2 shrink-0 rounded-md text-fd-muted-foreground hover:bg-fd-background hover:text-fd-primary transition-colors cursor-pointer border border-transparent hover:border-fd-border ml-2"
          aria-label={`Editar episódio ${episode.title}`}
        >
          <Edit2 className="size-4" />
        </button>
      )}
    </article>
  );
}

export default function EpisodesDashboardPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  // Load initial dummy data
  useEffect(() => {
    setLoading(true);
    // Mimic API delay
    const timer = setTimeout(() => {
      setEpisodes(initialEpisodes.map(ep => ({
        id: Math.random().toString(36).substring(7),
        ...ep,
        status: ep.status === 'Publicado' ? 'Publicado' : 'Em Produção'
      })));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = episodes.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.summary.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSave = (newEp: EpisodeFormData) => {
    setEpisodes(prev => [{
      id: Math.random().toString(36).substring(7),
      ...newEp,
      guests: newEp.guests.split(',').filter(Boolean),
      platforms: newEp.platforms.split(',').filter(Boolean),
    }, ...prev]);
  };

  const handleEditSave = (updated: Episode) => {
    setEpisodes(prev => prev.map(ep => ep.id === updated.id ? updated : ep));
  };

  return (
    <div className="rebrand-body flex min-h-[calc(100vh-64px)] flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 sm:px-8 py-8 text-fd-foreground">
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8 flex flex-col min-h-0">
        <div className="flex gap-4 mb-4 md:mb-8 justify-between max-w-full shrink-0">
           <HomeBadge text="Dashboard / Episódios" href={`${isAdmin ? '/admin' : '/dashboard'}/episodios`} />
           <ThemeToggle mode="light-dark" />
        </div>

        {/* Content Card matches modern PodcastAds rounded-[24px] box */}
        <div className="w-full p-0 flex flex-col flex-1 min-h-0">
          <section className="flex flex-col flex-1 min-h-0 h-full">
            <h1 className="text-2xl sm:text-3xl font-semibold text-fd-foreground tracking-tight mb-6 pb-8">
              Gerenciar Episódios
            </h1>

            <div className="flex flex-col gap-4 flex-1 min-h-0">
              {/* Toolbar */}
              <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
                {/* Search */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground z-10" />
                  <input
                    className="w-full bg-fd-background sm:bg-white dark:sm:bg-black border border-fd-border rounded-xl pl-10 pr-4 py-2 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:border-fd-primary transition-colors"
                    placeholder="Pesquisar títulos ou resumos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <nav className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} className="hidden sm:flex" />
                  {isAdmin && (
                    <ActionButton label="Novo Episódio" onClick={() => setIsCreateModalOpen(true)} className="rounded-xl px-4" />
                  )}
                </nav>
              </header>

              <hr className="w-full h-px bg-fd-border border-none opacity-50 hidden sm:block" />

              {/* List Wrapper Height Control so it scrolls internally */}
              <div className="w-full flex-1 overflow-y-auto min-h-0 pr-1 sm:pr-2 mt-2">
                {loading ? (
                  viewMode === 'grid' ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="bg-fd-background border border-border rounded-2xl p-3 flex flex-col gap-3">
                          <Skeleton className="w-full aspect-video rounded-lg" />
                          <Skeleton className="w-4/5 h-4" />
                          <Skeleton className="w-2/3 h-3" />
                          <div className="flex justify-between items-center mt-auto pt-2">
                             <Skeleton className="w-16 h-5 rounded-full" />
                             <Skeleton className="w-7 h-7 rounded-md" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-col gap-2 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <li key={i} className="bg-fd-background border border-border rounded-xl p-3 flex items-center gap-4">
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
                    <p className="text-sm font-medium">Nenhum episódio encontrado.</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full content-start">
                    {filtered.map((ep) => (
                      <li key={ep.id}>
                        <EpisodeCard
                          episode={ep}
                          isAdmin={isAdmin}
                          onEdit={() => {
                            setSelectedEpisode(ep);
                            setIsEditModalOpen(true);
                          }}
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
                          isAdmin={isAdmin}
                          onEdit={() => {
                            setSelectedEpisode(ep);
                            setIsEditModalOpen(true);
                          }}
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
    </div>
  );
}
