import type { CloudManager } from '@oramacloud/client';
import type { OramaCloud } from '@orama/core';
import type { StructuredData } from '../mdx-plugins';

export interface SyncOptions {
  /**
   * Index name to sync
   */
  index: string;

  documents: OramaDocument[];

  /**
   * Deploy changes
   *
   * @defaultValue true
   */
  autoDeploy?: boolean;
}

export type I18nSyncOptions = Omit<SyncOptions, 'index' | 'documents'> & {
  /**
   * Indexes to sync.
   *
   * Pairs of `locale`-`index`.
   **/
  indexes: Record<string, string>;

  documents: {
    locale: string;
    items: OramaDocument[];
  }[];
};

export interface OramaDocument {
  /**
   * The ID of document, must be unique
   */
  id: string;

  title: string;
  description?: string;

  /**
   * URL to the page
   */
  url: string;
  structured: StructuredData;

  /**
   * Tag to filter results
   */
  tag?: string;

  /**
   * Data to be added to each section index
   */
  extra_data?: object;
  breadcrumbs?: string[];
}

export interface OramaIndex {
  id: string;

  title: string;
  url: string;

  tag?: string;

  /**
   * The id of page, used for `group by`
   */
  page_id: string;

  /**
   * Heading content
   */
  section?: string;

  breadcrumbs?: string[];

  /**
   * Heading (anchor) id
   */
  section_id?: string;

  content: string;
}

export async function sync(
  client: CloudManager | OramaCloud,
  options: SyncOptions,
): Promise<void> {
  const { autoDeploy = true } = options;

  if ('index' in client && typeof client.index === 'function') {
    const index = client.index(options.index);
    await index.snapshot(options.documents.flatMap(toIndex));
    if (autoDeploy) await index.deploy();
  } else {
    // New SDK (@orama/core)
    // Use temporary index to simulate snapshot (full replacement)
    const orama = client as OramaCloud;
    const ds = orama.dataSource(options.index);
    const tempDs = await ds.createTemporaryIndex();

    // Insert documents into temporary index
    const indexedDocs = options.documents.flatMap(toIndex);

    // Orama Cloud has a limit on batch size, but insertDocuments handles it or we should chunk?
    // Based on SDK, it seems to handle it or we can pass the whole array.
    await tempDs.insertDocuments(indexedDocs as any[]);

    // Swap temporary index with the production one
    if (autoDeploy) {
      await tempDs.swap();
    }
  }
}

export async function syncI18n(
  client: CloudManager | OramaCloud,
  options: I18nSyncOptions,
): Promise<void> {
  const tasks = options.documents.map(async (document) => {
    await sync(client, {
      ...options,
      index: options.indexes[document.locale],
      documents: document.items,
    });
  });

  await Promise.all(tasks);
}

export function toIndex(page: OramaDocument): OramaIndex[] {
  let id = 0;
  const indexes: OramaIndex[] = [];
  const scannedHeadings = new Set<string>();

  function createIndex(
    section: string | undefined,
    sectionId: string | undefined,
    content: string,
  ): OramaIndex {
    return {
      id: `${page.id}-${(id++).toString()}`,
      title: page.title,
      url: page.url,
      page_id: page.id,
      tag: page.tag,
      section,
      section_id: sectionId,
      content,
      breadcrumbs: page.breadcrumbs,
      ...page.extra_data,
    };
  }

  if (page.description)
    indexes.push(createIndex(undefined, undefined, page.description));

  page.structured.contents.forEach((p) => {
    const heading = p.heading
      ? page.structured.headings.find((h) => p.heading === h.id)
      : null;

    const index = createIndex(heading?.content, heading?.id, p.content);

    if (heading && !scannedHeadings.has(heading.id)) {
      scannedHeadings.add(heading.id);

      indexes.push(createIndex(heading.content, heading.id, heading.content));
    }

    indexes.push(index);
  });

  return indexes;
}
