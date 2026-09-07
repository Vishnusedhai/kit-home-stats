import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Server, Sparkles, Settings as SettingsIcon } from "lucide-react";

import { Brand } from "@/components/Brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useHomelabStats } from "@/hooks/use-homelab";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Devices", url: "/devices", icon: Server },
  { title: "AI Assistant", url: "/assistant", icon: Sparkles },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const stats = useHomelabStats();

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <Brand compact={collapsed} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[11px] tracking-[0.08em] uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-md border border-sidebar-border bg-sidebar-accent/50 p-3">
            <div className="mono-label">lab status</div>
            <div className="mt-2 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">devices</span>
              <span className="text-foreground">{stats.total}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">online</span>
              <span className="text-success">{stats.online}</span>
            </div>
            <div className="mt-1 flex items-center justify-between font-mono text-xs">
              <span className="text-muted-foreground">services</span>
              <span className="text-foreground">{stats.totalServices}</span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
