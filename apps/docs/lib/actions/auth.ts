'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Todos os campos são obrigatórios.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'E-mail já cadastrado.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Lógica de atribuição de Role automática
    let role: 'ALUNO' | 'PROFESSOR' | 'USUARIO' = 'USUARIO';
    if (email.endsWith('@aluno.faculdadeserradourada.com.br')) {
      role = 'ALUNO';
    } else if (email.endsWith('@faculdadeserradourada.com.br')) {
      role = 'PROFESSOR';
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erro no registro:', error);
    return { error: 'Algo deu errado ao criar sua conta.' };
  }
}
