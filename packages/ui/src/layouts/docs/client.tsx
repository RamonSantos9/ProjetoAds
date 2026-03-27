'use client';

import { Sidebar as SidebarIcon } from 'lucide-react';
import { type ComponentProps, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { buttonVariants } from '../../components/ui/button';
import { useSidebar } from '../../contexts/sidebar';

import { SidebarCollapseTrigger } from '../../components/layout/sidebar';
import { SearchToggle } from '../../components/layout/search-toggle';
import type { Option } from '../../components/layout/root-toggle';
import { usePathname } from '@xispedocs/core/framework';
import { isTabActive } from '../../utils/is-active';
import Link from '@xispedocs/core/link';
export { Navbar } from '../../components/layout/navbar';

export function LayoutBody(props: ComponentProps<'main'>) {
  const { collapsed } = useSidebar();

  return (
    <main
      id="nd-docs-layout"
      {...props}
      className={cn(
        'grid transition-[grid-template-columns] overflow-x-clip min-h-(--fd-docs-height) [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px]',
        props.className,
      )}
      data-sidebar-collapsed={collapsed}
      style={
        {
          gridTemplate: `"sidebar sidebar header toc toc"
        "sidebar sidebar toc-popover toc toc"
        "sidebar sidebar main toc toc" 1fr / minmax(min-content, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width,97rem) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) minmax(min-content, 1fr)`,
          '--fd-docs-row-1': 'var(--fd-banner-height, 0px)',
          '--fd-docs-row-2': 'calc(var(--fd-docs-row-1) + var(--fd-header-height))',
          '--fd-docs-row-3': 'calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))',
          '--fd-sidebar-col': collapsed ? '0px' : 'var(--fd-sidebar-width)',
          ...props.style,
        } as object
      }
    >
      {props.children}
    </main>
  );
}

export function CollapsibleControl() {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        'fixed flex shadow-lg transition-opacity rounded-xl p-0.5 border bg-fd-muted text-fd-muted-foreground z-10 max-md:hidden xl:start-4 max-xl:end-4',
        !collapsed && 'pointer-events-none opacity-0',
      )}
      style={{
        top: 'calc(var(--fd-banner-height) + var(--fd-tocnav-height) + var(--spacing) * 4)',
      }}
    >
      <SidebarCollapseTrigger
        className={cn(
          buttonVariants({
            color: 'ghost',
            size: 'icon-sm',
            className: 'rounded-lg',
          }),
        )}
      >
        <SidebarIcon />
      </SidebarCollapseTrigger>
      <SearchToggle className="rounded-lg" hideIfDisabled />
    </div>
  );
}

export function LayoutTabs({
  options,
  ...props
}: ComponentProps<'div'> & {
  options: Option[];
}) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return options.findLast((option) => isTabActive(option, pathname));
  }, [options, pathname]);

  return (
    <div
      {...props}
      className={cn(
        'flex flex-row items-end gap-6 overflow-auto [grid-area:main]',
        props.className,
      )}
    >
      {options.map((option) => (
        <LayoutTab
          key={option.url}
          selected={selected === option}
          option={option}
        />
      ))}
    </div>
  );
}

function LayoutTab({
  option: { title, url, unlisted, props },
  selected = false,
}: {
  option: Option;
  selected?: boolean;
}) {
  return (
    <Link
      href={url}
      {...props}
      className={cn(
        'inline-flex border-b-2 border-transparent transition-colors items-center pb-1.5 font-medium gap-2 text-fd-muted-foreground text-sm text-nowrap hover:text-fd-accent-foreground',
        unlisted && !selected && 'hidden',
        selected && 'border-fd-primary text-fd-primary',
        props?.className,
      )}
    >
      {title}
    </Link>
  );
}
