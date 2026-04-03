import Link from 'next/link';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { BatteryChargingIcon, PaperclipIcon, TimerIcon } from 'lucide-react';
import { XispeDocsIcon } from '@/app/layout.client';


/**
 * Rodapé/Seção de encerramento da página.
 * Inclui uma chamada visual grande e uma lista de benefícios rápidos com links.
 */
export function End() {
  return (
    <div className="flex flex-col border-b border-r border-dashed md:flex-row *:border-l *:border-t *:border-dashed">
      {/* Bloco visual esquerda: Título atraente com efeito hover */}
      <div className="group flex flex-col min-w-0 flex-1 pt-8 **:transition-colors">
        <h2 className="text-3xl text-center font-extrabold font-mono uppercase text-fd-muted-foreground mb-4 lg:text-4xl group-hover:text-green-500">
          Participe do PodcastAds
        </h2>
        <p className="text-center font-mono text-xs text-fd-foreground/60 mb-8 group-hover:text-green-500/80">
          Sua voz conta. O futuro da tecnologia na Serra Dourada passa por aqui.
        </p>
        {/* Elemento decorativo circular com gradiente radial */}
        <div className="h-[200px] overflow-hidden p-8 flex items-center justify-center bg-gradient-to-b from-fd-primary/10 group-hover:from-green-500/10">
          <XispeDocsIcon className="size-[150px] text-fd-primary/20 group-hover:text-green-500/30 transition-all duration-700" />
        </div>
      </div>

      {/* Bloco direita: Lista de características principais e CTAs */}
      <ul className="flex flex-col gap-4 p-6 pt-8">
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <BatteryChargingIcon className="size-5" />
            Conhecimento Prático.
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Discussões sobre lógica, soft skills e carreira em ADS.
          </span>
        </li>
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <PaperclipIcon className="size-5" />
            Parcerias de Sucesso.
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Conexão direta com profissionais e empresas do mercado.
          </span>
        </li>
        <li>
          <span className="flex flex-row items-center gap-2 font-medium">
            <TimerIcon className="size-5" />
            Espaço Colaborativo.
          </span>
          <span className="mt-2 text-sm text-fd-muted-foreground">
            Iniciativa feita de alunos para alunos da Serra Dourada.
          </span>
        </li>
        {/* Botões de ação final */}
        <li className="flex flex-row flex-wrap gap-2 mt-auto">
          <Link 
            href="https://open.spotify.com" 
            target="_blank" 
            rel="noreferrer noopener" 
            className={cn(buttonVariants())}
          >
            Ouvir no Spotify
          </Link>
        </li>
      </ul>
    </div>
  );
}
