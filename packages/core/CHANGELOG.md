# @xispedocs/core

## 2.3.0

### Minor Changes

- Add Phase 3 advanced features: headless primitives, shared utilities, and EPUB support.

## 2.2.0

## 2.1.1

### Patch Changes

- Alinhamento de peerDependencies com XispeDocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.

## 2.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

## 2.0.1

## 2.0.0

### Major Changes

- ea0a121: **Remover API `xispestudio/core/sidebar`**

  por que: não é mais usado pelo RamonXp UI, e a abstração não é boa o suficiente.

  migrar: O componente original é principalmente um wrapper do `react-remove-scroll`, você pode usar Shadcn UI para sidebars pré-construídas.

- ea0a121: **Remover exportação `xispestudio/core/server`**
  - **`getGithubLastEdit`:** Movido para `xispestudio/core/content/github`.
  - **`getTableOfContents`:** Movido para `xispestudio/core/content/toc`.
  - **`PageTree` e utilitários de árvore de páginas:** Movido para `xispestudio/core/page-tree`.
  - **`TOCItemType`, `TableOfContents`:** Movido para `xispestudio/core/toc`.
  - **`createMetadataImage`:** Use a API de Metadata do Next.js em vez disso.

- ea0a121: **Remove deprecated APIs**
  - `xispestudio/ui/page`:
    - removed `<DocsCategory />`.
    - removed `breadcrumbs.full` option from `<DocsPage />`.
  - `xispestudio/core/search/algolia`: renamed option `document` to `indexName`.
  - `xispestudio/core/search`:
    - remove deprecated signature of `createFromSource()`: migrate to newer usage instead.
      ```ts
      export function createFromSource<S extends LoaderOutput<LoaderConfig>>(
        source: S,
        pageToIndexFn?: (page: InferPageType<S>) => Awaitable<AdvancedIndex>,
        options?: Omit<Options<S>, 'buildIndex'>,
      ): SearchAPI;
      ```
    - remove deprecated parameters in `useSearch()`, pass them in the client object instead.
  - `xispestudio/core/highlight`: remove deprecated `withPrerenderScript` and `loading` options from `useShiki()`.
  - `xispestudio/core/i18n`: removed `createI18nMiddleware`, import from `xispestudio/core/i18n/middleware` instead.
  - `xispestudio/core/source`:
    - removed deprecated `transformers`, `pageTree.attach*` options from `loader()`.
    - removed deprecated `page.file` property.
    - removed `FileInfo` & `parseFilePath` utilities.

## 15.8.4

### Alterações de Patch

- ce2be59: Plugin Loader: suporte para opções `name` & `config`
- 31b9494: Suporte para `multiple()` para múltiplas fontes no mesmo `loader()`

## 15.8.3

### Alterações de Patch

- a3a14e7: Atualizar dependências

## 15.8.2

### Alterações de Patch

- ad9a004: **Descontinuar exportação `@xispedocs/core/server`**

  Será removida no XispeDocs 16, pois algumas APIs sob a exportação `/server` estão realmente disponíveis (e até mesmo usadas) no ambiente do navegador.

  Um design mais modularizado será introduzido sobre a nomenclatura original.
  - **`getGithubLastEdit`:** Movido para `@xispedocs/core/content/github`.
  - **`getTableOfContents`:** Movido para `@xispedocs/core/content/toc`.
  - **`PageTree` e utilitários de árvore de páginas:** Movido para `@xispedocs/core/page-tree`.
  - **`TOCItemType`, `TableOfContents`:** Movido para `@xispedocs/core/toc`.
  - **`createMetadataImage`:** Descontinuado, use a API de Metadados do Next.js em vez disso.

- 90cf1fe: Suporte para API de Negociação
- 747bdbc: Suporte para plugin de ícones lucide react para `loader()`

## 15.8.1

### Alterações de Patch

- 71bce86: Make `loader().getPages()` to return pages from all languages when locale is not specified
- f04547f: Publish `plugins` API on `loader()`

## 15.8.0

### Alterações Menores

- d1ae3e8: **Move `SortedResult` and other search-related types to `@xispedocs/core/search`**

  This also exposed the search result highlighter API, you may now use it for highlighting results of your own search integration

  Old export will be kept until the next major release.

- 51268ec: Breadcrumbs API: default `includePage` to `false`.

### Alterações de Patch

- 655bb46: [Internal] `parseCodeBlockAttributes` include null values, restrict `rehype-code` to only parse `title` and `tab` attributes.
- 6548a59: Support breadcrumbs for Search API
- 51268ec: Breadcrumbs API: Fix root folders being filtered when `includeRoot` is set to `true`.

## 15.7.13

### Alterações de Patch

- 982aed6: Fix `source.getPageByHref()` return no result without explicit `language`

## 15.7.12

### Alterações de Patch

- 846b28a: Support multiple codeblocks in same tab
- 2b30315: Support `mode` option in search server

## 15.7.11

## 15.7.10

### Alterações de Patch

- c948f59: Try to workaround legacy i18n middleware under `/i18n` export without breaking changes

## 15.7.9

### Alterações de Patch

- d135efd: `transformerIcon` supports SVG string to extend codeblock icons
- 4082acc: Expose `highlightHast` API

## 15.7.8

### Alterações de Patch

- f65778d: `Link` improve external link detection by enabling it on any protocols
- e4c12a3: Add framework adapters to optional peer deps

## 15.7.7

### Alterações de Patch

- 0b53056: Support `remarkMdxMermaid` - convert `mermaid` codeblocks into `<Mermaid />` component
- 3490285: Support `remarkMdxFiles` - convert `files` codeblocks into `<Files />` component

## 15.7.6

## 15.7.5

### Alterações de Patch

- cedc494: Hotfix URL normalization logic

## 15.7.4

## 15.7.3

### Alterações de Patch

- 6d97379: unify remark nodes parsing & improve types
- e776ee5: Fix `langAlias` not being passed to Shiki rehype plugin

## 15.7.2

### Alterações de Patch

- 88b5a4e: Fix duplicate pages in page tree when referencing subpage in meta.json and using `...` or adding the subfolder again
- 039b24b: Fix failed to update page tree from `loader()`
- 08eee2b: [`remark-npm`] Enable `npm install` prefix fallback only on old alias

## 15.7.1

### Alterações de Patch

- 195b090: Support a list of `source` for `loader()` API
- e1c84a2: Support `fallbackLanguage` for `loader()` i18n API

## 15.7.0

### Alterações Menores

- 514052e: **Include locale code into `page.path`**

  Previously when i18n is enabled, `page.path` is not equal to the virtual file paths you passed into `loader()`:

  ```ts
  const source = loader({
    source: {
      files: [
        {
          path: 'folder/index.cn.mdx',
          // ...
        },
      ],
    },
  });

  console.log(source.getPages('cn'));
  // path: folder/index.mdx
  ```

  This can be confusing, the only solution to obtain the original path was `page.absolutePath`.

  From now, the `page.path` will also include the locale code:

  ```ts
  const source = loader({
    source: {
      files: [
        {
          path: 'folder/index.cn.mdx',
          // ...
        },
      ],
    },
  });

  console.log(source.getPages('cn'));
  // path: folder/index.cn.mdx
  ```

  While this change doesn't affect intended API usages, it **may lead to minor bugs** when advanced usage/hacks involved around `page.path`.

- e785f98: **Introduce page tree `fallback` API**

  Page tree is a tree structure.

  Previously, when an item is excluded from page tree, it is isolated entirely that you cannot display it at all.

  With the new fallback API, isolated pages will go into `fallback` page tree instead:

  ```json
  {
    "children": [
      {
        "type": "page",
        "name": "Introduction"
      }
    ],
    "fallback": {
      "children": [
        {
          "type": "page",
          "name": "Hidden Page"
        }
      ]
    }
  }
  ```

  Items in `fallback` are invisible unless you've opened its item.

- 0531bf4: **Introduce page tree transformer API**

  You can now define page tree transformer.

  ```ts
  export const source = loader({
    // ...
    pageTree: {
      transformers: [
        {
          root(root) {
            return root;
          },
          file(node, file) {
            return node;
          },
          folder(node, dir, metaPath) {
            return node;
          },
          separator(node) {
            return node;
          },
        },
      ],
    },
  });
  ```

- 50eb07f: **Support type-safe i18n config**

  ```ts
  // lib/source.ts
  import { defineI18n } from '@xispedocs/core/i18n';

  export const i18n = defineI18n({
    defaultLanguage: 'en',
    languages: ['en', 'cn'],
  });
  ```

  ```tsx
  // root layout
  import { defineI18nUI } from '@xispedocs/ui/i18n';
  import { i18n } from '@/lib/i18n';

  const { provider } = defineI18nUI(i18n, {
    translations: {
      cn: {
        displayName: 'Chinese',
        search: 'Translated Content',
      },
      en: {
        displayName: 'English',
      },
    },
  });

  function RootLayout({ children }: { children: React.ReactNode }) {
    return <RootProvider i18n={provider(lang)}>{children}</RootProvider>;
  }
  ```

  Although optional, we highly recommend you to refactor the import to i18n middleware:

  ```ts
  // here!
  import { createI18nMiddleware } from '@xispedocs/core/i18n/middleware';
  import { i18n } from '@/lib/i18n';

  export default createI18nMiddleware(i18n);
  ```

### Alterações de Patch

- e254c65: Simplify Source API storage management
- ec75601: Support `ReactNode` for icons in page tree
- 67df155: `createFromSource` support async `buildIndex` and XispeDocs MDX Async Mode
- b109d06: Redesign `useShiki` & `<DynamicCodeBlock />` to use React 19 hooks

## 15.6.12

## 15.6.11

## 15.6.10

### Alterações de Patch

- 569bc26: Improve `remark-image`: (1) append public URL to output `src` if it is a URL. (2) ignore if failed to obtain SVG size.
- 817c237: Support search result highlighting.

  Result nodes now have a `contentWithHighlights` property, you can render it with custom renderer, or a default one provided on XispeDocs UI.

## 15.6.9

### Alterações de Patch

- 0ab2cdd: remover dependência peer waku & tanstack temporariamente (veja https://github.com/@xispedocs/ramonxp/issues/2144)

## 15.6.8

## 15.6.7

### Alterações de Patch

- 6fa1442: Support to override `<HideIfEmpty />` scripts nonce with `<HideIfEmptyProvider />`

## 15.6.6

### Alterações de Patch

- 1b0e9d5: Add mixedbread integration

## 15.6.5

### Alterações de Patch

- 658fa96: Support custom options for error handling for `remark-image`

## 15.6.4

## 15.6.3

## 15.6.2

## 15.6.1

### Alterações de Patch

- 1a902ff: Fix static export map

## 15.6.0

### Alterações Menores

- f8d1709: **Redesigned Codeblock Tabs**

  Instead of relying on `Tabs` component, it supports a dedicated tabs component for codeblocks:

  ```tsx
  <CodeBlockTabs>
    <CodeBlockTabsList>
      <CodeBlockTabsTrigger value="value">Name</CodeBlockTabsTrigger>
    </CodeBlockTabsList>
    <CodeBlockTab value="value" asChild>
      <CodeBlock>...</CodeBlock>
    </CodeBlockTab>
  </CodeBlockTabs>
  ```

  The old usage is not deprecated, you can still use them while XispeDocs' remark plugins will generate codeblock tabs using the new way.

### Alterações de Patch

- d0f8a15: Enable `remarkNpm` by default, replace `remarkInstall` with it.
- 84918b8: Support passing `tag` to search client/server as string array

## 15.5.5

### Alterações de Patch

- 0d3f76b: Fix wrong indexing of file system

## 15.5.4

### Alterações de Patch

- 35c3c0b: Support handling duplicated slugs and conflicts such as `dir/index.mdx` vs `dir.mdx`

## 15.5.3

### Alterações de Patch

- 7d1ac21: hotfix paths not being normalized on Windows

## 15.5.2

### Alterações de Patch

- 7a45921: Add `absolutePath` and `path` properties to pages, mark `file` as deprecated
- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos

## 15.5.1

### Alterações de Patch

- b4916d2: Move `hide-if-empty` component to XispeDocs Core
- 8738b9c: Always encode generated slugs for non-ASCII characters in `loader()`
- a66886b: **Deprecate other parameters for `useDocsSearch()`**

  The new usage passes options to a single object, improving the readability:

  ```ts
  import { useDocsSearch } from '@xispedocs/core/search/client';

  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    locale: 'optional',
    tag: 'optional',
    delayMs: 100,
    allowEmpty: false,
  });
  ```

## 15.5.0

## 15.4.2

### Alterações de Patch

- 0ab6c7f: Improve performance by using shallow compare on `useOnChange` by default

## 15.4.1

## 15.4.0

### Alterações Menores

- 961b67e: **Bump algolia search to v5**

  This also introduced changes to some APIs since `algoliasearch` v4 and v5 has many differences.

  Now we highly recommend to pass an index name to `sync()`:

  ```ts
  import { algoliasearch } from 'algoliasearch';
  import { sync } from '@xispedocs/core/search/algolia';
  const client = algoliasearch('id', 'key');

  void sync(client, {
    indexName: 'document',
    documents: records,
  });
  ```

  For search client, pass them to `searchOptions`:

  ```tsx
  'use client';

  import { liteClient } from 'algoliasearch/lite';
  import type { SharedProps } from '@xispedocs/ui/components/dialog/search';
  import SearchDialog from '@xispedocs/ui/components/dialog/search-algolia';

  const client = liteClient(appId, apiKey);

  export default function CustomSearchDialog(props: SharedProps) {
    return (
      <SearchDialog
        searchOptions={{
          client,
          indexName: 'document',
        }}
        {...props}
        showAlgolia
      />
    );
  }
  ```

### Alterações de Patch

- 1b999eb: Introduce `<Markdown />` component
- 7d78bc5: Improve `createRelativeLink` and `getPageByHref` for i18n usage

## 15.3.4

## 15.3.3

### Alterações de Patch

- 4ae7b4a: Support MDX in codeblock tab value

## 15.3.2

### Alterações de Patch

- c25d678: Support Shiki focus notation transformer by default

## 15.3.1

### Alterações de Patch

- 3372792: Support line numbers in codeblock

## 15.3.0

### Alterações de Patch

- c05dc03: Improve error message of remark image

## 15.2.15

### Alterações de Patch

- 50db874: Remove placeholder space for codeblocks
- 79e75c3: Improve default MDX attribute indexing strategy for `remarkStructure`

## 15.2.14

### Alterações de Patch

- 6ea1718: Fix type inference for `pageTree.attachFile` in `loader()`

## 15.2.13

## 15.2.12

### Alterações de Patch

- acff667: **Deprecate `createFromSource(source, pageToIndex, options)`**

  Migrate:

  ```ts
  import { source } from '@/lib/source';
  import { createFromSource } from '@xispedocs/core/search/server';

  // from
  export const { GET } = createFromSource(
    source,
    (page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      // use your desired value, like page.slugs[0]
      tag: '<value>',
    }),
    {
      // options
    },
  );

  // to
  export const { GET } = createFromSource(source, {
    buildIndex(page) {
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        id: page.url,
        structuredData: page.data.structuredData,
        // use your desired value, like page.slugs[0]
        tag: '<value>',
      };
    },
    // other options
  });
  ```

## 15.2.11

### Alterações de Patch

- 07cd690: Support separators without name

## 15.2.10

## 15.2.9

## 15.2.8

## 15.2.7

### Alterações de Patch

- ec85a6c: support more options on `remarkStructure`
- e1a61bf: Support `remarkSteps` plugin

## 15.2.6

### Alterações de Patch

- d49f9ae: Fix order of `<I18nProvider />`
- b07e98c: fix `loader().getNodePage()` returning undefined for other locales
- 3a4bd88: Fix wrong index files output in i18n page tree generation

## 15.2.5

### Alterações de Patch

- c66ed79: Fix `removeScrollOn` on sidebar primitive

## 15.2.4

### Alterações de Patch

- 1057957: Fix type problems on dynamic codeblock

## 15.2.3

## 15.2.2

### Alterações de Patch

- 0829544: deprecate `blockScrollingWidth` in favour of `removeScrollOn`

## 15.2.1

## 15.2.0

### Alterações Menores

- 2fd325c: Enable `lazy` on `rehypeCode` by default
- a7cf4fa: Support other frameworks via `FrameworkProvider`

## 15.1.3

### Alterações de Patch

- b734f92: support `mdxJsxFlowElement` in `remarkStructure`

## 15.1.2

### Alterações de Patch

- 3f580c4: Support directory-based i18n routing

## 15.1.1

### Alterações de Patch

- c5add28: use internal store for Shiki highlighter instances
- f3cde4f: Support markdown files with default local code in file name
- 7c8a690: Improve file info interface
- b812457: Remove Next.js usage from search server

## 15.1.0

### Alterações Menores

- f491f6f: Lazy build page tree by default
- f491f6f: Support `getPageByHref()` on loader API

### Alterações de Patch

- f491f6f: Fix `findNeighbour()` doesn't exclude other nodes of another root

## 15.0.18

## 15.0.17

### Alterações de Patch

- 72f79cf: Support Orama Cloud crawler index

## 15.0.16

## 15.0.15

### Alterações de Patch

- 9f6d39a: Fix peer deps
- 2035cb1: remove hook-level cache from `useDocsSearch()`

## 15.0.14

### Alterações de Patch

- 37dc0a6: Update `image-size` to v2
- 796cc5e: Upgrade to Orama v3
- 2cc0be5: Support to add custom serialization to `remarkStructure` via `data._string`

## 15.0.13

## 15.0.12

### Alterações de Patch

- 3534a10: Move `@xispedocs/core` highlighting utils to `@xispedocs/core/highlight` and `@xispedocs/core/highlight/client`
- 93952db: Generate a `$id` attribute to page tree nodes

## 15.0.11

## 15.0.10

### Alterações de Patch

- d95c21f: add `initOrama` option to static client

## 15.0.9

## 15.0.8

## 15.0.7

### Alterações de Patch

- 5deaf40: Support icons in separators of `meta.json`

## 15.0.6

### Alterações de Patch

- 08236e1: Support custom toc settings in headings
- a06af26: Support pages without `title`

## 15.0.5

## 15.0.4

## 15.0.3

## 15.0.2

## 15.0.1

## 15.0.0

### Alterações Menores

- 581f4a5: **Support code block tabs without hardcoding `<Tabs />` items**

  **migrate:** Use the `remarkCodeTab` plugin.

  **before:**

  ````mdx
  import { Tab, Tabs } from '@xispedocs/ui/components/tabs';

  <Tabs items={["Tab 1", "Tab 2"]}>

  ```ts tab
  console.log('A');
  ```

  ```ts tab
  console.log('B');
  ```

  </Tabs>
  ````

  **after:**

  ````mdx
  import { Tab, Tabs } from '@xispedocs/ui/components/tabs';

  ```ts tab="Tab 1"
  console.log('A');
  ```

  ```ts tab="Tab 2"
  console.log('B');
  ```
  ````

### Alterações de Patch

- 5b8cca8: Fix `remarkAdmonition` missing some types from Docusaurus
- a763058: Support reversed rest items in `meta.json`

## 14.7.7

## 14.7.6

### Alterações de Patch

- b9601fb: Update Shiki

## 14.7.5

### Alterações de Patch

- 777188b: [Page Tree Builder] Inline folders without children

## 14.7.4

### Alterações de Patch

- bb73a72: Fix search params being ignored in middleware redirection
- 69bd4fe: Support `source.getPageTree()` function

## 14.7.3

### Alterações de Patch

- 041f230: Support trailing slash

## 14.7.2

### Alterações de Patch

- 14b280c: Revert default i18n config

## 14.7.1

### Alterações de Patch

- 72dc093: Add chinese i18n configuration for Orama search if not specified

## 14.7.0

### Alterações Menores

- 97ed36c: Remove defaults from `loader` and deprecate `rootDir` options

## 14.6.8

## 14.6.7

### Alterações de Patch

- 5474343: Export dynamic-link

## 14.6.6

## 14.6.5

### Alterações de Patch

- 969da26: Improve i18n api

## 14.6.4

### Alterações de Patch

- b71064a: Support remark plugins & vfile input on `getTableOfContents`

## 14.6.3

## 14.6.2

### Alterações de Patch

- 2357d40: Fix typings of `HighlightOptions`

## 14.6.1

## 14.6.0

### Alterações Menores

- bebb16b: Add support for pre-rendering to `useShiki` hook
- 050b326: Support codeblock `tab` meta without value

### Alterações de Patch

- 4dfde6b: support additional `components` option of Orama search
- 4766292: Support React 19

## 14.5.6

### Alterações de Patch

- 9a18c14: Downgrade Orama to v2 to fix external tokenizers

## 14.5.5

## 14.5.4

## 14.5.3

## 14.5.2

## 14.5.1

## 14.5.0

## 14.4.2

## 14.4.1

## 14.4.0

## 14.3.1

## 14.3.0

## 14.2.1

### Alterações de Patch

- ca94bfd: Support sync usage of `getTableOfContents`

## 14.2.0

### Alterações Menores

- e248a0f: Support Orama Cloud integration

## 14.1.1

### Alterações de Patch

- 1573d63: Support URL format `publicDir` in Remark Image plugin

## 14.1.0

### Alterações Menores

- b262d99: bundle default Shiki transformers
- 90725c1: Support server-side `highlight` and client `useShiki` hook

### Alterações de Patch

- d6d290c: Upgrade Shiki
- 4a643ff: Prefer `peerDependenciesMeta` over `optionalDependencies`
- b262d99: Support JSX comment syntax on default Shiki transformers

## 14.0.2

## 14.0.1

## 14.0.0

### Alterações Principais

- e45bc67: **Remove deprecated `@xispedocs/core/middleware` export**

  **migrate:** Use `@xispedocs/core/i18n`.

- d9e908e: **Remove deprecated `languages` and `defaultLanguage` option from loader**

  **migrate:** Use I18n config API

- 9a0b09f: **Change usage of `useDocsSearch`**

  **why:** Allow static search

  **migrate:**

  Pass client option, it can be algolia, static, or fetch (default).

  ```ts
  import { useDocsSearch } from '@xispedocs/core/search/client';

  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    api: '/api/search', // optional
  });
  ```

- 9a0b09f: **Remove Algolia Search Client**

  **why:** Replace by the new search client

  **migrate:**

  ```ts
  import { useDocsSearch } from '@xispedocs/core/search/client';

  const { search, setSearch, query } = useDocsSearch({
    type: 'algolia',
    index,
    ...searchOptions,
  });
  ```

- 9a0b09f: **Refactor import path of `@xispedocs/core/search-algolia/server` to `@xispedocs/core/search/algolia`**
- d9e908e: Improved usage for `createI18nSearchAPI` (replaced `createI18nSearchAPIExperimental`)
- d9e908e: Replace `@xispedocs/core/search/shared` with `@xispedocs/core/server`

### Alterações Menores

- d9e908e: Create search api from source (Support i18n without modifying search route handler)
- 367f4c3: Support referencing original page/meta from page tree nodes
- e1ee822: Support hast nodes in `toc` variable
- 979e301: Replace flexearch with Orama
- 979e301: Support static search (without server)
- d9e908e: Support creating metadata API from sources

### Alterações de Patch

- f949520: Support Shiki diff transformer
- e612f2a: Make compatible with Next.js 15
- 8ef00dc: Apply `hideLocale` to Source `getPage` APIs
- 15781f0: Fix breadcrumb empty when `includePage` isn't specified
- be820c4: Bump deps

## 13.4.10

### Alterações de Patch

- 6231ad3: fix(types): PageData & MetaData exactOptionalPropertyTypes compat

## 13.4.9

### Alterações de Patch

- 083f04a: Fix link items text

## 13.4.8

### Alterações de Patch

- 78e59e7: Support to add icons to link items in meta.json

## 13.4.7

### Alterações de Patch

- 6e1923e: Improve anchors observer

## 13.4.6

### Alterações de Patch

- afb697e: Fix Next.js 14.2.8 dynamic import problems
- daa66d2: Support generating static params automatically with Source API

## 13.4.5

## 13.4.4

### Alterações de Patch

- 729928e: Fix build error without JS engine

## 13.4.3

## 13.4.2

### Alterações de Patch

- 7dabbc1: Remark Image: Support relative imports
- 0c251e5: Bump deps
- 3b56170: Support to enable experiment Shiki JS engine

## 13.4.1

### Alterações de Patch

- 95dbba1: Scan table into search indexes by default

## 13.4.0

## 13.3.3

### Alterações de Patch

- f8cc167: Ignore numeric locale file name

## 13.3.2

### Alterações de Patch

- 0e0ef8c: Support headless search servers

## 13.3.1

## 13.3.0

### Alterações Menores

- fd46eb6: Export new `createI18nSearchAPIExperimental` API for i18n config
- fd46eb6: Introduce `i18n` config for Core APIs
- fd46eb6: Deprecated `languages` and `defaultLanguage` option on Source API, replaced with `i18n` config
- fd46eb6: Move I18n middleware to `@xispedocs/core/i18n`
- 9aae448: Support multiple toc active items
- c542561: Use cookie to store active locale on `always` mode

### Alterações de Patch

- 4916f84: Improve Source API performance

## 13.2.2

### Alterações de Patch

- 36b771b: Remark Image: Support relative import path
- 61b91fa: Improve XispeDocs OpenAPI support

## 13.2.1

### Alterações de Patch

- 17fa173: Remark Image: Support fetching image size of external urls

## 13.2.0

### Alterações de Patch

- 96c9dda: Change Heading scroll margins

## 13.1.0

### Alterações de Patch

- f280191: Page Tree Builder: Sort folders to bottom

## 13.0.7

### Alterações de Patch

- 37bbfff: Improve active anchor observer

## 13.0.6

## 13.0.5

### Alterações de Patch

- 2cf65f6: Support debounce value on algolia search client

## 13.0.4

### Alterações de Patch

- 5355391: Support indexing description field on documents

## 13.0.3

### Alterações de Patch

- 978342f: Type file system utilities (Note: This is an internal module, you're not supposed to reference it)

## 13.0.2

### Alterações de Patch

- 4819820: Page Tree Builder: Fallback to page icon when metadata doesn't exist

## 13.0.1

## 13.0.0

### Alterações Principais

- 09c3103: **Change usage of TOC component**

  **why:** Improve the flexibility of headless components

  **migrate:**

  Instead of

  ```tsx
  import * as Base from '@xispedocs/core/toc';

  return (
    <Base.TOCProvider>
      <Base.TOCItem />
    </Base.TOCProvider>
  );
  ```

  Use

  ```tsx
  import * as Base from '@xispedocs/core/toc';

  return (
    <Base.AnchorProvider>
      <Base.ScrollProvider>
        <Base.TOCItem />
        <Base.TOCItem />
      </Base.ScrollProvider>
    </Base.AnchorProvider>
  );
  ```

- b02eebf: **Remove deprecated option `defaultLang`**

  **why:** The default language feature has been supported by Shiki Rehype integration, you should use it directly.

  **migrate:** Rename to `defaultLanguage`.

### Alterações Menores

- c714eaa: Support Remark Admonition plugin

## 12.5.6

## 12.5.5

## 12.5.4

### Alterações de Patch

- fccdfdb: Improve TOC Popover design
- 2ffd5ea: Support folder group on Page Tree Builder

## 12.5.3

## 12.5.2

### Alterações de Patch

- a5c34f0: Support specifying the url of root node when breadcrumbs have `includeRoot` enabled

## 12.5.1

## 12.5.0

### Alterações Menores

- b9fa99d: Support `tag` facet field for Algolia Search Integration

### Alterações de Patch

- 525925b: Support including root folder into breadcrumbs

## 12.4.2

### Alterações de Patch

- 503e8e9: Support `keywords` API in advanced search

## 12.4.1

## 12.4.0

## 12.3.6

## 12.3.5

## 12.3.4

## 12.3.3

### Alterações de Patch

- 90d51cb: Fix problem with I18n middleware & language toggle

## 12.3.2

### Alterações de Patch

- ca7d0f4: Support resolving async search indexes

## 12.3.1

### Alterações de Patch

- cf852f6: Add configurable delayMs Parameter for Debounced Search Performance

## 12.3.0

### Alterações Menores

- ce3c8ad: Page Tree Builder: Support `defaultLanguage` option
- ce3c8ad: Support hiding locale prefixes with I18n middleware

## 12.2.5

## 12.2.4

## 12.2.3

## 12.2.2

## 12.2.1

## 12.2.0

### Alterações Menores

- b70ff06: Support `!name` to hide pages on `meta.json`

## 12.1.3

## 12.1.2

### Alterações de Patch

- b4856d1: Fix `createGetUrl` wrong locale position

## 12.1.1

### Alterações de Patch

- a39dbcb: Export `loadFiles` from Source API

## 12.1.0

### Alterações Menores

- 0a377a9: **Support writing code blocks as a `<Tab />` element.**

  ````mdx
  import { Tabs } from '@xispedocs/ui/components/tabs';

  <Tabs items={["Tab 1", "Tab 2"]}>

  ```js tab="Tab 1"
  console.log('Hello');
  ```

  ```js tab="Tab 2"
  console.log('Hello');
  ```

  </Tabs>
  ````

  This is same as wrapping the code block in a `<Tab />` component.

- 0a377a9: **Pass the `icon` prop to code blocks as HTML instead of MDX attribute.**

  **why:** Only MDX flow elements support attributes with JSX value, like:

  ```mdx
  <Pre icon={<svg />}>...</Pre>
  ```

  As Shiki outputs hast elements, we have to convert the output of Shiki to a MDX flow element so that we can pass the `icon` property.

  Now, `rehype-code` passes a HTML string instead of JSX, and render it with `dangerouslySetInnerHTML`:

  ```mdx
  <Pre icon="<svg />">...</Pre>
  ```

  **migrate:** Not needed, it should work seamlessly.

## 12.0.7

## 12.0.6

### Alterações de Patch

- 7a29b79: Remove default language from `source.getLanguages`
- b0c1242: Support Next.js 15 cache behaviour in `getGithubLastEdit`

## 12.0.5

## 12.0.4

### Alterações de Patch

- 72dbaf1: Support `ReactNode` in page tree, table of contents and breadcrumb type definitions
- 51ca944: Support including separators in breadcrumbs

## 12.0.3

### Alterações de Patch

- 053609d: Rename `defaultLang` to `defaultLanguage`

## 12.0.2

## 12.0.1

## 12.0.0

### Alterações Principais

- 98430e9: **Remove `minWidth` deprecated option from `Sidebar` component.**

  **migrate:** Use `blockScrollingWidth` instead

### Alterações Menores

- 57eb762: Support attaching custom properties during page tree builder process

### Alterações de Patch

- d88dfa6: Support attaching `id` property to page trees
- ba20694: Remark Headings: Support code syntax in headings

## 11.3.2

### Alterações de Patch

- 1b8e12b: Use `display: grid` for codeblocks

## 11.3.1

## 11.3.0

### Alterações Menores

- 917d87f: Rename sidebar primitive `minWidth` prop to `blockScrollingWidth`

## 11.2.2

## 11.2.1

## 11.2.0

## 11.1.3

### Alterações de Patch

- 88008b1: Fix ESM compatibility problems in i18n middleware
- 944541a: Add dynamic page url according to locale
- 07a9312: Improve Search I18n utilities

## 11.1.2

## 11.1.1

### Alterações de Patch

- 8ef2b68: Bump deps
- 26f464d: Support relative paths in meta.json
- 26f464d: Support non-external link in meta.json

## 11.1.0

## 11.0.8

### Alterações de Patch

- 98258b5: Fix regex problems

## 11.0.7

### Alterações de Patch

- f7c2c5c: Fix custom heading ids conflicts with MDX syntax

## 11.0.6

### Alterações de Patch

- 5653d5d: Support customising heading id in headings
- 5653d5d: Support custom heading slugger

## 11.0.5

## 11.0.4

### Alterações de Patch

- 7b61b2f: Migrate `@xispedocs/ui` to fully ESM, adding support for ESM `tailwind.config` file

## 11.0.3

## 11.0.2

## 11.0.1

## 11.0.0

### Alterações Principais

- 2d8df75: Remove `cwd` option from `remark-dynamic-content`

  why: Use `cwd` from vfile

  migrate: Pass the `cwd` option from remark instead

- 92cb12f: Simplify Source API virtual storage.

  why: Improve performance

  migrate:

  ```diff
  - storage.write('path.mdx', { type: 'page', ... })
  - storage.readPage('page')
  + storage.write('path.mdx', 'page', { ... })
  + storage.read('page', 'page')
  ```

  Transformers can now access file loader options.

  ```ts
  load({
    transformers: [
      ({ storage, options }) => {
        options.getUrl();
        options.getSlugs();
      },
    ],
  });
  ```

- f75287d: **Introduce `@xispedocs/docgen` package.**

  Offer a better authoring experience for advanced use cases.
  - Move `remark-dynamic-content` and `remark-install` plugins to the new package `@xispedocs/docgen`.
  - Support Typescript generator by default

  **Usage**

  Add the `remarkDocGen` plugin to your remark plugins.

  ```ts
  import { remarkDocGen, fileGenerator } from '@xispedocs/docgen';

  remark().use(remarkDocGen, { generators: [fileGenerator()] });
  ```

  Generate docs with code blocks.

  ````mdx
  ```json doc-gen:<generator>
  {
    // options
  }
  ```
  ````

  **Migrate**

  For `remarkDynamicContent`, enable `fileGenerator` and use this syntax:

  ````mdx
  ```json doc-gen:file
  {
    "file": "./path/to/my-file.txt"
  }
  ```
  ````

  For `remarkInstall`, it remains the same:

  ```ts
  import { remarkInstall } from '@xispedocs/docgen';
  ```

- 2d8df75: Remove support for `getTableOfContentsFromPortableText`

  why: Sanity integration should be provided by 3rd party integrations

  migrate: Use built-in sources, or write a custom implementation

## 10.1.3

### Alterações de Patch

- bbad52f: Support `bun` in `remark-install` plugin

## 10.1.2

## 10.1.1

### Alterações de Patch

- 779c599: Mark `getTableOfContentsFromPortableText` deprecated
- 0c01300: Fix remark-dynamic-content ignored code blocks
- 779c599: Support relative resolve path for remark-dynamic-content

## 10.1.0

## 10.0.5

### Alterações de Patch

- e47c62f: Improve remark plugin typings

## 10.0.4

## 10.0.3

### Alterações de Patch

- 6f321e5: Fix type errors of flexseach

## 10.0.2

### Alterações de Patch

- 10e099a: Remove deprecated options from `@xispedocs/core/toc`

## 10.0.1

### Alterações de Patch

- c9b7763: Update to Next.js 14.1.0
- 0e78dc8: Support customising search API URL
- d8483a8: Remove undefined values from page tree

## 10.0.0

### Alterações Principais

- 321d1e1f: **Move Typescript integrations to `@xispedocs/typescript`**

  why: It is now a stable feature

  migrate: Use `@xispedocs/typescript` instead.

  ```diff
  - import { AutoTypeTable } from "@xispedocs/ui/components/auto-type-table"
  + import { AutoTypeTable } from "@xispedocs/typescript/ui"
  ```

### Alterações Menores

- b5d16938: Support external link in `pages` property

## 9.1.0

### Alterações Menores

- 909b0e35: Support duplicated names with meta and page files
- 1c388ca5: Support `defaultOpen` for folder nodes

### Alterações de Patch

- 691f12aa: Source API: Support relative paths as root directory

## 9.0.0

## 8.3.0

## 8.2.0

### Alterações Menores

- 5c24659: Support code block icons

## 8.1.1

## 8.1.0

### Alterações Menores

- eb028b4: Migrate to shiki
- 054ec60: Support generating docs for Typescript file

### Alterações de Patch

- 6c5a39a: Rename Git repository to `XispeDocs`

## 8.0.0

### Alterações Principais

- 2ea9437: **Migrate to rehype-shikiji**
  - Dropped support for inline code syntax highlighting
  - Use notation-based word/line highlighting instead of meta string

  Before:

  ````md
  ```ts /config/ {1}
  const config = 'Hello';

  something.call(config);
  ```
  ````

  After:

  ````md
  ```ts
  // [!code word:config]
  const config = 'Hello'; // [!code highlight]

  something.call(config);
  ```
  ````

  Read the docs of Shikiji for more information.

- cdff313: **Separate Contentlayer integration into another package**

  why: As XispeDocs MDX is the preferred default source, Contentlayer should be optional.

  migrate:

  Install `XispeDocs-contentlayer`.

  ```diff
  - import { createContentlayerSource } from "@xispedocs/core/contentlayer"
  + import { createContentlayerSource } from "XispeDocs-contentlayer"

  - import { createConfig } from "@xispedocs/core/contentlayer/configuration"
  + import { createConfig } from "XispeDocs-contentlayer/configuration"
  ```

- 2b11c20: **Rename to XispeDocs**

  `next-docs-zeta` -> `@xispedocs/core`

  `next-docs-ui` -> `@xispedocs/ui`

  `next-docs-mdx` -> `@xispedocs/mdx`

  `@ramonxp/openapi` -> `@xispedocs/openapi`

  `create-next-docs-app` -> `create-XispeDocs-app`

### Alterações Menores

- 1a346a1: Add `remark-image` plugin that converts relative image urls into static image imports (Inspired by Nextra)

## 7.1.2

## 7.1.1

## 7.1.0

## 7.0.0

### Alterações Principais

- 9929c5b: **Migrate Contentlayer Integration to Source API**

  `createContentlayer` is now replaced by `createContentlayerSource`.

  You should configure base URL and root directory in the loader instead of Contentlayer configuration.

  It's no longer encouraged to access `allDocs` directly because they will not include `url` property anymore. Please consider `getPages` instead.

  ```ts
  import { allDocs, allMeta } from 'contentlayer/generated';
  import { createContentlayerSource } from 'next-docs-zeta/contentlayer';
  import { loader } from 'next-docs-zeta/source';

  export const { getPage, pageTree, getPages } = loader({
    baseUrl: '/docs',
    rootDir: 'docs',
    source: createContentlayerSource(allMeta, allDocs),
  });
  ```

  The interface is very similar, but you can only access Contentlayer properties from `page.data`.

  ```diff
  - <Content code={page.body.code} />
  + <Content code={page.data.body.code} />
  ```

- 9929c5b: **Source API**

  To reduce boilerplate, the Source API is now released to handle File-system based files.

  Thanks to this, you don't have to deal with the inconsistent behaviours between different content sources anymore.

  The interface is now unified, you can easily plug in a content source.

  ```ts
  import { map } from '@/.map';
  import { createMDXSource } from 'next-docs-mdx';
  import { loader } from 'next-docs-zeta/source';

  export const { getPage, getPages, pageTree } = loader({
    baseUrl: '/docs',
    rootDir: 'docs',
    source: createMDXSource(map),
  });
  ```

  **Page Tree Builder API is removed in favor of this**

- 49201be: **Change `remarkToc` to `remarkHeading`**

  The previous `remarkToc` plugin only extracts table of contents from documents, now it also adds the `id` property to all heading elements.

  ```diff
  - import { remarkToc } from "next-docs-zeta/mdx-plugins"
  + import { remarkHeading } from "next-docs-zeta/mdx-plugins"
  ```

- 4c1334e: **Improve `createI18nMiddleware` function**

  Now, you can export the middleware directly without a wrapper.

  From:

  ```ts
  export default function middleware(request: NextRequest) {
    return createI18nMiddleware(...);
  }
  ```

  To:

  ```ts
  export default createI18nMiddleware({
    defaultLanguage,
    languages,
  });
  ```

### Alterações Menores

- 338ea98: **Export `create` function for Contentlayer configuration**

  If you want to include other document types, or override the output configuration, the `create` function can return the fields and document types you need.

  ```ts
  import { create } from 'next-docs-zeta/contentlayer/configuration';

  const config = create(options);

  export default {
    contentDirPath: config.contentDirPath,
    documentTypes: [config.Docs, config.Meta],
    mdx: config.mdx,
  };
  ```

- 9929c5b: **Support multiple page tree roots**

  You can specify a `root` property in `meta.json`, the nearest root folder will be used as the root of page tree instead.

  ```json
  {
    "title": "Hello World",
    "root": true
  }
  ```

## 6.1.0

### Alterações Menores

- f39ae40: **Forward ref to `Link` and `DynamicLink` component**

  **Legacy import name `SafeLink` is now removed**

  ```diff
  - import { SafeLink } from "next-docs-zeta/link"
  + import Link from "next-docs-zeta/link"
  ```

## 6.0.2

## 6.0.1

## 6.0.0

### Alterações Principais

- 9ef047d: **Pre-bundle page urls into raw pages.**

  This means you don't need `getPageUrl` anymore for built-in adapters, including `next-docs-mdx` and Contentlayer. It is now replaced by the `url` property from the pages array provided by your adapter.

  Due to this change, your old configuration might not continues to work.

  ```diff
  import { fromMap } from 'next-docs-mdx/map'

  fromMap({
  -  slugs: ...
  +  getSlugs: ...
  })
  ```

  For Contentlayer, the `getUrl` option is now moved to `createConfig`.

## 5.0.0

### Alterações Menores

- de44efe: Migrate to Shikiji
- de44efe: Support code highlighting options

## 4.0.9

### Alterações de Patch

- a883009: Fix empty extracted paragraphs in `remark-structure`

## 4.0.8

### Alterações de Patch

- e0c5c96: Make ESM only

## 4.0.7

### Alterações de Patch

- b9af5ed: Update tsup & dependencies

## 4.0.6

### Alterações de Patch

- ff38f6e: Replace `getGitLastEditTime` with new `getGithubLastEdit` API

## 4.0.5

## 4.0.4

## 4.0.3

### Alterações de Patch

- 0cc10cb: Support custom build page tree options

## 4.0.2

## 4.0.1

### Alterações de Patch

- 2da93d8: Support generating package install codeblocks automatically
- 01b23e2: Support Next.js 14

## 4.0.0

### Alterações Principais

- 6c4a782: Create `PageTreeBuilder` API

  The old `buildPageTree` function provided by 'next-docs-zeta/contentlayer' is
  now removed. Please use new API directly, or use the built-in
  `createContentlayer` utility instead.

  ```diff
  - import { buildPageTree } from 'next-docs-zeta/contentlayer'
  + import { createPageTreeBuilder } from 'next-docs-zeta/server'
  ```

### Alterações Menores

- 6c4a782: Improve CommonJS/ESM compatibility

  Since this release, all server utilities will be CommonJS by default unless
  they have referenced ESM modules in the code. For instance,
  `next-docs-zeta/middleware` is now a CommonJS file. However, some modules,
  such as `next-docs-zeta/server` requires ESM-only package, hence, they remain
  a ESM file.

  Notice that the extension of client-side files is now `.js` instead of `.mjs`,
  but they're still ESM.

  **Why?**

  After migrating to `.mjs` Next.js config file, some imports stopped to work.
  The built-in Next.js bundler seems can't resolve these `next` imports in
  external packages, causing errors when modules have imported Next.js itself
  (e.g. `next/image`) in the code.

  By changing client-side files extension to `.mjs` and using CommonJS for
  server-side files, this error is solved.

## 4.0.0

### Alterações Principais

- 24245a3: Create `PageTreeBuilder` API

  The old `buildPageTree` function provided by 'next-docs-zeta/contentlayer' is
  now removed. Please use new API directly, or use the built-in
  `createContentlayer` utility instead.

  ```diff
  - import { buildPageTree } from 'next-docs-zeta/contentlayer'
  + import { createPageTreeBuilder } from 'next-docs-zeta/server'
  ```

### Alterações Menores

- 678cd3d: Improve CommonJS/ESM compatibility

  Since this release, all server utilities will be CommonJS by default unless
  they have referenced ESM modules in the code. For instance,
  `next-docs-zeta/middleware` is now a CommonJS file. However, some modules,
  such as `next-docs-zeta/server` requires ESM-only package, hence, they remain
  a ESM file.

  Notice that the extension of client-side files is now `.js` instead of `.mjs`,
  but they're still ESM.

  **Why?**

  After migrating to `.mjs` Next.js config file, some imports stopped to work.
  The built-in Next.js bundler seems can't resolve these `next` imports in
  external packages, causing errors when modules have imported Next.js itself
  (e.g. `next/image`) in the code.

  By changing client-side files extension to `.mjs` and using CommonJS for
  server-side files, this error is solved.

## 3.0.0

### Alterações Principais

- a4a8120: Update search utilities import paths.

  Search Utilities in `next-docs-zeta/server` is now moved to
  `next-docs-zeta/search` and `next-docs-zeta/server-algolia`.

  Client-side Changes: `next-docs-zeta/search` -> `next-docs-zeta/search/client`
  `next-docs-zeta/search-algolia` -> `next-docs-zeta/search-algolia/client`

  If you're using Next Docs UI, make sure to import the correct path.

### Alterações Menores

- 7a0690b: Export remark-toc and remark-structure MDX plugins

### Alterações de Patch

- 1043532: Type MDX Plugins

## 2.4.1

### Alterações de Patch

- dfc8b44: Remove tree root node from breadcrumb
- ef4d8cc: Expose props from SafeLink component

## 2.4.0

### Alterações de Patch

- 27ce871: Add missing shiki peer deps

## 2.3.3

### Alterações de Patch

- 634f7d3: Reduce dependencies
- eac081c: Update github urls & author name

## 2.3.2

## 2.3.1

## 2.3.0

### Alterações Menores

- 6664178: Support algolia search
- a0f9911: Support `useAlgoliaSearch`
- 6664178: Improve search document structurize algorithm

## 2.2.0

## 2.1.2

### Alterações de Patch

- dfbbc17: Exclude index page from "..." operator
- 79227d8: Fix breadcrumb resolve index file

## 2.1.1

## 2.1.0

### Alterações de Patch

- a5a661e: Remove `item` prop from TOC items

## 2.0.3

## 2.0.2

### Alterações de Patch

- 74e5e85: Contentlayer: Support rest item in meta.json
- 72e9fdf: Contentlayer: Support extracting folder in meta.json

## 2.0.1

### Alterações de Patch

- 48c5256: Contentlayer: Sort pages by default

## 2.0.0

## 1.6.9

## 1.6.8

## 1.6.7

## 1.6.6

## 1.6.5

### Alterações de Patch

- 79abe84: Support collapsible sidebar

## 1.6.4

## 1.6.3

### Alterações de Patch

- 8d07003: Replace type of `TreeNode[]` with `PageTree`

## 1.6.2

## 1.6.1

### Alterações de Patch

- fc6279e: Support get last git edit time

## 1.6.0

### Alterações Menores

- edb9930: Redesign Contentlayer adapter API

### Alterações de Patch

- cdd30d5: Create remark-dynamic-content plugin

## 1.5.3

### Alterações de Patch

- fa8d4cf: Update dependencies

## 1.5.2

## 1.5.1

## 1.5.0

### Alterações Menores

- fb2abb3: Rewrite create search API & stabilize experimental Advanced Search

## 1.4.1

### Alterações de Patch

- Support better document search with `experimental_initSearchAPI`
- 3d92c92: Support custom computed fields in Contentlayer

## 1.4.0

### Alterações de Patch

- 0f106d9: Fix default sidebar element type

## 1.3.1

### Alterações de Patch

- ff05f5d: Support custom fields in Contentlayer configuration generator
- 7fb2b9e: Support custom page & folder icons

## 1.3.0

### Alterações Menores

- 98226d9: Rewrite slugger and TOC utilities

## 1.2.1

### Alterações de Patch

- b15895f: Remove url prop from page tree folders

## 1.2.0

### Alterações de Patch

- 5f248fb: Support Auto Scroll in TOC for headless docs

## 1.1.4

### Alterações de Patch

- 496a6b0: Configure eslint + prettier

## 1.1.3

### Alterações de Patch

- 0998b1b: Support edge runtime middlewares

## 1.1.2

### Alterações de Patch

- Fix aria attributes

## 1.1.1

## 1.1.0

### Alterações de Patch

- 255fc92: Support finding neighbours of a page & Flatten page tree

## 1.0.0

### Alterações Principais

- 8e4a001: Rewrite Contentlayer tree builder + Support Context API

### Alterações Menores

- 4fa45c0: Add support for dynamic hrefs and relative paths to `<SafeLink />`
  component
- 0983891: Add international Docs search

## 0.3.2

## 0.3.1

## 0.3.0

## 0.2.1

### Alterações de Patch

- 67cd8ab: Remove unused files in dist

## 0.2.0

### Alterações Menores

- 5ff94af: Replace TOC data attribute `data-active` with `aria-selected`

### Alterações de Patch

- 5ff94af: Fix contentlayer parser bugs

## 0.1.0

### Alterações Menores

- Add get toc utils for sanity (portable text)

## 0.0.2

### Alterações de Patch

- d909192: Fix several contentlayer scanner bugs
- e88eec8: Add README
