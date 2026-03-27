# @xispedocs/twoslash

## 3.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/ui@2.3.0

## 2.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/ui@2.2.0

## 1.1.1

### Patch Changes

- Alinhamento de peerDependencies com fumadocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.
- Updated dependencies
  - @xispedocs/ui@2.1.1

## 1.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

### Patch Changes

- Updated dependencies
  - @xispedocs/ui@2.1.0

## 3.1.8

### Alterações de Patch

- a3a14e7: Bump deps
- Updated dependencies [a3a14e7]
- Updated dependencies [7b0d839]
  - @xispedocs/ui@15.8.3

## 3.1.7

### Alterações de Patch

- a76d244: Fix breaking types change from upstream 3.12.0
- Updated dependencies [cedc494]
  - @xispedocs/ui@15.7.5

## 3.1.6

### Alterações de Patch

- 51e6687: Fix popup container styles
- Updated dependencies [6de6ff3]
- Updated dependencies [f0b1fee]
  - @xispedocs/ui@15.6.11

## 3.1.5

### Alterações de Patch

- c6153d4: Improve rendered result

## 3.1.4

### Alterações de Patch

- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos
- Updated dependencies [b675728]
- Updated dependencies [1b7bc4b]
- Updated dependencies [82fc4c8]
  - @xispedocs/ui@15.5.2

## 3.1.3

### Alterações de Patch

- 721c927: Lazy load twoslasher
- 3372792: Support line numbers in codeblock
- Updated dependencies [3372792]
  - @xispedocs/ui@15.3.1

## 3.1.2

### Alterações de Patch

- 81fe2c2: Remove the need for placeholder lines
- Updated dependencies [52b5ad8]
- Updated dependencies [abce713]
  - @xispedocs/ui@15.3.0

## 3.1.1

### Alterações de Patch

- 085e39f: Fix inline code issues
- Updated dependencies [eb18da9]
- Updated dependencies [085e39f]
- Updated dependencies [4d50bcf]
  - @xispedocs/ui@15.2.7

## 3.1.0

### Alterações Menores

- b49d236: Support `typesCache` option and `@xispedocs/twoslash/cache-fs` similar to Vitepress

### Alterações de Patch

- Updated dependencies [6bc033a]
  - @xispedocs/ui@15.0.14

## 3.0.1

### Alterações de Patch

- 0f59dfc: Update peer deps
- Updated dependencies [7608f4e]
- Updated dependencies [89ff3ae]
- Updated dependencies [16c8944]
  - @xispedocs/ui@15.0.13

## 3.0.0

### Alterações Principais

- a89d6e0: Require XispeDocs v15 & Tailwind CSS v4

### Alterações de Patch

- Updated dependencies [a89d6e0]
- Updated dependencies [a84f37a]
- Updated dependencies [f2f9c3d]
  - @xispedocs/ui@15.0.0

## 2.0.3

### Alterações de Patch

- b9601fb: Update Shiki
  - @xispedocs/ui@14.7.6

## 2.0.2

### Alterações de Patch

- 9585561: Fix Twoslash popups focus outline
- 4766292: Support React 19
- Updated dependencies [010da9e]
- Updated dependencies [bebb16b]
- Updated dependencies [9585561]
- Updated dependencies [4766292]
  - @xispedocs/ui@14.6.0

## 2.0.1

### Alterações de Patch

- d6d290c: Upgrade Shiki
  - @xispedocs/ui@14.1.0

## 2.0.0

### Alterações Principais

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

### Alterações de Patch

- be820c4: Bump deps
- Updated dependencies [34cf456]
- Updated dependencies [d9e908e]
- Updated dependencies [f949520]
- Updated dependencies [ad47fd8]
- Updated dependencies [d9e908e]
- Updated dependencies [367f4c3]
- Updated dependencies [87063eb]
- Updated dependencies [64f0653]
- Updated dependencies [e1ee822]
- Updated dependencies [d9e908e]
- Updated dependencies [d9e908e]
- Updated dependencies [e612f2a]
- Updated dependencies [3d0369a]
- Updated dependencies [9a10262]
- Updated dependencies [d9e908e]
- Updated dependencies [3d054a8]
- Updated dependencies [d9e908e]
- Updated dependencies [be820c4]
- Updated dependencies [be53a0e]
  - @xispedocs/ui@14.0.0

## 1.1.3

### Alterações de Patch

- 0c251e5: Bump deps
- Updated dependencies [0c251e5]
- Updated dependencies [0c251e5]
- Updated dependencies [0c251e5]
  - @xispedocs/ui@13.4.2

## 1.1.2

### Alterações de Patch

- 2cc477f: Fix meta field inherited to child code blocks
- Updated dependencies [8f5b19e]
- Updated dependencies [32ca37a]
- Updated dependencies [9aae448]
- Updated dependencies [c542561]
  - @xispedocs/ui@13.3.0

## 1.1.1

### Alterações de Patch

- 6ed95ea: Fix compatibility issues with XispeDocs UI v13
- Updated dependencies [89190ae]
- Updated dependencies [b02eebf]
- Updated dependencies [f868018]
- Updated dependencies [8aebeab]
- Updated dependencies [c684c00]
- Updated dependencies [8aebeab]
- Updated dependencies [0377bb4]
- Updated dependencies [e8e6a17]
- Updated dependencies [c8964d3]
- Updated dependencies [c901e6b]
- Updated dependencies [daa7d3c]
- Updated dependencies [89190ae]
- Updated dependencies [b02eebf]
- Updated dependencies [4373231]
  - @xispedocs/ui@13.0.0

## 1.1.0

### Alterações Menores

- 5f86faa: Improve multi-line code blocks

## 1.0.3

### Alterações de Patch

- 8ef2b68: Bump deps

## 1.0.2

### Alterações de Patch

- 08e4904: Update types

## 1.0.1

### Alterações de Patch

- c71b7e3: Ignore injected elements when copying code
