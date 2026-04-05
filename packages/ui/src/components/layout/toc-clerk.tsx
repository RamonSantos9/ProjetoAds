'use client';
import * as Primitive from '@xispedocs/core/toc';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { TocThumb } from '../../components/layout/toc-thumb';
import { useTOCItems } from '../../components/layout/toc';
import { mergeRefs } from '../../utils/merge-refs';
import { useI18n } from '../../contexts/i18n';
import { motion } from 'motion/react';
import { useMemo } from 'react';

export type TOCThumbInfo = [top: number, height: number, left: number];

function calc(container: HTMLElement, active: string[]): TOCThumbInfo {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0, 0];
  }

  let upper = Number.MAX_VALUE,
    lower = 0,
    left = 0;

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
    if (!element) continue;

    const styles = getComputedStyle(element);
    const top = element.offsetTop + parseFloat(styles.paddingTop) - 6;
    
    if (top < upper) {
      upper = top;
      const depth = parseInt(element.getAttribute('data-depth') ?? '2');
      left = (depth - 1) * 10 + 1;
    }

    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom) - 6,
    );
  }

  return [upper, lower - upper, left];
}

export default function ClerkTOCItems({
  ref,
  className,
  ...props
}: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const activeAnchors = Primitive.useActiveAnchors();
  const { text } = useI18n();

  const [svg, setSvg] = useState<{
    path: string;
    width: number;
    height: number;
  }>();

  const [thumb, setThumb] = useState<TOCThumbInfo>([0, 0, 0]);

  useEffect(() => {
    if (!containerRef.current) return;
    setThumb(calc(containerRef.current, activeAnchors));
  }, [activeAnchors]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onResize(): void {
      if (container.clientHeight === 0) return;
      let w = 0,
        h = 0;
      const d: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const element: HTMLElement | null = container.querySelector(
          `a[href="#${items[i].url.slice(1)}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        const offset = getLineOffset(items[i].depth) + 1,
          top = element.offsetTop + parseFloat(styles.paddingTop) - 6,
          bottom =
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom) - 6;

        w = Math.max(offset, w);
        h = Math.max(h, bottom);

        const offsetX = offset;
        const offsetY = top;
        
        if (i === 0) {
          d.push(`M ${offsetX} ${offsetY} L ${offsetX} ${bottom}`);
        } else {
          const upperOffsetX = getLineOffset(items[i - 1].depth) + 1;
          const prevElement = container.querySelector(`a[href="#${items[i - 1].url.slice(1)}"]`) as HTMLElement;
          let upperOffsetY;
          if (prevElement) {
              const prevStyles = getComputedStyle(prevElement);
              upperOffsetY = prevElement.offsetTop + prevElement.clientHeight - parseFloat(prevStyles.paddingBottom);
          } else {
              upperOffsetY = offsetY - 4;
          }
          
          d.push(`L ${offsetX} ${offsetY} L ${offsetX} ${bottom}`);
        }
      }

      setSvg({
        path: d.join(' '),
        width: w + 1,
        height: h,
      });
    }

    const observer = new ResizeObserver(onResize);
    onResize();

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0)
    return (
      <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
        {text.tocNoHeadings}
      </div>
    );

  return (
    <>
      {svg ? (
        <div
          className="absolute start-0 top-0 rtl:-scale-x-100"
          style={{
            width: svg.width,
            height: svg.height,
          }}
        >
          <svg
            viewBox={`0 0 ${svg.width} ${svg.height}`}
            className="size-full overflow-visible"
          >
            <path
              d={svg.path}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-fd-foreground/10"
            />
            <motion.path
              d={svg.path}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-fd-primary"
              initial={false}
              animate={{
                clipPath: `inset(${thumb[0]}px 0 calc(100% - ${thumb[0]}px - ${thumb[1]}px) 0)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 30,
              }}
            />
          </svg>
        </div>
      ) : null}
      <div
        ref={mergeRefs(containerRef, ref)}
        className={cn('flex flex-col', className)}
        {...props}
      >
        {items.map((item) => (
          <TOCItem
            key={item.url}
            item={item}
          />
        ))}
      </div>
    </>
  );
}

function getItemOffset(depth: number): number {
  return (depth - 1) * 12 + 16;
}

function getLineOffset(depth: number): number {
  return (depth - 1) * 10;
}

function TOCItem({
  item,
}: {
  item: Primitive.TOCItemType;
}) {
  return (
    <Primitive.TOCItem
      href={item.url}
      data-depth={item.depth}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
      }}
      className="prose relative py-1.5 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0 data-[active=true]:text-fd-primary"
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
