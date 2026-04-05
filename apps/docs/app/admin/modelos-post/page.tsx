'use client';

import React, { useState } from 'react';
import { 
  TemplatesIcon 
} from '@/app/(home)/_components/podcast-dashboard/PodcastSidebar';
import { 
  Search, 
  Plus, 
  Copy, 
  Edit3, 
  ExternalLink, 
  Instagram, 
  Youtube, 
  Layout,
  Star,
  Check
} from 'lucide-react';
import { 
  ActionButtonRefined, 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

interface PostTemplate {
  id: string;
  name: string;
  platform: 'Instagram' | 'YouTube' | 'TikTok';
  type: 'Feed' | 'Story' | 'Shorts';
  preview: string;
  favorite?: boolean;
}

export default function ModelosPostAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [search, setSearch] = useState('');
  
  const templates: PostTemplate[] = [
    { id: 't1', name: 'Citação do Convidado', platform: 'Instagram', type: 'Feed', preview: 'https://picsum.photos/seed/t1/400/400', favorite: true },
    { id: 't2', name: 'Alerta de Episódio Novo', platform: 'Instagram', type: 'Story', preview: 'https://picsum.photos/seed/t2/400/711' },
    { id: 't3', name: 'Destaque YouTube Thumb', platform: 'YouTube', type: 'Feed', preview: 'https://picsum.photos/seed/t3/400/225', favorite: true },
    { id: 't4', name: 'Corte Rápido (Snippet)', platform: 'TikTok', type: 'Shorts', preview: 'https://picsum.photos/seed/t4/400/711' },
    { id: 't5', name: 'Carrossel Educativo', platform: 'Instagram', type: 'Feed', preview: 'https://picsum.photos/seed/t5/400/400' },
    { id: 't6', name: 'Bastidores / Equipe', platform: 'Instagram', type: 'Story', preview: 'https://picsum.photos/seed/t6/400/711' },
  ];

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Design
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Modelos de Post
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Acelere sua criação de conteúdo com templates pré-configurados. Basta selecionar um modelo e vincular o episódio desejado para gerar artes automaticamente.
              </p>
              <ActionButtonRefined 
                label="Criar Template" 
                icon={<Plus className="size-5" />}
                onClick={() => alert('Abrindo Editor de Templates...')}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            <div className="relative w-full max-w-[400px]">
              <input
                className="w-full bg-background border border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground focus:outline-none"
                placeholder="Filtrar por nome ou plataforma..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
               {filtered.map(template => (
                 <div key={template.id} className="group flex flex-col gap-4">
                    <div className="relative aspect-[4/3] rounded-2xl border border-fd-border bg-fd-accent overflow-hidden shadow-sm transition-all group-hover:shadow-xl group-hover:border-fd-primary/30">
                       <img src={template.preview} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button className="h-9 px-4 bg-white text-black rounded-full text-xs font-bold hover:bg-fd-primary hover:text-white transition-all flex items-center gap-2">
                             <Copy className="size-3.5" /> Usar Modelo
                          </button>
                          <button className="size-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                             <Edit3 className="size-4" />
                          </button>
                       </div>

                       <div className="absolute top-4 left-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[9px] font-bold text-white flex items-center gap-1.5 backdrop-blur-md shadow-sm",
                            template.platform === 'Instagram' ? "bg-pink-600/80" : 
                            template.platform === 'YouTube' ? "bg-red-600/80" : "bg-black/80"
                          )}>
                             {template.platform === 'Instagram' && <Instagram className="size-3" />}
                             {template.platform === 'YouTube' && <Youtube className="size-3" />}
                             {template.platform} {template.type}
                          </span>
                       </div>

                       {template.favorite && (
                         <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                            <Star className="size-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                         </div>
                       )}
                    </div>

                    <div className="flex justify-between items-start px-1">
                       <div>
                          <h3 className="text-sm font-bold text-fd-foreground group-hover:text-fd-primary transition-colors">{template.name}</h3>
                          <p className="text-[10px] text-fd-muted-foreground mt-0.5">Editado há 2 dias</p>
                       </div>
                       <button className="p-1 text-fd-muted-foreground hover:text-fd-foreground">
                          <ExternalLink className="size-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
