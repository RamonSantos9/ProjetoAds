'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface InviteMembersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMembersModal({ 
  isOpen, 
  onOpenChange 
}: InviteMembersModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content 
          className="fixed left-[50%] top-[50%] z-[70] w-full max-w-lg max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-[#121212] shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-[24px] focus-visible:outline-0 flex flex-col gap-0 max-sm:border-0 max-sm:!rounded-none overflow-hidden p-0 border border-gray-alpha-100 outline-none"
        >
          <div className="h-fit max-h-full overflow-y-auto p-0 gap-0">
            <div className="relative">
              {/* Header Image */}
              <div className="relative w-full bg-gray-alpha-50 overflow-hidden">
                <div className="relative" style={{ paddingBottom: '50.5%' }}></div>
                <img 
                  alt="Apresentando Assentos Básicos" 
                  loading="lazy" 
                  className="absolute inset-0 w-full h-full object-cover"
                  src="https://elevenlabs.io/app_assets/_next/static/media/bg-creative.1df93672.png" 
                />
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 pt-2">
                    <Dialog.Title className="text-lg text-foreground font-medium">Apresentando Colaboradores</Dialog.Title>
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-foreground font-normal">
                        Os Assentos de Colaborador são uma nova maneira de trabalhar em equipe no PodcastAds.
                      </p>
                      <p className="text-sm text-foreground font-normal">
                        Convide até 20 pessoas e compartilhe seus projetos com elas. Seus convidados terão acesso ao seu workspace e poderão colaborar nos roteiros e transcrições que você criou.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-foreground font-medium">Convidar colega</label>
                      <input 
                        type="email"
                        placeholder="Endereço de e-mail"
                        className="flex w-full border border-gray-alpha-200 bg-transparent shadow-none transition-colors placeholder:text-[#5b5b64] dark:placeholder:text-gray-400 focus-ring focus-visible:border-foreground hover:border-gray-alpha-300 h-9 px-3 py-1 text-sm rounded-[10px] outline-none"
                      />
                    </div>
                    <p className="text-xs text-[#5b5b64] dark:text-gray-400 font-normal leading-relaxed">
                      A pessoa que você convidar será adicionada ao seu workspace como um Colaborador.
                    </p>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-2">
                    <button 
                      onClick={() => onOpenChange(false)}
                      className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-white dark:bg-[#121212] border border-gray-alpha-200 hover:bg-gray-50 active:bg-gray-100 h-9 px-4 rounded-[10px] text-foreground"
                    >
                      Cancelar
                    </button>
                    <button 
                      disabled
                      className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors bg-foreground text-background shadow-none hover:bg-gray-800 disabled:bg-gray-400 disabled:text-gray-100 h-9 px-4 rounded-[10px]"
                    >
                      Convidar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button className="absolute right-5 top-5 rounded-full p-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors z-10">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
