'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@xispedocs/ui/utils/cn';
import { ChevronRight, ArrowLeftRight, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getAvatarColor, getInitials } from './PodcastHeader';
import { useTheme } from 'next-themes';

function ThemeMenuItem() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { key: 'light', label: 'Claro'},
    { key: 'dark', label: 'Escuro'},
    { key: 'system', label: 'Sistema'},
  ] as const;

  const currentTheme = mounted ? theme : 'system';

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <li
          className="relative px-1"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between">
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
            'z-50 w-48 overflow-visible rounded-[10px] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur text-popover-foreground shadow-popover-sm outline-none transition-all duration-150',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Bridge to prevent gap from closing the popover */}
          <div
            className="absolute right-0 top-0 w-4 h-full translate-x-full"
            aria-hidden="true"
          />
          <div className="p-1">
            <ul className="space-y-0.5">
              {themes.map(({ key, label}) => (
                <li key={key} className="relative px-1">
                  <button
                    onClick={() => setTheme(key)}
                    className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{label}</span>
                    </span>
                    {currentTheme === key && (
                      <Check className="shrink-0 w-4 h-4 text-foreground" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
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
  const [workspaceInfo, setWorkspaceInfo] = React.useState({ name: 'Portal Administrativo', type: 'Acesso Geral', plan: 'Plano Institucional', memberCount: 1 });
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<'global' | 'individual'>('global');
  
  React.useEffect(() => {
    // Carregar escolha do workspace do localStorage
    const savedActive = localStorage.getItem('pca_active_workspace') as 'global' | 'individual';
    if (savedActive) {
      setActiveWorkspaceId(savedActive);
    }

    async function fetchWorkspace() {
      try {
        const res = await fetch('/api/workspace/config');
        if (res.ok) {
          const data = await res.json();
          setWorkspaceInfo({ 
            name: data.name, 
            type: data.type,
            plan: data.plan || 'Plano Institucional',
            memberCount: data.memberCount || 1
          });
        }
      } catch (err) {
        console.error('Erro ao buscar config do workspace:', err);
      }
    }
    fetchWorkspace();
  }, []);

  const handleSwitchWorkspace = (id: 'global' | 'individual') => {
    setActiveWorkspaceId(id);
    localStorage.setItem('pca_active_workspace', id);
    setIsSwitching(false);
  };

  const user = session?.user;

  const userName = user?.name || 'Usuário';
  const hasUserImage = !!user?.image;
  const userImage = user?.image || undefined;
  const hasIndividualWorkspace = !!(user as any)?.hasIndividualWorkspace;

  const basePath = usePathname()?.startsWith('/admin') ? '/admin' : '/dashboard';

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
            <div className="p-3 border-b border-gray-100 dark:border-white/10">
              <div className="hstack gap-3 items-center">
                <div className="w-10 h-10 shrink-0 relative">
                  {hasUserImage ? (
                    <img src={userImage} alt={userName} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 object-cover" />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold select-none border border-gray-200 dark:border-white/10"
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

            {/* Workspace Section (Toggle between Summary and Switcher) */}
            <div
              className="p-1 border-b bg-gray-alpha-50 dark:bg-transparent"
              style={{ opacity: 1 }}
            >
              <div className="bg-background dark:bg-gray-alpha-100 p-2 px-1 pb-1 w-full text-sm stack shadow-natural-xs rounded-lg transition-all duration-200">
                {!isSwitching ? (
                  /* Summary View */
                  <>
                    <div style={{ opacity: 1 }}>
                      <p
                        aria-hidden="true"
                        className="text-xs font-normal truncate overflow-ellipsis inter text-gray-alpha-500 px-2 mb-0.5"
                      >
                        Espaço de trabalho atual
                      </p>
                    </div>
                    <div style={{ height: '48px' }}>
                      <div
                        className="relative text-left w-full stack rounded-lg px-2 py-1.5 text-sm outline-none group"
                        style={{ opacity: 1 }}
                      >
                        <div className="hstack justify-between items-center">
                          <div className="stack max-w-[calc(100%-2rem)]">
                            <p className="text-sm text-foreground font-medium block truncate">
                              {activeWorkspaceId === 'individual' ? `${userName.split(' ')[0]}'s Workspace` : workspaceInfo.name}
                            </p>
                            <p className="text-xs text-subtle font-normal block truncate">
                              {activeWorkspaceId === 'individual' ? 'Espaço de Aluno' : workspaceInfo.type}
                            </p>
                          </div>
                          <div>
                            <button
                              onClick={() => setIsSwitching(true)}
                              aria-label="Alternar espaço"
                              className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-200 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 hover:border-gray-200 dark:hover:border-white/20 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-200 dark:border-white/10 rounded-md text-xs center p-0 h-6 w-6"
                            >
                              <ArrowLeftRight className="shrink-0 w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Switcher View (Design matching user request) */
                  <>
                    <div style={{ opacity: 1 }}>
                      <div className="hstack justify-between items-center px-2 mb-1.5">
                        <p className="text-xs font-normal truncate inter text-gray-alpha-500">
                          Trocar de espaço de trabalho
                        </p>
                        <button 
                          onClick={() => setIsSwitching(false)}
                          className="text-[10px] text-gray-400 hover:text-foreground transition-colors"
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                    <div>
                      <ul className="last:border-b-0 last:pb-0 last:mb-0 space-y-0.5">
                        {/* Global Workspace Option - Styling updated to show faded state */}
                        <li>
                          <button
                              type="button"
                              onClick={() => handleSwitchWorkspace('global')}
                              className={cn(
                                "relative text-left w-full stack cursor-pointer select-none rounded-[10px] px-2 py-1.5 text-sm outline-none transition-all group",
                                activeWorkspaceId === 'global' 
                                  ? "bg-gray-alpha-100 dark:bg-white/5 opacity-100" 
                                  : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                              )}
                            >
                            <div className="hstack justify-between items-center">
                              <div className="stack max-w-[calc(100%-2rem)]">
                                <div className="hstack items-center gap-1.5 truncate">
                                  <p className="text-sm text-foreground font-medium truncate">{workspaceInfo.name}</p>
                                </div>
                                <p className="text-xs text-subtle font-normal block truncate">
                                  {workspaceInfo.plan} • {workspaceInfo.memberCount} membro{workspaceInfo.memberCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                              {activeWorkspaceId === 'global' && (
                                <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                              )}
                            </div>
                          </button>
                        </li>

                        {/* Individual Workspace Option - Only show if it exists */}
                        {hasIndividualWorkspace && (
                          <li>
                            <button
                              type="button"
                              onClick={() => handleSwitchWorkspace('individual')}
                              className={cn(
                                "relative text-left w-full stack cursor-pointer select-none rounded-[10px] px-2 py-1.5 text-sm outline-none transition-all group",
                                activeWorkspaceId === 'individual' 
                                  ? "bg-gray-alpha-100 dark:bg-white/5 opacity-100" 
                                  : "hover:bg-black/5 dark:hover:bg-white/5 opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                              )}
                            >
                              <div className="hstack justify-between items-center">
                                <div className="stack max-w-[calc(100%-2rem)]">
                                  <div className="hstack items-center gap-1.5 truncate">
                                    <p className="text-sm text-foreground font-medium truncate">{`${userName.split(' ')[0]}'s Workspace`}</p>
                                  </div>
                                  <p className="text-xs text-subtle font-normal block truncate">
                                    Plano Free • 1 membro
                                  </p>
                                </div>
                                {activeWorkspaceId === 'individual' && (
                                  <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                                )}
                              </div>
                            </button>
                          </li>
                        )}

                        {/* Create/Join Option */}
                        <li className="pt-1 border-t border-gray-alpha-100 mt-1">
                          <a 
                            href={`${basePath}/settings?tab=workspaces`} 
                            className="relative text-left w-full hstack items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group"
                          >
                            <div className="flex items-center justify-center text-gray-500">
                              <svg width="18px" height="18px" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                                <path d="M9 5.25V9M9 9V12.75M9 9H5.25M9 9H12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                              </svg>
                            </div>
                            <p className="text-xs font-medium text-gray-500 group-hover:text-foreground transition-colors">
                              Criar ou entrar em um espaço de trabalho
                            </p>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="py-1">
              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-200 dark:border-white/10 border-b pb-1 mb-1">
                <MenuItem href="/settings">Configurações</MenuItem>
                <MenuItem href="/workspace">Configurações do espaço</MenuItem>
                <ThemeMenuItem />
              </ul>

              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-200 dark:border-white/10 border-b pb-1 mb-1">
                <DocsMenuItem />
                <TermsMenuItem />
              </ul>

              <ul className="last:border-b-0 last:pb-0 last:mb-0 border-gray-200 dark:border-white/10 border-b pb-1 mb-1">
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


// ---- ExternalLink icon (arrow diagonal) ----
function ExternalArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40 group-hover:opacity-70 transition-opacity">
      <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
    </svg>
  );
}

// ---- Reusable submenu shell ----
function SubMenuItem({ label, items }: { label: string; items: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <li
          className="relative px-1"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between">
            <span className="block truncate">{label}</span>
            <ChevronRight className="h-4 w-4 opacity-50 transition-transform duration-100 group-hover:opacity-100 group-hover:translate-x-0.5 shrink-0" />
          </button>
        </li>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="left"
          align="end"
          sideOffset={8}
          className={cn(
            'z-50 w-52 overflow-visible rounded-[10px] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur text-popover-foreground shadow-popover-sm outline-none transition-all duration-150',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Bridge gap */}
          <div className="absolute right-0 top-0 w-4 h-full translate-x-full" aria-hidden="true" />
          <div className="p-1">{items}</div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function DocsMenuItem() {
  const links = [
    { label: 'Documentação', href: '/docs' },
    { label: 'Registro de alterações', href: '/changelog' },
    { label: 'Central de ajuda', href: '/help' },
    { label: 'Programa de afiliados', href: '/affiliates' },
  ];
  return (
    <SubMenuItem
      label="Docs e recursos"
      items={
        <ul className="space-y-0.5">
          {links.map(({ label, href }) => (
            <li key={href} className="relative px-1">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between"
              >
                <span className="block truncate">{label}</span>
                <ExternalArrow />
              </a>
            </li>
          ))}
        </ul>
      }
    />
  );
}

function TermsMenuItem() {
  const [dataUsage, setDataUsage] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Load from API when modal opens
  const openModal = async () => {
    try {
      const res = await fetch('/api/user/data-usage');
      if (res.ok) {
        const data = await res.json();
        setDataUsage(data.dataUsageConsent);
        setPendingValue(data.dataUsageConsent);
      }
    } catch {}
    setModalOpen(true);
  };

  // Save to API on confirm
  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/data-usage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUsageConsent: pendingValue }),
      });
      if (res.ok) {
        setDataUsage(pendingValue);
        setModalOpen(false);
      }
    } catch {}
    setIsSaving(false);
  };

  const links = [
    { label: 'Termos', href: '/terms' },
    { label: 'Política de privacidade', href: '/privacy' },
    { label: 'Termos do produto', href: '/product-terms' },
  ];

  return (
    <>
      <SubMenuItem
        label="Termos e privacidade"
        items={
          <ul className="space-y-0.5">
            {links.map(({ label, href }) => (
              <li key={href} className="relative px-1">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between"
                >
                  <span className="block truncate">{label}</span>
                  <ExternalArrow />
                </a>
              </li>
            ))}
            {/* Uso de dados — abre modal */}
            <li className="relative px-1">
              <button
                onClick={openModal}
                className="relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between"
              >
                <span className="block truncate">Uso de dados</span>
                {/* Toggle visual (read-only indicator) */}
                <span
                  className={cn(
                    'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200',
                    dataUsage ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block h-3 w-3 rounded-full bg-white dark:bg-black shadow-sm ring-0 transition-transform duration-200',
                      dataUsage ? 'translate-x-3' : 'translate-x-0'
                    )}
                  />
                </span>
              </button>
            </li>
          </ul>
        }
      />

      {/* Modal de Uso de Dados */}
      {modalOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in-0"
            data-state="open"
            onClick={() => setModalOpen(false)}
          />
          {/* Dialog */}
          <div
            role="dialog"
            data-state="open"
            aria-modal="true"
            aria-labelledby="data-usage-title"
            aria-describedby="data-usage-desc"
            className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex flex-col space-y-3 text-left">
              <div className="flex flex-row items-center gap-3">
                <h2 id="data-usage-title" className="text-lg font-semibold leading-6 tracking-tight text-foreground">
                  Coleta de dados do podcast
                </h2>
                {/* Switch — ao lado do título */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={pendingValue}
                  onClick={() => setPendingValue(v => !v)}
                  className={cn(
                    'shrink-0 inline-flex items-center cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus-visible:outline-none h-6 w-11',
                    pendingValue ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none block rounded-full bg-white dark:bg-black shadow-lg ring-0 transition-all duration-150 ease-in-out h-4 w-4',
                      pendingValue ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
              <p id="data-usage-desc" className="text-sm text-black/50 dark:text-white/50">
                Autorize o uso dos dados de episódios, transcrições e métricas de reprodução do seu workspace para aprimorar os recursos de IA do PodcastAds — como sugestões de pauta, geração de roteiros e análise de audiência — melhorando a experiência para todos os criadores. Saiba mais em nossa{' '}
                <a
                  className="text-foreground font-medium underline underline-offset-2 decoration-gray-400 hover:decoration-gray-800 outline-none"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/privacy"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <button
                onClick={() => setModalOpen(false)}
                disabled={isSaving}
                className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-background border border-gray-100 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px] inline-flex disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={pendingValue === dataUsage || isSaving}
                className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-3 rounded-[10px] inline-flex disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar preferência'}
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-sm opacity-70 hover:opacity-100 outline-none text-foreground"
              aria-label="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
              <span className="sr-only">Fechar</span>
            </button>
          </div>
        </>,
        document.body
      )}
    </>
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
    'relative w-full flex cursor-pointer select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 group justify-between';
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


