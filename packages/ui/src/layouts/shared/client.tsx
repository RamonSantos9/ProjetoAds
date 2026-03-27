'use client';
import type { ComponentProps } from 'react';
import { usePathname } from '@xispedocs/core/framework';
import { isActive } from '../../utils/is-active';
import Link from '@xispedocs/core/link';

export function BaseLinkItem({
  ref,
  item,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { item: any }) {
  const pathname = usePathname();
  const activeType = item.active ?? 'url';
  const active =
    activeType !== 'none' &&
    isActive(item.url, pathname, activeType === 'nested-url');

  return (
    <Link
      ref={ref}
      href={item.url}
      external={item.external}
      {...props}
      data-active={active}
    >
      {props.children}
    </Link>
  );
}
