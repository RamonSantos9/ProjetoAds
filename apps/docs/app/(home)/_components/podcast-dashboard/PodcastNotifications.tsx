'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@xispedocs/ui/utils/cn';

const NOTIFICATIONS = [
  {
    title: 'Planejamento editorial atualizado',
    description:
      'Defina os temas dos primeiros episódios, convidados sugeridos e a ordem de publicação do semestre.',
    time: 'há 1 dia',
    image:
      'https://eleven-public-cdn.elevenlabs.io/payloadcms/tnu6dl0pv1o-MM not square.webp',
    href: '/app/home',
  },
  {
    title: 'Novo episódio em rascunho',
    description:
      'Cadastre título, descrição, capa, categoria e participantes para iniciar a produção do próximo episódio.',
    time: 'há 2 dias',
    image:
      'https://eleven-public-cdn.elevenlabs.io/payloadcms/7x0g9s46uy4-Introducing Flows Square.webp',
    href: '/app/home',
  },
  {
    title: 'Convidados pendentes de confirmação',
    description:
      'Revise os contatos dos convidados e marque quais entrevistas já foram confirmadas para gravação.',
    time: 'há 4 dias',
    image:
      'https://eleven-public-cdn.elevenlabs.io/payloadcms/39xowen1ted-In-app_Notification_320x240 (2).webp',
    href: '/app/home',
  },
  {
    title: 'Publicação e distribuição',
    description:
      'Prepare os links do Spotify, YouTube e Instagram para centralizar a divulgação dos episódios publicados.',
    time: 'há 1 semana',
    image:
      'https://eleven-public-cdn.elevenlabs.io/payloadcms/g0gh9s46uy4-Introducing Flows Square.webp',
    href: '/app/home',
  },
  {
    title: 'Métricas e relatório parcial',
    description:
      'Acompanhe episódios publicados, engajamento, feedback coletado e dados para a apresentação final.',
    time: 'há 2 semanas',
    image:
      'https://eleven-public-cdn.elevenlabs.io/payloadcms/ln6hzdtchgl-Image and video cover (1).webp',
    href: '/app/home',
  },
];

export function PodcastNotifications({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="center"
          side="bottom"
          sideOffset={8}
          className={cn(
            'z-50 max-w-[var(--radix-popover-content-available-width)] max-h-[var(--radix-popover-content-available-height)] overflow-auto bg-[#FFFFFF] dark:bg-[#121212] border border-gray-alpha-150 text-popover-foreground shadow-popover-sm duration-100 outline-none p-0 w-auto rounded-[16px]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          )}
          style={{
            // @ts-ignore
            '--radix-popover-content-transform-origin':
              'var(--radix-popper-transform-origin)',
          }}
        >
          <ul className="w-11u sm:w-14u divide-y divide-gray-alpha-200 max-h-19u overflow-y-auto">
            {NOTIFICATIONS.map((notif, index) => (
              <div key={index} className="flex p-1">
                <li className="relative p-4 transition-colors duration-200 group rounded-[14px] hover:!bg-gray-alpha-100 cursor-pointer w-full">
                  <div
                    className={cn(
                      notif.image && index > 0
                        ? 'hstack items-start gap-3'
                        : 'stack gap-4',
                    )}
                  >
                    <div>
                      <h3 className="text-gray-alpha-950 font-bold text-sm/normal">
                        <a
                          className="rounded-[14px] outline-foreground p-1 -m-1 group"
                          href={notif.href}
                        >
                          <span className="absolute inset-0 z-10"></span>
                          {notif.title}
                          {' '}
                          <span className="whitespace-nowrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              className="inline -mt-0.5 ml-1.5 w-3 h-3 transition duration-200 opacity-0 -translate-x-1 group-focus:opacity-100 group-focus:translate-x-0 group-hover:opacity-100 group-hover:translate-x-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              ></path>
                            </svg>
                          </span>
                        </a>
                      </h3>
                      <p className="mt-2 text-gray-alpha-500 text-sm">
                        {notif.description}
                      </p>
                    </div>
                    {notif.image && (
                      <img
                        className={cn(
                          'object-cover shrink-0 data-[loading]:bg-gray-alpha-100 data-[loading]:animate-pulse rounded-xl',
                          index === 0
                            ? 'w-full aspect-2 rounded-md'
                            : 'w-[120px] aspect-[4/3]',
                        )}
                        alt={notif.title}
                        src={notif.image}
                      />
                    )}
                  </div>
                  <p className="text-xs/5 text-gray-alpha-400 mt-3">
                    {notif.time}
                  </p>
                </li>
              </div>
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
