import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm'],
  target: 'node18',
  entry: ['./src/compile.ts', './src/typography/index.ts'],
  dts: true,
  clean: true,
  external: ['@tailwindcss/oxide'],
  noExternal: ['lodash.merge'],
});
