import { NextResponse } from 'next/server';
import { getProjects, addProject, StudioProject } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const projects = await getProjects(session.user.id as string, (session.user as any).role);
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

  try {
    const body: StudioProject = await request.json();
    if (!body.id) {
      body.id = `proj-${Date.now()}`;
    }
    await addProject(body, session.user.id);
    return NextResponse.json({ success: true, project: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao criar projeto' },
      { status: 500 },
    );
  }
}
