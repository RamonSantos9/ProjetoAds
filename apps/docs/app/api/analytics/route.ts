import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    // Usa $queryRaw para evitar validação do Prisma engine em cache (schema antigo)
    const allUsers = await prisma.$queryRaw<
      Array<{
        createdAt: Date;
        academicRole: string | null;
        sourceChannel: string | null;
        joinedGlobalWorkspace: boolean;
        hasIndividualWorkspace: boolean;
        onboardingCompletedAt: Date | null;
      }>
    >`
      SELECT
        "createdAt",
        "academicRole",
        "sourceChannel",
        "joinedGlobalWorkspace",
        "hasIndividualWorkspace",
        "onboardingCompletedAt"
      FROM "User"
    `;

    const totalUsers = allUsers.length;
    const completedOnboarding = allUsers.filter((u) => u.onboardingCompletedAt !== null).length;

    // Distribuição de canal de aquisição
    const sourceCounts: Record<string, number> = {};
    for (const u of allUsers) {
      const key = u.sourceChannel || 'Não informado';
      sourceCounts[key] = (sourceCounts[key] || 0) + 1;
    }
    const sourceData = Object.entries(sourceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Distribuição de vínculo acadêmico
    const roleCounts: Record<string, number> = {};
    for (const u of allUsers) {
      const key = u.academicRole || 'Não informado';
      roleCounts[key] = (roleCounts[key] || 0) + 1;
    }
    const roleData = Object.entries(roleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Preferência de workspace
    const withIndividual = allUsers.filter((u) => u.hasIndividualWorkspace).length;
    const workspaceData = [
      { name: 'Apenas Global', value: totalUsers - withIndividual },
      { name: 'Global + Individual', value: withIndividual },
    ];

    // Novos usuários por semana (últimas 8 semanas)
    const now = new Date();
    const weeksData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (7 - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = allUsers.filter((u) => {
        const d = new Date(u.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length;

      return {
        week: `S${i + 1}`,
        users: count,
        label: weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      };
    });

    return NextResponse.json({
      totalUsers,
      completedOnboarding,
      onboardingRate: totalUsers > 0 ? Math.round((completedOnboarding / totalUsers) * 100) : 0,
      withIndividualWorkspace: withIndividual,
      workspaceRate: totalUsers > 0 ? Math.round((withIndividual / totalUsers) * 100) : 0,
      topSource: sourceData[0]?.name ?? '—',
      topRole: roleData[0]?.name ?? '—',
      sourceData,
      roleData,
      workspaceData,
      weeksData,
    });
  } catch (error) {
    console.error('[GET /api/analytics]', error);
    return NextResponse.json({ error: 'Erro ao buscar analytics.' }, { status: 500 });
  }
}
