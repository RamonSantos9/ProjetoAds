import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { addEpisode, Episode } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const userId = session.user.id;
  const userObj = session.user as any;
  const role = userObj.role;
  const isGlobal = userObj.joinedGlobalWorkspace === true;
  
  // Perfil elevado (Admin/Professor) ou quem faz parte do Workspace Global vê tudo
  const canSeeAll = role === 'ADMIN' || role === 'PROFESSOR' || isGlobal;

  try {
    const episodes = await prisma.episode.findMany({
      where: canSeeAll ? {} : { ownerId: userId },
      include: { 
        guests: { include: { guest: true } },
        owner: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Simplificar o mapeamento aqui ou usar a função helper se estivesse disponível globalmente
    return NextResponse.json(episodes);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar episódios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body: Episode = await request.json();
    await addEpisode(body, session.user.id);
    return NextResponse.json({ success: true, episode: body });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Falha ao salvar episódio' },
      { status: 500 },
    );
  }
}
