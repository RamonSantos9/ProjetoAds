import type { NextAuthConfig } from 'next-auth';

// Este arquivo é usado pelo middleware (Edge runtime).
// NÃO inclua lógica de banco de dados ou bcrypt aqui.
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/app');
      const isAuthRoute = path.startsWith('/sign-in') || path.startsWith('/sign-up');

      if (isProtectedRoute && !isLoggedIn) return false;
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL('/admin/home', nextUrl));
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};
