'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function updateUserName(newName: string) {
  const session = await auth();
  
  if (!session?.user?.id && !session?.user?.email) {
    return { error: 'Não autorizado' };
  }

  try {
    if (session.user.id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: newName },
      });
    } else if (session.user.email) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { name: newName },
      });
    }
    
    return { success: true, name: newName };
  } catch (error) {
    console.error('[updateUserName] Erro:', error);
    return { error: 'Ocorreu um erro ao atualizar o nome no banco de dados.' };
  }
}
