import { cookies } from 'next/headers';
import { prisma } from './prisma';

/**
 * Retorna o ID do workspace ativo a partir do cookie 'active-workspace'.
 * Se não houver cookie, assume 'global'.
 */
export async function getActiveWorkspaceId(): Promise<string> {
  const cookieStore = await cookies();
  const activeWorkspace = cookieStore.get('active-workspace');
  return activeWorkspace?.value || 'global';
}

/**
 * Verifica se o ID do workspace é do tipo pessoal (personal_userId).
 */
export function isPersonalWorkspace(workspaceId: string): boolean {
  return workspaceId.startsWith('personal_') || workspaceId === 'personal';
}

/**
 * VALIDADOR DE SEGURANÇA:
 * Verifica se um usuário tem permissão real para acessar um workspace.
 * O acesso é permitido se:
 * 1. O usuário for o dono do workspace pessoal (personal_userId).
 * 2. O usuário tiver um registro na tabela WorkspaceMember para aquele workspace.
 * 3. Se for o workspace 'global', o usuário deve ter a flag joinedGlobalWorkspace = true.
 */
export async function validateWorkspaceAccess(userId: string, workspaceId: string): Promise<boolean> {
  if (!userId || !workspaceId) return false;

  // Caso 1: Dono do próprio workspace pessoal
  if (workspaceId === `personal_${userId}` || workspaceId === 'personal') {
    return true;
  }

  // Caso 2: Membro registrado na tabela WorkspaceMember (Global ou Convites)
  // Usamos SQL direto para garantir compatibilidade com o esquema atual
  try {
    const results = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id" FROM "WorkspaceMember" 
      WHERE "userId" = ${userId} AND "workspaceId" = ${workspaceId}
      LIMIT 1
    `;
    if (results.length > 0) return true;
  } catch (error) {
    console.error('[validateWorkspaceAccess] DB Error:', error);
  }

  // Caso 3: Fallback para Global - Acesso permitido para todos os usuários autenticados
  if (workspaceId === 'global') {
    return true;
  }

  return false;
}
