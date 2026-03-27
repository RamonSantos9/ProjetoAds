import type { ClientSearchParams, OramaClient } from '@oramacloud/client';
import type { OramaCloud } from '@orama/core';
import { removeUndefined } from '../../utils/remove-undefined';
import type { OramaIndex } from '../orama-cloud';
import { createContentHighlighter, type SortedResult } from '../index';

interface CrawlerIndex {
  path: string;
  title: string;
  content: string;
  section: string;
  category: string;
}

export interface OramaCloudOptions {
  client: OramaClient | OramaCloud;
  /**
   * The type of your index.
   *
   * You can set it to `crawler` if you use crawler instead of the JSON index with schema provided by XispeDocs
   */
  index?: 'default' | 'crawler';
  params?: ClientSearchParams | any;

  /**
   * Filter results with specific tag.
   */
  tag?: string;

  /**
   * Filter by locale (unsupported at the moment)
   */
  locale?: string;
}

export async function searchDocs(
  query: string,
  options: OramaCloudOptions,
): Promise<SortedResult[]> {
  const highlighter = createContentHighlighter(query);
  const list: SortedResult[] = [];
  const { index = 'default', client, params: extraParams = {}, tag } = options;

  if (index === 'crawler') {
    const searchParams: any = {
      ...extraParams,
      term: query,
      where: {
        category: tag
          ? {
              eq: tag.slice(0, 1).toUpperCase() + tag.slice(1),
            }
          : undefined,
        ...(extraParams as any).where,
      },
      limit: 10,
    };

    const result = await client.search(searchParams);
    if (!result) return list;

    for (const hit of (result as any).hits) {
      const doc = hit.document as unknown as CrawlerIndex;

      list.push(
        {
          id: hit.id,
          type: 'page',
          content: doc.title,
          contentWithHighlights: highlighter.highlight(doc.title),
          url: doc.path,
        },
        {
          id: 'page' + hit.id,
          type: 'text',
          content: doc.content,
          contentWithHighlights: highlighter.highlight(doc.content),
          url: doc.path,
        },
      );
    }

    return list;
  }

  const result = await client.search({
    ...extraParams,
    term: query,
    where: removeUndefined({
      tag,
      ...(extraParams as any).where,
    }),
    groupBy: {
      properties: ['page_id'],
      max_results: 7,
      ...(extraParams as any).groupBy,
    },
  } as any);

  if (!result || !(result as any).groups) return list;

  for (const item of (result as any).groups) {
    let addedHead = false;

    for (const hit of item.result) {
      const doc = hit.document as unknown as OramaIndex;

      if (!addedHead) {
        list.push({
          id: doc.page_id,
          type: 'page',
          content: doc.title,
          breadcrumbs: doc.breadcrumbs,
          contentWithHighlights: highlighter.highlight(doc.title),
          url: doc.url,
        });
        addedHead = true;
      }

      list.push({
        id: doc.id,
        content: doc.content,
        contentWithHighlights: highlighter.highlight(doc.content),
        type: doc.content === doc.section ? 'heading' : 'text',
        url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url,
      });
    }
  }

  return list;
}
