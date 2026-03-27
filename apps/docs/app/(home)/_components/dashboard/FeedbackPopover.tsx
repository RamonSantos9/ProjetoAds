'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@xispedocs/ui/utils/cn';

export function FeedbackPopover({ children }: { children: React.ReactNode }) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="center"
          side="bottom"
          sideOffset={8}
          className={cn(
            "z-50 w-[340px] overflow-auto rounded-[16px] bg-[#FFFFFF] dark:bg-[#121212] border border-gray-alpha-150 text-popover-foreground shadow-popover-sm outline-none transition duration-100",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 p-3 py-3"
          )}
          style={{
             // @ts-ignore
             "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)"
          }}
        >
          <div style={{ height: '142px' }}>
            <div>
              <div style={{ opacity: 1 }}>
                <div className="flex flex-col pb-2">
                  <form id="_r_an_">
                    <label className="text-sm text-foreground font-medium stack gap-2">
                      <textarea 
                        className="flex min-h-[60px] w-full rounded-[10px] border border-gray-alpha-200 bg-transparent px-3 py-2 text-sm placeholder:text-subtle focus-ring focus-visible:border-foreground focus-visible:ring-[0.5px] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition duration-100 resize-none" 
                        data-agent-id="input-_r_ar_" 
                        name="feedback" 
                        placeholder="Digite seu feedback aqui..." 
                        rows={4}
                      />
                    </label>
                  </form>
                </div>
                <div className="hstack justify-between gap-10 mt-1">
                  <div>
                    <div style={{ opacity: 1 }}>
                      <p className="text-xs text-subtle font-normal">Não respondemos aos envios, mas lemos todos com atenção</p>
                    </div>
                  </div>
                  <button 
                    form="_r_an_" 
                    data-loading="false" 
                    data-agent-id="button-_r_av_" 
                    className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-foreground text-background shadow-none hover:bg-gray-800 radix-state-open:bg-gray-700 radix-state-on:bg-gray-700 active:bg-gray-700 disabled:bg-gray-400 disabled:text-gray-100 h-8 px-2.5 rounded-lg text-xm"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
