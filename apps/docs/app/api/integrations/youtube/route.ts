import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID; // ID do canal no YouTube

/**
 * GET /api/integrations/youtube
 *
 * Retorna dados do canal do YouTube e vídeos/episódios mais recentes:
 * - Estatísticas do canal (subscribers, views, videoCount)
 * - Lista dos vídeos mais recentes com views individuais
 *
 * Requer no .env.local:
 *   YOUTUBE_API_KEY=...       (chave de API simples, não OAuth, para dados públicos)
 *   YOUTUBE_CHANNEL_ID=...    (ex: "UCxxxxxxxxxxxxxxxxxxxx")
 *
 * Como obter o Channel ID:
 * 1. Abra o canal no YouTube no browser
 * 2. Clique com botão direito → Exibir código-fonte
 * 3. Busque "channelId" ou "externalId"
 * Ou: https://www.youtube.com/@SEU_HANDLE/about → URL da API
 *
 * Como criar a API Key:
 * 1. Acesse https://console.cloud.google.com
 * 2. Crie/selecione projeto
 * 3. Ative "YouTube Data API v3"
 * 4. Credenciais → Criar credencial → Chave de API
 * 5. (Opcional) Restrinja a chave ao seu domínio
 */
export async function GET(req: NextRequest) {
  // Se as variáveis não estão configuradas, retorna placeholder
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return NextResponse.json({
      configured: false,
      message:
        'Configure YOUTUBE_API_KEY e YOUTUBE_CHANNEL_ID no .env.local',
      data: null,
    });
  }

  const BASE = 'https://www.googleapis.com/youtube/v3';

  try {
    // 1. Estatísticas do canal
    const channelRes = await fetch(
      `${BASE}/channels?part=snippet,statistics,brandingSettings&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } },
    );

    if (!channelRes.ok) {
      throw new Error(`YouTube channel fetch error: ${channelRes.status}`);
    }

    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return NextResponse.json(
        { configured: true, error: 'Canal não encontrado', data: null },
        { status: 404 },
      );
    }

    // 2. Vídeos mais recentes (search)
    const searchRes = await fetch(
      `${BASE}/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&type=video&order=date&maxResults=10&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 1800 } },
    );

    const searchData = searchRes.ok ? await searchRes.json() : null;
    const videoIds =
      searchData?.items?.map((v: any) => v.id.videoId).join(',') ?? '';

    // 3. Estatísticas individuais por vídeo
    let videosWithStats: any[] = [];
    if (videoIds) {
      const statsRes = await fetch(
        `${BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
        { next: { revalidate: 1800 } },
      );

      const statsData = statsRes.ok ? await statsRes.json() : null;
      videosWithStats =
        statsData?.items?.map((v: any) => ({
          id: v.id,
          title: v.snippet.title,
          description: v.snippet.description,
          publishedAt: v.snippet.publishedAt,
          thumbnailUrl:
            v.snippet.thumbnails?.medium?.url ??
            v.snippet.thumbnails?.default?.url,
          viewCount: parseInt(v.statistics.viewCount || '0', 10),
          likeCount: parseInt(v.statistics.likeCount || '0', 10),
          commentCount: parseInt(v.statistics.commentCount || '0', 10),
          url: `https://www.youtube.com/watch?v=${v.id}`,
        })) ?? [];
    }

    const stats = channel.statistics;

    return NextResponse.json({
      configured: true,
      data: {
        channel: {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          customUrl: channel.snippet.customUrl,
          publishedAt: channel.snippet.publishedAt,
          thumbnailUrl: channel.snippet.thumbnails?.medium?.url,
          subscriberCount: parseInt(stats.subscriberCount || '0', 10),
          viewCount: parseInt(stats.viewCount || '0', 10),
          videoCount: parseInt(stats.videoCount || '0', 10),
          hiddenSubscriberCount: stats.hiddenSubscriberCount ?? false,
        },
        videos: videosWithStats,
        totalVideoViews: videosWithStats.reduce(
          (acc, v) => acc + v.viewCount,
          0,
        ),
      },
    });
  } catch (err: any) {
    console.error('[YouTube Integration Error]', err.message);
    return NextResponse.json(
      {
        configured: true,
        error: err.message,
        data: null,
      },
      { status: 500 },
    );
  }
}
