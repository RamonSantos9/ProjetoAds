import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { action } = await req.json(); // 'ACCEPT' or 'DECLINE'
    const { id } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { id }
    });

    if (!invite) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 });
    }

    if (invite.email !== session.user.email) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    if (action === 'DECLINE') {
      await prisma.workspaceInvite.update({
        where: { id },
        data: { status: 'DECLINED' }
      });
      return NextResponse.json({ success: true, status: 'DECLINED' });
    }

    if (action === 'ACCEPT') {
      // Atualizar status do convite
      await prisma.workspaceInvite.update({
        where: { id },
        data: { status: 'ACCEPTED' }
      });
      
      // Conectar o usuário ao workspace global (se for o caso) ou lógica customizada no futuro
      await prisma.user.update({
        where: { id: session.user.id },
        data: { joinedGlobalWorkspace: true }
      });

      // ADICIONAR AO WORKSPACEMEMBER
      const workspaceId = invite.workspaceId || 'global';
      const workspaceRole = invite.role === 'ADMIN' ? 'ADMIN' : 'EDITOR';

      if (workspaceId === 'global') {
        await prisma.$executeRaw`
          INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
          VALUES ('global', 'Portal Administrativo', 'Acesso Geral', 'Plano Institucional')
          ON CONFLICT ("id") DO NOTHING
        `;
      } else {
        await prisma.$executeRaw`
          INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
          VALUES (${workspaceId}, 'Espaço de Trabalho', 'Colaboração', 'Plano Compartilhado')
          ON CONFLICT ("id") DO NOTHING
        `;
      }

      await prisma.$executeRaw`
        INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
        VALUES (${`wm_${Math.random().toString(36).substr(2, 9)}`}, ${session.user.id}, ${workspaceId}, ${workspaceRole}::"WorkspaceRole", NOW())
        ON CONFLICT ("userId", "workspaceId") DO NOTHING
      `;
      
      return NextResponse.json({ success: true, status: 'ACCEPTED' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });

  } catch (error) {
    console.error('[PATCH /api/workspace/invites]', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { id }
    });

    if (!invite) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 });
    }

    // Apenas Admins ou quem enviou o convite pode excluir
    const isAdmin = (session.user as any).role === 'ADMIN';
    if (!isAdmin && invite.inviterId !== session.user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    await prisma.workspaceInvite.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[DELETE /api/workspace/invites]', error);
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
  }
}
