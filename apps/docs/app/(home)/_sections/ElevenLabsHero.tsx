import Link from 'next/link';
import { ElevenLabsHeroBackground } from './ElevenLabsHeroBackground';

export function ElevenLabsHero() {
  return (
    <section
      id="hero"
      className="relative z-2 flex flex-col border-t border-dashed px-4 pt-12 md:px-12 md:pt-16"
    >
      <ElevenLabsHeroBackground />

      <div className="container pb-92 pt-92">
        <h1 className="f-heading-01 mx-auto mb-20 max-w-3xl text-center">
          A plataforma completa de voz IA para sua empresa
        </h1>
        <p className="f-paragraph-02 mx-auto max-w-xl text-center">
          Aproveite nossa plataforma completa para agentes e criação de conteúdo para
          melhores experiências de cliente e produção de conteúdo de alta qualidade.
        </p>
        <div className="mx-auto mt-28 flex flex-wrap items-center justify-center gap-8 md:mt-40">
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full effect-color disabled:cursor-not-allowed active:scale-[0.98] transition-transform duration-300 ease-out bg-inverse text-inverse data-[state=active]:bg-darkest tw-outline-none focus-visible:tw-outline-focus w-fit h-48 f-paragraph-02 px-20 hover:bg-darkest"
            href="/pt/contact-sales"
          >
            Fale com Vendas
          </Link>
        </div>
      </div>
    </section>
  );
}
