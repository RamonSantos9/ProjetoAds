import { NextRequest, NextResponse } from 'next/server';
import { recordPlayEvent, getPlayEvents } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getActiveWorkspaceId, validateWorkspaceAccess } from '@/lib/workspace';

// POST /api/events — Registra um evento de play do ouvinte
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { episodeId, device } = body;

    if (!episodeId || !['desktop', 'mobile'].includes(device)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    await recordPlayEvent({ episodeId, device });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// GET /api/events — Retorna os eventos registrados do workspace ativo
export async function GET() {
  const activeWorkspaceId = await getActiveWorkspaceId();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const hasAccess = await validateWorkspaceAccess(session.user.id!, activeWorkspaceId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Acesso Negado' }, { status: 403 });
  }

  try {
    const events = await getPlayEvents(activeWorkspaceId);
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Erro ao ler eventos' }, { status: 500 });
  }
}
