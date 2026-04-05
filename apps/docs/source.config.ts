import { defineConfig, defineDocs } from '@xispedocs/mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

// Re-trigger build to clear stale references
export default defineConfig();
