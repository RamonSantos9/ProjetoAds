'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from '@xispedocs/ui/components/dialog/search';

const entries = [
  {
    id: 'landing',
    title: 'Landing Page',
    description: 'Pagina principal do clone ElevenLabs.',
    url: '/',
  },
  {
    id: 'hero',
    title: 'Hero',
    description: 'Secao inicial da landing page.',
    url: '/#hero',
  },
  {
    id: 'demo',
    title: 'Demo',
    description: 'Secao de teste de voz e texto para audio.',
    url: '/#demo',
  },
  {
    id: 'models',
    title: 'Modelos',
    description: 'Secao final com CTA e modelos.',
    url: '/#models',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Area interna local em /app/home.',
    url: '/app/home',
  },
  {
    id: 'docs',
    title: 'Documentacao oficial',
    description: 'Guias oficiais da ElevenLabs.',
    url: 'https://elevenlabs.io/docs',
    external: true,
  },
];

export default function ElevenLabsSearchDialog(props: SharedProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const items = useMemo<SearchItemType[]>(() => {
    const normalized = search.trim().toLowerCase();

    return entries
      .filter((entry) => {
        if (normalized.length === 0) return true;
        return `${entry.title} ${entry.description}`.toLowerCase().includes(normalized);
      })
      .map((entry) => ({
        id: entry.id,
        type: 'action',
        node: (
          <div className="flex flex-col">
            <p className="text-sm font-medium text-fd-foreground">{entry.title}</p>
            <p className="text-xs text-fd-muted-foreground">{entry.description}</p>
          </div>
        ),
        onSelect: () => {
          if (entry.external) {
            window.open(entry.url, '_blank', 'noopener,noreferrer');
            return;
          }

          router.push(entry.url);
        },
      }));
  }, [router, search]);

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={false}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={items} />
        <SearchDialogFooter className="text-xs text-fd-muted-foreground">
          Busca local do projeto PodcastADS
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
