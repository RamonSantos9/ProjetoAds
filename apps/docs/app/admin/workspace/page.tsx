'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';

export default function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = React.useState('Meu Workspace');

  React.useEffect(() => {
    const saved = localStorage.getItem('pca_workspace_name');
    if (saved) setWorkspaceName(saved);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background transition-colors duration-300">
      <div className="stack min-h-[100dvh] pt-[max(0px,calc(var(--eleven-header-height)+var(--eleven-banner-height)))] box-border max-[1023px]:pt-[calc(var(--eleven-header-height)+var(--eleven-banner-height)+var(--eleven-mobile-tabs-height))] max-[1023px]:pb-[calc(var(--eleven-player-height)+var(--eleven-footer-height))] lg:transition-[padding_200ms_cubic-bezier(0.42,0,0.58,1)] lg:w-full lg:mx-auto lg:pb-[var(--eleven-player-height)] px-5">
        <div className="relative w-full max-h-[88px] min-h-[20px] overflow-hidden">
          <div className="relative w-full pb-0 xl:pb-[calc(50%-576px)]"></div>
        </div>
        
        <header className="hidden md:flex flex-col gap-4 max-w-6xl mx-auto w-full border-b border-gray-200 dark:border-white/10 mb-4">
          <div className="w-full">
            <div className="w-full pb-4">
              <div className="w-full flex justify-between items-center min-h-[2.25rem]">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 data-testid="page-title" className="font-waldenburg-ht text-2xl text-foreground font-semibold">Configurações do workspace</h1>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between items-center !-mt-2">
              <div className="w-full">
                <nav className="inline-flex text-subtle w-full h-11 pt-0.5 overflow-x-auto overflow-y-auto md:overflow-x-visible md:overflow-y-visible no-scrollbar gap-1.5 -mb-[1px] border-none !mt-0">
                  <Link href="/admin/workspace" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-black dark:border-white text-foreground px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Geral</div>
                  </Link>
                  <Link href="/admin/workspace/members" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Membros</div>
                  </Link>
                  <Link href="/admin/workspace/groups" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Grupos</div>
                  </Link>
                  <Link href="/admin/workspace/notifications" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Notificações</div>
                  </Link>
                  <Link href="/admin/workspace/resources" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Recursos</div>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8">
          <div>
            <main className="flex flex-col mx-auto divide-y divide-gray-100 dark:divide-white/10">
              {/* Seção Alterar Nome */}
              <section className="relative flex items-center justify-between gap-3 py-4">
                <div className="flex flex-col">
                  <p className="text-md text-foreground font-medium">Nome do Espaço de Trabalho</p>
                  <p className="text-sm text-black/50 dark:text-white/50 font-normal">{workspaceName}</p>
                </div>
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px]">
                  Alterar Nome do Workspace
                </button>
              </section>

              {/* Seção Acesso */}
              <section className="relative flex gap-6 items-center justify-between py-4">
                <div className="flex flex-col gap-1">
                  <p className="text-md text-foreground font-medium">Acesso Padrão para Novos Recursos</p>
                  <p className="text-sm text-black/50 dark:text-white/50 font-normal">Somente administradores em {workspaceName} podem acessar vozes, projetos e outros recursos recém-criados.</p>
                </div>
                <button className="flex gap-0.5 items-center justify-between whitespace-nowrap transition-colors bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 pl-3 pr-2 py-2 text-sm rounded-[10px] shrink-0 w-auto">
                  <span>Restrito</span>
                  <div className="flex h-4 w-4 items-center justify-center opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 min-w-fit">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </button>
              </section>

              {/* Seção Uso */}
              <section className="relative flex items-center justify-between gap-3 py-4">
                <div className="flex flex-col">
                  <p className="text-md text-foreground font-medium">Unidades de Exibição de Uso</p>
                  <p className="text-sm text-black/50 dark:text-white/50 font-normal">Escolha como o uso é exibido no workspace</p>
                </div>
                <button className="flex gap-0.5 items-center justify-between whitespace-nowrap transition-colors bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 pl-3 pr-2 py-2 text-sm rounded-[10px] w-32">
                  <span>Créditos</span>
                  <div className="flex h-4 w-4 items-center justify-center opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-4 w-4 min-w-fit">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </button>
              </section>

              {/* Seção Assentos */}
              <section className="relative flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <p className="text-md text-foreground font-medium">Assentos</p>
                    <p className="text-sm text-black/50 dark:text-white/50 font-normal">1 Assentos Completos, 20 Assentos Básicos</p>
                  </div>
                </div>
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-black/50 dark:text-white/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"></path>
                  </svg> 
                  Adicionar Mais Vagas
                </button>
              </section>

              {/* Seção Clones */}
              <section className="relative flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <p className="text-md text-foreground font-medium">Clones de Voz Profissionais</p>
                    <p className="text-sm text-black/50 dark:text-white/50 font-normal">0 slots PVC</p>
                  </div>
                </div>
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 text-black/50 dark:text-white/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4m4.5-3v2M12 6v12m4.5-15v18M21 10v4"></path>
                  </svg> 
                  Adicionar Mais Slots PVC
                </button>
              </section>

              {/* Seção Inatividade */}
              <section className="relative flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <p className="text-md text-foreground font-medium">Tempo de Inatividade da Sessão</p>
                    <p className="text-sm text-black/50 dark:text-white/50 font-normal">Não habilitado</p>
                  </div>
                </div>
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 text-black/50 dark:text-white/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                  </svg> 
                  Alterar Tempo de Inatividade da Sessão
                </button>
              </section>

            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
