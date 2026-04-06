'use client';
import * as React from 'react';
import {
  forwardRef,
  useMemo,
  useRef,
  type AnchorHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { mergeRefs } from './utils/merge-refs';
import { useOnChange } from './utils/use-on-change';
import { useAnchorObserver } from './utils/use-anchor-observer';

export interface TOCItemType {
  title: ReactNode;
  url: string;
  depth: number;
}

export type TableOfContents = TOCItemType[];

const TOCContext = React.createContext<TableOfContents>([]);

const ActiveAnchorContext = React.createContext<string[]>([]);

const ScrollContext = React.createContext<RefObject<HTMLElement | null>>({
  current: null,
});

/**
 * The estimated active heading ID
 */
export function useActiveAnchor(): string | undefined {
  return React.useContext(ActiveAnchorContext).at(-1);
}

export function useTOCItems(): TableOfContents {
  return React.useContext(TOCContext);
}

/**
 * The id of visible anchors
 */
export function useActiveAnchors(): string[] {
  return React.useContext(ActiveAnchorContext);
}

export interface AnchorProviderProps {
  toc: TableOfContents;
  /**
   * Only accept one active item at most
   *
   * @defaultValue true
   */
  single?: boolean;
  children?: ReactNode;
}

export interface ScrollProviderProps {
  /**
   * Scroll into the view of container when active
   */
  containerRef: RefObject<HTMLElement | null>;

  children?: ReactNode;
}

export function ScrollProvider({
  containerRef,
  children,
}: ScrollProviderProps): ReactNode {
  return (
    <ScrollContext.Provider value={containerRef}>
      {children}
    </ScrollContext.Provider>
  );
}

export function AnchorProvider({
  toc,
  single = true,
  children,
}: AnchorProviderProps): ReactNode {
  const headings = useMemo(() => {
    return toc.map((item) => item.url.split('#')[1]);
  }, [toc]);

  return (
    <TOCContext.Provider value={toc}>
      <ActiveAnchorContext.Provider value={useAnchorObserver(headings, single)}>
        {children}
      </ActiveAnchorContext.Provider>
    </TOCContext.Provider>
  );
}

export interface TOCItemProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  href: string;

  onActiveChange?: (v: boolean) => void;
}

export const TOCItem = forwardRef<HTMLAnchorElement, TOCItemProps>(
  ({ onActiveChange, ...props }, ref) => {
    const containerRef = React.useContext(ScrollContext);
    const anchors = useActiveAnchors();
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const mergedRef = mergeRefs(anchorRef, ref);

    const isActive = anchors.includes(props.href.slice(1));

    useOnChange(isActive, (v) => {
      const element = anchorRef.current;
      if (!element) return;

      if (v && containerRef.current) {
        scrollIntoView(element, {
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
          scrollMode: 'always',
          boundary: containerRef.current,
        });
      }

      onActiveChange?.(v);
    });

    return (
      <a ref={mergedRef} data-active={isActive} {...props}>
        {props.children}
      </a>
    );
  },
);

TOCItem.displayName = 'TOCItem';
