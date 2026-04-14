import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { dataUsageConsent: true },
  });
  return NextResponse.json({ dataUsageConsent: user?.dataUsageConsent ?? false });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const { dataUsageConsent } = await request.json();
  await prisma.user.update({
    where: { email: session.user.email },
    data: { dataUsageConsent: Boolean(dataUsageConsent) },
  });
  return NextResponse.json({ success: true, dataUsageConsent });
}
