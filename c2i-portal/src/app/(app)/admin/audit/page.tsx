import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Search, Download, ScrollText, Filter } from "lucide-react";

const EVENTS = [
  {
    ts: "2026-06-03 09:42:18",
    actor: "anjali.mehta@ust.com",
    tier: "T2",
    event: "agent.invoke",
    agent: "rfp",
    detail: "Generated compliance matrix for RFP-2026-014",
    tone: "neutral" as const,
  },
  {
    ts: "2026-06-03 09:41:55",
    actor: "anjali.mehta@ust.com",
    tier: "T2",
    event: "retrieval",
    agent: "rfp",
    detail: "12 docs from case-studies (ACL trim: 47 → 12)",
    tone: "neutral" as const,
  },
  {
    ts: "2026-06-03 09:39:02",
    actor: "marcus.chen@ust.com",
    tier: "T2",
    event: "doc.generate",
    agent: "rfp",
    detail: "Generated Crown_Bank_RFP_v3.pptx · brand validated · 87 slides",
    tone: "success" as const,
  },
  {
    ts: "2026-06-03 09:37:21",
    actor: "carlos.martinez@ust.com",
    tier: "T1",
    event: "agent.invoke",
    agent: "deal",
    detail: "Qualified OPP-4922 BlueWave Retail · score 41 · No-go",
    tone: "warning" as const,
  },
  {
    ts: "2026-06-03 09:34:48",
    actor: "linda.ochoa@externalpartner.com",
    tier: "Guest",
    event: "rbac.block",
    agent: "rfp",
    detail: "Blocked: guest tier cannot invoke 'rfp' agent",
    tone: "danger" as const,
  },
  {
    ts: "2026-06-03 09:31:14",
    actor: "sofia.larsen@ust.com",
    tier: "T1",
    event: "agent.invoke",
    agent: "sme",
    detail: "Curated team for OPP-4889 Helios Energy · 6 candidates returned",
    tone: "neutral" as const,
  },
  {
    ts: "2026-06-03 09:28:55",
    actor: "rajesh.kapoor@ust.com",
    tier: "T3",
    event: "admin.action",
    agent: "—",
    detail: "Forced resync of Workday HRMS connector",
    tone: "accent" as const,
  },
  {
    ts: "2026-06-03 09:24:33",
    actor: "priya.raman@ust.com",
    tier: "T2",
    event: "agent.invoke",
    agent: "compliance",
    detail: "HIPAA + GDPR check on MediCare DLP scope · 2 gaps flagged",
    tone: "warning" as const,
  },
  {
    ts: "2026-06-03 09:21:09",
    actor: "david.okonkwo@ust.com",
    tier: "T2",
    event: "agent.invoke",
    agent: "solution",
    detail: "Generated 3 variants for SOL-2026-008 Crown Bank",
    tone: "neutral" as const,
  },
  {
    ts: "2026-06-03 09:17:42",
    actor: "system",
    tier: "—",
    event: "ingestion",
    agent: "—",
    detail: "Ingested 14 new docs from SharePoint · case-studies index",
    tone: "neutral" as const,
  },
];

export default function AuditPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="admin / audit log"
        title="Audit log"
        description="Immutable record of every agent call, retrieval, generation, and admin action. Stored 7 years; exportable for compliance."
        action={
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-3.5 py-2 text-sm font-medium hover:bg-bg-overlay transition-colors">
            <Download className="size-4" />
            Export CSV
          </button>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search className="size-4 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by actor, agent, event…"
            className="w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 py-2 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-fg-subtle mr-1" />
          {["All events", "Agent calls", "RBAC blocks", "Admin", "Ingestion"].map((f, i) => (
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

      <SectionLabel>Last 10 events</SectionLabel>

      <div className="rounded-lg border border-border bg-bg-elevated overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg/40 text-left">
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Timestamp</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Actor</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Event</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {EVENTS.map((e, i) => (
              <tr key={i} className="hover:bg-bg-overlay/40 transition-colors">
                <td className="px-4 py-3 font-mono text-[11px] text-fg-subtle whitespace-nowrap">
                  {e.ts}
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-fg truncate max-w-44">{e.actor}</div>
                  <div className="text-[10px] text-fg-subtle font-mono mt-0.5">{e.tier}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusPill tone={e.tone}>{e.event}</StatusPill>
                    {e.agent !== "—" && (
                      <span className="font-mono text-[11px] text-fg-subtle">{e.agent}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-fg-muted">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <ScrollText className="size-3" />
        <span>Audit log retention: 7 years. Stored in Cosmos DB with immutable writes via Synapse Link to Fabric for long-term archive.</span>
      </div>
    </div>
  );
}