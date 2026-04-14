import { NextResponse } from 'next/server';
import {
  getVisualAssets,
  addVisualAsset,
  deleteVisualAsset,
  VisualAsset,
} from '@/lib/db';
import { auth } from '@/lib/auth';
import { getActiveWorkspaceId, validateWorkspaceAccess } from '@/lib/workspace';

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
    const assets = await getVisualAssets(activeWorkspaceId);
    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read assets' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const activeWorkspaceId = await getActiveWorkspaceId();

  // VALIDAR ACESSO
  const hasAccess = await validateWorkspaceAccess(session.user.id!, activeWorkspaceId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Acesso Negado' }, { status: 403 });
  }

  try {
    const body: VisualAsset = await request.json();
    await addVisualAsset(body, session.user.id, activeWorkspaceId);
    return NextResponse.json({ success: true, asset: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save asset' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id)
      return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await deleteVisualAsset(id, session.user.id, (session.user as any).role);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 },
    );
  }
}
