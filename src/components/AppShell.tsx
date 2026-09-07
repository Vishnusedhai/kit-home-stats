import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useHomelab } from "@/hooks/use-homelab";

function ThemeToggle() {
  const { settings, setTheme } = useHomelab();
  const isDark = settings.theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/85 px-3 backdrop-blur sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                ~/homelab
              </span>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 px-3 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
