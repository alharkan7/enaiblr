import { compare } from 'bcrypt-ts';
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"]
  }
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email;
        const password = credentials.password;

        const users = await getUser(email);
        
        if (users.length === 0) {
          console.log('No user found with email:', email);
          return null;
        }

        const passwordsMatch = await compare(password, users[0].password ?? '');
        
        if (!passwordsMatch) {
          console.log('Password does not match for user:', email);
          return null;
        }

        return {
          id: users[0].id,
          email: users[0].email
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Sign in callback:', { user, account, profile });
      return true;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      if (account && user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});