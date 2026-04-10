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
      }

      // Se não temos as flags no token, buscamos no banco para garantir consistência
      if (token.sub && (token.isGlobal === undefined || token.isIndividual === undefined)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { joinedGlobalWorkspace: true, hasIndividualWorkspace: true }
          });
          if (dbUser) {
            token.isGlobal = dbUser.joinedGlobalWorkspace;
            token.isIndividual = dbUser.hasIndividualWorkspace;
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        (session.user as any).joinedGlobalWorkspace = token.isGlobal;
        (session.user as any).hasIndividualWorkspace = token.isIndividual;
        if (token.name) session.user.name = token.name;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },
  },
});
