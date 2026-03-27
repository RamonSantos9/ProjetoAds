'use client';
import type { ComponentProps } from 'react';
import { RootProvider as BaseProvider } from '../provider/base';
import { WakuProvider } from '@xispedocs/core/framework/waku';

export function RootProvider(props: ComponentProps<typeof BaseProvider>) {
  return (
    <WakuProvider>
      <BaseProvider {...props}>{props.children}</BaseProvider>
    </WakuProvider>
  );
}
