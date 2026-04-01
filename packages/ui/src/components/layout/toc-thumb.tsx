import { type HTMLAttributes, type RefObject, useEffect, useRef } from 'react';
import * as Primitive from '@xispedocs/core/toc';
import { useOnChange } from '@xispedocs/core/utils/use-on-change';
import { useEffectEvent } from '@xispedocs/core/utils/use-effect-event';
import { Slot } from '@radix-ui/react-slot';

export type TOCThumb = [top: number, height: number, left: number];

function calc(container: HTMLElement, active: string[]): TOCThumb {
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
    const top = element.offsetTop + parseFloat(styles.paddingTop);
    
    if (top < upper) {
      upper = top;
      const depth = parseInt(element.getAttribute('data-depth') ?? '2');
      left = (depth - 1) * 10 + 1;
    }

    lower = Math.max(
      lower,
      element.offsetTop +
        element.clientHeight -
        parseFloat(styles.paddingBottom),
    );
  }

  return [upper, lower - upper, left];
}

function update(element: HTMLElement, info: TOCThumb): void {
  element.style.setProperty('--fd-top', `${info[0]}px`);
  element.style.setProperty('--fd-height', `${info[1]}px`);
  element.style.setProperty('--fd-left', `${info[2]}px`);
}

export function TocThumb({
  containerRef,
  asChild,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  containerRef: RefObject<HTMLElement | null>;
  asChild?: boolean;
}) {
  const active = Primitive.useActiveAnchors();
  const thumbRef = useRef<HTMLDivElement>(null);

  const onResize = useEffectEvent(() => {
    if (!containerRef.current || !thumbRef.current) return;

    update(thumbRef.current, calc(containerRef.current, active));
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  useOnChange(active, () => {
    if (!containerRef.current || !thumbRef.current) return;

    update(thumbRef.current, calc(containerRef.current, active));
  });

  const Component = asChild ? Slot : 'div';

  return <Component ref={thumbRef} role="none" {...props} />;
}
