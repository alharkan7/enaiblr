import "./(landing-page)/css/style.css";
import "./globals.css";
import type { Metadata } from 'next';

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { SessionProvider } from 'next-auth/react';
import { auth } from './(auth)/auth';
import { headers } from 'next/headers';
import { SubscriptionProvider } from '@/contexts/subscription-context';

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Configure Nacelle font
const nacelle = localFont({
  src: [
    {
      path: "../public/fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-nacelle",
});

// Add service worker registration script
const registerServiceWorker = `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      const swUrl = window.location.origin + '/sw.js';
      navigator.serviceWorker.register(swUrl, {
        scope: '/'
      }).then(
        function(registration) {
          console.log('Service Worker registration successful');
        },
        function(err) {
          console.log('Service Worker registration failed: ', err);
        }
      );
    });
  }
`;

export const metadata: Metadata = {
  title: {
    template: '%s | enaiblr',
    default: 'enaiblr AI Platform',
  },
  description: 'Unlimited AI Platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Enaiblr',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png' },
    ],
  },
  metadataBase: new URL('https://enaiblr.org'),
  openGraph: {
    title: 'enaiblr AI Platform',
    description: 'Unlimited Access to AI Tools and Resources',
    url: 'https://enaiblr.org',
    siteName: 'enaiblr AI Platform',
    locale: 'en_ID, en_US',
    alternateLocale: 'en_ID, en_US',
    type: 'website',
  },

  // Twitter metadata
  twitter: {
    card: 'summary_large_image',
    title: 'enaiblr AI Platform',
    description: 'Unlimited Access to AI Tools and Resources',
  },

  // Additional metadata
  keywords: ['search engine', 'artificial intelligence', 'ai tools', 'ai apps', 'ai resources', 'ai search engine', 'ai tools search engine', 'ai apps search engine', 'ai resources search engine', 'ai tools search', 'ai apps search', 'ai resources search', 'ai tools finder', 'ai apps finder', 'ai resources finder', 'ai tools directory', 'ai apps directory', 'ai resources directory', 'ai tools catalog', 'ai apps catalog', 'ai resources catalog', 'ai tools index', 'ai apps index', 'ai resources index', 'ai tools database', 'ai apps database', 'ai resources database', 'ai tools list', 'ai apps list', 'ai resources list', 'ai tools directory', 'ai apps directory', 'ai resources directory', 'ai tools catalog', 'ai apps catalog', 'ai resources catalog', 'ai tools index', 'ai apps index', 'ai resources index', 'ai tools database', 'ai apps database', 'ai resources database', 'ai tools list', 'ai apps list', 'ai resources list'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tFxU99IkWGK2ZMCtAscR_8k4yrvRWYdziVbgZniK3Pc', // From Google Search Console 
  }
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headersList = await headers();
  const pageType = headersList.get('x-page-type');

  return (
    <html
      lang="en_US, en_ID"
      data-page-type={pageType}
      suppressHydrationWarning
      className="scroll-smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: registerServiceWorker,
          }}
        />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)} suppressHydrationWarning>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <TooltipProvider delayDuration={700}>
              <SubscriptionProvider>
                {children}
              </SubscriptionProvider>
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}