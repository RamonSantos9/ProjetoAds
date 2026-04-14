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
import { EmptyEpisodesState } from '@/components/dashboard/EmptyEpisodesState';
import { cn } from '@/lib/cn';
import { Episode } from '@/lib/db';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';

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
  realStatus: string;
  scheduledAt?: string | null;
  ownerId?: string | null;
}

export default function TranscricoesAdminPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const userRole = (session?.user as any)?.role;
  const isElevated = userRole === 'ADMIN' || userRole === 'PROFESSOR';
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [activeTab, setActiveTab] = useState<'biblioteca' | 'calendario'>('biblioteca');
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
            author: ep.ownerName || 'Ramon Santos',
            lastEdited: ep.updatedAt || ep.createdAt || new Date().toISOString(),
            status: (ep.status === 'Publicado'
              ? 'Finalizado'
              : 'Em Pauta') as ScriptStatus,
            version: '1.2',
            transcriptionText: ep.transcriptionText || '',
            realStatus: ep.status,
            scheduledAt: ep.scheduledAt,
            ownerId: ep.ownerId
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

  const filtered = scripts.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'biblioteca') {
       // Only show Production/Published (not Scheduled)
       return matchesSearch && s.realStatus !== 'Agendado';
    } else {
       // Only show Scheduled in the Calendar tab
       return matchesSearch && s.realStatus === 'Agendado';
    }
  });

  const handleMoveToProduction = async (script: ScriptItem) => {
    if (!script.episodeId) return;
    try {
      const res = await fetch(`/api/episodes/${script.episodeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Produção', scheduledAt: null })
      });
      if (res.ok) {
        // Update local state
        setScripts(prev => prev.map(s => s.id === script.id ? { ...s, realStatus: 'Produção', scheduledAt: null } : s));
        toast.success(`"${script.title}" movido para Produção!`);
      }
    } catch (err) {
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background transition-colors duration-300">
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-5 pt-8 pb-20 lg:pb-12 text-fd-foreground">
        
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Transcrições
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle mode="light-dark" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <button className="group relative flex flex-col md:flex-row md:items-center gap-3 p-3 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl text-left transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-px">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-80" />
               <Plus className="relative z-10 size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Transcrição Inteligente</p>
              <p className="text-xs text-muted-foreground">Crie um novo projeto usando IA para converter áudio em texto.</p>
            </div>
          </button>

          <button className="group relative flex flex-col md:flex-row md:items-center gap-3 p-3 bg-[#FFFFFF] dark:bg-[#121212] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl text-left transition-all hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-px">
            <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-pink-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 opacity-80" />
               <Upload className="relative z-10 size-4 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Exportar Legendas (SRT)</p>
              <p className="text-xs text-muted-foreground">Converta sua transcrição finalizada em legendas profissionais.</p>
            </div>
          </button>
        </div>

        <div className="flex gap-1 border-b border-[#E2E7F1] dark:border-[#2A2A38] mb-6">
          <button
            onClick={() => setActiveTab('biblioteca')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative",
              activeTab === 'biblioteca' ? "text-fd-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Biblioteca
            {activeTab === 'biblioteca' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fd-primary animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('calendario')}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all relative",
              activeTab === 'calendario' ? "text-fd-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Calendário
            {activeTab === 'calendario' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-fd-primary animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {activeTab === 'biblioteca' ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar transcrições e falas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 bg-[#f6f8fa] dark:bg-[#1F2122] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-fd-primary transition-all"
                  />
                </div>

                <div className="flex items-center border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl p-0.5 bg-[#f6f8fa] dark:bg-[#1F2122]">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-lg transition-colors", viewMode === 'grid' ? "bg-white dark:bg-[#2A2A38] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-lg transition-colors", viewMode === 'list' ? "bg-white dark:bg-[#2A2A38] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="bg-white dark:bg-[#121212] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Agendamentos</h3>
                      <p className="text-sm text-muted-foreground">Episódios programados para lançamento futuro.</p>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="w-full mt-4">
                      <EmptyEpisodesState />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map(script => (
                        <div key={script.id} className="group relative bg-white dark:bg-[#1A1A1A] border border-[#E2E7F1] dark:border-[#2A2A38] rounded-xl p-4 transition-all hover:shadow-md hover:border-amber-500/30">
                           <div className="flex items-start justify-between mb-3">
                              <Badge variant="purple" className="text-[10px] font-bold uppercase tracking-wider">
                                 Agendado
                              </Badge>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                 {script.scheduledAt ? new Date(script.scheduledAt).toLocaleDateString() : 'Sem data'}
                              </span>
                           </div>
                           <h4 className="font-semibold text-sm mb-1 truncate">{script.title}</h4>
                           <p className="text-[11px] text-muted-foreground mb-4 line-clamp-1 italic">
                              "{script.transcriptionText?.slice(0, 60)}..."
                           </p>
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleMoveToProduction(script)}
                                disabled={!isElevated && (!!currentUserId ? script.ownerId !== currentUserId : true)}
                                className="flex-1 px-3 py-1.5 bg-fd-primary/10 text-fd-primary hover:bg-fd-primary hover:text-white rounded-lg text-[11px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Mover para Produção
                              </button>
                               { (isElevated || (!!currentUserId && script.ownerId === currentUserId)) && (
                                 <button 
                                   onClick={() => router.push(`/admin/transcricoes/${script.id}`)}
                                   className="px-3 py-1.5 border border-[#E2E7F1] dark:border-[#2A2A38] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-[11px] font-medium transition-all"
                                 >
                                   Editar
                                 </button>
                               )}
                             </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          )}

          <div className="w-full min-w-full transition-opacity duration-300 opacity-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-[16/11] bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))
              ) : filtered.length === 0 ? (
                <div className="col-span-full w-full">
                  <EmptyEpisodesState />
                </div>
              ) : (
                filtered.map((script) => (
                   <div 
                     key={script.id} 
                     className="block cursor-pointer" 
                     onClick={() => {
                       if (isElevated || script.ownerId === currentUserId) {
                         router.push(`/admin/transcricoes/${script.id}`);
                       } else {
                         handleOpenDetails(script);
                       }
                     }}
                   >
                     <div className="flex w-full flex-col group">
                      <div className="relative flex w-full flex-col rounded-2xl transition-all duration-150 border border-[#E2E7F1] dark:border-[#2A2A38] hover:border-black/20 dark:hover:border-white/20 bg-white dark:bg-[#121212]">
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
                              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring disabled:pointer-events-auto border border-[#E2E7F1] dark:border-[#2A2A38] shadow-none disabled:bg-background rounded-[10px] center p-0 h-9 w-9 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#121212] transition-colors duration-75 hover:bg-gray-50 dark:hover:bg-white/5"
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
                                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring disabled:pointer-events-auto border border-[#E2E7F1] dark:border-[#2A2A38] shadow-none disabled:bg-background rounded-[10px] center p-0 h-9 w-9 text-gray-500 dark:text-gray-400 bg-white dark:bg-[#121212] transition-colors duration-75 hover:bg-gray-50 dark:hover:bg-white/5"
                                >
                                  <Ellipsis className="shrink-0 w-[18px] h-[18px]" />
                                </button>
                              </DropdownMenu.Trigger>

                              <DropdownMenu.Portal>
                                <DropdownMenu.Content 
                                  align="end" 
                                  sideOffset={5}
                                  className="z-50 bg-white dark:bg-[#121212] text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 p-1 rounded-[10px] min-w-[8rem] flex flex-col outline-none border border-[#E2E7F1] dark:border-[#2A2A38] shadow-lg"
                                >
                                  <DropdownMenu.Item onSelect={() => handleOpenDetails(script)} className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <Info className="shrink-0 w-4 h-4 opacity-70" />
                                      <span>Detalhes do projeto</span>
                                    </div>
                                  </DropdownMenu.Item>

                                  {(isElevated || (!!currentUserId && script.ownerId === currentUserId)) && (
                                     <DropdownMenu.Item onSelect={() => router.push(`/admin/transcricoes/${script.id}`)} className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-white/10 focus:bg-gray-100 dark:focus:bg-white/10 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/10 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2">
                                       <div className="flex items-center gap-2">
                                         <LogIn className="shrink-0 w-4 h-4 opacity-70" />
                                         <span>Abrir no Editor</span>
                                       </div>
                                     </DropdownMenu.Item>
                                   )}
                                  
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
                                  
                                  { (isElevated || (!!currentUserId && script.ownerId === currentUserId)) && (
                                    <>
                                      <DropdownMenu.Separator className="h-px bg-[#E2E7F1] dark:bg-[#2A2A38] my-1" />
                                      
                                      <DropdownMenu.Item className="relative transition-colors focus:text-foreground w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer select-none outline-none hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 px-2 py-1.5 text-sm rounded-lg inline-flex justify-between items-center gap-2 text-red-600 focus:text-red-700">
                                        <div className="flex items-center gap-2">
                                          <Trash className="shrink-0 w-4 h-4 opacity-70" />
                                          <span>Excluir</span>
                                        </div>
                                      </DropdownMenu.Item>
                                    </>
                                  )}
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
