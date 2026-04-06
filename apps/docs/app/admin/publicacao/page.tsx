'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Search,
  Share2,
  Youtube,
  Instagram,
  Music,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MoreHorizontal,
  Globe,
  Zap,
} from 'lucide-react';
import { ActionButtonRefined } from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { Episode } from '@/lib/db';

export default function PublicacaoAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const data = await res.json();
          setEpisodes(data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(search.toLowerCase()),
  );

  const getPlatformStatus = (platforms: string[] = [], platform: string) => {
    return platforms.includes(platform) ? 'published' : 'pending';
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Produção
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Publicação & Distribuição
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Monitore e execute a distribuição dos seus episódios em
                múltiplas redes. Garanta que o SEO e as metatags estejam
                otimizados antes de publicar.
              </p>
              <ActionButtonRefined
                label="Publicar Novo"
                icon={<Zap className="size-5" />}
                onClick={() =>
                  alert(
                    'Selecione um episódio para iniciar o workflow de publicação.',
                  )
                }
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Platform Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: 'Spotify',
                  icon: <Music className="size-5 text-[#1DB954]" />,
                  count: '12 ativações',
                },
                {
                  name: 'YouTube',
                  icon: <Youtube className="size-5 text-[#FF0000]" />,
                  count: '8 vídeos',
                },
                {
                  name: 'Instagram',
                  icon: <Instagram className="size-5 text-[#E4405F]" />,
                  count: '24 cortes',
                },
                {
                  name: 'RSS Feed',
                  icon: <Radio className="size-5 text-[#FFA500]" />,
                  count: 'PodcastAds XML',
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-fd-border bg-fd-accent/30 hover:bg-fd-accent/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {p.icon}
                    <span className="font-bold text-sm text-fd-foreground">
                      {p.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-fd-muted-foreground">
                    {p.count}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative w-full max-w-[400px] mt-2">
              <input
                className="w-full bg-background border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none transition-colors"
                placeholder="Pesquisar por episódio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
            </div>

            {/* List */}
            <div className="grid gap-4 mt-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl border border-fd-border bg-fd-accent animate-pulse"
                  />
                ))
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-fd-border rounded-xl text-[#74748D]">
                  Nenhum episódio disponível para publicação.
                </div>
              ) : (
                filtered.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-fd-border bg-white dark:bg-[#121212] hover:border-fd-primary/50 transition-all gap-4"
                  >
                    <div className="flex gap-4 items-start min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-fd-primary/10 flex items-center justify-center shrink-0 border border-fd-border">
                        <Radio className="size-6 text-fd-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-fd-foreground truncate">
                          {ep.title}
                        </h3>
                        <p className="text-xs text-fd-muted-foreground line-clamp-1 mt-0.5">
                          {ep.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-medium text-fd-muted-foreground uppercase flex items-center gap-1">
                            <Clock className="size-3" />{' '}
                            {new Date(ep.createdAt).toLocaleDateString()}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full',
                              ep.status === 'Publicado'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                            )}
                          >
                            {ep.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Status Grid */}
                      <div className="flex items-center gap-4">
                        <TooltipRefined note="Spotify">
                          <div
                            className={cn(
                              'p-1.5 rounded-full border',
                              ep.platforms.includes('Spotify')
                                ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800'
                                : 'bg-fd-accent border-fd-border text-fd-muted-foreground opacity-30',
                            )}
                          >
                            <Music className="size-4" />
                          </div>
                        </TooltipRefined>
                        <TooltipRefined note="YouTube">
                          <div
                            className={cn(
                              'p-1.5 rounded-full border',
                              ep.platforms.includes('YouTube')
                                ? 'bg-red-100 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800'
                                : 'bg-fd-accent border-fd-border text-fd-muted-foreground opacity-30',
                            )}
                          >
                            <Youtube className="size-4" />
                          </div>
                        </TooltipRefined>
                        <TooltipRefined note="Instagram">
                          <div
                            className={cn(
                              'p-1.5 rounded-full border',
                              ep.platforms.includes('Instagram')
                                ? 'bg-pink-100 border-pink-200 text-pink-600 dark:bg-pink-900/20 dark:border-pink-800'
                                : 'bg-fd-accent border-fd-border text-fd-muted-foreground opacity-30',
                            )}
                          >
                            <Instagram className="size-4" />
                          </div>
                        </TooltipRefined>
                      </div>

                      <div className="h-10 w-px bg-fd-border hidden md:block" />

                      <button className="flex items-center gap-2 px-4 py-2 bg-fd-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                        {ep.status === 'Publicado'
                          ? 'Re-publicar'
                          : 'Publicar Agora'}
                      </button>

                      <button className="p-2 hover:bg-fd-accent rounded-lg transition-colors">
                        <MoreHorizontal className="size-5 text-fd-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Simple Tooltip component if not available globally
function TooltipRefined({
  children,
  note,
}: {
  children: React.ReactNode;
  note: string;
}) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {note}
      </div>
    </div>
  );
}
