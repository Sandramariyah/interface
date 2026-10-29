import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Database, RefreshCw, CheckCircle2, AlertCircle, Tag, ExternalLink } from "lucide-react";

const INDICES = [
  { name: "case-studies", docs: 487, chunks: 12_840, size: "184 MB", sync: "live" },
  { name: "rfp-corpus", docs: 1_204, chunks: 38_117, size: "612 MB", sync: "live" },
  { name: "architectures", docs: 96, chunks: 2_310, size: "47 MB", sync: "live" },
  { name: "sme-profiles", docs: 847, chunks: 4_018, size: "31 MB", sync: "4h ago" },
  { name: "partnerships", docs: 122, chunks: 980, size: "18 MB", sync: "live" },
  { name: "compliance-artifacts", docs: 318, chunks: 7_204, size: "94 MB", sync: "live" },
  { name: "collaterals", docs: 1_087, chunks: 14_521, size: "287 MB", sync: "live" },
];

const REVIEW_QUEUE = [
  {
    id: "DOC-92041",
    name: "Nordic Energy — OT SOC case study v2.docx",
    source: "SharePoint",
    issue: "Missing client-permission flag",
    severity: "high" as const,
  },
  {
    id: "DOC-92118",
    name: "MDR pricing model — H2 2026.pptx",
    source: "SharePoint",
    issue: "Stale (updated > 90d)",
    severity: "medium" as const,
  },
  {
    id: "DOC-91807",
    name: "AvionTech RFP response — final.docx",
    source: "Confluence",
    issue: "Outcome tag not set (won/lost)",
    severity: "medium" as const,
  },
  {
    id: "DOC-92201",
    name: "Sentinel architecture v3 reference.drawio",
    source: "SharePoint",
    issue: "Industry tag ambiguous",
    severity: "low" as const,
  },
];

const SEV_TONE = {
  high: "danger" as const,
  medium: "warning" as const,
  low: "neutral" as const,
};

export default function KnowledgeBasePage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="admin / knowledge base"
        title="Knowledge base"
        description="Index status across all retrieval surfaces, plus a curation queue for tagging gaps and stale content."
        action={
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-3.5 py-2 text-sm font-medium hover:bg-bg-overlay transition-colors">
            <RefreshCw className="size-4" />
            Force resync
          </button>
        }
      />

      <div>
        <SectionLabel>Azure AI Search indices</SectionLabel>
        <div className="mt-3 rounded-lg border border-border bg-bg-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg/40 text-left">
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Index</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">Docs</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">Chunks</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">Size</th>
                <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Sync</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INDICES.map((idx) => (
                <tr key={idx.name} className="hover:bg-bg-overlay/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="size-3.5 text-fg-subtle" />
                      <span className="font-mono text-sm">{idx.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums font-mono">{idx.docs.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums font-mono text-fg-muted">
                    {idx.chunks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums font-mono text-fg-muted">{idx.size}</td>
                  <td className="px-4 py-3">
                    {idx.sync === "live" ? (
                      <StatusPill tone="success">
                        <CheckCircle2 className="size-2.5" />
                        Live
                      </StatusPill>
                    ) : (
                      <span className="text-xs text-fg-muted font-mono">{idx.sync}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-fg-muted hover:text-fg">
                      <ExternalLink className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>Curation queue · {REVIEW_QUEUE.length} items</SectionLabel>
          <button className="text-xs text-fg-muted hover:text-fg flex items-center gap-1">
            <Tag className="size-3" />
            Bulk-tag
          </button>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-bg-elevated divide-y divide-border overflow-hidden">
          {REVIEW_QUEUE.map((doc) => (
            <div key={doc.id} className="px-4 py-3 flex items-center gap-3 hover:bg-bg-overlay/40 transition-colors">
              <AlertCircle className={`size-4 shrink-0 ${doc.severity === "high" ? "text-danger" : doc.severity === "medium" ? "text-warning" : "text-fg-muted"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-fg truncate">{doc.name}</div>
                <div className="text-[11px] text-fg-subtle font-mono mt-0.5">
                  {doc.id} · {doc.source}
                </div>
              </div>
              <div className="text-xs text-fg-muted hidden sm:block">{doc.issue}</div>
              <StatusPill tone={SEV_TONE[doc.severity]}>{doc.severity}</StatusPill>
              <button className="text-xs text-fg-muted hover:text-fg ml-2">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}