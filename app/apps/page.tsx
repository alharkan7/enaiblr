'use client'

import Link from 'next/link';
import { apps } from '@/config/apps';
import AppsFooter from '@/components/apps-footer';
import { useSession } from 'next-auth/react';
import { AppsHeader } from '@/components/apps-header';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SubscriptionDialog } from '@/components/subscription-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSubscription } from '@/contexts/subscription-context';

export default function Page() {
  const { data: session, status } = useSession();
  const { plan } = useSubscription();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showProDialog, setShowProDialog] = useState(false);

  // Show dialog when redirected from pro feature with error
  useEffect(() => {
    if (searchParams.get('error') === 'pro_required') {
      setShowProDialog(true);
    }
  }, [searchParams]);

  // Handle dialog close
  const handleDialogChange = (open: boolean) => {
    setShowProDialog(open);
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
    if (appType === 'pro' && plan === 'free') {
      setShowProDialog(true);
      return;
    }
    router.push(`/${appSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {status === 'authenticated' ? (
        <div className="!static">
          <AppsHeader />
        </div>
      ) : (
        <header className="bg-background py-4 px-4 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </header>
      )}

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tighter mb-2 text-foreground relative inline-block">
              enaiblr
              {plan === 'pro' && (
                <span className="absolute top-0 right-[-40] text-xs font-medium text-primary-foreground bg-primary rounded-lg px-1 leading-normal tracking-normal">
                  PRO
                </span>
              )}
            </h1>
            <p className="text-muted-foreground">Unlimited AI Platform</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {apps.map((app) => {
              const Icon = app.icon
              return (
                <div
                  key={app.slug}
                  onClick={() => handleAppClick(app.type, app.slug)}
                  className="group relative flex flex-col items-center p-4 md:p-6 bg-card hover:bg-accent rounded-xl border border-border transition-colors cursor-pointer"
                >
                  {plan === 'free' && (
                    <div className="absolute -right-[1px] -top-[3px]">
                      <span className={`inline-flex items-center h-[22px] text-xs font-medium px-2 rounded-tr-xl rounded-bl-xl ${
                        app.type === 'pro' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {app.type}
                      </span>
                    </div>
                  )}
                  <div className="mb-3 md:mb-4 p-2 rounded-lg bg-muted group-hover:bg-accent-foreground/10 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h2 className="text-sm md:text-lg font-semibold text-center text-foreground">{app.name}</h2>
                  <p className="text-xs text-muted-foreground text-center mt-2">{app.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <AppsFooter />
      
      <SubscriptionDialog open={showProDialog} onOpenChange={handleDialogChange} />
    </div>
  );
}