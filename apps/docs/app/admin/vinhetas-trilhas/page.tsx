'use client';

import React, { useState } from 'react';
import { 
  Music, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Clock, 
  Tag,
  MoreVertical,
  SkipBack,
  SkipForward,
  Mic2,
  Radio
} from 'lucide-react';
import { 
  ActionButtonRefined, 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

interface SoundAsset {
  id: string;
  title: string;
  type: 'Vinheta' | 'Trilha' | 'Efeito' | 'Voz';
  duration: string;
  url: string;
  tags: string[];
}

export default function VinhetasAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const sounds: SoundAsset[] = [
    { id: 's1', title: 'Intro PodcastAds Principal', type: 'Vinheta', duration: '0:15', url: '#', tags: ['Moderno', 'Abertura'] },
    { id: 's2', title: 'Background Lo-Fi Soft', type: 'Trilha', duration: '2:45', url: '#', tags: ['Entrevista', 'Fundo'] },
    { id: 's3', title: 'Efeito Transição Digital', type: 'Efeito', duration: '0:03', url: '#', tags: ['Corte', 'Rápido'] },
    { id: 's4', title: 'Outro Encerramento Padrão', type: 'Vinheta', duration: '0:20', url: '#', tags: ['Finalização'] },
    { id: 's5', title: 'Trilha Inspiração Tech', type: 'Trilha', duration: '3:10', url: '#', tags: ['Enérgico'] },
  ];

  const filtered = sounds.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.type.toLowerCase().includes(search.toLowerCase())
  );

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
              Vinhetas & Trilhas
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Biblioteca de áudio dedicada à sonorização dos seus episódios. Organize trilhas brancas, efeitos sonoros (SFX) e identidades vocais.
              </p>
              <ActionButtonRefined 
                label="Novo Áudio" 
                icon={<Plus className="size-5" />}
                onClick={() => alert('Selecione um arquivo .mp3 ou .wav para upload.')}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Quick Filter */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
               {['Todos', 'Vinhetas', 'Trilhas', 'Efeitos', 'Vozes'].map((cat) => (
                 <button key={cat} className="px-4 py-1.5 rounded-full border border-fd-border text-xs font-medium hover:bg-fd-accent transition-colors whitespace-nowrap">
                   {cat}
                 </button>
               ))}
            </div>

            <div className="relative w-full max-w-[400px]">
              <input
                className="w-full bg-background border border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground focus:outline-none"
                placeholder="Pesquisar áudio ou tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
            </div>

            {/* Audio List */}
            <div className="flex flex-col gap-3 mt-2">
               {loading ? (
                 Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="h-16 rounded-xl bg-fd-accent animate-pulse" />
                 ))
               ) : filtered.length === 0 ? (
                 <div className="py-20 text-center text-fd-muted-foreground border-2 border-dashed border-fd-border rounded-2xl">
                    Nenhum áudio encontrado.
                 </div>
               ) : (
                 filtered.map(sound => (
                   <div key={sound.id} className="group flex items-center justify-between p-4 rounded-xl border border-fd-border bg-white dark:bg-[#121212] hover:border-fd-primary/40 transition-all">
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setPlayingId(playingId === sound.id ? null : sound.id)}
                           className="w-10 h-10 rounded-full bg-fd-primary/10 flex items-center justify-center text-fd-primary hover:bg-fd-primary hover:text-white transition-all shadow-sm"
                         >
                           {playingId === sound.id ? <Pause className="size-5 fill-current" /> : <Play className="size-5 ml-0.5 fill-current" />}
                         </button>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-fd-foreground">{sound.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[9px] font-bold uppercase py-0.5 px-1.5 bg-fd-accent rounded text-fd-muted-foreground">{sound.type}</span>
                               <span className="text-[10px] text-fd-muted-foreground flex items-center gap-1"><Clock className="size-3" /> {sound.duration}</span>
                            </div>
                         </div>
                      </div>

                      <div className="hidden md:flex items-center gap-2">
                         {sound.tags.map(tag => (
                           <span key={tag} className="text-[10px] text-fd-muted-foreground border border-fd-border px-2 py-0.5 rounded-md italic">#{tag}</span>
                         ))}
                      </div>

                      <div className="flex items-center gap-2">
                         <button className="p-2 hover:bg-fd-accent rounded-lg text-fd-muted-foreground transition-colors">
                            <Download className="size-4" />
                         </button>
                         <button className="p-2 hover:bg-fd-accent rounded-lg text-fd-muted-foreground transition-colors">
                            <MoreVertical className="size-4" />
                         </button>
                      </div>
                   </div>
                 ))
               )}
            </div>

            {/* Minimal Player (Sticky Footer) */}
            {playingId && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-white dark:bg-[#1A1A1A] border border-fd-border rounded-2xl shadow-2xl p-4 flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="w-12 h-12 rounded-xl bg-fd-primary/20 flex items-center justify-center text-fd-primary shrink-0">
                    <Music className="size-6" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-fd-foreground truncate">{sounds.find(s => s.id === playingId)?.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] text-fd-muted-foreground">0:05</span>
                       <div className="flex-1 h-1 bg-fd-accent rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-fd-primary rounded-full" />
                       </div>
                       <span className="text-[10px] text-fd-muted-foreground">{sounds.find(s => s.id === playingId)?.duration}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 shrink-0">
                    <SkipBack className="size-4 text-fd-muted-foreground cursor-pointer hover:text-fd-foreground" />
                    <button onClick={() => setPlayingId(null)} className="w-8 h-8 rounded-full bg-fd-foreground dark:bg-white flex items-center justify-center text-background dark:text-gray-900">
                       <Pause className="size-4 fill-current" />
                    </button>
                    <SkipForward className="size-4 text-fd-muted-foreground cursor-pointer hover:text-fd-foreground" />
                    <div className="w-px h-6 bg-fd-border mx-1" />
                    <Volume2 className="size-4 text-fd-muted-foreground" />
                 </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
