export function formatStorage(gb: number): string {
  if (!Number.isFinite(gb) || gb <= 0) return "0 GB";
  if (gb >= 1000) {
    const tb = gb / 1000;
    return `${tb % 1 === 0 ? tb : tb.toFixed(1)} TB`;
  }
  return `${gb} GB`;
}

export function formatRam(gb: number): string {
  if (!Number.isFinite(gb) || gb <= 0) return "0 GB";
  return `${gb} GB`;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
