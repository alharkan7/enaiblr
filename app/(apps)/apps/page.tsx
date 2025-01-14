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
    if (status !== 'authenticated') {
      const callbackUrl = `/${appSlug}`;
      const encodedCallback = encodeURIComponent(callbackUrl);
      router.push(`/login?callbackUrl=${encodedCallback}`);
      return;
    }
    router.push(`/${appSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {status === 'authenticated' ? (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="!static"
        >
          <AppsHeader />
        </motion.div>
      ) : (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold tracking-tighter mb-2 text-foreground relative inline-block select-none">
              enaiblr
              {!isLoading && <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`absolute top-0 right-[-40] text-xs font-medium ${plan === 'pro' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted outline-1 outline outline-primary'} rounded-lg px-1 leading-normal tracking-normal`}
              >
                {plan === 'pro' ? 'PRO' : 'FREE'}
              </motion.span>}
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Unlimited AI Platform
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto"
          >
            {apps.map((app, index) => {
              const Icon = app.icon
              return (
                <motion.div
                  key={app.slug}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAppClick(app.type, app.slug)}
                  className="group relative flex flex-col items-center p-4 md:p-6 bg-card hover:bg-accent rounded-xl border border-border transition-all cursor-pointer select-none shadow-sm hover:shadow-xl"
                >
                  <motion.div 
                    className="mb-3 md:mb-4 p-2 rounded-lg bg-muted group-hover:bg-accent-foreground/10 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </motion.div>
                  <h2 className="text-sm md:text-lg font-semibold text-center text-foreground">{app.name}</h2>
                  <p className="text-xs text-muted-foreground text-center mt-2">{app.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AppsFooter />
      </motion.div>
    </div>
  );
}