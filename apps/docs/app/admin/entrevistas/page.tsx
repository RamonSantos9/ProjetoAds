'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  User,
  History,
  FileText,
  CheckCircle,
  Edit3,
  MoreVertical,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { ActionButtonRefined } from '@/components/ui/RefinedComponents';
import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface InterviewRecord {
  id: string;
  guestName: string;
  topic: string;
  date: string;
  status: 'Confirmada' | 'Realizada' | 'Planejando';
  questionsCount: number;
}

export default function EntrevistasAdminPage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [search, setSearch] = useState('');

  const interviews: InterviewRecord[] = [
    {
      id: 'i1',
      guestName: 'Prof. Ricardo Lima',
      topic: 'Mercado Fullstack 2026',
      date: '2026-04-10',
      status: 'Confirmada',
      questionsCount: 12,
    },
    {
      id: 'i2',
      guestName: 'Julia Santos',
      topic: 'Carreira em ADS na Serra Dourada',
      date: '2026-03-25',
      status: 'Realizada',
      questionsCount: 8,
    },
    {
      id: 'i3',
      guestName: 'Tech Inovação',
      topic: 'IA e o futuro do desenvolvimento',
      date: '2026-04-20',
      status: 'Planejando',
      questionsCount: 15,
    },
    {
      id: 'i4',
      guestName: 'Equipe PodcastAds',
      topic: 'Bastidores do lançamento',
      date: '2026-04-05',
      status: 'Confirmada',
      questionsCount: 5,
    },
  ];

  const filtered = interviews.filter(
    (i) =>
      i.guestName.toLowerCase().includes(search.toLowerCase()) ||
      i.topic.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="rebrand-body flex flex-col min-h-screen bg-[#FFFFFF] dark:bg-fd-background p-4 md:p-8 overflow-hidden">
      <main className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
        {/* Header */}
        <div className="flex justify-between items-end mb-4 md:mb-8 w-full">
          <div className="stack">
            <p className="truncate text-sm text-fd-muted-foreground">
              {isAdmin ? 'Administração' : 'Dashboard'} / Comunicação
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-fd-foreground mt-1">
              Entrevistas & Diálogos
            </h1>
          </div>
          <ThemeToggle mode="light-dark" />
        </div>

        <div className="bg-white dark:bg-fd-background w-full flex flex-col flex-1">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[#74748D] dark:text-fd-muted-foreground text-sm max-w-2xl">
                Gerencie as perguntas e a estrutura das conversas com seus
                convidados. Mantenha um banco de dados de tópicos recorrentes e
                feedbacks de entrevistas anteriores.
              </p>
              <ActionButtonRefined
                label="Nova Entrevista"
                icon={<Plus className="size-5" />}
                onClick={() => toast.info('Abrindo formulário de planejamento...')}
              />
            </div>

            <hr className="w-full h-px bg-fd-border border-none opacity-50" />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-fd-border bg-fd-accent/30 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-fd-primary/10 flex items-center justify-center text-fd-primary shrink-0">
                  <HelpCircle className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-fd-foreground">
                    42
                  </span>
                  <span className="text-[10px] text-fd-muted-foreground uppercase font-bold">
                    Questões Salvas
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-fd-border bg-fd-accent/30 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-fd-foreground">
                    12
                  </span>
                  <span className="text-[10px] text-fd-muted-foreground uppercase font-bold">
                    Realizadas
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-fd-border bg-fd-accent/30 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                  <TrendingUp className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-fd-foreground">
                    85%
                  </span>
                  <span className="text-[10px] text-fd-muted-foreground uppercase font-bold">
                    Taxa de Conclusão
                  </span>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[400px]">
              <input
                className="w-full bg-background border border-fd-border rounded-lg pl-3 pr-9 py-2 text-sm text-fd-foreground focus:outline-none"
                placeholder="Pesquisar por convidado ou tema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground" />
            </div>

            {/* Interview List */}
            <div className="grid gap-4 mt-2">
              {filtered.map((interview) => (
                <div
                  key={interview.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-fd-border bg-white dark:bg-[#121212] hover:border-fd-primary/40 transition-all gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-fd-accent flex items-center justify-center text-fd-muted-foreground border border-fd-border shrink-0">
                      <User className="size-6" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-fd-foreground group-hover:text-fd-primary transition-colors">
                        {interview.guestName}
                      </h3>
                      <p className="text-xs text-fd-muted-foreground">
                        {interview.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] text-fd-muted-foreground uppercase font-bold tracking-tight">
                        Data do Evento
                      </span>
                      <span className="text-xs font-semibold text-fd-foreground flex items-center gap-1.5">
                        <History className="size-3.5" />{' '}
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] text-fd-muted-foreground uppercase font-bold tracking-tight">
                        Perguntas
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                          interview.questionsCount > 10
                            ? 'bg-fd-primary/10 text-fd-primary border-fd-primary/20'
                            : 'bg-fd-accent border-fd-border text-fd-muted-foreground',
                        )}
                      >
                        {interview.questionsCount} ítens
                      </span>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] text-fd-muted-foreground uppercase font-bold tracking-tight">
                        Status
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold',
                          interview.status === 'Realizada'
                            ? 'text-green-500'
                            : interview.status === 'Confirmada'
                              ? 'text-blue-500'
                              : 'text-orange-500',
                        )}
                      >
                        {interview.status}
                      </span>
                    </div>

                    <div className="h-10 w-px bg-fd-border hidden lg:block mx-2" />

                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-fd-accent rounded-lg text-fd-muted-foreground transition-colors"
                        title="Ver roteiro associado"
                      >
                        <FileText className="size-4" />
                      </button>
                      <button className="p-2 hover:bg-fd-accent rounded-lg text-fd-muted-foreground transition-all">
                        <Edit3 className="size-4" />
                      </button>
                      <button className="p-2 hover:bg-fd-accent rounded-lg text-fd-muted-foreground transition-all">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
