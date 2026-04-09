import Image from 'next/image';
import { Marquee } from '@/app/(home)/marquee';
import { readDb } from '@/lib/db';

/**
 * Seção de Feedback/Depoimentos.
 * Exibe um carrossel (Marquee) com mensagens de usuários e desenvolvedores influentes.
 */
export async function Feedback() {
  const dbData = await readDb();
  const feedback = dbData.feedbacks || [];

  if (feedback.length === 0) return null;

  return (
    <div className="relative border-x border-t border-dashed pt-8 bg-fd-background">
      <div className="flex flex-row gap-6 justify-between px-6 mb-6 items-center">
        <p className="text-sm font-medium md:text-lg">
          Ouvido pela comunidade acadêmica e empresas
        </p>
      </div>
      {/* Componente Marquee para o efeito de rolagem infinita horizontal */}
      <Marquee className="pb-8 [mask-image:linear-gradient(to_right,transparent,white_20px,white_calc(100%-20px),transparent)]">
        {feedback.map((item, i) => (
          <div
            key={`${item.user}-${i}`}
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
