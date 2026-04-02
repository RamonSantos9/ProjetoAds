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
    id: 'inicio',
    title: 'Início',
    description: 'Página principal do Portal PodcastAds.',
    url: '/',
  },
  {
    id: 'quem-somos',
    title: 'Quem Somos',
    description: 'Conheça o projeto e a equipe da Faculdade Serra Dourada.',
    url: '/#feedback',
  },
  {
    id: 'guia',
    title: 'Guia do Ouvinte',
    description: 'Aprenda como utilizar a documentação e ouvir o Podcast.',
    url: '/docs',
  },
  {
    id: 'pautas',
    title: 'Temas das Pautas',
    description: 'Assuntos e episódios discutidos no podcast.',
    url: '/#highlights',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Área administrativa para gestão de episódios.',
    url: '/app/home',
  },
  {
    id: 'faculdade',
    title: 'Faculdade Serra Dourada',
    description: 'Site institucional oficial da nossa faculdade.',
    url: 'https://serradouradalorena.com.br',
    external: true,
  },
];

export default function PodcastSearchDialog(props: SharedProps) {
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
          Busca local do projeto PodcastAds
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
