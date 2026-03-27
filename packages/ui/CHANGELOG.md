# @xispedocs/ui

## 2.3.0

### Minor Changes

- Add Phase 3 advanced features: headless primitives, shared utilities, and EPUB support.

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.3.0

## 2.2.0

### Minor Changes

- feat: upgrade ui and styles to 100% feature parity com XispeDocs, novos pacotes '@xispedocs/tailwind', e '@xispedocs/stf', layouts atualizados.

### Patch Changes

- @xispedocs/core@2.2.0

## 2.1.1

### Patch Changes

- Alinhamento de peerDependencies com XispeDocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.
- Updated dependencies
  - @xispedocs/core@2.1.1

## 2.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.1.0

## 2.0.1

### Patch Changes

- Fixed template folder names in create-app and improved layout component exports, styling, and documentation previews in ui.
  - @xispedocs/core@2.0.1

## 2.0.0

### Major Changes

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

### Patch Changes

- Updated dependencies [ea0a121]
- Updated dependencies [ea0a121]
- Updated dependencies [ea0a121]
  - @xispedocs/core@2.0.0

## 15.8.4

### Alterações de Patch

- Updated dependencies [ce2be59]
- Updated dependencies [31b9494]
  - @xispedocs/core@15.8.4

## 15.8.3

### Alterações de Patch

- a3a14e7: Bump deps
- 7b0d839: Hotfix `@xispedocs/ui/provider`
- Updated dependencies [a3a14e7]
  - @xispedocs/core@15.8.3

## 15.8.2

### Alterações de Patch

- 90cf1fe: Support `tabMode` on `<DocsLayout />`
- 6c3bde5: **Prefer importing `<RootProvider />` from `@xispedocs/ui/provider/<framework>`**
  - Old `@xispedocs/ui/provider` will be kept, as it's used by majority of previous projects.
  - New guides & templates will follow the new recommendation.

- Updated dependencies [ad9a004]
- Updated dependencies [90cf1fe]
- Updated dependencies [747bdbc]
  - @xispedocs/core@15.8.2

## 15.8.1

### Alterações de Patch

- Updated dependencies [71bce86]
- Updated dependencies [f04547f]
  - @xispedocs/core@15.8.1

## 15.8.0

### Alterações de Patch

- 53a0635: Support custom `action` type search item in search dialog
- 6548a59: Support breadcrumbs for Search API
- Updated dependencies [655bb46]
- Updated dependencies [d1ae3e8]
- Updated dependencies [6548a59]
- Updated dependencies [51268ec]
- Updated dependencies [51268ec]
  - @xispedocs/core@15.8.0

## 15.7.13

### Alterações de Patch

- Updated dependencies [982aed6]
  - @xispedocs/core@15.7.13

## 15.7.12

### Alterações de Patch

- 846b28a: Support multiple codeblocks in same tab
- Updated dependencies [846b28a]
- Updated dependencies [2b30315]
  - @xispedocs/core@15.7.12

## 15.7.11

### Alterações de Patch

- 9304db9: Improve type table spacing
- dd7338b: Fix inline code styles
  - @xispedocs/core@15.7.11

## 15.7.10

### Alterações de Patch

- Updated dependencies [c948f59]
  - @xispedocs/core@15.7.10

## 15.7.9

### Alterações de Patch

- 45c7531: Type Table: Support displaying parameters & return types
- 4082acc: Redesign Type Table
- Updated dependencies [d135efd]
- Updated dependencies [4082acc]
  - @xispedocs/core@15.7.9

## 15.7.8

### Alterações de Patch

- ba3382f: Support link item properties in menu items
- efba995: Enforce the use of `--removed-body-scroll-bar-size` to fixed elements
- bec3b36: Use `on-root:` to apply CSS variables from child layout components
- Updated dependencies [f65778d]
- Updated dependencies [e4c12a3]
  - @xispedocs/core@15.7.8

## 15.7.7

### Alterações de Patch

- Updated dependencies [0b53056]
- Updated dependencies [3490285]
  - @xispedocs/core@15.7.7

## 15.7.6

### Alterações de Patch

- dc6d8a0: unify sidebar tabs matching
  - @xispedocs/core@15.7.6

## 15.7.5

### Alterações de Patch

- cedc494: Hotfix URL normalization logic
- Updated dependencies [cedc494]
  - @xispedocs/core@15.7.5

## 15.7.4

### Alterações de Patch

- 302cdc2: Use `position: fixed` for TOC
- 02d3453: Make codeblocks flat & improve paddings
  - @xispedocs/core@15.7.4

## 15.7.3

### Alterações de Patch

- f6de900: Add `overscroll` to sidebar viewports
- Updated dependencies [6d97379]
- Updated dependencies [e776ee5]
  - @xispedocs/core@15.7.3

## 15.7.2

### Alterações de Patch

- Updated dependencies [88b5a4e]
- Updated dependencies [039b24b]
- Updated dependencies [08eee2b]
  - @xispedocs/core@15.7.2

## 15.7.1

### Alterações de Patch

- b4e6147: Fix sidebar & animation bugs
- Updated dependencies [195b090]
- Updated dependencies [e1c84a2]
  - @xispedocs/core@15.7.1

## 15.7.0

### Alterações Menores

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

- b109d06: Redesign `useShiki` & `<DynamicCodeBlock />` to use React 19 hooks
- b99cf51: Shadcn UI theme: support sidebar specific colors
- Updated dependencies [514052e]
- Updated dependencies [e254c65]
- Updated dependencies [ec75601]
- Updated dependencies [e785f98]
- Updated dependencies [0531bf4]
- Updated dependencies [50eb07f]
- Updated dependencies [67df155]
- Updated dependencies [b109d06]
  - @xispedocs/core@15.7.0

## 15.6.12

### Alterações de Patch

- fe31a72: Fix custom components auto RWD handling for home layout
  - @xispedocs/core@15.6.12

## 15.6.11

### Alterações de Patch

- 6de6ff3: Restrict exports of `layouts` to avoid projects importing internal/unstable APIs
- f0b1fee: Improve layout component customisation experience by handling RWD automatically
  - @xispedocs/core@15.6.11

## 15.6.10

### Alterações de Patch

- 817c237: Support search result highlighting.

  Result nodes now have a `contentWithHighlights` property, you can render it with custom renderer, or a default one provided on XispeDocs UI.

- Updated dependencies [569bc26]
- Updated dependencies [817c237]
  - @xispedocs/core@15.6.10

## 15.6.9

### Alterações de Patch

- f2b22ca: simplify layout offset logic
- Updated dependencies [0ab2cdd]
  - @xispedocs/core@15.6.9

## 15.6.8

### Alterações de Patch

- @xispedocs/core@15.6.8

## 15.6.7

### Alterações de Patch

- e9fef34: Move sidebar toolbar to top on mobile view
- d4a9037: improve codeblock diff styles
- Updated dependencies [6fa1442]
  - @xispedocs/core@15.6.7

## 15.6.6

### Alterações de Patch

- 2a0b45b: Change sidebar direction
- 5913cc4: Ignore IME composition to avoid accidental selection
- 79248f6: Improve type table link icon
- Updated dependencies [1b0e9d5]
  - @xispedocs/core@15.6.6

## 15.6.5

### Alterações de Patch

- Updated dependencies [658fa96]
  - @xispedocs/core@15.6.5

## 15.6.4

### Alterações de Patch

- dca17d7: Improve search dialog consistency
  - @xispedocs/core@15.6.4

## 15.6.3

### Alterações de Patch

- a2d7940: Fix layout: remove reserved sidebar space when sidebar is disabled in DocsLayout
  - @xispedocs/core@15.6.3

## 15.6.2

### Alterações de Patch

- 1e50889: Fix mobile sidebar trigger visibility when sidebar is disabled
- 353c139: Callout add fallback icons
- 5844c6f: no longer sort type table properties by default
  - @xispedocs/core@15.6.2

## 15.6.1

### Alterações de Patch

- Updated dependencies [1a902ff]
  - @xispedocs/core@15.6.1

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

- bf15617: Fix Notebook layout minor UI inconsistency
- Updated dependencies [d0f8a15]
- Updated dependencies [84918b8]
- Updated dependencies [f8d1709]
  - @xispedocs/core@15.6.0

## 15.5.5

### Alterações de Patch

- e9b1c9c: Support `rainbowColors` API in `<Banner />` component
- d5c9b11: Fix Notebook Layout tab mode `navbar` cannot handle nested tabs
- Updated dependencies [0d3f76b]
  - @xispedocs/core@15.5.5

## 15.5.4

### Alterações de Patch

- 4a1d3cf: Reduce sidebar intensity
- 58b7596: Fix copying line breaks with Twoslash codeblocks
- Updated dependencies [35c3c0b]
  - @xispedocs/core@15.5.4

## 15.5.3

### Alterações de Patch

- Updated dependencies [7d1ac21]
  - @xispedocs/core@15.5.3

## 15.5.2

### Alterações de Patch

- b675728: Redesign search dialog style
- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos
- 82fc4c8: Avoid direct update to passed props.
- Updated dependencies [7a45921]
- Updated dependencies [1b7bc4b]
  - @xispedocs/core@15.5.2

## 15.5.1

### Alterações de Patch

- b4916d2: Move `hide-if-empty` component to XispeDocs Core
- 68526ea: Redesign `@xispedocs/ui/components/dialog/search` usage to make it composable, and mark it as stable API.
- Updated dependencies [b4916d2]
- Updated dependencies [8738b9c]
- Updated dependencies [a66886b]
  - @xispedocs/core@15.5.1

## 15.5.0

### Alterações Menores

- 589d101: **Move TOC closer to page body on larger viewports**

  Changed layout positioning, all layout components now use `fixed` position.

  This may impact sites that:
  - using custom styling on XispeDocs layouts.
  - added a custom footer (see below).

  For custom footer, make sure to add them into `<DocsLayout />` instead:

  ```tsx
  <DocsLayout>
    {children}
    <div className="h-[400px] bg-fd-secondary">Hello World</div>
  </DocsLayout>
  ```

### Alterações de Patch

- 50f8f7f: Update Home Layout navbar design
- 697d5b4: Support specifying a custom `value` for `Accordion`
  - @xispedocs/core@15.5.0

## 15.4.2

### Alterações de Patch

- Updated dependencies [0ab6c7f]
  - @xispedocs/core@15.4.2

## 15.4.1

### Alterações de Patch

- e72b7b4: hotfix: production source map being ignored
  - @xispedocs/core@15.4.1

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

- 092fd04: Fallback to `dangerouslySetInnerHTML` for inlined scripts for backward compatibility
- 7d78bc5: Improve `createRelativeLink` and `getPageByHref` for i18n usage
- Updated dependencies [1b999eb]
- Updated dependencies [961b67e]
- Updated dependencies [7d78bc5]
  - @xispedocs/core@15.4.0

## 15.3.4

### Alterações de Patch

- e0c2a92: Improve UI consistency
- 71fc1a5: Mount all children of tabs by default
  - @xispedocs/core@15.3.4

## 15.3.3

### Alterações de Patch

- 05b3bd9: [Internal] require `TagsListItem` to be used with `TagsList`
- 39bf088: Support usage with `Tabs` in primitive way
- e955a98: Hotfix problems with `HideIfEmpty`
- Updated dependencies [4ae7b4a]
  - @xispedocs/core@15.3.3

## 15.3.2

### Alterações de Patch

- 1753cf1: Fix navbar external items and nav menu scroll
- 9b38baf: add `success` type to callout
- 8e862e5: Use native scroll bar for codeblocks and some elements for better performance
- ac0ab12: Improve performance by reducing usage of `@radix-ui/react-scroll-area`
- c25d678: Support Shiki focus notation transformer by default
- Updated dependencies [c25d678]
  - @xispedocs/core@15.3.2

## 15.3.1

### Alterações de Patch

- 3372792: Support line numbers in codeblock
- Updated dependencies [3372792]
  - @xispedocs/core@15.3.1

## 15.3.0

### Alterações Menores

- 52b5ad8: **Redesign mobile sidebar**

  Mobile sidebar is now a separate component from the desktop one, with its own id `nd-sidebar-mobile`.

  note to advanced use cases: XispeDocs UI now stopped using `@xispedocs/core/sidebar`, avoid using the primitive directly as provider is not used.

### Alterações de Patch

- abce713: Adjust design (Accordion, Tabs, border color of themes)
- Updated dependencies [c05dc03]
  - @xispedocs/core@15.3.0

## 15.2.15

### Alterações de Patch

- 50db874: Remove placeholder space for codeblocks
- Updated dependencies [50db874]
- Updated dependencies [79e75c3]
  - @xispedocs/core@15.2.15

## 15.2.14

### Alterações de Patch

- Updated dependencies [6ea1718]
  - @xispedocs/core@15.2.14

## 15.2.13

### Alterações de Patch

- b433d93: Recommend using custom button/link instead for edit on GitHub button
- 1e07ed8: Support disabling codeblock styles with `.not-ramonxp-codeblock`
  - @xispedocs/core@15.2.13

## 15.2.12

### Alterações de Patch

- b68bb51: Fix sidebar legacy behaviours
- 127e681: Fix Notebook layout ignores `themeSwitch` and `sidebar.collapsible` on nav mode
- Updated dependencies [acff667]
  - @xispedocs/core@15.2.12

## 15.2.11

### Alterações de Patch

- d4d1ba7: Fix sidebar collapsible control search button still visible with search disabled
- 4e62b41: Bundle `lucide-react` as part of library
- 07cd690: Support separators without name
- Updated dependencies [07cd690]
  - @xispedocs/core@15.2.11

## 15.2.10

### Alterações de Patch

- 3a5595a: Support deprecated properties in Type Table
- 8c9fc1f: Fix callout margin
  - @xispedocs/core@15.2.10

## 15.2.9

### Alterações de Patch

- e72af4b: Improve layout
- ea0f468: Fix relative file href with hash
- 7f3c30e: Add `shadcn.css` preset
  - @xispedocs/core@15.2.9

## 15.2.8

### Alterações de Patch

- 4fad539: fix TOC relative position
- a673ef4: Make `@source` in `global.css` optional
  - @xispedocs/core@15.2.8

## 15.2.7

### Alterações de Patch

- eb18da9: Support `searchToggle` option to customise search toggle
- 085e39f: Fix inline code issues
- 4d50bcf: fix banner overlapping with collapsible control
- Updated dependencies [ec85a6c]
- Updated dependencies [e1a61bf]
  - @xispedocs/core@15.2.7

## 15.2.6

### Alterações de Patch

- b07e98c: Deprecate `DocsCategory`, see https://ramonxp.dev/docs/ui/markdown#further-reading-section
- Updated dependencies [d49f9ae]
- Updated dependencies [b07e98c]
- Updated dependencies [3a4bd88]
  - @xispedocs/core@15.2.6

## 15.2.5

### Alterações de Patch

- Updated dependencies [c66ed79]
  - @xispedocs/core@15.2.5

## 15.2.4

### Alterações de Patch

- 1057957: Fix type problems on dynamic codeblock
- Updated dependencies [1057957]
  - @xispedocs/core@15.2.4

## 15.2.3

### Alterações de Patch

- 5e4e9ec: Deprecate I18nProvider in favour of `<RootProvider />` `i18n` prop
- 293178f: revert framework migration on i18n provider
  - @xispedocs/core@15.2.3

## 15.2.2

### Alterações de Patch

- 0829544: Remove unused registry files from dist
- Updated dependencies [0829544]
  - @xispedocs/core@15.2.2

## 15.2.1

### Alterações de Patch

- 22aeafb: Improve Tree context performance
  - @xispedocs/core@15.2.1

## 15.2.0

### Alterações de Patch

- c5af09f: UI: Use `text.previousPage` for previous page navigation
- Updated dependencies [2fd325c]
- Updated dependencies [a7cf4fa]
  - @xispedocs/core@15.2.0

## 15.1.3

### Alterações de Patch

- Updated dependencies [b734f92]
  - @xispedocs/core@15.1.3

## 15.1.2

### Alterações de Patch

- 44d5acf: Improve sidebar UI
- Updated dependencies [3f580c4]
  - @xispedocs/core@15.1.2

## 15.1.1

### Alterações de Patch

- Updated dependencies [c5add28]
- Updated dependencies [f3cde4f]
- Updated dependencies [7c8a690]
- Updated dependencies [b812457]
  - @xispedocs/core@15.1.1

## 15.1.0

### Alterações de Patch

- Updated dependencies [f491f6f]
- Updated dependencies [f491f6f]
- Updated dependencies [f491f6f]
  - @xispedocs/core@15.1.0

## 15.0.18

### Alterações de Patch

- e7e2a2a: Support `createRelativeLink` component factory for using relative file paths in `href`
  - @xispedocs/core@15.0.18

## 15.0.17

### Alterações de Patch

- b790699: Support `themeSwitch` option in layouts to customise theme switch
- Updated dependencies [72f79cf]
  - @xispedocs/core@15.0.17

## 15.0.16

### Alterações de Patch

- @xispedocs/core@15.0.16

## 15.0.15

### Alterações de Patch

- 0e5e14d: Use container media queries on Cards
- Updated dependencies [9f6d39a]
- Updated dependencies [2035cb1]
  - @xispedocs/core@15.0.15

## 15.0.14

### Alterações de Patch

- 6bc033a: Display humanized stars number to GitHub info component
- Updated dependencies [37dc0a6]
- Updated dependencies [796cc5e]
- Updated dependencies [2cc0be5]
  - @xispedocs/core@15.0.14

## 15.0.13

### Alterações de Patch

- 7608f4e: Support showing optional properties on TypeTable
- 89ff3ae: Support GithubInfo component
- 16c8944: Fix Tailwind CSS utilities
  - @xispedocs/core@15.0.13

## 15.0.12

### Alterações de Patch

- 3534a10: Move `@xispedocs/core` highlighting utils to `@xispedocs/core/highlight` and `@xispedocs/core/highlight/client`
- ecacb53: Improve performance
- Updated dependencies [3534a10]
- Updated dependencies [93952db]
  - @xispedocs/core@15.0.12

## 15.0.11

### Alterações de Patch

- 886da49: Fix sidebar layout shifts with `defaultOpen` option
- 04e6c6e: Fix Notebook layout paddings
  - @xispedocs/core@15.0.11

## 15.0.10

### Alterações de Patch

- e8a3ab7: Add collapse button back to sidebar on Notebook layout
- Updated dependencies [d95c21f]
  - @xispedocs/core@15.0.10

## 15.0.9

### Alterações de Patch

- fa5b908: Fix React 18 compatibility
  - @xispedocs/core@15.0.9

## 15.0.8

### Alterações de Patch

- 8f5993b: Support custom nav mode and tabs mode on Notebook layout
  - @xispedocs/core@15.0.8

## 15.0.7

### Alterações de Patch

- 5deaf40: Support icons in separators of `meta.json`
- f782c2c: Improve sidebar design
- Updated dependencies [5deaf40]
  - @xispedocs/core@15.0.7

## 15.0.6

### Alterações de Patch

- Updated dependencies [08236e1]
- Updated dependencies [a06af26]
  - @xispedocs/core@15.0.6

## 15.0.5

### Alterações de Patch

- 14b2f95: Improve accessibility
  - @xispedocs/core@15.0.5

## 15.0.4

### Alterações de Patch

- c892bd9: Improve `DocsCategory` cards
- c892bd9: Always show copy button on codeblocks on touch devices
  - @xispedocs/core@15.0.4

## 15.0.3

### Alterações de Patch

- 47171db: UI: fix ocean theme
  - @xispedocs/core@15.0.3

## 15.0.2

### Alterações de Patch

- a8e9e1f: Bump deps
  - @xispedocs/core@15.0.2

## 15.0.1

### Alterações de Patch

- 421166a: Fix border styles
  - @xispedocs/core@15.0.1

## 15.0.0

### Alterações Principais

- a84f37a: **Migrate to Tailwind CSS v4**

  **migrate:**

  Follow https://tailwindcss.com/blog/tailwindcss-v4 for official migrate guide of Tailwind CSS v4.

  XispeDocs UI v15 redesigned the Tailwind CSS config to fully adhere the new config style, no JavaScript and options needed for plugins.
  Add the following to your CSS file:

  ```css
  @import 'tailwindcss';
  @import '@xispedocs/ui/css/neutral.css';
  @import '@xispedocs/ui/css/preset.css';
  /* if you have Twoslash enabled */
  @import '@xispedocs/twoslash/twoslash.css';

  @source '../node_modules/@xispedocs/ui/dist/**/*.js';
  /* if you have OpenAPI enabled */
  @source '../node_modules/@xispedocs/openapi/dist/**/*.js';
  ```

  The `@xispedocs/ui/css/preset.css` import is required, it declares necessary plugins & styles for XispeDocs UI, and `@xispedocs/ui/css/neutral.css` defines the color palette of UI.

  Like the previous `preset` option in Tailwind CSS plugin, you can import other color presets like `@xispedocs/ui/css/vitepress.css`.

  You should also pay attention to `@source`, the file paths are relative to the CSS file itself. For your project, it might not be `../node_modules/@xispedocs/ui/dist/**/*.js`.

### Alterações de Patch

- a89d6e0: Support XispeDocs v15
- f2f9c3d: Redesign sidebar
- Updated dependencies [5b8cca8]
- Updated dependencies [a763058]
- Updated dependencies [581f4a5]
  - @xispedocs/core@15.0.0

## 14.7.7

### Alterações de Patch

- 4f2538a: Support `children` prop in custom `Folder` component
- 191012a: `DocsCategory` search based on file path when item isn't present in the tree
- fb6b168: No longer rely on search context on search dialog
  - @xispedocs/core@14.7.7

## 14.7.6

### Alterações de Patch

- Updated dependencies [b9601fb]
  - @xispedocs/core@14.7.6

## 14.7.5

### Alterações de Patch

- 5d41bf1: Enable system option for theme toggle on NoteBook layout
- 900eb6c: Prevent shrink on sidebar icons by default
- a959374: Support `fd-*` prefixes to Tailwind CSS utils
- Updated dependencies [777188b]
  - @xispedocs/core@14.7.5

## 14.7.4

### Alterações de Patch

- 26d9ccb: Fix banner preview
- 036f8e1: Disable hover to open navbar menu by default, can be enabled via `nav.enableHoverToOpen`
- Updated dependencies [bb73a72]
- Updated dependencies [69bd4fe]
  - @xispedocs/core@14.7.4

## 14.7.3

### Alterações de Patch

- 041f230: Support trailing slash
- ca1cf19: Support custom `<Banner />` height
- Updated dependencies [041f230]
  - @xispedocs/core@14.7.3

## 14.7.2

### Alterações de Patch

- Updated dependencies [14b280c]
  - @xispedocs/core@14.7.2

## 14.7.1

### Alterações de Patch

- 18b00c1: Fix `hideSearch` option
- Updated dependencies [72dc093]
  - @xispedocs/core@14.7.1

## 14.7.0

### Alterações de Patch

- a557bb4: revert `contain`
- Updated dependencies [97ed36c]
  - @xispedocs/core@14.7.0

## 14.6.8

### Alterações de Patch

- e95be52: Fix i18n toggle
- f3298ea: Add css prefix by default
  - @xispedocs/core@14.6.8

## 14.6.7

### Alterações de Patch

- Updated dependencies [5474343]
  - @xispedocs/core@14.6.7

## 14.6.6

### Alterações de Patch

- 9c930ea: fix runtime error
  - @xispedocs/core@14.6.6

## 14.6.5

### Alterações de Patch

- 969da26: Improve i18n api
- Updated dependencies [969da26]
  - @xispedocs/core@14.6.5

## 14.6.4

### Alterações de Patch

- 67124b1: Improve theme toggle on Notebook layout
- 1810868: Enable `content-visibility` CSS features
- Updated dependencies [b71064a]
  - @xispedocs/core@14.6.4

## 14.6.3

### Alterações de Patch

- abc3677: Allow `className` to be used with `SidebarItem`
  - @xispedocs/core@14.6.3

## 14.6.2

### Alterações de Patch

- 9908922: Add default icon styles (`transformer`) to sidebar tabs
- ece734f: Support custom children of trigger on `InlineTOC` component
- 1a2597a: Expose `--fd-tocnav-height` CSS variable
- Updated dependencies [2357d40]
  - @xispedocs/core@14.6.2

## 14.6.1

### Alterações de Patch

- 9532855: Hide toc popover when no items
  - @xispedocs/core@14.6.1

## 14.6.0

### Alterações Menores

- 010da9e: Tabs: support usage without `value`
- bebb16b: Support `DynamicCodeBlock` component

### Alterações de Patch

- 9585561: Fix Twoslash popups focus outline
- 4766292: Support React 19
- Updated dependencies [4dfde6b]
- Updated dependencies [bebb16b]
- Updated dependencies [4766292]
- Updated dependencies [050b326]
  - @xispedocs/core@14.6.0

## 14.5.6

### Alterações de Patch

- b7745f4: Fix references problem of sidebar tabs
- Updated dependencies [9a18c14]
  - @xispedocs/core@14.5.6

## 14.5.5

### Alterações de Patch

- 06f66d8: improve notebook layout for transparent sidebar
- 2d0501f: Fi sidebar icon trigger
  - @xispedocs/core@14.5.5

## 14.5.4

### Alterações de Patch

- 8e2cb31: fix trivial bugs
  - @xispedocs/core@14.5.4

## 14.5.3

### Alterações de Patch

- c5a5ba0: fix sidebar `defaultOpenLevel`
- f34e895: Support `props` in tag items
- 4c82a3d: Hide toc when it has no items and custom banner & footer
- f8e5157: Fix custom `theme` with Typography plugin
- ad00dd3: Support folder groups on sidebar tabs
  - @xispedocs/core@14.5.3

## 14.5.2

### Alterações de Patch

- 072e349: fix initial sidebar level to 0
  - @xispedocs/core@14.5.2

## 14.5.1

### Alterações de Patch

- 6fd480f: Fix old browser compatibility
  - @xispedocs/core@14.5.1

## 14.5.0

### Alterações Menores

- 66c70ec: **Replace official Tailwind CSS typography plugin**
  - Other variants like `prose-sm` and `prose-gray` are removed, as it's supposed to only provide support for XispeDocs UI typography styles.

- 05d224c: added the updateAnchor option for the Tabs ui component

### Alterações de Patch

- @xispedocs/core@14.5.0

## 14.4.2

### Alterações de Patch

- 0f1603a: Fix bugs
  - @xispedocs/core@14.4.2

## 14.4.1

### Alterações de Patch

- 07474cb: fix codeblock paddings
- 48a2c15: Control page styles from layouts
  - @xispedocs/core@14.4.1

## 14.4.0

### Alterações Menores

- 5fd4e2f: Make TOC collapse to a popover on `lg` screen size instead of `md`
- 5fd4e2f: Support better table styles for Typography plugin
- 8a3f5b0: Make `neutral` the default theme of XispeDocs UI

### Alterações de Patch

- 5145123: Fix sidebar footer issues
- 64defe0: Support `@xispedocs/ui/layouts/notebook` layout
  - @xispedocs/core@14.4.0

## 14.3.1

### Alterações de Patch

- e7443d7: Fix development errors
  - @xispedocs/core@14.3.1

## 14.3.0

### Alterações Menores

- b8a12ed: Move to `tsc` (experimental)

### Alterações de Patch

- 80655b3: Improve padding of sidebar tabs and expose it to sidebar
  - @xispedocs/core@14.3.0

## 14.2.1

### Alterações de Patch

- 2949da3: Show 'ctrl' for windows in search toggle
- Updated dependencies [ca94bfd]
  - @xispedocs/core@14.2.1

## 14.2.0

### Alterações Menores

- e248a0f: Support Orama Cloud integration
- 7a5393b: Replace `cmdk` with custom implementation

### Alterações de Patch

- Updated dependencies [e248a0f]
  - @xispedocs/core@14.2.0

## 14.1.1

### Alterações de Patch

- Updated dependencies [1573d63]
  - @xispedocs/core@14.1.1

## 14.1.0

### Alterações de Patch

- Updated dependencies [b262d99]
- Updated dependencies [d6d290c]
- Updated dependencies [4a643ff]
- Updated dependencies [b262d99]
- Updated dependencies [90725c1]
  - @xispedocs/core@14.1.0

## 14.0.2

### Alterações de Patch

- bfc2bf2: Fix navbar issues
  - @xispedocs/core@14.0.2

## 14.0.1

### Alterações de Patch

- 1a7d78a: Pass props to replaced layout components via Radix UI `<Slot />`
  - @xispedocs/core@14.0.1

## 14.0.0

### Alterações Principais

- d9e908e: **Refactor import paths for layouts**

  **migrate:** Use

  ```ts
  import { DocsLayout } from '@xispedocs/ui/layouts/docs';

  import { HomeLayout } from '@xispedocs/ui/layouts/home';

  import { BaseLayoutProps } from '@xispedocs/ui/layouts/shared';
  ```

  Instead of

  ```ts
  import { DocsLayout } from '@xispedocs/ui/layout';

  import { HomeLayout } from '@xispedocs/ui/home-layout';

  import { HomeLayoutProps } from '@xispedocs/ui/home-layout';
  ```

- 9a10262: **Move Twoslash UI components to `@xispedocs/twoslash`**

  **why:** Isolate logic from XispeDocs UI

  **migrate:**

  Before:

  ```ts
  import '@xispedocs/ui/twoslash.css';

  import { Popup } from '@xispedocs/ui/twoslash/popup';
  ```

  After:

  ```ts
  import '@xispedocs/twoslash/twoslash.css';

  import { Popup } from '@xispedocs/twoslash/ui';
  ```

  **Tailwind CSS is now required for Twoslash integration.**

- d9e908e: **Remove `getImageMeta` from `@xispedocs/ui/og`**

  **migrate:** Use Metadata API from `@xispedocs/core/server`

- d9e908e: Replace `@xispedocs/core/search/shared` with `@xispedocs/core/server`
- be53a0e: **`DocsCategory` now accept `from` prop instead of `pages` prop.**

  **why:** This allows sharing the order of items with page tree.
  **migrate:**

  The component now takes `from` prop which is the Source API object.

  ```tsx
  import { source } from '@/lib/source';
  import { DocsCategory } from '@xispedocs/ui/page';

  const page = source.getPage(params.slug);

  <DocsCategory page={page} from={source} />;
  ```

### Alterações Menores

- 34cf456: Support `disableThemeSwitch` on layouts
- d9e908e: Bundle icons into dist
- ad47fd8: Show i18n language toggle on home layout
- 87063eb: Add root toggle to sidebar automatically
- 64f0653: Introduce `--fd-nav-height` CSS variable for custom navbar
- e1ee822: Support hast nodes in `toc` variable
- 3d054a8: Support linking to a specific tab

### Alterações de Patch

- f949520: Support Shiki diff transformer
- 367f4c3: Improve Root Toggle component
- d9e908e: Change default URL of title on i18n mode
- d9e908e: Add center to root toggle
- e612f2a: Make compatible with Next.js 15
- 3d0369a: Improve edit on GitHub button
- be820c4: Bump deps
- Updated dependencies [e45bc67]
- Updated dependencies [d9e908e]
- Updated dependencies [d9e908e]
- Updated dependencies [f949520]
- Updated dependencies [9a0b09f]
- Updated dependencies [9a0b09f]
- Updated dependencies [367f4c3]
- Updated dependencies [e1ee822]
- Updated dependencies [e612f2a]
- Updated dependencies [9a0b09f]
- Updated dependencies [d9e908e]
- Updated dependencies [8ef00dc]
- Updated dependencies [979e301]
- Updated dependencies [d9e908e]
- Updated dependencies [979e301]
- Updated dependencies [15781f0]
- Updated dependencies [be820c4]
- Updated dependencies [d9e908e]
  - @xispedocs/core@14.0.0

## 13.4.10

### Alterações de Patch

- 4cb74d5: Expose more props to Image Zoom
- Updated dependencies [6231ad3]
  - @xispedocs/core@13.4.10

## 13.4.9

### Alterações de Patch

- bcf51a6: Improve banner rainbow variant
- Updated dependencies [083f04a]
  - @xispedocs/core@13.4.9

## 13.4.8

### Alterações de Patch

- 5581733: Add center to root toggle
- 1a327cc: Fix props types of Root Toggle
- Updated dependencies [78e59e7]
  - @xispedocs/core@13.4.8

## 13.4.7

### Alterações de Patch

- 6e1923e: Fix ocean present background repeat
- 6e1923e: Introduce `rainbow` variant on Banner component
- Updated dependencies [6e1923e]
  - @xispedocs/core@13.4.7

## 13.4.6

### Alterações de Patch

- b33aff0: Fix typography styles
- afb697e: Fix Next.js 14.2.8 dynamic import problems
- 6bcd263: Fix Banner component z-index
- Updated dependencies [afb697e]
- Updated dependencies [daa66d2]
  - @xispedocs/core@13.4.6

## 13.4.5

### Alterações de Patch

- d46a3f1: Improve search dialog
  - @xispedocs/core@13.4.5

## 13.4.4

### Alterações de Patch

- Updated dependencies [729928e]
  - @xispedocs/core@13.4.4

## 13.4.3

### Alterações de Patch

- @xispedocs/core@13.4.3

## 13.4.2

### Alterações de Patch

- 0c251e5: Bump deps
- 0c251e5: Support Shiki inline code
- 0c251e5: Improve nested list styles
- Updated dependencies [7dabbc1]
- Updated dependencies [0c251e5]
- Updated dependencies [3b56170]
  - @xispedocs/core@13.4.2

## 13.4.1

### Alterações de Patch

- Updated dependencies [95dbba1]
  - @xispedocs/core@13.4.1

## 13.4.0

### Alterações Menores

- 26f5360: Support built-in OG Image generation

### Alterações de Patch

- @xispedocs/core@13.4.0

## 13.3.3

### Alterações de Patch

- Updated dependencies [f8cc167]
  - @xispedocs/core@13.3.3

## 13.3.2

### Alterações de Patch

- 17746a6: Support built-in edit on github button
- Updated dependencies [0e0ef8c]
  - @xispedocs/core@13.3.2

## 13.3.1

### Alterações de Patch

- 7258c4b: Fix thumb not rendered on initial render
  - @xispedocs/core@13.3.1

## 13.3.0

### Alterações Menores

- 8f5b19e: Introduce `DocsTitle`, `DocsDescription` and `DocsCategory` components
- 32ca37a: Support Clerk-style TOC
- 9aae448: Support multiple toc active items
- c542561: Use cookie to store active locale on `always` mode

### Alterações de Patch

- Updated dependencies [4916f84]
- Updated dependencies [fd46eb6]
- Updated dependencies [fd46eb6]
- Updated dependencies [fd46eb6]
- Updated dependencies [fd46eb6]
- Updated dependencies [9aae448]
- Updated dependencies [c542561]
  - @xispedocs/core@13.3.0

## 13.2.2

### Alterações de Patch

- Updated dependencies [36b771b]
- Updated dependencies [61b91fa]
  - @xispedocs/core@13.2.2

## 13.2.1

### Alterações de Patch

- Updated dependencies [17fa173]
  - @xispedocs/core@13.2.1

## 13.2.0

### Alterações Menores

- ba588a2: Support custom max width
- ec983a3: Change default value of `defaultOpenLevel` to 0

### Alterações de Patch

- 96c9dda: Change Heading scroll margins
- 96c9dda: Hide TOC Popover on full mode
- Updated dependencies [96c9dda]
  - @xispedocs/core@13.2.0

## 13.1.0

### Alterações Menores

- c8910c4: Add default 'max-height' to codeblocks

### Alterações de Patch

- 61ef42c: Add `vitepress` theme preset
- deae4dd: Improve theme presets
- c8910c4: Fix empty space on search dialog
- 6c42960: Improve TOC design
- Updated dependencies [f280191]
  - @xispedocs/core@13.1.0

## 13.0.7

### Alterações de Patch

- e7c52f2: Fix code styles in headings
- Updated dependencies [37bbfff]
  - @xispedocs/core@13.0.7

## 13.0.6

### Alterações de Patch

- 1622e36: Fix bug breaking Tailwind CSS IntelliSense VSCode Extension
  - @xispedocs/core@13.0.6

## 13.0.5

### Alterações de Patch

- Updated dependencies [2cf65f6]
  - @xispedocs/core@13.0.5

## 13.0.4

### Alterações de Patch

- Updated dependencies [5355391]
  - @xispedocs/core@13.0.4

## 13.0.3

### Alterações de Patch

- Updated dependencies [978342f]
  - @xispedocs/core@13.0.3

## 13.0.2

### Alterações de Patch

- Updated dependencies [4819820]
  - @xispedocs/core@13.0.2

## 13.0.1

### Alterações de Patch

- @xispedocs/core@13.0.1

## 13.0.0

### Alterações Principais

- 89190ae: **Rename `prefix` option on Tailwind CSS Plugin to `cssPrefix`**

  **why:** The previous name was misleading

  **migrate:** Rename the option.

  ```js
  import { createPreset } from '@xispedocs/ui/tailwind-plugin';

  /** @type {import('tailwindcss').Config} */
  export default {
    presets: [
      createPreset({
        cssPrefix: 'fd',
      }),
    ],
  };
  ```

- b02eebf: **Move `keepCodeBlockBackground` option to code block component**

  **why:** Easier to customise code block styles.

  **migrate:**

  Enable `keepBackground` on `<CodeBlock />`, and remove deprecated usage.

  ```tsx
  import { Pre, CodeBlock } from '@xispedocs/ui/components/codeblock';

  <MDX
    components={{
      pre: ({ ref: _ref, ...props }) => (
        <CodeBlock keepBackground {...props}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      ),
    }}
  />;
  ```

- f868018: **Replace `secondary` link items with `icon` link items**

  **why:** Link items with type `secondary` has been deprecated long time ago.

  **migrate:** Replace type `secondary` with `icon`.

- 8aebeab: **Change usage of I18nProvider**

  **why:** Make possible to load translations lazily

  **migrate:**

  ```tsx
  import { RootProvider } from '@xispedocs/ui/provider';
  import type { ReactNode } from 'react';
  import { I18nProvider } from '@xispedocs/ui/i18n';

  export default function Layout({
    params: { lang },
    children,
  }: {
    params: { lang: string };
    children: ReactNode;
  }) {
    return (
      <html lang={lang}>
        <body>
          <I18nProvider
            locale={lang}
            // options
            locales={[
              {
                name: 'English',
                locale: 'en',
              },
              {
                name: 'Chinese',
                locale: 'cn',
              },
            ]}
            // translations
            translations={
              {
                cn: {
                  toc: '目錄',
                  search: '搜尋文檔',
                  lastUpdate: '最後更新於',
                  searchNoResult: '沒有結果',
                  previousPage: '上一頁',
                  nextPage: '下一頁',
                },
              }[lang]
            }
          >
            <RootProvider>{children}</RootProvider>
          </I18nProvider>
        </body>
      </html>
    );
  }
  ```

- 8aebeab: **Require `locale` prop on I18nProvider**

  **why:** Fix problems related to pathname parsing

  **migrate:** Pass `locale` parameter to the provider

- 0377bb4: **Rename `id` prop on Tabs component to `groupId`**

  **why:** Conflicted with HTML `id` attribute.

  **migrate:** Rename to `groupId`.

- e8e6a17: **Make Tailwind CSS Plugin ESM-only**

  **why:** Tailwind CSS supported ESM and TypeScript configs.

  **migrate:** Use ESM syntax in your Tailwind CSS config.

- c901e6b: **Remove deprecated `@xispedocs/ui/components/api` components**

  **why:** The new OpenAPI integration has its own UI implementation.

  **migrate:** Update to latest OpenAPI integration.

- 89190ae: **Add `fd-` prefix to all XispeDocs UI colors, animations and utilities**

  **why:** The added Tailwind CSS colors may conflict with the existing colors of codebases.

  **migrate:** Enable `addGlobalColors` on Tailwind CSS Plugin or add the `fd-` prefix to class names.

  ```js
  import { createPreset } from '@xispedocs/ui/tailwind-plugin';

  /** @type {import('tailwindcss').Config} */
  export default {
    presets: [
      createPreset({
        addGlobalColors: true,
      }),
    ],
  };
  ```

- b02eebf: **Change code block component usage**

  **why:** The previous usage was confusing, some props are passed directly to `pre` while some are not.

  **migrate:**

  Pass all props to `CodeBlock` component.
  This also includes class names, change your custom styles if necessary.

  ```tsx
  import { Pre, CodeBlock } from '@xispedocs/ui/components/codeblock';

  <MDX
    components={{
      // HTML `ref` attribute conflicts with `forwardRef`
      pre: ({ ref: _ref, ...props }) => (
        <CodeBlock {...props}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      ),
    }}
  />;
  ```

  You can ignore this if you didn't customise the default `pre` element.

- 4373231: **Remove `RollButton` component**

  **why:** `RollButton` was created because there were no "Table Of Contents" on mobile viewports. Now users can use the TOC Popover to switch between headings, `RollButton` is no longer a suitable design for XispeDocs UI.

  **migrate:** Remove usages, you may copy the [last implementation of `RollButton`](https://github.com/ramonsantos9/@xispedocs/blob/@xispedocs/ui%4012.5.6/packages/ui/src/components/roll-button.tsx).

### Alterações Menores

- c684c00: Support to disable container style overriding
- c8964d3: Include `Callout` as default MDX component

### Alterações de Patch

- daa7d3c: Fix empty folder animation problems
- Updated dependencies [09c3103]
- Updated dependencies [c714eaa]
- Updated dependencies [b02eebf]
  - @xispedocs/core@13.0.0

## 12.5.6

### Alterações de Patch

- a332bee: Support `undefined` state of `defaultOpen` in folder nodes
  - @xispedocs/core@12.5.6

## 12.5.5

### Alterações de Patch

- 3519e6c: Fix TOC overflow problems
  - @xispedocs/core@12.5.5

## 12.5.4

### Alterações de Patch

- fccdfdb: Improve TOC Popover design
- Updated dependencies [fccdfdb]
- Updated dependencies [2ffd5ea]
  - @xispedocs/core@12.5.4

## 12.5.3

### Alterações de Patch

- 5d963f4: Support to disable prefetching links on sidebar
  - @xispedocs/core@12.5.3

## 12.5.2

### Alterações de Patch

- a5c34f0: Support specifying the url of root node when breadcrumbs have `includeRoot` enabled
- Updated dependencies [a5c34f0]
  - @xispedocs/core@12.5.2

## 12.5.1

### Alterações de Patch

- c5d20d0: Fix wrong padding
- 3d8f6cf: Add data attributes to certain components to improve CSS targeting
  - @xispedocs/core@12.5.1

## 12.5.0

### Alterações Menores

- b9fa99d: Support tag filters in search dialog
- a4bcaa7: Rename `Layout` in `@xispedocs/ui/layout` to `HomeLayout` in `@xispedocs/ui/home-layout`

### Alterações de Patch

- d1c7405: Optimize performance
- Updated dependencies [b9fa99d]
- Updated dependencies [525925b]
  - @xispedocs/core@12.5.0

## 12.4.2

### Alterações de Patch

- 503e8e9: Improve Object Collaspible
- Updated dependencies [503e8e9]
  - @xispedocs/core@12.4.2

## 12.4.1

### Alterações de Patch

- @xispedocs/core@12.4.1

## 12.4.0

### Alterações Menores

- eb36761: Replace link item `secondary` type with `icon` (backward compatible)
- eb36761: Support `secondary` property in link items
- eb36761: Support `button` type link item
- eb36761: Support `on` filter in link items

### Alterações de Patch

- 33ffa99: Improve design details
  - @xispedocs/core@12.4.0

## 12.3.6

### Alterações de Patch

- 4cc5782: Adding secondary custom links
  - @xispedocs/core@12.3.6

## 12.3.5

### Alterações de Patch

- @xispedocs/core@12.3.5

## 12.3.4

### Alterações de Patch

- fbfd050: Improve the default theme
- eefa75d: Reduce the navbar height
  - @xispedocs/core@12.3.4

## 12.3.3

### Alterações de Patch

- 90d51cb: Fix problem with I18n middleware & language toggle
- Updated dependencies [90d51cb]
  - @xispedocs/core@12.3.3

## 12.3.2

### Alterações de Patch

- Updated dependencies [ca7d0f4]
  - @xispedocs/core@12.3.2

## 12.3.1

### Alterações de Patch

- Updated dependencies [cf852f6]
  - @xispedocs/core@12.3.1

## 12.3.0

### Alterações de Patch

- Updated dependencies [ce3c8ad]
- Updated dependencies [ce3c8ad]
  - @xispedocs/core@12.3.0

## 12.2.5

### Alterações de Patch

- 7c23f7e: No longer set a default size for SVG elements in title
  - @xispedocs/core@12.2.5

## 12.2.4

### Alterações de Patch

- ffb9026: Fix `cmdk` upstream dependency problems
  - @xispedocs/core@12.2.4

## 12.2.3

### Alterações de Patch

- b4824fa: Updated `<APIInfo />` component, so method name appears vertically centered.
- e120e0f: Improve `<Banner/>` component
- 3970b55: Support custom type link items
  - @xispedocs/core@12.2.3

## 12.2.2

### Alterações de Patch

- 72c7991: Improve sidebar
  - @xispedocs/core@12.2.2

## 12.2.1

### Alterações de Patch

- c428a60: Revert the height of docs navbar to 64px
- 018dbd9: Support `Banner` component
  - @xispedocs/core@12.2.1

## 12.2.0

### Alterações Menores

- 318eaf9: **Redesign TOC popover:** Make the TOC Popover trigger a part of navbar.
- ea22d04: **Improve dynamic sidebar:** Improve animation & close delay

### Alterações de Patch

- 2f2d9cf: **Improve footer:** Use card-style buttons to match the other buttons
- bcc9f91: Added a new colors for API info badge, so POST, PATCH requests are different from PUT.
- 2f2d9cf: Improve OpenAPI styles
- Updated dependencies [b70ff06]
  - @xispedocs/core@12.2.0

## 12.1.3

### Alterações de Patch

- 2a5db91: Add timeout for hovering after collapsed the sidebar
- 3e98d7d: Support `full` mode on pages
- d06c92a: Support `transparentMode` on secondary (docs) navbar
- 3bdc786: Support XispeDocs OpenAPI 3.1.0
- d06c92a: Fix hot keys order
  - @xispedocs/core@12.1.3

## 12.1.2

### Alterações de Patch

- 284a571: Support XispeDocs OpenAPI v3
- Updated dependencies [b4856d1]
  - @xispedocs/core@12.1.2

## 12.1.1

### Alterações de Patch

- 1c3a127: Redesign Tabs component
- Updated dependencies [a39dbcb]
  - @xispedocs/core@12.1.1

## 12.1.0

### Alterações Menores

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

### Alterações de Patch

- 0a377a9: Close sidebar on collapse
- 5f86faa: Improve multi-line code blocks
- Updated dependencies [0a377a9]
- Updated dependencies [0a377a9]
  - @xispedocs/core@12.1.0

## 12.0.7

### Alterações de Patch

- 51441d3: Fix `RollButton` component problems on Safari
  - @xispedocs/core@12.0.7

## 12.0.6

### Alterações de Patch

- 056bad5: Improve default values
- Updated dependencies [7a29b79]
- Updated dependencies [b0c1242]
  - @xispedocs/core@12.0.6

## 12.0.5

### Alterações de Patch

- 4455d58: Fix `bannerProps` being ignored
  - @xispedocs/core@12.0.5

## 12.0.4

### Alterações de Patch

- 70666d8: Hide file name on breadcrumbs
- f96da27: Improve design details
- 51ca944: Support including separators in breadcrumbs
- Updated dependencies [72dbaf1]
- Updated dependencies [51ca944]
  - @xispedocs/core@12.0.4

## 12.0.3

### Alterações de Patch

- 18928af: Improve mobile experience on Safari
- Updated dependencies [053609d]
  - @xispedocs/core@12.0.3

## 12.0.2

### Alterações de Patch

- Show TOC on mobile devices
  - @xispedocs/core@12.0.2

## 12.0.1

### Alterações de Patch

- 21fe244: Redesign roll button
- 547a61a: Use Menu for link items
  - @xispedocs/core@12.0.1

## 12.0.0

### Alterações Principais

- 62b5abb: **New Layout**
  - Remove navbar from docs layout, replace it with sidebar.
  - On smaller devices, navbar is always shown.
  - Remove exports of internal components, copying components from the repository is now the preferred way.

  **migrate:** On layouts, Rename `nav.githubUrl` to `githubUrl`.
  Modify your stylesheet if necessary.

- 5741224: **Remove deprecated option `enableThemeProvider` from Root Provider**

  **migrate:** Use `theme.enabled` instead.

- 2f8b168: **Replace `<LanguageSelect />` component with `<LanguageToggle />`**

  **migrate:**

  Remove your `<LanguageSelect />` component from the layout. Enable the new language toggle with:

  ```tsx
  import { DocsLayout } from '@xispedocs/ui/layout';

  export default function Layout({ children }: { children: React.ReactNode }) {
    return <DocsLayout i18n>{children}</DocsLayout>;
  }
  ```

### Alterações Menores

- d88dfa6: Support switching between page trees with `RootToggle` component

### Alterações de Patch

- c110040: Fix problems with twoslash codeblocks
- 13a60b9: Heading support typography styles
- 1fe0812: Support translation for theme label
- Updated dependencies [98430e9]
- Updated dependencies [d88dfa6]
- Updated dependencies [ba20694]
- Updated dependencies [57eb762]
  - @xispedocs/core@12.0.0

## 11.3.2

### Alterações de Patch

- 1b8e12b: Use `display: grid` for codeblocks
- Updated dependencies [1b8e12b]
  - @xispedocs/core@11.3.2

## 11.3.1

### Alterações de Patch

- 10ab3e9: Fix sidebar opened by default
  - @xispedocs/core@11.3.1

## 11.3.0

### Alterações Menores

- 917d87f: Rename sidebar primitive `minWidth` prop to `blockScrollingWidth`

### Alterações de Patch

- 2a1211e: Support customising search dialog hotkeys
- 9de31e6: Support `withArticle` for MDX Pages
- Updated dependencies [917d87f]
  - @xispedocs/core@11.3.0

## 11.2.2

### Alterações de Patch

- dd0feb2: Support customising sidebar background with opacity
- 72096c3: Support customising theme options from root provider
  - @xispedocs/core@11.2.2

## 11.2.1

### Alterações de Patch

- 8074920: Fix sidebar background width on dynamic sidebar
  - @xispedocs/core@11.2.1

## 11.2.0

### Alterações Menores

- 3292df1: Support sliding dynamic sidebar

### Alterações de Patch

- @xispedocs/core@11.2.0

## 11.1.3

### Alterações de Patch

- 2b95c89: Fix codeblock select highlight problems
- cdc52ad: Improve page footer mobile responsibility
- Updated dependencies [88008b1]
- Updated dependencies [944541a]
- Updated dependencies [07a9312]
  - @xispedocs/core@11.1.3

## 11.1.2

### Alterações de Patch

- 58adab1: Improve theme & styles
- ae88793: Improve page footer design
  - @xispedocs/core@11.1.2

## 11.1.1

### Alterações de Patch

- 771314c: Use `sessionStorage` for non-persistent tabs
- 8ef2b68: Bump deps
- fa78241: Fix accordion text alignment
- Updated dependencies [8ef2b68]
- Updated dependencies [26f464d]
- Updated dependencies [26f464d]
  - @xispedocs/core@11.1.1

## 11.1.0

### Alterações Menores

- 02a014f: Support custom menu items in navbar

### Alterações de Patch

- @xispedocs/core@11.1.0

## 11.0.8

### Alterações de Patch

- Updated dependencies [98258b5]
  - @xispedocs/core@11.0.8

## 11.0.7

### Alterações de Patch

- Updated dependencies [f7c2c5c]
  - @xispedocs/core@11.0.7

## 11.0.6

### Alterações de Patch

- 8e0ef4b: Support disable search functionality including shortcuts
- Updated dependencies [5653d5d]
- Updated dependencies [5653d5d]
  - @xispedocs/core@11.0.6

## 11.0.5

### Alterações de Patch

- c8ea344: Support disabling search bar
  - @xispedocs/core@11.0.5

## 11.0.4

### Alterações de Patch

- 7b61b2f: Migrate `@xispedocs/ui` to fully ESM, adding support for ESM `tailwind.config` file
- Updated dependencies [7b61b2f]
  - @xispedocs/core@11.0.4

## 11.0.3

### Alterações de Patch

- c11e6ce: New color preset: `catppuccin`
  - @xispedocs/core@11.0.3

## 11.0.2

### Alterações de Patch

- 6470d6d: Fix collapse button on smaller viewports
  - @xispedocs/core@11.0.2

## 11.0.1

### Alterações de Patch

- 1136e02: Support modifying css with color presets
- 1136e02: New color preset `neutral`
- f6b4797: Improve Sidebar footer
  - @xispedocs/core@11.0.1

## 11.0.0

### Alterações Principais

- 2d8df75: Replace `nav.links` option with secondary links

  why: A more straightforward API design

  migrate:

  ```diff
  <DocsLayout
  +  links={[
  +    {
  +      type: 'secondary',
  +      text: 'Github',
  +      url: 'https://github.com',
  +      icon: <GithubIcon />,
  +      external: true,
  +    },
  +  ]}
  -  nav={{
  -    links: [
  -      {
  -        icon: <GithubIcon />,
  -        href: 'https://github.com',
  -        label: 'Github',
  -        external: true,
  -      },
  -    ],
  -  }}
  >
    {children}
  </DocsLayout>
  ```

### Alterações de Patch

- Updated dependencies [2d8df75]
- Updated dependencies [92cb12f]
- Updated dependencies [f75287d]
- Updated dependencies [2d8df75]
  - @xispedocs/core@11.0.0

## 10.1.3

### Alterações de Patch

- 6ace206: Support opening Twoslash popup on mobile
- d0288d1: New theme dusk
- Updated dependencies [bbad52f]
  - @xispedocs/core@10.1.3

## 10.1.2

### Alterações de Patch

- 0facc07: Replace navbar links with secondary links
- fd38022: Improve sidebar collapse
  - @xispedocs/core@10.1.2

## 10.1.1

### Alterações de Patch

- 38d6f22: Improve RTL Layout experience
- Updated dependencies [779c599]
- Updated dependencies [0c01300]
- Updated dependencies [779c599]
  - @xispedocs/core@10.1.1

## 10.1.0

### Alterações Menores

- 566539a: Support RTL layout

### Alterações de Patch

- @xispedocs/core@10.1.0

## 10.0.5

### Alterações de Patch

- Updated dependencies [e47c62f]
  - @xispedocs/core@10.0.5

## 10.0.4

### Alterações de Patch

- @xispedocs/core@10.0.4

## 10.0.3

### Alterações de Patch

- b27091f: Support passing search dialog `options` from root provider
- Updated dependencies [6f321e5]
  - @xispedocs/core@10.0.3

## 10.0.2

### Alterações de Patch

- 10e099a: Add scrollbar to TOC
- Updated dependencies [10e099a]
  - @xispedocs/core@10.0.2

## 10.0.1

### Alterações de Patch

- 0e78dc8: Support customising search API URL
- Updated dependencies [c9b7763]
- Updated dependencies [0e78dc8]
- Updated dependencies [d8483a8]
  - @xispedocs/core@10.0.1

## 10.0.0

### Alterações Principais

- 321d1e1f: **Move Typescript integrations to `@xispedocs/typescript`**

  why: It is now a stable feature

  migrate: Use `@xispedocs/typescript` instead.

  ```diff
  - import { AutoTypeTable } from "@xispedocs/ui/components/auto-type-table"
  + import { AutoTypeTable } from "@xispedocs/typescript/ui"
  ```

### Alterações de Patch

- de7ed150: Hide external items from navigation footer
- Updated dependencies [b5d16938]
- Updated dependencies [321d1e1f]
  - @xispedocs/core@10.0.0

## 9.1.0

### Alterações Menores

- ffc76e9d: Support to override sidebar components
- 1c388ca5: Support `defaultOpen` for folder nodes

### Alterações de Patch

- Updated dependencies [909b0e35]
- Updated dependencies [691f12aa]
- Updated dependencies [1c388ca5]
  - @xispedocs/core@9.1.0

## 9.0.0

### Alterações Principais

- 071898da: **Remove deprecated usage of `Files` component**

  Why: Since `8.3.0`, you should use the `Folder` component instead for folders. For simplicity, the `title` prop has been renamed to `name`.

  Migrate: Replace folders with the `Folder` component. Rename `title` prop to `name`.

  ```diff
  - <Files>
  - <File title="folder">
  - <File title="file.txt" />
  - </File>
  - </Files>

  + <Files>
  + <Folder name="folder">
  + <File name="file.txt" />
  + </Folder>
  + </Files>
  ```

- 2b355907: **Remove controlled usage for Accordion**

  Why: Components in XispeDocs UI should not be used outside of MDX.

  Migrate: Remove `value` and `onValueChange` props.

### Alterações de Patch

- @xispedocs/core@9.0.0

## 8.3.0

### Alterações Menores

- b0003d44: Add `purple` theme
- 9bdb49dd: Add `Folder` export to `@xispedocs/ui/components/files`
- 99d66d2d: Rename `title` prop to `name` in `File` and `Folder` component

### Alterações de Patch

- 5e314eee: Deprecate `input` color and `medium` font size from Tailwind CSS preset
- 52d578d0: Set `darkMode` to `class` by default
- 84667d2f: Improve Accordions
  - @xispedocs/core@8.3.0

## 8.2.0

### Alterações Menores

- 5c24659: Support code block icons

### Alterações de Patch

- 09bdf63: Separate stylesheet with Image Zoom component
- Updated dependencies [5c24659]
  - @xispedocs/core@8.2.0

## 8.1.1

### Alterações de Patch

- 153ceaf: Fix typo
  - @xispedocs/core@8.1.1

## 8.1.0

### Alterações Menores

- 0012eba: Support Typescript Twoslash
- bc936c5: Add `AutoTypeTable` server component

### Alterações de Patch

- 6c5a39a: Rename Git repository to `ramonxp`
- Updated dependencies [6c5a39a]
- Updated dependencies [eb028b4]
- Updated dependencies [054ec60]
  - @xispedocs/core@8.1.0

## 8.0.0

### Alterações Principais

- a2f4819: **Improve internationalized routing**

  `I18nProvider` now handles routing for you.
  Therefore, `locale` and `onChange` is no longer required.

  ```tsx
  <I18nProvider
    translations={{
      cn: {
        name: 'Chinese', // required
        search: 'Translated Content',
      },
    }}
  ></I18nProvider>
  ```

  `LanguageSelect` detects available options from your translations, therefore, the `languages` prop is removed.

- c608ad2: **Remove deprecated `docsUiPlugins`**

  migrate: Use `createPreset` instead

  ```js
  const { createPreset } = require('@xispedocs/ui/tailwind-plugin');

  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './content/**/*.mdx',
      './node_modules/@xispedocs/ui/dist/**/*.js',
    ],
    presets: [createPreset()],
  };
  ```

- 2ea9437: **Change usage of Code Block component**

  The inner `pre` element is now separated from code block container, making it easier to customise.`

  Before:

  ```tsx
  import { CodeBlock, Pre } from '@xispedocs/ui/mdx/pre';

  <Pre title={title} allowCopy {...props} />;
  ```

  After:

  ```tsx
  import { CodeBlock, Pre } from '@xispedocs/ui/components/codeblock';

  <CodeBlock title={title} allowCopy>
    <Pre {...props} />
  </CodeBlock>;
  ```

- ac424ec: **Update import paths of MDX components**

  why: To improve consistency, all MDX components are located in `/components/*` instead.

  migrate:

  ```diff
  - import { Card, Cards } from "@xispedocs/ui/mdx/card"
  + import { Card, Cards } from "@xispedocs/ui/components/card"

  - import { Heading } from "@xispedocs/ui/mdx/heading"
  + import { Heading } from "@xispedocs/ui/components/heading"

  - import { Codeblock, Pre } from "@xispedocs/ui/mdx/pre"
  + import { Codeblock, Pre } from "@xispedocs/ui/components/codeblock"
  ```

- 2b11c20: **Rename to XispeDocs**

  `next-docs-zeta` -> `@xispedocs/core`

  `next-docs-ui` -> `@xispedocs/ui`

  `next-docs-mdx` -> `@xispedocs/mdx`

  `@ramonxp/openapi` -> `@xispedocs/openapi`

  `create-next-docs-app` -> `create-xispedocs-app`

- 60db195: **Remove Nav component export**

  why: Replaced by the DocsLayout and Layout component, it is now an internal component

  migration: Use the Layout component for sharing the navbar across pages

  ```diff
  - import { Nav } from "@xispedocs/ui/nav"
  + import { Layout } from "@xispedocs/ui/layout"
  ```

### Alterações Menores

- 60db195: **Support transparent navbar**

### Alterações de Patch

- 974e00f: Collapse API example by default
- Updated dependencies [2ea9437]
- Updated dependencies [cdff313]
- Updated dependencies [1a346a1]
- Updated dependencies [2b11c20]
  - @xispedocs/core@8.0.0

## 7.1.2

### Alterações de Patch

- 9204975: Fix search dialog overflow issues
  - next-docs-zeta@7.1.2

## 7.1.1

### Alterações de Patch

- next-docs-zeta@7.1.1

## 7.1.0

### Alterações Menores

- 40e51a4: Support integration with @ramonxp/openapi
- d2744a4: Remove tailwindcss-animate

### Alterações de Patch

- c527044: Support preloading Search Dialog
  - next-docs-zeta@7.1.0

## 7.0.0

### Alterações Principais

- f995ad9: **Page Footer is now a client component**

  This allows the footer component to find items within the current page tree, which fixes the problem where a item from another page tree is appeared.

  Also removed the `url` and `tree` properties from `DocsPage` since we can pass them via React Context API.

  ```diff
  export default async function Page({ params }) {
    return (
      <DocsPage
  -      url={page.url}
  -      tree={pageTree}
      >
        ...
      </DocsPage>
    );
  }
  ```

  The `footer` property in `DocsPage` has also updated, now you can specify or replace the default footer component.

  ```tsx
  <DocsPage footer={{ items: {} }}>...</DocsPage>
  ```

### Alterações Menores

- b30d1cd: **Support theme presets**

  Add theme presets for the Tailwind CSS plugin, the default and ocean presets are available now.

  ```js
  const { docsUi, docsUiPlugins } = require('next-docs-ui/tailwind-plugin');

  /** @type {import('tailwindcss').Config} */
  module.exports = {
    plugins: [
      ...docsUiPlugins,
      docsUi({
        preset: 'ocean',
      }),
    ],
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

### Alterações de Patch

- Updated dependencies [9929c5b]
- Updated dependencies [9929c5b]
- Updated dependencies [49201be]
- Updated dependencies [338ea98]
- Updated dependencies [4c1334e]
- Updated dependencies [9929c5b]
  - next-docs-zeta@7.0.0

## 6.1.0

### Alterações Menores

- 6e0d2e1: **Support `Layout` for non-docs pages (without page tree)**

  Same as Docs Layout but doesn't include a sidebar. It can be used outside of the docs, a page tree is not required.

  ```jsx
  import { Layout } from 'next-docs-ui/layout';

  export default function HomeLayout({ children }) {
    return <Layout>{children}</Layout>;
  }
  ```

  **`nav.items` prop is deprecated**

  It is now replaced by `links`.

- 2a82e9d: **Support linking to accordions**

  You can now specify an `id` for accordion. The accordion will automatically open when the user is navigating to the page with the specified `id` in hash parameter.

  ```mdx
  <Accordions>
  <Accordion title="My Title" id="my-title">

  My Content

  </Accordion>
  </Accordions>
  ```

### Alterações de Patch

- 65b7f30: Improve search dialog design
- Updated dependencies [f39ae40]
  - next-docs-zeta@6.1.0

## 6.0.2

### Alterações de Patch

- next-docs-zeta@6.0.2

## 6.0.1

### Alterações de Patch

- 515a3e1: Fix inline code blocks are not highlighted
  - next-docs-zeta@6.0.1

## 6.0.0

### Alterações Principais

- 983ede8: **Remove `not-found` component**

  The `not-found` component was initially intended to be the default 404 page. However, we found that the Next.js default one is good enough. For advanced cases, you can always build your own 404 page.

- ebe8d9f: **Support Tailwind CSS plugin usage**

  If you are using Tailwind CSS for your docs, it's now recommended to use the official plugin instead.

  ```js
  const { docsUi, docsUiPlugins } = require('next-docs-ui/tailwind-plugin');

  /** @type {import('tailwindcss').Config} */
  module.exports = {
    darkMode: 'class',
    content: [
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './content/**/*.mdx',
      './node_modules/next-docs-ui/dist/**/*.js',
    ],
    plugins: [...docsUiPlugins, docsUi],
  };
  ```

  The `docsUi` plugin adds necessary utilities & colors, and `docsUiPlugins` are its dependency plugins which should not be missing.

- 7d89e83: **Add required property `url` to `<DocsPage />` component**

  You must pass the URL of current page to `<DocsPage />` component.

  ```diff
  export default function Page({ params }) {
    return (
      <DocsPage
  +      url={page.url}
        toc={page.data.toc}
      >
        ...
      </DocsPage>
    )
  }
  ```

  **`footer` property is now optional**

  Your `footer` property in `<DocsPage />` will be automatically generated if not specified.

  ```ts
  findNeighbour(tree, url);
  ```

- 0599d50: **Separate MDX components**

  Previously, you can only import the code block component from `next-docs-ui/mdx` (Client Component) and `next-docs-ui/mdx-server` (Server Component).

  This may lead to confusion, hence, it is now separated into multiple files. You can import these components regardless it is either a client or a server component.

  Notice that `MDXContent` is now renamed to `DocsBody`, you must import it from `next-docs-ui/page` instead.

  ```diff
  - import { MDXContent } from "next-docs-ui/mdx"
  - import { MDXContent } from "next-docs-ui/mdx-server"

  + import { DocsBody } from "next-docs-ui/page"
  ```

  ```diff
  - import { Card, Cards } from "next-docs-ui/mdx"
  + import { Card, Cards } from "next-docs-ui/mdx/card"

  - import { Pre } from "next-docs-ui/mdx"
  + import { Pre } from "next-docs-ui/mdx/pre"

  - import { Heading } from "next-docs-ui/mdx"
  + import { Heading } from "next-docs-ui/mdx/heading"

  - import defaultComponents from "next-docs-ui/mdx"
  + import defaultComponents from "next-docs-ui/mdx/default-client"

  - import defaultComponents from "next-docs-ui/mdx-server"
  + import defaultComponents from "next-docs-ui/mdx/default"
  ```

### Alterações Menores

- 56a35ce: Support custom `searchOptions` in Algolia Search Dialog

### Alterações de Patch

- 5c98f7f: Support custom attributes to `pre` element inside code blocks
- Updated dependencies [9ef047d]
  - next-docs-zeta@6.0.0

## 5.0.0

### Alterações Menores

- de44efe: Migrate to Shikiji
- de44efe: Support code highlighting options

### Alterações de Patch

- Updated dependencies [de44efe]
- Updated dependencies [de44efe]
  - next-docs-zeta@5.0.0

## 4.0.9

### Alterações de Patch

- 70545e7: Support `enableThemeProvider` option in RootProvider
- Updated dependencies [a883009]
  - next-docs-zeta@4.0.9

## 4.0.8

### Alterações de Patch

- e0c5c96: Make ESM only
- Updated dependencies [e0c5c96]
  - next-docs-zeta@4.0.8

## 4.0.7

### Alterações de Patch

- b9af5ed: Update tsup & dependencies
- Updated dependencies [b9af5ed]
  - next-docs-zeta@4.0.7

## 4.0.6

### Alterações de Patch

- Updated dependencies [ff38f6e]
  - next-docs-zeta@4.0.6

## 4.0.5

### Alterações de Patch

- f00e38f: Use `dvh` for sidebar height
  - next-docs-zeta@4.0.5

## 4.0.4

### Alterações de Patch

- 1b10e13: Default accordion type to "single"
  - next-docs-zeta@4.0.4

## 4.0.3

### Alterações de Patch

- Updated dependencies [0cc10cb]
  - next-docs-zeta@4.0.3

## 4.0.2

### Alterações de Patch

- next-docs-zeta@4.0.2

## 4.0.1

### Alterações de Patch

- 927714a: Remove dropdown from theme toggle
- d58e90a: Use await imports to import client components in Server Components
- cc1fe39: Render TOC header & footer in Server Component
- 01b23e2: Support Next.js 14
- d58e90a: Add y margins to Callout and Pre component
- Updated dependencies [2da93d8]
- Updated dependencies [01b23e2]
  - next-docs-zeta@4.0.1

## 4.0.0

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

- 6c4a782: Support Server Component usage for MDX default components

### Alterações de Patch

- b2112e8: Improve default codeblock
- 6c4a782: Fix sidebar opening issue
- Updated dependencies [6c4a782]
- Updated dependencies [6c4a782]
  - next-docs-zeta@4.0.0

## 4.0.0

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

- d2eb490: Support Server Component usage for MDX default components

### Alterações de Patch

- 0175b4f: Fix sidebar opening issue
- Updated dependencies [678cd3d]
- Updated dependencies [24245a3]
  - next-docs-zeta@4.0.0

## 3.0.0

### Alterações Menores

- 522ed48: Update typography & layout styles

### Alterações de Patch

- a4a8120: Update search utilities import paths.

  Search Utilities in `next-docs-zeta/server` is now moved to
  `next-docs-zeta/search` and `next-docs-zeta/server-algolia`.

  Client-side Changes: `next-docs-zeta/search` -> `next-docs-zeta/search/client`
  `next-docs-zeta/search-algolia` -> `next-docs-zeta/search-algolia/client`

  If you're using Next Docs UI, make sure to import the correct path.

- Updated dependencies [1043532]
- Updated dependencies [7a0690b]
- Updated dependencies [a4a8120]
  - next-docs-zeta@3.0.0

## 2.4.1

### Alterações de Patch

- dc4f10d: Fix Callout component overflow
- 841a18b: Support passing extra props to Card components
- Updated dependencies [dfc8b44]
- Updated dependencies [ef4d8cc]
  - next-docs-zeta@2.4.1

## 2.4.0

### Alterações Menores

- 82c4fc6: Override default typography styles
- 25e6856: Create Callout component

### Alterações de Patch

- 1cb6385: Improve Inline TOC component
- Updated dependencies [27ce871]
  - next-docs-zeta@2.4.0

## 2.3.3

### Alterações de Patch

- 634f7d3: Reduce dependencies
- 996a914: Create Inline TOC component
- eac081c: Update github urls & author name
- Updated dependencies [634f7d3]
- Updated dependencies [eac081c]
  - next-docs-zeta@2.3.3

## 2.3.2

### Alterações de Patch

- e0ebafa: Improve global padding
  - next-docs-zeta@2.3.2

## 2.3.1

### Alterações de Patch

- cd0b4a3: Support CSS classes usage for steps component
- cd0b4a3: Fix TOC marker position
  - next-docs-zeta@2.3.1

## 2.3.0

### Alterações Menores

- 32a4669: Support algolia search dialog

### Alterações de Patch

- cef6143: Fix toc marker position
- 32a4669: Improve search API usage
- b65219c: Separate default and custom search dialog
- 9c3bc86: Improve i18n language select
- 6664178: Support custom search function for search dialog
- Updated dependencies [6664178]
- Updated dependencies [a0f9911]
- Updated dependencies [6664178]
  - next-docs-zeta@2.3.0

## 2.2.0

### Alterações Menores

- 1ff7172: Remove support for importing "next-docs-ui/components", please use
  "next-docs-ui/nav" instead

### Alterações de Patch

- e546f4e: Hotfix sidebar collapsible not closing
  - next-docs-zeta@2.2.0

## 2.1.2

### Alterações de Patch

- a3f443f: Improve colors in light mode
- 2153fc8: Improve navbar transparent mode
- 4e7e0d2: Replace `next-docs-ui/components` with `next-docs-ui/nav`
- 4816737: Fix sidebar collapsible button
- Updated dependencies [dfbbc17]
- Updated dependencies [79227d8]
  - next-docs-zeta@2.1.2

## 2.1.1

### Alterações de Patch

- 14459cf: Fix image-zoom causes viewport overflow on IOS devices
- a015445: Improve search toggle
- 794c2c6: Remove default icon from cards
  - next-docs-zeta@2.1.1

## 2.1.0

### Alterações Menores

- db050fc: Redesign default theme & layout

### Alterações de Patch

- b527988: Files component support custom icons
- 69a4469: Animate TOC marker
- dbe1bcf: Support transparent navbar for custom navbar
- Updated dependencies [a5a661e]
  - next-docs-zeta@2.1.0

## 2.0.3

### Alterações de Patch

- caa7e98: Fix sidebar animation problems
- caa7e98: Improve copy button in codeblocks
  - next-docs-zeta@2.0.3

## 2.0.2

### Alterações de Patch

- 74e5e85: Several UI improvements
- Support adding header to TOC component
- Updated dependencies [74e5e85]
- Updated dependencies [72e9fdf]
  - next-docs-zeta@2.0.2

## 2.0.1

### Alterações de Patch

- 8a05955: Improve syntax highlighting
- Updated dependencies [48c5256]
  - next-docs-zeta@2.0.1

## 2.0.0

### Alterações Principais

- 9bf1297: Update API usage

### Alterações de Patch

- e8b3e50: Use react-medium-image-zoom for zoom images
- 6c408d0: Change layout width
  - next-docs-zeta@2.0.0

## 1.6.9

### Alterações de Patch

- 5ee874c: Create Accordions component
- 1630f74: Add default border to TOC content
  - next-docs-zeta@1.6.9

## 1.6.8

### Alterações de Patch

- 4cf4552: Fix aria-controls warning & support default index
  - next-docs-zeta@1.6.8

## 1.6.7

### Alterações de Patch

- f72a4c1: Improve animations & layout
- 88bab2f: Support `lastUpdate` in page
- f1846e8: Support i18n search dialog placeholder
  - next-docs-zeta@1.6.7

## 1.6.6

### Alterações de Patch

- be8a93d: Support sidebar default open level
  - next-docs-zeta@1.6.6

## 1.6.5

### Alterações de Patch

- b8a76f8: Fix theme toggle wrong icon
- 7337d59: Create Zoom Image component
- 79abe84: Support collapsible sidebar
- Updated dependencies [79abe84]
  - next-docs-zeta@1.6.5

## 1.6.4

### Alterações de Patch

- e6ebf6a: Rename `sidebarContent` to `sidebarFooter`
- e01bf3a: Allow `true` to keep default
- e6ebf6a: Imrove sidebar banner
  - next-docs-zeta@1.6.4

## 1.6.3

### Alterações de Patch

- Support replacing breadcrumb
- 8d07003: Replace type of `TreeNode[]` with `PageTree`
- Updated dependencies [8d07003]
  - next-docs-zeta@1.6.3

## 1.6.2

### Alterações de Patch

- 5512300: Support custom navbar items
- af8720b: Improve default code block
- 2836799: Support I18n text in built-in components
  - next-docs-zeta@1.6.2

## 1.6.1

### Alterações de Patch

- 689c75d: Create Files component
- Updated dependencies [fc6279e]
  - next-docs-zeta@1.6.1

## 1.6.0

### Alterações de Patch

- 037d5e5: Export default mdx components
- Updated dependencies [cdd30d5]
- Updated dependencies [edb9930]
  - next-docs-zeta@1.6.0

## 1.5.3

### Alterações de Patch

- fa8d4cf: Update dependencies
- f0ab1ba: Improve typography
- Updated dependencies [fa8d4cf]
  - next-docs-zeta@1.5.3

## 1.5.2

### Alterações de Patch

- 1906e80: Create steps component
  - next-docs-zeta@1.5.2

## 1.5.1

### Alterações de Patch

- d4f718d: Support disabling TOC & Sidebar
  - next-docs-zeta@1.5.1

## 1.5.0

### Alterações de Patch

- Updated dependencies [fb2abb3]
  - next-docs-zeta@1.5.0

## 1.4.1

### Alterações de Patch

- 8883553: Support tabs component
- d084de2: Export default search dialog
- Improve Search Dialog UI
- Updated dependencies
- Updated dependencies [3d92c92]
  - next-docs-zeta@1.4.1

## 1.4.0

### Alterações Menores

- 45a174a: Split roll-button into optional component

### Alterações de Patch

- ed385ab: Add Type Table component
- 5407360: Improve sidebar layout
- Updated dependencies [0f106d9]
  - next-docs-zeta@1.4.0

## 1.3.1

### Alterações de Patch

- 21725e4: Support replacing default search dialog component
- 7fb2b9e: Support custom page & folder icons
- Updated dependencies [ff05f5d]
- Updated dependencies [7fb2b9e]
  - next-docs-zeta@1.3.1

## 1.3.0

### Alterações Menores

- 98226d9: Rewrite slugger and TOC utilities

### Alterações de Patch

- 6999268: Support custom codeblock meta in Codeblocks
- Change default typography
- Updated dependencies [98226d9]
  - next-docs-zeta@1.3.0

## 1.2.1

### Alterações de Patch

- 1b626c9: Redesign UI
- ce10df9: Support custom sidebar banner
- Updated dependencies [b15895f]
  - next-docs-zeta@1.2.1

## 1.2.0

### Alterações Menores

- Remove `tree` prop from Docs Page, replaced by pages context.

### Alterações de Patch

- 5f248fb: Support Auto Scroll in TOC for headless docs
- Updated dependencies [5f248fb]
  - next-docs-zeta@1.2.0

## 1.1.4

### Alterações de Patch

- 496a6b0: Improve footer design
- 496a6b0: Configure eslint + prettier
- Updated dependencies [496a6b0]
  - next-docs-zeta@1.1.4

## 1.1.3

### Alterações de Patch

- 10d31e6: Fix sidebar scrollbars disappeared
- Updated dependencies [0998b1b]
  - next-docs-zeta@1.1.3

## 1.1.2

### Alterações de Patch

- Fix aria attributes
- Improve footer styles
- Updated dependencies
  - next-docs-zeta@1.1.2

## 1.1.1

### Alterações de Patch

- Fix codeblocks not being generated correctly
  - next-docs-zeta@1.1.1

## 1.1.0

### Alterações Menores

- 524ca9a: Support page footer

### Alterações de Patch

- d810bbd: Improve codeblock styles
- d810bbd: Add `<RollButton />` component
- Updated dependencies [255fc92]
  - next-docs-zeta@1.1.0

## 1.0.0

### Alterações Menores

- d30d57f: Support optional I18n context provider

### Alterações de Patch

- Improve codeblock styles
- Updated dependencies [8e4a001]
- Updated dependencies [4fa45c0]
- Updated dependencies [0983891]
  - next-docs-zeta@1.0.0

## 0.3.2

### Alterações de Patch

- Fix unexpected trailing slash on Contentlayer v0.3.4
- Add Auto scroll for TOC
  - next-docs-zeta@0.3.2

## 0.3.1

### Alterações de Patch

- Use Radix UI scroll area
- d91de39: Fix sticky position for TOC and Sidebar
  - next-docs-zeta@0.3.1

## 0.3.0

### Alterações Menores

- Support next.js images in MDX files

### Alterações de Patch

- next-docs-zeta@0.3.0

## 0.1.2

### Alterações de Patch

- 67cd8ab: Remove unused files in dist
- Updated dependencies [67cd8ab]
  - next-docs-zeta@0.2.1

## 0.1.1

### Alterações de Patch

- Updated dependencies [5ff94af]
- Updated dependencies [5ff94af]
  - next-docs-zeta@0.2.0
