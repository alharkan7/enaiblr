import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
import { apps } from './config/apps';
import { getUserSubscriptionStatus } from './lib/db/queries';

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/about',     // About page
    '/apps',      // Apps page
    '/login',     // Auth pages
    '/register',
    '/api/subscription', // Subscription status endpoint
  ];
  
  return publicRoutes.some(route => pathname.startsWith(route));
}

// Helper function to check if a route is auth-related
function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/api/auth');
}

// Helper function to get page type from apps config
function getPageType(pathname: string): 'free' | 'pro' | null {
  // Handle the root apps page
  if (pathname === '/apps') {
    return null;
  }

  // First, try to get slug from direct path
  let slug = pathname.slice(1); // Remove leading slash

  // If it's under /apps/, get the slug after /apps/
  if (pathname.startsWith('/apps/')) {
    slug = pathname.replace('/apps/', '').split('/')[0];
  }

  // Handle empty slug (root app)
  if (slug === '') {
    const rootApp = apps.find(app => app.slug === '');
    return rootApp?.type as 'free' | 'pro' | null;
  }

  // Find app by slug
  const app = apps.find(app => app.slug === slug);
  return app?.type as 'free' | 'pro' | null;
}

// Helper function to check if a path is an app route
function isAppRoute(pathname: string): boolean {
  if (pathname === '/apps') return true;
  
  // Get slug either from direct path or /apps/ path
  const slug = pathname.startsWith('/apps/') 
    ? pathname.replace('/apps/', '').split('/')[0]
    : pathname.slice(1);

  return apps.some(app => app.slug === slug);
}

export default auth(async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Allow API auth routes to pass through
  if (isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect root path to /apps if not logged in
  if (pathname === '/' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/apps', request.url));
  }

  // Allow public routes without login
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if not logged in trying to access protected routes
  if (!isLoggedIn && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to callback URL or apps if accessing auth pages while logged in
  if (isLoggedIn && isAuthPage) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    if (callbackUrl && callbackUrl.startsWith('/')) {
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.redirect(new URL('/apps', request.url));
  }

  // Handle subscription-based access for logged-in users
  if (isLoggedIn && session?.user?.id) {
    // Only check page type for app routes
    if (isAppRoute(pathname)) {
      const pageType = getPageType(pathname);

      // If page type is not found in apps config, allow access (internal pages)
      if (!pageType) {
        return NextResponse.next();
      }

      // For pro pages, check subscription status
      if (pageType === 'pro') {
        try {
          const subscriptionStatus = await getUserSubscriptionStatus(session.user.id);
          
          if (subscriptionStatus.plan === 'free') {
            const redirectUrl = new URL('/apps', request.url);
            redirectUrl.searchParams.set('error', 'pro_required');
            return NextResponse.redirect(redirectUrl);
          }
        } catch (error) {
          console.error('Subscription check failed:', error);
          // On error, default to blocking access
          const redirectUrl = new URL('/apps', request.url);
          redirectUrl.searchParams.set('error', 'subscription_error');
          return NextResponse.redirect(redirectUrl);
        }
      }

      // Free pages are always accessible
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/ws|_next/static|_next/image|favicon.ico).*)'],
};
