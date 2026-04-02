import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PaperclipIcon, SearchIcon, FileEditIcon, type LucideIcon } from 'lucide-react';
import SourceImage from '@/public/source.png';
import { Search } from './Search';

/**
 * Seção de Funcionalidades Principais (Features).
 * Uma grade detalhada de componentes de destaque com exemplos visuais.
 */
export function Features() {
  return (
    <div className="grid grid-cols-1 border-r border-dashed md:grid-cols-2">
      {/* Funcionalidade: Agnóstico à Fonte (CMS, MDX, etc) */}
      <Feature
        icon={PaperclipIcon}
        subheading="Pautas Diversas"
        heading="Sua pauta. Sua voz."
        description={
          <>
            <span className="font-medium text-fd-foreground">
              Abordamos todos os pilares da tecnologia:{' '}
            </span>
            <span>
              O PodcastAds discute desde a lógica de programação até as soft
              skills necessárias para brilhar na Serra Dourada.
            </span>
          </>
        }
        className="overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 60% 50%,var(--color-fd-secondary),var(--color-fd-background) 80%)',
        }}
      >
        <div className="mt-8 flex flex-col">
          {/* Ilustração e simulador de editor MDX */}
          <Image
            alt="Source"
            src={SourceImage}
            sizes="600px"
            className="-mt-12 ml-24 w-[400px] min-w-[400px] invert pointer-events-none dark:invert-0"
          />
          <div className="z-2 mt-[-170px] w-[300px] overflow-hidden rounded-lg border border-fd-foreground/10 shadow-xl backdrop-blur-lg">
            <div className="flex flex-row items-center gap-2 bg-fd-muted/50 px-4 py-2 text-xs font-medium text-fd-muted-foreground">
              <FileEditIcon className="size-4" />
              Editor de Pautas
            </div>
            <pre className="p-4 text-[13px]">
              <code className="grid">
                <span className="font-medium"># PodcastAds</span>
                <span>O canal de tecnologia da Serra Dourada.</span>
                <span>{` `}</span>
                <span className="font-medium">{`<Spotlight episódio="01" />`}</span>
              </code>
            </pre>
          </div>
        </div>
      </Feature>

      {/* Funcionalidade: Integração de Busca (Algolia, Orama) */}
      <Feature
        icon={SearchIcon}
        subheading="Explore nosso Acervo"
        heading="Aprenda a qualquer momento."
        description="Acesse nossa biblioteca completa de episódios gravados e artigos complementares."
      >
        <Link
          href="/docs"
          className={cn(
            buttonVariants({ variant: 'outline', className: 'mt-4' }),
          )}
        >
          Ver Biblioteca
        </Link>
        <Search />
      </Feature>
    </div>
  );
}

/**
 * Layout base para uma funcionalidade de Feature.
 */
function Feature({
  className,
  icon: Icon,
  heading,
  subheading,
  description,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  icon: LucideIcon;
  subheading: ReactNode;
  heading: ReactNode;
  description: ReactNode;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'border-l border-t border-dashed px-6 py-12 md:py-16',
        className,
      )}
      {...props}
    >
      <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
        <Icon className="size-4" />
        <p>{subheading}</p>
      </div>
      <h2 className="mb-2 text-lg font-semibold">{heading}</h2>
      <p className="text-fd-muted-foreground">{description}</p>

      {/* Conteúdo dinâmico da feature */}
      {props.children}
    </div>
  );
}
