'use client';

import { useParams } from 'next/navigation';
import { type ReactNode, useId } from 'react';
import { cn } from '@/lib/cn';

export function Body({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const mode = useMode();

  return (
    <body
      className={cn(mode, 'relative flex min-h-screen flex-col')}
      suppressHydrationWarning
    >
      {children}
    </body>
  );
}

export function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}

export function XispeDocsIcon(props: React.SVGProps<SVGSVGElement>) {
  const id = useId();
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" {...props}>
      <defs>
        <filter
          id={`${id}-shadow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="2"
            dy="2"
            stdDeviation="5"
            floodColor="#10B667"
            floodOpacity="0.4"
          />
        </filter>
        <linearGradient
          id={`${id}-iconGradient`}
          x1="40"
          y1="12"
          x2="40"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="70%" stopColor="#10B667" />
          <stop offset="100%" stopColor="#019918" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        <path
          d="M12 40H68C68 55.464 55.464 68 40 68C24.536 68 12 55.464 12 40Z"
          fill={`url(#${id}-iconGradient)`}
          stroke="#10B667"
          strokeWidth="0.8"
        />
        <path
          d="M68 40H12C12 24.536 24.536 12 40 12C55.464 12 68 24.536 68 40Z"
          fill={`url(#${id}-iconGradient)`}
          stroke="#10B667"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}
