import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_SHOW_ID = process.env.SPOTIFY_SHOW_ID; // ID do seu podcast no Spotify

/**
 * Obtém um token de acesso via Client Credentials Flow (não requer login do usuário).
 * Bom para dados públicos do podcast (episódios, descrições, capa, total de plays públicos).
 */
async function getSpotifyAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    next: { revalidate: 3600 }, // Cache o token por 1 hora
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * GET /api/integrations/spotify
 *
 * Retorna dados públicos do podcast do Spotify:
 * - Nome, descrição, total de episódios, seguidores
 * - Lista dos episódios mais recentes
 *
 * Requer no .env.local:
 *   SPOTIFY_CLIENT_ID=...
 *   SPOTIFY_CLIENT_SECRET=...
 *   SPOTIFY_SHOW_ID=... (ex: "7p9oPBU1UYDQ6CtGWuNZca")
 *
 * Para obter o Show ID: abra o podcast no Spotify Web, o ID está na URL:
 * https://open.spotify.com/show/[SHOW_ID_AQUI]
 */
export async function GET() {
  // Se as variáveis não estão configuradas, retorna dados de placeholder
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_SHOW_ID) {
    return NextResponse.json({
      configured: false,
      message:
        'Configure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET e SPOTIFY_SHOW_ID no .env.local',
      data: null,
    });
  }

  try {
    const token = await getSpotifyAccessToken();

    // Busca informações do Show (podcast)
    const showRes = await fetch(
      `https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}?market=BR`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 }, // Cache por 1 hora
      },
    );

    if (!showRes.ok) {
      throw new Error(`Spotify show fetch error: ${showRes.status}`);
    }

    const show = await showRes.json();

    // Busca episódios recentes
    const episodesRes = await fetch(
      `https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes?market=BR&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      },
    );

    const episodesData = episodesRes.ok ? await episodesRes.json() : null;

    return NextResponse.json({
      configured: true,
      data: {
        show: {
          id: show.id,
          name: show.name,
          description: show.description,
          totalEpisodes: show.total_episodes,
          followers: show.followers?.total ?? 0,
          images: show.images,
          externalUrl: show.external_urls?.spotify,
          publisher: show.publisher,
          languages: show.languages,
        },
        episodes: episodesData?.items?.map((ep: any) => ({
          id: ep.id,
          name: ep.name,
          description: ep.description,
          durationMs: ep.duration_ms,
          releaseDate: ep.release_date,
          externalUrl: ep.external_urls?.spotify,
        })) ?? [],
      },
    });
  } catch (err: any) {
    console.error('[Spotify Integration Error]', err.message);
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
