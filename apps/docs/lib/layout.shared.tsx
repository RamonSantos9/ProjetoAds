import { type LinkItemType } from '@xispedocs/ui/layouts/docs';
import type { BaseLayoutProps } from '@xispedocs/ui/layouts/shared';
import { XispeDocsIcon } from '@/app/layout.client';

export const linkItems: LinkItemType[] = [
  // {
  //   icon: <AlbumIcon />,
  //   text: 'Blog',
  //   url: '/blog',
  //   active: 'nested-url',
  // },
];

export const logo = <XispeDocsIcon className="size-8 md:size-10" />;

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium [.uwu_&]:hidden [header_&]:text-[15px]">
            PodcastAds
          </span>
        </>
      ),
      transparentMode: 'top',
    },
  };
}
