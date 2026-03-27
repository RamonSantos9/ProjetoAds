import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts', './src/build/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  target: 'node20',
});
