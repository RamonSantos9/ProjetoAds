'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  Trash2,
  Download,
  Languages,
} from 'lucide-react';
import {
  ActionButtonRefined,
  TooltipRefined,
} from '@/components/ui/RefinedComponents';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

const ActionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="size-5 text-[#8A8AA3]"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75 5C8.75 4.66848 8.8817 4.35054 9.11612 4.11612C9.35054 3.8817 9.66848 3.75 10 3.75C10.3315 3.75 10.6495 3.8817 10.8839 4.11612C11.1183 4.35054 11.25 4.66848 11.25 5C11.25 5.33152 11.1183 5.64946 10.8839 5.88388C10.6495 6.1183 10.3315 6.25 10 6.25C9.66848 6.25 9.35054 6.1183 9.11612 5.88388C8.8817 5.64946 8.75 5.33152 8.75 5ZM8.75 10C8.75 9.66848 8.8817 9.35054 9.11612 9.11612C9.35054 8.8817 9.66848 8.75 10 8.75C10.3315 8.75 10.6495 8.8817 10.8839 9.11612C11.1183 9.35054 11.25 9.66848 11.25 10C11.25 10.3315 11.1183 10.6495 10.8839 10.8839C10.6495 11.1183 10.3315 11.25 10 11.25C9.66848 11.25 9.35054 11.1183 9.11612 10.8839C8.8817 10.6495 8.75 10.3315 8.75 10ZM8.75 15C8.75 14.6685 8.8817 14.3505 9.11612 14.1161C9.35054 13.8817 9.66848 13.75 10 13.75C10.3315 13.75 10.6495 13.8817 10.8839 14.1161C11.1183 14.3505 11.25 14.6685 11.25 15C11.25 15.3315 11.1183 15.6495 10.8839 15.8839C10.6495 16.1183 10.3315 16.25 10 16.25C9.66848 16.25 9.35054 16.1183 9.11612 15.8839C8.8817 15.6495 8.75 15.3315 8.75 15Z"
      fill="currentColor"
    />
  </svg>
);

interface Transcription {
  id: string;
  slug: string;
  title: string;
  status: 'Concluído' | 'Processando' | 'Erro';
  duration: string;
  createdAt: string;
  language?: string;
  confidence?: number;
}

const fetchTranscriptions = async () => {
  const res = await fetch('/api/episodes');
  if (!res.ok) throw new Error('Falha ao buscar episódios');
  return res.json();
};

export default function TranscricoesPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<{
    id: string;
    rect: DOMRect;
  } | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEvents = () => setMenuOpen(null);
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.actions-menu-portal')) {
        setMenuOpen(null);
      }
    };

    if (menuOpen) {
      window.addEventListener('scroll', handleEvents, true);
      window.addEventListener('resize', handleEvents);
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('scroll', handleEvents, true);
      window.removeEventListener('resize', handleEvents);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTranscriptions();
        setTranscriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Polling logic for "Processing" items
    const interval = setInterval(async () => {
      const currentData = await fetchTranscriptions();
      setTranscriptions((prev) => {
        // Only update state if something changed (to avoid unnecessary re-renders)
        if (JSON.stringify(prev) !== JSON.stringify(currentData)) {
          return currentData;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulateNew = () => {
    const newTr: Transcription = {
      id: `tr-${Date.now()}`,
      slug: 'piloto-ads-serra-dourada', // Defaulting to pilot for simulation
      title: `Teste de Áudio: ${new Date().toLocaleTimeString()}`,
      status: 'Processando',
      duration: '05:30',
      createdAt: new Date().toISOString(),
      language: 'Português (BR)',
      confidence: 0,
    };

    setTranscriptions((prev) => [newTr, ...prev]);
    setIsSimulating(true);

    // After 4 seconds, mark as completed
    setTimeout(() => {
      setTranscriptions((prev) =>
        prev.map((t) =>
          t.id === newTr.id
            ? {
                ...t,
                status: 'Concluído',
                confidence: 0.95 + Math.random() * 0.04,
              }
            : t,
        ),
      );
      setIsSimulating(false);
    }, 4000);
  };

  const filtered = transcriptions.filter((t) =>
    t.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    const dataToExport = filtered;

    let content = '';
    let filename = `transcricoes-podcastads-${new Date().toISOString().split('T')[0]}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = ['ID', 'Episódio', 'Status', 'Duração', 'Idioma', 'Data'];
      const rows = dataToExport.map((r) => [
        r.id,
        `"${r.title}"`,
        r.status,
        r.duration,
        r.language,
        r.createdAt,
      ]);
      content = [headers, ...rows].map((e) => e.join(',')).join('\n');
      filename += '.csv';
      mimeType = 'text/csv';
    } else {
      content = dataToExport
        .map(
          (r) =>
            `EPISÓDIO: ${r.title}\n` +
            `Status: ${r.status}\n` +
            `Link Público: /episodio/${r.slug}\n` +
            `Duração: ${r.duration}\n` +
            `Idioma: ${r.language}\n` +
            `Data: ${r.createdAt}\n` +
            `--------------------------\n`,
        )
        .join('\n');
      filename += '.txt';
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

    setIsExportOpen(false);
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Transcrições
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Transcrições Automáticas
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Gerencie e edite as transcrições geradas automaticamente via
                ElevenLabs AI.
              </p>
              <ActionButtonRefined
                label={isSimulating ? 'Simulando...' : 'Simular Áudio de Teste'}
                icon={<Languages className="size-5" />}
                onClick={handleSimulateNew}
                disabled={isSimulating}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-[400px]">
                <input
                  className="w-full bg-[#f6f8fa] dark:bg-fd-muted/50 border border-[#e2e7f1] dark:border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm font-semibold text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none focus:border-fd-primary transition-colors"
                  placeholder="Pesquisar por título do episódio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#83899f]" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto" ref={exportRef}>
                  <button
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="h-8 flex items-center justify-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg px-4 text-sm text-background transition-colors w-full sm:w-auto"
                  >
                    <Download className="size-4" /> Exportar Tudo{' '}
                    <ChevronDown
                      className={cn(
                        'size-3 transition-transform ml-1',
                        isExportOpen ? 'rotate-180' : '',
                      )}
                    />
                  </button>

                  {isExportOpen && (
                    <div className="absolute top-[calc(100%+4px)] right-0 w-full sm:w-48 bg-white dark:bg-[#121212] border border-[#E2E7F1] dark:border-fd-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                      <button
                        onClick={() => handleExport('json')}
                        className="w-full h-10 flex items-center gap-3 px-4 text-sm font-semibold text-[#0A1B39] dark:text-fd-foreground hover:bg-[#F6F8FA] dark:hover:bg-fd-accent border-b border-fd-border transition-colors text-left"
                      >
                        JSON
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full h-10 flex items-center gap-3 px-4 text-sm font-semibold text-[#0A1B39] dark:text-fd-foreground hover:bg-[#F6F8FA] dark:hover:bg-fd-accent border-b border-fd-border transition-colors text-left"
                      >
                        CSV
                      </button>
                      <button
                        onClick={() => handleExport('txt')}
                        className="w-full h-10 flex items-center gap-3 px-4 text-sm font-semibold text-[#0A1B39] dark:text-fd-foreground hover:bg-[#F6F8FA] dark:hover:bg-fd-accent transition-colors text-left"
                      >
                        TXT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-separate border-spacing-0 leading-[12px]">
                <thead>
                  <tr className="text-background text-sm">
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s first:rounded-s-xl last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">
                      Episódio
                    </th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border p-5 text-left whitespace-nowrap">
                      Status
                    </th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border p-5 text-left whitespace-nowrap">
                      Idioma
                    </th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border p-5 text-left whitespace-nowrap">
                      Página Pública
                    </th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-4" />
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td className="p-5 border-b border-fd-border">
                          <Skeleton className="h-4 w-3/4" />
                        </td>
                        <td className="p-5 border-b border-fd-border">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="p-5 border-b border-fd-border">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="p-5 border-b border-fd-border">
                          <Skeleton className="h-4 w-12" />
                        </td>
                        <td className="p-5 border-b border-fd-border text-right">
                          <Skeleton className="h-10 w-10 ml-auto rounded-lg" />
                        </td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20 text-[#74748D]"
                      >
                        Nenhuma transcrição encontrada.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-background transition-colors group text-background"
                      >
                        <td className="p-5 border-b border-fd-border text-xs truncate">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-background truncate max-w-[300px]">
                              {t.title}
                            </span>
                            <span className="text-[10px] text-background flex items-center gap-1.5 opacity-70">
                              <Clock className="size-3" /> {t.duration}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 border-b border-fd-border text-xs">
                          <Badge
                            variant={
                              t.status === 'Concluído'
                                ? 'success'
                                : t.status === 'Processando'
                                  ? 'warning'
                                  : 'error'
                            }
                          >
                            {t.status}
                          </Badge>
                        </td>
                        <td className="p-5 border-b border-fd-border text-xs font-medium opacity-70">
                          {t.language}
                        </td>
                        <td className="p-5 border-b border-fd-border text-xs">
                          <a
                            href={`/episodio/${t.slug}`}
                            target="_blank"
                            className="flex items-center gap-2 text-fd-primary hover:underline font-bold"
                          >
                            <ExternalLink className="size-4" /> Abrir Página
                          </a>
                        </td>
                        <td className="p-5 border-b border-fd-border text-right text-xs">
                          <div className="flex items-center justify-end gap-2">
                            <TooltipRefined text="Ver Transcrição">
                              <button className="p-2 rounded-lg bg-[#F6F8FA] dark:bg-fd-muted hover:bg-fd-primary hover:text-[#244c4e] transition-all active:scale-95">
                                <FileText className="size-4" />
                              </button>
                            </TooltipRefined>
                            <button
                              className="p-1.5 rounded-lg bg-[#F6F8FA] dark:bg-fd-muted hover:bg-[#E2E7F1] dark:hover:bg-fd-accent transition-colors cursor-pointer"
                              onClick={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                setMenuOpen(
                                  menuOpen?.id === t.id
                                    ? null
                                    : { id: t.id, rect },
                                );
                              }}
                            >
                              <ActionsIcon />
                            </button>
                            {menuOpen?.id === t.id &&
                              createPortal(
                                <div
                                  className="fixed bg-white dark:bg-[#1A1A1A] text-[#0A1B39] dark:text-gray-200 font-semibold rounded-xl border border-[#E2E7F1] dark:border-fd-border shadow-xl z-[9999] min-w-[160px] flex flex-col overflow-hidden actions-menu-portal fade-in duration-200"
                                  style={{
                                    top: menuOpen.rect.bottom + 8,
                                    left: menuOpen.rect.right - 160,
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex flex-col">
                                    <button
                                      className="px-4 py-2.5 hover:bg-[#F6F8FA] dark:hover:bg-fd-accent border-b border-[#E2E7F1] dark:border-fd-border cursor-pointer outline-none whitespace-nowrap text-sm flex items-center justify-start gap-2 text-left"
                                      onClick={() => setMenuOpen(null)}
                                    >
                                      <FileText className="size-4 opacity-70" />
                                      Ver Detalhes
                                    </button>
                                    <button
                                      className="px-4 py-2.5 hover:bg-[#F6F8FA] dark:hover:bg-fd-accent text-red-600 cursor-pointer outline-none whitespace-nowrap text-sm flex items-center justify-start gap-2 text-left"
                                      onClick={() => setMenuOpen(null)}
                                    >
                                      <Trash2 className="size-4 opacity-70" />
                                      Excluir Transcrição
                                    </button>
                                  </div>
                                </div>,
                                document.body,
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
