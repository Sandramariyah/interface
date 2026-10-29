import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel, MetricCard } from "@/components/ui/page-shared";
import { Upload, FileText, Clock, CheckCircle2, ArrowRight } from "lucide-react";

const RFPS = [
  {
    id: "RFP-2026-014",
    client: "Crown Bank",
    title: "Managed SOC services — 18-month engagement",
    industry: "BFSI",
    dueIn: 12,
    completion: 67,
    requirements: 142,
    answered: 95,
    status: "in-progress" as const,
    owner: "M. Chen",
  },
  {
    id: "RFP-2026-018",
    client: "AvionTech Aerospace",
    title: "Sentinel migration from QRadar",
    industry: "Aerospace",
    dueIn: 5,
    completion: 45,
    requirements: 88,
    answered: 40,
    status: "urgent" as const,
    owner: "A. Mehta",
  },
  {
    id: "RFP-2026-021",
    client: "MediCare Group",
    title: "DLP & compliance modernization",
    industry: "Healthcare",
    dueIn: 27,
    completion: 12,
    requirements: 64,
    answered: 8,
    status: "early" as const,
    owner: "P. Raman",
  },
  {
    id: "RFP-2026-009",
    client: "Helios Energy",
    title: "OT/IT converged SOC",
    industry: "Energy",
    dueIn: 0,
    completion: 100,
    requirements: 124,
    answered: 124,
    status: "submitted" as const,
    owner: "Y. Tanaka",
  },
];

const STATUS_META = {
  urgent: { label: "Urgent", tone: "danger" as const },
  "in-progress": { label: "In progress", tone: "accent" as const },
  early: { label: "Early stage", tone: "neutral" as const },
  submitted: { label: "Submitted", tone: "success" as const },
};

export default function RfpStudioPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="rfp studio"
        title="RFP studio"
        description="Upload an RFP to parse requirements, auto-build the compliance matrix, and draft a skeleton deck. Brand enforcement runs on every export."
        action={
          <Link
            href="/chat?agent=rfp"
            className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            <Upload className="size-4" />
            Upload RFP
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Active RFPs" value="9" icon={FileText} />
        <MetricCard label="Due this week" value="3" delta={{ value: "1 urgent", tone: "down" }} icon={Clock} />
        <MetricCard label="Won (YTD)" value="14" delta={{ value: "+22% vs '25", tone: "up" }} icon={CheckCircle2} />
        <MetricCard label="Win rate" value="64%" delta={{ value: "+8pp", tone: "up" }} />
      </div>

      <div className="rounded-lg border border-dashed border-border-strong bg-bg-elevated/40 p-8 text-center bg-grid">
        <Upload className="size-7 mx-auto text-fg-subtle mb-3" />
        <div className="text-sm font-medium text-fg">Drop an RFP here</div>
        <p className="text-xs text-fg-muted mt-1 max-w-md mx-auto">
          PDF, DOCX, or PPTX up to 50 MB. Document Intelligence will extract requirements;
          the RFP agent will build a compliance matrix and skeleton response.
        </p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-3.5 py-1.5 text-xs font-medium hover:bg-bg-overlay transition-colors">
          Browse files
        </button>
      </div>

      <div>
        <SectionLabel>In-flight RFPs</SectionLabel>
        <div className="mt-3 rounded-lg border border-border bg-bg-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg/40 text-left">
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">RFP / client</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Status</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Progress</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Due</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Owner</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RFPS.map((r) => {
                const sm = STATUS_META[r.status];
                return (
                  <tr key={r.id} className="hover:bg-bg-overlay/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-fg">{r.client}</div>
                      <div className="text-xs text-fg-muted truncate max-w-md">{r.title}</div>
                      <div className="text-[10px] text-fg-subtle font-mono mt-0.5">
                        {r.id} · {r.industry}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={sm.tone}>{sm.label}</StatusPill>
                    </td>
                    <td className="px-4 py-3 min-w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${r.completion}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-fg-muted tabular-nums">
                          {r.answered}/{r.requirements}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.status === "submitted"
                            ? "text-success text-xs font-mono"
                            : r.dueIn <= 7
                              ? "text-danger text-xs font-mono"
                              : "text-fg-muted text-xs font-mono"
                        }
                      >
                        {r.status === "submitted" ? "Submitted" : `${r.dueIn}d`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-muted">{r.owner}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/chat?agent=rfp`}
                        className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
                      >
                        Open <ArrowRight className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}