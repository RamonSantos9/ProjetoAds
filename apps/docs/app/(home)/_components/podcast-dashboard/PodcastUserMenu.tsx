'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@xispedocs/ui/utils/cn';
import { ChevronRight, ArrowLeftRight, LogOut, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getAvatarColor, getInitials } from './PodcastHeader';

function ThemeMenuItem() {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <li
          className="relative px-1"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-gray-alpha-100 hover:text-foreground group justify-between">
            <span className="block truncate">
              <span>Tema</span>
            </span>
            <div className="flex h-4 w-4 items-center justify-center opacity-50 rotate-0 transition-transform duration-100 group-hover:opacity-100 group-hover:translate-x-0.5">
              <ChevronRight className="h-4 w-4 min-w-fit" />
            </div>
          </button>
        </li>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="left"
          align="end"
          sideOffset={8}
          className={cn(
            'z-50 w-56 overflow-visible rounded-[10px] bg-popover/90 backdrop-blur text-popover-foreground shadow-popover-sm outline-none transition-all duration-150',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'mb-[-5px]',
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 w-4 h-full translate-x-full"
            aria-hidden="true"
          />
          <div className="overflow-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="py-1">
              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-alpha-200 border-b pb-1 mb-1">
                <li className="relative px-1">
                  <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-gray-alpha-100 hover:text-foreground group justify-between">
                    <span className="block truncate">
                      <span>Claro</span>
                    </span>
                    <Check className="shrink-0 w-4 h-4 text-foreground opacity-50" />
                  </button>
                </li>
                <li className="relative px-1">
                  <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-gray-alpha-100 hover:text-foreground group justify-between">
                    <span className="block truncate">
                      <span>Escuro</span>
                    </span>
                  </button>
                </li>
                <li className="relative px-1">
                  <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-gray-alpha-100 hover:text-foreground group justify-between">
                    <span className="block truncate">
                      <span>Sistema</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function PodcastUserMenu({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const user = session?.user;
  const userRole = (user as any)?.role || 'USUARIO';
  
  const roleLabel = {
    'ADMIN': 'Administrador',
    'PROFESSOR': 'Professor',
    'ALUNO': 'Aluno',
    'USUARIO': 'Usuário'
  }[userRole as string] || 'Usuário';

  const userName = user?.name || 'Usuário';
  const hasUserImage = !!user?.image;
  const userImage = user?.image || undefined;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          side="bottom"
          sideOffset={8}
          className={cn(
            'z-50 w-64 overflow-visible rounded-[10px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md text-popover-foreground shadow-popover-sm outline-none transition-all duration-150',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 flex flex-col p-0',
          )}
          style={{
            // @ts-ignore
            '--radix-popover-content-transform-origin':
              'var(--radix-popper-transform-origin)',
          }}
        >
          <div className="overflow-auto" style={{ scrollbarWidth: 'thin' }}>
            {/* User Profile Summary */}
            <div className="p-3 border-b border-gray-alpha-150">
              <div className="hstack gap-3 items-center">
                <div className="w-10 h-10 shrink-0 relative">
                  {hasUserImage ? (
                    <img src={userImage} alt={userName} className="w-10 h-10 rounded-full border border-gray-alpha-200 object-cover" />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold select-none border border-gray-alpha-200"
                      style={{ backgroundColor: getAvatarColor(userName), fontSize: '18px' }}
                    >
                      {getInitials(userName)}
                    </div>
                  )}
                </div>
                <div className="stack gap-0.5 overflow-hidden">
                  <p className="text-sm font-semibold truncate text-foreground">{user?.name || 'Carregando...'}</p>
                  <div className="hstack items-center gap-1.5">
                    <p className="text-[11px] text-subtle truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Workspace Section */}
            <div
              className="p-1 border-b bg-gray-alpha-50 dark:bg-transparent"
              style={{ opacity: 1 }}
            >
              <div className="bg-background dark:bg-gray-alpha-100 p-2 px-1 pb-1 w-full text-sm stack shadow-natural-xs rounded-lg">
                <div style={{ opacity: 1 }}>
                  <p
                    aria-hidden="true"
                    className="text-xs font-normal truncate overflow-ellipsis inter text-gray-alpha-500 px-2 mb-0.5"
                  >
                    Espaço de trabalho atual
                  </p>
                </div>
                <div style={{ height: '48px' }}>
                  <div>
                    <div
                      className="relative text-left w-full stack rounded-lg px-2 py-1.5 text-sm outline-none group"
                      style={{ opacity: 1 }}
                    >
                      <div className="hstack justify-between items-center">
                        <div className="stack max-w-[calc(100%-2rem)]">
                          <p className="text-sm text-foreground font-medium block truncate">
                            {userRole === 'ALUNO' ? 'Meu Workspace' : 'Portal Administrativo'}
                          </p>
                          <p className="text-xs text-subtle font-normal block truncate">
                            {userRole === 'ALUNO' ? 'Espaço de Aluno' : 'Acesso Geral'}
                          </p>
                        </div>
                        <div>
                          <button
                            aria-label="Alternar espaço"
                            className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 rounded-md text-xs center p-0 h-6 w-6"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-arrow-left-right shrink-0 w-3 h-3"
                            >
                              <path d="M8 3 4 7l4 4"></path>
                              <path d="M4 7h16"></path>
                              <path d="m16 21 4-4-4-4"></path>
                              <path d="M20 17H4"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="py-1">
              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-alpha-200 border-b pb-1 mb-1">
                <MenuItem href="/settings">Configurações</MenuItem>
                <MenuItem href="/workspace">Configurações do espaço</MenuItem>
                <MenuItem href="/subscription">Assinatura</MenuItem>
                <MenuItem>Dicionários de pronúncia</MenuItem>
                <ThemeMenuItem />
              </ul>

              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-alpha-200 border-b pb-1 mb-1">
                <MenuItem href="/payouts">Pagamentos</MenuItem>
                <MenuItem>Torne-se um afiliado</MenuItem>
                <MenuItem>Candidatar-se ao Programa de Impacto</MenuItem>
                <MenuItem href="/developers/usage">Análise de uso</MenuItem>
              </ul>

              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-alpha-200 border-b pb-1 mb-1">
                <MenuItem href="/voiceover-studio">
                  Estúdio de Voiceover
                </MenuItem>
                <MenuItem href="/ai-classifier">
                  Classificador de Voz IA
                </MenuItem>
                <MenuItem hasSubmenu>Docs e recursos</MenuItem>
                <MenuItem hasSubmenu>Termos e privacidade</MenuItem>
              </ul>

              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-alpha-200 border-b pb-1 mb-1">
                <li className="relative px-1">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/sign-in' })}
                    className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-red-500/10 hover:text-red-500 group justify-between"
                  >
                    <span className="block truncate">
                      <span className="inline-block mr-1.5 align-top translate-y-[3px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 16 16"
                          fill="none"
                          color="currentColor"
                          className="w-4"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.6667 11.3333L14 8m0 0L10.6667 4.66667M14 8H6m0-6H5.2c-1.1201 0-1.68016 0-2.10798.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2v5.6c0 1.1201 0 1.6802.21799 2.108C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H6"
                          ></path>
                        </svg>
                      </span>
                      <span>Sair da conta</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function MenuItem({
  children,
  href,
  hasSubmenu,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  hasSubmenu?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <span className="block truncate text-sm">
      <span>{children}</span>
    </span>
  );

  const className =
    'relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-gray-alpha-100 hover:text-foreground group justify-between';
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/admin') ? '/admin' : '/dashboard';

  if (href) {
    return (
      <li className="relative px-1">
        <a href={`${basePath}${href}`} className={className}>
          {content}
          {hasSubmenu && (
            <ChevronRight className="h-4 w-4 opacity-50 transition-transform duration-100 group-hover:opacity-100 group-hover:translate-x-0.5" />
          )}
        </a>
      </li>
    );
  }

  return (
    <li className="relative px-1">
      <button onClick={onClick} className={className}>
        {content}
        {hasSubmenu && (
          <ChevronRight className="h-4 w-4 opacity-50 transition-transform duration-100 group-hover:opacity-100 group-hover:translate-x-0.5" />
        )}
      </button>
    </li>
  );
}
