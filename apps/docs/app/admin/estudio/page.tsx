'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as Popover from '@radix-ui/react-popover';
import { Share2, Copy, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@xispedocs/ui/utils/cn';

// ── Types ──────────────────────────────────────────────────────────────────────
interface StudioProject {
  id: string;
  name: string;
  tracks: unknown[];
  assets: unknown[];
  aspectRatio: string;
  lastModified: string;
  createdAt?: string;
}

// ── Utility ────────────────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).substr(2, 20);
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return diffDays === 1 ? 'ontem' : `${diffDays} dias atrás`;
  if (diffWeeks === 1) return 'semana passada';
  if (diffWeeks < 5) return `${diffWeeks} semanas atrás`;
  return `${diffMonths} meses atrás`;
}

// ── Create templates carousel items ───────────────────────────────────────────
const CREATE_ITEMS = [
  {
    id: 'podcast',
    title: 'Gerar Podcast',
    subtitle: 'Crie episódios com múltiplas vozes',
    video: 'https://storage.googleapis.com/eleven-public-cdn/video/studio/new-podcast.mp4',
    type: 'podcast',
  },
  {
    id: 'blank',
    title: 'Projeto em Branco',
    subtitle: 'Comece do zero com o editor',
    video: null,
    type: 'blank',
    gradient: 'from-indigo-500 via-purple-500 to-pink-400',
  },
  {
    id: 'audio',
    title: 'Gerar Áudio',
    subtitle: 'Gerar áudio de longa duração',
    video: 'https://storage.googleapis.com/eleven-public-cdn/video/studio/voiceover-tile.mp4',
    type: 'audio',
  },
  {
    id: 'video',
    title: 'Criar Vídeo',
    subtitle: 'Gerar um vídeo a partir de um roteiro',
    video: 'https://storage.googleapis.com/eleven-public-cdn/video/studio/faceless-video-templates/great-exit/ElevenLabs_The_Great_Exit_-_Penguin_cropped_5s.mp4',
    type: 'video',
  },
  {
    id: 'dubbing',
    title: 'Criar Dublagem',
    subtitle: 'Altere o idioma do seu conteúdo',
    video: 'https://storage.googleapis.com/eleven-public-cdn/video/studio/dub-tile.mp4',
    type: 'dubbing',
  },
];

// ── Minimal icons ─────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
    <path d="M10.3369 16.8755V12.0368M10.3369 12.0368L12.4991 13.9723M10.3369 12.0368L8.17475 13.9723M6.33691 16.8755H4.93151C3.49856 16.8755 2.33691 15.8357 2.33691 14.5529V7.19807C2.33691 5.91535 3.49856 4.87549 4.93151 4.87549H7.2186C8.08611 4.87549 8.89622 5.26359 9.37743 5.90973L9.82344 6.50857C10.1442 6.93933 10.6843 7.19807 11.2627 7.19807H15.7423C17.1753 7.19807 18.3369 8.23793 18.3369 9.52065V14.5529C18.3369 15.8357 17.1753 16.8755 15.7423 16.8755H14.3369" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/>
    <path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>
  </svg>
);
const EllipsisIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
);
const CameraOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
    <line x1="2" x2="22" y1="2" y2="22"/><path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16"/>
    <path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5"/><path d="M14.121 15.121A3 3 0 1 1 9.88 10.88"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

// ── Project Card ───────────────────────────────────────────────────────────────
function ProjectCard({ project, onDelete, view }: { project: StudioProject; onDelete: (id: string) => void; view: 'grid' | 'list' }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => router.push(`/admin/estudio/${project.id}`);

  const menuItems = [
    { label: 'Abrir projeto', icon: <ExternalLink size={14} />, onClick: handleOpen },
    { label: 'Compartilhar projeto', icon: <Share2 size={14} />, onClick: () => toast.info('Compartilhamento em breve') },
    { label: 'Duplicar projeto', icon: <Copy size={14} />, onClick: () => toast.info('Duplicação em breve') },
    { label: 'Remover projeto', icon: <Trash2 size={14} />, onClick: () => onDelete(project.id), className: 'text-red-500' },
  ];

  const PopoverMenu = () => (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "relative inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-foreground transition-all",
            view === 'list' 
              ? (isOpen ? "opacity-100 bg-gray-alpha-100" : "opacity-0 group-hover:opacity-100 hover:bg-gray-alpha-100")
              : (isOpen ? "bg-background/90 backdrop-blur ring-1 ring-gray-alpha-300" : "bg-background/90 backdrop-blur ring-1 ring-gray-alpha-200 hover:ring-gray-alpha-300")
          )}
          onClick={e => e.stopPropagation()}
        >
          <EllipsisIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 max-w-[var(--radix-popover-content-available-width)] max-h-[var(--radix-popover-content-available-height)] overflow-auto rounded-[10px] bg-popover/90 backdrop-blur text-popover-foreground shadow-popover-sm duration-100 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 p-1 w-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex h-full flex-col" cmdk-root="">
            <div className="overflow-y-auto overflow-x-hidden" cmdk-list="" role="listbox" aria-label="Suggestions">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                  }}
                  className={cn(
                    "relative flex select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-alpha-100 aria-selected:text-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50 cursor-pointer w-full transition-colors hover:bg-gray-alpha-100",
                    item.className
                  )}
                  cmdk-item=""
                  role="option"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  if (view === 'list') {
    return (
      <div
        className={cn(
          "group flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-colors",
          isOpen ? "bg-gray-alpha-50" : "hover:bg-gray-alpha-50"
        )}
        onClick={handleOpen}
      >
        <div className="shrink-0 w-40 aspect-video bg-gray-alpha-50 flex justify-center items-center rounded-lg border border-gray-alpha-100 overflow-hidden relative">
          <CameraOffIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
          <p className="text-xs text-subtle">{timeAgo(project.lastModified || project.createdAt || new Date().toISOString())}</p>
        </div>
        <div className="shrink-0">
          <PopoverMenu />
        </div>
      </div>
    );
  }

  return (
    <div
      className="group pb-1.5 cursor-pointer focus:outline-none"
      onClick={handleOpen}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleOpen()}
    >
      <div className={cn(
        "relative w-full aspect-[16/9] bg-gray-alpha-50 flex justify-center items-center overflow-hidden rounded-2xl border transition-colors",
        isOpen ? "border-gray-alpha-300" : "border-gray-alpha-100 group-hover:border-gray-alpha-300"
      )}>
        <CameraOffIcon />

        {/* Options button */}
        <div className={cn(
          "items-center absolute top-2.5 right-2.5 z-20",
          isOpen ? "flex" : "hidden md:group-hover:flex"
        )}>
          <PopoverMenu />
        </div>
      </div>
      <div className="pt-2 px-0.5">
        <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
        <p className="text-xs text-subtle">
          {timeAgo(project.lastModified || project.createdAt || new Date().toISOString())} · <span>Proprietário</span>
        </p>
      </div>
    </div>
  );
}


// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EstudioPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreating, setIsCreating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Load projects
  useEffect(() => {
    fetch('/api/studio/projects')
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  // Carousel scroll sync
  const syncScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncScroll, { passive: true });
    syncScroll();
    return () => el.removeEventListener('scroll', syncScroll);
  }, []);
  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  const createProject = async (name = 'Untitled project') => {
    setIsCreating(true);
    const newProj: StudioProject = {
      id: generateId(),
      name,
      tracks: [],
      assets: [],
      aspectRatio: '16 / 9',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/studio/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj),
      });
      if (res.ok) {
        setProjects(prev => [newProj, ...prev]);
        router.push(`/admin/estudio/${newProj.id}`);
      } else {
        toast.error('Erro ao criar projeto');
      }
    } catch {
      toast.error('Erro ao criar projeto');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteProject = async (id: string) => {
    const prev = projects;
    setProjects(p => p.filter(proj => proj.id !== id));
    try {
      await fetch(`/api/studio/projects/${id}`, { method: 'DELETE' });
      toast.success('Projeto excluído');
    } catch {
      setProjects(prev);
      toast.error('Erro ao excluir projeto');
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-8 py-8 text-fd-foreground">

      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8">
        {/* Header */}
        <header className="hidden md:flex hstack items-center justify-between gap-4 w-full mb-6">
          <div className="w-full">
            <div className="hstack justify-between items-center min-h-[2.25rem]">
              <div className="stack">
                <p className="truncate inter font-medium text-sm text-gray-500 dark:text-gray-400">Gerenciamento de Estúdio</p>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Estúdio</h1>
              </div>
              <div className="hstack gap-2">
                {/* Upload */}
                <label className="relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium cursor-pointer h-9 px-3 rounded-[10px] bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 text-foreground transition-colors">
                  <UploadIcon />
                  <span>Upload</span>
                  <input className="sr-only" type="file" accept="audio/*,video/*,image/*,.pdf,.txt,.docx" />
                </label>

                {/* New project */}
                <button
                  onClick={() => createProject()}
                  disabled={isCreating}
                  className="relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium h-9 px-3 rounded-[10px] bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <PlusIcon />
                  {isCreating ? 'Criando...' : 'Novo projeto em branco'}
                </button>
              </div>
            </div>
          </div>
        </header>


        <div>

          {/* ── Carousel "Comece agora" ── */}
          <section className="w-full flex flex-col gap-3 isolate mb-10">
            <p className="text-sm text-foreground font-medium">Comece agora</p>
            <div className="relative">
              {/* Nav arrows */}
              <div className="top-0 bottom-0 -right-2 -left-2 flex items-center justify-between absolute z-10 pointer-events-none">
                <button
                  aria-label="Anterior"
                  disabled={!canScrollLeft}
                  onClick={() => scrollCarousel('left')}
                  className="relative inline-flex items-center justify-center w-9 h-9 z-20 pointer-events-auto bg-background/90 backdrop-blur rounded-full ring-1 ring-gray-alpha-200 hover:bg-background shadow-md transition-opacity disabled:opacity-0"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  aria-label="Próximo"
                  disabled={!canScrollRight}
                  onClick={() => scrollCarousel('right')}
                  className="relative inline-flex items-center justify-center w-9 h-9 z-20 pointer-events-auto bg-background/90 backdrop-blur rounded-full ring-1 ring-gray-alpha-200 hover:bg-background shadow-md transition-opacity disabled:opacity-0"
                >
                  <ChevronRightIcon />
                </button>
              </div>

              <div
                ref={carouselRef}
                className="w-full overflow-x-auto scroll-smooth flex snap-x snap-mandatory no-scrollbar gap-3"
                style={{ mask: 'linear-gradient(90deg, white 0%, white 160px, white calc(100% - 160px), transparent 100%)' }}
              >
                {CREATE_ITEMS.map(item => (
                  <div key={item.id} className="flex-shrink-0 snap-center py-1 w-[200px]">
                    <button
                      onClick={() => createProject(item.title)}
                      className="group text-left w-full overflow-hidden shrink-0 flex flex-col relative"
                    >
                      <div className="relative w-full aspect-[9/16] rounded-xl flex shrink-0 overflow-hidden isolate">
                        {/* Hover overlay */}
                        <div className="absolute z-50 inset-0 flex items-center justify-center">
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-200 inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" />
                          <div className="relative z-10 px-3 py-1.5 bg-white text-black rounded-[8px] font-medium text-xs opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                            Criar agora
                          </div>
                        </div>
                        {/* Background */}
                        {item.video ? (
                          <video
                            src={item.video}
                            autoPlay
                            loop
                            playsInline
                            muted
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-all duration-200"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                            <PlusIcon />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col mt-2 min-w-0 truncate max-w-full">
                        <p className="text-sm text-foreground font-medium truncate text-left">{item.title}</p>
                        <p className="text-xs text-subtle font-normal truncate text-left">{item.subtitle}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Recent Projects ── */}
          <section className="flex flex-col gap-5 mt-2 mb-2 max-w-full">
            <div className="hstack justify-between items-center -mb-2">
              <p className="text-sm text-foreground font-medium">Projetos Recentes</p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {/* Search + View toggle bar */}
              <div className="relative hstack justify-between gap-1.5">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <SearchIcon />
                  </span>
                  <input
                    type="search"
                    placeholder="Buscar projetos..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex w-full border border-gray-alpha-200 bg-transparent text-sm rounded-[10px] h-10 pl-9 pr-3 placeholder:text-subtle focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="hstack gap-1">
                  <button
                    aria-label="Grade"
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-gray-alpha-100 border-gray-alpha-200' : 'bg-background border-gray-alpha-200 hover:bg-gray-alpha-50'}`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    aria-label="Lista"
                    onClick={() => setViewMode('list')}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${viewMode === 'list' ? 'bg-gray-alpha-100 border-gray-alpha-200' : 'bg-background border-gray-alpha-200 hover:bg-gray-alpha-50'}`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>

              {/* Projects */}
              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                  {search ? (
                    <>
                      <p className="text-sm font-medium text-foreground">Nenhum projeto encontrado</p>
                      <p className="text-xs text-subtle">Tente outra busca ou crie um novo projeto</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground">Sem projetos ainda</p>
                      <p className="text-xs text-subtle max-w-xs">Comece criando um novo projeto ou use um dos modelos acima</p>
                      <button
                        onClick={() => createProject()}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium h-9 px-4 rounded-[10px] bg-foreground text-background hover:opacity-90 transition-opacity"
                      >
                        <PlusIcon /> Novo projeto
                      </button>
                    </>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 w-full">
                  {filteredProjects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} onDelete={deleteProject} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  {filteredProjects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} onDelete={deleteProject} view="list" />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
