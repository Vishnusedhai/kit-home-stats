import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Database, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useHomelab, useHomelabStats } from "@/hooks/use-homelab";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — HomeLab Dashboard" },
      {
        name: "description",
        content:
          "Switch between dark and light themes, restore the demo homelab, or clear all locally stored data.",
      },
      { property: "og:title", content: "Settings — HomeLab Dashboard" },
      {
        property: "og:description",
        content: "Theme, demo data reset and local storage controls.",
      },
    ],
  }),
  component: SettingsPage,
});

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-xl">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { settings, setTheme, resetDemoData, clearData } = useHomelab();
  const stats = useHomelabStats();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const isDark = settings.theme === "dark";

  return (
    <>
      <PageHeader
        title="Settings"
        description="Appearance and local data. Everything lives in your browser — nothing is uploaded."
      />

      <section className="divide-y divide-border rounded-lg border border-border bg-card">
        <Row
          title="Dark mode"
          description="HomeLab Dashboard is designed dark-first, with a polished light theme available."
        >
          <div className="flex items-center gap-3">
            <Sun className="size-4 text-muted-foreground" />
            <Switch
              checked={isDark}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <Moon className="size-4 text-muted-foreground" />
          </div>
        </Row>

        <Row
          title="Restore demo data"
          description="Replaces your current inventory with the sample homelab (7 devices)."
        >
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            <Database className="size-4" />
            Reset demo data
          </Button>
        </Row>

        <Row
          title="Clear local data"
          description={`Deletes all ${stats.total} devices, ${stats.totalServices} services and settings from this browser.`}
        >
          <Button variant="destructive" onClick={() => setConfirmClear(true)}>
            <Trash2 className="size-4" />
            Clear all data
          </Button>
        </Row>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mono-label">about</div>
        <p className="mt-2 text-sm text-muted-foreground">
          HomeLab Dashboard v1 — a manually-managed inventory for self-hosted
          infrastructure. Data is stored in localStorage so the app works with zero
          configuration; a real backend and live monitoring can be layered on later.
        </p>
      </section>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current devices will be replaced by the sample homelab. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetDemoData();
                toast.success("Demo data restored");
              }}
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all local data?</AlertDialogTitle>
            <AlertDialogDescription>
              Every device, service and setting stored in this browser will be removed.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearData();
                toast.success("Local data cleared");
              }}
            >
              Clear data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
