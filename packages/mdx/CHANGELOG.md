# @xispedocs/mdx

## 3.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.3.0
  - @xispedocs/mdx-remote@3.0.0

## 2.0.0

### Patch Changes

- @xispedocs/core@2.2.0
- @xispedocs/mdx-remote@2.0.0

## 1.1.1

### Patch Changes

- Alinhamento de peerDependencies com fumadocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.
- Updated dependencies
  - @xispedocs/core@2.1.1
  - @xispedocs/mdx-remote@1.1.1

## 1.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.1.0
  - @xispedocs/mdx-remote@1.1.0

## 12.0.3

### Alterações de Patch

- a55177c: Remover utilitário de tipo `Override` nos tipos de coleção de saída
- Dependências atualizadas [ce2be59]
- Dependências atualizadas [31b9494]
  - @xispedocs/core@15.8.4

## 12.0.2

### Alterações de Patch

- a3a14e7: Bump deps
- Updated dependencies [a3a14e7]
  - @xispedocs/mdx-remote@1.4.1
  - @xispedocs/core@15.8.3

## 12.0.1

### Alterações de Patch

- af50bc8: Support customising index file output path in Vite
- 5fc9ee4: Support `remark-directive` for Include API
- 4b9871d: MDX Async mode: read file content on load
- Updated dependencies [655bb46]
- Updated dependencies [d1ae3e8]
- Updated dependencies [6548a59]
- Updated dependencies [51268ec]
- Updated dependencies [51268ec]
  - @xispedocs/core@15.8.0

## 12.0.0

### Alterações Principais

- f11f89d: **[Next.js] Rename APIS**

  On page data:
  - `_file` -> `info`.
  - `_file.absolutePath` -> `info.fullPath`.

- effe43d: **Drop support for Zod 3 schemas**

  Zod 3 schemas are still allowed, but you cannot no longer extend on the Zod 4 schemas provided by XispeDocs.

- 2862a10: **[Next.js] Removed `content` on page data in favour of `getText()`.**

### Alterações Menores

- 22e0fec: **Support `getText()` & Postprocess API**
- 2862a10: Unify doc collection entry for both Vite and Next.js integrations

## 11.10.1

### Alterações de Patch

- da095ac: Refactor internal export paths
- 854d4ef: Export `postInstall()` function from `@xispedocs/mdx/vite`
- Updated dependencies [982aed6]
  - @xispedocs/core@15.7.13

## 11.10.0

### Alterações Menores

- ea13374: Support runtime loaders: Node.js, Bun

### Alterações de Patch

- Updated dependencies [846b28a]
- Updated dependencies [2b30315]
  - @xispedocs/core@15.7.12

## 11.9.1

### Alterações de Patch

- 64d0169: hotfix node.js imports at global scope

## 11.9.0

### Alterações Menores

- d193152: Support `absolutePath` on Vite

### Alterações de Patch

- 2566eef: Support postinstall script on Vite
- Updated dependencies [c948f59]
  - @xispedocs/core@15.7.10

## 11.8.3

### Alterações de Patch

- 205d92d: Update dev server initialization for Next.js 15.5.1
- e4c12a3: Add Vite config for XispeDocs Core & UI automatically
- Updated dependencies [f65778d]
- Updated dependencies [e4c12a3]
  - @xispedocs/core@15.7.8

## 11.8.2

### Alterações de Patch

- 9a3c23b: support auto-generated title based on `h1` heading
- 9cb829c: Support referencing heading in `<include>` without sections

## 11.8.1

### Alterações de Patch

- 5f2ec6e: Fix `remark-mdx-exports` plugin fallback
- Updated dependencies [6d97379]
- Updated dependencies [e776ee5]
  - @xispedocs/core@15.7.3

## 11.8.0

### Alterações Menores

- cfe2a5c: Support Async Mode for Vite

### Alterações de Patch

- c8f49d8: Include frontmatter into `page.data.content` by default
- Updated dependencies [514052e]
- Updated dependencies [e254c65]
- Updated dependencies [ec75601]
- Updated dependencies [e785f98]
- Updated dependencies [0531bf4]
- Updated dependencies [50eb07f]
- Updated dependencies [67df155]
- Updated dependencies [b109d06]
  - @xispedocs/core@15.7.0

## 11.7.5

### Alterações de Patch

- c17fa03: Support creating a separate processor when `<include />` points to different Markdown format
- f43f714: Automatic fallback to Zod v3 when app has explicit v3 dependency
- Updated dependencies [569bc26]
- Updated dependencies [817c237]
  - @xispedocs/core@15.6.10

## 11.7.4

### Alterações de Patch

- a0148f9: Remark Include: Support copying only a section

## 11.7.3

### Alterações de Patch

- 4f8f1d6: Add `vite/client` types in generated file
- 57224f4: Support last modified time for Vite

## 11.7.2

### Alterações de Patch

- e75ec55: Support last modified time for Vite

## 11.7.1

### Alterações de Patch

- f8000f4: Generate config based on Next.js version
- f45a1b6: Support Tanstack Router/Start via `createClientLoader`
- Updated dependencies [1b0e9d5]
  - @xispedocs/core@15.6.6

## 11.7.0

### Alterações Menores

- f8a58c6: Support `preset: minimal` to disable XispeDocs specific defaults
- e5cfa27: Stabilize Vite plugin support

### Alterações de Patch

- Updated dependencies [658fa96]
- Updated dependencies [f8a58c6]
  - @xispedocs/core@15.6.5
  - @xispedocs/mdx-remote@1.4.0

## 11.6.11

### Alterações de Patch

- 73e07a5: bump zod to v4

## 11.6.10

### Alterações de Patch

- d0f8a15: Enable `remarkNpm` by default, replace `remarkInstall` with it.
- Updated dependencies [d0f8a15]
- Updated dependencies [84918b8]
- Updated dependencies [f8d1709]
  - @xispedocs/core@15.6.0
  - @xispedocs/mdx-remote@1.3.4

## 11.6.9

### Alterações de Patch

- cd86f58: Hotfix Windows EOL being ignored
- Updated dependencies [7d1ac21]
  - @xispedocs/core@15.5.3

## 11.6.8

### Alterações de Patch

- 7a45921: Add `absolutePath` and `path` properties to pages, mark `file` as deprecated
- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos
- 14e267b: Use custom util to parse frontmatter
- Updated dependencies [7a45921]
- Updated dependencies [1b7bc4b]
  - @xispedocs/core@15.5.2
  - @xispedocs/mdx-remote@1.3.3

## 11.6.7

### Alterações de Patch

- a5c283f: Support `outDir` option on `createMDX()`
- Updated dependencies [b4916d2]
- Updated dependencies [8738b9c]
- Updated dependencies [a66886b]
  - @xispedocs/core@15.5.1

## 11.6.6

### Alterações de Patch

- cd42e78: Support last modified time on Async Mode
- Updated dependencies [1b999eb]
- Updated dependencies [961b67e]
- Updated dependencies [7d78bc5]
  - @xispedocs/core@15.4.0

## 11.6.5

### Alterações de Patch

- a6c909b: Removed unused devDependencies and migrated from `fast-glob` to `tinyglobby`
- Updated dependencies [a6c909b]
  - @xispedocs/mdx-remote@1.3.2
  - @xispedocs/core@15.3.4

## 11.6.4

### Alterações de Patch

- 4ae7b4a: Support MDX in codeblock tab value
- Updated dependencies [4ae7b4a]
  - @xispedocs/mdx-remote@1.3.1
  - @xispedocs/core@15.3.3

## 11.6.3

### Alterações de Patch

- 4de7fe7: Fix `meta.{locale}` file being excluded from `defineDocs`
- Updated dependencies [c05dc03]
  - @xispedocs/core@15.3.0

## 11.6.2

### Alterações de Patch

- 16c7566: Improve error handling logic on parsing meta entries
- 7b89faa: Add `page.data.content` to sync mode
  - @xispedocs/core@15.2.13

## 11.6.1

### Alterações de Patch

- 434ccb2: Improve performance
  - @xispedocs/core@15.2.9

## 11.6.0

### Alterações Menores

- 7fcf612: Require Next.js 15.3.0 or above

### Alterações de Patch

- Updated dependencies [ec85a6c]
- Updated dependencies [e1a61bf]
  - @xispedocs/core@15.2.7

## 11.5.8

### Alterações de Patch

- 6c5e47a: add default types for collection without schema
- Updated dependencies [1057957]
  - @xispedocs/core@15.2.4

## 11.5.7

### Alterações de Patch

- 5163e92: Support reusing codeblocks in `<include>`
- Updated dependencies [c5add28]
- Updated dependencies [6493817]
- Updated dependencies [f3cde4f]
- Updated dependencies [7c8a690]
- Updated dependencies [b812457]
  - @xispedocs/core@15.1.1
  - @xispedocs/mdx-remote@1.2.1

## 11.5.6

### Alterações de Patch

- 927ee8b: Fix hot reload
  - @xispedocs/core@15.0.9

## 11.5.5

### Alterações de Patch

- e6df8aa: Improve performance
  - @xispedocs/core@15.0.8

## 11.5.4

### Alterações de Patch

- fc5d7c0: Compile Meta files into inline JSON objects
- Updated dependencies [5deaf40]
  - @xispedocs/core@15.0.7

## 11.5.3

### Alterações de Patch

- 65ae933: Fix dependencies

## 11.5.2

### Alterações de Patch

- c571417: Improve performance
- be3acf4: Improve types
  - @xispedocs/core@15.0.5

## 11.5.1

### Alterações de Patch

- 3730739: Fix types errors

## 11.5.0

### Alterações Menores

- 233a2d1: Support Standard Schema for collection `schema`
- 432c7bd: Support `defineDocs` without re-exporting `docs` and `meta` collections

### Alterações de Patch

- Updated dependencies [69f20cb]
  - @xispedocs/mdx-remote@1.2.0
  - @xispedocs/core@15.0.3

## 11.4.1

### Alterações de Patch

- a8e9e1f: Bump deps
  - @xispedocs/core@15.0.2

## 11.4.0

### Alterações Menores

- 421166a: Improve performance, remove unused imports

### Alterações de Patch

- 421166a: Fix XispeDocs 14 compatibility issues
  - @xispedocs/core@15.0.1

## 11.3.2

### Alterações de Patch

- a89d6e0: Support XispeDocs v15
- d6781cc: Fix incorrect line number with frontmatter on dev mode
- Updated dependencies [5b8cca8]
- Updated dependencies [a763058]
- Updated dependencies [581f4a5]
  - @xispedocs/core@15.0.0

## 11.3.1

### Alterações de Patch

- 69bd4fe: Fix nested references for `<include />`
- Updated dependencies [bb73a72]
- Updated dependencies [69bd4fe]
  - @xispedocs/core@14.7.4

## 11.3.0

### Alterações Menores

- a4eb326: Deprecate `generateManifest` option: use a route handler to export build time information

### Alterações de Patch

- 7cc9f1f: Support CommonJs usage temporarily

## 11.2.3

### Alterações de Patch

- 0a5b08c: Fix alias imports
- Updated dependencies [72dc093]
  - @xispedocs/core@14.7.1

## 11.2.2

### Alterações de Patch

- 97ed36c: Improve default settings
- Updated dependencies [97ed36c]
  - @xispedocs/core@14.7.0

## 11.2.1

### Alterações de Patch

- 3445182: Fix `include` hot-reload issues
- Updated dependencies [b71064a]
  - @xispedocs/core@14.6.4

## 11.2.0

### Alterações Menores

- bd0a140: Support reusing content with `include` tag

### Alterações de Patch

- @xispedocs/core@14.6.3

## 11.1.2

### Alterações de Patch

- fe36593: Fix global config types

## 11.1.1

### Alterações de Patch

- 164b9e6: Fix non-absolute `dir` option
- Updated dependencies [1573d63]
  - @xispedocs/core@14.1.1

## 11.1.0

### Alterações Menores

- 28a9c3c: Migrate loaders to ESM only

## 11.0.0

### Alterações Principais

- e094284: **Require XispeDocs v14**

### Alterações de Patch

- @xispedocs/core@14.0.1

## 10.1.0

### Alterações Menores

- 5cef1f1: Move `dir` option from `defineDocs`
- e1ee822: Support hast nodes in `toc` variable
- df9e0e1: Support `async` output mode

### Alterações de Patch

- 9a964ca: expose `start` function from loader
- e612f2a: Make compatible with Next.js 15
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

## 10.0.2

### Alterações de Patch

- f21c871: Change cache path of manifest files
- Updated dependencies [78e59e7]
  - @xispedocs/core@13.4.8

## 10.0.1

### Alterações de Patch

- 7e23388: Fix windows compatibility
  - @xispedocs/core@13.4.5

## 10.0.0

### Alterações Principais

- ed83d01: **Support declarative collections**

  **why:** This allows XispeDocs MDX to be more flexible.

  **migrate:**

  You don't need `exports` anymore, properties are merged into one object by default.

  ```diff
  - page.data.exports.toc
  + page.data.toc

  - page.data.exports.default
  + page.data.body
  ```

  A `source.config.ts` is now required.

  ```ts
  import { defineDocs, defineConfig } from '@xispedocs/mdx/config';

  export const { docs, meta } = defineDocs();

  export default defineConfig();
  ```

  The `mdx-components.tsx` file is no longer used, pass MDX components to body instead.

  Search indexes API is now replaced by Manifest API.

  Please refer to the docs for further details.

### Alterações de Patch

- 0c251e5: Bump deps
- Updated dependencies [7dabbc1]
- Updated dependencies [0c251e5]
- Updated dependencies [3b56170]
  - @xispedocs/core@13.4.2

## 9.0.4

### Alterações de Patch

- 95dbba1: Support passing remark structure options
- Updated dependencies [95dbba1]
  - @xispedocs/core@13.4.1

## 9.0.3

### Alterações de Patch

- c0d1faf: Store additional `_data` to search indexes
  - @xispedocs/core@13.4.0

## 9.0.2

### Alterações de Patch

- 61b91fa: Improve XispeDocs OpenAPI support
- Updated dependencies [36b771b]
- Updated dependencies [61b91fa]
  - @xispedocs/core@13.2.2

## 9.0.1

### Alterações de Patch

- c7aa090: Improve XispeDocs OpenAPI support
- Updated dependencies [17fa173]
  - @xispedocs/core@13.2.1

## 9.0.0

### Alterações Principais

- 1f1989e: Support XispeDocs v13

### Alterações de Patch

- @xispedocs/core@13.0.1

## 8.2.34

### Alterações de Patch

- c2d956b: Support mirror pages for symlinks of MDX file
  - @xispedocs/core@12.5.3

## 8.2.33

### Alterações de Patch

- 78acd55: Use full mode on docs pages by default on OpenAPI generated pages
  - @xispedocs/core@12.2.1

## 8.2.32

### Alterações de Patch

- 2eb68c8: Force a release of content sources
  - @xispedocs/core@12.0.7

## 8.2.31

### Alterações de Patch

- 310e0ab: Move `@xispedocs/core` to peer dependency
- Updated dependencies [053609d]
  - @xispedocs/core@12.0.3

## 8.2.30

### Alterações de Patch

- @xispedocs/core@12.0.2

## 8.2.29

### Alterações de Patch

- @xispedocs/core@12.0.1

## 8.2.28

### Alterações de Patch

- Updated dependencies [98430e9]
- Updated dependencies [d88dfa6]
- Updated dependencies [ba20694]
- Updated dependencies [57eb762]
  - @xispedocs/core@12.0.0

## 8.2.27

### Alterações de Patch

- Updated dependencies [1b8e12b]
  - @xispedocs/core@11.3.2

## 8.2.26

### Alterações de Patch

- @xispedocs/core@11.3.1

## 8.2.25

### Alterações de Patch

- 17e162e: Add `mdx` to page extensions by default
- Updated dependencies [917d87f]
  - @xispedocs/core@11.3.0

## 8.2.24

### Alterações de Patch

- @xispedocs/core@11.2.2

## 8.2.23

### Alterações de Patch

- @xispedocs/core@11.2.1

## 8.2.22

### Alterações de Patch

- @xispedocs/core@11.2.0

## 8.2.21

### Alterações de Patch

- 66a100d: Improve error messages
- Updated dependencies [88008b1]
- Updated dependencies [944541a]
- Updated dependencies [07a9312]
  - @xispedocs/core@11.1.3

## 8.2.20

### Alterações de Patch

- @xispedocs/core@11.1.2

## 8.2.19

### Alterações de Patch

- 8ef2b68: Bump deps
- Updated dependencies [8ef2b68]
- Updated dependencies [26f464d]
- Updated dependencies [26f464d]
  - @xispedocs/core@11.1.1

## 8.2.18

### Alterações de Patch

- @xispedocs/core@11.1.0

## 8.2.17

### Alterações de Patch

- Updated dependencies [98258b5]
  - @xispedocs/core@11.0.8

## 8.2.16

### Alterações de Patch

- Updated dependencies [f7c2c5c]
  - @xispedocs/core@11.0.7

## 8.2.15

### Alterações de Patch

- 5653d5d: Support customising heading id in headings
- 5653d5d: Support custom heading slugger
- Updated dependencies [5653d5d]
- Updated dependencies [5653d5d]
  - @xispedocs/core@11.0.6

## 8.2.14

### Alterações de Patch

- @xispedocs/core@11.0.5

## 8.2.13

### Alterações de Patch

- 7b61b2f: Migrate `@xispedocs/ui` to fully ESM, adding support for ESM `tailwind.config` file
- Updated dependencies [7b61b2f]
  - @xispedocs/core@11.0.4

## 8.2.12

### Alterações de Patch

- @xispedocs/core@11.0.3

## 8.2.11

### Alterações de Patch

- @xispedocs/core@11.0.2

## 8.2.10

### Alterações de Patch

- @xispedocs/core@11.0.1

## 8.2.9

### Alterações de Patch

- Updated dependencies [2d8df75]
- Updated dependencies [92cb12f]
- Updated dependencies [f75287d]
- Updated dependencies [2d8df75]
  - @xispedocs/core@11.0.0

## 8.2.8

### Alterações de Patch

- Updated dependencies [bbad52f]
  - @xispedocs/core@10.1.3

## 8.2.7

### Alterações de Patch

- @xispedocs/core@10.1.2

## 8.2.6

### Alterações de Patch

- Updated dependencies [779c599]
- Updated dependencies [0c01300]
- Updated dependencies [779c599]
  - @xispedocs/core@10.1.1

## 8.2.5

### Alterações de Patch

- @xispedocs/core@10.1.0

## 8.2.4

### Alterações de Patch

- e47c62f: Support customising included files in the map file
- Updated dependencies [e47c62f]
  - @xispedocs/core@10.0.5

## 8.2.3

### Alterações de Patch

- @xispedocs/core@10.0.4

## 8.2.2

### Alterações de Patch

- Updated dependencies [6f321e5]
  - @xispedocs/core@10.0.3

## 8.2.1

### Alterações de Patch

- Updated dependencies [10e099a]
  - @xispedocs/core@10.0.2

## 8.2.0

### Alterações Menores

- 01155f5: Support generate search indexes in build time

### Alterações de Patch

- Updated dependencies [c9b7763]
- Updated dependencies [0e78dc8]
- Updated dependencies [d8483a8]
  - @xispedocs/core@10.0.1

## 8.1.1

### Alterações de Patch

- Updated dependencies [b5d16938]
- Updated dependencies [321d1e1f]
  - @xispedocs/core@10.0.0

## 8.1.0

### Alterações Menores

- 1c388ca5: Support `defaultOpen` for folder nodes

### Alterações de Patch

- Updated dependencies [909b0e35]
- Updated dependencies [691f12aa]
- Updated dependencies [1c388ca5]
  - @xispedocs/core@9.1.0

## 8.0.5

### Alterações de Patch

- @xispedocs/core@9.0.0

## 8.0.4

### Alterações de Patch

- @xispedocs/core@8.3.0

## 8.0.3

### Alterações de Patch

- 9bf5adb: Replace await imports with normal imports
- Updated dependencies [5c24659]
  - @xispedocs/core@8.2.0

## 8.0.2

### Alterações de Patch

- @xispedocs/core@8.1.1

## 8.0.1

### Alterações de Patch

- 6c5a39a: Rename Git repository to `ramonxp`
- Updated dependencies [6c5a39a]
- Updated dependencies [eb028b4]
- Updated dependencies [054ec60]
  - @xispedocs/core@8.1.0

## 8.0.0

### Alterações Principais

- 1a346a1: **Enable `remark-image` plugin by default**

  You can add image embeds easily. They will be converted to static image imports.

  ```mdx
  ![banner](/image.png)
  ```

  Become:

  ```mdx
  import img_banner from '../../public/image.png';

  <img alt="banner" src={img_banner} />
  ```

- 2b11c20: **Rename to XispeDocs**

  `next-docs-zeta` -> `@xispedocs/core`

  `next-docs-ui` -> `@xispedocs/ui`

  `next-docs-mdx` -> `@xispedocs/mdx`

  `@ramonxp/openapi` -> `@xispedocs/openapi`

  `create-next-docs-app` -> `create-xispedocs-app`

### Alterações de Patch

- Updated dependencies [2ea9437]
- Updated dependencies [cdff313]
- Updated dependencies [1a346a1]
- Updated dependencies [2b11c20]
  - @xispedocs/core@8.0.0

## 7.1.2

### Alterações de Patch

- next-docs-zeta@7.1.2

## 7.1.1

### Alterações de Patch

- next-docs-zeta@7.1.1

## 7.1.0

### Alterações de Patch

- next-docs-zeta@7.1.0

## 7.0.0

### Alterações Principais

- 9929c5b: **Prefer `.map.ts` instead of `_map.ts`**

  Unless you have especially configured, now it uses `.map.ts` by default.

  ```diff
  - import map from "@/_map"
  + import map from "@/.map"
  ```

- 9929c5b: **Migrate to Source API**

  `fromMap` has been removed. Please use `createMDXSource` instead.

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

### Alterações Menores

- 8fd769f: **Support last modified timestamp for Git**

  Enable this in `next.config.mjs`:

  ```js
  const withNextDocs = createNextDocs({
    mdxOptions: {
      lastModifiedTime: 'git',
    },
  });
  ```

  Access it via `page.data.exports.lastModified`.

### Alterações de Patch

- Updated dependencies [9929c5b]
- Updated dependencies [9929c5b]
- Updated dependencies [49201be]
- Updated dependencies [338ea98]
- Updated dependencies [4c1334e]
- Updated dependencies [9929c5b]
  - next-docs-zeta@7.0.0

## 6.1.0

### Alterações de Patch

- Updated dependencies [f39ae40]
  - next-docs-zeta@6.1.0

## 6.0.2

### Alterações de Patch

- 1845bf5: Fixes import path for next-docs-mdx/loader-mdx
  - next-docs-zeta@6.0.2

## 6.0.1

### Alterações de Patch

- next-docs-zeta@6.0.1

## 6.0.0

### Alterações Principais

- 69f8abf: **Make file paths relative to `rootDir` when resolving files**

  For a more simplified usage, the resolved file paths will be relative to `rootDir`.

  You can now generate slugs automatically depending on the root directory you have configured.

  ```ts
  const utils = fromMap(map, {
    rootDir: 'ui',
    schema: {
      frontmatter: frontmatterSchema,
    },
  });
  ```

  The configuration above will generate `/hello` slugs for a file named `/content/ui/hello.mdx`, while the previous one generates `/ui/hello`.

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

- 1c187b9: **Support intelligent schema types**

  The `validate` options is now renamed to `schema`.

  ```ts
  import { defaultSchemas, fromMap } from 'next-docs-mdx/map';

  const utils = fromMap(map, {
    rootDir: 'docs/ui',
    baseUrl: '/docs/ui',
    schema: {
      frontmatter: defaultSchemas.frontmatter.extend({
        preview: z.string().optional(),
      }),
    },
  });
  ```

  The `frontmatter` field on pages should be automatically inferred to your Zod schema type.

- 52b24a6: **Remove `/docs` from default root content path**

  Previously, the default root content path is `./content/docs`. All your documents must be placed under the root directory.

  Since this update, it is now `./content` by default. To keep the old behaviours, you may manually specify `rootContentPath`.

  ```js
  const withNextDocs = createNextDocs({
    rootContentPath: './content/docs',
  });
  ```

  **Notice that due to this change, your `baseUrl` property will be `/` by default**

  ```diff
  const withNextDocs = createNextDocs({
  +  baseUrl: "/docs"
  })
  ```

- 2ff7581: **Rename configuration options**

  The options of `createNextDocs` is now renamed to be more flexible and straightforward.

  | Old             | New                                |
  | --------------- | ---------------------------------- |
  | `dataExports`   | `mdxOptions.valueToExport`         |
  | `pluginOptions` | `mdxOptions.rehypeNextDocsOptions` |

  `rehypePlugins` and `remarkPlugins` can also be a function that accepts and returns plugins.

### Alterações Menores

- 55a2321: **Use `@mdx-js/mdx` to process MDX/markdown files.**

  You no longer need `@next/loader` and `@mdx-js/loader` to be installed on your project, `next-docs-mdx` will process files with `@mdx-js/mdx` directly.

  _This change will not break most of the projects_

### Alterações de Patch

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

- Updated dependencies [a883009]
  - next-docs-zeta@4.0.9

## 4.0.8

### Alterações de Patch

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

- next-docs-zeta@4.0.5

## 4.0.4

### Alterações de Patch

- next-docs-zeta@4.0.4

## 4.0.3

### Alterações de Patch

- ba51a9f: Support custom slugs function
- 0cc10cb: Support custom build page tree options
- Updated dependencies [0cc10cb]
  - next-docs-zeta@4.0.3

## 4.0.2

### Alterações de Patch

- 347df32: Fix empty `baseUrl` unexpected behaviours
- ad7b8a8: Fully support custom root content directory paths
- 73f985a: Support `rootDir` API
  - next-docs-zeta@4.0.2

## 4.0.1

### Alterações de Patch

- 01b23e2: Support Next.js 14
- Updated dependencies [2da93d8]
- Updated dependencies [01b23e2]
  - next-docs-zeta@4.0.1

## 4.0.0

### Alterações de Patch

- Updated dependencies [6c4a782]
- Updated dependencies [6c4a782]
  - next-docs-zeta@4.0.0

## 4.0.0

### Alterações de Patch

- Updated dependencies [678cd3d]
- Updated dependencies [24245a3]
  - next-docs-zeta@4.0.0

## 3.0.0

### Alterações de Patch

- Updated dependencies [1043532]
- Updated dependencies [7a0690b]
- Updated dependencies [a4a8120]
  - next-docs-zeta@3.0.0
