import Image from 'next/image';
import ArchImg from '../arch.png';

/**
 * Componente que exibe a arquitetura ou filosofia de design.
 * Apresenta uma imagem ilustrativa ao lado de um texto explicativo.
 */
export function Architecture() {
  return (
    <div className="flex flex-col gap-4 border-x border-t border-dashed p-8 md:px-12 lg:flex-row">
      <div className="text-start">
        {/* Badge estilizado com fonte mono e cores primárias */}
        <p className="px-2 py-1 text-sm font-mono bg-fd-primary text-fd-primary-foreground font-bold w-fit mb-4">
          Ecossistema ADS
        </p>
        <h2 className="text-2xl font-semibold mb-4">
          Um espaço para crescer e aprender.
        </h2>
        <p className="text-fd-muted-foreground mb-6">
          Nossa missão é fortalecer o ecossistema de tecnologia da Serra
          Dourada, trazendo vozes que inspiram e educam futuros profissionais de
          Análise e Desenvolvimento de Sistemas.
        </p>
      </div>
      {/* Imagem da arquitetura com efeito de inversão dependendo do tema (claro/escuro) */}
      <Image
        src={ArchImg}
        alt="Architecture"
        className="mx-auto -my-16 w-full max-w-[400px] invert dark:invert-0 lg:mx-0"
      />
    </div>
  );
}
