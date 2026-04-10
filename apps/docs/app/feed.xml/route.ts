import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Extrai o domínio automaticamente de onde a requisição foi feita (ex: Vercel)
    const reqUrl = new URL(request.url);
    const domain = `${reqUrl.protocol}//${reqUrl.host}`;
    
    // Buscar todos os episódios publicados no banco
    const episodes = await prisma.episode.findMany({
      where: {
        status: 'Publicado',
        // Garantir que não está null
        audioUrl: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const podcastTitle = "Podcast Ads - Serra Dourada";
    const podcastDescription = "O canal oficial de conteúdos acadêmicos e entrevistas exclusivas sobre o universo da tecnologia, empreendedorismo e inovação. Desenvolvido pelo curso de Análise e Desenvolvimento de Sistemas da Faculdade Serra Dourada.";
    
    // Logo (pode ser enviada à pasta public da aplicação)
    const podcastImage = `${domain}/logo-podcast.png`; 

    let rssItems = '';

    episodes.forEach((ep) => {
      // Filtrar caso exista strings vazias no banco que passaram pelo `not: null`
      if (!ep.audioUrl) return;

      // Montar a URL absoluta do arquivo de áudio (uploads ou storage externo)
      const audioLink = ep.audioUrl.startsWith('http') 
        ? ep.audioUrl 
        : `${domain}${ep.audioUrl}`;

      const pubDate = new Date(ep.createdAt).toUTCString();
      const guid = ep.slug || ep.id;

      // Escaping manual básico para evitar erros no XML
      const rawTitle = ep.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const rawSummary = ep.summary.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      rssItems += `
    <item>
      <title><![CDATA[${rawTitle}]]></title>
      <description><![CDATA[${rawSummary}]]></description>
      <link>${domain}/dashboard/detalhes/${ep.id}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${audioLink}" type="audio/mpeg" />
      <itunes:subtitle><![CDATA[${rawSummary}]]></itunes:subtitle>
      <itunes:summary><![CDATA[${rawSummary}]]></itunes:summary>
      <itunes:author><![CDATA[Faculdade Serra Dourada]]></itunes:author>
      <itunes:explicit>no</itunes:explicit>
      <itunes:duration>${ep.duration}</itunes:duration>
    </item>`;
    });

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${podcastTitle}</title>
    <link>${domain}</link>
    <language>pt-BR</language>
    <copyright>&#169; ${new Date().getFullYear()} Faculdade Serra Dourada</copyright>
    <itunes:author>Faculdade Serra Dourada</itunes:author>
    <description>${podcastDescription}</description>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Faculdade Serra Dourada</itunes:name>
      <itunes:email>contato@serradourada.edu.br</itunes:email>
    </itunes:owner>
    <itunes:image href="${podcastImage}" />
    <image>
      <url>${podcastImage}</url>
      <title>${podcastTitle}</title>
      <link>${domain}</link>
    </image>
    <itunes:category text="Education">
      <itunes:category text="Technology"/>
    </itunes:category>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS Feed:', error);
    return new NextResponse('Error generating RSS Feed', { status: 500 });
  }
}
