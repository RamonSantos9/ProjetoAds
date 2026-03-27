# XispeDocs

![XispeDocs](./apps/docs/public/hero.png)

Este é um ecossistema poderoso, flexível e tipado, projetado para construir sites de documentação impressionantes com facilidade.

## Visão Geral

O XispeDocs fornece as ferramentas necessárias para criar uma experiência de desenvolvedor premium em frameworks React como **Next.js**, **Waku**, **Tanstack Start** ou **React Router**.

### Principais Recursos

- **Core Agnóstico de Framework**: Funciona em vários frameworks React.
- **Suporte de Primeira Classe para MDX**: Processamento de conteúdo poderoso com `@xispedocs/mdx`.
- **Integração com OpenAPI**: Gere automaticamente documentações bonitas a partir de especificações de API.
- **Typescript Twoslash**: Snippets de código interativos e seguros.
- **Componentes de UI Premium**: Componentes pré-construídos e customizáveis para um visual moderno.

## Estrutura do Monorepo

| Pacote                                       | Descrição                                                                        |
| :------------------------------------------- | :------------------------------------------------------------------------------- |
| [`@xispedocs/cli`](./packages/cli)           | A ferramenta CLI essencial para gerenciar projetos XispeDocs.                    |
| [`@xispedocs/core`](./packages/core)         | Lógica principal e componentes headless para documentação.                       |
| [`@xispedocs/mdx`](./packages/mdx)           | O processador MDX integrado e fonte de conteúdo.                                 |
| [`@xispedocs/ui`](./packages/ui)             | Componentes React e layouts prontos para usar com Next.js.                       |
| [`@xispedocs/openapi`](./packages/openapi)   | Gerador de referências de API a partir de especificações OpenAPI para MDX.       |
| [`@xispedocs/twoslash`](./packages/twoslash) | Blocos de código TypeScript inteligentes com informações de hover em tempo real. |
| [`@xispedocs/docgen`](./packages/doc-gen)    | Utilitários Remark/Rehype para geração de conteúdo avançada.                     |

## Desenvolvimento

Para rodar o projeto localmente:

1. Instale as dependências: `pnpm install`
2. Inicie o ambiente de desenvolvimento: `pnpm dev`
3. Acesse `http://localhost:3000`

---

<div align="center">
  <sub>XispeDocs</sub>
</div>
