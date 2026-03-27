import type { StructuredData } from '@xispedocs/core/mdx-plugins';
import type { TOCItemType } from '@xispedocs/core/toc';
import type { FC } from 'react';
import type { MDXProps } from 'mdx/types';
import type { ExtractedReference } from '@/loaders/mdx/remark-postprocess';

export interface FileInfo {
  /**
   * virtualized path for Source API
   */
  path: string;

  /**
   * the file path in file system
   */
  fullPath: string;
}

export interface DocData {
  /**
   * Compiled MDX content (as component)
   */
  body: FC<MDXProps>;

  /**
   * table of contents generated from content.
   */
  toc: TOCItemType[];

  /**
   * structured data for document search indexing.
   */
  structuredData: StructuredData;

  /**
   * Raw exports from the compiled MDX file.
   */
  _exports: Record<string, unknown>;

  /**
   * Last modified date of document file, obtained from version control.
   *
   * Only available when `lastModifiedTime` is enabled on global config.
   */
  lastModified?: Date;

  /**
   * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
   */
  extractedReferences?: ExtractedReference[];
}

export interface DocMethods {
  /**
   * file info
   */
  info: FileInfo;

  /**
   * get document as text.
   *
   * - `type: raw` - read the original content from file system.
   * - `type: processed` - get the processed Markdown content, only available when `includeProcessedMarkdown` is enabled on collection config.
   */
  getText: (type: 'raw' | 'processed') => Promise<string>;
}

export type MetaCollectionEntry<Data> = Data & {
  /**
   * file info
   */
  info: FileInfo;
};

export type DocCollectionEntry<Frontmatter> = DocData &
  DocMethods &
  Frontmatter;

export type AsyncDocCollectionEntry<Frontmatter> = DocMethods & {
  load: () => Promise<DocData>;
} & Frontmatter;


export function missingProcessedMarkdown(): never {
  throw new Error(
    "getText('processed') requires `includeProcessedMarkdown` to be enabled in your collection config.",
  );
}

export interface AnyCollectionEntry {
  info: FileInfo;
}

export interface Source<_Config = any> {
  files: any[];
}

export function createMDXSourceInternal<
  Doc extends AnyCollectionEntry,
  Meta extends AnyCollectionEntry,
>(
  docs: Doc[],
  meta: Meta[] = [],
): Source<{
  pageData: Doc;
  metaData: Meta;
}> {
  return {
    files: resolveFiles({
      docs,
      meta,
    }) as any[],
  };
}

interface ResolveOptions {
  docs: AnyCollectionEntry[];
  meta: AnyCollectionEntry[];

  rootDir?: string;
}

export function resolveFiles({ docs, meta }: ResolveOptions): any[] {
  const outputs: any[] = [];

  for (const entry of docs) {
    outputs.push({
      type: 'page',
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry as any,
    });
  }

  for (const entry of meta) {
    outputs.push({
      type: 'meta',
      absolutePath: entry.info.fullPath,
      path: entry.info.path,
      data: entry as any,
    });
  }

  return outputs;
}
