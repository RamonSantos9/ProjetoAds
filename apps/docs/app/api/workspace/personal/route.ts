import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function generateWorkspaceName(name: string | null | undefined): string {
  const firstName = name?.split(' ')[0] || 'Meu';
  return `${firstName}'s Workspace`;
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, hasIndividualWorkspace: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  if (user.hasIndividualWorkspace) {
    return NextResponse.json(
      { error: 'Você já atingiu o limite de 1 espaço de trabalho pessoal.' },
      { status: 409 }
    );
  }

  const workspaceId = `personal_${user.id}`;
  const workspaceName = generateWorkspaceName(user.name);

  try {
    // Usamos $executeRaw para evitar erros de tipos caso o Prisma Client não tenha regenerado ainda (problema de EPERM no Windows)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { hasIndividualWorkspace: true },
      }),
      prisma.$executeRaw`
        INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
        VALUES (${workspaceId}, 'Meu Workspace', 'Espaço Pessoal', 'Plano Pessoal')
        ON CONFLICT ("id") DO NOTHING
      `,
      prisma.$executeRaw`
        INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
        VALUES (${`wm_${Math.random().toString(36).substr(2, 9)}`}, ${user.id}, ${workspaceId}, 'ADMIN'::"WorkspaceRole", NOW())
        ON CONFLICT ("userId", "workspaceId") DO NOTHING
      `
    ]);

    return NextResponse.json({ success: true, name: workspaceName, workspaceRole: 'ADMIN' });
  } catch (error) {
    console.error('Erro ao criar workspace pessoal:', error);
    return NextResponse.json({ error: 'Erro ao criar workspace' }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, hasIndividualWorkspace: true },
  });

  if (!user?.hasIndividualWorkspace) {
    return NextResponse.json({
      hasIndividualWorkspace: false,
      name: null,
      workspaceRole: null,
    });
  }

  const workspaceId = `personal_${user.id}`;
  
  // Busca o role direto via Raw SQL para garantir que pegamos do WorkspaceMember
  const members = await prisma.$queryRaw<Array<{ role: string }>>`
    SELECT "role" FROM "WorkspaceMember" WHERE "userId" = ${user.id} AND "workspaceId" = ${workspaceId}
  `;
  
  const role = members[0]?.role || 'ADMIN';

  return NextResponse.json({
    hasIndividualWorkspace: true,
    name: generateWorkspaceName(user.name),
    workspaceRole: role,
  });
}
