import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Globe2, Podcast, Settings2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Projeto',
  description:
    'Visão geral pública do PodcastADS, seus objetivos, eixos de trabalho e entregas principais.',
});

const pillars = [
  {
    icon: Settings2,
    title: 'Sistema web responsivo',
    description:
      'Cadastro, edição e publicação de episódios em uma interface pensada para organizar o ciclo de vida do podcast.',
  },
  {
    icon: Podcast,
    title: 'Automação de estatísticas',
    description:
      'Coleta de audiência e engajamento nas plataformas para apoiar as decisões do grupo.',
  },
  {
    icon: BarChart3,
    title: 'Painel de BI',
    description:
      'Análise visual de episódios, crescimento do projeto e interação do público.',
  },
];

export default function ProjectPage() {
  return (
    <main className="container relative z-2 max-w-[1100px] px-2 py-4 lg:py-8">
      <div
        className="overflow-hidden border-x border-t border-dashed border-fd-border"
        style={{
          background:
            'repeating-linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-fd-primary) 1%, transparent) 500px, transparent 1000px)',
        }}
      >
        <section className="relative overflow-hidden border-b border-dashed bg-fd-background/80 px-5 py-14 md:px-10">
          <div
            className="absolute inset-0 z-[-1]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, var(--color-fd-secondary), transparent 80%)',
              opacity: 0.5,
            }}
          />
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fd-muted-foreground">
            Sobre o Projeto
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
            Um portal público com tecnologia, conteúdo e impacto para a
            comunidade da Serra Dourada.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-fd-muted-foreground md:text-lg">
            O PodcastADS é um projeto de extensão do curso de Análise e
            Desenvolvimento de Sistemas. A proposta une um portal comunicativo
            acessível ao público com um sistema de operação para episódios,
            estatísticas e análise de engajamento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/episodios" className={cn(buttonVariants({ size: 'lg' }))}>
              Ver episódios
            </Link>
            <Link
              href="/app/home"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Abrir dashboard
            </Link>
          </div>
        </section>

        <section className="p-6 md:p-10 border-b border-dashed border-fd-border">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[20px] bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 p-6 md:p-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 group">
                <div className="mb-6 h-12 w-12 rounded-[12px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                  <Icon className="size-6 text-gray-950 dark:text-gray-100" />
                </div>
                <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-100">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="p-6 md:p-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="h-full rounded-[24px] bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 p-6 md:p-8 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 group">
              <div className="mb-6 h-12 w-12 rounded-[12px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                <Globe2 className="size-6 text-gray-950 dark:text-gray-100" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-950 dark:text-gray-100">
                O que o público encontra no portal
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base">
                <li className="flex gap-3"><span className="text-fd-primary font-bold">•</span> Apresentação do projeto, da faculdade e do curso de ADS.</li>
                <li className="flex gap-3"><span className="text-fd-primary font-bold">•</span> Biblioteca de episódios e pautas em andamento.</li>
                <li className="flex gap-3"><span className="text-fd-primary font-bold">•</span> Divulgação de convidados, temas e canais de distribuição.</li>
                <li className="flex gap-3"><span className="text-fd-primary font-bold">•</span> Uma porta de entrada pública para acompanhar o projeto.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-950 dark:text-gray-100 mb-6">Público-alvo</h2>
            <div className="grid gap-4">
              <div className="rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200">
                <p className="font-semibold text-gray-950 dark:text-gray-100">Comunidade da região Serra Dourada</p>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Pessoas interessadas em tecnologia, cidadania, cultura e nas
                  iniciativas da faculdade.
                </p>
              </div>
              <div className="rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200">
                <p className="font-semibold text-gray-950 dark:text-gray-100">Estudantes e profissionais</p>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Conteúdos sobre carreira, desenvolvimento, soft skills e
                  tendências do mercado.
                </p>
              </div>
              <div className="rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200">
                <p className="font-semibold text-gray-950 dark:text-gray-100">Empreendedores e artistas locais</p>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Espaço para entrevistas, divulgação de histórias e conexão com
                  o ecossistema regional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
