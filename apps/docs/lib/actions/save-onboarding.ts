'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export interface OnboardingData {
  academicRole: string;
  sourceChannel: string | null;
  joinedGlobalWorkspace: boolean;
  hasIndividualWorkspace: boolean;
  acceptedTerms: boolean;
  wantsUpdates: boolean;
}

export async function saveOnboardingData(data: OnboardingData) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Não autenticado.' };
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email;

  if (!userId && !userEmail) {
    return { error: 'Não foi possível identificar o usuário.' };
  }

  try {
    const now = new Date().toISOString();
    
    // Força a leitura do banco para pegar o ID verdadeiro (CUID) independente do que estiver no JWT/Session inicial
    const dbUser = await prisma.user.findUnique({ 
      where: { email: userEmail! }, 
      select: { id: true } 
    });
    
    const finalUserId = dbUser?.id || userId;

    if (!finalUserId) return { error: 'Usuário não encontrado.' };

    await prisma.$transaction(async (tx) => {
      // 1. Atualizar flags do usuário
      await tx.$executeRaw`
        UPDATE "User"
        SET
          "academicRole"           = ${data.academicRole || null},
          "sourceChannel"          = ${data.sourceChannel || null},
          "joinedGlobalWorkspace"  = ${data.joinedGlobalWorkspace},
          "hasIndividualWorkspace" = ${data.hasIndividualWorkspace},
          "acceptedTerms"          = ${data.acceptedTerms},
          "wantsUpdates"           = ${data.wantsUpdates},
          "onboardingCompletedAt"  = ${now}::timestamp,
          "updatedAt"              = ${now}::timestamp
        WHERE id = ${finalUserId}
      `;

      // 2. Criar adesão ao Workspace Global se selecionado
      if (data.joinedGlobalWorkspace) {
        await tx.$executeRaw`
          INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
          VALUES ('global', 'Portal Administrativo', 'Acesso Geral', 'Plano Institucional')
          ON CONFLICT ("id") DO NOTHING
        `;
        await tx.$executeRaw`
          INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
          VALUES (${`wm_onb_${Math.random().toString(36).substr(2, 9)}`}, ${finalUserId}, 'global', 'EDITOR'::"WorkspaceRole", NOW())
          ON CONFLICT ("userId", "workspaceId") DO NOTHING
        `;
      }

      // 3. Criar adesão ao Workspace Pessoal se selecionado
      if (data.hasIndividualWorkspace) {
        const personalId = `personal_${finalUserId}`;
        await tx.$executeRaw`
          INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
          VALUES (${personalId}, 'Meu Workspace', 'Espaço Pessoal', 'Plano Pessoal')
          ON CONFLICT ("id") DO NOTHING
        `;
        await tx.$executeRaw`
          INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
          VALUES (${`wm_onb_${Math.random().toString(36).substr(2, 9)}`}, ${finalUserId}, ${personalId}, 'ADMIN'::"WorkspaceRole", NOW())
          ON CONFLICT ("userId", "workspaceId") DO NOTHING
        `;
      }
    });

    return { success: true };
  } catch (error) {
    console.error('[saveOnboardingData]', error);
    return { error: 'Erro ao salvar dados do onboarding.' };
  }
}
