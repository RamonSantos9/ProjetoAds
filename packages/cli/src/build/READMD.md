## Registry XispeDocs

O registry XispeDocs é similar ao registry Shadcn, mas inclui mais dicas para replicação precisa da estrutura de arquivos original.

Diferente do Shadcn CLI (atualmente), o CLI XispeDocs tem melhor suporte para usar outra URL base para o registry.
Por exemplo, `index.json` era suportado apenas para o próprio Shadcn UI, mas não para registries customizados.

## Definição

arquivo de índice: `{base_url}/_registry.json`, tipo: `OutputIndex[]`.
arquivo de componente: `{base_url}/{name}.json`, tipo: `OutputComponent`.

Temos um sistema de build mais inteligente que pode detectar com precisão referências a dependências, arquivos locais e sub-componentes.
