# @xispedocs/typescript

## 3.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.3.0
  - @xispedocs/ui@2.3.0

## 2.0.0

### Patch Changes

- Updated dependencies
  - @xispedocs/ui@2.2.0
  - @xispedocs/core@2.2.0

## 1.1.1

### Patch Changes

- Alinhamento de peerDependencies com fumadocs: Next.js 16.x.x, zod 4.x.x, flexsearch, @mdx-js/mdx, @orama/core e Waku v1 como peers opcionais.
- Updated dependencies
  - @xispedocs/core@2.1.1
  - @xispedocs/ui@2.1.1

## 1.1.0

### Minor Changes

- Normalização de metadados e peerDependencies para suporte ao Next.js 16 e versões v2 do core/ui.

### Patch Changes

- Updated dependencies
  - @xispedocs/core@2.1.0
  - @xispedocs/ui@2.1.0

## 4.0.11

### Alterações de Patch

- a3a14e7: Bump deps
- Updated dependencies [a3a14e7]
- Updated dependencies [7b0d839]
  - @xispedocs/core@15.8.3
  - @xispedocs/ui@15.8.3

## 4.0.10

### Alterações de Patch

- e0cfcdc: Improve simple type generation
- Updated dependencies [90cf1fe]
- Updated dependencies [ad9a004]
- Updated dependencies [90cf1fe]
- Updated dependencies [6c3bde5]
- Updated dependencies [747bdbc]
  - @xispedocs/ui@15.8.2
  - @xispedocs/core@15.8.2

## 4.0.9

### Alterações de Patch

- 43cbf32: Fix `@remarks` used for full instead of simplified type form
- Updated dependencies [655bb46]
- Updated dependencies [53a0635]
- Updated dependencies [d1ae3e8]
- Updated dependencies [6548a59]
- Updated dependencies [51268ec]
- Updated dependencies [51268ec]
  - @xispedocs/core@15.8.0
  - @xispedocs/ui@15.8.0

## 4.0.8

### Alterações de Patch

- 0d55667: Enforce `peerDeps` on XispeDocs deps
- Updated dependencies [c948f59]
  - @xispedocs/core@15.7.10
  - @xispedocs/ui@15.7.10

## 4.0.7

### Alterações de Patch

- 45c7531: Type Table: Support displaying parameters & return types
- 4082acc: Redesign Type Table

## 4.0.6

### Alterações de Patch

- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos

## 4.0.5

### Alterações de Patch

- a6c909b: Removed unused devDependencies and migrated from `fast-glob` to `tinyglobby`

## 4.0.4

### Alterações de Patch

- 6b04eed: Fix errors on special keys
- a1f3273: Lazy load compiler instance

## 4.0.3

### Alterações de Patch

- 3a5595a: Support deprecated properties in Type Table

## 4.0.2

### Alterações de Patch

- 38117c1: add `null | undefined` to optional props in a object type

## 4.0.1

### Alterações de Patch

- f67d20f: Fix `remark-auto-type-table` doesn't render `required` property

## 4.0.0

### Alterações Principais

- b83d946: **Use `createGenerator` API**

  Create a generator instance:

  ```ts
  import { createGenerator } from '@xispedocs/typescript';

  const generator = createGenerator(tsconfig);
  ```

  Refactor:

  ```tsx
  import { remarkAutoTypeTable, createTypeTable } from '@xispedocs/typescript';

  generateDocumentation('./file.ts', 'MyClass', fs.readFileSync('./file.ts').toString())
  generateMDX('content', {...})
  generateFiles({...})
  const processor = createProcessor({
      remarkPlugins: [remarkAutoTypeTable],
  });

  const AutoTypeTable = createTypeTable()
  return <AutoTypeTable {...props} />
  ```

  To:

  ```tsx
  import { AutoTypeTable, remarkAutoTypeTable } from "@xispedocs/typescript";

  generator.generateDocumentation({path: './file.ts'}, 'MyClass')
  generateMDX(generator, 'content', { ... })
  generateFiles(generator, { ... })
  const processor = createProcessor({
      remarkPlugins: [
          [remarkAutoTypeTable, { generator }],
      ],
  });

  return <AutoTypeTable generator={generator} {...props} />
  ```

  This ensure the compiler instance is always re-used.

## 3.1.0

### Alterações Menores

- 42d68a6: Support `remarkAutoTypeTable` plugin, deprecate MDX generator in favour of new remark plugin

### Alterações de Patch

- 5d0dd11: Support overriding `renderMarkdown` function

## 3.0.4

### Alterações de Patch

- 7608f4e: Support showing optional properties on TypeTable

## 3.0.3

### Alterações de Patch

- b9601fb: Update Shiki

## 3.0.2

### Alterações de Patch

- c042eb7: Fix private class members

## 3.0.1

### Alterações de Patch

- d6d290c: Upgrade Shiki

## 3.0.0

### Alterações Principais

- f9adba6: Return an array of doc entry in `generateDocumentation`

### Alterações Menores

- f9adba6: Support inline type syntax in `AutoTypeTable` `type` prop
- f9adba6: Support `createTypeTable` for shared project instance

### Alterações de Patch

- be820c4: Bump deps

## 2.1.0

### Alterações Menores

- 3a2c837: Disable cache on program-level

### Alterações de Patch

- 0c251e5: Bump deps

## 2.0.1

### Alterações de Patch

- 8ef2b68: Bump deps

## 2.0.0

### Alterações Principais

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

## 1.0.2

### Alterações de Patch

- 77b5b70: Fix compatibility problems with Typescript 5.4.3

## 1.0.1

### Alterações de Patch

- f4aa6b6: Ignore fields marked with `@internal` tag

## 1.0.0

### Alterações Principais

- 321d1e1f: Support markdown in type description

### Alterações Menores

- 722c2d6e: Support generating MDX files
