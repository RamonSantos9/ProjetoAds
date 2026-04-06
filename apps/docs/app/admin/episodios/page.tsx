'use client';

import React, { useState, useEffect } from 'react';
import { HomeBadge } from '@/components/home/HomeBadge';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { ActionButton } from '@/components/ui/ActionButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { Search } from 'lucide-react';
import { CreateEpisodeModal } from '@/components/dashboard/CreateEpisodeModal';
import { EditEpisodeModal } from '@/components/dashboard/EditEpisodeModal';
import { Badge } from '@/components/ui/Badge';
import { Episode } from '@/lib/db';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  EpisodeCard,
  EpisodeListItem,
} from '@/components/episodes/EpisodeCard';

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

  // Load real data from API
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/episodes');
        if (!res.ok) throw new Error('Failed to fetch episodes');
        const data = await res.json();
        setEpisodes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  const filtered = episodes.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateSave = (data: any) => {
    // If the data comes from the API result (it has an id)
    if (data.id || data.slug) {
      setEpisodes((prev) => [data, ...prev]);
    } else {
      // Fallback for manual local creation (rare now)
      setEpisodes((prev) => [
        {
          id: Math.random().toString(36).substring(7),
          ...data,
          guests:
            typeof data.guests === 'string'
              ? data.guests.split(',').filter(Boolean)
              : data.guests,
          platforms:
            typeof data.platforms === 'string'
              ? data.platforms.split(',').filter(Boolean)
              : data.platforms,
        },
        ...prev,
      ]);
    }
  };

  const handleEditSave = (updated: Episode) => {
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === updated.id ? updated : ep)),
    );
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
              {/* Toolbar */}
              <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
                {/* Search */}
                <div className="relative w-full max-w-[340px]">
                  <input
                    className="w-full bg-[#f6f8fa] dark:bg-[#1F2122] border rounded-lg pl-3 pr-9 py-2.5 text-sm font-semibold text-[#121217] dark:text-white placeholder:text-[#6F6F88] dark:placeholder:text-[#8A8AA3] focus:outline-none focus:border-fd-primary transition-colors"
                    placeholder="Pesquisar episódios..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m11.336 11.334 2.667 2.667M2 7.333a5.333 5.333 0 1 0 10.667 0A5.333 5.333 0 0 0 2 7.333"
                      stroke="#83899f"
                      strokeWidth="1.333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Actions */}
                <nav className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
                  <ViewToggle
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    className="hidden sm:flex"
                  />
                  {isAdmin && (
                    <ActionButton
                      label="Novo Episódio"
                      onClick={() => setIsCreateModalOpen(true)}
                      className="rounded-xl px-4"
                    />
                  )}
                </nav>
              </header>

              <hr className="w-full h-px bg-fd-border border-none opacity-50 hidden sm:block" />

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
                            <Skeleton className="w-full h-[140px] rounded-xl" />
                            <Skeleton className="w-4/5 h-4 ml-1" />
                            <Skeleton className="w-2/3 h-3 ml-1" />
                          </div>
                          <div className="flex justify-between items-center mt-auto p-3 bg-[#F9FAFB] dark:bg-[#1A1A24] border-t border-[#E2E7F1] dark:border-[#2A2A38]">
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
