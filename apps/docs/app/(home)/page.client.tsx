'use client';

import {
  Fragment,
  type HTMLAttributes,
  type HTMLProps,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import UnicornScene from 'unicornstudio-react/next';
import { TerminalIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import MainImg from './main.png';
import ApplePodcastsImg from './applepodcasts.png';
import YoutubeImg from './youtube.png';
import { cva } from 'class-variance-authority';

export function CreateAppAnimation() {
  const installCmd = 'npx i @xispedocs/create-app';
  const tickTime = 100;
  const timeCommandEnter = installCmd.length;
  const timeCommandRun = timeCommandEnter + 3;
  const timeCommandEnd = timeCommandRun + 3;
  const timeWindowOpen = timeCommandEnd + 1;
  const timeEnd = timeWindowOpen + 1;

  const [tick, setTick] = useState(timeEnd);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= timeEnd ? prev : prev + 1));
    }, tickTime);

    return () => {
      clearInterval(timer);
    };
  }, [timeEnd]);

  const lines: ReactElement[] = [];

  lines.push(
    <span key="command_type">
      {installCmd.substring(0, tick)}
      {tick < timeCommandEnter && (
        <div className="inline-block h-3 w-1 animate-pulse bg-white" />
      )}
    </span>,
  );

  if (tick >= timeCommandEnter) {
    lines.push(<span key="space"> </span>);
  }

  if (tick > timeCommandRun)
    lines.push(
      <Fragment key="command_response">
        {tick > timeCommandRun + 1 && (
          <>
            <span className="font-bold">◇ Nome do projeto</span>
            <span>│ meu-app</span>
          </>
        )}
        {tick > timeCommandRun + 2 && (
          <>
            <span>│</span>
            <span className="font-bold">◆ Escolha uma fonte de conteúdo</span>
          </>
        )}
        {tick > timeCommandRun + 3 && (
          <>
            <span>│ ● XispeDocs MDX (recomendado)</span>
            <span>│ ○ Content Collections</span>
          </>
        )}
      </Fragment>,
    );

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (tick >= timeEnd) {
          setTick(0);
        }
      }}
    >
      {tick > timeWindowOpen && (
        <LaunchAppWindow className="absolute bottom-5 right-4 z-10 animate-in fade-in slide-in-from-top-10" />
      )}
      <pre className="overflow-hidden rounded-xl border text-[13px] shadow-lg">
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2">
          <TerminalIcon className="size-4" />{' '}
          <span className="font-bold">Terminal</span>
          <div className="grow" />
          <div className="size-2 rounded-full bg-red-400" />
        </div>
        <div className="min-h-[200px] bg-gradient-to-b from-fd-card">
          <code className="grid p-4">{lines}</code>
        </div>
      </pre>
    </div>
  );
}

function LaunchAppWindow(
  props: HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      {...props}
      className={cn(
        'overflow-hidden rounded-md border bg-fd-background shadow-xl',
        props.className,
      )}
    >
      <div className="relative flex h-6 flex-row items-center border-b bg-fd-muted px-4 text-xs text-fd-muted-foreground">
        <p className="absolute inset-x-0 text-center">localhost:3000</p>
      </div>
      <div className="p-4 text-sm">Novo aplicativo lançado!</div>
    </div>
  );
}

function WhyPanel(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'duration-700 animate-in fade-in text-sm prose',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}

const previewButtonVariants = cva(
  'w-22 h-9 text-sm font-medium transition-colors rounded-full',
  {
    variants: {
      active: {
        true: 'text-fd-primary-foreground',
        false: 'text-fd-muted-foreground',
      },
    },
  },
);
export function PreviewImages() {
  const [active, setActive] = useState(0);
  const previews = [
    {
      image: MainImg,
      name: 'Spotify',
    },
    {
      image: YoutubeImg,
      name: 'Youtube',
    },
    {
      image: ApplePodcastsImg,
      name: 'Apple Podcasts',
    },
  ];

  return (
    <div className="mt-12 min-w-[800px] overflow-hidden xl:-mx-12 dark:[mask-image:linear-gradient(to_top,transparent,white_40px)]">
      <div className="absolute flex flex-row left-1/2 -translate-1/2 bottom-4 z-2 p-1 rounded-full bg-fd-card border shadow-xl dark:shadow-fd-background">
        <div
          role="none"
          className="absolute bg-fd-primary rounded-full w-22 h-9 transition-transform z-[-1]"
          style={{
            transform: `translateX(calc(var(--spacing) * 22 * ${active}))`,
          }}
        />
        {previews.map((item, i) => (
          <button
            key={i}
            className={cn(previewButtonVariants({ active: active === i }))}
            onClick={() => setActive(i)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {previews.map((item, i) => (
        <Image
          key={i}
          src={item.image}
          alt="preview"
          priority
          className={cn(
            'w-full select-none duration-1000 animate-in fade-in -mb-60 slide-in-from-bottom-12 lg:-mb-40',
            active !== i && 'hidden',
          )}
        />
      ))}
    </div>
  );
}

/**
 * Componente de fundo para a seção Hero usando UnicornStudio.
 * Renderiza uma cena interativa de alta performance.
 */
export function HeroBackground() {
  return (
    <div className="absolute invert pointer-events-none dark:invert-0 inset-0 z-[-1] [mask-image:linear-gradient(to_bottom,black_0%,black_1%,transparent_100%)]">
      <UnicornScene
        key="unicorn-hero-reinit-v2"
        projectId="KLgEWfo1vyTHNCI7joWK"
        className="size-full"
        scale={1}
        dpi={1}
        onLoad={() => console.log('UnicornStudio: Cena carregada com sucesso')}
        onError={(err) =>
          console.error('UnicornStudio: Erro ao carregar:', err)
        }
      />
    </div>
  );
}
