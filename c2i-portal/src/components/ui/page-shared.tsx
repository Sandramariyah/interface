import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ breadcrumb, title, description, action }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      <div className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
        {breadcrumb}
      </div>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
          {description && (
            <p className="text-fg-muted max-w-2xl mt-1.5 leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium text-fg-muted tracking-wider uppercase font-mono">
      {children}
    </h2>
  );
}

type PillTone = "neutral" | "accent" | "success" | "warning" | "danger";
const PILL_STYLES: Record<PillTone, string> = {
  neutral: "bg-bg-overlay text-fg-muted border-border",
  accent: "bg-accent/10 text-accent border-accent/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  danger: "bg-danger/10 text-danger border-danger/30",
};

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: PillTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-medium font-mono tracking-wide uppercase",
        PILL_STYLES[tone],
      )}
    >
      {children}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; tone: "up" | "down" | "flat" };
  icon?: LucideIcon;
}

export function MetricCard({ label, value, delta, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
          {label}
        </div>
        {Icon && <Icon className="size-4 text-fg-subtle" />}
      </div>
      <div className="mt-2 text-2xl font-medium tracking-tight tabular-nums">{value}</div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs tabular-nums",
            delta.tone === "up" && "text-success",
            delta.tone === "down" && "text-danger",
            delta.tone === "flat" && "text-fg-muted",
          )}
        >
          {delta.value}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated">
      <div className="p-12 text-center bg-grid">
        <Icon className="size-8 mx-auto text-fg-subtle mb-3" />
        <div className="text-sm font-medium text-fg mb-1">{title}</div>
        <p className="text-sm text-fg-muted mb-4 max-w-sm mx-auto">{description}</p>
        {action}
      </div>
    </div>
  );
}