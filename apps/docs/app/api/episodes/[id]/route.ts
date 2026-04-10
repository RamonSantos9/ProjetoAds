import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeById, getEpisodeBySlug, updateEpisode, deleteEpisode } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Try by ID
    let episode = await getEpisodeById(id);
    
    // 2. If not found, try by Slug
    if (!episode) {
      episode = await getEpisodeBySlug(id);
    }

    if (!episode) {
      return NextResponse.json({ error: `Episódio não encontrado (ID/Slug): ${id}` }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao ler banco de dados' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // We only allow updating some fields via this route for now
    const { title, summary, transcriptionText, segments, status, tracks, assets } = body;
    
    await updateEpisode(id, {
      ...(title && { title }),
      ...(summary && { summary }),
      ...(transcriptionText && { transcriptionText }),
      ...(segments && { segments }),
      ...(status && { status }),
      ...(tracks && { tracks }),
      ...(assets && { assets }),
    }, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteEpisode(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Delete Episode] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
