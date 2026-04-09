import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <div className="mt-20 lg:mt-40">
        <div className="container mx-auto px-4 grid grid-cols-12 gap-4">
          <h1 className="text-4xl lg:text-6xl font-bold col-span-12 lg:col-span-8 lg:col-start-3 mb-10">
            Política de Privacidade
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 grid grid-cols-12 gap-4 mt-16 pb-20">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 prose prose-invert max-w-none">
          <h4 className="text-2xl font-bold mb-4" id="privacy-policy">
            Política de Privacidade do PodcastAds
          </h4>
          <p className="text-subtle mb-6">Atualizado em 09 de Abril de 2026</p>
          
          <p className="mb-6">
            Esta Política de Privacidade explica como o <strong>PodcastAds</strong> ("nós", "nosso") processa Dados Pessoais de indivíduos que acessam ou usam nosso site ou serviços para fins acadêmicos e educacionais.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Escopo e Finalidade Acadêmica</h2>
          <p className="mb-4">
            O PodcastAds é um projeto desenvolvido para fins de aprendizado e demonstração tecnológica. Os dados coletados são utilizados estritamente para o funcionamento das ferramentas de demonstração (como transcrição de áudio e gestão de episódios fictícios).
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Categorias de Dados que Coletamos</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Informações de Conta:</strong> Nome, e-mail institucional e foto de perfil fornecidos via login social (Google/GitHub).
            </li>
            <li>
              <strong>Entradas de Áudio:</strong> Arquivos de áudio carregados para fins de transcrição e geração de podcasts.
            </li>
            <li>
              <strong>Dados de Uso:</strong> Informações técnicas como endereço IP, tipo de navegador e interações com a interface para melhoria da experiência do usuário.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Base Legal para Processamento</h2>
          <p className="mb-4">
            Processamos seus dados com base no seu <strong>consentimento</strong> ao realizar o login e na necessidade de execução das funcionalidades solicitadas por você dentro da plataforma.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Compartilhamento de Dados</h2>
          <p className="mb-4">
            Seus dados podem ser compartilhados com:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Supabase:</strong> Para armazenamento seguro do banco de dados e arquivos.</li>
            <li><strong>Prisma:</strong> Como interface de comunicação com o banco de dados.</li>
            <li><strong>Provedores de IA:</strong> Seus áudios podem ser enviados temporariamente para serviços de transcrição de terceiros (como OpenAI ou Google Cloud) para processamento.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Seus Direitos</h2>
          <p className="mb-4">
            Você tem o direito de:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Acessar seus dados pessoais.</li>
            <li>Solicitar a exclusão total da sua conta e de todos os dados associados.</li>
            <li>Retirar seu consentimento a qualquer momento.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Segurança</h2>
          <p className="mb-4">
            Implementamos medidas razoáveis de segurança, incluindo criptografia e autenticação segura via NextAuth, para proteger seus dados contra acesso não autorizado.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contato</h2>
          <p className="mb-4">
            Para questões acadêmicas ou solicitações de remoção de dados, entre em contato através do e-mail institucional do desenvolvedor cadastrado na plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
