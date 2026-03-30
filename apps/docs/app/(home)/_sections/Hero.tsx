import Link from 'next/link';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { HeroBackground, PreviewImages } from '../page.client';

/**
 * SeÃ§Ã£o Hero (Principal) da pÃ¡gina.
 * Apresenta o tÃ­tulo principal, descriÃ§Ã£o curta e os botÃµes de aÃ§Ã£o (CTA).
 * Inclui um fundo interativo usando UnicornStudio.
 */
export function Hero() {
  return (
    <div className="relative z-2 flex flex-col border-x border-t border-dashed bg-fd-background/80 px-4 pt-12 max-md:text-center md:px-12 md:pt-16 [.uwu_&]:hidden overflow-hidden">
      {/* Componente de fundo interativo do UnicornStudio */}
      <HeroBackground />
      {/* TÃ­tulo adaptativo para mobile e desktop */}
      <h1 className="mb-8 text-4xl font-medium md:hidden">
        PodcastADS: Tecnologia em Pauta
      </h1>
      <h1 className="mb-8 max-w-[600px] text-4xl font-medium max-md:hidden">
        Conectando Ideias,
        <br />
        Codificando o Futuro
      </h1>
      <p className="mb-8 md:max-w-[80%] md:text-xl">
        Bem-vindo ao PodcastADS, o canal oficial da Faculdade Serra Dourada
        onde discutimos as tendÃªncias de AnÃ¡lise e Desenvolvimento de Sistemas.
      </p>
      {/* Grupo de botÃµes de aÃ§Ã£o */}
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
      {/* Imagens de preview (animaÃ§Ã£o cliente) */}
      <PreviewImages />
    </div>
  );
}
