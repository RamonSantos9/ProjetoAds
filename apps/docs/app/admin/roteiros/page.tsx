'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit3, 
  Eye, 
  History, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  MoreVertical,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ActionButtonRefined, 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { Episode } from '@/lib/db';

type ScriptStatus = 'Em Pauta' | 'Em Redação' | 'Revisão' | 'Finalizado';

interface ScriptItem {
  id: string;
  episodeId?: string;
  title: string;
  author: string;
  lastEdited: string;
  status: ScriptStatus;
  version: string;
}

export default function RoteirosAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  useEffect(() => {
    // Simulando carregamento de roteiros vinculados a episódios
    async function loadData() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const episodes: Episode[] = await res.json();
          const derivedScripts = episodes.map(ep => ({
            id: `scr-${ep.id}`,
            episodeId: ep.id,
            title: ep.title,
            author: 'Sistema (Auto)',
            lastEdited: ep.createdAt,
            status: (ep.status === 'Publicado' ? 'Finalizado' : 'Em Pauta') as ScriptStatus,
            version: '1.2'
          }));
          setScripts(derivedScripts);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = scripts.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: ScriptStatus) => {
    switch (status) {
      case 'Finalizado': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Revisão': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Em Redação': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      default: return 'text-fd-muted-foreground bg-fd-accent border-fd-border';
    }
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Pré-Produção
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Roteiros & Pautas
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Crie, edite e revise os roteiros dos seus episódios. Use o <strong>AI Assistant</strong> para gerar sugestões de perguntas e tópicos baseados no perfil do convidado.
              </p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-fd-accent text-fd-foreground rounded-lg text-sm font-bold border border-fd-border hover:bg-fd-accent/80 transition-all">
                   <Sparkles className="size-4 text-fd-primary" /> Sugestão IA
                </button>
                <ActionButtonRefined 
                  label="Nova Pauta" 
                  icon={<Plus className="size-5" />}
                  onClick={() => alert('Abrindo editor de roteiro...')}
                />
              </div>
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Stats */}
            <div className="flex items-center gap-8 py-2 overflow-x-auto no-scrollbar">
                <div className="flex flex-col">
                   <span className="text-2xl font-bold text-fd-foreground">{scripts.length}</span>
                   <span className="text-[10px] text-fd-muted-foreground uppercase tracking-wider font-bold">Total Doc.</span>
                </div>
                <div className="w-px h-8 bg-fd-border" />
                <div className="flex flex-col">
                   <span className="text-2xl font-bold text-orange-500">{scripts.filter(s => s.status === 'Em Redação').length || 0}</span>
                   <span className="text-[10px] text-fd-muted-foreground uppercase tracking-wider font-bold">Em Redação</span>
                </div>
                <div className="w-px h-8 bg-fd-border" />
                <div className="flex flex-col">
                   <span className="text-2xl font-bold text-blue-500">{scripts.filter(s => s.status === 'Revisão').length || 0}</span>
                   <span className="text-[10px] text-fd-muted-foreground uppercase tracking-wider font-bold">Revisão</span>
                </div>
            </div>

            <div className="relative w-full max-w-[400px]">
              <input
                className="w-full bg-background border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none transition-colors"
                placeholder="Buscar por título do episódio ou autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
            </div>

            {/* Document List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
               {loading ? (
                 Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="h-48 rounded-xl border border-fd-border bg-fd-accent animate-pulse" />
                 ))
               ) : filtered.length === 0 ? (
                 <div className="col-span-full py-20 text-center border-2 border-dashed border-fd-border rounded-2xl text-fd-muted-foreground">
                    Nenhum roteiro encontrado. Comece criando uma nova pauta.
                 </div>
               ) : (
                 filtered.map(script => (
                   <div key={script.id} className="group relative bg-white dark:bg-[#121212] border border-fd-border rounded-2xl p-5 hover:border-fd-primary/40 hover:shadow-lg transition-all flex flex-col overflow-hidden">
                      {/* Paper Background Decoration */}
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <FileText className="size-16" />
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                          getStatusColor(script.status)
                        )}>
                          {script.status}
                        </span>
                        <button className="p-1 text-fd-muted-foreground hover:bg-fd-accent rounded">
                           <MoreVertical className="size-4" />
                        </button>
                      </div>

                      <h3 className="font-bold text-fd-foreground mb-1 line-clamp-2 pr-8">{script.title}</h3>
                      <p className="text-[10px] text-fd-muted-foreground mb-6 italic">Autor: {script.author} • v{script.version}</p>

                      <div className="mt-auto pt-4 border-t border-fd-border flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-[9px] text-fd-muted-foreground uppercase font-bold tracking-tight">Última edição</span>
                            <span className="text-[11px] font-medium text-fd-foreground">{new Date(script.lastEdited).toLocaleDateString()}</span>
                         </div>
                         <div className="flex gap-2">
                            <button className="p-2 bg-fd-accent hover:bg-fd-primary/10 hover:text-fd-primary rounded-lg transition-colors text-fd-foreground">
                               <Eye className="size-4" />
                            </button>
                            <button className="p-2 bg-fd-primary text-white rounded-lg hover:shadow-md transition-all">
                               <Edit3 className="size-4" />
                            </button>
                         </div>
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
