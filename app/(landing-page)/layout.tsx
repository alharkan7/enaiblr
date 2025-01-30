import "./css/style.css";
import "../globals.css";

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
      path: "./fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-nacelle",
});

export const metadata = {
  title: "Enaiblr - AI & Media Research Lab",
  description: "Page description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(
      "scroll-smooth",
      inter.variable,
      nacelle.variable,
    )}>
      <body className={cn(
        'min-h-screen font-inter text-base antialiased',
        'bg-gray-950 text-gray-200'
      )} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={700}>
            <Toaster position="top-center" />
            <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
              {children}
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
