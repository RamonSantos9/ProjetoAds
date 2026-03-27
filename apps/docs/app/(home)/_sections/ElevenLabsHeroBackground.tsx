'use client';

import UnicornScene from 'unicornstudio-react/next';

/**
 * Componente de fundo customizado para a página ElevenLabs.
 * Idêntico ao HeroBackground do XispeDocs que está funcionando.
 */
export function ElevenLabsHeroBackground() {
  return (
    <div className="absolute invert pointer-events-none dark:invert-0 inset-0 z-[-1] [mask-image:linear-gradient(to_bottom,black_0%,black_1%,transparent_100%)]">
      <UnicornScene
        key="unicorn-hero-reinit-v2"
        projectId="vjlBDlFMNVcJVGT2LkFa"
        className="size-full"
        scale={1}
        dpi={3}
        onLoad={() => console.log('UnicornStudio: Cena carregada com sucesso')}
        onError={(err: unknown) =>
          console.error('UnicornStudio: Erro ao carregar:', err)
        }
      />
    </div>
  );
}
