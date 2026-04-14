'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { UpdateWorkspaceNameModal } from '@/components/dashboard/UpdateWorkspaceNameModal';
import { updateWorkspaceName } from '@/lib/actions/workspace';

export default function WorkspaceSettingsPage() {
  const { data: session } = useSession();
  const [workspaceName, setWorkspaceName] = React.useState('Portal Administrativo');
  const [workspaceType, setWorkspaceType] = React.useState('Acesso Geral');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN';

  React.useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await fetch('/api/workspace/config');
        if (res.ok) {
          const data = await res.json();
          setWorkspaceName(data.name);
          setWorkspaceType(data.type);
        }
      } catch (err) {
        console.error('Erro ao carregar workspace:', err);
      }
    }
    loadWorkspace();
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
                {isAdmin && (
                  <button 
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-transparent border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 px-3 rounded-[10px]"
                  >
                    Alterar Nome do Workspace
                  </button>
                )}
              </section>

            </main>
          </div>
        </main>
      </div>

      <UpdateWorkspaceNameModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentName={workspaceName}
        onUpdate={async (newName) => {
          const res = await updateWorkspaceName(newName);
          if (res.error) {
            toast.error(res.error);
          } else {
            setWorkspaceName(newName);
            toast.success("Nome do workspace global atualizado com sucesso!");
            // Sincroniza localstorage por compatibilidade legada se necessário
            localStorage.setItem('pca_workspace_name', newName);
          }
        }}
      />
    </div>
  );
}
