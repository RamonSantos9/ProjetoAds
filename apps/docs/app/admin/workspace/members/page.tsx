'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { CircleUser, ChevronDown, LockOpen, Shield, Trash, Settings, Check, UserPlus, Send } from 'lucide-react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/cn';
import { InviteMembersModal } from '@/app/admin/transcricoes/_components/InviteMembersModal';

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
}

function RoleSelector({ currentRole, getRoleLabel }: { currentRole: string | null; getRoleLabel: (role: string | null) => string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button className="flex w-full min-w-[140px] gap-0.5 items-center justify-between whitespace-nowrap transition-colors bg-background border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-9 pl-3 pr-2 py-2 text-sm rounded-[10px]">
          <span className="text-sm font-semibold">{getRoleLabel(currentRole)}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 w-[360px] rounded-xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 shadow-lg text-popover-foreground transition-all duration-150',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 p-1'
          )}
        >
          <div className="flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left rounded-lg px-3 py-3 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 cursor-default md:cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-foreground">Assento Básico (Usuário)</span>
                {(!currentRole || currentRole === 'USUARIO') && <Check className="h-4 w-4 text-foreground" />}
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 font-normal leading-relaxed mt-0.5 mb-1.5">
                Acesso básico à plataforma para visualização e consumo de conteúdo.
              </p>
              <ul className="text-xs text-black/50 dark:text-white/50 list-disc pl-4 space-y-1">
                <li className="relative">Conta padrão sem privilégios avançados</li>
                <li>Consumo de podcasts públicos</li>
              </ul>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full text-left rounded-lg px-3 py-3 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 mt-1 cursor-default md:cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-foreground">Aluno</span>
                {currentRole === 'ALUNO' && <Check className="h-4 w-4 text-foreground" />}
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 font-normal leading-relaxed mt-0.5 mb-1.5">
                Perfil de estudante da instituição. Acesso especial a podcasts educacionais e materiais restritos.
              </p>
              <ul className="text-xs text-black/50 dark:text-white/50 list-disc pl-4 space-y-1">
                <li>Acesso aos conteúdos da faculdade</li>
                <li>Participação em projetos acadêmicos</li>
              </ul>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full text-left rounded-lg px-3 py-3 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 mt-1 cursor-default md:cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-foreground">Professor</span>
                {currentRole === 'PROFESSOR' && <Check className="h-4 w-4 text-foreground" />}
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 font-normal leading-relaxed mt-0.5 mb-1.5">
                Perfil criador. Ferramentas para gerar conteúdo, gravar episódios e gerenciar projetos educacionais.
              </p>
              <ul className="text-xs text-black/50 dark:text-white/50 list-disc pl-4 space-y-1">
                <li>Criação de novos episódios completos</li>
                <li>Gerenciamento de recursos acadêmicos</li>
                <li>Acesso à edição profissional de áudio</li>
              </ul>
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full text-left rounded-lg px-3 py-3 text-sm outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex flex-col gap-1 mt-1 cursor-default md:cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-foreground">Administrador</span>
                {currentRole === 'ADMIN' && <Check className="h-4 w-4 text-foreground" />}
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 font-normal leading-relaxed mt-0.5">
                Acesso completo a toda a plataforma PodcastAds, recursos gerados, gestão de espaço de trabalho e permissões destrutivas.
              </p>
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export default function WorkspaceMembersPage() {
  const { data: session } = useSession();
  const [members, setMembers] = React.useState<Member[]>([]);
  const [invites, setInvites] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  const loadData = async () => {
    try {
      const [membersRes, invitesRes] = await Promise.all([
        fetch('/api/workspace/members'),
        fetch('/api/workspace/invites?type=sent')
      ]);
      
      if (membersRes.ok) {
        setMembers(await membersRes.json());
      }
      if (invitesRes.ok) {
        setInvites(await invitesRes.json());
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleRemoveInvite = async (id: string) => {
    try {
      const res = await fetch(`/api/workspace/invites/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Convite removido");
        loadData();
      } else {
        toast.error("Erro ao remover convite");
      }
    } catch (e) {
      toast.error("Erro inesperado");
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInvites = invites.filter(i => 
    i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'PROFESSOR': return 'Professor';
      case 'ALUNO': return 'Aluno';
      default: return 'Assento Básico';
    }
  };

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
                  <Link href="/admin/workspace" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-transparent text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 px-4 md:px-0 lg:pb-2.5 mb-0">
                    <div className="flex items-center border border-transparent rounded-[10px] lg:px-2.5 lg:py-1">Geral</div>
                  </Link>
                  <Link href="/admin/workspace/members" className="relative whitespace-nowrap transition-all flex items-center justify-center border-b-[1.5px] py-1 text-sm font-medium border-black dark:border-white text-foreground px-4 md:px-0 lg:pb-2.5 mb-0">
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
            <main className="flex flex-col gap-6 mx-auto -space-x-3">
              <div className="flex justify-between gap-3 py-4 pt-0">
                <input 
                  className="flex w-full border bg-transparent  focus:border-foreground hover:border-gray-400 dark:hover:border-white/40 outline-none h-9 px-3 py-1 text-sm rounded-[10px]" 
                  autoComplete="off" 
                  placeholder="Buscar Membros ou Convites..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  name="search" 
                />
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 h-9 px-3 rounded-[10px] w-fit"
                >
                  Convidar Novo Usuário
                </button>
              </div>

              <section>
                <ul className="flex flex-col">
                  <li className="-mt-2">
                    <div className="flex items-center gap-3 p-3 border-b border-gray-100 dark:border-white/10 text-start overflow-hidden px-0 mx-3 w-auto">
                      <div className="-mr-3"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-foreground font-semibold">
                            Membros: {filteredMembers.length}
                          </p>
                          <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground h-8 px-2.5 rounded-lg text-sm w-fit">
                            Exportar
                          </button>
                        </div>
                      </div>
                    </div>

                    <ul className="flex flex-col overflow-hidden">
                      {/* Loading State */}
                      {isLoading && members.length === 0 && invites.length === 0 ? (
                        <li className="flex justify-center py-6 text-sm text-subtle">Carregando dados...</li>
                      ) : (
                        <>
                          {/* Sent Invites */}
                          {filteredInvites.map((invite) => (
                            <li key={invite.id} className="eleven-list-item hstack items-center gap-3 transition-colors duration-75 relative hover:bg-black/5 dark:hover:bg-white/5 px-3 py-3 w-full">
                              <div className="-mr-3"></div>
                              <div className="h-10 w-10 shrink-0 center bg-gray-100 dark:bg-white/5 rounded-[10px] pointer-events-none flex items-center justify-center">
                                <UserPlus className="text-gray-500 w-5 h-5" />
                              </div>
                              <div className="relative flex-1 min-w-0">
                                <p className="text-sm text-foreground font-normal line-clamp-1">{invite.email}</p>
                                <p className="text-xs text-black/50 dark:text-white/50 font-normal">
                                  Convidado com {getRoleLabel(invite.role)} por {invite.inviter?.email || 'Administrador'} - {new Date(invite.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="relative hstack flex items-center w-fit gap-2">
                                <button 
                                  aria-label="Enviar Lembrete" 
                                  title="Enviar e-mail de lembrete" 
                                  className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                                <button 
                                  aria-label="Excluir Convite" 
                                  title="Excluir convite" 
                                  onClick={() => handleRemoveInvite(invite.id)}
                                  className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0"
                                >
                                  <Trash className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </li>
                          ))}

                          {/* Members List */}
                          {filteredMembers.length === 0 && filteredInvites.length === 0 && !isLoading ? (
                            <li className="flex justify-center items-center py-6">
                              <p className="text-sm text-subtle text-black/50 dark:text-white/50">Nenhum membro ou convite encontrado.</p>
                            </li>
                          ) : (
                            filteredMembers.map((member) => (
                          <li key={member.id} className="flex items-center p-3 gap-3 transition-colors duration-75 relative hover:bg-black/5 dark:hover:bg-white/5 px-3 rounded-lg mx-1 group">
                            <div className="-mr-3"></div>
                            <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-[10px] relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {member.image ? (
                                  <img src={member.image} alt={member.name || ''} className="w-10 h-10 rounded-[10px] object-cover" />
                                ) : (
                                  <CircleUser className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className="relative flex-1 min-w-0">
                              <p className="flex items-center gap-2 text-sm text-foreground font-normal line-clamp-1">
                                {member.email} 
                                {member.role === 'ADMIN' && (
                                  <span className="inline-flex items-center text-[11px] px-2.5 h-5 rounded-full font-medium transition-colors whitespace-nowrap bg-black text-white dark:bg-white dark:text-black">
                                    Proprietário
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-black/50 dark:text-white/50 font-normal">
                                {getRoleLabel(member.role)} - MFA Não Ativado
                              </p>
                            </div>
                            
                            <div className="relative flex items-center w-fit gap-2">
                              <RoleSelector currentRole={member.role} getRoleLabel={getRoleLabel} />
                              
                              <button aria-label="Bloquear Usuário" className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0">
                                <LockOpen className="w-4 h-4" />
                              </button>
                              
                              <button aria-label="Gerenciar Permissões" className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0">
                                <Shield className="w-4 h-4" />
                              </button>
                              
                              <button aria-label="Excluir Usuário" className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0">
                                <Trash className="w-4 h-4 text-red-500" />
                              </button>
                              
                              <button aria-label="Configurações" className="flex items-center justify-center transition-colors bg-background border border-gray-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-foreground rounded-lg h-8 w-8 shrink-0">
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </>
                  )}
                  
                      {/* Divider bottom */}
                      {filteredMembers.length > 0 && <div className="mx-3 border-b border-gray-100 dark:border-white/10 mt-2" aria-hidden="true"></div>}
                    </ul>
                  </li>
                </ul>
              </section>
            </main>
          </div>
        </main>
      </div>

      <InviteMembersModal 
        isOpen={isInviteModalOpen} 
        onOpenChange={setIsInviteModalOpen} 
        onSuccess={loadData}
      />
    </div>
  );
}
