'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Globe, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github,
  MoreHorizontal,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  Download,
  FileJson,
  Table as TableIcon,
  FileText
} from 'lucide-react';
import { 
  ActionButtonRefined, 
  TooltipRefined 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { Episode, Guest } from '@/lib/db';
import { createPortal } from 'react-dom';
import { CreateGuestModal } from '@/components/dashboard/CreateGuestModal';

/**
 * Interface estendida para exibição na tabela
 */
interface ExtendedGuest extends Guest {
  id: string;
  episodeCount: number;
  episodes: string[];
}

export default function ConvidadosAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [menuOpen, setMenuOpen] = useState<{ id: string; rect: DOMRect } | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [epRes, guestRes] = await Promise.all([
        fetch('/api/episodes'),
        fetch('/api/guests')
      ]);
      
      if (epRes.ok && guestRes.ok) {
        const epData = await epRes.json();
        const guestData = await guestRes.json();
        setEpisodes(epData);
        setGuests(guestData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Correlacionar convidados com episódios
  const guestsList = useMemo(() => {
    return guests.map(g => {
      const relatedEpisodes = episodes.filter(ep => 
        ep.guests?.some(eg => eg.id === g.id || eg.name === g.name)
      );
      
      return {
        ...g,
        episodeCount: relatedEpisodes.length,
        episodes: relatedEpisodes.map(ep => ep.title)
      } as ExtendedGuest;
    });
  }, [guests, episodes]);

  const filtered = guestsList.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.bio?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = (format: 'json' | 'csv') => {
    console.log(`Exportando em ${format}...`);
    setIsExportOpen(false);
  };

  const handleSave = () => {
    loadData();
    setIsModalOpen(false);
    setEditingGuest(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este convidado?')) return;
    
    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
        setMenuOpen(null);
      }
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / CRM
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Gestão de Convidados
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Base de dados de participantes, professores e especialistas. Mantenha o histórico de participações sincronizado.
              </p>
              <ActionButtonRefined 
                label="Novo Convidado" 
                icon={<Plus className="size-5" />}
                onClick={() => {
                  setEditingGuest(null);
                  setIsModalOpen(true);
                }}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-[400px]">
                <input
                  className="w-full bg-background border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none transition-colors"
                  placeholder="Pesquisar por nome ou bio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto" ref={exportRef}>
                  <button 
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="h-8 flex items-center justify-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg px-4 text-sm text-fd-foreground transition-colors w-full sm:w-auto"
                  >
                    <Download className="size-4" /> Exportar <ChevronDown className={cn("size-3 transition-transform ml-1", isExportOpen ? "rotate-180" : "")} />
                  </button>
                  
                  {isExportOpen && (
                    <div className="absolute top-[calc(100%+4px)] right-0 w-full sm:w-48 bg-white dark:bg-[#121212] border border-[#E2E7F1] dark:border-fd-border rounded-lg shadow-xl z-50 overflow-hidden">
                      <button onClick={() => handleExport('json')} className="w-full h-10 flex items-center gap-3 px-4 text-sm font-semibold hover:bg-fd-accent transition-colors text-left border-b border-fd-border"><FileJson className="size-4" /> JSON</button>
                      <button onClick={() => handleExport('csv')} className="w-full h-10 flex items-center gap-3 px-4 text-sm font-semibold hover:bg-fd-accent transition-colors text-left"><TableIcon className="size-4" /> CSV</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-separate border-spacing-0 leading-[12px]">
                <thead>
                  <tr className="text-fd-foreground text-sm">
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border first:border-s first:rounded-s-xl last:rounded-e-xl last:border-e p-5 text-left whitespace-nowrap">Convidado</th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border p-5 text-left whitespace-nowrap">Episódios</th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border p-5 text-left whitespace-nowrap">Redes Sociais</th>
                    <th className="bg-background border-y border-[#E2E7F1] dark:border-fd-border last:rounded-e-xl last:border-e p-5 text-right whitespace-nowrap">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-4" />
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td className="p-5 border-b border-fd-border"><Skeleton className="h-10 w-40" /></td>
                        <td className="p-5 border-b border-fd-border"><Skeleton className="h-6 w-10" /></td>
                        <td className="p-5 border-b border-fd-border"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-5 border-b border-fd-border text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-20 text-[#74748D]">Nenhum convidado encontrado.</td>
                    </tr>
                  ) : (
                    filtered.map(g => (
                      <tr key={g.id} className="hover:bg-fd-accent/50 transition-colors group">
                        <td className="p-5 border-b border-fd-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-fd-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-fd-border">
                              {g.avatar ? (
                                <img src={g.avatar} alt={g.name} className="w-full h-full object-cover" />
                              ) : (
                                <Users className="size-5 text-fd-primary" />
                              )}
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="font-bold text-fd-foreground truncate">{g.name}</span>
                              <span className="text-[10px] text-fd-muted-foreground truncate max-w-[200px]">{g.bio || 'Sem biografia definida.'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 border-b border-fd-border">
                           <span className="inline-flex items-center justify-center bg-fd-primary/10 text-fd-primary font-bold text-xs px-2.5 py-1 rounded-full border border-fd-primary/20">
                             {g.episodeCount}
                           </span>
                        </td>
                        <td className="p-5 border-b border-fd-border">
                          <div className="flex items-center gap-2">
                             {g.social ? (
                               <a href={g.social} target="_blank" className="p-1.5 rounded-lg hover:bg-fd-accent text-fd-muted-foreground hover:text-fd-primary transition-colors">
                                 {g.social.includes('github') ? <Github className="size-4" /> : 
                                  g.social.includes('instagram') ? <Instagram className="size-4" /> :
                                  g.social.includes('linkedin') ? <Linkedin className="size-4" /> :
                                  <Globe className="size-4" />}
                               </a>
                             ) : <span className="text-[10px] text-fd-muted-foreground italic">Nenhuma</span>}
                          </div>
                        </td>
                        <td className="p-5 border-b border-fd-border text-right">
                           <button 
                             className="p-1.5 rounded-lg hover:bg-fd-accent transition-colors"
                             onClick={(e) => {
                               const rect = e.currentTarget.getBoundingClientRect();
                               setMenuOpen(menuOpen?.id === g.id ? null : { id: g.id, rect });
                             }}
                           >
                             <MoreHorizontal className="size-5 text-fd-muted-foreground" />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Actions Menu Portal */}
            {menuOpen && createPortal(
              <div
                className="fixed bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#E2E7F1] dark:border-fd-border shadow-xl z-[9999] min-w-[160px] flex flex-col overflow-hidden actions-menu-portal"
                style={{
                  top: menuOpen.rect.bottom + 8,
                  left: menuOpen.rect.right - 160,
                }}
              >
                <button 
                  className="px-4 py-2.5 hover:bg-fd-accent flex items-center gap-2 text-sm font-medium text-fd-foreground border-b border-fd-border text-left" 
                  onClick={() => {
                    const guest = guests.find(g => g.id === menuOpen.id);
                    if (guest) {
                      setEditingGuest(guest);
                      setIsModalOpen(true);
                    }
                    setMenuOpen(null);
                  }}
                >
                  <Edit2 className="size-4 opacity-70" /> Editar Perfil
                </button>
                <button 
                  className="px-4 py-2.5 hover:bg-fd-accent flex items-center gap-2 text-sm font-medium text-red-600 text-left" 
                  onClick={() => handleDelete(menuOpen.id)}
                >
                  <Trash2 className="size-4 opacity-70" /> Excluir Registro
                </button>
              </div>,
              document.body
            )}

            <CreateGuestModal 
              isOpen={isModalOpen} 
              onClose={() => {
                setIsModalOpen(false);
                setEditingGuest(null);
              }} 
              onSave={handleSave} 
              initialData={editingGuest}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
