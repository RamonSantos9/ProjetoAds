import Link from 'next/link';
import { PlayCircle, Users } from 'lucide-react';
import { readDb } from '@/lib/db';

/**
 * Seção que lista os últimos episódios na página Inicial.
 */
export async function LatestEpisodes() {
  const dbData = await readDb();
  // Pega os 3 episódios mais recentes
  const latest = dbData.episodes.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <div className="relative border-x border-t border-dashed bg-fd-background p-8 md:p-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-fd-primary">Últimos Lançamentos</h2>
          <p className="mt-2 text-2xl font-semibold md:text-3xl">Pautas recentes do PodcastAds</p>
        </div>
        <Link 
          href="/episodios" 
          className="text-sm font-medium text-fd-primary hover:underline"
        >
          Ver todos os episódios &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latest.map((episode) => (
          <Link
            key={episode.slug}
            href={`/episodio/${episode.slug}`}
            className="flex flex-col group relative overflow-hidden border transition-all duration-200"
          >
            {/* Pseudo-capa gradiente simples baseada no categoria */}
            <div className="h-32 w-full bg-gradient-to-br from-fd-primary/10 to-fd-primary/30 flex items-center justify-center border-b">
               <span className="text-4xl opacity-50 shrink-0">🎙️</span>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded-full">
                  {episode.category}
                </span>
                <span className="text-xs text-fd-muted-foreground">{episode.duration}</span>
              </div>
              
              <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-fd-primary transition-colors mb-2">
                {episode.title}
              </h3>
              <p className="line-clamp-2 text-sm text-fd-muted-foreground mb-4 flex-1">
                {episode.summary}
              </p>
              
              <div className="flex flex-col gap-2 mt-auto text-xs text-fd-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span className="truncate">{episode.guests?.join(' • ') || 'Sem Convidados'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PlayCircle className="size-3.5" />
                  <span className="truncate">{episode.platforms?.join(' • ') || 'Sem Plataforma'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
