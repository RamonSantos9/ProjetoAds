import Link from 'next/link';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackground, PreviewImages } from '../page.client';

/**
 * Seção Hero (Principal) da página.
 * Apresenta o título principal, descrição curta e os botões de ação (CTA).
 * Inclui um fundo interativo usando UnicornStudio.
 */
export function Hero() {
  return (
    <div className="relative z-2 flex flex-col border-x border-t border-dashed bg-fd-background/80 px-4 pt-12 max-md:text-center md:px-12 md:pt-16 [.uwu_&]:hidden overflow-hidden">
      {/* Componente de fundo interativo do UnicornStudio */}
      <HeroBackground />
      {/* Título adaptativo para mobile e desktop */}
      <h1 className="mb-8 text-4xl font-medium md:hidden">
        PodcastAds: Tecnologia em Pauta
      </h1>
      <h1 className="mb-8 max-w-[600px] text-4xl font-medium max-md:hidden">
        Conectando Ideias,
        <br />
        Codificando o Futuro
      </h1>
      <p className="mb-8 md:max-w-[80%] md:text-xl">
        Bem-vindo ao PodcastAds, o canal oficial da Faculdade Serra Dourada onde
        discutimos as tendências de Análise e Desenvolvimento de Sistemas.
      </p>
      {/* Grupo de botões de ação */}
      <div className="inline-flex items-center gap-3 max-md:mx-auto">
        <Link
          href="https://open.spotify.com"
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            buttonVariants({ size: 'lg', className: 'rounded-full' }),
          )}
        >
          Ouvir no Spotify
        </Link>
      </div>
      {/* Imagens de preview (animação cliente) */}
      <PreviewImages />
    </div>
  );
}
