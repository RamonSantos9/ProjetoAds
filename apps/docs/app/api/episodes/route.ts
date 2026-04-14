import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getActiveWorkspaceId, validateWorkspaceAccess } from '@/lib/workspace';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const activeWorkspaceId = await getActiveWorkspaceId();

  // VALIDAR ACESSO
  const hasAccess = await validateWorkspaceAccess(session.user.id!, activeWorkspaceId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Acesso Negado' }, { status: 403 });
  }

  try {
    const episodes = await prisma.episode.findMany({
      where: { workspaceId: activeWorkspaceId },
      include: { 
        guests: { include: { guest: true } },
        owner: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('[GET /api/episodes]', error);
    return NextResponse.json({ error: 'Falha ao buscar episódios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const activeWorkspaceId = await getActiveWorkspaceId();

    // VALIDAR ACESSO
    const hasAccess = await validateWorkspaceAccess(session.user.id!, activeWorkspaceId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Acesso Negado' }, { status: 403 });
    }
    
    const body = await request.json();

    const episode = await prisma.episode.create({
      data: {
        ...body,
        ownerId: session.user.id!,
        workspaceId: activeWorkspaceId,
        // Limpar campos que não pertencem ao modelo direto se necessário
        guests: undefined, 
      }
    });

    return NextResponse.json({ success: true, episode });
  } catch (error: any) {
    console.error('[POST /api/episodes]', error);
    return NextResponse.json(
      { error: error.message || 'Falha ao salvar episódio' },
      { status: 500 },
    );
  }
}
