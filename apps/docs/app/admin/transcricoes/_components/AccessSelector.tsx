'use client';

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AccessSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

export function AccessSelector({
  value,
  onChange,
  options,
  className,
}: AccessSelectorProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <DropdownMenu.Root open={isSelectOpen} onOpenChange={setIsSelectOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between whitespace-nowrap transition-all border hover:bg-fd-accent/50 text-foreground pl-3 pr-2 py-2 text-sm font-medium rounded-[10px] w-32 h-10 bg-white dark:bg-black disabled:opacity-50 disabled:cursor-not-allowed outline-none",
            isSelectOpen ? "border-foreground/20" : "border-gray-alpha-200",
            className
          )}
        >
          <span className="inline-block truncate mr-auto">
            {value}
          </span>
          <div
            className={cn(
              'flex h-4 w-4 items-center justify-center opacity-50 transition-transform duration-200',
              isSelectOpen ? 'rotate-180' : 'rotate-0',
            )}
          >
            <ChevronDown className="h-4 w-4 min-w-fit" />
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align="end" 
          sideOffset={8}
          className="z-[100] min-w-[140px] bg-white/95 dark:bg-black/95 backdrop-blur border rounded-lg overflow-hidden p-1 flex flex-col gap-0.5 animate-in fade-in-0 scale-in-95 duration-150 text-sm outline-none"
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <DropdownMenu.Item
                key={opt}
                onSelect={() => onChange(opt)}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 text-sm rounded-md text-left transition-colors w-full outline-none cursor-pointer',
                  isSelected
                    ? 'bg-fd-accent text-foreground font-medium'
                    : 'hover:bg-fd-accent/50 focus:bg-fd-accent/50 text-foreground',
                )}
              >
                <span className="truncate pr-4">
                  {opt}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 shrink-0 " />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
