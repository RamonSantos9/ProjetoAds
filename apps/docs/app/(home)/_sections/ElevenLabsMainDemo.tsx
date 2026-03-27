import Link from 'next/link';
import { BarChart3, Bot, FilePenLine, Mic2 } from 'lucide-react';

const eixoCards = [
  {
    title: 'Sistema web responsivo',
    description:
      'Uma base para organizar cadastro, edicao e publicacao dos episodios.',
    icon: Mic2,
  },
  {
    title: 'Automacao de estatisticas',
    description:
      'Coleta de audiencia para acompanhar a evolucao do projeto.',
    icon: Bot,
  },
  {
    title: 'Painel de BI',
    description:
      'Visualizacao de engajamento para apoiar a leitura final dos resultados.',
    icon: BarChart3,
  },
];

const menuPublico = [
  'Apresentacao do projeto',
  'Proposta academica do podcast',
  'Episodios e atualizacoes',
  'Documentacao e dashboard',
];

export function ElevenLabsMainDemo() {
  return (
    <section
      id="eixos"
      className="relative border-t border-dashed px-4 py-12 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="f-paragraph-02 text-fd-muted-foreground">
            Eixo tecnologico
          </p>
          <h2 className="f-heading-01 mx-auto mt-8 max-w-3xl text-center">
            Tecnologia para sustentar a producao do Podcast ADS.
          </h2>
          <p className="f-paragraph-02 mx-auto mt-8 max-w-2xl text-center text-fd-muted-foreground">
            Um portal para apresentar o projeto e um sistema para apoiar a equipe.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-3xl border border-fd-border bg-fd-card p-6 md:p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-fd-muted mx-auto">
                <FilePenLine className="h-5 w-5 text-fd-foreground" />
              </div>
              <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-fd-muted-foreground">
                Estrutura publica
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {menuPublico.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-fd-border bg-fd-background px-4 py-3 text-sm text-fd-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full effect-color transition-transform duration-300 ease-out bg-inverse text-inverse h-48 f-paragraph-02 px-20 hover:bg-darkest"
                >
                  Explorar documentacao
                </Link>
                <Link
                  href="/app/home"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-fd-border text-fd-foreground transition-colors hover:bg-fd-card h-48 f-paragraph-02 px-20"
                >
                  Ver sistema
                </Link>
              </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {eixoCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-3xl border border-fd-border bg-fd-card/90 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-fd-muted">
                    <Icon className="h-5 w-5 text-fd-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-fd-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
