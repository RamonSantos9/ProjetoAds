'use client';

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Search, 
  Plus, 
  Grid, 
  List, 
  Download, 
  Maximize2, 
  Filter, 
  Layout, 
  Instagram, 
  Youtube, 
  Facebook,
  MoreVertical,
  Type,
  Palette
} from 'lucide-react';
import { 
  ActionButtonRefined, 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { Episode } from '@/lib/db';

type AssetType = 'Thumbnail' | 'Social Post' | 'Banner' | 'Story';

interface VisualAsset {
  id: string;
  episodeId?: string;
  title: string;
  type: AssetType;
  url: string;
  createdAt: string;
}

export default function MidiasAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [assets, setAssets] = useState<VisualAsset[]>([]);
  const [filterType, setFilterType] = useState<AssetType | 'Todos'>('Todos');

  useEffect(() => {
    // Simulando carregamento de assets visuais baseados nos episódios
    async function loadData() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const episodes: Episode[] = await res.json();
          const derivedAssets: VisualAsset[] = [];
          
          episodes.forEach(ep => {
              // Mocking a few assets for each episode
              derivedAssets.push({
                id: `ast-t-${ep.id}`,
                episodeId: ep.id,
                title: `Thumbnail: ${ep.title}`,
                type: 'Thumbnail',
                url: `https://picsum.photos/seed/${ep.id}/800/450`,
                createdAt: ep.createdAt
              });
              derivedAssets.push({
                id: `ast-s-${ep.id}`,
                episodeId: ep.id,
                title: `Post Instagram: ${ep.title}`,
                type: 'Social Post',
                url: `https://picsum.photos/seed/${ep.id}-insta/1080/1080`,
                createdAt: ep.createdAt
              });
          });
          setAssets(derivedAssets);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = assets.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'Todos' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: AssetType) => {
    switch (type) {
      case 'Thumbnail': return <Youtube className="size-4 text-red-500" />;
      case 'Social Post': return <Instagram className="size-4 text-pink-500" />;
      case 'Banner': return <Layout className="size-4 text-blue-500" />;
      case 'Story': return <Type className="size-4 text-purple-500" />;
      default: return <ImageIcon className="size-4" />;
    }
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Ativos
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Mídias Visuais
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Gerencie todos os elementos visuais da identidade do seu podcast. Capas automáticas, artes para redes sociais e apresentações.
              </p>
              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-fd-accent text-fd-foreground rounded-lg text-sm font-bold border border-fd-border hover:bg-fd-accent/80 transition-all">
                    <Palette className="size-4 text-fd-primary" /> Gerador de Capas
                 </button>
                 <ActionButtonRefined 
                   label="Upload Asset" 
                   icon={<Plus className="size-5" />}
                   onClick={() => alert('Escolha um arquivo para upload...')}
                 />
              </div>
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-[300px]">
                  <input
                    className="w-full bg-background border border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground focus:outline-none"
                    placeholder="Pesquisar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
                </div>
                
                <select 
                   className="bg-background border border-fd-border rounded-lg px-3 py-2 text-sm text-fd-foreground focus:outline-none hidden sm:block"
                   value={filterType}
                   onChange={(e) => setFilterType(e.target.value as any)}
                >
                   <option value="Todos">Todos os tipos</option>
                   <option value="Thumbnail">Thumbnails</option>
                   <option value="Social Post">Instagram Posts</option>
                   <option value="Banner">Banners</option>
                   <option value="Story">Stories</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-fd-accent/30 p-1 rounded-lg border border-fd-border self-end md:self-auto">
                 <button 
                   onClick={() => setView('grid')}
                   className={cn("p-1.5 rounded-md transition-all", view === 'grid' ? "bg-white dark:bg-[#1A1A1A] text-fd-primary shadow-sm" : "text-fd-muted-foreground")}
                 >
                    <Grid className="size-4" />
                 </button>
                 <button 
                   onClick={() => setView('list')}
                   className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-white dark:bg-[#1A1A1A] text-fd-primary shadow-sm" : "text-fd-muted-foreground")}
                 >
                    <List className="size-4" />
                 </button>
              </div>
            </div>

            {/* Gallery / List */}
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl bg-fd-accent animate-pulse" />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="col-span-full py-24 text-center text-fd-muted-foreground border-2 border-dashed border-fd-border rounded-2xl">
                    Nenhum asset visual encontrado.
                  </div>
                ) : (
                  filtered.map(asset => (
                    <div key={asset.id} className="group relative flex flex-col bg-white dark:bg-[#121212] border border-fd-border rounded-2xl overflow-hidden hover:border-fd-primary/50 transition-all">
                       <div className="aspect-video relative overflow-hidden bg-fd-accent">
                          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button className="p-2 bg-white rounded-full text-black hover:bg-fd-primary hover:text-white transition-colors">
                                <Maximize2 className="size-4" />
                             </button>
                             <button className="p-2 bg-white rounded-full text-black hover:bg-fd-primary hover:text-white transition-colors">
                                <Download className="size-4" />
                             </button>
                          </div>
                          <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded-md text-[9px] font-bold text-white backdrop-blur-sm flex items-center gap-1.5 uppercase">
                             {getTypeIcon(asset.type)} {asset.type}
                          </div>
                       </div>
                       <div className="p-4 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="text-xs font-bold text-fd-foreground line-clamp-1 group-hover:text-fd-primary transition-colors">{asset.title}</h3>
                            <p className="text-[10px] text-fd-muted-foreground mt-1 uppercase tracking-tight font-medium">{new Date(asset.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                 {/* List view implementation simplified */}
                 {filtered.map(asset => (
                   <div key={asset.id} className="flex items-center justify-between p-3 border-b border-fd-border hover:bg-fd-accent/30 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-8 rounded bg-fd-accent overflow-hidden">
                            <img src={asset.url} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-fd-foreground">{asset.title}</p>
                            <p className="text-[10px] text-fd-muted-foreground">{asset.type} • {new Date(asset.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-1">
                         <button className="p-2 hover:bg-fd-accent rounded text-fd-muted-foreground"><Download className="size-4" /></button>
                         <button className="p-2 hover:bg-fd-accent rounded text-fd-muted-foreground"><MoreVertical className="size-4" /></button>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
