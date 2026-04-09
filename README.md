# PodcastAds

**Onde o código encontra a conversa.**

<img src="./apps/docs/public/hero.png" alt="PodcastAds Hero" width="100%" />

<p>O portal oficial de tecnologia dos alunos de Análise e Desenvolvimento de Sistemas (ADS) da <b>Faculdade Serra Dourada</b>.</p>

<br />

## Sobre o Projeto

O **PodcastAds** é uma iniciativa estudantil dedicada a conectar alunos, professores e profissionais do mercado. Nossa missão é fortalecer o ecossistema acadêmico através da disseminação de conhecimento, tendências de mercado e soft skills essenciais para o futuro desenvolvedor através de áudio, blog e workshops presenciais.

Mais do que apenas um site institucional, criamos uma plataforma robusta desenvolvida totalmente sob a arquitetura de **Monorepo** com _Next.js_, contendo ferramentas administrativas completas, CMS de episódios e painel de Relatórios.

---

## Autenticação

Sistema de autenticação premium com login social (Google, Apple, SSO) e formulário de e-mail/senha — centralizado, responsivo e com suporte a dark mode.

---

## Documentação Oficial (`/docs`)

Portal de documentação interativo para ouvintes e membros do projeto. Contém guias, referências de conteúdo, arquitetura do sistema e tutoriais para novos colaboradores.

---

## Telas da Plataforma (Portal Público)

A interface pública visa atrair alunos e a comunidade acadêmica. O foco é exibir design premium e performance ultra-rápida.

### Home Page

A página oficial de onde tudo começa. Apresenta nossos diferenciais e episódios em destaque.

### Episódios

Listagem pública com curadoria de conteúdos de tecnologia, engajamento e aprofundamento.

---

## Áreas Administrativas (Dashboard)

Uma das nossas grandes inovações: um painel administrativo com design de padrão industrial (Dark Mode) voltado à gestão fácil do dia a dia do nosso Podcast.

### Dashboard Home

Onde os administradores visualizam as métricas mais importantes num relance e acessam as ferramentas de controle.

<br/>

### Gestão de Episódios (CMS)

Interface para cadastro, edição e administração do ciclo de vida dos conteúdos.

<br/>

### Relatórios Inteligentes

Visualização ágil de Business Intelligence (BI) para acompanhar a evolução do engajamento.

<br/>

---

## Objetivos Tecnológicos

Para atender aos requisitos técnicos exigidos pela universidade e testar nossos limites criativos, o PodcastAds atinge três pilares:

1. **Gerenciamento de Conteúdo (CMS):** Sistema responsivo para o cadastro, edição e publicação de episódios de ponta a ponta.
2. **Painel de BI:** Interface analítica para ajudar decisões sobre os rumos futuros do conteúdo dos alunos.
3. **Automação de Estatísticas:** Coleção de dados automatizadas com escalabilidade no backend (Turbopack + NextJS).

---

## Mapa de Páginas e Rotas da Aplicação

O sistema (Next.js App Router) está organizado em três áreas principais com níveis de permissões diferentes:

### 1. Área Pública (Acesso Livre)

Páginas voltadas para visitantes, focadas em consumo de conteúdo e informações institucionais.

- **`/`** (Página Inicial) - Landing page com destaques e visão geral.
- **`/episodios`** (Galeria de Podcasts) - Listagem técnica de todos os episódios lançados.
- **`/docs`** (Portal de Documentação) - Guia técnico e manual do usuário interativo.

### 2. Autenticação

Acesso seguro centralizado para membros e ouvintes registrados.

- **`/sign-in`** (Entrar) - Login com suporte a provedores sociais e credenciais.
- **`/sign-up`** (Cadastrar) - Fluxo de registro para novos entusiastas da plataforma.

### 3. Área "Dashboard" (Ouvintes e Colaboradores)

Painel personalizado para usuários consumirem métricas e acessarem ferramentas de apoio.

- **`/dashboard/home`** - Visão geral do perfil e atividades recentes.
- **`/dashboard/episodios`** - Biblioteca de episódios com foco em consumo.
- **`/dashboard/relatorios`** - Insights de engajamento pessoal.
- **`/dashboard/transcricoes`** - Acesso a textos convertidos de áudios.
- **`/dashboard/cronograma`** - Agenda de lançamentos e eventos.
- **`/dashboard/midias-visuais`** - Repositório de artes e capas dos episódios.
- **`/dashboard/roteiros`** - Visualização de pautas e roteiros técnicos.
- **`/dashboard/vinhetas-trilhas`** - Repositório de áudios auxiliares.

### 4. Área "Admin" (Gestão e Produção)

Interface de controle total para a equipe de administração do PodcastAds.

- **`/admin/home`** - Centro de comando com métricas globais em tempo real.
- **`/admin/episodios`** - Gestão completa do ciclo de vida dos conteúdos (CMS).
- **`/admin/estudio`** - Workspace para roteirização e pautas ativas.
- **`/admin/relatorios`** - BI avançado com exportação de dados analíticos.
- **`/admin/estatisticas`** - Monitoramento profundo de tráfego e audiência.
- **`/admin/convidados`** - Gestão de banco de talentos e CRM de entrevistados.
- **`/admin/entrevistas`** - Controle de fluxo e pipeline de gravações.
- **`/admin/transcricoes`** - Painel de edição e refinamento de textos via IA.
- **`/admin/cronograma`** - Planejamento estratégico de publicações.
- **`/admin/settings`** - Configurações críticas de sistema e governança.

---

## Estrutura do Monorepo

Utilizamos `Turborepo` em conjunto com `pnpm workspaces` construindo módulos eficientes.

| Pacote                                  | Propósito no Ecossistema PodcastAds                                 |
| :-------------------------------------- | :------------------------------------------------------------------ |
| 🛠️ [`@xispedocs/cli`](./packages/cli)   | Automação local, scripts de setup e CI para episódios/posts.        |
| 🧠 [`@xispedocs/core`](./packages/core) | Lógica main, utilitários base que todas as aplicações compartilham. |
| 📝 [`@xispedocs/mdx`](./packages/mdx)   | Motor de renderização de artigos escritos em Markdown.              |
| 🎨 [`@xispedocs/ui`](./packages/ui)     | Biblioteca centralizada de Visual Components de ADS.                |

---

## Como Executar Localmente

Siga estas instruções para hospedar o repositório na sua máquina de desenvolvimento.

### Pré-requisitos

Certifique-se de possuir o **Node.js 18+** e o **pnpm 9+** instalados.

### Passos de Instalação e Inicialização

1. Instale todas as dependências na raiz do monorepo:

   ```bash
   pnpm install
   ```

2. Inicialize o serviço principal de documentação e a plataforma em modo desenvolvimento local (Turbopack habilitado):

   ```bash
   pnpm dev:docs
   ```

   > _Dica:_ Se houver problemas com serviços pendurados na porta 3000 em ambiente _Windows_, rode o comando seguro de inicialização à prova de falhas:
   >
   > ```bash
   > pnpm dev:clean
   > ```

3. Acesse a aplicação completa direto no seu navegador rodando em: `http://localhost:3000`

---

<sub>Construído com 💚 pelos alunos de ADS da <b>Faculdade Serra Dourada</b>.</sub>
