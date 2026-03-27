'use client';

import { SearchIcon, FileTextIcon } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import type { ReactElement } from 'react';

const searchItemVariants = cva(
  'flex flex-row items-center gap-2 rounded-md p-2 text-sm text-fd-popover-foreground',
);

/**
 * Componente que simula uma interface de busca.
 * Usado puramente para fins visuais e demonstração na landing page.
 */
export function Search(): ReactElement {
  return (
    <div className="mt-6 rounded-lg bg-gradient-to-b from-fd-border p-px">
      <div className="flex select-none flex-col rounded-[inherit] bg-gradient-to-b from-fd-popover">
        {/* Barra de pesquisa simulada */}
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm text-fd-muted-foreground">
          <SearchIcon className="size-4" />
          Pesquisar...
        </div>
        {/* Lista de resultados simulados */}
        <div className="border-t p-2">
          {[
            { name: 'Guia do Ouvinte', icon: FileTextIcon },
            { name: 'Episódios', icon: FileTextIcon },
            { name: 'Temas das Pautas', icon: FileTextIcon },
            { name: 'Quem Somos', icon: FileTextIcon },
            { name: 'Nossa Faculdade', icon: FileTextIcon },
          ].map((v, i) => (
            <div
              key={v.name}
              className={cn(
                searchItemVariants({
                  // Destaca o primeiro item como se estivesse selecionado
                  className: i === 0 ? 'bg-fd-accent' : '',
                }),
              )}
            >
              <v.icon className="size-4 text-fd-muted-foreground" />
              {v.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
