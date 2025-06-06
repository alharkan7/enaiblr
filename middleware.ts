import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './app/(auth)/auth';
import { apps } from './config/apps';

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/ai-platform',     // About page
    '/affiliate',
    '/apps',      // Apps page
    '/login',     // Auth pages
    '/register',
    '/api/subscription', // Subscription status endpoint
    '/forgot-password', // Forgot password page
    '/reset-password', // Reset password page
    '/',
    '/publications', // Public publications list
    '/api/publications', // Public publications API
    '/icons', // Static icons
    '/favicon.ico', // Favicon
    '/tools',
  ];

  // Check if the path starts with any of these prefixes
  const publicPrefixes = [
    '/icons/',
    '/images/',
    '/_next/static/',
    '/_next/image/',
    '/publications/', // Allow access to all publication routes
    '/api/publications/', // Allow access to all publication API routes
  ];

  return publicRoutes.includes(pathname) ||
    publicPrefixes.some(prefix => pathname.startsWith(prefix));
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

const BASE_URL = process.env.NEXTAUTH_URL || 'https://dev.enaiblr.org' || 'https://enaiblr.org';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') ?? [];

export default auth(async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Custom redirection for /tools to tools subdomain (no login required)
  if (pathname === '/tools') {
    const baseDomain = BASE_URL.replace('https://', ''); // e.g., 'dev.enaiblr.org' or 'enaiblr.org'
    const toolsUrl = new URL(`https://apps.raihankalla.id`);
    // Preserve query parameters if any
    request.nextUrl.searchParams.forEach((value, key) => {
      toolsUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(toolsUrl);
  }

  // Skip auth middleware for publications API
  if (request.nextUrl.pathname.startsWith('/api/publications')) {
    return NextResponse.next();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Allow API auth routes to pass through
  if (isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Protect /publish and /dashboard routes with an admin check.
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/publish')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const userEmail = session?.user?.email?.toLowerCase();
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.redirect(new URL('/apps', request.url));
    }
  }

  // Handle root path access
  if (pathname === '/') {
    if (isLoggedIn) {
      const appsUrl = new URL('/apps', request.url)
      // Preserve ref code if present
      const refCode = request.nextUrl.searchParams.get('ref')
      if (refCode) {
        appsUrl.searchParams.set('ref', refCode)
      }
      return NextResponse.redirect(appsUrl)
    }
    // If not logged in, allow access to root
    return NextResponse.next()
  }

  // Allow public routes without login
  if (isPublicRoute(pathname)) {
    // For /apps route, preserve ref code from other routes
    if (pathname === '/apps' && !request.nextUrl.searchParams.has('ref')) {
      const refCode = request.nextUrl.searchParams.get('ref')
      if (refCode) {
        const url = new URL(request.url)
        url.searchParams.set('ref', refCode)
        return NextResponse.redirect(url)
      }
    }
    return NextResponse.next()
  }

  // Handle preview URLs
  if (request.nextUrl.searchParams.get('preview')) {
    return NextResponse.next();
  }

  // Redirect to login if not logged in trying to access protected routes
  if (!isLoggedIn && !isAuthPage) {
    // If there's a referral code and we're redirecting from payment page, preserve it
    if (pathname === '/payment') {
      const refCode = request.nextUrl.searchParams.get('ref')
      if (refCode) {
        const appsUrl = new URL('/apps', request.url)
        appsUrl.searchParams.set('ref', refCode)
        return NextResponse.redirect(appsUrl)
      }
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
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

      // For pro pages, we'll let the client handle subscription checks
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protected routes
    '/((?!_next/static|_next/image|favicon.ico|icons|images|api/publications).*)',
  ],
};
