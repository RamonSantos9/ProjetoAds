import { Heart, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

/**
 * Seção de Contribuidores e Agradecimentos.
 * Busca dinamicamente os contribuidores do repositório no GitHub.
 */
export async function Contributors() {
  let contributors: Contributor[] = [];

  try {
    const res = await fetch(
      'https://api.github.com/repos/RamonSantos9/ProjetoAds/contributors',
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      },
    );

    if (res.ok) {
      contributors = await res.json();
    }

    // // Adicionamos diversos contribuidores fakes para ver o efeito de empilhamento e o contador +X
    // if (contributors.length < 30) {
    //   const mockCount = 35;
    //   const mocks: Contributor[] = Array.from({ length: mockCount }).map((_, i) => ({
    //     login: `dev_ads_${i + 1}`,
    //     avatar_url: `https://avatars.githubusercontent.com/u/${1000000 + i}?v=4`,
    //     html_url: 'https://github.com/RamonSantos9/ProjetoAds',
    //     contributions: Math.floor(Math.random() * 50) + 1
    //   }));
    //   contributors = [...contributors, ...mocks];
    // }
    // // ------------------------------------
  } catch (error) {
    console.error('Falha ao buscar contribuidores:', error);
  }

  return (
    <div className="flex flex-col items-center border-x border-t border-dashed px-4 py-16 text-center bg-fd-background/50">
      {/* Ícone de Sincronização/GitHub */}
      <Github className="size-6 text-fd-primary mb-4" aria-hidden="true" />

      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
        Impulsionado pela Colaboração.
      </h2>

      <p className="mb-4 text-fd-muted-foreground">
        O <span className="font-bold text-fd-foreground">PodcastAds</span>{' '}
        evolui a cada dia graças ao talento e dedicação da nossa comunidade.
      </p>

      {/* Botões de Ação (Apenas Contribuidores) */}
      <div className="mb-8 flex flex-row items-center justify-center">
        <Link
          href="https://github.com/RamonSantos9/ProjetoAds/graphs/contributors"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-fd-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 border hover:bg-fd-accent hover:text-fd-accent-foreground h-10 px-6 py-2"
        >
          Contribuidores do Projeto
        </Link>
      </div>

      {/* Lista Dinâmica de Contribuidores */}
      <div className="flex flex-col items-center gap-4">
        {contributors.length > 0 ? (
          <div className="flex flex-row flex-wrap items-center justify-center md:pe-4">
            {contributors.slice(0, 20).map((c, i) => {
              const zIndex = 20 - i;
              return (
                <Link
                  key={c.login}
                  href={c.html_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="size-10 overflow-hidden rounded-full border-4 border-fd-background bg-fd-background md:-mr-4 md:size-12 transition-transform hover:scale-110 hover:z-30 relative"
                  style={{ zIndex }}
                  title={`${c.login} - ${c.contributions} contribuições`}
                >
                  <Image
                    src={c.avatar_url}
                    alt={`${c.login}'s avatar`}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </Link>
              );
            })}

            {contributors.length > 20 && (
              <div className="size-10 md:size-12 flex items-center justify-center rounded-full bg-fd-secondary text-fd-secondary-foreground border-4 border-fd-background text-xs font-bold md:p-4 z-0">
                +{contributors.length - 20}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-fd-muted-foreground italic font-mono">
            Os nomes das pessoas que contribuem para o projeto serão exibidos em
            breve.
          </div>
        )}

        <div className="text-center text-sm text-fd-muted-foreground">
          Alguns dos nossos melhores contribuidores.
        </div>
      </div>
    </div>
  );
}
