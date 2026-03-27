'use client';

import { type ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { useNav } from '../../contexts/layout';

export function Navbar(props: ComponentProps<'header'>) {
  const { isTransparent } = useNav();

  return (
    <header
      id="nd-subnav"
      {...props}
      className={cn(
        'fixed top-(--fd-banner-height) left-0 right-(--removed-body-scroll-bar-size,0) z-30 flex items-center gap-4 px-4 h-(--fd-nav-height) border-b transition-colors backdrop-blur-sm [grid-area:header]',
        !isTransparent && 'bg-fd-background/80',
        props.className,
      )}
    >
      {props.children}
    </header>
  );
}
