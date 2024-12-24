import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      
      // Get the correct base URL
      const baseUrl = process.env.NEXTAUTH_URL || nextUrl.origin;
      
      // If trying to access protected routes without auth
      if (!isLoggedIn && isOnChat && !isOnLogin && !isOnRegister) {
        // Construct login URL on the current domain
        const loginUrl = new URL('/login', baseUrl);
        loginUrl.searchParams.set('callbackUrl', nextUrl.href);
        return Response.redirect(loginUrl);
      }

      // Redirect away from auth pages if already logged in
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', baseUrl));
      }

      // Allow access to login/register pages
      if (isOnRegister || isOnLogin) {
        return true;
      }

      // Allow access to protected routes if logged in
      if (isOnChat && isLoggedIn) {
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
