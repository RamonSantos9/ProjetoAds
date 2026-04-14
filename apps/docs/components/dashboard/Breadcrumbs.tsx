'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs component following the high-fidelity design provided.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const Chevron = () => (
    <svg 
      width="20px" 
      height="20px" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="text-gray-400 shrink-0"
    >
      <path 
        d="M6.66675 10.6667L8.86201 8.4714C9.12235 8.21107 9.12235 7.78893 8.86201 7.5286L6.66675 5.33333" 
        stroke="currentColor" 
        strokeWidth="1.33333" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={cn(
      "hstack gap-1.5 items-center whitespace-nowrap min-w-0 overflow-hidden w-full py-1 px-1 -mr-1",
      className
    )}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const active = item.active || isLast;

        return (
          <React.Fragment key={index}>
            {index > 0 && <Chevron />}
            
            <div className={cn(
              "hstack gap-1.5 items-center shrink-0 min-w-0",
              active && "max-w-[200px] shrink min-w-[120px]"
            )}>
              <span className={cn(
                "shrink min-w-0",
                active && "max-w-[calc(100%-1.5rem)]"
              )}>
                {item.href && !isLast ? (
                  <Link 
                    href={item.href}
                    className="flex focus-ring outline-none rounded-md"
                  >
                    <p 
                      data-testid="page-title" 
                      className={cn(
                        "text-sm font-medium truncate hover:text-gray-950 dark:hover:text-gray-50",
                        active ? "text-gray-950 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {item.label}
                    </p>
                  </Link>
                ) : (
                  <p 
                    className={cn(
                      "text-sm font-medium truncate",
                      active ? "text-gray-950 dark:text-gray-50" : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {item.label}
                  </p>
                )}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
