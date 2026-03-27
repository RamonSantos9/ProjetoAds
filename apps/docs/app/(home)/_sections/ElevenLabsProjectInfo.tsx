import Link from 'next/link';
import { BookOpen, Mail, MicVocal, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

const equipe = [
  {
    title: 'Frontend e experiencia',
    description: 'Portal, visual e navegacao.',
  },
  {
    title: 'Backend, dados e automacao',
    description: 'Cadastro, publicacao e acompanhamento.',
  },
  {
    title: 'Conteudo, roteiro e producao',
    description: 'Roteiro, gravacao e identidade do podcast.',
  },
];

const topicos = [
  'O que e podcast e por que esse formato foi escolhido para o projeto.',
  'Como o sistema web apoia cadastro, edicao e publicacao de episodios.',
  'Como a turma pode acompanhar indicadores de audiencia e engajamento.',
];

const cronograma = [
  {
    etapa: 'Planejamento',
    detalhe:
      'Definicao do tema, proposta do podcast, estrutura do portal e divisao das funcoes da equipe.',
  },
  {
    etapa: 'Desenvolvimento',
    detalhe:
      'Construcao da home publica, documentacao tecnica e painel interno para operacao do projeto.',
  },
  {
    etapa: 'Producao',
    detalhe:
      'Roteiro, gravacao, organizacao dos episodios, publicacao e materiais de divulgacao.',
  },
  {
    etapa: 'Analise final',
    detalhe:
      'Leitura das metricas, painel de BI, consolidacao dos resultados e apresentacao em sala.',
  },
];

export function ElevenLabsProjectInfo() {
  return (
    <section className="border-t border-dashed px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div
          id="sobre"
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
              Visao do projeto
            </p>
            <h2 className="mt-3 text-balance text-4xl font-light tracking-tight text-fd-foreground">
              Uma apresentacao clara do podcast, da equipe e da proposta academica.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
              O portal centraliza a proposta do trabalho e os caminhos principais da experiencia.
            </p>

            <div className="mt-8 space-y-3">
              {topicos.map((topico) => (
                <div
                  key={topico}
                  className="rounded-2xl border border-fd-border bg-fd-card px-4 py-3 text-sm text-fd-foreground"
                >
                  {topico}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-fd-border bg-fd-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-fd-border bg-fd-background p-5">
                <MicVocal className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">Podcast academico</p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Conteudo em audio ligado ao universo de ADS.
                </p>
              </div>
              <div className="rounded-3xl border border-fd-border bg-fd-background p-5">
                <BookOpen className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">Base documental</p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Apoio tecnico para orientar o desenvolvimento.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-fd-border bg-fd-background p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fd-muted-foreground">
                Objetivo
              </p>
              <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                Reunir comunicacao, sistema web e analise em um projeto unico.
              </p>
            </div>
          </div>
        </div>

        <div
          id="equipe"
          className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
              Equipe e execucao
            </p>
            <h2 className="mt-3 text-balance text-4xl font-light tracking-tight text-fd-foreground">
              Uma equipe organizada para transformar a proposta em entrega.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-fd-muted-foreground">
              Cada frente apoia uma parte da construcao do Podcast ADS.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {equipe.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-fd-border bg-fd-card p-6"
              >
                <Users className="mb-4 h-5 w-5 text-fd-foreground" />
                <h3 className="text-lg font-medium text-fd-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div
          id="cronograma"
          className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
              Cronograma resumido
            </p>
            <h2 className="mt-3 text-balance text-4xl font-light tracking-tight text-fd-foreground">
              Etapas pensadas para conduzir o projeto da ideia ate a entrega.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-fd-muted-foreground">
              Um resumo visual do caminho do podcast dentro da disciplina.
            </p>
          </div>

          <div className="grid gap-4">
            {cronograma.map((item, index) => (
              <article
                key={item.etapa}
                className="grid gap-4 rounded-3xl border border-fd-border bg-fd-card p-5 md:grid-cols-[72px_1fr]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fd-muted text-sm font-semibold text-fd-foreground">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-fd-foreground">
                    {item.etapa}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {item.detalhe}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          id="contato"
          className="mt-20 rounded-[2rem] border border-fd-border bg-fd-card px-6 py-8 md:px-10 md:py-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
                Fechamento
              </p>
              <h2 className="mt-3 text-balance text-3xl font-light tracking-tight text-fd-foreground md:text-4xl">
                Continue explorando o Podcast ADS.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-fd-muted-foreground">
                Episodios, documentacao e sistema reunidos em um mesmo projeto.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/docs"
                className={cn(buttonVariants({ size: 'lg', className: 'rounded-full px-8' }))}
              >
                Ler documentacao
              </Link>
              <Link
                href="/app/home"
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                    className: 'rounded-full px-8',
                  }),
                )}
              >
                Acessar sistema
              </Link>
              <a
                href="https://serradouradalorena.com.br"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'lg',
                    className: 'rounded-full px-6',
                  }),
                )}
              >
                <Mail className="mr-2 h-4 w-4" />
                Site da faculdade
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
