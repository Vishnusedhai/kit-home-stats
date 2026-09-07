import { DEFAULT_SETTINGS, type Device, type Settings } from "@/types/homelab";
import { demoDevices } from "./demo-data";

export const DEVICES_KEY = "homelab.devices.v1";
export const SETTINGS_KEY = "homelab.settings.v1";
export const SEEDED_KEY = "homelab.seeded.v1";

const isBrowser = () => typeof window !== "undefined";

export function loadDevices(): Device[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(DEVICES_KEY);
    if (raw === null) {
      if (window.localStorage.getItem(SEEDED_KEY) === "1") return [];
      window.localStorage.setItem(SEEDED_KEY, "1");
      saveDevices(demoDevices);
      return demoDevices;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Device[]) : [];
  } catch {
    return [];
  }
}

export function saveDevices(devices: Device[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  } catch {
    /* quota or private mode — ignore */
  }
}

export function loadSettings(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export function clearAll() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(DEVICES_KEY);
  window.localStorage.removeItem(SETTINGS_KEY);
  window.localStorage.setItem(SEEDED_KEY, "1");
}
