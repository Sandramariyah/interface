import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel, MetricCard } from "@/components/ui/page-shared";
import {
  Database,
  Users,
  Sparkles,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

const CONNECTORS = [
  { name: "SharePoint Online", status: "healthy" as const, lastSync: "12 min ago", docs: 4127 },
  { name: "Confluence Cloud", status: "healthy" as const, lastSync: "18 min ago", docs: 892 },
  { name: "Salesforce — opportunities", status: "healthy" as const, lastSync: "5 min ago", docs: 3204 },
  { name: "Workday — SME profiles", status: "warning" as const, lastSync: "4h ago", docs: 1847 },
  { name: "Azure AI Search index", status: "healthy" as const, lastSync: "live", docs: 10070 },
  { name: "Cosmos Gremlin graph", status: "healthy" as const, lastSync: "live", docs: 0 },
];

const STATUS_META = {
  healthy: { label: "Healthy", tone: "success" as const, icon: CheckCircle2 },
  warning: { label: "Warning", tone: "warning" as const, icon: AlertCircle },
  down: { label: "Down", tone: "danger" as const, icon: AlertCircle },
};

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="admin / overview"
        title="Platform overview"
        description="Operational health of the C2I portal. Drill into KB, users, eval, or audit log from the sidebar."
      />

      <div>
        <SectionLabel>Last 24h</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <MetricCard
            label="Active users"
            value="187"
            delta={{ value: "+12% vs 7d", tone: "up" }}
            icon={Users}
          />
          <MetricCard
            label="Agent invocations"
            value="2,431"
            delta={{ value: "+8%", tone: "up" }}
            icon={Sparkles}
          />
          <MetricCard
            label="Token spend"
            value="$284"
            delta={{ value: "within budget", tone: "flat" }}
            icon={DollarSign}
          />
          <MetricCard
            label="Avg latency"
            value="1.4s"
            delta={{ value: "p95 3.1s", tone: "flat" }}
            icon={Activity}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <SectionLabel>Connector health</SectionLabel>
            <Link href="/admin/kb" className="text-xs text-fg-muted hover:text-fg inline-flex items-center gap-1">
              Manage <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated overflow-hidden divide-y divide-border">
            {CONNECTORS.map((c) => {
              const sm = STATUS_META[c.status];
              const Icon = sm.icon;
              return (
                <div key={c.name} className="px-4 py-3 flex items-center gap-3 hover:bg-bg-overlay/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fg">{c.name}</div>
                    <div className="text-[11px] text-fg-subtle font-mono mt-0.5">
                      synced {c.lastSync}{c.docs > 0 && ` · ${c.docs.toLocaleString()} docs`}
                    </div>
                  </div>
                  <StatusPill tone={sm.tone}>
                    <Icon className="size-2.5" />
                    {sm.label}
                  </StatusPill>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <SectionLabel>Eval signals</SectionLabel>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated p-5 space-y-4">
            <EvalRow label="Groundedness" value={94} />
            <EvalRow label="Citation accuracy" value={91} />
            <EvalRow label="Brand compliance" value={97} />
            <EvalRow label="Win-correlation" value={68} />
            <Link
              href="/admin/eval"
              className="block text-xs text-fg-muted hover:text-fg pt-2 border-t border-border inline-flex items-center gap-1"
            >
              Full eval dashboard <ArrowRight className="size-3" />
            </Link>
          </div>
        </section>
      </div>

      <div>
        <SectionLabel>Users by tier</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <MetricCard label="T1 · Leadership" value="42" />
          <MetricCard label="T2 · Presales" value="118" />
          <MetricCard label="T3 · Admin" value="6" />
          <MetricCard label="Guest" value="21" />
        </div>
      </div>
    </div>
  );
}

function EvalRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-xs tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
        <div
          className={
            value >= 80
              ? "h-full bg-success transition-all"
              : value >= 60
                ? "h-full bg-warning transition-all"
                : "h-full bg-danger transition-all"
          }
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}