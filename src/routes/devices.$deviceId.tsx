import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Cpu,
  HardDrive,
  MapPin,
  MemoryStick,
  Network,
  Pencil,
  Server,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { DeviceFormDialog } from "@/components/devices/DeviceFormDialog";
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
import { useHomelab } from "@/hooks/use-homelab";
import { formatRam, formatStorage, relativeTime } from "@/lib/format";

export const Route = createFileRoute("/devices/$deviceId")({
  head: () => ({
    meta: [
      { title: "Device details — HomeLab Dashboard" },
      {
        name: "description",
        content:
          "Full specs, network address, location, attached services and notes for a single homelab device.",
      },
      { property: "og:title", content: "Device details — HomeLab Dashboard" },
      {
        property: "og:description",
        content: "Full specs, services and notes for a single homelab device.",
      },
    ],
  }),
  component: DeviceDetailPage,
});

function Spec({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Cpu;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="mono-label">{label}</span>
      </div>
      <div className="mt-2 font-mono text-sm break-words text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}

function DeviceDetailPage() {
  const { deviceId } = useParams({ from: "/devices/$deviceId" });
  const { getDevice, updateDevice, deleteDevice, ready } = useHomelab();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const device = getDevice(deviceId);

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-lg border border-border bg-card" />;
  }

  if (!device) {
    return (
      <EmptyState
        icon={Server}
        title="Device not found"
        description="This device may have been deleted or the local data was cleared."
        action={
          <Button asChild variant="secondary">
            <Link to="/devices">Back to devices</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Link
        to="/devices"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        devices
      </Link>

      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {device.name}
            </h1>
            <StatusBadge status={device.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {device.type} · updated {relativeTime(device.updatedAt)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setConfirming(true)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Spec label="operating system" value={device.os} icon={Server} />
        <Spec label="cpu" value={device.cpu} icon={Cpu} />
        <Spec label="ram" value={formatRam(device.ram)} icon={MemoryStick} />
        <Spec label="storage" value={formatStorage(device.storage)} icon={HardDrive} />
        <Spec label="ip / hostname" value={device.address} icon={Network} />
        <Spec label="location" value={device.location} icon={MapPin} />
      </div>

      <section className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="mono-label">services ({device.services.length})</h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            manually tracked
          </span>
        </div>
        {device.services.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No services recorded for this device yet. Add some by editing the device.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {device.services.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                <span className="font-mono text-sm text-foreground">{s.name}</span>
                <StatusBadge status={s.status} kind="service" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mono-label">notes</h2>
        <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
          {device.notes || "No notes."}
        </p>
      </section>

      <DeviceFormDialog
        open={editing}
        onOpenChange={setEditing}
        device={device}
        onSubmit={(input) => {
          updateDevice(device.id, input);
          toast.success("Device updated");
        }}
      />

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {device.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the device and its services from your local inventory. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteDevice(device.id);
                toast.success("Device deleted");
                navigate({ to: "/devices" });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
