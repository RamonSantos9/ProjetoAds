import { defineProject } from 'vitest/config';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const _dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineProject({
  resolve: {
    alias: {
      '@': path.resolve(_dirname, './src'),
    },
  },
});
