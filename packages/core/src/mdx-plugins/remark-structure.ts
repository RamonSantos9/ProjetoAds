import Slugger from 'github-slugger';
import type { Nodes, Root } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import type { PluggableList, Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { flattenNode } from './remark-utils';
import type {
  MdxJsxAttribute,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from 'mdast-util-mdx-jsx';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';

interface Heading {
  id: string;
  content: string;
}

interface Content {
  heading: string | undefined;
  content: string;
}

export interface StructuredData {
  headings: Heading[];
  /**
   * Refer to paragraphs, a heading may contain multiple contents as well
   */
  contents: Content[];
}

export interface StructureOptions {
  /**
   * Types to be scanned as content.
   *
   * @defaultValue ['heading', 'paragraph', 'blockquote', 'tableCell', 'mdxJsxFlowElement']
   */
  types?: string[] | ((node: Nodes) => boolean);

  /**
   * A list of indexable MDX attributes, either:
   *
   * - an array of attribute names.
   * - a function that determines if attribute should be indexed.
   */
  allowedMdxAttributes?:
    | string[]
    | ((
        node: MdxJsxFlowElement,
        attribute: MdxJsxAttribute | MdxJsxExpressionAttribute,
      ) => boolean);

  /**
   * Export structured data as a named export
   */
  exportAs?: string;
}

declare module 'mdast' {
  interface Data {
    /**
     * Get content of unserializable element
     *
     * Needed for `remarkStructure` to generate search index
     */
    _string?: string[];
  }
}

declare module 'vfile' {
  interface DataMap {
    structuredData: StructuredData;
  }
}

/**
 * Attach structured data to VFile, you can access via `vfile.data.structuredData`.
 */
export function remarkStructure({
  types = [
    'heading',
    'paragraph',
    'blockquote',
    'tableCell',
    'mdxJsxFlowElement',
  ],
  allowedMdxAttributes = (node) => {
    if (!node.name) return false;

    return ['TypeTable', 'Callout'].includes(node.name);
  },
  exportAs,
}: StructureOptions = {}): Transformer<Root, Root> {
  const slugger = new Slugger();

  let typesFn: (node: Nodes) => boolean;
  if (Array.isArray(types)) {
    const arr = types;
    typesFn = (node) => arr.includes(node.type);
  } else {
    typesFn = types as (node: Nodes) => boolean;
  }

  let allowedMdxAttributesFn:
    | ((
        node: MdxJsxFlowElement,
        attribute: MdxJsxAttribute | MdxJsxExpressionAttribute,
      ) => boolean)
    | undefined;

  if (Array.isArray(allowedMdxAttributes)) {
    const arr = allowedMdxAttributes;
    allowedMdxAttributesFn = (_node, attribute) =>
      attribute.type === 'mdxJsxAttribute' && arr.includes(attribute.name);
  } else {
    allowedMdxAttributesFn = allowedMdxAttributes as any;
  }

  return (node, file) => {
    slugger.reset();
    const data: StructuredData = { contents: [], headings: [] };
    let lastHeading: string | undefined;

    // XispeDocs OpenAPI Generated Structured Data
    if (file.data.frontmatter) {
      const frontmatter = file.data.frontmatter as {
        _openapi?: {
          structuredData?: StructuredData;
        };
      };

      if (frontmatter._openapi?.structuredData) {
        data.headings.push(...frontmatter._openapi.structuredData.headings);
        data.contents.push(...frontmatter._openapi.structuredData.contents);
      }
    }

    visit(node, (element) => {
      if (element.type === 'root') return;
      if (!typesFn(element)) return;

      if (element.type === 'heading') {
        element.data ||= {};
        element.data.hProperties ||= {};
        const properties = element.data.hProperties;
        const content = flattenNode(element).trim();
        const id = properties.id ?? slugger.slug(content);

        data.headings.push({
          id,
          content,
        });

        lastHeading = id;
        return 'skip';
      }

      if (element.data?._string) {
        for (const content of element.data._string) {
          data.contents.push({
            heading: lastHeading,
            content,
          });
        }

        return 'skip';
      }

      if (element.type === 'mdxJsxFlowElement' && element.name) {
        data.contents.push(
          ...element.attributes.flatMap((attribute) => {
            const value =
              typeof attribute.value === 'string'
                ? attribute.value
                : attribute.value?.value;
            if (!value || value.length === 0) return [];
            if (
              allowedMdxAttributesFn &&
              !allowedMdxAttributesFn(element, attribute)
            )
              return [];

            return {
              heading: lastHeading,
              content:
                attribute.type === 'mdxJsxAttribute'
                  ? `${attribute.name}: ${value}`
                  : value,
            };
          }),
        );

        return;
      }

      const content = flattenNode(element).trim();
      if (content.length === 0) return;

      data.contents.push({
        heading: lastHeading,
        content,
      });

      return 'skip';
    });

    file.data.structuredData = data;

    if (exportAs) {
      const value = JSON.stringify(data);

      node.children.push({
        type: 'mdxjsEsm',
        value: `export const ${exportAs} = ${value};`,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExportNamedDeclaration',
                declaration: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: { type: 'Identifier', name: exportAs },
                      init: {
                        type: 'Literal',
                        value: null,
                        raw: value,
                      },
                    },
                  ],
                },
                specifiers: [],
                source: null,
                attributes: [],
              },
            ],
          },
        },
      } as MdxjsEsm);
    }
  };
}

/**
 * Extract data from markdown/mdx content
 */
export function structure(
  content: string,
  remarkPlugins: PluggableList = [],
  options: StructureOptions = {},
): StructuredData {
  const result = remark()
    .use(remarkGfm)
    .use(remarkPlugins)
    .use(remarkStructure, options)
    .processSync(content);

  return result.data.structuredData!;
}
