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
        (session.user as any).onboarded = token.onboarded;
        (session.user as any).hasIndividualWorkspace = token.isIndividual;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.onboarded = !!(user as any).onboardingCompletedAt;
        token.isIndividual = !!(user as any).hasIndividualWorkspace;
      }
      if (trigger === "update" && session) {
        if (session.onboarded !== undefined) token.onboarded = session.onboarded;
        if (session.hasIndividualWorkspace !== undefined) token.isIndividual = session.hasIndividualWorkspace;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/app') || path.startsWith('/dashboard');
      const isAuthRoute = path.startsWith('/sign-in') || path.startsWith('/sign-up');
      const isPopupCallback = path === '/auth/callback-popup';
      const isOnboardingRoute = path.startsWith('/onboarding');
      const isApiRoute = path.startsWith('/api');

      if (isPopupCallback || isApiRoute) return true;

      const hasCompletedOnboarding = !!(auth?.user as any)?.onboarded;

      // Handle user hasn't completed onboarding -> force redirect to /onboarding
      if (isLoggedIn && !hasCompletedOnboarding && !isOnboardingRoute && !isAuthRoute) {
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      // Prevent accessing onboarding again if already completed
      if (isLoggedIn && isOnboardingRoute && hasCompletedOnboarding) {
        const targetUrl = new URL('/admin/home', nextUrl);
        return Response.redirect(targetUrl);
      }

      if (isProtectedRoute && !isLoggedIn) return false;
      
      if (isAuthRoute && isLoggedIn && !isPopupCallback) {
        if (!hasCompletedOnboarding) {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }
        const userRole = (auth.user as any)?.role;
        const target = (userRole === 'ADMIN' || userRole === 'PROFESSOR' || userRole === 'ALUNO') 
          ? '/admin/home' 
          : '/dashboard/home';
        return Response.redirect(new URL(target, nextUrl));
      }
      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
};
