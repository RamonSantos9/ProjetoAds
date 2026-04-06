'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
    className="size-5 shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

export function ActionButton({
  label,
  icon,
  showIcon = true,
  variant = 'primary',
  className,
  ...props
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      {...props}
      className={cn(
        'relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        'flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 rounded-lg h-8 px-3 w-full sm:w-auto',
        isPrimary
          ? 'bg-fd-primary text-fd-primary-foreground'
          : 'bg-transparent text-fd-foreground',
        className,
      )}
    >
      {showIcon && (icon || <PlusIcon />)}
      {label}
    </button>
  );
}
