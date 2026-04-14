'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * ActionButtonRefined: Sync with RelatoriosPage style
 */
export const ActionButtonRefined = ({
  label,
  onClick,
  icon,
  showIcon = true,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  form,
}: {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}) => {
  const variantStyles =
    variant === 'primary'
      ? 'bg-fd-primary text-fd-primary-foreground hover:opacity-90'
      : 'bg-transparent text-fd-foreground hover:bg-fd-accent';

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'leading-[24px] relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-5 border flex items-center justify-center gap-2 transition-all duration-200 rounded-lg h-8 px-3 w-full lg:w-auto text-sm',
        variantStyles,
        className,
      )}
    >
      {showIcon && (icon || <Plus className="size-5" />)}
      {label}
    </button>
  );
};

// --- TooltipRefined ---
export const TooltipRefined = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => (
  <div className="relative inline-block group">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white text-[#0A1B39] text-[11px] font-bold rounded-lg px-2 py-1.5 whitespace-nowrap shadow-lg border border-[#E2E7F1] text-center scale-95 group-hover:scale-100 origin-bottom">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
    </div>
  </div>
);
