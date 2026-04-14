import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeById, updateEpisode, SharingConfig } from '@/lib/db';

import { auth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episode = await getEpisodeById(id);
    
    if (!episode) {
      return NextResponse.json({ error: 'Episódio não encontrado' }, { status: 404 });
    }

    // Default config if none exists
    const config: SharingConfig = episode.sharingConfig || {
      isEnabled: false,
      publicAccess: 'Restrito',
      token: ''
    };

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const episode = await getEpisodeById(id);
    
    if (!episode) {
      return NextResponse.json({ error: 'Episódio não encontrado' }, { status: 404 });
    }

    const currentConfig = episode.sharingConfig || {
      isEnabled: false,
      publicAccess: 'Restrito',
      token: ''
    };

    const newConfig: SharingConfig = {
      ...currentConfig,
      ...body
    };

    // Generate token if enabling for the first time or if missing
    if (newConfig.isEnabled && !newConfig.token) {
      // Use crypto for a safe random token instead of uuid if needed
      newConfig.token = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    await updateEpisode(id, {
      sharingConfig: newConfig
    }, session.user.id!);

    return NextResponse.json(newConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
