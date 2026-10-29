import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel, MetricCard } from "@/components/ui/page-shared";
import { Plus, Target, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

const DEALS = [
  {
    id: "OPP-4821",
    name: "Apex Mutual",
    description: "SIEM modernization · Splunk ES → Sentinel · 3-year managed",
    tcv: "$4.2M",
    score: 78,
    recommendation: "pursue" as const,
    risks: ["Incumbent has 8y tenure", "Complex Splunk SPL migration"],
    strengths: ["Sentinel reference in same segment", "Existing IR retainer"],
    stage: "Solutioning",
    closeDate: "Q3 2026",
  },
  {
    id: "OPP-4889",
    name: "Helios Energy",
    description: "OT SOC · Defender for IoT + Claroty · greenfield",
    tcv: "$7.5M",
    score: 84,
    recommendation: "strong-pursue" as const,
    risks: ["Long sales cycle in utilities"],
    strengths: ["Top 3 OT references", "Yuki Tanaka on bench"],
    stage: "Proposal",
    closeDate: "Q4 2026",
  },
  {
    id: "OPP-4901",
    name: "Northwind Health",
    description: "Managed Detection & Response · 18-month engagement",
    tcv: "$1.8M",
    score: 62,
    recommendation: "pursue-cautious" as const,
    risks: ["No prior Healthcare ref this geo", "Budget signals soft"],
    strengths: ["Strong MDR maturity", "HIPAA expertise"],
    stage: "Qualifying",
    closeDate: "Q3 2026",
  },
  {
    id: "OPP-4922",
    name: "BlueWave Retail",
    description: "Threat hunting program · 12 months",
    tcv: "$850K",
    score: 41,
    recommendation: "no-go" as const,
    risks: ["Incumbent SI very entrenched", "Low margin", "No exec relationship"],
    strengths: ["Threat hunting capability"],
    stage: "Qualifying",
    closeDate: "Q3 2026",
  },
];

const REC_META = {
  "strong-pursue": { label: "Strong pursue", tone: "success" as const },
  pursue: { label: "Pursue", tone: "success" as const },
  "pursue-cautious": { label: "Pursue (caution)", tone: "warning" as const },
  "no-go": { label: "No-go", tone: "danger" as const },
};

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 75 ? "var(--success)" : score >= 55 ? "var(--warning)" : "var(--danger)";
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative size-12 shrink-0">
      <svg viewBox="0 0 48 48" className="size-12 -rotate-90">
        <circle cx="24" cy="24" r="18" fill="none" stroke="var(--bg-overlay)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke={tone}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums">
        {score}
      </div>
    </div>
  );
}

export default function DealQualifierPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="deal qualifier"
        title="Deal qualifier"
        description="Go/No-Go assessments scored against historic win/loss patterns. Risks and strengths cite case-study and pursuit evidence."
        action={
          <Link
            href="/chat?agent=deal"
            className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            <Plus className="size-4" />
            Qualify new deal
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="In pipeline" value="14" icon={Target} />
        <MetricCard label="Avg score" value="68" delta={{ value: "+4 vs Q1", tone: "up" }} icon={TrendingUp} />
        <MetricCard label="Pursued (YTD)" value="11" />
        <MetricCard label="No-go (YTD)" value="3" icon={AlertTriangle} />
      </div>

      <SectionLabel>Recent qualifications</SectionLabel>

      <div className="space-y-3">
        {DEALS.map((d) => {
          const rec = REC_META[d.recommendation];
          return (
            <article
              key={d.id}
              className="rounded-lg border border-border bg-bg-elevated p-5 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start gap-5">
                <ScoreRing score={d.score} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-medium text-fg">{d.name}</h3>
                    <span className="font-mono text-[11px] text-fg-subtle">{d.id}</span>
                    <StatusPill tone={rec.tone}>{rec.label}</StatusPill>
                    <StatusPill>{d.stage}</StatusPill>
                  </div>
                  <p className="text-sm text-fg-muted mt-1">{d.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4 text-xs">
                    <div>
                      <div className="font-mono text-[10px] tracking-wider text-success uppercase mb-1.5">
                        Strengths
                      </div>
                      <ul className="space-y-1 text-fg-muted">
                        {d.strengths.map((s) => (
                          <li key={s} className="flex gap-1.5">
                            <span className="text-success">+</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-wider text-warning uppercase mb-1.5">
                        Risks
                      </div>
                      <ul className="space-y-1 text-fg-muted">
                        {d.risks.map((r) => (
                          <li key={r} className="flex gap-1.5">
                            <span className="text-warning">!</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
                    TCV
                  </div>
                  <div className="text-xl font-medium tabular-nums mt-0.5">{d.tcv}</div>
                  <div className="text-[11px] text-fg-subtle mt-0.5 font-mono">{d.closeDate}</div>
                  <Link
                    href="/chat?agent=deal"
                    className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg mt-3"
                  >
                    Review <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}