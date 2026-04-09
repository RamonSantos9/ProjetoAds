import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('--- Criando Administrador Padrão ---');

  const email = 'admin@podcastads.com';
  const password = 'admin';

  const hash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Administrador já existe!');
    return;
  }

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      password: hash,
      image: 'https://avatars.githubusercontent.com/u/1',
    },
  });

  console.log('✅ Administrador criado com sucesso!');
  console.log(`Email: ${email}`);
  console.log(`Senha: ${password}`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
