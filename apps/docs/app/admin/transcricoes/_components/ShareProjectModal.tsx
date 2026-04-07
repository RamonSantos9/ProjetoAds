'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import {
  Search,
  ChevronDown,
  Link2,
  SendHorizontal,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { InviteMembersModal } from './InviteMembersModal';
import { AccessSelector } from './AccessSelector';
import { SharingConfig } from '@/lib/db';

interface ShareProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptTitle?: string;
  projectId?: string;
  sharingConfig?: SharingConfig | null;
  onSaveSharing?: (updates: Partial<SharingConfig>) => void;
}

export function ShareProjectModal({ 
  isOpen, 
  onOpenChange, 
  scriptTitle = 'Projeto sem título',
  projectId,
  sharingConfig,
  onSaveSharing
}: ShareProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isEnabled = sharingConfig?.isEnabled || false;
  const publicAccess = sharingConfig?.publicAccess || 'Sem acesso';

  const handleCopyLink = () => {
    if (!sharingConfig?.token) {
        toast.error('Ative o compartilhamento primeiro para gerar um link.');
        return;
    }
    const link = `${window.location.origin}/admin/transcricoes/${projectId}?token=${sharingConfig.token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleToggleSharing = () => {
    const nextState = !isEnabled;
    onSaveSharing?.({ isEnabled: nextState });
  };

  const menuShadow = "shadow-[0_0px_0px_1px_rgba(0,0,0,0.06),0_1px_1px_-0.5px_rgba(0,0,0,0.06),0_3px_3px_-1.5px_rgba(0,0,0,0.06),0_6px_6px_-3px_rgba(0,0,0,0.06),0_12px_12px_-6px_rgba(0,0,0,0.04),0_24px_24px_-12px_rgba(0,0,0,0.04)]";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-5 bg-white dark:bg-[#121212] p-6 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0 max-w-xl border border-gray-alpha-100 outline-none">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-6 tracking-tight">Compartilhar Projeto</Dialog.Title>
          </div>

          <div className="flex flex-col gap-4">
            {/* Search Section */}
            <div className="flex flex-col gap-2">
              <Popover.Root open={searchQuery.length > 0}>
                <Popover.Anchor asChild>
                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 w-9 inline-flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <Search className="w-3.5 h-3.5 text-[#5b5b64] dark:text-gray-400" />
                    </div>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex border border-gray-alpha-200 bg-transparent shadow-none transition-colors placeholder:text-[#5b5b64] dark:text-gray-400 focus-ring focus-visible:border-foreground hover:border-gray-alpha-300 h-9 px-3 py-1 text-sm rounded-[10px] w-full pl-8 outline-none"
                      placeholder="Buscar por usuários ou grupos"
                    />
                  </div>
                </Popover.Anchor>

                <Popover.Portal>
                  <Popover.Content 
                    align="center"
                    sideOffset={5}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    className={cn(
                      "z-50 w-[var(--radix-popover-trigger-width)] max-h-[var(--radix-popover-content-available-height)] overflow-auto rounded-[10px] bg-white/90 dark:bg-[#121212]/90 backdrop-blur text-foreground outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 p-1 border border-gray-alpha-100",
                      menuShadow
                    )}
                  >
                    <div className="text-sm py-10 flex flex-col items-center text-center">
                      <p className="text-sm text-[#5b5b64] dark:text-gray-400 font-normal">Nenhum resultado encontrado</p>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>

            {/* Invite Section */}
            <div className="group/card relative">
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="p-3 bg-white dark:bg-[#121212] rounded-[14px] border flex transition-all duration-50 gap-3 overflow-hidden focus-visible:outline-none w-full items-center text-left"
              >
                <div className="shrink-0 rounded-full p-2 bg-gray-alpha-100 text-gray-500">
                  <SendHorizontal className="w-4 h-4" />
                </div>
                <div className="flex flex-col grow">
                  <p className="text-sm text-foreground font-medium">Convidar membros do time</p>
                  <p className="text-xs text-[#5b5b64] dark:text-gray-400 font-normal">Traga seu time para colaborar e compartilhar suas criações.</p>
                </div>
              </button>
            </div>

            {/* Sharing Toggle */}
            <div className="flex items-center justify-between gap-2 py-1">
              <div>
                <p className="text-sm text-foreground font-medium">Ativar Compartilhamento</p>
                <p className="text-xs text-[#5b5b64] dark:text-gray-400 font-normal mt-0.5">
                  {isEnabled ? 'O link público está ativo' : 'Apenas você pode acessar este projeto'}
                </p>
              </div>
              <div className="flex items-center h-9">
                <button
                  onClick={handleToggleSharing}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    isEnabled ? "bg-black" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isEnabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Public Access Level */}
            <div className="flex items-center justify-between gap-2 py-1">
              <div>
                <p className="text-sm text-foreground font-medium">Permissão do Link</p>
                <p className="text-xs text-[#5b5b64] dark:text-gray-400 font-normal mt-0.5">Define o que os visitantes podem fazer</p>
              </div>
              <AccessSelector 
                value={publicAccess}
                onChange={(val) => onSaveSharing?.({ publicAccess: val as any, isEnabled: val !== 'Sem acesso' ? true : isEnabled })}
                options={['Sem acesso', 'Visualizador', 'Editor']}
              />
            </div>

            {/* Footer Actions */}
            <div className="sm:flex-row flex flex-row justify-between sm:justify-between gap-2 items-center mt-2 pt-4 border-t border-gray-alpha-100">
              <button 
                type="button"
                disabled={!isEnabled}
                onClick={handleCopyLink}
                aria-label="Copiar link" 
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-9 px-3 rounded-[10px] gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link2 className="shrink-0 w-4 h-4 opacity-70" />
                Copiar link
              </button>
              <button 
                onClick={() => onOpenChange(false)}
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-foreground text-background shadow-none hover:bg-gray-800 h-9 px-4 rounded-[10px]"
              >
                Concluído
              </button>
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-5 top-5 rounded-sm opacity-70 transition-opacity hover:opacity-100 outline-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
      <InviteMembersModal 
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
      />
    </Dialog.Root>
  );
}
