import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  HardDrive,
  MemoryStick,
  Plus,
  Server,
  Wrench,
  WifiOff,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { DeviceFormDialog } from "@/components/devices/DeviceFormDialog";
import { Button } from "@/components/ui/button";
import { useHomelab, useHomelabStats } from "@/hooks/use-homelab";
import { formatRam, formatStorage, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeLab Dashboard — Self-hosted infrastructure overview" },
      {
        name: "description",
        content:
          "Track every machine in your homelab: device status, RAM, storage and running services in one clean dashboard.",
      },
      { property: "og:title", content: "HomeLab Dashboard" },
      {
        property: "og:description",
        content:
          "Track every machine in your homelab: device status, RAM, storage and running services in one clean dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Server;
  accent?: "success" | "warning" | "muted";
}) {
  const tone =
    accent === "success"
      ? "text-success"
      : accent === "warning"
        ? "text-warning"
        : accent === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="mono-label">{label}</span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className={`mt-3 font-mono text-2xl font-semibold ${tone}`}>{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

function DashboardPage() {
  const { devices, addDevice } = useHomelab();
  const stats = useHomelabStats();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const recent = [...devices]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  const pct = (n: number) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live-ish snapshot of your lab. All data is manually managed and stored locally."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add device
          </Button>
        }
      />

      {devices.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No devices yet"
          description="Add your first machine, or restore the demo homelab from Settings."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" />
              Add device
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="devices" value={stats.total} hint={`${stats.totalServices} services tracked`} icon={Server} />
            <StatCard label="online" value={stats.online} hint={`${pct(stats.online)}% of fleet`} icon={Activity} accent="success" />
            <StatCard label="total ram" value={formatRam(stats.totalRam)} hint="across all devices" icon={MemoryStick} />
            <StatCard label="total storage" value={formatStorage(stats.totalStorage)} hint="raw capacity" icon={HardDrive} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-lg border border-border bg-card p-4 lg:col-span-1">
              <h2 className="mono-label">status overview</h2>
              <div className="mt-4 space-y-4">
                {(
                  [
                    { label: "Online", count: stats.online, bar: "bg-success", icon: Activity },
                    { label: "Offline", count: stats.offline, bar: "bg-muted-foreground", icon: WifiOff },
                    { label: "Maintenance", count: stats.maintenance, bar: "bg-warning", icon: Wrench },
                  ] as const
                ).map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <row.icon className="size-3.5" />
                        {row.label}
                      </span>
                      <span className="font-mono text-foreground">{row.count}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${row.bar}`}
                        style={{ width: `${pct(row.count)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="mono-label">recent devices</h2>
                <Link
                  to="/devices"
                  className="font-mono text-xs text-primary hover:underline"
                >
                  view all →
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {recent.map((device) => (
                  <li key={device.id}>
                    <Link
                      to="/devices/$deviceId"
                      params={{ deviceId: device.id }}
                      className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-accent/40"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-mono text-sm text-foreground">
                          {device.name}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          {device.type} · {device.os || "unknown OS"} ·{" "}
                          {relativeTime(device.updatedAt)}
                        </div>
                      </div>
                      <StatusBadge status={device.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}

      <DeviceFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(input) => {
          const created = addDevice(input);
          navigate({ to: "/devices/$deviceId", params: { deviceId: created.id } });
        }}
      />
    </>
  );
}
