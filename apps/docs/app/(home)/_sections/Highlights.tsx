import type { ReactNode } from 'react';
import {
  LayoutIcon,
  MousePointer,
  PersonStandingIcon,
  RocketIcon,
  ServerIcon,
  TimerIcon,
  type LucideIcon,
} from 'lucide-react';

/**
 * Seção de destaques (Highlights).
 * Exibe uma grade de características principais com ícones.
 */
export function Highlights() {
  return (
    <div className="grid grid-cols-1 border-r border-dashed md:grid-cols-2 lg:grid-cols-3">
      {/* Cabeçalho da seção com um ícone de ponteiro decorativo */}
      <div className="col-span-full flex flex-row items-start justify-center border-l border-t border-dashed p-8 pb-2 text-center">
        <h2 className="bg-fd-primary text-fd-primary-foreground px-1 text-2xl font-semibold">
          Destaques
        </h2>
        <MousePointer className="-ml-1 mt-8" />
      </div>

      {/* Grid de itens de destaque */}
      <Highlight icon={TimerIcon} heading="Sempre Atualizado.">
        Novos episódios toda semana sobre o mercado de tecnologia.
      </Highlight>
      <Highlight icon={RocketIcon} heading="Foco na Carreira.">
        Dicas práticas para alunos de Análise e Desenvolvimento de Sistemas.
      </Highlight>
      <Highlight icon={LayoutIcon} heading="Comunidade Ativa.">
        Interação direta com alunos e professores da Serra Dourada.
      </Highlight>
      <Highlight icon={ServerIcon} heading="Direto ao Ponto.">
        Entrevistas sem enrolação com quem faz a tecnologia acontecer.
      </Highlight>
      <Highlight icon={PersonStandingIcon} heading="Exclusivo.">
        Conteúdo pensado para a realidade acadêmica da Faculdade.
      </Highlight>
    </div>
  );
}

/**
 * Componente individual para um item de destaque.
 */
function Highlight({
  icon: Icon,
  heading,
  children,
}: {
  icon: LucideIcon;
  heading: ReactNode;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="border-l border-t border-dashed px-6 py-12">
      {/* Cabeçalho do item com ícone e título pequeno */}
      <div className="mb-4 flex flex-row items-center gap-2 text-fd-muted-foreground">
        <Icon className="size-4" />
        <h2 className="text-sm font-medium">{heading}</h2>
      </div>
      {/* Conteúdo principal do item */}
      <span className="font-medium">{children}</span>
    </div>
  );
}
