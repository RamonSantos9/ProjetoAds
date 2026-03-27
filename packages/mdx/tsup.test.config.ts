import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/node/loader.ts'],
  format: ['esm'],
  dts: true,
  clean: false,
  bundle: true,
  external: [/node_modules/],
});
