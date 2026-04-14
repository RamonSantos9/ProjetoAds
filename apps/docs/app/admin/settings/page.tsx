'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { updateUserName } from '@/lib/actions/user';
import { deleteUserAccount } from '@/lib/actions/delete-account';
import { UpdateWorkspaceNameModal } from '@/components/dashboard/UpdateWorkspaceNameModal';
import { Suspense } from 'react';
import { Check, X as XIcon } from 'lucide-react';
import { useSetBreadcrumbs } from '@/lib/breadcrumbs-context';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'workspaces' ? 'workspaces' : 'profile';
  const [activeTab, setActiveTab] = React.useState<'profile' | 'workspaces'>(initialTab);

  useSetBreadcrumbs([
    { label: 'Configurações', href: '/admin/settings' },
    { label: activeTab === 'profile' ? 'Perfil' : 'Espaços de Trabalho', active: true }
  ]);

  const { data: session, update: updateSession } = useSession();
  const user = session?.user;
  
  const userName = user?.name || 'Não informado';
  const userEmail = user?.email || 'carregando...';

  const [isNameModalOpen, setIsNameModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = React.useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = React.useState(false);
  const [isUpdateWorkspaceModalOpen, setIsUpdateWorkspaceModalOpen] = React.useState(false);

  const [workspaceName, setWorkspaceName] = React.useState('Portal Administrativo');
  
  const [receivedInvites, setReceivedInvites] = React.useState<any[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = React.useState(false);
  const [membersCount, setMembersCount] = React.useState<number>(1);
  const [workspacePlan, setWorkspacePlan] = React.useState('Plano Institucional');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);
  const [hasPersonalWorkspace, setHasPersonalWorkspace] = React.useState(false);
  const [personalWorkspaceName, setPersonalWorkspaceName] = React.useState<string | null>(null);
  const [personalWorkspaceRole, setPersonalWorkspaceRole] = React.useState<string>('ADMIN');

  // Lê o workspace ativo do cookie (global | personal)
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<string>(() => {
    if (typeof document === 'undefined') return 'global';
    const match = document.cookie.match(/(?:^|;\s*)active-workspace=([^;]*)/);
    return match ? match[1] : 'global';
  });

  const switchWorkspace = (id: string, displayName: string) => {
    document.cookie = `active-workspace=${id}; path=/; max-age=86400`;
    setActiveWorkspaceId(id);
    toast.success(`Workspace "${displayName}" ativado!`);
    window.location.reload();
  };


  const handleCreateWorkspace = async () => {
    if (isCreatingWorkspace) return;
    setIsCreatingWorkspace(true);
    try {
      const res = await fetch('/api/workspace/personal', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setHasPersonalWorkspace(true);
        setPersonalWorkspaceName(data.name);
        if (data.workspaceRole) setPersonalWorkspaceRole(data.workspaceRole);
        toast.success(`Workspace "${data.name}" criado com sucesso!`);
        await loadWorkspaceData(); // atualiza a lista imediatamente
      } else if (res.status === 409) {
        toast.error('Você já atingiu o limite de 1 espaço de trabalho pessoal.');
      } else {
        toast.error('Erro ao criar workspace. Tente novamente.');
      }
    } catch {
      toast.error('Erro ao criar workspace. Tente novamente.');
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const loadWorkspaceData = async () => {
    setIsLoadingInvites(true);
    try {
      const [invitesRes, configRes, personalRes] = await Promise.all([
        fetch('/api/workspace/invites?type=received'),
        fetch('/api/workspace/config'),
        fetch('/api/workspace/personal'),
      ]);

      if (invitesRes.ok) {
        setReceivedInvites(await invitesRes.json());
      }
      if (configRes.ok) {
        const configData = await configRes.json();
        setMembersCount(configData.memberCount || 1);
        setWorkspaceName(configData.name || 'Portal Administrativo');
        setWorkspacePlan(configData.plan || 'Plano Institucional');
      }
      if (personalRes.ok) {
        const personalData = await personalRes.json();
        setHasPersonalWorkspace(personalData.hasIndividualWorkspace);
        setPersonalWorkspaceName(personalData.name);
        if (personalData.workspaceRole) setPersonalWorkspaceRole(personalData.workspaceRole);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInvites(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'workspaces') {
      loadWorkspaceData();
    }
  }, [activeTab]);

  const handleInviteAction = async (id: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      const res = await fetch(`/api/workspace/invites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        toast.success(action === 'ACCEPT' ? 'Convite aceito!' : 'Convite recusado!');
        loadWorkspaceData();
      } else {
        toast.error('Erro ao processar convite');
      }
    } catch (e) {
      toast.error('Erro inesperado');
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('pca_workspace_name');
    if (saved) setWorkspaceName(saved);
  }, []);

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
                  <h1 data-testid="page-title" className="text-2xl text-foreground font-semibold">
                    Configurações
                  </h1>
                </div>
                <p className="text-sm text-black/50 dark:text-white/50 font-normal mt-1">
                  Gerencie seu perfil e suas associações a espaços de trabalho.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle mode="light-dark" />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center !-mt-2">
            <nav className="inline-flex border-b-[1px] w-full h-11 pt-0.5 no-scrollbar gap-1.5 -mb-[1px] border-none">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "relative whitespace-nowrap transition-all focus-ring inline-flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium px-4 md:px-0 lg:pb-2.5 mb-0 text-black/50 dark:text-white/50",
                  activeTab === 'profile' 
                    ? "border-black dark:border-white text-foreground dark:text-white" 
                    : "border-transparent hover:text-black/50 dark:hover:text-white/50"
                )}
              >
                <div className={cn(
                  "hstack items-center border rounded-[10px] lg:px-3 lg:py-1",
                  activeTab === 'profile' ? "border-[#E2E7F1]" : "border-transparent"
                )}>
                  Perfil
                </div>
              </button>
              <button
                onClick={() => setActiveTab('workspaces')}
                className={cn(
                  "relative whitespace-nowrap transition-all focus-ring inline-flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium px-4 md:px-0 lg:pb-2.5 mb-0 text-black/50 dark:text-white/50",
                  activeTab === 'workspaces' 
                    ? "border-black dark:border-white text-foreground dark:text-white" 
                    : "border-transparent hover:text-black/50 dark:hover:text-white/50"
                )}
              >
                <div className={cn(
                  "hstack items-center border rounded-[10px] lg:px-2.5 lg:py-1",
                  activeTab === 'workspaces' ? "border" : "border-transparent"
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
                description={userEmail}
              />

              <SettingsSection 
                title="Nome"
                description={userName}
                actionLabel="Atualizar Nome"
                onAction={() => setIsNameModalOpen(true)}
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
                title="Notificações de Comentários"
                description="Gerencie suas preferências de notificações por e-mail para comentários."
                actionLabel="Gerenciar Notificações"
              />

              <SettingsSection 
                title="Sair de todos os dispositivos"
                description="Sair de todos os dispositivos e sessões. Você precisará entrar novamente em todos os dispositivos."
                actionLabel="Sair"
                onAction={() => setIsSignOutModalOpen(true)}
              />

              <section className="relative flex items-center justify-between gap-3 py-6">
                <div className="flex flex-col">
                  <p className="text-md font-medium text-red-400">Excluir Conta Inteira</p>
                  <p className="text-sm text-black/50 dark:text-white/50 font-normal max-w-xl">
                    Excluir permanentemente sua conta inteira em todos os workspaces. Se você deseja apenas sair de um workspace, vá para a <Link href="/admin/settings/workspaces" className="underline hover:text-red-400 transition-colors">aba Workspaces</Link>.
                  </p>
                </div>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-red-500/10 border border-red-500 hover:bg-red-500 text-red-400 hover:text-white transition-all text-sm font-medium h-9 px-4 rounded-[10px]"
                >
                  Excluir Conta
                </button>
              </section>

            </div>
          ) : (
            <div className="flex flex-col max-w-[80rem]">
              <section className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-6 mt-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-black/50 dark:text-white/50 font-medium">Os workspaces são ambientes independentes. Em cada workspace, você pode colaborar com outros membros e gerenciar seus próprios recursos.</p>
                </div>
                <button 
                  onClick={handleCreateWorkspace}
                  disabled={isCreatingWorkspace}
                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-black text-white dark:bg-white dark:text-black shadow-none hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 h-9 px-3 rounded-[10px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus shrink-0 w-[18px] h-[18px] text-[inherit] opacity-100 -ml-[3px] mr-[6px]">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  {isCreatingWorkspace ? 'Criando...' : 'Criar Novo Espaço de Trabalho'}
                </button>
              </section>
              <section className="mt-4">
                <div className="grid gap-x-4 md:gap-x-8 grid-cols-[auto_90px] md:grid-cols-[auto_min-content_min-content]">
                  <div className="h-11 grid col-span-full grid-cols-[subgrid] grid-rows-1 items-center py-2 border-b border-gray-100 dark:border-white/10">
                    <p className="text-sm text-black/50 dark:text-white/50 font-medium">Espaço de Trabalho</p>
                    <p className="text-sm text-black/50 dark:text-white/50 font-medium w-[90px] md:w-[130px]">Tipo de Assento</p>
                    <p className="text-sm text-foreground font-normal w-[120px] lg:w-[170px]">
                      <span className="sr-only">Ações</span>
                    </p>
                  </div>
                  {(() => {
                    const pendingInvites = receivedInvites.filter(i => i.status === 'PENDING');
                    const acceptedInvites = receivedInvites.filter(i => i.status === 'ACCEPTED');

                    return (
                      <>
                        <div className="col-span-full grid grid-cols-[subgrid] transition-opacity duration-200">
                          {/* Current User Workspace */}
                          <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 border-b border-gray-100 dark:border-white/10 py-1.5">
                            <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 py-1.5 rounded-xl cursor-pointer md:hover:bg-black/5 dark:md:hover:bg-white/5 focus-ring group/row px-0 md:px-2 md:h-13 items-center">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-foreground font-medium">{workspaceName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-black/50 dark:text-white/50 font-normal">{workspacePlan} • {membersCount} membro{membersCount > 1 || membersCount === 0 ? 's' : ''}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <p className="text-sm text-foreground font-medium">
                                  {{
                                    'ADMIN': 'Administrador',
                                    'PROFESSOR': 'Professor',
                                    'ALUNO': 'Aluno',
                                    'USUARIO': 'Usuário'
                                  }[(user as any)?.role as string] || 'Usuário'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 justify-start md:justify-end mt-2 md:mt-0">
                                {activeWorkspaceId === 'global' ? (
                                  <button disabled className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-black text-white dark:bg-white dark:text-black shadow-none active:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-white/10 dark:disabled:text-white/40 h-8 px-2.5 rounded-lg text-xs">
                                    Espaço de Trabalho Atual
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => switchWorkspace('global', 'Portal Administrativo')}
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground shadow-none h-8 px-2.5 rounded-lg text-xs"
                                  >
                                    Trocar
                                  </button>
                                )}
                                <div className="relative">
                                  <button 
                                    type="button" 
                                    onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground shadow-none h-8 rounded-lg text-sm px-2"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings h-4 w-4">
                                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                  </button>
                                  
                                  {isWorkspaceMenuOpen && (
                                    <>
                                      <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsWorkspaceMenuOpen(false)}
                                      ></div>
                                      <div className="absolute right-0 top-full mt-2 z-50 bg-white/90 dark:bg-black/90 backdrop-blur text-foreground border border-gray-100 dark:border-white/10 shadow-lg p-1 rounded-[10px] min-w-[max-content] animate-in fade-in-0 zoom-in-95">
                                        <div 
                                          role="menuitem" 
                                          onClick={() => {
                                            navigator.clipboard.writeText("ws_" + Math.random().toString(36).substr(2, 9));
                                            toast.success("ID do workspace copiado com sucesso!");
                                            setIsWorkspaceMenuOpen(false);
                                          }}
                                          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1.5 text-sm rounded-lg"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy mr-2 h-4 w-4">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                          </svg>
                                          Copiar ID do workspace
                                        </div>
                                        <div 
                                          role="menuitem" 
                                          onClick={() => {
                                            setIsUpdateWorkspaceModalOpen(true);
                                            setIsWorkspaceMenuOpen(false);
                                          }}
                                          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1.5 text-sm rounded-lg"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil mr-2 h-4 w-4">
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                            <path d="m15 5 4 4"></path>
                                          </svg>
                                          Editar Perfil do Workspace
                                        </div>
                                        <Link 
                                          href="/admin/settings"
                                          onClick={() => setIsWorkspaceMenuOpen(false)}
                                          className="relative transition-colors focus:text-foreground w-full flex cursor-pointer select-none items-center outline-none hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1.5 text-sm rounded-lg text-foreground no-underline"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings mr-2 h-4 w-4">
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                          </svg>
                                          Ir para Configurações do Workspace
                                        </Link>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Personal Workspace (created by user) */}
                          {hasPersonalWorkspace && personalWorkspaceName && (
                            <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 border-b border-gray-100 dark:border-white/10 py-1.5">
                              <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 py-1.5 rounded-xl cursor-default md:hover:bg-black/5 dark:md:hover:bg-white/5 focus-ring px-0 md:px-2 md:h-13 items-center">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-foreground font-medium">{personalWorkspaceName}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-black/50 dark:text-white/50 font-normal">Plano Pessoal • {membersCount} membro{membersCount > 1 || membersCount === 0 ? 's' : ''}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm text-foreground font-medium">
                                    {({'ADMIN': 'Administrador', 'EDITOR': 'Editor', 'VIEWER': 'Visualizador'} as Record<string,string>)[personalWorkspaceRole] ?? personalWorkspaceRole}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 justify-start md:justify-end mt-2 md:mt-0">
                                  {activeWorkspaceId === 'personal' ? (
                                    <button disabled className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-black text-white dark:bg-white dark:text-black shadow-none active:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-white/10 dark:disabled:text-white/40 h-8 px-2.5 rounded-lg text-xs">
                                      Espaço de Trabalho Atual
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => switchWorkspace('personal', personalWorkspaceName)}
                                      className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground shadow-none h-8 px-2.5 rounded-lg text-xs"
                                    >
                                      Trocar
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}


                          {/* Accepted Invites Workspaces */}
                          {acceptedInvites.map(invite => (
                            <div key={invite.id} className="col-span-full grid grid-cols-[subgrid] grid-rows-1 border-b border-gray-100 dark:border-white/10 py-1.5">
                              <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 py-1.5 rounded-xl cursor-default md:hover:bg-black/5 dark:md:hover:bg-white/5 focus-ring px-0 md:px-2 md:h-13 items-center">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-foreground font-medium">{invite.inviter?.name ? `Workspace de ${invite.inviter.name}` : `Workspace de ${invite.inviter?.email?.split('@')[0] || 'Administrador'}`}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-black/50 dark:text-white/50 font-normal">Plano Free • Convite de {invite.inviter?.email}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm text-foreground font-medium">
                                    {invite.role ? ({
                                      'ADMIN': 'Administrador',
                                      'PROFESSOR': 'Professor',
                                      'ALUNO': 'Aluno',
                                      'USUARIO': 'Usuário'
                                    }[invite.role as string] || invite.role) : 'Membro'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 justify-start md:justify-end mt-2 md:mt-0">
                                  <button 
                                    onClick={() => toast.success('Você agora está gerenciando este workspace! (Simulação)')}
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground shadow-none h-8 px-2.5 rounded-lg text-xs"
                                  >
                                    Trocar
                                  </button>
                                  <button 
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground shadow-none h-8 rounded-lg text-sm px-2"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings h-4 w-4">
                                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                      <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Sent/Received Invites Rendering */}
                        {isLoadingInvites ? (
                          <div className="col-span-full justify-center items-center h-10 flex mt-4">
                            <p className="text-sm text-subtle font-normal">Verificando convites...</p>
                          </div>
                        ) : pendingInvites.length > 0 ? (
                          pendingInvites.map(invite => (
                            <div key={invite.id} className="col-span-full grid grid-cols-[subgrid] grid-rows-1 border-b border-gray-100 dark:border-white/10 py-1.5 mt-2">
                              <div className="col-span-full grid grid-cols-[subgrid] grid-rows-1 py-1.5 rounded-xl cursor-default md:hover:bg-black/5 dark:md:hover:bg-white/5 focus-ring px-0 md:px-2 md:h-13 items-center">
                                <div className="flex flex-col gap-1">
                                  <p className="text-sm text-foreground font-medium">{invite.inviter?.name ? `Workspace de ${invite.inviter.name}` : `Workspace de ${invite.inviter?.email?.split('@')[0] || 'Administrador'}`}</p>
                                  <p className="text-sm text-black/50 dark:text-white/50 font-normal">Convidado por: {invite.inviter?.email}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-sm text-foreground font-medium">Convite (Pendente)</p>
                                </div>
                                <div className="flex justify-start md:justify-end gap-3 mt-2 md:mt-0">
                                  <button 
                                    onClick={() => handleInviteAction(invite.id, 'DECLINE')}
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-8 px-2.5 rounded-lg text-sm"
                                  >
                                    <XIcon className="w-4 h-4 mr-1.5" />
                                    Recusar
                                  </button>
                                  <button 
                                    onClick={() => handleInviteAction(invite.id, 'ACCEPT')}
                                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-8 px-2.5 rounded-lg text-sm"
                                  >
                                    <Check className="w-4 h-4 mr-1.5" />
                                    Aceitar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full justify-center items-center h-10 flex mt-4">
                            <p className="text-sm text-subtle font-normal text-black/50 dark:text-white/50">Você não tem convites pendentes para espaços de trabalho.</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Componente Extraído */}
      <UpdateNameModal 
        isOpen={isNameModalOpen} 
        onClose={() => setIsNameModalOpen(false)} 
        currentName={userName} 
        onUpdate={async (newName) => {
          const res = await updateUserName(newName);
          if (res.error) {
            toast.error(res.error);
          } else {
            toast.success("Nome atualizado com sucesso!");
            await updateSession({ name: newName });
          }
        }}
      />

      {/* Modal - Excluir Conta */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={userEmail}
        onDelete={async () => {
          const res = await deleteUserAccount();
          if (res.error) {
            toast.error(res.error);
          } else {
            setIsDeleteModalOpen(false);
            localStorage.removeItem('pca_onboarding_completed');
            await signOut({ redirect: false });
            window.location.href = '/sign-in?deleted=true';
          }
        }}
      />

      {/* Modal - Sair */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />

      {/* Modal - Criar Novo Workspace */}
      <CreateWorkspaceModal
        isOpen={isCreateWorkspaceModalOpen}
        onClose={() => setIsCreateWorkspaceModalOpen(false)}
      />

      {/* Modal - Atualizar Nome do Workspace */}
      <UpdateWorkspaceNameModal
        isOpen={isUpdateWorkspaceModalOpen}
        onClose={() => setIsUpdateWorkspaceModalOpen(false)}
        currentName={workspaceName}
        onUpdate={(newName) => {
          setWorkspaceName(newName);
          localStorage.setItem('pca_workspace_name', newName);
          toast.success("Nome do workspace atualizado com sucesso!");
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hstack items-center justify-center">Carregando configurações...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsSection({ 
  title, 
  description, 
  actionLabel, 
  actionHref,
  onAction
}: { 
  title: string; 
  description: string; 
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <section className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-6">
      <div className="flex flex-col">
        <p className="text-md text-foreground font-medium">{title}</p>
        <p className="text-sm text-black/50 dark:text-white/50 font-normal max-w-2xl">{description}</p>
      </div>
      {actionLabel && (
        actionHref ? (
          <Link 
            href={actionHref}
            className="inline-flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121212] border hover:bg-[#f6f8fa] dark:hover:bg-white/5 text-foreground text-sm font-medium h-9 px-4 rounded-[10px] transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <button 
            onClick={onAction}
            className="inline-flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121212] border hover:bg-[#f6f8fa] dark:hover:bg-white/5 text-foreground text-sm font-medium h-9 px-4 rounded-[10px] transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </section>
  );
}

function UpdateNameModal({ 
  isOpen, 
  onClose, 
  currentName,
  onUpdate
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  currentName: string;
  onUpdate?: (name: string) => Promise<void>;
}) {
  const [newName, setNewName] = React.useState(currentName);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [currentName, isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Overlay Escuro */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        data-state="open"
        onClick={onClose}
      ></div>
      
      <div 
        role="dialog" 
        id="radix-_r_bi_" 
        aria-describedby="radix-_r_bk_" 
        aria-labelledby="radix-_r_bj_" 
        data-state="open" 
        className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0" 
        tabIndex={-1} 
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="radix-_r_bj_" className="text-lg font-semibold leading-6 tracking-tight">Atualizar Nome</h2>
          <p id="radix-_r_bk_" className="text-sm text-muted-foreground">Atualize seu nome inserindo um novo</p>
        </div>
        
        <div>
          <span className="block text-sm font-normal text-gray-700 mb-1">Novo nome</span>
          <input 
            aria-label="Novo nome" 
            className="block w-full rounded-md bg-transparent border shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm px-3 py-2 outline-none" 
            placeholder="Exemplo: Ramon" 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button 
            onClick={onClose}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-9 px-3 rounded-[10px] inline-flex"
          >
            Cancelar
          </button>
          <button 
            disabled={isSubmitting || newName.trim() === currentName}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-black text-white dark:bg-white dark:text-black shadow-none hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-3 rounded-[10px] inline-flex disabled:opacity-50"
            onClick={async () => {
              if (onUpdate && newName.trim() !== currentName) {
                setIsSubmitting(true);
                await onUpdate(newName);
                setIsSubmitting(false);
              }
              onClose();
            }}
          >
            {isSubmitting ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </>,
    document.body
  );
}

function DeleteAccountModal({ 
  isOpen, 
  onClose,
  userEmail,
  onDelete
}: { 
  isOpen: boolean; 
  onClose: () => void;
  userEmail: string;
  onDelete?: () => Promise<void>;
}) {
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setConfirmEmail('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const isEmailMatched = confirmEmail === userEmail && userEmail !== 'carregando...';

  return createPortal(
    <>
      {/* Overlay Escuro */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        data-state="open"
        onClick={onClose}
      ></div>
      
      <div 
        role="dialog" 
        id="radix-_r_1gb_" 
        aria-describedby="radix-_r_1gd_" 
        aria-labelledby="radix-_r_1gc_" 
        data-state="open" 
        className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0" 
        tabIndex={-1} 
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="radix-_r_1gc_" className="text-lg font-semibold leading-6 tracking-tight">Você realmente deseja excluir sua conta inteira?</h2>
        </div>
        
        <div role="alert" className="relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert h-4 w-4">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          <h5 className="mb-1 font-medium leading-none tracking-tight">Aviso: Isso excluirá sua conta inteira</h5>
          <div className="text-sm [&_p]:leading-relaxed">
            Isso excluirá permanentemente sua conta em todos os workspaces. Você não poderá mais criar uma conta com este e-mail. Se você deseja apenas sair de um workspace, use a opção "Sair do Workspace".
          </div>
        </div>
        
        <div className="w-full">
          <span className="block text-sm font-normal text-gray-700 mb-1">Por favor, confirme a exclusão da sua conta digitando seu endereço de e-mail abaixo:</span>
          <input 
            aria-label="Confirme seu email" 
            className="block w-full rounded-md bg-transparent border shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm px-3 py-2 outline-none" 
            placeholder="Seu endereço de e-mail" 
            type="email" 
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 space-x-2">
          <button 
            onClick={onClose}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-9 px-3 rounded-[10px]"
          >
            Cancelar
          </button>
          <button 
            disabled={!isEmailMatched || isDeleting}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-red-500/10 border border-red-500 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:disabled:bg-[#1A1A24] dark:disabled:border-[#2A2A38] h-9 px-3 rounded-[10px]"
            onClick={async () => {
              if (!onDelete) return;
              setIsDeleting(true);
              await onDelete();
              setIsDeleting(false);
            }}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Conta'}
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </>,
    document.body
  );
}

function SignOutModal({ 
  isOpen, 
  onClose,
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        data-state="open"
        onClick={onClose}
      ></div>
      
      <div 
        role="dialog" 
        id="radix-_r_1h7_" 
        aria-describedby="radix-_r_1h9_" 
        aria-labelledby="radix-_r_1h8_" 
        data-state="open" 
        className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0 sm:max-w-md" 
        tabIndex={-1} 
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="radix-_r_1h8_" className="text-lg font-semibold leading-6 tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-5 h-5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            Sair de todos os dispositivos
          </h2>
        </div>
        
        <div className="space-y-4">
          <div role="alert" className="relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 bg-background text-foreground">
            <h5 className="mb-1 font-medium leading-none tracking-tight">Aviso de Segurança</h5>
            <div className="text-sm [&_p]:leading-relaxed">
              Isso irá desconectar você de todos os dispositivos e sessões. Você precisará fazer login novamente em todos os dispositivos onde está atualmente conectado.
            </div>
          </div>
          <p className="text-sm text-black/50 dark:text-white/50 font-normal">
            Esta ação não pode ser desfeita. Após sair, você será redirecionado para a página de login.
          </p>
        </div>
        
        <div className="flex-col-reverse sm:flex-row sm:justify-end flex gap-2">
          <button 
            onClick={onClose}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-9 px-3 rounded-[10px]"
          >
            Cancelar
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="relative justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-red-500/10 border border-red-500 hover:bg-red-500/20 active:bg-red-500/30 text-red-400 disabled:bg-background/20 disabled:text-red-400 disabled:border-red-300 h-9 px-3 rounded-[10px] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            Sair
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </>,
    document.body
  );
}

function CreateWorkspaceModal({ 
  isOpen, 
  onClose,
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        data-state="open"
        onClick={onClose}
      ></div>
      
      <div 
        role="dialog" 
        id="radix-_r_1id_" 
        aria-describedby="radix-_r_1if_" 
        aria-labelledby="radix-_r_1ie_" 
        data-state="open" 
        className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-black p-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0" 
        tabIndex={-1} 
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="radix-_r_1ie_" className="text-lg font-semibold leading-6 tracking-tight">Criar novo workspace</h2>
          <p id="radix-_r_1if_" className="text-sm text-black/50 dark:text-white/50">Workspaces são ambientes independentes. Antes de prosseguir, observe que:</p>
        </div>
        
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <p className="text-sm text-foreground font-normal">Este workspace terá sua própria assinatura e será cobrado separadamente.</p>
          </li>
          <li>
            <p className="text-sm text-foreground font-normal">Recursos como vozes, dublagens e agentes não podem ser compartilhados entre workspaces. Você pode copiá-los para um novo workspace (usando Copiar Todos os Recursos), mas isso cria cópias em vez de acesso compartilhado.</p>
          </li>
        </ul>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-2">
          <button 
            onClick={onClose}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-100 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 text-foreground shadow-none h-9 px-3 rounded-[10px]"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              console.log("Criando Workspace...");
              onClose();
            }}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-black text-white dark:bg-white dark:text-black shadow-none hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-3 rounded-[10px]"
          >
            Criar Novo Espaço de Trabalho
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onClose}
          className="absolute right-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </>,
    document.body
  );
}
