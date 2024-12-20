import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [], // added later in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicRoute = nextUrl.pathname.startsWith('/api/auth') || 
                           nextUrl.pathname.startsWith('/_next') ||
                           nextUrl.pathname.startsWith('/public');
      const isAuthPage = nextUrl.pathname === '/login' || 
                        nextUrl.pathname === '/register';

      // Always allow public routes and assets
      if (isPublicRoute) {
        return true;
      }

      // Redirect to home if logged in and trying to access auth pages
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Allow access to auth pages if not logged in
      if (isAuthPage) {
        return true;
      }

      // For all other routes, require authentication
      return isLoggedIn;
    },
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;