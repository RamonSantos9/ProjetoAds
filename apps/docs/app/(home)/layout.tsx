import '../global.css';
import { HomeLayout } from '@xispedocs/ui/layouts/home';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from '@xispedocs/ui/layouts/home/navbar';
import Link from '@xispedocs/core/link';
import Image from 'next/image';
import Preview from '@/public/banner.png';
import {
  Book,
  ComponentIcon,
  LayoutDashboard,
  Server,
  ShieldCheck,
} from 'lucide-react';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      style={
        {
          '--spacing-fd-container': '1120px',
        } as object
      }
      links={[
        {
          type: 'menu',
          on: 'menu',
          text: 'Explorar',
          items: [
            {
              text: 'Documentação',
              description:
                'Acesse o guia técnico, arquitetura e processos do PodcastAds.',
              url: '/docs',
              icon: <Book />,
            },
            {
              text: 'Podcasts',
              description:
                'Acesse nossa biblioteca completa de episódios gravados.',
              url: '/episodios',
              icon: <ComponentIcon />,
            },
            {
              text: 'Painel do Ouvinte',
              description:
                'Visualize estatísticas e acompanhe seus episódios favoritos.',
              url: '/dashboard/home',
              icon: <LayoutDashboard />,
            },
            {
              text: 'Dashboard Admin',
              description:
                'Gerencie episódios, pautas e usuários da plataforma.',
              url: '/admin/home',
              icon: <ShieldCheck />,
            },
          ],
        },
        {
          type: 'custom',
          on: 'nav',
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>
                <Link href="/docs">Documentação</Link>
              </NavbarMenuTrigger>
              <NavbarMenuContent className="text-[15px]">
                <NavbarMenuLink href="/docs" className="md:row-span-2">
                  <div className="-mx-3 -mt-3">
                    <Image
                      src={Preview}
                      alt="Preview"
                      className="rounded-t-lg object-cover"
                      style={{
                        maskImage:
                          'linear-gradient(to bottom,white 60%,transparent)',
                      }}
                    />
                  </div>
                  <p className="font-medium">Documentação</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Acesse o guia técnico, arquitetura e processos do
                    PodcastAds.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink href="/episodios" className="lg:col-start-2">
                  <ComponentIcon className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">Podcasts</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Acesse nossa biblioteca completa de episódios gravados.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="/dashboard/home"
                  className="lg:col-start-3"
                >
                  <LayoutDashboard className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">Painel do Ouvinte</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Visualize estatísticas e acompanhe seus episódios favoritos.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="https://serradouradalorena.com.br"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="lg:col-start-2"
                >
                  <Server className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">Nossa Faculdade</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Conheça a Faculdade Serra Dourada e o curso de ADS.
                  </p>
                </NavbarMenuLink>

                <NavbarMenuLink
                  href="/admin/home"
                  className="lg:col-start-3 lg:row-start-2"
                >
                  <ShieldCheck className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">Dashboard Admin</p>
                  <p className="text-fd-muted-foreground text-sm">
                    Gerencie episódios, pautas e usuários da plataforma.
                  </p>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
        ...linkItems,
      ]}
      className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
    >
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer() {
  return (
    <>
    <div className="w-full border-t border-dashed" />
    <footer className="relative pb-12 container mt-16" data-footer="true">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-6 gap-y-16">
        {/* Coluna Logo e Idioma */}
        <div className="flex flex-col gap-6">
          <Link
            aria-label="PodcastAds"
            className="block w-fit outline-none focus-visible:outline-fd-primary rounded text-fd-foreground p-2 -m-2 hover:text-fd-muted-foreground transition"
            href="/"
          >
            <span className="text-xl font-bold tracking-tighter">PodcastAds</span>
          </Link>
        </div>

        {/* Colunas de Links */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10">
          {/* Navegação */}
          <div>
            <p className="text-sm font-bold text-fd-muted-foreground mb-4">
              Navegação
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/episodios" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Episódios
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Guias Técnicos
                </Link>
              </li>
              <li>
                <Link href="/dashboard/home" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Painel Central
                </Link>
              </li>
              <li>
                <Link href="/admin/home" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <p className="text-sm font-bold text-fd-muted-foreground mb-4">
              Institucional
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/privacidade" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors underline-offset-4 decoration-fd-primary/30">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors underline-offset-4 decoration-fd-primary/30">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <a 
                  href="https://serradouradalorena.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors"
                >
                  Serra Dourada
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-sm font-bold text-fd-muted-foreground mb-4">
              Social
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Spotify
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/podcastads" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@podcastads" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://github.com/RamonSantos9/PodcastAds" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground transition-colors">
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      
      <div className="mt-20 border-t pt-10 flex flex-col md:flex-row justify-between items-center gap-4 border-dashed">
        <p className="text-xs text-fd-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} PodcastAds. Desenvolvido por alunos de ADS.
        </p>
        <div className="flex gap-6">
          <Link href="/privacidade" className="text-xs text-fd-muted-foreground hover:text-fd-foreground">Proteção de Dados</Link>
          <Link href="/termos" className="text-xs text-fd-muted-foreground hover:text-fd-foreground">Aviso Legal</Link>
        </div>
      </div>
    </footer>
    </>
  );
}