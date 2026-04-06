'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Simple toast fallback (sonner not installed)
const toast = { success: (msg: string) => console.log('[toast]', msg) };
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
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import {
  ActionButtonRefined,
  TooltipRefined,
} from '@/components/ui/RefinedComponents';
import { Badge } from '@/components/ui/Badge';
import {
  CreateEpisodeModal,
  EpisodeFormData,
} from '@/components/dashboard/CreateEpisodeModal';
import { EditEpisodeModal } from '@/components/dashboard/EditEpisodeModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { Episode, Guest } from '@/lib/db';

// --- Types ---

interface ReportRecord extends Episode {
  guest: string; // Primary guest name for the table
  origin: string; // Manual, Agendado, Importado
}

// --- Local Types ---

export default function RelatoriosPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReportRecord | null>(
    null,
  );

  // Dropdown States
  const [originFilter, setOriginFilter] = useState('Todas Origens');
  const [originOpen, setOriginOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node))
        setOriginOpen(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node))
        setExportOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Load real data from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/episodes');
        if (!res.ok) throw new Error('Failed to fetch API');
        const data = await res.json();

        const mapped: ReportRecord[] = data.map((ep: any) => ({
          ...ep,
          guest:
            typeof ep.guests?.[0] === 'object'
              ? ep.guests[0].name
              : ep.guests?.[0] || 'Sem Convidado',
          creator: 'Sistema',
          origin: ep.origin || 'Manual',
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

  const filtered = reports.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      String(r.guest || '')
        .toLowerCase()
        .includes(searchLower) ||
      String(r.title || '')
        .toLowerCase()
        .includes(searchLower) ||
      String(r.id || '')
        .toLowerCase()
        .includes(searchLower);

    const matchesOrigin =
      originFilter === 'Todas Origens' || r.origin === originFilter;

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
      guest:
        typeof newEp.guests[0] === 'object'
          ? newEp.guests[0].name
          : newEp.guests[0] || 'Sem Convidado',
      status: (newEp.status === 'Released' ? 'Publicado' : newEp.status) as any,
      createdAt: new Date().toISOString(),
      origin: 'Manual',
    } as ReportRecord;
    setReports((prev) => [newRecord, ...prev]);
  };

  const handleEditSave = (updated: Episode) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === updated.id
          ? ({
              ...r,
              ...updated,
              guest:
                typeof updated.guests[0] === 'object'
                  ? (updated.guests[0] as any).name
                  : updated.guests[0] || 'Sem Convidado',
            } as ReportRecord)
          : r,
      ),
    );
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
      const headers = [
        'ID',
        'Convidado',
        'Episódio',
        'Status',
        'Origem',
        'Data Criação',
      ];
      const rows = dataToExport.map((r) => [
        r.id,
        `"${r.guest}"`,
        `"${r.title}"`,
        r.status,
        r.origin,
        r.createdAt,
      ]);
      content = [headers, ...rows].map((e) => e.join(',')).join('\n');
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
    setExportOpen(false);
  };

  const stats = {
    totalGuests: Array.from(new Set(reports.map((r) => r.guest))).length,
    pending: reports.filter(
      (r) => r.status === 'Produção' || r.status === 'Agendado',
    ).length,
    published: reports.filter((r) => r.status === 'Publicado').length,
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              Análise de Dados
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Relatórios Detalhados
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            {/* Stats Summary Container (Identical to reference) */}
            <div className="flex flex-wrap items-stretch justify-between border border-[#E2E7F1] dark:border-fd-border rounded-[16px] gap-0 p-5 mt-1">
              <div
                className="flex-auto flex flex-col gap-4 px-4 lg:px-0"
                style={{ minWidth: '240px' }}
              >
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Total de Convidados</p>
                  <TooltipRefined text="Valor total de convidados únicos que foram registrados em episódios do podcast.">
                    <button className="cursor-help text-fd-muted-foreground">
                      <Info className="size-5" />
                    </button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                  {loading ? (
                    <Skeleton className="w-20 h-8" />
                  ) : (
                    <h2 className="text-[32px] font-bold text-fd-foreground">
                      {stats.totalGuests}
                    </h2>
                  )}
                  <ChevronRight className="text-[#8A8AA3] cursor-pointer hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="w-px h-auto bg-[#E2E7F1] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
              <div className="w-full h-px bg-[#E2E7F1] dark:bg-fd-border my-4 lg:hidden" />

              <div
                className="flex-auto flex flex-col gap-4 px-4 lg:px-0"
                style={{ minWidth: '240px' }}
              >
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Produção</p>
                  <TooltipRefined text="Conteúdos que estão sendo editados ou aguardando gravação final.">
                    <button className="cursor-help text-fd-muted-foreground">
                      <Info className="size-5" />
                    </button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                  {loading ? (
                    <Skeleton className="w-20 h-8" />
                  ) : (
                    <h2 className="text-[32px] font-bold text-fd-foreground">
                      {stats.pending}
                    </h2>
                  )}
                </div>
              </div>

              <div className="w-px h-auto bg-[#E2E7F1] dark:bg-fd-border my-0 mx-4 hidden lg:block" />
              <div className="w-full h-px bg-[#E2E7F1] dark:bg-fd-border my-4 lg:hidden" />

              <div
                className="flex-auto flex flex-col gap-4 px-4 lg:px-0"
                style={{ minWidth: '240px' }}
              >
                <div className="flex items-center gap-2 w-full justify-between text-[#74748D] font-semibold tracking-tight">
                  <p className="text-[16px]">Publicados</p>
                  <TooltipRefined text="Total de episódios que já estão ao vivo nas plataformas de áudio e vídeo.">
                    <button className="cursor-help text-fd-muted-foreground">
                      <Info className="size-5" />
                    </button>
                  </TooltipRefined>
                </div>
                <div className="flex items-center gap-2 w-full justify-between">
                  {loading ? (
                    <Skeleton className="w-20 h-8" />
                  ) : (
                    <h2 className="text-[32px] font-bold text-fd-foreground">
                      {stats.published}
                    </h2>
                  )}
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
                      className="h-8 flex items-center justify-between gap-2 py-2 px-3 border rounded-lg text-sm text-background transition-all w-full sm:min-w-[200px]"
                    >
                      <span className="truncate">{originFilter}</span>
                      <ChevronRight
                        className={cn(
                          'size-4 text-background transition-transform',
                          originOpen ? 'rotate-270' : 'rotate-90',
                        )}
                      />
                    </button>
                    {originOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                        {[
                          'Todas Origens',
                          'Manual',
                          'Agendado',
                          'Importado',
                        ].map((f) => (
                          <button
                            key={f}
                            onClick={() => {
                              setOriginFilter(f);
                              setOriginOpen(false);
                            }}
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
                        <button
                          onClick={() => handleExport('JSON')}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent border-b border-fd-border"
                        >
                          JSON
                        </button>
                        <button
                          onClick={() => handleExport('CSV')}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-fd-accent"
                        >
                          CSV
                        </button>
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

              {/* Table (Design Sync) */}
              <div className="overflow-x-auto mt-2">
                <table className="w-full border-separate border-spacing-0 leading-[12px]">
                  <thead>
                    <tr className="text-[#0a1b39] dark:text-fd-foreground text-sm">
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s first:rounded-s-xl last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        Convidado
                      </th>
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        Episódio
                      </th>
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        Status
                      </th>
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        Origem
                      </th>
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        Criação
                      </th>
                      <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                        ID
                      </th>
                      {isAdmin && (
                        <th className="bg-[#f6f8fa] dark:bg-fd-muted/50 border-y border-[#E2E7F1] dark:border-fd-border first:border-s last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap">
                          Ações
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-4" />
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-full h-4" />
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-full h-4" />
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-20 h-6" />
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-16 h-4" />
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-24 h-4" />
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Skeleton className="w-16 h-4" />
                          </td>
                          {isAdmin && (
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-right">
                              <Skeleton className="w-10 h-10 ml-auto" />
                            </td>
                          )}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={isAdmin ? 7 : 6}
                          className="text-center py-20 text-fd-muted-foreground font-semibold"
                        >
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[#F6F8FA] dark:hover:bg-fd-muted/20 transition-colors"
                        >
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium uppercase text-xs truncate">
                            {item.guest}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 font-semibold text-fd-foreground truncate max-w-[200px]">
                            {item.title}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <Badge
                              variant={
                                item.status === 'Publicado'
                                  ? 'success'
                                  : item.status === 'Agendado'
                                    ? 'info'
                                    : 'warning'
                              }
                            >
                              {item.status === 'Publicado'
                                ? 'Ativo'
                                : item.status}
                            </Badge>
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium text-xs">
                            {item.origin}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-[#74748D] dark:text-fd-muted-foreground font-medium text-xs">
                            {new Date(
                              item.createdAt || Date.now(),
                            ).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5">
                            <div className="flex items-center gap-2">
                              <TooltipRefined text={item.id}>
                                <span
                                  className="text-[#74748D] dark:text-fd-muted-foreground text-xs font-bold cursor-pointer hover:opacity-70 transition-opacity"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.id);
                                    toast.success('ID copiado!');
                                  }}
                                >
                                  {item.id.substring(0, 8)}...
                                </span>
                              </TooltipRefined>
                              <ExternalLink className="size-3.5 text-fd-primary cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="border-b border-[#E2E7F1] dark:border-fd-border p-5 text-right">
                              <button
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-[#F6F8FA] dark:bg-fd-muted hover:bg-[#E2E7F1] dark:hover:bg-fd-accent transition-colors active:scale-95"
                              >
                                <MoreVertical className="size-4 text-[#8A8AA3]" />
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

      <CreateEpisodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSave}
      />
      <EditEpisodeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecord(null);
        }}
        episode={selectedRecord}
        onSave={handleEditSave}
      />
    </div>
  );
}
