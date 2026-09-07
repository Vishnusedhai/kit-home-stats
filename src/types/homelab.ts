export const DEVICE_TYPES = [
  "PC",
  "Server",
  "NAS",
  "Raspberry Pi",
  "VM",
  "Laptop",
  "Other",
] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export const DEVICE_STATUSES = ["Online", "Offline", "Maintenance"] as const;
export type DeviceStatus = (typeof DEVICE_STATUSES)[number];

export const SERVICE_STATUSES = ["Running", "Stopped", "Error"] as const;
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  os: string;
  cpu: string;
  /** RAM in GB */
  ram: number;
  /** Storage in GB */
  storage: number;
  address: string;
  location: string;
  services: Service[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type DeviceInput = Omit<Device, "id" | "createdAt" | "updatedAt">;

export interface Settings {
  theme: "dark" | "light";
}

export const DEFAULT_SETTINGS: Settings = { theme: "dark" };
