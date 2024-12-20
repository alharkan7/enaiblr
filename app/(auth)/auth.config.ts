import { type DefaultSession } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
    error: '/login',
  },
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: { session: DefaultSession, token: any }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  }
}