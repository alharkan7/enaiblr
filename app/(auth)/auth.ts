import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { User as NextAuthUser } from '@auth/core/types';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getUser, createGoogleUser, updateUserAvatar } from '@/lib/db/queries';

import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

// Extend NextAuth's User type with our database fields
interface User extends NextAuthUser {
  avatar?: string | null;
}

interface ExtendedToken extends JWT {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
}

interface ExtendedSession extends Session {
  user: User & {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export const config = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 // 24 hours
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
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
      if (account?.type === 'oauth' && account.provider === 'google') {
        try {
          const existingUser = await getUser(user.email || '');
          if (!existingUser || existingUser.length === 0) {
            await createGoogleUser(user.email || '', user.image || undefined);
          } else if (user.image && existingUser[0].avatar !== user.image) {
            await updateUserAvatar(existingUser[0].id, user.image);
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }): Promise<ExtendedToken> {
      if (user) {
        const dbUser = user as User;
        // Ensure token has required properties
        return {
          ...token,
          id: dbUser.id || token.id,
          email: dbUser.email || token.email || '',
          name: dbUser.name || token.name,
          picture: dbUser.image || dbUser.avatar || token.picture
        } as ExtendedToken;
      }
      // Ensure existing token has id property
      return token as ExtendedToken;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (session.user && token) {
        session.user.id = (token as ExtendedToken).id;
        session.user.email = (token as ExtendedToken).email;
        session.user.name = (token as ExtendedToken).name || null;
        session.user.image = (token as ExtendedToken).picture || null;
      }
      return session as ExtendedSession;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                        nextUrl.pathname.startsWith('/register');

      if (isAuthPage) {
        if (isLoggedIn) {
          // If there's a ref code, add it to the redirect
          const refCode = nextUrl.searchParams.get('ref');
          const callbackUrl = nextUrl.searchParams.get('callbackUrl');
          if (refCode) {
            const redirectUrl = new URL(callbackUrl || '/apps', nextUrl.origin);
            redirectUrl.searchParams.set('ref', refCode);
            return Response.redirect(redirectUrl);
          }
          return Response.redirect(new URL(callbackUrl || '/apps', nextUrl.origin));
        }
        return true;
      }

      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;

const handler = NextAuth(config);

export const { auth, signIn, signOut } = handler;
export const handlers = handler.handlers;

export type { Session } from 'next-auth';

// Export handlers for API route
export const { GET, POST } = handlers;
