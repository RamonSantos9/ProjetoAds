'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  User,
  Upload,
  Book,
  Info,
  Ellipsis,
  X,
  ArrowUpRight,
  LogIn,
  Share,
  CopyPlus,
  Trash,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ShareProjectModal } from './_components/ShareProjectModal';
import { ProjectDetailsModal } from './_components/ProjectDetailsModal';
import { cn } from '@/lib/cn';
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
  transcriptionText?: string;
}

export default function TranscricoesAdminPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [activeTab, setActiveTab] = useState('biblioteca');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ScriptItem | null>(null);
  const router = useRouter();

  const handleShare = (script: ScriptItem) => {
    setSelectedScript(script);
    setIsShareModalOpen(true);
  };

  const handleOpenDetails = (script: ScriptItem) => {
    setSelectedScript(script);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const episodes: Episode[] = await res.json();
          const derivedScripts = episodes.map((ep) => ({
            id: `scr-${ep.id}`,
            episodeId: ep.id,
            title: ep.title,
            author: 'Ramon (eu)',
            lastEdited: ep.createdAt || new Date().toISOString(),
            status: (ep.status === 'Publicado'
              ? 'Finalizado'
              : 'Em Pauta') as ScriptStatus,
            version: '1.2',
            transcriptionText: ep.transcriptionText || '',
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

  const filtered = scripts.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = [
    { id: 'biblioteca', label: 'Biblioteca' },
    { id: 'modelos', label: 'Modelos' },
    { id: 'estatisticas', label: 'Estatísticas' },
    { id: 'recursos', label: 'Recursos' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-5 pt-8 pb-20 lg:pb-12">
        
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Transcrições
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <User className="size-[18px] text-foreground" />
            </button>
            <button className="relative inline-flex items-center justify-center gap-1.5 px-3 h-9 text-sm font-medium transition-all bg-black dark:bg-white text-white dark:text-black border hover:opacity-70 shadow-none rounded-[10px] active:scale-[0.98]">
              <Plus className="size-[18px] stroke-[2.5]" />
              Nova Transcrição
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <button className="group relative flex flex-col md:flex-row md:items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl text-left transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-px">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-80" />
               <Plus className="relative z-10 size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Gerar Transcrição</p>
              <p className="text-xs text-muted-foreground">Converta áudio em texto com alta precisão usando IA.</p>
            </div>
          </button>

          <button className="group relative flex flex-col md:flex-row md:items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl text-left transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-px">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-pink-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 opacity-80" />
               <Upload className="relative z-10 size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Exportar Legendas</p>
              <p className="text-xs text-muted-foreground">Gere arquivos SRT ou VTT para seus episódios publicados.</p>
            </div>
          </button>
        </div>

        <div className={cn("flex flex-col gap-6", activeTab !== 'biblioteca' && "opacity-50 pointer-events-none")}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar transcrições e falas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground transition-all"
                />
              </div>

              <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-xl p-0.5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-gray-100 dark:bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-2 rounded-lg transition-colors", viewMode === 'list' ? "bg-gray-100 dark:bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full min-w-full transition-opacity duration-300 opacity-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-[16/11] bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                  Nenhuma transcrição encontrada.
                </div>
              ) : (
                filtered.map((script) => (
                  <div 
                    key={script.id} 
                    className="block cursor-pointer" 
                    onClick={() => router.push(`/admin/transcricoes/${script.id}`)}
                  >
                    <div className="flex w-full flex-col group">
                      <div className="relative flex w-full flex-col rounded-2xl transition-all duration-150 border hover:border-black/20">
                        <div className="flex transition-all duration-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 md:[&:has([data-state='open'])]:opacity-100 items-center justify-end gap-1.5 absolute top-3 right-3 z-20">
                          <div className="flex items-center gap-1">
                            <button 
                              aria-label="Detalhes do projeto" 
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenDetails(script);
                              }}
                              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent border shadow-none disabled:bg-background rounded-[10px] center p-0 h-9 w-9 text-gray-500 dark:text-gray-600 bg-white dark:bg-black transition-colors duration-75"
                            >
                              <Info className="shrink-0 w-[18px] h-[18px]" />
                            </button>
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger asChild>
                                <button 
                                  aria-label="Mais opções" 
                                  type="button" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent border shadow-none disabled:bg-background rounded-[10px] center p-0 h-9 w-9 text-gray-500 dark:text-gray-600 bg-white dark:bg-black transition-colors duration-75"
                                >
                                  <Ellipsis className="shrink-0 w-[18px] h-[18px]" />
                                </button>
                              </DropdownMenu.Trigger>

                              <DropdownMenu.Portal>
                                <DropdownMenu.Content 
                                  align="end" 
                                  sideOffset={5}
                                  className="z-50 bg-white dark:bg-black text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 p-1 rounded-[10px] min-w-[8rem] flex flex-col outline-none border"
                                >
                                  <DropdownMenu.Item onSelect={() => handleOpenDetails(script)} className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <Info className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Detalhes do projeto</span>
                                    </div>
                                  </DropdownMenu.Item>

                                  <DropdownMenu.Item onSelect={() => router.push(`/admin/transcricoes/${script.id}`)} className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <LogIn className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Abrir no Editor</span>
                                    </div>
                                  </DropdownMenu.Item>
                                  
                                  <DropdownMenu.Item onSelect={() => handleShare(script)} className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <Share className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Compartilhar</span>
                                    </div>
                                  </DropdownMenu.Item>
                                  
                                  <DropdownMenu.Item className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <CopyPlus className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Duplicar</span>
                                    </div>
                                  </DropdownMenu.Item>
                                  
                                  <DropdownMenu.Item className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2 text-red-600 focus:text-red-700">
                                    <div className="flex items-center gap-2">
                                      <Trash className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Excluir</span>
                                    </div>
                                  </DropdownMenu.Item>
                                </DropdownMenu.Content>
                              </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                          </div>
                        </div>

                        <div className="relative w-full aspect-[16/9] bg-gray-alpha-50 flex justify-center items-end overflow-hidden">
                          <div className="flex relative w-full h-full">
                            <div className="absolute inset-0" style={{ maskImage: 'linear-gradient(to top, transparent 0px, black 20%, black 100%)' }}>
                              <div className="absolute flex justify-center items-end w-full h-full top-8">
                                <div 
                                  className="absolute w-[60%] h-full overflow-hidden rounded-t-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu translate-y-0 rotate-0 group-hover:-translate-y-4 group-hover:-rotate-3 group-hover:scale-[1.02]" 
                                  style={{ 
                                    zIndex: 1,
                                    boxShadow: '0 0px 0px 1px rgba(0, 0, 0, 0.06), 0 1px 1px -0.5px rgba(0, 0, 0, 0.06), 0 3px 3px -1.5px rgba(0, 0, 0, 0.06), 0 6px 6px -3px rgba(0, 0, 0, 0.06), 0 12px 12px -6px rgba(0, 0, 0, 0.04), 0 24px 24px -12px rgba(0, 0, 0, 0.04)'
                                  }}
                                >
                                  <div className="flex justify-center items-center h-full w-full">
                                    <div className="w-full h-full bg-background dark:bg-gray-200 py-3 px-3.5 flex flex-col relative text-foreground text-xs !select-none">
                                      <div className="flex w-full h-full flex-col font-medium" style={{ maskImage: 'linear-gradient(to top, transparent 0px, black 40%, black 100%)' }}>
                                        <h3 className="text-[11px] font-semibold shrink-0 mb-1.5 line-clamp-1 truncate">{script.title}</h3>
                                        {script.transcriptionText && (
                                          <div className="text-[9px] text-gray-600 dark:text-gray-600 overflow-hidden break-words whitespace-pre-wrap leading-tight mt-2">
                                            {script.transcriptionText.split('\n').map((line, idx) => (
                                              <span key={idx} className="block mb-1">{line}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="absolute bottom-4 z-20 w-full flex justify-center">
                              <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 rounded-xl text-[11px] select-none shadow-sm">
                                <span className="flex items-center gap-1.5 text-[12px]">
                                  <span className={`block h-2 w-2 shrink-0 rounded-full ${script.status === 'Finalizado' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  {script.status === 'Finalizado' ? 'Publicado' : 'Rascunho'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 flex gap-2 w-full">
                        <div className="h-6 flex justify-center items-center">
                          <Book className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1 mt-0.5 w-full overflow-hidden">
                          <div className="flex items-center gap-1 w-full">
                            <p className="text-foreground font-medium truncate text-sm">{script.title}</p>
                            <div className="flex-1"></div>
                          </div>
                          <p className="text-xs text-muted-foreground font-normal truncate flex items-center gap-1 h-4 min-w-0" style={{ color: 'var(--gray-alpha-500)' }}>
                            Criado em <span>{new Date(script.lastEdited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="font-bold hidden lg:inline">·</span>
                            <span className="truncate">
                              <span className="hidden lg:inline">{script.author.split(' ')[0]}</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareProjectModal 
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        scriptTitle={selectedScript?.title}
      />

      <ProjectDetailsModal 
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        project={selectedScript ? {
          title: selectedScript.title,
          lastEdited: new Date(selectedScript.lastEdited).getTime(),
          author: selectedScript.author
        } : undefined}
      />
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 px-1 py-0.5 h-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 text-[11px] font-medium text-foreground hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
      <div className="w-4 h-4 flex items-center justify-center">
        <Plus className="size-3 text-muted-foreground" />
      </div>
      <span className="pr-1.5">{label}</span>
    </button>
  );
}
