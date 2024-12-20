import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { getUser, createUser } from '@/lib/db/queries';
import { authConfig as baseAuthConfig } from './auth.config';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth: authHandler,
  signIn,
  signOut,
} = NextAuth({
  ...baseAuthConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email;
          const password = credentials.password;

          const users = await getUser(email);

          if (users.length === 0) {
            return null;
          }

          const passwordsMatch = await compare(password, users[0].password ?? '');

          if (!passwordsMatch) {
            return null;
          }

          const { password: _, ...userWithoutPassword } = users[0];
          return userWithoutPassword;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await getUser(user.email!);

          if (existingUser.length === 0) {
            // Create new user for Google login with empty password
            await createUser(user.email!, '');
            // Get the newly created user to get their ID
            const newUser = await getUser(user.email!);
            if (newUser.length > 0) {
              user.id = newUser[0].id;
            }
          } else {
            // Set the ID from existing user
            user.id = existingUser[0].id;
          }
          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
});

export const auth = async () => {
  const session = await authHandler();
  return session;
};