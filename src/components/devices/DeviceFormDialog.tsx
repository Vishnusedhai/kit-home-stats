import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DEVICE_STATUSES,
  DEVICE_TYPES,
  SERVICE_STATUSES,
  type Device,
  type DeviceInput,
  type DeviceStatus,
  type DeviceType,
  type Service,
  type ServiceStatus,
} from "@/types/homelab";

const emptyForm: DeviceInput = {
  name: "",
  type: "Server",
  status: "Online",
  os: "",
  cpu: "",
  ram: 0,
  storage: 0,
  address: "",
  location: "",
  services: [],
  notes: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: Device;
  onSubmit: (input: DeviceInput) => void;
}

export function DeviceFormDialog({ open, onOpenChange, device, onSubmit }: Props) {
  const [form, setForm] = useState<DeviceInput>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});


  const [serviceName, setServiceName] = useState("");
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("Running");

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setServiceName("");
    setForm(
      device
        ? {
            name: device.name,
            type: device.type,
            status: device.status,
            os: device.os,
            cpu: device.cpu,
            ram: device.ram,
            storage: device.storage,
            address: device.address,
            location: device.location,
            services: device.services.map((s) => ({ ...s })),
            notes: device.notes,
          }
        : emptyForm,
    );
  }, [open, device]);

  const set = <K extends keyof DeviceInput>(key: K, value: DeviceInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addService = () => {
    const name = serviceName.trim();
    if (!name) return;
    const service: Service = {
      id: `svc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      name,
      status: serviceStatus,
    };
    set("services", [...form.services, service]);
    setServiceName("");
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Device name is required.";
    if (form.ram < 0) next.ram = "RAM cannot be negative.";
    if (form.storage < 0) next.storage = "Storage cannot be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit({
      ...form,
      name: form.name.trim(),
      os: form.os.trim(),
      cpu: form.cpu.trim(),
      address: form.address.trim(),
      location: form.location.trim(),
      notes: form.notes.trim(),
      ram: Number(form.ram) || 0,
      storage: Number(form.storage) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{device ? "Edit device" : "Add device"}</DialogTitle>
          <DialogDescription>
            Inventory data is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              placeholder="proxmox-01"
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set("type", v as DeviceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as DeviceStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="os">Operating system</Label>
            <Input
              id="os"
              value={form.os}
              placeholder="Debian 12"
              onChange={(e) => set("os", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpu">CPU</Label>
            <Input
              id="cpu"
              value={form.cpu}
              placeholder="Intel i5-8500T (6c)"
              onChange={(e) => set("cpu", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ram">RAM (GB)</Label>
            <Input
              id="ram"
              type="number"
              min={0}
              value={form.ram}
              onChange={(e) => set("ram", Number(e.target.value))}
            />
            {errors.ram && <p className="text-xs text-destructive">{errors.ram}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="storage">Storage (GB)</Label>
            <Input
              id="storage"
              type="number"
              min={0}
              value={form.storage}
              onChange={(e) => set("storage", Number(e.target.value))}
            />
            {errors.storage && (
              <p className="text-xs text-destructive">{errors.storage}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">IP / hostname</Label>
            <Input
              id="address"
              value={form.address}
              placeholder="10.0.0.10 / host.lan"
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              placeholder="Basement rack — U3"
              onChange={(e) => set("location", e.target.value)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Services</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={serviceName}
                placeholder="SSH, Jellyfin, Nginx…"
                onChange={(e) => setServiceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addService();
                  }
                }}
              />
              <Select
                value={serviceStatus}
                onValueChange={(v) => setServiceStatus(v as ServiceStatus)}
              >
                <SelectTrigger className="sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="secondary" onClick={addService}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
            {form.services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.services.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 py-1 pr-1 pl-2 font-mono text-xs"
                  >
                    {s.name}
                    <StatusBadge status={s.status} kind="service" className="border-0 bg-transparent px-0" />
                    <button
                      type="button"
                      aria-label={`Remove ${s.name}`}
                      className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      onClick={() =>
                        set(
                          "services",
                          form.services.filter((x) => x.id !== s.id),
                        )
                      }
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              placeholder="Backup schedule, quirks, cabling…"
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{device ? "Save changes" : "Add device"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
