import React from 'react';

interface HomeBadgeProps {
  label?: string;
  text: string;
  href: string;
}

export const HomeBadge: React.FC<HomeBadgeProps> = ({
  label = 'Novo',
  text,
  href,
}) => {
  return (
    <div
      className="relative text-left hstack text-sm transition duration-200 min-w-0"
      aria-label={text}
    >
      <div className="group relative max-w-full hstack justify-between items-center gap-2 border border-black/15 dark:border-white/15 p-1.5 rounded-full">
        <div className="hstack justify-start items-center max-w-full rounded-full">
          {label && (
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full text-xs px-2.5 py-1 mr-3 font-medium">
              {label}
            </div>
          )}
          <div
            className="stack text-sm font-medium truncate pr-2"
            style={{ mask: 'none' }}
          >
            {text}
          </div>
          <div className="group-hover:translate-x-0.5 transition-transform duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right h-4 text-gray-500 dark:text-gray-400"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
        </div>
        <a
          data-agent-id="link-_r_8s_"
          aria-label={text}
          className="absolute top-0 right-0 bottom-0 left-0 outline-none rounded-full focus:outline-none focus:ring-1 focus:ring-ring"
          target="_blank"
          rel="noopener noreferrer"
          href={href}
        ></a>
      </div>
    </div>
  );
};
