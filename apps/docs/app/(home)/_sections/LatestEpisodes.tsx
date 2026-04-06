import Link from 'next/link';
import { EpisodeCard } from '@/components/episodes/EpisodeCard';
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
          <h2 className="text-sm font-medium text-fd-primary">
            Últimos Lançamentos
          </h2>
          <p className="mt-2 text-2xl font-semibold md:text-3xl">
            Pautas recentes do PodcastAds
          </p>
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
          <EpisodeCard
            key={episode.slug}
            episode={episode}
            href={`/episodio/${episode.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
