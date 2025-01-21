import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { getPaginatedUsers, getPaginatedSubscriptions } from '@/lib/db/admin-queries';

import { AppSidebar } from "../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UsersTable } from "../components/users-info"; 
import { SubscriptionTable } from "../components/users-subscription";
import { Metadata } from 'next';
import { DashboardStats } from "../components/dashboard-stats";
import { data as navData } from "../components/nav-data";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard for managing users and subscriptions',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const params = await searchParams;
  const view = params.view;

  type User = {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    createdAt: Date | null;
  };

  type Subscription = {
    email: string;
    plan: string;
    validUntil: Date | null;
    createdAt: Date;
  };

  type DashboardData = {
    users?: User[];
    subscriptions?: Subscription[];
    total: number;
    pages: number;
  };

  let data: DashboardData = {
    users: undefined,
    subscriptions: undefined,
    total: 0,
    pages: 0
  };
  
  if (view === 'subscriptions') {
    const subscriptionData = await getPaginatedSubscriptions(1, 25);
    data = {
      subscriptions: subscriptionData.subscriptions,
      total: subscriptionData.total,
      pages: subscriptionData.pages,
      users: undefined
    };
  } else if (view === 'users') {
    const userData = await getPaginatedUsers(1, 25);
    data = {
      users: userData.users,
      total: userData.total,
      pages: userData.pages,
      subscriptions: undefined
    };
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Overview</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {view && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {navData.navUser.find((nav: { url: string; title: string }) => nav.url.includes(`view=${view}`))?.title || view}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 p-0">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              {!view && (
                <>
                  <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                  </div>
                  <Separator />
                  <DashboardStats />
                </>
              )}
              {view === 'subscriptions' && (
                <SubscriptionTable 
                  initialSubscriptions={data.subscriptions!} 
                  totalPages={data.pages} 
                />
              )}
              {view === 'users' && (
                <UsersTable 
                  initialUsers={data.users!} 
                  totalPages={data.pages} 
                />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
