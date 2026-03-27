# @xispedocs/mdx-remote

## 3.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.3.0

## 2.0.0

### Patch Changes

- @xispedocs/core@2.2.0

## 1.1.1

### Patch Changes

- Alinhamento de peerDependencies com fumadocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.
- Updated dependencies
  - @xispedocs/core@2.1.1

## 1.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.1.0

## 1.4.2

### Alterações de Patch

- b867d07: Support customise scope variables

## 1.4.1

### Alterações de Patch

- a3a14e7: Bump deps
- Updated dependencies [a3a14e7]
  - @xispedocs/core@15.8.3

## 1.4.0

### Alterações Menores

- f8a58c6: Support `preset: minimal` to disable XispeDocs specific defaults

### Alterações de Patch

- Updated dependencies [658fa96]
  - @xispedocs/core@15.6.5

## 1.3.4

### Alterações de Patch

- d0f8a15: Enable `remarkNpm` by default, replace `remarkInstall` with it.
- Updated dependencies [d0f8a15]
- Updated dependencies [84918b8]
- Updated dependencies [f8d1709]
  - @xispedocs/core@15.6.0

## 1.3.3

### Alterações de Patch

- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos
- Updated dependencies [7a45921]
- Updated dependencies [1b7bc4b]
  - @xispedocs/core@15.5.2

## 1.3.2

### Alterações de Patch

- a6c909b: Removed unused devDependencies and migrated from `fast-glob` to `tinyglobby`
  - @xispedocs/core@15.3.4

## 1.3.1

### Alterações de Patch

- 4ae7b4a: Support MDX in codeblock tab value
- Updated dependencies [4ae7b4a]
  - @xispedocs/core@15.3.3

## 1.3.0

### Alterações Menores

- 363055d: Support `/client` API for browser usage
- cf87f9d: Support `compiler.compileFile`, deprecate `skipRender` option in favour of this
- cf87f9d: Deprecate `executeMdx` in favour of `compiler.render`

### Alterações de Patch

- Updated dependencies [2fd325c]
- Updated dependencies [a7cf4fa]
  - @xispedocs/core@15.2.0

## 1.2.1

### Alterações de Patch

- 6493817: Load plugins conditionally for current XispeDocs version
- Updated dependencies [c5add28]
- Updated dependencies [f3cde4f]
- Updated dependencies [7c8a690]
- Updated dependencies [b812457]
  - @xispedocs/core@15.1.1

## 1.2.0

### Alterações Menores

- 69f20cb: Remove `content` property from the output of `compile`

### Alterações de Patch

- @xispedocs/core@15.0.3

## 1.1.3

### Alterações de Patch

- a89d6e0: Support XispeDocs v15
- Updated dependencies [5b8cca8]
- Updated dependencies [a763058]
- Updated dependencies [581f4a5]
  - @xispedocs/core@15.0.0

## 1.1.2

### Alterações de Patch

- 3bde5cc: Support JSX nodes in TOC
  - @xispedocs/core@14.7.7

## 1.1.1

### Alterações de Patch

- b9601fb: Update Shiki
- 1142b8c: Support `createCompiler` API
- Updated dependencies [b9601fb]
  - @xispedocs/core@14.7.6

## 1.1.0

### Alterações Menores

- f2e880f: Deprecate `content`, prefer `body` instead

### Alterações de Patch

- f2e880f: Support more options for `compile()`
- Updated dependencies [777188b]
  - @xispedocs/core@14.7.5

## 1.0.0

### Alterações Principais

- 82ff9ec: **Remove GitHub remote integration**

  **why:** It should be equivalent to `next-mdx-remote` but include extra functionalities by XispeDocs, like built-in MDX plugins, table of contents and frontmatter parsing.

  **migrate:** Implement your own content source, or see our Sanity/BaseHub examples for CMS usages.

## 0.2.4

### Alterações de Patch

- 4766292: Support React 19
- Updated dependencies [4dfde6b]
- Updated dependencies [bebb16b]
- Updated dependencies [4766292]
- Updated dependencies [050b326]
  - @xispedocs/core@14.6.0

## 0.2.3

### Alterações de Patch

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

## 0.2.2

### Alterações de Patch

- 0c251e5: Bump deps
- Updated dependencies [7dabbc1]
- Updated dependencies [0c251e5]
- Updated dependencies [3b56170]
  - @xispedocs/core@13.4.2

## 0.2.1

### Alterações de Patch

- 758013f: Use XispeDocs Remark Image instead of `rehype-img-size`
- Updated dependencies [36b771b]
- Updated dependencies [61b91fa]
  - @xispedocs/core@13.2.2

## 0.2.0

### Alterações Menores

- e6e1d9f: Improve Hot Reload

### Alterações de Patch

- @xispedocs/core@12.4.1

## 0.1.0

### Alterações Menores

- ca7d0f4: Support built-in search index build utility

### Alterações de Patch

- Updated dependencies [ca7d0f4]
  - @xispedocs/core@12.3.2

## 0.0.2

### Alterações de Patch

- a39dbcb: Support Github Integration
- Updated dependencies [a39dbcb]
  - @xispedocs/core@12.1.1

## 0.0.1

### Alterações de Patch

- e7f4edf: Support remote MDX files with `@ramonxp/remote-mdx`
  - @xispedocs/core@12.0.7
