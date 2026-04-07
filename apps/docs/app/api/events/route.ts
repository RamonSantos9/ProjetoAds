import { NextRequest, NextResponse } from 'next/server';
import { recordPlayEvent, getPlayEvents } from '@/lib/db';

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

// GET /api/events — Retorna todos os eventos registrados
export async function GET() {
  try {
    const events = await getPlayEvents();
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Erro ao ler eventos' }, { status: 500 });
  }
}
