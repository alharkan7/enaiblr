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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  const view = searchParams.view || 'users';
  let data: {
    users?: {
      id: string;
      email: string;
      name: string | null;
      phone: string | null;
      createdAt: Date | null;
    }[];
    subscriptions?: {
      email: string;
      plan: string;
      validUntil: Date | null;
      createdAt: Date;
    }[];
    total: number;
    pages: number;
  };
  
  if (view === 'subscriptions') {
    const subscriptionData = await getPaginatedSubscriptions(1, 25);
    data = {
      subscriptions: subscriptionData.subscriptions,
      total: subscriptionData.total,
      pages: subscriptionData.pages
    };
  } else {
    const userData = await getPaginatedUsers(1, 25);
    data = {
      users: userData.users,
      total: userData.total,
      pages: userData.pages
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {view === 'subscriptions' ? 'Subscriptions' : 'Users Info'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 p-4">
            {view === 'subscriptions' ? (
              <SubscriptionTable 
                initialSubscriptions={data.subscriptions!} 
                totalPages={data.pages} 
              />
            ) : (
              <UsersTable 
                initialUsers={data.users!} 
                totalPages={data.pages} 
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
