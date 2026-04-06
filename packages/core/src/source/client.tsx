'use client';

import * as React from 'react';

export function useXispeDocsLoader<
  T extends { pageTree: unknown; path: string },
>(data: T): T {
  return React.useMemo(() => data, [data]);
}
