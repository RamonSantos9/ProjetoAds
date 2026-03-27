'use client';
import type * as PageTree from '@xispedocs/core/page-tree';
import { createSafeContext, usePathname } from '@xispedocs/core/framework';
import * as React from 'react';
import type { ReactNode } from 'react';
import { searchPath } from '@xispedocs/core/breadcrumb';

type MakeRequired<O, K extends keyof O> = Omit<O, K> & Pick<Required<O>, K>;

interface TreeContextType {
  root: MakeRequired<PageTree.Root | PageTree.Folder, '$id'>;
  full: PageTree.Root;
}

const TreeContext = createSafeContext<TreeContextType>('TreeContext');
const PathContext = createSafeContext<PageTree.Node[]>('PathContext', []);

export function TreeContextProvider(props: {
  tree: PageTree.Root;
  children: ReactNode;
}) {
  const nextIdRef = React.useRef(0);
  const pathname = usePathname();

  // I found that object-typed props passed from a RSC will be re-constructed, hence breaking all hooks' dependencies
  // using the id here to make sure this never happens
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tree = React.useMemo(() => props.tree, [props.tree.$id ?? props.tree]);
  const path = React.useMemo(() => {
    let result = searchPath(tree.children, pathname);
    if (result) return result;

    if (tree.fallback) result = searchPath(tree.fallback.children, pathname);
    return result ?? [];
  }, [tree, pathname]);

  const root =
    path.findLast((item) => item.type === 'folder' && item.root) ?? tree;
  root.$id ??= String(nextIdRef.current++);

  return (
    <TreeContext.Provider
      value={React.useMemo(
        () => ({ root, full: tree }) as TreeContextType,
        [root, tree],
      )}
    >
      <PathContext.Provider value={path}>{props.children}</PathContext.Provider>
    </TreeContext.Provider>
  );
}

export function useTreePath(): PageTree.Node[] {
  return PathContext.use();
}

export function useTreeContext(): TreeContextType {
  return TreeContext.use('You must wrap this component under <DocsLayout />');
}
