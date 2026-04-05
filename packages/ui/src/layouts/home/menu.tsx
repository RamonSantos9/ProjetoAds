'use client';
import { type LinkItemType } from '../../layouts/shared';
import { LinkItem } from '../../utils/link-item';
import { cn } from '../../utils/cn';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '../../components/ui/navigation-menu';
import Link from '@xispedocs/core/link';
import { cva } from 'class-variance-authority';
import { buttonVariants } from '../../components/ui/button';
import type { ComponentPropsWithoutRef } from 'react';

const menuItemVariants = cva('', {
  variants: {
    variant: {
      main: 'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-fd-primary [&_svg]:size-4',
      icon: buttonVariants({
        size: 'icon',
        color: 'ghost',
      }),
      button: buttonVariants({
        color: 'secondary',
        className: 'gap-1.5 [&_svg]:size-4',
      }),
    },
  },
  defaultVariants: {
    variant: 'main',
  },
});

export function MenuLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === 'custom')
    return <div className={cn('grid', props.className)}>{item.children}</div>;

  if (item.type === 'menu') {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    );

    return (
      <div className={cn('mb-4 flex flex-col', props.className)}>
        <p className="mb-1 text-sm text-fd-muted-foreground">
          {item.url ? (
            <NavigationMenuLink asChild>
              <Link href={item.url} external={item.external}>
                {header}
              </Link>
            </NavigationMenuLink>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MenuLinkItem key={i} item={child} />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <LinkItem
        item={item as any}
        className={cn(
          menuItemVariants({ 
            variant: item.type === 'icon' ? 'icon' : 'main' 
          }),
          props.className,
          item.type !== 'icon' && 'flex-row items-start gap-3 py-3'
        )}
        aria-label={item.type === 'icon' ? item.label : undefined}
      >
        {item.icon && (
          <div className="mt-0.5 shrink-0 [&_svg]:size-4 font-bold text-fd-primary">
            {item.icon}
          </div>
        )}
        {item.type === 'icon' ? undefined : (
          <div className="flex flex-col gap-0.5 text-left">
            <p className="font-medium">{item.text}</p>
            {'description' in item && item.description && (
              <p className="text-xs text-fd-muted-foreground font-normal line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        )}
      </LinkItem>
    </NavigationMenuLink>
  );
}

export const Menu = NavigationMenuItem;

export function MenuTrigger({
  enableHover = false,
  ...props
}: ComponentPropsWithoutRef<typeof NavigationMenuTrigger> & {
  /**
   * Enable hover to trigger
   */
  enableHover?: boolean;
}) {
  return (
    <NavigationMenuTrigger
      {...props}
      onPointerMove={enableHover ? undefined : (e) => e.preventDefault()}
    >
      {props.children}
    </NavigationMenuTrigger>
  );
}

export function MenuContent(
  props: ComponentPropsWithoutRef<typeof NavigationMenuContent>,
) {
  return (
    <NavigationMenuContent
      {...props}
      className={cn('flex flex-col p-4', props.className)}
    >
      {props.children}
    </NavigationMenuContent>
  );
}
