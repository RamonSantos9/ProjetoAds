import type { DocCollection, DocsCollection, MetaCollection } from '@/config';
import { toImportPath } from '@/utils/import-formatter';
import { generateGlob, getGlobBase } from '@/vite/generate-glob';
import type { LoadedConfig } from '@/loaders/config';
import { getGlobPatterns } from '@/utils/collections';

function docs(name: string, collection: DocsCollection) {
  return `create.docs("${name}", ${doc(name, collection.docs)}, ${meta(name, collection.meta)})`;
}

function doc(name: string, collection: DocCollection) {
  const patterns = getGlobPatterns(collection);
  const base = getGlobBase(collection);
  const docGlob = generateGlob(name, patterns, {
    base,
  });

  if (collection.async) {
    const headBlob = generateGlob(name, patterns, {
      query: {
        only: 'frontmatter',
      },
      import: 'frontmatter',
      base,
    });

    return `create.docLazy("${name}", "${base}", ${headBlob}, ${docGlob})`;
  }

  return `create.doc("${name}", "${base}", ${docGlob})`;
}

function meta(name: string, collection: MetaCollection) {
  const patterns = getGlobPatterns(collection);
  const base = getGlobBase(collection);

  return `create.meta("${name}", "${base}", ${generateGlob(name, patterns, {
    import: 'default',
    base,
  })})`;
}

export function entry(
  configPath: string,
  config: LoadedConfig,
  outDir: string,
  jsExtension?: boolean,
) {
  const lines = [
    '/// <reference types="vite/client" />',
    `import { fromConfig } from '@xispedocs/mdx/runtime/vite';`,
    `import type * as Config from '${toImportPath(configPath, {
      relativeTo: outDir,
      jsExtension,
    })}';`,
    '',
    `export const create = fromConfig<typeof Config>();`,
  ];

  for (const [name, collection] of config.collections.entries()) {
    let body: string;

    if (collection.type === 'docs') {
      body = docs(name, collection);
    } else if (collection.type === 'meta') {
      body = meta(name, collection);
    } else {
      body = doc(name, collection);
    }

    lines.push('');
    lines.push(`export const ${name} = ${body};`);
  }

  lines.push('');
  lines.push(`export default { ${Array.from(config.collections.keys()).join(', ')} };`);

  return lines.join('\n');
}
