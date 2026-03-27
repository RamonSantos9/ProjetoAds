import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cn.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
});
