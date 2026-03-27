import { compile } from 'json-schema-to-typescript';
import type { ProcessedDocument } from '@/utils/process-document';

export async function getTypescriptSchema(
  processed: ProcessedDocument,
): Promise<string | undefined> {
  try {
    const cloned = structuredClone(processed.bundled);
    return await compile(cloned, 'Response');
  } catch (e) {
    console.warn('Failed to generate typescript schema:', e);
  }
}
