import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic2, MousePointer, PlayCircle, Radio, Users } from 'lucide-react';
import { EpisodeCard } from '@/components/episodes/EpisodeCard';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { createMetadata } from '@/lib/metadata';
import { readDb } from '@/lib/db';

export const metadata: Metadata = createMetadata({
  title: 'Episódios',
  description:
    'Biblioteca pública do PodcastAds com episódios, pautas em andamento e visão geral do projeto.',
});

export const dynamic = 'force-dynamic';

export default async function EpisodesPage() {
  const dbData = await readDb();
  const featuredEpisodes = dbData.episodes;
  
  const publicStats = [
    { label: 'Episódios cadastrados', value: String(featuredEpisodes.length) },
    { label: 'Frentes do projeto', value: String(new Set(featuredEpisodes.map(ep => ep.category).filter(Boolean)).size || 1) },
    { label: 'Trilhas de conteúdo', value: String(new Set(featuredEpisodes.flatMap(ep => ep.guests)).size || 1) },
    { label: 'Acesso', value: 'Público' },
  ];

  return (
    <main className="container relative z-2 max-w-[1100px] px-2 py-4 lg:py-8">
      <div
        className="overflow-hidden border-x border border-dashed border-fd-border"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
        }}
      >
        <section className="relative overflow-hidden px-5 py-14 md:px-10">
          <div
            className="absolute inset-0 z-[-1]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, var(--color-fd-secondary), transparent 80%)',
              opacity: 0.5,
            }}
          />
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Episódios, pautas e atualizações do PodcastAds.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-fd-muted-foreground md:text-lg">
            Esta área apresenta os episódios já publicados, os temas em
            desenvolvimento e a proposta de conteúdo do projeto de extensão.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
              Voltar para o portal
            </Link>
            <Link
              href="/docs"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Entender o projeto
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-full flex flex-row items-start justify-center border-t border-dashed p-8 pb-2 text-center bg-transparent">
            <h2 className="bg-fd-primary text-fd-primary-foreground px-2 text-2xl font-semibold">
              Estatísticas
            </h2>
            <MousePointer className="-ml-1 mt-8" />
          </div>

          {publicStats.map((stat) => (
            <div key={stat.label} className="border-l border-t border-dashed px-6 py-12 bg-transparent">
              <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
                <h2 className="text-sm font-medium">{stat.label}</h2>
              </div>
              <span className="text-4xl font-semibold">{stat.value}</span>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full flex flex-row items-start justify-center border-t border-dashed p-8 pb-2 text-center bg-transparent">
            <h2 className="bg-fd-primary text-fd-primary-foreground px-2 text-2xl font-semibold">
              Programação de Episódios
            </h2>
            <Radio className="-ml-1 mt-8" />
          </div>

          {featuredEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.slug}
              episode={episode}
              href={`/episodio/${episode.slug}`}
              className="px-2 py-6 bg-transparent"
            />
          ))}
        </section>
      </div>
    </main>
  );
}
