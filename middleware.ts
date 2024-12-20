import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';

export default async function middleware(request: Request) {
  const session = await auth();
  const { pathname } = new URL(request.url);

  // Auth routes - allow access
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth/* (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};