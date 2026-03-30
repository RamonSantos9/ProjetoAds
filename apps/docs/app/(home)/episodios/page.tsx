import type { Metadata } from 'next';
import Link from 'next/link';
import { Mic2, MousePointer, PlayCircle, Radio, Users } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { createMetadata } from '@/lib/metadata';
import { featuredEpisodes, publicStats } from '../_data/episodes';

export const metadata: Metadata = createMetadata({
  title: 'Episódios',
  description:
    'Biblioteca pública do PodcastADS com episódios, pautas em andamento e visão geral do projeto.',
});

export default function EpisodesPage() {
  return (
    <main className="container relative z-2 max-w-[1100px] px-2 py-4 lg:py-8">
      <div
        className="overflow-hidden border-x border-t border-dashed border-fd-border"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
        }}
      >
        <section className="relative overflow-hidden border-b border-dashed bg-fd-background/80 px-5 py-14 md:px-10">
          <div
            className="absolute inset-0 z-[-1]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, var(--color-fd-secondary), transparent 80%)',
              opacity: 0.5,
            }}
          />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fd-muted-foreground">
            Biblioteca Pública
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Episódios, pautas e atualizações do PodcastADS.
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
              href="/projeto"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Entender o projeto
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 border-r border-dashed border-fd-border md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-full flex flex-row items-start justify-center border-l border-t border-dashed border-fd-border p-8 pb-2 text-center bg-transparent">
            <h2 className="bg-fd-primary text-fd-primary-foreground px-2 text-2xl font-semibold">
              Estatísticas
            </h2>
            <MousePointer className="-ml-1 mt-8" />
          </div>

          {publicStats.map((stat) => (
            <div key={stat.label} className="border-l border-t border-dashed border-fd-border px-6 py-12 bg-transparent">
              <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
                <h2 className="text-sm font-medium">{stat.label}</h2>
              </div>
              <span className="text-4xl font-semibold">{stat.value}</span>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 border-r border-dashed border-fd-border md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full flex flex-row items-start justify-center border-l border-t border-dashed border-fd-border p-8 pb-2 text-center bg-transparent">
            <h2 className="bg-fd-primary text-fd-primary-foreground px-2 text-2xl font-semibold">
              Programação de Episódios
            </h2>
            <Radio className="-ml-1 mt-8" />
          </div>

          {featuredEpisodes.map((episode) => (
            <article
              key={episode.slug}
              className="border-l border-t border-dashed border-fd-border px-6 py-12 bg-transparent flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
                <span className="rounded-full bg-fd-primary/10 px-2.5 py-1 font-medium text-fd-primary">
                  {episode.category}
                </span>
                <span className="rounded-full border border-black/10 dark:border-white/10 px-2.5 py-1 text-fd-muted-foreground">
                  {episode.duration}
                </span>
                <span className="rounded-full border border-black/10 dark:border-white/10 px-2.5 py-1 text-fd-muted-foreground">
                  {episode.status}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-3">{episode.title}</h3>
              <p className="text-sm leading-6 text-fd-muted-foreground mb-6 flex-1">
                {episode.summary}
              </p>

              <div className="flex flex-col gap-3 text-sm text-fd-muted-foreground mt-auto">
                <div className="flex items-center gap-2">
                  <Users className="size-4 shrink-0 text-fd-primary" />
                  <span className="font-medium line-clamp-1">{episode.guests.join(' • ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="size-4 shrink-0 text-fd-primary" />
                  <span className="font-medium">{episode.platforms.join(' • ')}</span>
                </div>
              </div>
            </article>
          ))}

          <aside className="border-l border-t border-dashed border-fd-border px-6 py-12 bg-transparent flex flex-col">
            <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
              <Mic2 className="size-4" />
              <h2 className="text-sm font-medium">Como acompanhar</h2>
            </div>
            
            <span className="text-base font-medium leading-7 mb-6 block">
              O portal concentra informações sobre o projeto, episódios, temas em pauta e canais de divulgação da equipe.
            </span>

            <ul className="space-y-4 text-sm text-fd-muted-foreground mt-auto">
              <li className="flex gap-3 items-start"><span className="text-fd-primary font-bold mt-0.5">•</span> Spotify para distribuição principal dos episódios.</li>
              <li className="flex gap-3 items-start"><span className="text-fd-primary font-bold mt-0.5">•</span> YouTube e Instagram para cortes, chamadas e divulgação.</li>
              <li className="flex gap-3 items-start"><span className="text-fd-primary font-bold mt-0.5">•</span> Dashboard interno para operação, publicação e acompanhamento.</li>
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
