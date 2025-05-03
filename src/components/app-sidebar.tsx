"use client";

import * as React from "react";
import { Tv, UsersRound, GalleryHorizontalEnd, Settings2 } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavManagement } from "@/components/nav-management";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import AdminLogo from "./admin-logo";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Content",
      url: "#",
      icon: Tv,
      isActive: true,
      items: [
        {
          title: "Movies",
          url: "/admin/movies",
        },
        {
          title: "Series",
          url: "/admin/series",
        },
        {
          title: "Kids",
          url: "/admin/kids",
        },
      ],
    },
    {
      title: "Featured",
      url: "#",
      icon: GalleryHorizontalEnd,
      items: [
        {
          title: "Carousel",
          url: "/admin/carousel",
        },

        {
          title: "Trending",
          url: "/admin/trending",
        },
        {
          title: "Popular",
          url: "/admin/popular",
        },
      ],
    },
  ],
  Management: [
    {
      name: "Users",
      url: "#",
      icon: UsersRound,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AdminLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavManagement pages={data.Management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
