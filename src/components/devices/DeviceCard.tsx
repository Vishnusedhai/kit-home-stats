import { Link } from "@tanstack/react-router";
import { Cpu, HardDrive, MapPin, MemoryStick } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { formatRam, formatStorage } from "@/lib/format";
import type { Device } from "@/types/homelab";

export function DeviceCard({ device }: { device: Device }) {
  return (
    <Link
      to="/devices/$deviceId"
      params={{ deviceId: device.id }}
      className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold text-foreground group-hover:text-primary">
            {device.name}
          </div>
          <div className="mono-label mt-1">{device.type}</div>
        </div>
        <StatusBadge status={device.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5 truncate">
          <Cpu className="size-3.5 shrink-0" />
          {device.os || "—"}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <MemoryStick className="size-3.5 shrink-0" />
          {formatRam(device.ram)}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <HardDrive className="size-3.5 shrink-0" />
          {formatStorage(device.storage)}
        </span>
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="size-3.5 shrink-0" />
          {device.location || "—"}
        </span>
      </div>

      {device.address ? (
        <div className="mt-3 truncate font-mono text-xs text-muted-foreground">
          {device.address}
        </div>
      ) : null}

      {device.services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
          {device.services.slice(0, 4).map((s) => (
            <span
              key={s.id}
              className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {s.name}
            </span>
          ))}
          {device.services.length > 4 && (
            <span className="px-1 font-mono text-[11px] text-muted-foreground">
              +{device.services.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
