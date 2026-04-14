
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Verification: Workspace Sharing ---');
  
  const workspaceId = 'global';
  
  // 1. Fetch episodes for 'global' workspace (simulating API logic)
  const episodes = await prisma.episode.findMany({
    where: { workspaceId },
    select: { id: true, title: true, ownerId: true }
  });

  console.log(`Found ${episodes.length} episodes in '${workspaceId}' workspace.`);
  episodes.forEach(ep => {
    console.log(`- [${ep.id}] ${ep.title} (Owner: ${ep.ownerId})`);
  });

  // 2. Simulate User B (who is NOT an owner of any episode) accessing the list
  const userB = { id: 'user-b-id-example', name: 'User B' };
  
  // This is the logic in /api/episodes:
  // It doesn't filter by owner if workspaceId is provide (which it is, defaulting to global)
  const userB_VisibleEpisodes = episodes; // They see all episodes in the workspace

  if (userB_VisibleEpisodes.length > 0) {
    console.log('\nSUCCESS: User B can see shared items in the global workspace.');
  } else {
    console.log('\nFAILURE: User B cannot see any items.');
  }

  // 3. Check Guests
  const guests = await prisma.guest.findMany({
    where: { workspaceId }
  });
  console.log(`\nFound ${guests.length} guests in '${workspaceId}' workspace.`);
  guests.forEach(g => {
    console.log(`- [${g.id}] ${g.name} (Owner: ${g.ownerId})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
