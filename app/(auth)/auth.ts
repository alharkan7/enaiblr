import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import type { User as NextAuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getUser, createGoogleUser, updateUserAvatar } from '@/lib/db/queries';

import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

// Extend NextAuth's User type with our database fields
interface User extends NextAuthUser {
  avatar?: string | null;
  geminiApiKey?: string | null;
}

interface ExtendedToken extends JWT {
  id: string;
  email: string;
  name?: string | null;
  picture?: string | null;
  geminiApiKey?: string | null;
}

interface ExtendedSession extends Session {
  user: User & {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    geminiApiKey?: string | null;
  };
}

export const config = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  // debug: true, // Enable debug messages
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 // 24 hours
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
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
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      async profile(profile) {
        // console.log('Google profile callback:', profile);
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        }
      }
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
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
    async signIn({ user, account, profile, email, credentials }: any) {
      // console.log('SignIn callback triggered with:', { 
      //   userEmail: user?.email,
      //   accountType: account?.type,
      //   provider: account?.provider,
      //   hasProfile: !!profile,
      //   hasCredentials: !!credentials
      // });

      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        try {
          if (!user.email) {
            console.error('No email provided from Google');
            return false;
          }

          // Check if user exists
          // console.log('Checking if user exists:', user.email);
          const existingUser = await getUser(user.email);
          // console.log('DB check result:', existingUser);

          if (!existingUser || existingUser.length === 0) {
            // Create new user
            // console.log('Creating new Google user...');
            try {
              const newUser = await createGoogleUser(user.email, user.image || undefined);
              // console.log('New user created:', newUser);

              if (!newUser || newUser.length === 0) {
                console.error('Failed to create new Google user');
                return false;
              }
            } catch (error) {
              console.error('Error creating Google user:', error);
              return false;
            }
          } else {
            // console.log('Existing user found:', existingUser[0]);
          }
          return true;
        } catch (error) {
          console.error('Error in Google sign-in flow:', error);
          return false;
        }
      }

      // Allow credential sign-in to proceed
      return true;
    },
    async jwt({ token, user, account, profile, trigger }: any) {
      // console.log('JWT callback:', { 
      //   hasUser: !!user, 
      //   hasAccount: !!account,
      //   tokenEmail: token?.email,
      //   userEmail: user?.email
      // });

      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.name = user.name || null;
        token.picture = user.image || null;
      }

      // Fetch geminiApiKey from database on initial sign-in or when session is updated
      if (token.email && (user || trigger === 'update')) {
        try {
          const dbUser = await getUser(token.email);
          if (dbUser && dbUser.length > 0) {
            token.geminiApiKey = dbUser[0].geminiApiKey || null;
          }
        } catch (error) {
          console.error('Error fetching geminiApiKey:', error);
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      // console.log('Session callback:', { 
      //   hasToken: !!token,
      //   tokenEmail: token?.email,
      //   sessionEmail: session?.user?.email
      // });

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email || '';
        session.user.name = token.name || null;
        session.user.image = token.picture || null;
        session.user.geminiApiKey = token.geminiApiKey || null;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }: any) {
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
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);

export type { Session } from 'next-auth';
