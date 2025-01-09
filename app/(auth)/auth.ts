import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getUser, createGoogleUser, updateUserAvatar } from '@/lib/db/queries';

import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

const BASE_URL = process.env.NEXTAUTH_URL || 'https://enaiblr.org';

interface ExtendedToken extends JWT {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface ExtendedSession extends Session {
  user: User & {
    id: string;
  };
}

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
        // console.log('Google sign in - user data:', { email: user.email, image: user.image, name: user.name });
        const users = await getUser(user.email!);
        if (users.length > 0) {
          user.id = users[0].id;
          // Update avatar for existing user
          if (user.image && (!users[0].avatar || users[0].avatar !== user.image)) {
            await updateUserAvatar(user.email!, user.image);
          }
        } else {
          // Create new user for Google sign-in
          const newUser = await createGoogleUser(user.email!, user.image || undefined);
          user.id = newUser[0].id;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }): Promise<ExtendedToken> {
      if (user) {
        token.id = user.id;
        token.email = user.email as string;
        token.name = user.name;
        token.picture = user.image;
      }
      return token as ExtendedToken;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        session.user.image = token.picture as string | null;
      }
      return session as ExtendedSession;
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
          return Response.redirect(new URL(callbackUrl, BASE_URL));
        }
        return Response.redirect(new URL('/apps', BASE_URL));
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
