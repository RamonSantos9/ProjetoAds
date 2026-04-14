import React from 'react';
import { Ellipsis, Download } from 'lucide-react';

export function EmptyEpisodesState() {
  const mockCards = [
    {
      title: "Como usar IA para criar vinhetas",
      time: "há 1 hora",
      owner: "Proprietário",
    },
    {
      title: "Episodio 1: Como usar IA para fazer transcrições",
      time: "há 3 horas",
      owner: "Proprietário",
    },
    {
      title: "Episodio 2: Melhor Podcast Ads",
      time: "há 6 horas",
      owner: "Proprietário",
    },
    {
      title: "Episodio 3: Estudio de Ads",
      time: "anteontem",
      owner: "Proprietário",
    },
    {
      title: "Episodio 4: Qual a Melhor IA para gerar transcrições?",
      time: "há 2 semanas",
      owner: "Proprietário",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden min-h-[400px]">
      {/* Ghost Grid */}
      <div className="relative opacity-30 select-none pointer-events-none">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 w-full">
          {mockCards.map((card, i) => (
            <div 
              key={i} 
              className="isolate overflow-hidden relative group pb-1.5 focus:outline-none !ring-0"
            >
              <div className="relative w-full aspect-[16/9] bg-fd-muted flex justify-center items-end overflow-hidden rounded-2xl border">
                {/* Floating Elements Mock */}
                <div className="relative w-[60%] h-[calc(100%-0.75rem)] translate-y-5 overflow-hidden rounded-t-lg shadow-xl origin-top-right bg-fd-background dark:bg-zinc-800 py-3 px-3.5 flex flex-col border">
                   <div 
                     className="flex w-full h-full flex-col opacity-20" 
                     style={{ maskImage: 'linear-gradient(to top, transparent 0px, black 40%, black 100%)' }}
                   >
                     <div className="h-2 w-full bg-fd-muted rounded mb-2" />
                     <div className="h-2 w-3/4 bg-fd-muted rounded mb-2" />
                     <div className="h-2 w-1/2 bg-fd-muted rounded" />
                   </div>
                </div>
                
                {/* Buttons Mock */}
                <div className="flex items-center justify-end gap-1.5 absolute top-3 right-3 z-20">
                  <div className="h-8 w-8 rounded-lg bg-fd-background/80 border border-fd-border flex items-center justify-center">
                    <Download className="w-4 h-4 text-fd-muted-foreground" />
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-fd-background/80 border border-fd-border flex items-center justify-center">
                    <Ellipsis className="w-4 h-4 text-fd-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="pt-3">
                <div className="shrink flex flex-col min-w-0">
                  <p className="text-sm text-fd-foreground font-medium truncate opacity-60">
                    {card.title}
                  </p>
                  <p className="text-xs text-fd-muted-foreground font-normal flex items-center gap-1 mt-1">
                    Criado <span>{card.time}</span>
                    <span className="font-bold">·</span>
                    <span>{card.owner}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Soft Fade Overlay */}
        <div className="absolute inset-0 z-30 bg-gradient-to-t from-fd-background via-fd-background/40 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
