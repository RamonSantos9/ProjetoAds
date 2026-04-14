'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { UserRole } from '@/lib/db';

export async function getWorkspaceConfig() {
  try {
    let config = await prisma.globalWorkspace.findUnique({
      where: { id: 'global' }
    });

    if (!config) {
      // Initialize if not exists
      config = await prisma.globalWorkspace.create({
        data: {
          id: 'global',
          name: 'Portal Administrativo',
          type: 'Acesso Geral'
        }
      });
    }

    return { 
      name: config.name, 
      type: config.type 
    };
  } catch (error) {
    console.error('[getWorkspaceConfig] Erro:', error);
    return { name: 'Portal Administrativo', type: 'Acesso Geral' };
  }
}

export async function updateWorkspaceName(newName: string) {
  const session = await auth();
  const userRole = (session?.user as any)?.role;

  if (userRole !== UserRole.ADMIN) {
    return { error: 'Não autorizado. Somente administradores podem alterar o nome do workspace.' };
  }

  try {
    await prisma.globalWorkspace.upsert({
      where: { id: 'global' },
      update: { name: newName },
      create: { 
        id: 'global', 
        name: newName, 
        type: 'Acesso Geral' 
      }
    });

    return { success: true, name: newName };
  } catch (error) {
    console.error('[updateWorkspaceName] Erro:', error);
    return { error: 'Falha ao atualizar o nome do workspace no banco de dados.' };
  }
}
