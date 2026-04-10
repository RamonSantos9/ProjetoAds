import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    // Busca todos os usuários do sistema para o filtro de "Criado por"
    // Em um sistema maior, filtraríamos por workspaceId
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[GET /api/workspace/members]', error);
    return NextResponse.json({ error: 'Falha ao buscar membros' }, { status: 500 });
  }
}
