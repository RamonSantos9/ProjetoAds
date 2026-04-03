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
import { EditEpisodeModal } from '@/components/dashboard/EditEpisodeModal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Episode, Guest } from '@/lib/db';
import DashboardToolbar from '@/components/dashboard/DashboardToolbar';




// --- Types ---

interface ReportRecord extends Episode {
  guest: string; 
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




  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/episodes');
        if (!res.ok) throw new Error('Failed to fetch API');
        const data = await res.json();
        
        const mapped: ReportRecord[] = data.map((ep: any) => ({
          ...ep,
          guest: typeof ep.guests?.[0] === 'object' ? ep.guests[0].name : ep.guests?.[0] || 'Sem Convidado',
          creator: 'Sistema',
          origin: ep.origin || 'Manual'
        }));
        
        setReports(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter(r => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      String(r.guest || '').toLowerCase().includes(searchLower) || 
      String(r.title || '').toLowerCase().includes(searchLower) ||
      String(r.id || '').toLowerCase().includes(searchLower);
    
    const matchesOrigin = 
      originFilter === "Todas Origens" || 
      r.origin === originFilter;

    return matchesSearch && matchesOrigin;
  });

  const handleCreateSave = (newEp: EpisodeFormData) => {
    const newRecord: ReportRecord = {
      ...newEp,
      id: Math.random().toString(36).substring(7),
      slug: Math.random().toString(36).substring(7),
      title: newEp.title,
      summary: newEp.summary,
      category: newEp.category,
      duration: '00:00',
      guests: newEp.guests,
      platforms: newEp.platforms,
      guest: typeof newEp.guests[0] === 'object' ? newEp.guests[0].name : newEp.guests[0] || 'Sem Convidado',
      status: (newEp.status === 'Released' ? 'Publicado' : newEp.status) as any,
      createdAt: new Date().toISOString(),
      origin: 'Manual'
    } as ReportRecord;
    setReports(prev => [newRecord, ...prev]);
  };

  const handleEditSave = (updated: Episode) => {
    setReports(prev => prev.map(r => r.id === updated.id ? ({
      ...r,
      ...updated,
      guest: typeof updated.guests[0] === 'object' ? updated.guests[0].name : updated.guests[0] || 'Sem Convidado'
    } as ReportRecord) : r));
  };

  const handleExport = (format: string) => {
    const dataToExport = filtered;
    let content = '';
    let filename = `relatorio-podcastads-${new Date().toISOString().split('T')[0]}`;
    let mimeType = 'text/plain';

    if (format === 'JSON') {
      content = JSON.stringify(dataToExport, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'CSV') {
      const headers = ['ID', 'Convidado', 'Episódio', 'Status', 'Origem', 'Data Criação'];
      const rows = dataToExport.map(r => [
        r.id, 
        `"${r.guest}"`, 
        `"${r.title}"`, 
        r.status, 
        r.origin, 
        r.createdAt
      ]);
      content = [headers, ...rows].map(e => e.join(',')).join('\n');
      filename += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exportação ${format} concluída!`);
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
             <div className="flex-1 flex flex-col gap-6">
               {/* Stats Grid */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center p-4 border rounded-xl">
                <div className="flex-auto flex flex-col gap-4 px-4 lg:px-0" style={{ minWidth: "240px" }}>
                  <div className="flex items-center gap-2 w-full justify-between text-background tracking-tight">
                    <p className="text-[16px]">Total Convidados</p>
                    <TooltipRefined text="Número total de convidados únicos que já participaram do seu podcast.">
                      <button className="cursor-help text-background"><Info className="size-5" /></button>
                    </TooltipRefined>
                  </div>
                  <div className="flex items-center gap-2 w-full justify-between">
                    {loading ? <Skeleton className="w-20 h-8" /> : <h2 className="text-[32px] font-bold text-background">{stats.totalGuests}</h2>}
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

              {/* Toolbar Modulado */}
              <div className="mt-2">
                <DashboardToolbar 
                  search={search}
                  onSearchChange={setSearch}
                  filterValue={originFilter}
                  onFilterChange={setOriginFilter}
                  onExport={handleExport}
                  showAction={isAdmin}
                  actionLabel="Novo Episódio"
                  onActionClick={() => setIsCreateModalOpen(true)}
                />
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full border-separate border-spacing-0 leading-[12px]">
                  <thead>
                    <tr>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:rounded-s-xl first:border-s p-5 text-left whitespace-nowrap text-xs">Convidado</th>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s p-5 text-left whitespace-nowrap text-xs">Episódio</th>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s p-5 text-left whitespace-nowrap text-xs">Status</th>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s p-5 text-left whitespace-nowrap text-xs">Origem</th>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s p-5 text-left whitespace-nowrap text-xs">Criação</th>
                      <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap text-xs">ID</th>
                      {isAdmin && (
                        <th className="bg-background border-y first:border-s last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap text-xs">Ações</th>
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
                            <Badge variant={item.status === 'Publicado' ? 'success' : item.status === 'Agendado' ? 'info' : 'warning'}>
                              {item.status === 'Publicado' ? 'Ativo' : item.status}
                            </Badge>
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
          </div>
      </main>

      <CreateEpisodeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateSave} />
      <EditEpisodeModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedRecord(null); }} episode={selectedRecord} onSave={handleEditSave} />
    </div>
  );
}
