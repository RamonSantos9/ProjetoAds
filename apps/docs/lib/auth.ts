import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { authConfig } from '@/auth.config';
import bcrypt from 'bcryptjs';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Logica para atribuir Role baseada no dominio do email
      let role = 'USUARIO';
      if (user.email.endsWith('@aluno.faculdadeserradourada.com.br')) {
        role = 'ALUNO';
      } else if (user.email.endsWith('@faculdadeserradourada.com.br')) {
        role = 'PROFESSOR';
      }

      // Verificacao de Admin pre-definido
      if (user.email === process.env.ADMIN_EMAIL) {
        role = 'ADMIN';
      }

      // Anexamos a role ao objeto user para que o adapter use no create/update
      (user as any).role = role;

      // Atualiza a role no banco apenas se o usuário já existir
      if (user.id) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          if (dbUser) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: role as any },
            });
          }
        } catch (e) {
          console.error("Erro ao atualizar role:", e);
        }
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        // Se o usuário veio do login inicial, tentamos pegar as flags se disponíveis no objeto
        if ('joinedGlobalWorkspace' in user) token.isGlobal = (user as any).joinedGlobalWorkspace;
        if ('hasIndividualWorkspace' in user) token.isIndividual = (user as any).hasIndividualWorkspace;
        if ('onboardingCompletedAt' in user) token.onboarded = !!(user as any).onboardingCompletedAt;
      }

      // Se temos o sub (ID do usuário), garantimos que ele está no Workspace Global
      // Otimização: Só tentamos sincronizar se o token ainda não tiver a flag isGlobal ou se houver um trigger específico
      if (token.sub && !token.isGlobal) {
        try {
          // 1. Verificamos se o usuário existe ANTES de qualquer operação
          const userExists = await prisma.user.findUnique({
             where: { id: token.sub as string },
             select: { id: true, joinedGlobalWorkspace: true }
          });

          if (userExists) {
            // 2. Garante que o workspace 'global' existe
            await prisma.$executeRaw`
              INSERT INTO "GlobalWorkspace" ("id", "name", "type", "plan")
              VALUES ('global', 'Portal Administrativo', 'Acesso Geral', 'Plano Institucional')
              ON CONFLICT ("id") DO NOTHING
            `;

            // 3. Atualiza o usuário se ele ainda não estiver marcado
            if (!userExists.joinedGlobalWorkspace) {
              await prisma.user.update({
                where: { id: token.sub as string },
                data: { joinedGlobalWorkspace: true }
              });
              token.isGlobal = true;
            } else {
              token.isGlobal = true;
            }

            // 4. Garante que é membro do workspace 'global'
            await prisma.$executeRaw`
              INSERT INTO "WorkspaceMember" ("id", "userId", "workspaceId", "role", "createdAt")
              SELECT ${`wm_auth_${Math.random().toString(36).substr(2, 9)}`}, u.id, 'global', 
                     CASE WHEN u.role = 'ADMIN' THEN 'ADMIN'::"WorkspaceRole" ELSE 'EDITOR'::"WorkspaceRole" END, 
                     NOW()
              FROM "User" u
              WHERE u.id = ${token.sub}
              ON CONFLICT ("userId", "workspaceId") DO NOTHING
            `;
          }
        } catch (e) {
          console.error("[Auth] Erro ao sincronizar membro global no JWT:", e);
        }
      }

      // Se não temos as flags no token, buscamos no banco para garantir consistência
      if (token.sub && (token.isGlobal === undefined || token.isIndividual === undefined || token.onboarded === undefined)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { joinedGlobalWorkspace: true, hasIndividualWorkspace: true, onboardingCompletedAt: true }
          });
          if (dbUser) {
            token.isGlobal = dbUser.joinedGlobalWorkspace;
            token.isIndividual = dbUser.hasIndividualWorkspace;
            token.onboarded = !!dbUser.onboardingCompletedAt;
          }
        } catch (e) {
          console.error("Erro ao buscar info de workspace no JWT:", e);
        }
      }

      // Suporte para atualizacao de sessao
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.isGlobal !== undefined) token.isGlobal = session.isGlobal;
        if (session.onboarded !== undefined) token.onboarded = session.onboarded;
        if (session.hasIndividualWorkspace !== undefined) token.isIndividual = session.hasIndividualWorkspace;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        (session.user as any).joinedGlobalWorkspace = token.isGlobal;
        (session.user as any).hasIndividualWorkspace = token.isIndividual;
        (session.user as any).onboarded = token.onboarded;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
  },
});
