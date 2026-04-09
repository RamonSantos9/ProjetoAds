import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <div className="mt-20 lg:mt-40">
        <div className="container mx-auto px-4 grid grid-cols-12 gap-4">
          <h1 className="text-4xl lg:text-6xl font-bold col-span-12 lg:col-span-8 lg:col-start-3 mb-10">
            Termos de Serviço
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-12 gap-4 mt-16 pb-20">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 prose prose-invert max-w-none">
          <h4 className="text-2xl font-bold mb-4" id="terms-of-service">
            Termos e Condições de Uso do PodcastAds
          </h4>
          <p className="text-subtle mb-6">Última atualização: 09 de Abril de 2026</p>
          
          <p className="mb-6">
            Bem-vindo ao <strong>PodcastAds</strong>. Ao acessar ou usar nosso serviço, você concorda em cumprir estes Termos de Serviço ("Termos"). Como este é um projeto acadêmico, o uso é restrito a fins educacionais e experimentais.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao criar uma conta ou utilizar as ferramentas do PodcastAds, você confirma que leu, entendeu e aceita estar vinculado a estes Termos, bem como à nossa Política de Privacidade.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Uso Permitido (Fins Acadêmicos)</h2>
          <p className="mb-4">
            O PodcastAds é fornecido "como está" para demonstração tecnológica e projetos de alunos da Faculdade Serra Dourada. É estritamente proibido o uso desta plataforma para:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Atividades ilegais ou fraudulentas.</li>
            <li>Geração de conteúdo difamatório, ofensivo ou que viole direitos autorais.</li>
            <li>Tentativas de burlar a segurança do sistema ou acessar dados de outros usuários.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Propriedade Intelectual e Conteúdo</h2>
          <p className="mb-4">
            Você retém os direitos sobre o conteúdo original (textos e áudios) que enviar para a plataforma. No entanto, ao utilizar nossos serviços de IA, você reconhece que os resultados (transcrições e vozes sintéticas) são gerados por modelos de terceiros e podem apresentar imprecisões.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Isenção de Responsabilidade</h2>
          <p className="mb-4">
            Por se tratar de um ambiente de desenvolvimento e aprendizado, não garantimos a disponibilidade ininterrupta do serviço nem a preservação permanente dos arquivos carregados. **Não utilize esta plataforma para armazenar dados críticos ou de produção.**
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Encerramento de Acesso</h2>
          <p className="mb-4">
            Reservamo-nos o direito de suspender ou encerrar contas que violem as regras de conduta institucionais ou que abusem dos recursos tecnológicos disponibilizados (como limite de transcrições).
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Alterações nos Termos</h2>
          <p className="mb-4">
            Estes Termos podem ser atualizados periodicamente para refletir mudanças no projeto acadêmico. Recomendamos a revisão regular desta página.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contato e Suporte</h2>
          <p className="mb-4">
            Dúvidas sobre o funcionamento da plataforma ou questões éticas podem ser direcionadas ao desenvolvedor ou ao corpo docente responsável pela disciplina.
          </p>
        </div>
      </div>
    </div>
  );
}
