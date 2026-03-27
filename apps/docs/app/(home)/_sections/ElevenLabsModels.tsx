import Link from 'next/link';
import { BookOpenText, Building2, LayoutDashboard, RadioTower } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';

const episodios = [
  {
    title: 'Episodio piloto: apresentacao do Podcast ADS',
    description: 'Introducao ao projeto e ao conceito do podcast academico.',
  },
  {
    title: 'ADS, tecnologia e mercado',
    description: 'Conversas sobre curso, tecnologia e experiencias da area.',
  },
  {
    title: 'Resultados, audiencia e BI',
    description: 'Leitura de audiencia e consolidacao dos resultados.',
  },
];

export function ElevenLabsModels() {
  return (
    <section
      id="episodios"
      className="relative border-t border-dashed bg-transparent px-4 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fd-muted-foreground">
            Conteudo do portal
          </p>
          <h2 className="mt-3 text-balance text-4xl font-light tracking-tight text-fd-foreground">
            Episodios e secoes pensados para apresentar o projeto.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-fd-muted-foreground">
            A landing organiza o contexto academico, os episodios e os acessos principais.
          </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-fd-border bg-fd-card p-5">
                <RadioTower className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">
                  Area de episodios
                </p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Destaque para novos episodios e chamadas para ouvir.
                </p>
              </div>
              <div className="rounded-3xl border border-fd-border bg-fd-card p-5">
                <BookOpenText className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">
                  Documentacao tecnica
                </p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Materiais e termos tecnicos do trabalho.
                </p>
              </div>
              <div className="rounded-3xl border border-fd-border bg-fd-card p-5">
                <LayoutDashboard className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">
                  Dashboard preservada
                </p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Painel interno para operacao do projeto.
                </p>
              </div>
              <div className="rounded-3xl border border-fd-border bg-fd-card p-5">
                <Building2 className="mb-3 h-5 w-5 text-fd-foreground" />
                <p className="text-sm font-medium text-fd-foreground">
                  Vitrine institucional
                </p>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  Relacao com o curso ADS e com a faculdade.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-fd-border bg-fd-card p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fd-muted-foreground">
              Episodios sugeridos
            </p>
            <div className="mt-6 space-y-4">
              {episodios.map((episodio, index) => (
                <article
                  key={episodio.title}
                  className="rounded-3xl border border-fd-border bg-fd-background px-5 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">
                    Episodio {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-fd-foreground">
                    {episodio.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {episodio.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className={cn(buttonVariants({ size: 'lg', className: 'rounded-full px-8' }))}
              >
                Abrir documentacao
              </Link>
              <a
                href="https://serradouradalorena.com.br"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    size: 'lg',
                    className: 'rounded-full px-8',
                  }),
                )}
              >
                Ver faculdade
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
