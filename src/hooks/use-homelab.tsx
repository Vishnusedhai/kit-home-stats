import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { demoDevices } from "@/lib/demo-data";
import {
  clearAll,
  loadDevices,
  loadSettings,
  saveDevices,
  saveSettings,
} from "@/lib/storage";
import {
  DEFAULT_SETTINGS,
  type Device,
  type DeviceInput,
  type Settings,
} from "@/types/homelab";

interface HomelabContextValue {
  devices: Device[];
  settings: Settings;
  ready: boolean;
  addDevice: (input: DeviceInput) => Device;
  updateDevice: (id: string, input: DeviceInput) => void;
  deleteDevice: (id: string) => void;
  getDevice: (id: string) => Device | undefined;
  setTheme: (theme: Settings["theme"]) => void;
  resetDemoData: () => void;
  clearData: () => void;
}

const HomelabContext = createContext<HomelabContextValue | null>(null);

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function HomelabProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDevices(loadDevices());
    setSettings(loadSettings());
    setReady(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  const persist = useCallback((next: Device[]) => {
    setDevices(next);
    saveDevices(next);
  }, []);

  const addDevice = useCallback(
    (input: DeviceInput) => {
      const stamp = new Date().toISOString();
      const device: Device = {
        ...input,
        id: newId(),
        createdAt: stamp,
        updatedAt: stamp,
      };
      persist([device, ...devices]);
      return device;
    },
    [devices, persist],
  );

  const updateDevice = useCallback(
    (id: string, input: DeviceInput) => {
      persist(
        devices.map((d) =>
          d.id === id ? { ...d, ...input, updatedAt: new Date().toISOString() } : d,
        ),
      );
    },
    [devices, persist],
  );

  const deleteDevice = useCallback(
    (id: string) => persist(devices.filter((d) => d.id !== id)),
    [devices, persist],
  );

  const getDevice = useCallback(
    (id: string) => devices.find((d) => d.id === id),
    [devices],
  );

  const setTheme = useCallback(
    (theme: Settings["theme"]) => {
      const next = { ...settings, theme };
      setSettings(next);
      saveSettings(next);
    },
    [settings],
  );

  const resetDemoData = useCallback(() => persist(demoDevices), [persist]);

  const clearData = useCallback(() => {
    clearAll();
    setDevices([]);
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<HomelabContextValue>(
    () => ({
      devices,
      settings,
      ready,
      addDevice,
      updateDevice,
      deleteDevice,
      getDevice,
      setTheme,
      resetDemoData,
      clearData,
    }),
    [
      devices,
      settings,
      ready,
      addDevice,
      updateDevice,
      deleteDevice,
      getDevice,
      setTheme,
      resetDemoData,
      clearData,
    ],
  );

  return <HomelabContext.Provider value={value}>{children}</HomelabContext.Provider>;
}

export function useHomelab() {
  const ctx = useContext(HomelabContext);
  if (!ctx) throw new Error("useHomelab must be used inside HomelabProvider");
  return ctx;
}

export function useHomelabStats() {
  const { devices } = useHomelab();
  return useMemo(() => {
    const online = devices.filter((d) => d.status === "Online").length;
    const offline = devices.filter((d) => d.status === "Offline").length;
    const maintenance = devices.filter((d) => d.status === "Maintenance").length;
    return {
      total: devices.length,
      online,
      offline,
      maintenance,
      totalRam: devices.reduce((s, d) => s + (Number(d.ram) || 0), 0),
      totalStorage: devices.reduce((s, d) => s + (Number(d.storage) || 0), 0),
      totalServices: devices.reduce((s, d) => s + d.services.length, 0),
    };
  }, [devices]);
}
