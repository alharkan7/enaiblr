import { NextResponse } from 'next/server';
import { auth } from './app/(auth)/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/register');

  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

// Optionally configure protected routes
export const config = {
  matcher: ['/', '/:id', '/api/:path*', '/login', '/register'],
};
