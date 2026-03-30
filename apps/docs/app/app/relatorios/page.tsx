'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Link from 'next/link';
// import { toast } from 'sonner'; // sonner not installed
import { 
  Users, 
  CheckCircle2, 
  Clock, 
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
import { cn } from '@/lib/cn';

// --- Types ---

interface ReportRecord extends Episode {
  guest: string; // Primary guest name for the table
  createdAt: string; // Creation date for reporting
  origin: string; // Manual, Agendado, Importado
}

// --- Local Components (Design Sync) ---

// 1. Precise ActionButton from DashboardXispeStudio
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
      ? "bg-fd-primary text-[#244c4e] hover:bg-fd-primary/90 border-fd-primary"
      : "bg-white dark:bg-fd-muted text-[#0A1B39] dark:text-fd-foreground border-[#E2E7F1] dark:border-fd-border hover:bg-[#F6F8FA] dark:hover:bg-fd-accent"; 

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "leading-[24px] relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-5 border flex items-center font-semibold justify-center gap-2 active:scale-95 transition-all duration-200 rounded-lg h-10 px-3 w-full lg:w-auto shadow-sm",
        variantStyles,
        className
      )}
    >
      {showIcon && (icon || <Plus className="size-5" />)}
      {label}
    </button>
  );
};

// 2. Precise PageHeader from DashboardXispeStudio
const PageHeaderRefined = ({ breadcrumbs }: { breadcrumbs: any[] }) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between w-full mb-5 gap-4">
    <nav className="flex items-center gap-3 min-w-0 overflow-hidden">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400 font-medium">/</span>}
          <div className="flex items-center gap-2 min-w-0">
            {item.icon}
            <Link href={item.href || '#'} className="min-w-0">
              <span className={cn(
                "text-sm font-medium truncate whitespace-nowrap",
                item.isCurrent ? "text-fd-foreground font-semibold" : "text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              )}>
                {item.label}
              </span>
            </Link>
          </div>
        </React.Fragment>
      ))}
    </nav>
    <div className="flex items-center gap-4">
      <Link href="#" className="flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors">
        <HelpCircle className="size-5" />
        <span className="text-sm font-medium hidden sm:inline">Ajuda</span>
      </Link>
      <button className="size-10 rounded-full hover:bg-fd-muted flex items-center justify-center text-fd-muted-foreground transition-colors relative">
        <Bell className="size-5" />
        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-fd-background"></span>
      </button>
      <button className="size-9 bg-fd-primary rounded-full flex items-center justify-center text-[#244c4e] shadow-lg hover:shadow-fd-primary/20 transition-all">
        <Sparkles className="size-5" />
      </button>
    </div>
  </header>
);

// 3. Tooltip matching the original one precisely
const TooltipRefined = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="relative inline-block group">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-[#0A1B39] text-[11px] font-bold rounded-lg px-2 py-1.5 whitespace-nowrap shadow-lg border border-[#E2E7F1] text-center scale-95 group-hover:scale-100 origin-bottom">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
    </div>
  </div>
);

// 4. Badge matching the original one
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

export default function RelatoriosPage() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReportRecord | null>(null);

  // Dropdown States
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

  // Load dummy data
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
        status: ep.status === 'Released' ? 'Publicado' : (i % 3 === 0 ? 'Agendado' : 'Em Produção'),
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
    pending: reports.filter(r => r.status === 'Em Produção' || r.status === 'Agendado').length,
    published: reports.filter(r => r.status === 'Publicado').length
  };

  return (
    <div className="flex flex-col min-h-screen bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-7xl mx-auto w-full flex flex-col min-h-0">
        <PageHeaderRefined 
          breadcrumbs={[
            { label: 'Portal', href: '/', icon: <User className="size-4" /> },
            { label: 'Dashboard', href: '/app/home' },
            { label: 'Relatórios', isCurrent: true }
          ]} 
        />

        <div className="bg-white dark:bg-fd-muted/30 w-full p-6 md:p-8 rounded-[24px] shadow-sm border border-[#E2E7F1] dark:border-fd-border flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <h1 className="text-2xl sm:text-[32px] font-semibold text-[#121217] dark:text-fd-foreground tracking-tight">
              Relatórios
            </h1>

            {/* Stats Summary Container (Identical to reference) */}
            <div className="flex flex-wrap items-stretch justify-between border border-[#E2E7F1] dark:border-fd-border rounded-[16px] gap-0 p-5 mt-1">
              <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Total de Convidados</p>
                  <TooltipRefined text="Valor total de convidados únicos que foram registrados em episódios do podcast.">
                    <button className="cursor-help text-fd-muted-foreground"><Info className="size-5" /></button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                  {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] font-bold text-fd-foreground">{stats.totalGuests}</h2>}
                  <ChevronRight className="text-[#8A8AA3] cursor-pointer hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="w-px h-auto bg-[#E2E7F1] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
              <div className="w-full h-px bg-[#E2E7F1] dark:bg-fd-border my-4 lg:hidden" />

              <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Em Produção</p>
                  <TooltipRefined text="Conteúdos que estão sendo editados ou aguardando gravação final.">
                    <button className="cursor-help text-fd-muted-foreground"><Info className="size-5" /></button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                  {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] font-bold text-fd-foreground">{stats.pending}</h2>}
                </div>
              </div>

              <div className="w-px h-auto bg-[#E2E7F1] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
              <div className="w-full h-px bg-[#E2E7F1] dark:bg-fd-border my-4 lg:hidden" />

              <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Publicados</p>
                  <TooltipRefined text="Total de episódios que já estão ao vivo nas plataformas de áudio e vídeo.">
                    <button className="cursor-help text-fd-muted-foreground"><Info className="size-5" /></button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                   {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] font-bold text-fd-foreground">{stats.published}</h2>}
                </div>
              </div>
            </div>

            {/* Toolbar (Design Sync) */}
            <div className="flex flex-col gap-4 mt-2">
              <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full max-w-[340px]">
                  <input
                    className="w-full bg-[#f6f8fa] dark:bg-fd-muted/50 border border-[#e2e7f1] dark:border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm font-semibold text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none focus:border-fd-primary transition-colors"
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
                      className="h-10 flex items-center justify-between gap-2 bg-white dark:bg-fd-muted py-2 px-3 border border-[#E2E7F1] dark:border-fd-border rounded-lg text-sm font-semibold text-[#0A1B39] dark:text-fd-foreground active:scale-95 transition-all w-full sm:min-w-[200px]"
                    >
                      <span className="truncate">{originFilter}</span>
                      <ChevronRight className={cn("size-4 text-[#8A8AA3] transition-transform", originOpen ? "rotate-270" : "rotate-90")} />
                    </button>
                    {originOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-fd-muted border border-[#E2E7F1] dark:border-fd-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
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
                      className="h-10 flex items-center justify-center gap-2 bg-white dark:bg-fd-muted border border-[#E2E7F1] dark:border-fd-border rounded-lg px-4 text-sm font-semibold text-[#0A1B39] dark:text-fd-foreground hover:bg-[#F6F8FA] dark:hover:bg-fd-accent transition-colors active:scale-95 w-full"
                    >
                      <Download className="size-4" /> Exportar
                    </button>
                    {exportOpen && (
                       <div className="absolute top-[calc(100%+4px)] right-0 w-full sm:w-40 bg-white dark:bg-fd-muted border border-[#E2E7F1] dark:border-fd-border rounded-lg shadow-xl z-50 overflow-hidden">
                         <button onClick={() => handleExport('JSON')} className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent border-b border-fd-border">JSON</button>
                         <button onClick={() => handleExport('CSV')} className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent">CSV</button>
                       </div>
                    )}
                  </div>

                  <ActionButtonRefined 
                    label="Novo Episódio" 
                    onClick={() => setIsCreateModalOpen(true)}
                  />
                </div>
              </section>

              {/* Table (Design Sync) */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full border-separate border-spacing-0 leading-[12px]">
                  <thead>
                    <tr className="text-[#0a1b39] dark:text-fd-foreground text-sm">
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s first:rounded-s-xl last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Convidado</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Episódio</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Status</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Origem</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Criação</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">ID</th>
                      <th className="font-semibold bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap">Ações</th>
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
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-right"><Skeleton className="w-10 h-10 ml-auto" /></td>
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-20 text-fd-muted-foreground font-semibold">Nenhum registro encontrado.</td>
                      </tr>
                    ) : (
                      filtered.map(item => (
                        <tr key={item.id} className="hover:bg-[#F6F8FA] dark:hover:bg-fd-muted/20 transition-colors">
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium uppercase text-xs truncate">
                            {item.guest}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 font-semibold text-fd-foreground truncate max-w-[200px]">
                            {item.title}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <BadgeRefined variant={item.status === 'Publicado' ? 'success' : item.status === 'Agendado' ? 'info' : 'warning'}>
                                {item.status === 'Publicado' ? 'Ativo' : item.status}
                            </BadgeRefined>
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium text-xs">
                            {item.origin}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium text-xs">
                            {new Date(item.createdAt || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <div className="flex items-center gap-2">
                               <TooltipRefined text={item.id}>
                                 <span 
                                   className="text-[#74748D] dark:text-fd-muted-foreground text-xs font-bold cursor-pointer hover:opacity-70 transition-opacity"
                                   onClick={() => { navigator.clipboard.writeText(item.id); toast.success('ID copiado!'); }}
                                 >
                                   {item.id.substring(0, 8)}...
                                 </span>
                               </TooltipRefined>
                               <ExternalLink className="size-3.5 text-fd-primary cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-right">
                             <button 
                               onClick={() => { setSelectedRecord(item); setIsEditModalOpen(true); }}
                               className="p-2 rounded-lg bg-[#F6F8FA] dark:bg-fd-muted hover:bg-[#E2E7F1] dark:hover:bg-fd-accent transition-colors active:scale-95"
                             >
                               <MoreVertical className="size-4 text-[#8A8AA3]" />
                             </button>
                          </td>
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
