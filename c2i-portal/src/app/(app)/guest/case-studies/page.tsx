import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Filter, BookOpen } from "lucide-react";

const PUBLIC_STUDIES = [
  {
    id: "CS-001",
    title: "Global Tier-1 Bank — SIEM Consolidation",
    industry: "Banking",
    geo: "Europe",
    service: "SIEM Modernization",
    outcome: "67% reduction in mean time to detect",
    year: 2024,
  },
  {
    id: "CS-002",
    title: "European Health Insurer — 24×7 SOC stand-up",
    industry: "Healthcare",
    geo: "Europe",
    service: "Managed SOC",
    outcome: "99.97% SLA achieved in first year",
    year: 2024,
  },
  {
    id: "CS-004",
    title: "Nordic Energy Co. — OT/IT Convergence",
    industry: "Energy",
    geo: "Nordics",
    service: "OT Security",
    outcome: "Zero unplanned downtime during cutover",
    year: 2024,
  },
  {
    id: "CS-006",
    title: "Pharma Multinational — DLP Modernization",
    industry: "Pharma",
    geo: "Global",
    service: "DLP & Compliance",
    outcome: "4M+ documents classified, 100% policy coverage",
    year: 2024,
  },
  {
    id: "CS-007",
    title: "Global Logistics — Identity & PAM",
    industry: "Logistics",
    geo: "Global",
    service: "Identity Security",
    outcome: "12,000 privileged accounts migrated",
    year: 2023,
  },
];

export default function GuestCaseStudiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="guest / case studies"
        title="Public case studies"
        description="Referenceable engagements with permission to share. Anonymized client identities. Detailed metrics, architectures, and contact references are available under partner NDA."
      />

      <div className="flex items-center gap-1.5">
        <Filter className="size-3.5 text-fg-subtle mr-1" />
        {["All", "Banking", "Healthcare", "Energy", "Pharma", "Logistics"].map((f, i) => (
          <button
            key={f}
            className={
              i === 0
                ? "px-2.5 py-1 rounded-md bg-bg-overlay text-fg text-xs font-medium"
                : "px-2.5 py-1 rounded-md text-fg-muted hover:bg-bg-overlay hover:text-fg text-xs font-medium transition-colors"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <SectionLabel>{PUBLIC_STUDIES.length} public studies</SectionLabel>

      <div className="grid sm:grid-cols-2 gap-4">
        {PUBLIC_STUDIES.map((c) => (
          <article
            key={c.id}
            className="rounded-lg border border-border bg-bg-elevated p-5 hover:border-border-strong transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-wider text-fg-subtle">
                {c.id} · {c.year}
              </span>
              <StatusPill tone="success">Referenceable</StatusPill>
            </div>
            <h3 className="font-medium text-fg leading-snug">{c.title}</h3>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <StatusPill>{c.industry}</StatusPill>
              <StatusPill>{c.geo}</StatusPill>
              <StatusPill tone="accent">{c.service}</StatusPill>
            </div>
            <div className="mt-4 pt-3 border-t border-border text-xs">
              <span className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
                Outcome
              </span>
              <p className="text-fg mt-1">{c.outcome}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-bg-elevated p-5 text-sm text-fg-muted flex items-start gap-3">
        <BookOpen className="size-5 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-fg">Full library available to UST partners.</strong>{" "}
          The complete repository includes 80+ engagements across all six service domains,
          with detailed architectures, configuration playbooks, and named delivery contacts.
        </div>
      </div>
    </div>
  );
}