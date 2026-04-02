'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

import { 
  Users, 
  Search, 
  ChevronRight, 
  Download,
  MoreVertical,
  User,
  Plus,
  Info,
  ExternalLink,
  HelpCircle,
  Bell,
  Sparkles
} from 'lucide-react';
import { CreateEpisodeModal, EpisodeFormData } from '@/components/dashboard/CreateEpisodeModal';
import { EditEpisodeModal, Episode } from '@/components/dashboard/EditEpisodeModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { featuredEpisodes as initialEpisodes } from '../../(home)/_data/episodes';

// --- Types ---

interface ReportRecord extends Episode {
  guest: string; 
  createdAt: string; 
  origin: string; 
}

// --- Local components synced with Design System ---

const ActionButtonRefined = ({
  label,
  onClick,
  icon,
  showIcon = true,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const variantStyles =
    variant === 'primary' 
      ? "bg-background text-background"
      : "bg-background text-background border-background"; 

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "leading-[24px] relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-5 border flex items-center justify-center gap-2 transition-all duration-200 rounded-lg h-8 px-3 w-full lg:w-auto text-sm",
        variantStyles,
        className
      )}
    >
      {showIcon && (icon || <Plus className="size-5" />)}
      {label}
    </button>
  );
};

const TooltipRefined = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="relative inline-block group">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-[#0A1B39] text-[11px] font-bold rounded-lg px-2 py-1.5 whitespace-nowrap shadow-lg border border-[#E2E7F1] text-center scale-95 group-hover:scale-100 origin-bottom">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
    </div>
  </div>
);

const BadgeRefined = ({ variant, children }: { variant: 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode }) => {
  const styles = {
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    error: "bg-red-500/10 text-red-600 border-red-500/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };
  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider", styles[variant])}>
      {children}
    </span>
  );
};

const toast = { success: (msg: string) => console.log('[toast]', msg) };

export default function RelatoriosPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReportRecord | null>(null);

  const [originFilter, setOriginFilter] = useState("Todas Origens");
  const [originOpen, setOriginOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  
  const originRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) setOriginOpen(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data: ReportRecord[] = initialEpisodes.map((ep, i) => ({
        ...ep,
        id: `ep-${i + 1}`,
        slug: ep.slug || `slug-${i}`,
        summary: ep.summary || '',
        category: ep.category || 'Geral',
        duration: ep.duration || '00:00',
        platforms: ep.platforms || [],
        guests: ep.guests || [],
        guest: ep.guests?.[0] || 'Convidado Externo',
        status: (ep.status as string) === 'Publicado' ? 'Publicado' : (i % 3 === 0 ? 'Agendado' : 'Produção'),
        creator: i % 2 === 0 ? 'Ramon Santos' : 'Ana Carolina',
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        origin: i % 4 === 0 ? 'Importado' : (i % 4 === 1 ? 'Agendado' : 'Manual')
      }));
      setReports(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = reports.filter(r => {
    const matchesSearch = 
      r.guest.toLowerCase().includes(search.toLowerCase()) || 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesOrigin = 
      originFilter === "Todas Origens" || 
      r.origin === originFilter;

    return matchesSearch && matchesOrigin;
  });

  const handleCreateSave = (newEp: EpisodeFormData) => {
    const newRecord: ReportRecord = {
      ...newEp,
      id: Math.random().toString(36).substring(7),
      guests: newEp.guests.split(',').filter(Boolean),
      platforms: newEp.platforms.split(',').filter(Boolean),
      guest: newEp.guests.split(',')[0] || 'Sem Convidado',
      status: newEp.status === 'Released' ? 'Publicado' : newEp.status,
      createdAt: new Date().toISOString(),
      origin: 'Manual'
    };
    setReports(prev => [newRecord, ...prev]);
  };

  const handleEditSave = (updated: Episode) => {
    setReports(prev => prev.map(r => r.id === updated.id ? {
      ...r,
      ...updated,
      guest: updated.guests[0] || 'Sem Convidado'
    } : r));
  };

  const handleExport = (ext: string) => {
     toast.success(`Exportação ${ext} iniciada!`);
     setExportOpen(false);
  };

  const stats = {
    totalGuests: Array.from(new Set(reports.map(r => r.guest))).length,
    pending: reports.filter(r => r.status === 'Produção' || r.status === 'Agendado').length,
    published: reports.filter(r => r.status === 'Publicado').length
  };

  return (
    <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-4 md:px-8 py-8 text-fd-foreground">
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8 flex flex-col">
          <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
            <div className="stack">
              <p className="truncate text-sm">Análise de Dados</p>
              <h1 className="text-2xl md:text-3xl mt-1">Relatórios Detalhados</h1>
            </div>
            <ThemeToggle mode="light-dark" />
          </div>

          <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
            <section className="flex flex-col gap-6">
              {/* Stats Summary Container (Identical to reference) */}
              <div className="flex flex-wrap items-stretch justify-between border rounded-xl gap-0 p-5 mt-1">
                <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                  <div className="flex items-center gap-2 w-full justify-between text-background tracking-tight">
                    <p className="text-[16px]">Total de Convidados</p>
                    <TooltipRefined text="Valor total de convidados únicos que foram registrados em episódios do podcast.">
                      <button className="cursor-help text-background"><Info className="size-5" /></button>
                    </TooltipRefined>
                  </div>
                  <div className="flex items-center gap-2 w-full justify-between">
                    {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] font-bold text-background">{stats.totalGuests}</h2>}
                    <ChevronRight className="text-background cursor-pointer hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="w-px h-auto bg-[#ECECEE] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
                <div className="w-full h-px bg-[#ECECEE] dark:bg-fd-border my-4 lg:hidden" />

                <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                  <div className="flex items-center gap-2 w-full justify-between text-background tracking-tight">
                    <p className="text-[16px]">Produção</p>
                    <TooltipRefined text="Conteúdos que estão sendo editados ou aguardando gravação final.">
                      <button className="cursor-help text-background"><Info className="size-5" /></button>
                    </TooltipRefined>
                  </div>
                  <div className="flex items-center gap-2 w-full justify-between">
                    {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] text-background">{stats.pending}</h2>}
                  </div>
                </div>

                <div className="w-px h-auto bg-[#ECECEE] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
                <div className="w-full h-px bg-[#ECECEE] dark:bg-fd-border my-4 lg:hidden" />

                <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                  <div className="flex items-center gap-2 w-full justify-between text-background tracking-tight">
                    <p className="text-[16px]">Publicados</p>
                    <TooltipRefined text="Total de episódios que já estão ao vivo nas plataformas de áudio e vídeo.">
                      <button className="cursor-help text-background"><Info className="size-5" /></button>
                    </TooltipRefined>
                  </div>
                  <div className="flex items-center gap-2 w-full justify-between">
                     {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] text-background">{stats.published}</h2>}
                  </div>
                </div>
              </div>

              {/* Toolbar (Design Sync) */}
              <div className="flex flex-col gap-4 mt-2">
                <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full md:max-w-[340px] max-w-full">
                    <input
                      className="w-full dark:bg-fd-background border rounded-lg pl-3 pr-9 py-2 text-xs text-fd-foreground placeholder:text-background focus:outline-none focus:border-fd-primary transition-colors"
                      placeholder="Pesquisar por ID, Convidado ou Título"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#83899f]" />
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto justify-end gap-2">
                    <div className="relative w-full sm:w-auto" ref={originRef}>
                      <button
                        onClick={() => setOriginOpen(!originOpen)}
                        className="h-8 flex items-center justify-between gap-2 py-2 px-3 border rounded-lg text-sm text-background transition-all w-full sm:min-w-[200px]"
                      >
                        <span className="truncate">{originFilter}</span>
                        <ChevronRight className={cn("size-4 text-background transition-transform", originOpen ? "rotate-270" : "rotate-90")} />
                      </button>
                      {originOpen && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                          {["Todas Origens", "Manual", "Agendado", "Importado"].map(f => (
                            <button 
                              key={f}
                              onClick={() => { setOriginFilter(f); setOriginOpen(false); }}
                              className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-fd-accent border-b last:border-0 border-[#E2E7F1] dark:border-fd-border"
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative w-full sm:w-auto" ref={exportRef}>
                      <button 
                        onClick={() => setExportOpen(!exportOpen)}
                        className="h-8 flex items-center justify-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg px-4 text-sm text-background transition-colors w-full"
                      >
                        <Download className="size-4" /> Exportar
                      </button>
                      {exportOpen && (
                         <div className="absolute top-[calc(100%+4px)] right-0 w-full sm:w-40 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg z-50 overflow-hidden">
                           <button onClick={() => handleExport('JSON')} className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent border-b border-fd-border">JSON</button>
                           <button onClick={() => handleExport('CSV')} className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent">CSV</button>
                         </div>
                      )}
                    </div>

                    {isAdmin && (
                      <ActionButtonRefined 
                        label="Novo Episódio" 
                        onClick={() => setIsCreateModalOpen(true)}
                      />
                    )}
                  </div>
                </section>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full border-separate border-spacing-0 leading-[12px]">
                    <thead >
                      <tr className="text-background text-sm">
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s first:rounded-s-xl last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Convidado</th>
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Episódio</th>
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Status</th>
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Origem</th>
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Criação</th>
                        <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">ID</th>
                        {isAdmin && (
                          <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap">Ações</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-4" />
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-full h-4" /></td>
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-full h-4" /></td>
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-20 h-6" /></td>
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-16 h-4" /></td>
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-24 h-4" /></td>
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5"><Skeleton className="w-16 h-4" /></td>
                            {isAdmin && (
                              <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-right"><Skeleton className="w-10 h-10 ml-auto" /></td>
                            )}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 7 : 6} className="text-center py-20 text-background">Nenhum registro encontrado.</td>
                        </tr>
                      ) : (
                        filtered.map(item => (
                          <tr key={item.id} className="hover:bg-background transition-colors">
                            <td className="border-b p-5 text-background text-xs truncate">
                              {item.guest}
                            </td>
                            <td className="border-b p-5 text-background text-xs truncate max-w-[200px]">
                              {item.title}
                            </td>
                            <td className="border-b p-5">
                              <BadgeRefined variant={item.status === 'Publicado' ? 'success' : item.status === 'Agendado' ? 'info' : 'warning'}>
                                  {item.status === 'Publicado' ? 'Ativo' : item.status}
                              </BadgeRefined>
                            </td>
                            <td className="border-b p-5 text-background text-xs">
                              {item.origin}
                            </td>
                            <td className="border-b p-5 text-background text-xs">
                              {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="border-b p-5">
                              <div className="flex items-center gap-2">
                                 <TooltipRefined text={item.id}>
                                   <span 
                                     className="text-background text-xs cursor-pointer hover:opacity-70 transition-opacity"
                                     onClick={() => { navigator.clipboard.writeText(item.id); toast.success('ID copiado!'); }}
                                   >
                                     {item.id.substring(0, 8)}...
                                   </span>
                                 </TooltipRefined>
                                 <ExternalLink className="size-3 text-background cursor-pointer" />
                              </div>
                             </td>
                             {isAdmin && (
                              <td className="border-b p-5 text-right">
                                 <button 
                                   onClick={() => { setSelectedRecord(item); setIsEditModalOpen(true); }}
                                   className="p-2 rounded-lg bg-background"
                                 >
                                   <MoreVertical className="size-4 text-background" />
                                 </button>
                              </td>
                             )}
                           </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
      </main>

      <CreateEpisodeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateSave} />
      <EditEpisodeModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedRecord(null); }} episode={selectedRecord} onSave={handleEditSave} />
    </div>
  );
}
