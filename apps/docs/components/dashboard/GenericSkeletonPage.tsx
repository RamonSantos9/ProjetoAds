'use client';

import React from 'react';
import { 
  Search, 
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { 
  ActionButtonRefined 
} from '@/components/ui/RefinedComponents';
import { usePathname } from 'next/navigation';

export default function GenericSkeletonPage({ title, icon: Icon, description }: { title: string, icon: any, description: string }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8">
      <main className="max-w-6xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Sync Header with RelatoriosPage */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / {title}
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              {title}
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                {description}
              </p>
              <ActionButtonRefined 
                label={`Novo ${title.slice(0, -1)}`} 
                icon={<Plus className="size-5" />}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Toolbar - Standardized from Relatorios */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-[400px]">
                <input
                  className="w-full bg-background border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground placeholder:text-[#6F6F88] focus:outline-none transition-colors"
                  placeholder={`Pesquisar em ${title.toLowerCase()}...`}
                  disabled
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-background" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="h-8 flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-sm text-background transition-all w-full sm:w-auto">
                  <Filter className="size-4" /> Filtros
                </button>
                <button className="h-8 flex items-center justify-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] border rounded-lg px-4 text-sm text-background transition-colors w-full sm:w-auto">
                  <Download className="size-4" /> Exportar
                </button>
              </div>
            </div>

            {/* Empty State / List Placeholder */}
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#E2E7F1] gap-4 mt-4">
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-bold text-fd-foreground">Nenhum registro encontrado</p>
                <p className="text-xs text-[#74748D] dark:text-fd-muted-foreground">Comece criando um novo registro para visualizar aqui.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
