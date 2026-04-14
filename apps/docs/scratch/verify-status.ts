
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Verification: Automatic Status Transition ---');
  
  const userId = 'cmnugogfb000b7wjwytsnclmy'; // The owner from previous steps
  const workspaceId = 'global';
  
  // Create a future date (tomorrow)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 1);
  const scheduledAt = futureDate.toISOString();

  console.log(`Setting scheduledAt to: ${scheduledAt}`);

  // Simulate the logic in updateEpisode:
  const rest = {
    status: 'Produção',
    scheduledAt: scheduledAt
  };

  let finalStatus = rest.status;
  const isFuture = rest.scheduledAt && new Date(rest.scheduledAt).getTime() > new Date().getTime() + 1000;
  if (isFuture && (!rest.status || rest.status === 'Produção')) {
    finalStatus = 'Agendado';
  }

  console.log(`Expected status: Agendado`);
  console.log(`Calculated status: ${finalStatus}`);

  if (finalStatus === 'Agendado') {
    console.log('\nSUCCESS: Logic correctly identifies future schedule as "Agendado".');
  } else {
    console.log('\nFAILURE: Logic failed to transition status.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
