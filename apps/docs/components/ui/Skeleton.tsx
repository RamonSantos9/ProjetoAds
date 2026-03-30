import React from 'react';
import { cn } from '@/lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangle' | 'circle' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangle',
  width,
  height,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rectangle: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-fd-muted',
        variantClasses[variant],
        className
      )}
      style={{ width, height, ...props.style }}
      {...props}
    />
  );
}
