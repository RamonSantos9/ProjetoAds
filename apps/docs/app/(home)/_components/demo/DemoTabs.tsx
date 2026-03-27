'use client';

import { cn } from '@/lib/cn';
import { categories } from '../../_data/landing';

interface DemoTabsProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function DemoTabs({ selectedCategory, onCategorySelect }: DemoTabsProps) {
  return (
    <>
      <div className="z-50 col-start-1 row-start-1 mb-4 h-11 md:col-start-1 md:row-start-1 md:mb-6">
        <div
          className="mx-auto grid h-11 w-full min-w-max auto-cols-fr rounded-full whitespace-nowrap ring-[0.5px] ring-inset ring-fd-border"
          role="tablist"
          aria-orientation="horizontal"
        >
          <div
            className="relative isolate flex cursor-pointer items-center justify-center rounded-full outline-none transition-all"
            style={{ paddingLeft: '1.125rem', paddingRight: '1.1875rem', gridColumnStart: 1 }}
            role="tab"
            aria-selected="true"
          >
            <div className="relative flex items-center gap-1.5 text-fd-foreground">
              <div className="relative mr-0.5 h-3 w-3 overflow-hidden rounded-full bg-cream">
                <img
                  alt=""
                  src="https://eleven-public-cdn.elevenlabs.io/marketing_website/_next/static/media/eleven-creative.f5fbfcf5.png"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="type-base hidden sm:block">Podcast ADS</div>
              <div className="type-base block sm:hidden">Criativo</div>
            </div>
            <div className="absolute inset-0 -z-10 rounded-full bg-fd-card shadow-[0_0_1px_rgb(0_0_0_/_0.28),0_4px_4px_rgb(0_0_0_/_0.06)] dark:shadow-[0_0_1px_rgb(255_255_255_/_0.12),0_10px_30px_rgb(0_0_0_/_0.25)]" />
          </div>

          <div
            className="relative isolate flex cursor-pointer items-center justify-center rounded-full outline-none transition-all"
            style={{ paddingLeft: '1.1875rem', paddingRight: '1.125rem', gridColumnStart: 2 }}
            role="tab"
            aria-selected="false"
          >
            <div className="relative flex items-center gap-1.5 text-fd-muted-foreground">
              <div className="relative mr-0.5 h-3 w-3 overflow-hidden rounded-full bg-cream">
                <img
                  alt=""
                  src="https://eleven-public-cdn.elevenlabs.io/marketing_website/_next/static/media/eleven-agents.d9236159.png"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="type-base hidden sm:block">ElevenAgents</div>
              <div className="type-base block sm:hidden">Agentes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="contents">
        <div className="col-span-full col-start-1 row-start-2 w-full pt-4 sm:pt-6 md:row-start-3 md:w-fit md:pb-6 md:pt-0 lg:w-auto">
          <div className="flow-root">
            <div className="-mx-full-bleed -my-3 overflow-x-auto px-full-bleed py-6 no-scrollbar">
              <div className="flex min-w-full w-max items-center gap-1.5">
                <div
                  className="mx-auto grid h-10 w-max rounded-full whitespace-nowrap"
                  role="tablist"
                  aria-orientation="horizontal"
                >
                  {categories.map((cat, i) => {
                    const isSelected = cat === selectedCategory;

                    return (
                      <div
                        key={cat}
                        className="relative isolate flex h-full cursor-pointer items-center justify-center rounded-full px-4 outline-none"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => onCategorySelect(cat)}
                        style={{ gridColumnStart: i + 1 }}
                      >
                        <div
                          className={cn(
                            'type-base transition-colors',
                            isSelected
                              ? 'text-fd-foreground'
                              : 'text-fd-muted-foreground hover:text-fd-foreground',
                          )}
                        >
                          {cat}
                        </div>
                        {isSelected ? (
                          <div className="absolute inset-0 -z-10 rounded-full bg-fd-card shadow-[0_0_1px_rgb(0_0_0_/_0.28),0_4px_4px_rgb(0_0_0_/_0.06)] dark:shadow-[0_0_1px_rgb(255_255_255_/_0.12),0_10px_30px_rgb(0_0_0_/_0.25)]" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
