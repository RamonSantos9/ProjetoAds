import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getActiveWorkspaceId } from '@/lib/workspace';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const activeWorkspaceId = await getActiveWorkspaceId();

  try {
    // Usamos $queryRaw para buscar os membros do workspace específico
    // Isso garante que pegamos apenas quem está vinculado na tabela WorkspaceMember
    const users = await prisma.$queryRaw<any[]>`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.image, 
        wm.role as "workspaceRole",
        u.role as "systemRole"
      FROM "User" u
      JOIN "WorkspaceMember" wm ON u.id = wm."userId"
      WHERE wm."workspaceId" = ${activeWorkspaceId}
      ORDER BY u.name ASC
    `;

    // Normalizar o retorno para o frontend
    const serializedUsers = users.map(u => ({
      ...u,
      role: u.workspaceRole || u.systemRole || 'USUARIO'
    }));

    return NextResponse.json(serializedUsers);
  } catch (error) {
    console.error('[GET /api/workspace/members]', error);
    return NextResponse.json({ error: 'Falha ao buscar membros' }, { status: 500 });
  }
}
