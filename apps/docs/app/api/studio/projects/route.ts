import { NextResponse } from 'next/server';
import { getProjects, addProject, StudioProject } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getActiveWorkspaceId, validateWorkspaceAccess } from '@/lib/workspace';

export async function GET() {
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
    const projects = await getProjects(
      session.user.id as string, 
      (session.user as any).role,
      activeWorkspaceId
    );
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar projetos' },
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
    const body: StudioProject = await request.json();
    if (!body.id) {
      body.id = `proj-${Date.now()}`;
    }
    await addProject(body, session.user.id, activeWorkspaceId);
    return NextResponse.json({ success: true, project: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao criar projeto' },
      { status: 500 },
    );
  }
}
