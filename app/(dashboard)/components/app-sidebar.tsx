"use client"

import * as React from "react"
import { useSession } from 'next-auth/react';

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
import { AppsGridUserNav } from '@/components/ui/apps-grid-user-nav';
import { data } from "./nav-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon" {...props}>
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
            <AppsGridUserNav user={session.user} />
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
