'use client'

import Link from 'next/link';
import { apps } from '@/config/apps';
import AppsFooter from '@/components/apps-footer';
import { useSession } from 'next-auth/react';
import { AppsHeader } from '@/components/apps-header';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from '@/contexts/subscription-context';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Page() {
  const { data: session, status } = useSession();
  const { plan, isLoading } = useSubscription();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle dialog close
  const handleDialogChange = (open: boolean) => {
    // If dialog is being closed and error parameter exists, remove it
    if (!open && searchParams.get('error') === 'pro_required') {
      // Create new URL without the error parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      // Replace current URL without adding to history
      router.replace(newUrl.pathname + newUrl.search);
    }
  };

  const handleAppClick = (appType: 'free' | 'pro', appSlug: string) => {
    // Get ref code from URL if it exists
    const refCode = searchParams.get('ref');
    
    if (status !== 'authenticated') {
      const callbackUrl = `/${appSlug}`;
      const encodedCallback = encodeURIComponent(callbackUrl);
      // Add ref code to login URL if it exists
      const loginUrl = `/login?callbackUrl=${encodedCallback}${refCode ? `&ref=${refCode}` : ''}`;
      router.push(loginUrl);
      return;
    }

    // Add ref code to app URL if it exists
    const appUrl = `/${appSlug}${refCode ? `?ref=${refCode}` : ''}`;
    router.push(appUrl);
  };

  // Save ref code to localStorage when it exists in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-auto">
      {status === 'authenticated' ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AppsHeader />
        </motion.div>
      ) : (
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-background py-4 px-4 z-50"
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </motion.header>
      )}

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold tracking-tighter mb-2 text-foreground relative inline-block select-none">
              enaiblr
              {!isLoading && <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-0 right-[-40] text-xs font-medium ${plan === 'pro' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted outline-1 outline outline-primary'} rounded-lg px-1 leading-normal tracking-normal`}
              >
                {plan === 'pro' ? 'PRO' : 'FREE'}
              </motion.span>}
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground"
            >
              Unlimited AI Platform
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 max-w-6xl mx-auto"
          >
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <motion.div
                  key={app.slug}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAppClick(app.type, app.slug)}
                  className="group relative flex flex-col items-center p-3 rounded-xl transition-all cursor-pointer select-none"
                >
                  <div className="mb-2 p-4 rounded-2xl bg-card hover:bg-accent border border-border shadow-sm hover:shadow-md transition-colors">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <h2 className="text-sm font-medium text-center text-foreground max-w-[80px] break-words leading-tight">{app.name}</h2>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <AppsFooter />
      </motion.div>
    </div>
  );
}