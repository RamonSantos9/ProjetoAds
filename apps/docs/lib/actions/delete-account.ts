'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function deleteUserAccount() {
  const session = await auth();

  if (!session?.user) {
    return { error: 'Não autorizado' };
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email;

  if (!userId && !userEmail) {
    return { error: 'Não foi possível identificar o usuário.' };
  }

  try {
    if (userId) {
      await prisma.user.delete({ where: { id: userId } });
    } else if (userEmail) {
      await prisma.user.delete({ where: { email: userEmail } });
    }
    return { success: true };
  } catch (error) {
    console.error('[deleteUserAccount] Erro:', error);
    return { error: 'Ocorreu um erro ao excluir a conta.' };
  }
}
