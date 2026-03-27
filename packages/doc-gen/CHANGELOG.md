# @xispedocs/docgen

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

## 3.0.2

### Alterações de Patch

- a3a14e7: Bump deps
- Updated dependencies [a3a14e7]
  - @xispedocs/core@15.8.3

## 3.0.1

### Alterações de Patch

- 655bb46: Support custom `defaultValue` for `remark-ts2js`
- Updated dependencies [655bb46]
- Updated dependencies [d1ae3e8]
- Updated dependencies [6548a59]
- Updated dependencies [51268ec]
- Updated dependencies [51268ec]
  - @xispedocs/core@15.8.0

## 3.0.0

### Alterações Principais

- b4474cf: `remarkTypeScriptToJavaScript` now output new `<CodeBlockTabs />` syntax, drop `Tab` and `Tabs` options
- b4474cf: Make `@xispedocs/core` a required peer dep (and must be `^15.7.2`)

### Alterações Menores

- b4474cf: [`remarkTypeScriptToJavaScript`] Support overriding output codeblock's meta string

### Alterações de Patch

- Updated dependencies [88b5a4e]
- Updated dependencies [039b24b]
- Updated dependencies [08eee2b]
  - @xispedocs/core@15.7.2

## 2.1.0

### Alterações Menores

- d0f8a15: Enable `remarkNpm` by default, replace `remarkInstall` with it.
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

## 2.0.1

### Alterações de Patch

- 1b7bc4b: Add `@types/react` to optional peer dependency to avoid version conflict in monorepos

## 2.0.0

### Alterações Principais

- 4642a86: **Remove `typescriptGenerator` from `@xispedocs/docgen`**

  **why:** Move dedicated parts to `@xispedocs/typescript`, so all docs generation features for TypeScript can be put together in a single module.

  **migrate:** Use `@xispedocs/typescript` We made a new `remarkAutoTypeTable` remark plugin generating the type table but with a different syntax:

  ```mdx
  <auto-type-table path="./my-file.ts" name="MyInterface" />
  ```

  Instead of:

  ````mdx
  ```json doc-gen:typescript
  {
    "file": "./my-file.ts",
    "name": "MyInterface"
  }
  ```
  ````

- 4642a86: **Move `remarkTypeScriptToJavaScript` plugin to `@xispedocs/docgen/remark-ts2js`.**

  **why:** Fix existing problems with `oxc-transform`.

  **migrate:**

  Import it like:

  ```ts
  import { remarkTypeScriptToJavaScript } from '@xispedocs/docgen/remark-ts2js';
  ```

  instead of importing from `@xispedocs/docgen`.

## 1.3.8

### Alterações de Patch

- Updated dependencies [7608f4e]
  - @xispedocs/typescript@3.0.4

## 1.3.7

### Alterações de Patch

- 260128f: Add `remarkShow` plugin
  - @xispedocs/typescript@3.0.3

## 1.3.6

### Alterações de Patch

- a8e9e1f: Bump deps
  - @xispedocs/typescript@3.0.3

## 1.3.5

### Alterações de Patch

- b9601fb: Update Shiki
- Updated dependencies [b9601fb]
  - @xispedocs/typescript@3.0.3

## 1.3.4

### Alterações de Patch

- 6d3c7d2: Use `oxc` for `ts2js` remark plugins
  - @xispedocs/typescript@3.0.2

## 1.3.3

### Alterações de Patch

- 4ab0de6: Support TS2JS remark plugin [experimental]
  - @xispedocs/typescript@3.0.2

## 1.3.2

### Alterações de Patch

- Updated dependencies [c042eb7]
  - @xispedocs/typescript@3.0.2

## 1.3.1

### Alterações de Patch

- Updated dependencies [d6d290c]
  - @xispedocs/typescript@3.0.1

## 1.3.0

### Alterações Menores

- f9adba6: Support inline type syntax in `AutoTypeTable` `type` prop

### Alterações de Patch

- be820c4: Bump deps
- Updated dependencies [f9adba6]
- Updated dependencies [f9adba6]
- Updated dependencies [f9adba6]
- Updated dependencies [be820c4]
  - @xispedocs/typescript@3.0.0

## 1.2.0

### Alterações Menores

- 3a2c837: Improve caching

### Alterações de Patch

- 0c251e5: Bump deps
- Updated dependencies [0c251e5]
- Updated dependencies [3a2c837]
  - @xispedocs/typescript@2.1.0

## 1.1.0

### Alterações Menores

- 979896f: Support generating Tabs with `persist` enabled (XispeDocs UI only)

### Alterações de Patch

- @xispedocs/typescript@2.0.1

## 1.0.2

### Alterações de Patch

- 8ef2b68: Bump deps
- Updated dependencies [8ef2b68]
  - @xispedocs/typescript@2.0.1

## 1.0.1

### Alterações de Patch

- Updated dependencies [f75287d]
  - @xispedocs/typescript@2.0.0
