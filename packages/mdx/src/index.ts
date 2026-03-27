export type * from './runtime/shared';

// backward compat
// TODO: require importing `@xispedocs/mdx/runtime/next` instead
export { _runtime, createMDXSource } from './runtime/next';
export * from './runtime/next/types';

export type { ExtractedReference } from './loaders/mdx/remark-postprocess';
