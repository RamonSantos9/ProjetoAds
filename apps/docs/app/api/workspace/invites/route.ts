import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    // Verificar se o email já está cadastrado no sistema
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'E-mail não está cadastrado no sistema. O usuário deve criar uma conta primeiro.' }, { status: 404 });
    }

    if (existingUser.id === session.user.id!) {
      return NextResponse.json({ error: 'Você não pode convidar a si mesmo.' }, { status: 400 });
    }

    // Verificar se já tem convite pendente
    const pendingInvite = await prisma.workspaceInvite.findFirst({
      where: {
        email,
        workspaceId: 'global',
        status: 'PENDING'
      }
    });

    if (pendingInvite) {
      return NextResponse.json({ error: 'Este usuário já possui um convite pendente.' }, { status: 400 });
    }

    const invite = await prisma.workspaceInvite.create({
      data: {
        email,
        role: 'USUARIO', // Convites de novos membros assumem assento básico inicialmente
        inviterId: session.user.id!,
        workspaceId: 'global',
        status: 'PENDING'
      }
    });

    return NextResponse.json(invite);
  } catch (error) {
    console.error('[POST /api/workspace/invites]', error);
    return NextResponse.json({ error: 'Erro ao enviar convite' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'received'; // 'received' or 'sent'

  try {
    if (type === 'received') {
      // Convites que o usuário logado recebeu
      const invites = await prisma.workspaceInvite.findMany({
        where: {
          email: session.user.email,
          status: { in: ['PENDING', 'ACCEPTED'] }
        },
        include: {
          inviter: {
            select: {
              name: true,
              email: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return NextResponse.json(invites);
    } else {
      // Convites que o usuário logado enviou (ou todos enviados nesse workspace global para admins verem)
      // Como é workspace global, admins podem ver todos
      const isAdmin = (session.user as any).role === 'ADMIN';
      
      const invites = await prisma.workspaceInvite.findMany({
        where: {
          workspaceId: 'global',
          status: 'PENDING',
          ...(isAdmin ? {} : { inviterId: session.user.id! }) // se não admin, vê apenas os que ele enviou
        },
        include: {
          inviter: {
            select: {
              email: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return NextResponse.json(invites);
    }

  } catch (error) {
    console.error('[GET /api/workspace/invites]', error);
    return NextResponse.json({ error: 'Erro ao buscar convites' }, { status: 500 });
  }
}
