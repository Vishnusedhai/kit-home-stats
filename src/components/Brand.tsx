import { Terminal } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
        <Terminal className="size-4" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="font-mono text-sm font-semibold tracking-tight text-foreground">
            HomeLab
            <span className="text-primary">/</span>
            Dashboard
          </div>
          <div className="mono-label">self-hosted inventory</div>
        </div>
      )}
    </div>
  );
}
