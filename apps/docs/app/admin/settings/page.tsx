'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ChevronDown, Globe } from 'lucide-react';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'workspaces'>('profile');

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background transition-colors duration-300">
      <div className="stack min-h-100advh pt-[calc(var(--eleven-header-height)+var(--eleven-banner-height))] box-border max-[1023px]:pt-[calc(var(--eleven-header-height)+var(--eleven-banner-height)+var(--eleven-mobile-tabs-height))] max-[1023px]:pb-[calc(var(--eleven-player-height)+var(--eleven-footer-height))] lg:transition-[padding_200ms_cubic-bezier(0.42,0,0.58,1)] lg:w-full lg:mx-auto lg:pb-[var(--eleven-player-height)] px-5">
        
        {/* Spacer for potential fixed headers */}
        <div className="relative w-full max-h-[24px] min-h-[20px] overflow-hidden"></div>

        <header className="hidden md:flex flex-col gap-4 max-w-6xl mx-auto w-full border-b border-[#E2E7F1] dark:border-[#2A2A38] mb-4">
          <div className="w-full pb-4">
            <div className="flex justify-between items-center min-h-[2.25rem]">
              <div>
                <div className="flex items-center gap-3">
                  <h1 data-testid="page-title" className="font-waldenburg-ht text-2xl text-foreground font-semibold">
                    Configurações
                  </h1>
                </div>
                <p className="text-sm text-[#8A8AA3] font-normal mt-1">
                  Gerencie seu perfil e suas associações a espaços de trabalho.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle mode="light-dark" />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center !-mt-2">
            <nav className="inline-flex text-[#8A8AA3] border-b-[1px] w-full h-11 pt-0.5 no-scrollbar gap-1.5 -mb-[1px] border-none">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "relative whitespace-nowrap transition-all focus-ring inline-flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium px-4 md:px-0 lg:pb-2.5 mb-0",
                  activeTab === 'profile' 
                    ? "border-foreground text-foreground" 
                    : "border-transparent hover:text-foreground"
                )}
              >
                <div className={cn(
                  "hstack items-center border rounded-[10px] lg:px-2.5 lg:py-1",
                  activeTab === 'profile' ? "border-[#E2E7F1] dark:border-[#2A2A38]" : "border-transparent"
                )}>
                  Perfil
                </div>
              </button>
              <button
                onClick={() => setActiveTab('workspaces')}
                className={cn(
                  "relative whitespace-nowrap transition-all focus-ring inline-flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium px-4 md:px-0 lg:pb-2.5 mb-0",
                  activeTab === 'workspaces' 
                    ? "border-foreground text-foreground" 
                    : "border-transparent hover:text-foreground"
                )}
              >
                <div className={cn(
                  "hstack items-center border rounded-[10px] lg:px-2.5 lg:py-1",
                  activeTab === 'workspaces' ? "border-[#E2E7F1] dark:border-[#2A2A38]" : "border-transparent"
                )}>
                  Espaços de Trabalho
                </div>
              </button>
            </nav>
          </div>
        </header>

        <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8">
          {activeTab === 'profile' ? (
            <div className="flex flex-col mx-auto divide-y divide-[#E2E7F1] dark:divide-[#2A2A38]">
              
              <SettingsSection 
                title="Endereço de E-mail"
                description="ramonfishh@gmail.com"
              />

              <SettingsSection 
                title="Nome"
                description="Ramon"
                actionLabel="Atualizar Nome"
              />

              <SettingsSection 
                title="Plano Atual"
                description="Free"
                actionLabel="Gerenciar Assinatura"
                actionHref="/app/subscription"
              />

              <SettingsSection 
                title="Compartilhar no Explore"
                description="Escolha permitir que certas criações sejam compartilhadas publicamente."
                actionLabel="Gerenciar Compartilhamento"
              />

              <SettingsSection 
                title="Preferências de Compartilhamento Padrão"
                description="Nenhum grupo padrão selecionado"
                actionLabel="Gerenciar Compartilhamento Padrão"
              />

              <SettingsSection 
                title="Copiando Recursos Entre Workspaces"
                description="Permitir que recursos sejam copiados para outros espaços de trabalho vinculados."
                actionLabel="Copiar Todos os Recursos para Outro Workspace"
              />

              <SettingsSection 
                title="Autenticação de Dois Fatores"
                description="Desativado"
                actionLabel="Adicionar Autenticação de Dois Fatores"
              />

              <SettingsSection 
                title="Uso e Limites de Crédito"
                description="Visualize seu saldo atual e limites de créditos."
                actionLabel="Ver Detalhes"
              />

              <SettingsSection 
                title="Notificações de Comentários"
                description="Gerencie suas preferências de notificações por e-mail para comentários."
                actionLabel="Gerenciar Notificações"
              />

              <SettingsSection 
                title="Baixe seus dados"
                description="Solicite uma cópia dos seus dados para exportação. Você receberá um e-mail quando sua exportação estiver pronta para download."
                actionLabel="Solicitar Exportação de Dados"
              />

              <section className="relative flex items-center justify-between gap-3 py-6">
                <div className="flex flex-col">
                  <p className="text-md text-foreground font-medium">Idioma da aplicação</p>
                  <p className="text-sm text-[#8A8AA3] font-normal">Selecione o idioma da interface</p>
                </div>
                <button 
                  className="flex items-center justify-between bg-[#FFFFFF] dark:bg-[#1A1A24] border border-[#E2E7F1] dark:border-[#2A2A38] hover:bg-[#f6f8fa] dark:hover:bg-white/5 px-3 py-2 text-sm rounded-[10px] h-9 min-w-[140px] font-medium"
                >
                  <div className="flex items-center gap-2">
                    <img alt="Bandeira PT" className="shrink-0 rounded-full w-4 h-4 object-cover" src="https://storage.googleapis.com/eleven-public-cdn/images/flags/circle-flags/pt.svg" />
                    <span>Português</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </section>

              <SettingsSection 
                title="Sair de todos os dispositivos"
                description="Sair de todos os dispositivos e sessões. Você precisará entrar novamente em todos os dispositivos."
                actionLabel="Sair"
              />

              <section className="relative flex items-center justify-between gap-3 py-6">
                <div className="flex flex-col">
                  <p className="text-md font-medium text-red-600">Excluir Conta Inteira</p>
                  <p className="text-sm text-[#8A8AA3] font-normal max-w-xl">
                    Excluir permanentemente sua conta inteira em todos os workspaces. Se você deseja apenas sair de um workspace, vá para a <Link href="/admin/settings/workspaces" className="underline hover:text-red-600 transition-colors">aba Workspaces</Link>.
                  </p>
                </div>
                <button className="bg-red-500/10 border border-red-500 hover:bg-red-500 text-red-600 hover:text-white transition-all text-sm font-medium h-9 px-4 rounded-[10px]">
                  Excluir Conta
                </button>
              </section>

            </div>
          ) : (
            <div className="flex items-center justify-center py-20 text-[#8A8AA3]">
              Funcionalidade de Espaços de Trabalho disponível em breve.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SettingsSection({ 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: { 
  title: string; 
  description: string; 
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <section className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-6">
      <div className="flex flex-col">
        <p className="text-md text-foreground font-medium">{title}</p>
        <p className="text-sm text-[#8A8AA3] font-normal max-w-2xl">{description}</p>
      </div>
      {actionLabel && (
        actionHref ? (
          <Link 
            href={actionHref}
            className="inline-flex items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A24] border border-[#E2E7F1] dark:border-[#2A2A38] hover:bg-[#f6f8fa] dark:hover:bg-white/5 text-foreground text-sm font-medium h-9 px-4 rounded-[10px] transition-colors shadow-sm"
          >
            {actionLabel}
          </Link>
        ) : (
          <button 
            className="inline-flex items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A24] border border-[#E2E7F1] dark:border-[#2A2A38] hover:bg-[#f6f8fa] dark:hover:bg-white/5 text-foreground text-sm font-medium h-9 px-4 rounded-[10px] transition-colors shadow-sm"
          >
            {actionLabel}
          </button>
        )
      )}
    </section>
  );
}
