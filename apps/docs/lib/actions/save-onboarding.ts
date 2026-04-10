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
    // Usa SQL direto para evitar validação do Prisma engine (schema pode estar em cache)
    const now = new Date().toISOString();

    if (userId) {
      await prisma.$executeRaw`
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
        WHERE id = ${userId}
      `;
    } else {
      await prisma.$executeRaw`
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
        WHERE email = ${userEmail}
      `;
    }

    return { success: true };
  } catch (error) {
    console.error('[saveOnboardingData]', error);
    return { error: 'Erro ao salvar dados do onboarding.' };
  }
}
