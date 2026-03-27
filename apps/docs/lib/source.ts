import { docs } from '../.source';
import { loader } from '@xispedocs/core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toXispeDocsSource(),
});
