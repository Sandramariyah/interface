import { PageHeader, SectionLabel, MetricCard, StatusPill } from "@/components/ui/page-shared";
import { Sparkles, ThumbsUp, ThumbsDown, Activity, TrendingUp } from "lucide-react";

const AGENTS = [
  { id: "router", name: "Storyline Router", invocations: 1247, groundedness: 96, latency: "0.8s", thumbsUp: 92 },
  { id: "rfp", name: "RFP Response", invocations: 311, groundedness: 94, latency: "8.2s", thumbsUp: 88 },
  { id: "solution", name: "Solution Architect", invocations: 184, groundedness: 91, latency: "11.4s", thumbsUp: 84 },
  { id: "sme", name: "SME Matcher", invocations: 408, groundedness: 97, latency: "1.6s", thumbsUp: 94 },
  { id: "deal", name: "Deal Qualifier", invocations: 217, groundedness: 89, latency: "3.1s", thumbsUp: 79 },
  { id: "pricing", name: "Pricing / PIP", invocations: 142, groundedness: 92, latency: "2.4s", thumbsUp: 81 },
  { id: "compliance", name: "Compliance", invocations: 89, groundedness: 96, latency: "4.7s", thumbsUp: 90 },
  { id: "diagram", name: "Diagram / Content", invocations: 256, groundedness: 88, latency: "6.3s", thumbsUp: 86 },
];

export default function EvalPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="admin / eval"
        title="Eval & analytics"
        description="Continuous evaluation against golden datasets plus user-feedback signals. Win-correlation tracks which content and agents touched winning vs losing deals."
      />

      <div>
        <SectionLabel>Last 7 days</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <MetricCard
            label="Avg groundedness"
            value="93%"
            delta={{ value: "+2pp", tone: "up" }}
            icon={Activity}
          />
          <MetricCard
            label="Citation accuracy"
            value="91%"
            delta={{ value: "+1pp", tone: "up" }}
          />
          <MetricCard
            label="Brand compliance"
            value="97%"
            delta={{ value: "stable", tone: "flat" }}
          />
          <MetricCard
            label="Win-correlation"
            value="+18%"
            delta={{ value: "vs unassisted", tone: "up" }}
            icon={TrendingUp}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <SectionLabel>Agent performance</SectionLabel>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg/40 text-left">
                  <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Agent</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">Calls</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">Groundedness</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">p50</th>
                  <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase text-right">👍</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AGENTS.map((a) => (
                  <tr key={a.id} className="hover:bg-bg-overlay/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-accent" />
                        <span className="text-sm">{a.name}</span>
                      </div>
                      <div className="text-[11px] text-fg-subtle font-mono mt-0.5 ml-5.5">
                        {a.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums font-mono">
                      {a.invocations.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          a.groundedness >= 95
                            ? "text-success text-sm tabular-nums font-mono"
                            : a.groundedness >= 90
                              ? "text-fg text-sm tabular-nums font-mono"
                              : "text-warning text-sm tabular-nums font-mono"
                        }
                      >
                        {a.groundedness}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums font-mono text-fg-muted">
                      {a.latency}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums font-mono">{a.thumbsUp}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <SectionLabel>Recent feedback</SectionLabel>
          <div className="mt-3 rounded-lg border border-border bg-bg-elevated p-4 space-y-3">
            <FeedbackItem
              positive
              text="The Sentinel architecture variant matched what we'd actually deploy."
              meta="RFP Response · 2h ago"
            />
            <FeedbackItem
              positive
              text="SME match included someone I wouldn't have thought of — perfect fit."
              meta="SME Matcher · 5h ago"
            />
            <FeedbackItem
              text="Pricing estimate was 18% low — needs more recent PIP data."
              meta="Pricing / PIP · 1d ago"
            />
            <FeedbackItem
              positive
              text="Compliance matrix caught a HIPAA gap we'd missed."
              meta="RFP Response · 1d ago"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeedbackItem({
  positive,
  text,
  meta,
}: {
  positive?: boolean;
  text: string;
  meta: string;
}) {
  return (
    <div className="flex gap-2.5 text-sm">
      {positive ? (
        <ThumbsUp className="size-3.5 text-success shrink-0 mt-0.5" />
      ) : (
        <ThumbsDown className="size-3.5 text-warning shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-fg-muted leading-relaxed">&ldquo;{text}&rdquo;</p>
        <div className="text-[11px] text-fg-subtle font-mono mt-1">{meta}</div>
      </div>
    </div>
  );
}