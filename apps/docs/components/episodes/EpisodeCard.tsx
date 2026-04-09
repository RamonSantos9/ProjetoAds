'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Episode } from '@/lib/db';
import { cn } from '@xispedocs/ui/utils/cn';

const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m14.052 3.74 1.406-1.407a1.563 1.563 0 1 1 2.21 2.21l-8.85 8.849a3.75 3.75 0 0 1-1.58.942L5 15l.667-2.237a3.75 3.75 0 0 1 .941-1.581zm0 0 2.198 2.198M15 11.667v3.958a1.875 1.875 0 0 1-1.875 1.875h-8.75A1.875 1.875 0 0 1 2.5 15.625v-8.75A1.875 1.875 0 0 1 4.375 5h3.958"
      stroke="#8a8aa3"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EpisodePlaceholderIcon = ({ color }: { color: string }) => (
  <svg
    width="49"
    height="39"
    viewBox="0 0 49 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m1.75 28 12.038-12.038a5.25 5.25 0 0 1 7.424 0L33.25 28m-3.5-3.5 3.288-3.288a5.25 5.25 0 0 1 7.424 0L47.25 28m-42 8.75h38.5a3.5 3.5 0 0 0 3.5-3.5v-28a3.5 3.5 0 0 0-3.5-3.5H5.25a3.5 3.5 0 0 0-3.5 3.5v28a3.5 3.5 0 0 0 3.5 3.5m24.5-26.25h.019v.019h-.019zm.875 0a.875.875 0 1 1-1.75 0 .875.875 0 0 1 1.75 0"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface EpisodeCardProps {
  episode: Episode;
  href: string;
  onEdit?: () => void;
  isAdmin?: boolean;
  className?: string;
}

export function EpisodeCard({
  episode,
  href,
  onEdit,
  isAdmin,
  className,
}: EpisodeCardProps) {
  return (
    <div className={cn('h-full', className)}>
      <div className="flex flex-col w-full h-[280px] rounded-2xl border overflow-hidden cursor-pointer hover:bg-[#F6F8FA] dark:hover:bg-[#1F2122] transition-all duration-300 relative group bg-background">
        <Link
          href={href}
          className="flex flex-col flex-1 p-[10px] gap-2 min-h-0"
        >
          {/* Image / Placeholder */}
          <figure className="relative w-full h-[140px] rounded-lg overflow-hidden bg-fd-muted flex items-center justify-center shrink-0">
            {episode.image ? (
              <img
                src={episode.image}
                className="w-full h-full object-cover"
                alt={episode.title}
              />
            ) : (episode as any).imageFile ? (
              <img
                src={URL.createObjectURL((episode as any).imageFile)}
                className="w-full h-full object-cover"
                alt={episode.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F6F8FA] dark:bg-[#1F2122]">
                <EpisodePlaceholderIcon color="#8A8AA3" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1.5 translate-y-1">
              <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-[#121217] dark:text-white">
                {episode.duration}
              </span>
            </div>
          </figure>

          {/* Info */}
          <div className="flex flex-col w-full gap-1 flex-1">
            <h3 className="font-medium text-sm leading-tight text-[#121217] dark:text-[#FFFFFF] line-clamp-2 group-hover:text-fd-primary transition-colors">
              {episode.title.length > 70
                ? `${episode.title.slice(0, 70)}...`
                : episode.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <span className="text-[11px] text-[#6F6F88] dark:text-[#8A8AA3] font-bold">
                Criado por:
              </span>
              <span className="text-[11px] text-[#6F6F88] dark:text-[#8A8AA3] truncate flex-1 min-w-0">
                {episode.guests
                  ?.map((g: any) => (typeof g === 'object' ? g.name : g))
                  .join(', ')}
              </span>
            </div>
          </div>
          <div className="text-xs truncate text-[#6F6F88] dark:text-[#8A8AA3]">
            {episode.summary}
          </div>
          {/* Fixed Footer */}
          <footer className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Badge
                variant={episode.status === 'Publicado' ? 'success' : 'warning'}
                className="text-[10px] font-bold"
              >
                {episode.status}
              </Badge>
              <span className="text-[10px] text-fd-muted-foreground border border-fd-border/50 px-2 py-0.5 rounded-full font-medium">
                {episode.duration}
              </span>
            </div>

            {isAdmin && onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 cursor-pointer hover:text-fd-primary transition-colors"
                aria-label={`Editar episódio ${episode.title}`}
              >
                <EditIcon />
              </button>
            )}
          </footer>
        </Link>
      </div>
    </div>
  );
}

export function EpisodeListItem({
  episode,
  href,
  onEdit,
  isAdmin,
}: EpisodeCardProps) {
  return (
    <li className="list-none w-full">
      <Link
        href={href}
        className="flex items-center w-full rounded-xl border border-[#E2E7F1] dark:border-[#2A2A38] p-3 gap-4 cursor-pointer hover:bg-[#F6F8FA] dark:hover:bg-[#1A1A24] transition-colors bg-[#FFFFFF] dark:bg-[#121217] group"
      >
        <div className="size-12 rounded-lg bg-[#F6F8FA] dark:bg-[#1A1A24] flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
          {episode.image ? (
            <img
              src={episode.image}
              className="w-full h-full object-cover"
              alt={episode.title}
            />
          ) : (episode as any).imageFile ? (
            <img
              src={URL.createObjectURL((episode as any).imageFile)}
              className="w-full h-full object-cover"
              alt={episode.title}
            />
          ) : (
            <EpisodePlaceholderIcon color="#8A8AA3" />
          )}
        </div>
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-medium text-sm text-[#121217] dark:text-[#FFFFFF] truncate group-hover:text-fd-primary transition-colors">
            {episode.title.length > 55
              ? `${episode.title.slice(0, 55)}...`
              : episode.title}
          </h3>
          <div className="flex gap-3 items-center text-[10px] text-[#6F6F88] dark:text-[#8A8AA3] font-medium tracking-tight">
            <span className="bg-[#F6F8FA] dark:bg-[#1A1A24] border border-[#E2E7F1] dark:border-[#2A2A38] px-1.5 py-0.5 rounded-md uppercase shrink-0">
              {episode.category || 'Geral'}
            </span>
            <span className="flex items-center gap-1 font-bold shrink-0">
              {episode.duration}
            </span>
            <span className="truncate flex-1 min-w-0">
              {episode.guests
                ?.map((g: any) => (typeof g === 'object' ? g.name : g))
                .join(', ')}
            </span>
          </div>
        </div>

        <Badge
          variant={episode.status === 'Publicado' ? 'success' : 'warning'}
          className="hidden sm:inline-flex shrink-0 text-[10px]"
        >
          {episode.status}
        </Badge>

        {isAdmin && onEdit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-lg text-[#8A8AA3] hover:bg-[#E2E7F1]/50 hover:text-fd-primary transition-all cursor-pointer border border-[#E2E7F1]/50 ml-2"
          >
            <EditIcon />
          </button>
        )}
      </Link>
    </li>
  );
}
