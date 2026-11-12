import type { ReactNode } from "react";

export const adminInputClass =
  "w-full rounded-md border border-input bg-surface-2 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function AdminField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {children}
    </p>
  );
}

export function StatusBadge({ on, onLabel = "Active", offLabel = "Off" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${on ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
      {on ? onLabel : offLabel}
    </span>
  );
}
