import Image from 'next/image';
import { Marquee } from '@/app/(home)/marquee';

const feedback = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/1',
    user: 'Prof. Anderson',
    role: 'Coordenador de ADS',
    message: `O PodcastADS é uma ferramenta fundamental para levar o conhecimento teórico da sala de aula para o mundo real, conectando nossos alunos com profissionais do mercado.`,
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/35677084',
    user: 'Júlia Santos',
    role: 'Aluna do 4º Período',
    message: `Adoro ouvir os episódios no caminho para a faculdade. As dicas sobre carreira e tecnologia me ajudam muito a decidir em qual área me especializar.`,
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/3',
    user: 'Tech Inovação',
    role: 'Empresa Parceira',
    message: 'Uma iniciativa incrível da Serra Dourada. Talentos são formados quando há essa troca de experiências que o podcast proporciona.',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/10645823',
    user: 'Ricardo Lima',
    role: 'Desenvolvedor Fullstack',
    message: `Eu não teria a chance de aprender tanto sobre o mercado de trabalho sem as conversas incríveis deste podcast! 💚`,
  },
];

/**
 * Seção de Feedback/Depoimentos.
 * Exibe um carrossel (Marquee) com mensagens de usuários e desenvolvedores influentes.
 */
export function Feedback() {
  return (
    <div className="relative border-x border-t border-dashed pt-8 bg-fd-background">
      <div className="flex flex-row gap-6 justify-between px-6 mb-6 items-center">
        <p className="text-sm font-medium md:text-lg">
          Ouvido pela comunidade acadêmica e empresas
        </p>
      </div>
      {/* Componente Marquee para o efeito de rolagem infinita horizontal */}
      <Marquee className="pb-8 [mask-image:linear-gradient(to_right,transparent,white_20px,white_calc(100%-20px),transparent)]">
        {feedback.map((item) => (
          <div
            key={item.user}
            className="flex flex-col rounded-xl border bg-gradient-to-b from-fd-card p-4 shadow-lg w-[320px]"
          >
            {/* Mensagem do depoimento */}
            <p className="text-sm whitespace-pre-wrap">{item.message}</p>

            {/* Informações do autor do depoimento (Avatar, Nome, Cargo) */}
            <div className="mt-auto flex flex-row items-center gap-2 pt-4">
              <Image
                src={item.avatar}
                alt="avatar"
                width="32"
                height="32"
                unoptimized
                className="size-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{item.user}</p>
                <p className="text-xs text-fd-muted-foreground">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
