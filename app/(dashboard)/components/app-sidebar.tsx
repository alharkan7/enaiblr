"use client"

import * as React from "react"
import { useSession } from 'next-auth/react';
import { useSidebar } from "@/components/ui/sidebar";

import { NavMain } from "../components/nav-main"
// import { NavProjects } from "../components/nav-projects"
import { TeamSwitcher } from "../components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DashboardSidebarUserNav } from '@/components/ui/dashboard-sidebar-user-nav';
import { data } from "./nav-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: session } = useSession();
  const { state } = useSidebar();

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navUser} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <div className="border-t border-border pt-2">
            <DashboardSidebarUserNav user={session.user} collapsed={state === 'collapsed'} />
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
