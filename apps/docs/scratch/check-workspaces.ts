
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Episode Workspace IDs ---');
  const episodes = await prisma.episode.findMany({
    select: { id: true, title: true, workspaceId: true, ownerId: true }
  });
  console.log(JSON.stringify(episodes, null, 2));

  console.log('\n--- Guest Workspace IDs ---');
  const guests = await prisma.guest.findMany({
    select: { id: true, name: true, workspaceId: true, ownerId: true }
  });
  console.log(JSON.stringify(guests, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
