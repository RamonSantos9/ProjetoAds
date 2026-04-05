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
import { Book, ComponentIcon, LayoutDashboard, Server, ShieldCheck } from 'lucide-react';

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
              description: 'Acesse o guia técnico, arquitetura e processos do PodcastAds.',
              url: '/docs',
              icon: <Book />,
            },
            {
              text: 'Podcasts',
              description: 'Acesse nossa biblioteca completa de episódios gravados.',
              url: '/episodios',
              icon: <ComponentIcon />,
            },
            {
              text: 'Painel do Ouvinte',
              description: 'Visualize estatísticas e acompanhe seus episódios favoritos.',
              url: '/dashboard/home',
              icon: <LayoutDashboard />,
            },
            {
              text: 'Dashboard Admin',
              description: 'Gerencie episódios, pautas e usuários da plataforma.',
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
                    Acesse o guia técnico, arquitetura e processos do PodcastAds.
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
    <footer className="mt-auto border-t bg-background py-12 text-foreground">
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold">PodcastAds - Serra Dourada</p>
          <p className="text-xs">
            Construído com carinho pelos alunos de ADS da{' '}
            <a
              href="https://serradouradalorena.com.br"
              rel="noreferrer noopener"
              target="_blank"
              className="font-bold underline underline-offset-2"
            >
              Faculdade Serra Dourada
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
