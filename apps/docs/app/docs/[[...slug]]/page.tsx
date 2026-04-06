import type { Metadata } from 'next';
import { Callout } from '@xispedocs/ui/components/callout';
import { TypeTable } from '@xispedocs/ui/components/type-table';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { DocsBody, DocsPage } from '@xispedocs/ui/page';
import { notFound } from 'next/navigation';
import { type ComponentProps, type FC } from 'react';

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) {
    notFound();
  }

  const { body: Mdx, toc, lastModified } = page.data;

  return (
    <DocsPage
      toc={toc}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-4">
        {page.data.description}
      </p>

      <div className="prose flex-1 text-fd-foreground/90">
        <Mdx
          components={getMDXComponents({
            TypeTable,
            blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
          })}
        />
      </div>
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page)
    return {
      title: 'Not Found',
    };

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams() {
  return source.generateParams();
}
