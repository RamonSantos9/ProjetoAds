
import type { DocOut, MetaOut, Runtime } from './types';
import type { CompiledMDXProperties } from '@/loaders/mdx/build-mdx';
import * as fs from 'node:fs/promises';
import * as shared from '../shared';

export const createMDXSource = shared.createMDXSourceInternal;
export type AnyCollectionEntry = shared.AnyCollectionEntry;

export const _runtime: Runtime = {
  doc(files) {
    return files.map((file) => {
      const data = file.data as unknown as CompiledMDXProperties;
      const filePath = file.info.fullPath;

      return {
        info: file.info,
        _exports: data as unknown as Record<string, unknown>,
        body: data.default,
        lastModified: data.lastModified,
        toc: data.toc,
        structuredData: data.structuredData,
        extractedReferences: data.extractedReferences,
        ...data.frontmatter,
        async getText(type) {
          if (type === 'raw') {
            return (await fs.readFile(filePath)).toString();
          }

          if (typeof data._markdown !== 'string') shared.missingProcessedMarkdown();
          return data._markdown;
        },
      } satisfies DocOut;
    }) as any;
  },
  meta(files) {
    return files.map((file) => {
      return {
        info: file.info,
        ...file.data,
      } satisfies MetaOut;
    }) as any;
  },
  docs(docs, metas) {
    const parsedDocs = this.doc(docs);
    const parsedMetas = this.meta(metas);

    return {
      doc: parsedDocs,
      meta: parsedMetas,
      toXispeDocsSource() {
        return shared.createMDXSourceInternal(parsedDocs, parsedMetas);
      },
    } as any;
  },
};



export * from './types';
