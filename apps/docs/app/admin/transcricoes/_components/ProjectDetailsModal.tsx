'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Share, Edit3 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    title: string;
    lastEdited: number;
    author: string;
  };
}

export function ProjectDetailsModal({ 
  isOpen, 
  onOpenChange, 
  project 
}: ProjectDetailsModalProps) {
  if (!project) return null;

  const formattedTime = new Date(project.lastEdited).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-5 shadow-natural-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl focus-visible:outline-0 !rounded-2xl overflow-hidden w-[620px] max-w-[calc(95vw)] p-0 bg-white dark:bg-dark outline-none border">
          
          <Dialog.Title className="text-lg font-semibold leading-6 tracking-tight sr-only">Detalhes do projeto</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground sr-only">Visualize os detalhes do projeto e métricas de desempenho.</Dialog.Description>

          <div className="flex flex-col">
            <div className="px-6 pt-6">
              <p className="text-lg text-foreground font-medium">Detalhes do projeto</p>
            </div>

            <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
              {/* Project Preview Card */}
              <div className="rounded-xl bg-card text-card-foreground shadow-md overflow-hidden border">
                <div className="relative h-44 overflow-hidden flex items-end justify-center">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/90 to-background/0"></div>
                  <div className="absolute bottom-4 z-20">
                    <div className="flex items-center gap-1 bg-black dark:bg-white text-white dark:text-black px-2.5 py-0.5 rounded-xl text-[11px] select-none">
                      <span className="flex items-center gap-1.5 text-[12px]">
                        <span className="block h-2 w-2 shrink-0 rounded-full bg-gray-400"></span>
                        Rascunho
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pt-3 pb-4 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 w-full">
                    <p className="text-sm text-foreground font-medium line-clamp-1">{project.title}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#5b5b64] font-normal">Criado às {formattedTime}</p>
                  </div>
                </div>
              </div>

              {/* No Metrics Block */}
              <div className="bg-card text-card-foreground shadow-md flex items-center justify-center rounded-xl border p-4 h-48">
                <div className="flex items-start gap-6">
                  <svg width="73" height="63" viewBox="0 0 73 63" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <rect x="0.54" y="7.85" width="67.94" height="41.89" rx="3.59" transform="rotate(-5 0.54 7.85)" className="fill-background stroke-gray-300"></rect>
                    <rect x="28.04" y="1.28" width="10.89" height="39.25" rx="2.04" transform="rotate(-5 28.04 1.28)" className="fill-gray-50 stroke-gray-300"></rect>
                    <rect x="15.94" y="23.62" width="11" height="18" rx="2.04" transform="rotate(-5 15.94 23.62)" className="fill-gray-50 stroke-gray-300"></rect>
                    <rect x="42.86" y="11.23" width="11" height="28" rx="2.04" transform="rotate(-5 42.86 11.23)" className="fill-gray-50 stroke-gray-300"></rect>
                    <ellipse cx="36.97" cy="60.22" rx="25.28" ry="2.3" className="fill-gray-100"></ellipse>
                  </svg>
                  <div className="flex flex-1 flex-col items-start justify-center gap-4 w-80">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-foreground font-medium">Sem métricas disponíveis ainda</p>
                      <p className="text-sm text-[#5b5b64] font-normal leading-relaxed">Publique no PodcastAds para acompanhar.</p>
                    </div>
                    <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-8 px-2.5 rounded-lg text-xs">
                      Publicar projeto
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="px-4 py-4 border-t border-gray-alpha-200 flex justify-between items-center">
              <div></div>
              <div className="flex gap-2">
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-9 px-3 rounded-[10px]">
                  Compartilhar
                </button>
                <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-black dark:bg-white text-white dark:text-black border hover:opacity-70 shadow-none h-9 px-3 rounded-[10px]">
                  Editar projeto
                </button>
              </div>
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
    </Dialog.Root>
  );
}
