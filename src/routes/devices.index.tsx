import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Server } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { DeviceCard } from "@/components/devices/DeviceCard";
import { DeviceFormDialog } from "@/components/devices/DeviceFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHomelab } from "@/hooks/use-homelab";
import { DEVICE_STATUSES, DEVICE_TYPES } from "@/types/homelab";

export const Route = createFileRoute("/devices/")({
  head: () => ({
    meta: [
      { title: "Devices — HomeLab Dashboard" },
      {
        name: "description",
        content:
          "Browse, search and filter every machine in your homelab inventory: servers, NAS boxes, Raspberry Pis, VMs and more.",
      },
      { property: "og:title", content: "Devices — HomeLab Dashboard" },
      {
        property: "og:description",
        content: "Browse, search and filter every machine in your homelab inventory.",
      },
    ],
  }),
  component: DevicesPage,
});

function DevicesPage() {
  const { devices, addDevice } = useHomelab();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devices.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (type !== "all" && d.type !== type) return false;
      if (!q) return true;
      return [d.name, d.os, d.cpu, d.address, d.location, d.notes]
        .concat(d.services.map((s) => s.name))
        .some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [devices, query, status, type]);

  return (
    <>
      <PageHeader
        title="Devices"
        description={`${devices.length} machine${devices.length === 1 ? "" : "s"} in your inventory.`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add device
          </Button>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, OS, IP, service…"
            className="pl-9"
            aria-label="Search devices"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {DEVICE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-40" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {DEVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches"
          description="No devices match your search and filters. Try clearing them."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setStatus("all");
                setType("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
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
