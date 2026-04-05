'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MapPin,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { 
  ActionButtonRefined, 
} from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';

interface CalendarEvent {
  id: string;
  title: string;
  guest: string;
  time: string;
  type: 'Gravação' | 'Pauta' | 'Lançamento';
  day: number;
}

export default function CronogramaAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // Exemplo de dias do mês
  const events: CalendarEvent[] = [
    { id: 'e1', title: 'Gravação Piloto', guest: 'Time QA', time: '14:00', type: 'Gravação', day: 10 },
    { id: 'e2', title: 'Review de Pauta', guest: 'N/A', time: '10:00', type: 'Pauta', day: 12 },
    { id: 'e3', title: 'Lançamento Ep 05', guest: 'Especialista', time: '08:00', type: 'Lançamento', day: 15 },
    { id: 'e4', title: 'Entrevista Mercado', guest: 'CEO Local', time: '16:30', type: 'Gravação', day: 22 },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Gravação': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'Pauta': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'Lançamento': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default: return 'bg-fd-accent text-fd-muted-foreground border-fd-border';
    }
  };

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Planejamento
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Cronograma de Produção
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Visualize e organize as datas de gravação, reuniões de pauta e lançamentos. Mantenha a cadência do seu podcast em dia.
              </p>
              <ActionButtonRefined 
                label="Agendar Evento" 
                icon={<Plus className="size-5" />}
                onClick={() => alert('Abrindo seletor de data...')}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-fd-foreground">Abril 2026</h2>
                  <div className="flex items-center gap-1">
                     <button className="p-1.5 hover:bg-fd-accent rounded-lg border border-fd-border transition-colors"><ChevronLeft className="size-4" /></button>
                     <button className="p-1.5 hover:bg-fd-accent rounded-lg border border-fd-border transition-colors"><ChevronRight className="size-4" /></button>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-fd-accent text-fd-foreground border border-fd-border rounded-lg text-xs font-bold hover:bg-fd-accent/80 transition-all">
                     <Filter className="size-3.5" /> Filtros
                  </button>
                  <div className="flex bg-fd-accent/30 p-1 rounded-lg border border-fd-border">
                     <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-[#1A1A1A] rounded-md shadow-sm">Mês</button>
                     <button className="px-3 py-1 text-[10px] font-bold text-fd-muted-foreground">Semana</button>
                  </div>
               </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-fd-border border border-fd-border rounded-2xl overflow-hidden mt-2">
               {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                 <div key={d} className="bg-fd-accent/50 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-fd-muted-foreground border-b border-fd-border">{d}</div>
               ))}
               {days.map((day, i) => {
                 const dayEvents = events.filter(e => e.day === day);
                 const isToday = day === 3; // Mock today
                 const isCurrentMonth = day > 0 && day <= 30;

                 return (
                   <div key={i} className={cn(
                     "min-h-[120px] bg-white dark:bg-[#121212] p-2 flex flex-col gap-1 transition-colors hover:bg-fd-accent/10",
                     !isCurrentMonth && "opacity-30 bg-fd-accent/5"
                   )}>
                      <div className="flex justify-between items-start mb-1">
                         <span className={cn(
                           "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mt-1",
                           isToday ? "bg-fd-primary text-white" : "text-fd-muted-foreground"
                         )}>{day > 0 && day <= 30 ? day : ''}</span>
                         {dayEvents.length > 0 && isCurrentMonth && (
                           <button className="p-1 opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-3 text-fd-muted-foreground" /></button>
                         )}
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                         {isCurrentMonth && dayEvents.map(event => (
                           <div key={event.id} className={cn(
                             "px-2 py-1 rounded-md text-[9px] font-bold border truncate cursor-pointer hover:shadow-md transition-all",
                             getEventColor(event.type)
                           )}>
                              {event.time} {event.title}
                           </div>
                         ))}
                      </div>
                   </div>
                 );
               })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
