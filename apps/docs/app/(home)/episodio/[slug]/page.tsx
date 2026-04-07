'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EpisodeInlinePlayer } from '../../_components/EpisodeInlinePlayer';

export default function PublicEpisodePage() {
  const { slug } = useParams();
  const [episode, setEpisode] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/episodes/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setEpisode(data);
        } else {
          setEpisode(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-[400px] w-full max-w-4xl" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-fd-foreground mb-4">
          Episódio não encontrado
        </h1>
        <p className="text-fd-muted-foreground mb-8">
          O link que você acessou pode estar expirado ou incorreto.
        </p>
        <Link
          href="/"
          className="text-fd-primary hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="size-4" /> Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <main className="container relative z-2 max-w-[1100px] px-2 py-4 lg:py-8">
      <div
        className="overflow-hidden border-x border border-dashed border-fd-border min-h-screen"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
        }}
      >
        {/* Centered Content Column */}
        <div className="max-w-3xl mx-auto w-full">
          {/* Episode Header Section */}
          <section className="relative overflow-hidden px-6 py-12 md:px-10">
            <div className="absolute inset-0 z-[-1]" />

            <Link
              href="/episodios"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-primary transition-colors mb-6 group"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Voltar para Episódios
            </Link>

            <div className="flex flex-col">
              <h1 className="mb-4 text-4xl md:text-5xl tracking-tight">
                {episode.title}
              </h1>

              <p className="mb-8 max-w-[650px] text-lg text-fd-muted-foreground leading-relaxed">
                {episode.summary}
              </p>

              {/* Integrated Audio Player (Componentized) */}
              <EpisodeInlinePlayer episode={episode} />
            </div>
          </section>
          {/* Transcription Section */}
          <div className="p-6 md:p-10">
            <section className="relative text-left">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl flex items-center gap-3">
                  Transcrição Inteligente
                </h2>
              </div>

              <div className="max-w-2xl space-y-8 leading-[1.8] text-xl">
                {episode?.transcriptionText ? (
                  episode.transcriptionText
                    .trim()
                    .split(/\n|\\n/)
                    .map((line: string, i: number) => {
                      // Handle both "[00:00] Text" and "00:00 Text" formats
                      const timestampMatch = line.match(/^\[?(\d{1,2}:\d{2})\]?\s*(.*)/);
                      
                      if (!timestampMatch) {
                        // Fallback: just show the line if it doesn't match a timestamp pattern
                        return line.trim() ? (
                          <div key={i} className="mb-2">
                            <p className="text-fd-foreground">{line}</p>
                          </div>
                        ) : null;
                      }

                      const [, time, text] = timestampMatch;

                      return (
                        <div key={i} className="group/line flex gap-6 items-start mb-6">
                          <span className="text-sm font-mono text-fd-muted-foreground tabular-nums shrink-0 mt-1 opacity-40 group-hover/line:opacity-100 transition-opacity">
                            {time}
                          </span>
                          <p className="selection:bg-fd-primary/20 text-fd-foreground/90 leading-relaxed hover:text-fd-foreground transition-colors cursor-default flex-1">
                            {text}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <div className="py-20 text-center border border-dashed border-fd-border">
                    <p className="text-fd-muted-foreground">
                      Transcrição em fase de processamento...
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
