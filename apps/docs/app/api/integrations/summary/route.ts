import { NextResponse } from 'next/server';

/**
 * GET /api/integrations/summary
 *
 * Rota agregadora: busca simultaneamente dados do Spotify, YouTube e eventos internos.
 * Retorna um objeto consolidado para uso no painel de estatísticas.
 *
 * Utilizada pela página /admin/estatisticas para enriquecer os gráficos com dados externos.
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;

  try {
    const [eventsRes, spotifyRes, youtubeRes] = await Promise.allSettled([
      fetch(`${origin}/api/events`, { next: { revalidate: 60 } }),
      fetch(`${origin}/api/integrations/spotify`, { next: { revalidate: 3600 } }),
      fetch(`${origin}/api/integrations/youtube`, { next: { revalidate: 3600 } }),
    ]);

    const events =
      eventsRes.status === 'fulfilled' && eventsRes.value.ok
        ? await eventsRes.value.json()
        : [];

    const spotifyRaw =
      spotifyRes.status === 'fulfilled' && spotifyRes.value.ok
        ? await spotifyRes.value.json()
        : { configured: false, data: null };

    const youtubeRaw =
      youtubeRes.status === 'fulfilled' && youtubeRes.value.ok
        ? await youtubeRes.value.json()
        : { configured: false, data: null };

    // Métricas agregadas calculadas do lado do servidor
    const desktopPlays = Array.isArray(events)
      ? events.filter((e: any) => e.device === 'desktop').length
      : 0;
    const mobilePlays = Array.isArray(events)
      ? events.filter((e: any) => e.device === 'mobile').length
      : 0;

    return NextResponse.json({
      events: {
        total: Array.isArray(events) ? events.length : 0,
        desktop: desktopPlays,
        mobile: mobilePlays,
        raw: events,
      },
      spotify: spotifyRaw,
      youtube: youtubeRaw,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Integration Summary Error]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
