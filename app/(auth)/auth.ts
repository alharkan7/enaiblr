import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getUser, createGoogleUser } from '@/lib/db/queries';

export const config = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize({ email, password }: any) {
        const users = await getUser(email);
        if (users.length === 0) return null;
        if (password) {
          const passwordsMatch = await compare(password, users[0].password!);
          if (!passwordsMatch) return null;
        }
        return users[0];
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const users = await getUser(user.email!);
        if (users.length > 0) {
          user.id = users[0].id;
        } else {
          // Create new user for Google sign-in
          const newUser = await createGoogleUser(user.email!);
          user.id = newUser[0].id;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/login') ||
                        nextUrl.pathname.startsWith('/register');

      // Redirect to login if accessing protected routes while not logged in
      if (!isLoggedIn && !isAuthPage) {
        return false;
      }

      // Redirect to callback URL or apps if accessing auth pages while logged in
      if (isLoggedIn && isAuthPage) {
        const callbackUrl = nextUrl.searchParams.get('callbackUrl');
        if (callbackUrl && callbackUrl.startsWith('/')) {
          return Response.redirect(new URL(callbackUrl, nextUrl));
        }
        return Response.redirect(new URL('/apps', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

const handler = NextAuth(config);

export const { auth, signIn, signOut } = handler;
export const handlers = handler.handlers;

export type { Session } from 'next-auth';

// Export handlers for API route
export const { GET, POST } = handlers;
