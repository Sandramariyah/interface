import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel, MetricCard } from "@/components/ui/page-shared";
import { Plus, Calculator, DollarSign, FileSpreadsheet, AlertTriangle } from "lucide-react";

const PIPS = [
  {
    id: "PIP-2026-021",
    deal: "Apex Mutual — Managed SOC",
    tcv: "$4.2M",
    margin: 24,
    status: "approved" as const,
    submitted: "May 28",
  },
  {
    id: "PIP-2026-022",
    deal: "Helios Energy — OT SOC",
    tcv: "$7.5M",
    margin: 31,
    status: "pending" as const,
    submitted: "May 30",
  },
  {
    id: "PIP-2026-023",
    deal: "Crown Bank — SIEM migration",
    tcv: "$4.8M",
    margin: 19,
    status: "review" as const,
    submitted: "Jun 02",
  },
  {
    id: "PIP-2026-019",
    deal: "MediCare Group — DLP",
    tcv: "$1.4M",
    margin: 14,
    status: "below-floor" as const,
    submitted: "May 22",
  },
];

const RATE_CARDS = [
  { role: "SOC Analyst L1", india: 28, emea: 95, americas: 110 },
  { role: "SOC Analyst L2", india: 42, emea: 135, americas: 155 },
  { role: "Senior Threat Hunter", india: 68, emea: 195, americas: 220 },
  { role: "Sentinel Architect", india: 75, emea: 220, americas: 250 },
  { role: "SOAR Engineer", india: 58, emea: 175, americas: 195 },
  { role: "Principal SME", india: 95, emea: 285, americas: 320 },
];

const PIP_STATUS_META = {
  approved: { label: "Approved", tone: "success" as const },
  pending: { label: "Pending", tone: "accent" as const },
  review: { label: "In review", tone: "warning" as const },
  "below-floor": { label: "Below floor", tone: "danger" as const },
};

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="pricing &amp; pip"
        title="Pricing & PIP"
        description="TCV ballpark from scope, rate card view by region × role, and PIP sheets ready for finance review. Margin floor violations are flagged automatically."
        action={
          <Link
            href="/chat?agent=pricing"
            className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            <Plus className="size-4" />
            New PIP
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="PIPs YTD" value="34" icon={FileSpreadsheet} />
        <MetricCard label="Avg margin" value="27%" delta={{ value: "+2pp vs Q1", tone: "up" }} icon={DollarSign} />
        <MetricCard label="Below floor" value="2" icon={AlertTriangle} />
        <MetricCard label="Avg TCV" value="$3.6M" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <SectionLabel>Recent PIPs</SectionLabel>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated divide-y divide-border overflow-hidden">
            {PIPS.map((p) => {
              const sm = PIP_STATUS_META[p.status];
              return (
                <div key={p.id} className="p-4 flex items-center gap-3 hover:bg-bg-overlay/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-fg truncate">{p.deal}</div>
                    <div className="text-[11px] text-fg-subtle font-mono mt-0.5">
                      {p.id} · submitted {p.submitted}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium tabular-nums">{p.tcv}</div>
                    <div className={`text-[11px] font-mono tabular-nums ${p.margin < 20 ? "text-danger" : "text-fg-muted"}`}>
                      {p.margin}% margin
                    </div>
                  </div>
                  <StatusPill tone={sm.tone}>{sm.label}</StatusPill>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <SectionLabel>Rate card — USD/hour</SectionLabel>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg/40">
                  <th className="px-4 py-2.5 text-left font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Role</th>
                  <th className="px-4 py-2.5 text-right font-mono text-[10px] tracking-wider text-fg-subtle uppercase">India</th>
                  <th className="px-4 py-2.5 text-right font-mono text-[10px] tracking-wider text-fg-subtle uppercase">EMEA</th>
                  <th className="px-4 py-2.5 text-right font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Americas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RATE_CARDS.map((r) => (
                  <tr key={r.role} className="hover:bg-bg-overlay/40 transition-colors">
                    <td className="px-4 py-2.5 text-sm text-fg">{r.role}</td>
                    <td className="px-4 py-2.5 text-sm text-right tabular-nums font-mono">${r.india}</td>
                    <td className="px-4 py-2.5 text-sm text-right tabular-nums font-mono">${r.emea}</td>
                    <td className="px-4 py-2.5 text-sm text-right tabular-nums font-mono">${r.americas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <Calculator className="size-3 text-accent" />
        <span>
          Ask the pricing agent for a ballpark TCV. Provide scope, duration, team mix, and geo —
          the agent cross-references historic PIPs for similar deals.
        </span>
      </div>
    </div>
  );
}