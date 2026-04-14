import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserRole } from '@/lib/db';
import { getActiveWorkspaceId, isPersonalWorkspace } from '@/lib/workspace';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const activeWorkspaceId = await getActiveWorkspaceId();
  const userId = session.user.id!;

  try {
    // Mapear role do sistema para role do workspace
    const systemRole = (session.user as any).role;
    const workspaceRole = systemRole === 'ADMIN' ? 'ADMIN' : 'EDITOR';

    // AUTO-SYNC & MASS BACKFILL:
    // 1. Garantir que o usuário atual existe no workspace ativo
    // Usamos INSERT...SELECT para evitar erro de FK em caso de reset do banco
    // 1.a Garantir que o Workspace existe na tabela GlobalWorkspace
    if (activeWorkspaceId === 'global') {
      await prisma.$executeRaw`
        INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
        VALUES ('global', 'Portal Administrativo', 'Acesso Geral', 'Plano Institucional')
        ON CONFLICT ("id") DO NOTHING
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
        VALUES (${activeWorkspaceId}, 'Meu Workspace', 'Espaço Pessoal', 'Plano Pessoal')
        ON CONFLICT ("id") DO NOTHING
      `;
    }

    // 1.b Garantir que o membro pertence ao Workspace ativo
    await prisma.$executeRaw`
      INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
      SELECT 
        ${`wm_${Math.random().toString(36).substr(2, 9)}`}, 
        u.id, 
        ${activeWorkspaceId}, 
        CASE WHEN u.role = 'ADMIN' THEN 'ADMIN'::"WorkspaceRole" ELSE 'EDITOR'::"WorkspaceRole" END, 
        NOW()
      FROM "User" u
      WHERE u.id = ${userId}
      ON CONFLICT ("userId", "workspaceId") DO NOTHING
    `;

    // 2. Se estivermos no workspace GLOBAL, garantimos que TODOS os usuários do sistema façam parte dele
    // Isso resolve o problema de mostrar apenas 1 membro no Portal Administrativo
    if (activeWorkspaceId === 'global') {
      await prisma.$executeRaw`
        INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
        SELECT 
          'wm_auto_' || substr(md5(random()::text), 1, 10), 
          u.id, 
          'global', 
          CASE WHEN u.role = 'ADMIN' THEN 'ADMIN'::"WorkspaceRole" ELSE 'EDITOR'::"WorkspaceRole" END, 
          NOW()
        FROM "User" u
        WHERE u."joinedGlobalWorkspace" = true
        ON CONFLICT ("userId", "workspaceId") DO NOTHING
      `;

      // 3. RECUPERAÇÃO DE CONTEÚDO: Garante que itens sem workspaceId (ou com ID antigo) sejam movidos para o 'global'
      // Isso recupera os podcasts que o usuário relatou terem sumido
      await prisma.$executeRaw`UPDATE "Episode" SET "workspaceId" = 'global' WHERE "workspaceId" IS NULL OR "workspaceId" = ''`;
      await prisma.$executeRaw`UPDATE "StudioProject" SET "workspaceId" = 'global' WHERE "workspaceId" IS NULL OR "workspaceId" = ''`;
      await prisma.$executeRaw`UPDATE "Guest" SET "workspaceId" = 'global' WHERE "workspaceId" IS NULL OR "workspaceId" = ''`;
      await prisma.$executeRaw`UPDATE "VisualAsset" SET "workspaceId" = 'global' WHERE "workspaceId" IS NULL OR "workspaceId" = ''`;
    }

    // Caso 1: Workspace Global
    if (activeWorkspaceId === 'global') {
      let config = await prisma.globalWorkspace.findUnique({
        where: { id: 'global' }
      });

      if (!config) {
        config = await prisma.globalWorkspace.create({
          data: {
            id: 'global',
            name: 'Portal Administrativo',
            type: 'Acesso Geral',
            plan: 'Plano Institucional'
          }
        });
      }

      // Contagem REAL baseada na tabela WorkspaceMember
      const members = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint FROM "WorkspaceMember" WHERE "workspaceId" = 'global'
      `;
      const memberCount = Number(members[0]?.count || 0);

      return NextResponse.json({
        ...config,
        memberCount
      });
    }

    // Caso 2: Workspace Pessoal
    if (isPersonalWorkspace(activeWorkspaceId)) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      const firstName = user.name?.split(' ')[0] || 'Meu';
      
      // Contagem REAL baseada na tabela WorkspaceMember para o pessoal
      const members = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint FROM "WorkspaceMember" WHERE "workspaceId" = ${activeWorkspaceId}
      `;
      const memberCount = Number(members[0]?.count || 1);

      return NextResponse.json({
        id: activeWorkspaceId,
        name: `${firstName}'s Workspace`,
        type: 'Espaço Pessoal',
        plan: 'Plano Pessoal',
        memberCount
      });
    }

    return NextResponse.json({ error: 'Workspace inválido' }, { status: 400 });
  } catch (error) {
    console.error('[GET /api/workspace/config] Error:', error);
    return NextResponse.json({ 
      name: 'Portal Administrativo', 
      type: 'Acesso Geral', 
      plan: 'Plano Institucional', 
      memberCount: 1 
    });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  const activeWorkspaceId = await getActiveWorkspaceId();

  if (activeWorkspaceId !== 'global') {
    return NextResponse.json({ error: 'Não é possível editar este workspace' }, { status: 403 });
  }

  if (userRole !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { name } = await request.json();
    
    const config = await prisma.globalWorkspace.upsert({
      where: { id: 'global' },
      update: { name },
      create: { 
        id: 'global', 
        name, 
        type: 'Acesso Geral' 
      }
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao atualizar workspace' }, { status: 500 });
  }
}
