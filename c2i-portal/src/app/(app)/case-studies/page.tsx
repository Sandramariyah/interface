import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Plus, ExternalLink, Filter, Search } from "lucide-react";

const CASE_STUDIES = [
  {
    id: "CS-001",
    title: "Global Tier-1 Bank — SIEM Consolidation",
    client: "Anonymized · BFSI",
    industry: "BFSI",
    geo: "Europe",
    service: "SIEM Modernization",
    cloud: "Azure Sentinel",
    metric: "67% MTTD reduction",
    year: 2024,
    referenceable: true,
  },
  {
    id: "CS-002",
    title: "European Health Insurer — 24×7 SOC stand-up",
    client: "Anonymized · Healthcare",
    industry: "Healthcare",
    geo: "Europe",
    service: "Managed SOC",
    cloud: "Azure",
    metric: "99.97% SLA achieved",
    year: 2024,
    referenceable: true,
  },
  {
    id: "CS-003",
    title: "Automotive OEM — Ransomware Response Capability",
    client: "Anonymized · Manufacturing",
    industry: "Manufacturing",
    geo: "Germany",
    service: "IR & Forensics",
    cloud: "Hybrid",
    metric: "4-hour RTO achieved",
    year: 2023,
    referenceable: false,
  },
  {
    id: "CS-004",
    title: "Nordic Energy Co. — OT/IT Convergence",
    client: "Anonymized · Energy",
    industry: "Energy",
    geo: "Nordics",
    service: "OT Security",
    cloud: "Azure + Defender for IoT",
    metric: "Zero downtime cutover",
    year: 2024,
    referenceable: true,
  },
  {
    id: "CS-005",
    title: "Asian Mega-Retailer — Threat Hunting Program",
    client: "Anonymized · Retail",
    industry: "Retail",
    geo: "APAC",
    service: "Threat Hunting",
    cloud: "AWS",
    metric: "38 APT indicators confirmed",
    year: 2024,
    referenceable: false,
  },
  {
    id: "CS-006",
    title: "Pharma Multinational — DLP Modernization",
    client: "Anonymized · Pharma",
    industry: "Pharma",
    geo: "Global",
    service: "DLP & Compliance",
    cloud: "M365 + Purview",
    metric: "4M+ documents classified",
    year: 2024,
    referenceable: true,
  },
  {
    id: "CS-007",
    title: "Global Logistics — Identity & PAM",
    client: "Anonymized · Logistics",
    industry: "Logistics",
    geo: "Global",
    service: "Identity Security",
    cloud: "Azure AD + CyberArk",
    metric: "12K privileged accounts migrated",
    year: 2023,
    referenceable: true,
  },
  {
    id: "CS-008",
    title: "US Federal Agency — Threat Intel Platform",
    client: "Restricted · Government",
    industry: "Government",
    geo: "US",
    service: "Threat Intel",
    cloud: "Azure Government",
    metric: "Classified",
    year: 2024,
    referenceable: false,
  },
];

const FILTERS = ["All", "BFSI", "Healthcare", "Manufacturing", "Energy", "Retail", "Pharma"];

export default function CaseStudiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="case studies"
        title="Case studies"
        description="Validated client wins — filter by industry, geography, service line, or hyperscaler. Permission-flagged stories are clearly marked."
        action={
          <Link
            href="/chat?agent=router"
            className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            <Plus className="size-4" />
            New story
          </Link>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search className="size-4 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, outcome, technology…"
            className="w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 py-2 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="size-3.5 text-fg-subtle mr-1" />
          {FILTERS.map((f, i) => (
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
      </div>

      <SectionLabel>{CASE_STUDIES.length} studies · sorted by recency</SectionLabel>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CASE_STUDIES.map((c) => (
          <article
            key={c.id}
            className="group rounded-lg border border-border bg-bg-elevated hover:border-border-strong transition-all overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-wider text-fg-subtle">
                  {c.id} · {c.year}
                </span>
                {c.referenceable ? (
                  <StatusPill tone="success">Referenceable</StatusPill>
                ) : (
                  <StatusPill tone="warning">Anonymized</StatusPill>
                )}
              </div>
              <h3 className="font-medium text-fg leading-snug">{c.title}</h3>
              <div className="text-xs text-fg-muted">{c.client}</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <StatusPill>{c.industry}</StatusPill>
                <StatusPill>{c.geo}</StatusPill>
                <StatusPill tone="accent">{c.service}</StatusPill>
              </div>
            </div>
            <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-bg/40">
              <div className="text-xs">
                <span className="text-fg-subtle">Outcome: </span>
                <span className="text-fg font-medium">{c.metric}</span>
              </div>
              <ExternalLink className="size-3.5 text-fg-subtle group-hover:text-fg transition-colors" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}