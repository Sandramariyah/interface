import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Boxes, Cloud, Eye, ExternalLink, Search } from "lucide-react";

const ARCHITECTURES = [
  {
    id: "ARC-001",
    name: "Azure Sentinel + Microsoft 365 Defender",
    description: "Single-tenant cloud-native SOC stack with native XDR correlation.",
    cloud: "Azure",
    industry: "Cross-industry",
    components: 8,
    usage: 41,
    last: "Apr 2026",
  },
  {
    id: "ARC-002",
    name: "Hybrid OT/IT Security Stack",
    description: "Converged IT SOC + Defender for IoT + Claroty for OT visibility.",
    cloud: "Azure + on-prem",
    industry: "Energy, Manufacturing",
    components: 15,
    usage: 12,
    last: "May 2026",
  },
  {
    id: "ARC-003",
    name: "Multi-cloud SOC with central SIEM",
    description: "Sentinel as hub, ingesting from AWS, GCP, on-prem via custom connectors.",
    cloud: "Multi-cloud",
    industry: "Cross-industry",
    components: 12,
    usage: 18,
    last: "Mar 2026",
  },
  {
    id: "ARC-004",
    name: "Splunk ES → Sentinel migration pattern",
    description: "Phased coexistence with SPL → KQL translation and detection backporting.",
    cloud: "Azure",
    industry: "BFSI",
    components: 11,
    usage: 9,
    last: "May 2026",
  },
  {
    id: "ARC-005",
    name: "Identity-first Zero Trust",
    description: "Azure AD + Conditional Access + PAM (CyberArk) + Defender for Identity.",
    cloud: "Azure",
    industry: "Cross-industry",
    components: 9,
    usage: 22,
    last: "Apr 2026",
  },
  {
    id: "ARC-006",
    name: "FedRAMP-aligned MDR",
    description: "Azure Government tenant with FedRAMP High controls inheritance.",
    cloud: "Azure Government",
    industry: "Federal, Defense",
    components: 14,
    usage: 4,
    last: "Feb 2026",
  },
];

export default function ArchitecturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="architectures"
        title="Reference architectures"
        description="Battle-tested patterns by industry × cloud × service. Each comes with a drawio export, components list, and adoption history."
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search architectures…"
            className="w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 py-2 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
          />
        </div>
      </div>

      <SectionLabel>{ARCHITECTURES.length} reference patterns</SectionLabel>

      <div className="grid sm:grid-cols-2 gap-4">
        {ARCHITECTURES.map((a) => (
          <article
            key={a.id}
            className="group rounded-lg border border-border bg-bg-elevated hover:border-border-strong transition-all"
          >
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Boxes className="size-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
                    {a.id}
                  </div>
                  <h3 className="font-medium text-fg leading-snug mt-0.5">{a.name}</h3>
                  <p className="text-sm text-fg-muted mt-2 leading-relaxed">{a.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <StatusPill tone="accent">
                      <Cloud className="size-2.5" />
                      {a.cloud}
                    </StatusPill>
                    <StatusPill>{a.industry}</StatusPill>
                    <StatusPill>{a.components} components</StatusPill>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-border px-5 py-2.5 flex items-center justify-between bg-bg/40">
              <div className="text-[11px] text-fg-subtle font-mono">
                Used in {a.usage} solutions · updated {a.last}
              </div>
              <div className="flex items-center gap-3">
                <button className="text-[11px] text-fg-muted hover:text-fg flex items-center gap-1">
                  <Eye className="size-3" />
                  Preview
                </button>
                <button className="text-[11px] text-fg-muted hover:text-fg flex items-center gap-1">
                  <ExternalLink className="size-3" />
                  drawio
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}