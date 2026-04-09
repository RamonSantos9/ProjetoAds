import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// O proxy roda no Edge runtime — usa apenas authConfig (sem Prisma/bcrypt)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
