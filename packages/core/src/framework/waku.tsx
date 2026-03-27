'use client';

import { type ReactNode, useMemo } from 'react';
import { Link as WakuLink, useRouter } from 'waku';
import { type Framework, FrameworkProvider } from './index.js';

const framework: Framework = {
  usePathname() {
    try {
      const router = useRouter();
      // @ts-ignore -- Waku's router type might be missing 'path' property in some versions
      return router.path;
    } catch (_e) {
      return '';
    }
  },
  useParams() {
    try {
      const router = useRouter();
      return useMemo(() => {
        // @ts-ignore -- router.query type might be inconsistent
        const params = new URLSearchParams(router.query);
        return Object.fromEntries(
          Array.from(params.entries()).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
          ]),
        );
      }, [router]);
    } catch (_e) {
      return {};
    }
  },
  useRouter() {
    try {
      const router = useRouter();

      return useMemo(
        () => ({
          push(url: string) {
            void router.push(url);
          },
          refresh() {
            // @ts-ignore -- router.path type check
            void router.push(router.path);
          },
        }),
        [router],
      );
    } catch (_e) {
      return {
        push() {},
        refresh() {},
      };
    }
  },
  Link({ href, prefetch: _prefetch, ...props }) {
    return (
      <WakuLink to={href!} {...props}>
        {props.children}
      </WakuLink>
    );
  },
};

export function WakuProvider({ children }: { children: ReactNode }) {
  return <FrameworkProvider {...framework}>{children}</FrameworkProvider>;
}
