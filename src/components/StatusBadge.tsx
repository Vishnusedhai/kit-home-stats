import { cn } from "@/lib/utils";
import type { DeviceStatus, ServiceStatus } from "@/types/homelab";

const deviceStyles: Record<DeviceStatus, string> = {
  Online: "border-success/30 bg-success/10 text-success",
  Offline: "border-border bg-muted text-muted-foreground",
  Maintenance: "border-warning/30 bg-warning/10 text-warning",
};

const serviceStyles: Record<ServiceStatus, string> = {
  Running: "border-success/30 bg-success/10 text-success",
  Stopped: "border-border bg-muted text-muted-foreground",
  Error: "border-destructive/30 bg-destructive/10 text-destructive",
};

const dotStyles: Record<string, string> = {
  Online: "bg-success",
  Running: "bg-success",
  Offline: "bg-muted-foreground",
  Stopped: "bg-muted-foreground",
  Maintenance: "bg-warning",
  Error: "bg-destructive",
};

export function StatusBadge({
  status,
  kind = "device",
  className,
}: {
  status: DeviceStatus | ServiceStatus;
  kind?: "device" | "service";
  className?: string;
}) {
  const styles =
    kind === "device"
      ? deviceStyles[status as DeviceStatus]
      : serviceStyles[status as ServiceStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium",
        styles,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[status])} />
      {status}
    </span>
  );
}
