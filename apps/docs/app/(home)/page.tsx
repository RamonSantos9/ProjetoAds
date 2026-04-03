/**
 * @file apps/docs/app/(home)/page.tsx
 * @description Página inicial do PodcastAds.
 * Este arquivo serve como o container principal da landing page,
 * importando as seções modulares da pasta _sections.
 */

import { UwuHero } from '@/app/(home)/uwu';
import { Hero } from './_sections/Hero';
import { LatestEpisodes } from './_sections/LatestEpisodes';
import { Features } from './_sections/Features';
import { Highlights } from './_sections/Highlights';
import { Architecture } from './_sections/Architecture';
import { Contributors } from './_sections/Contributors';
import { End } from './_sections/End';
import { Feedback } from './_sections/Feedback';

export const dynamic = 'force-dynamic';

/**
 * Componente principal da Landing Page do PodcastAds.
 * 
 * Organiza as seções modulares em uma estrutura vertical com 
 * gradientes de fundo e bordas estilizadas.
 * 
 * @returns {JSX.Element} Estrutura da página inicial.
 */
export default function Page() {
  return (
    <>
      <main className="container relative max-w-[1100px] px-2 py-4 z-2 lg:py-8">
        <div
          style={{
            background:
              'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
          }}
        >
          {/* Seção Hero e Uwu */}
          <div className="relative">
            <Hero />
            <UwuHero />
          </div>

          {/* Últimos Episódios Dinâmicos */}
          <LatestEpisodes />

          {/* Seção de depoimentos/feedbacks */}
          <Feedback />

          {/* Banner de transição estilizado */}
          <div
            className="relative overflow-hidden border-x border-t border-dashed px-8 py-16 sm:py-24"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, var(--color-fd-secondary), var(--color-fd-background) 40%)',
            }}
          >
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">
              Voz da Comunidade Acadêmica.
              <br />
              Conexão Real com o Mercado.
            </h2>
          </div>

          {/* Demais blocos de conteúdo modulares */}
          <Features />
          <Highlights />
          <Architecture />
          <Contributors />
          <End />
        </div>
      </main>
    </>
  );
}
