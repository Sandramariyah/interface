import Link from "next/link";
import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Plus, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";

const SOLUTIONS = [
  {
    id: "SOL-2026-008",
    name: "Crown Bank — Managed SOC",
    client: "Crown Bank",
    rfp: "RFP-2026-014",
    variants: [
      {
        label: "A · Lean managed",
        ftes: 14,
        tcv: "$3.4M",
        score: 72,
        emphasis: "Speed, low risk",
      },
      {
        label: "B · Hybrid build",
        ftes: 22,
        tcv: "$4.8M",
        score: 81,
        emphasis: "Balanced",
        recommended: true,
      },
      {
        label: "C · Full transformation",
        ftes: 31,
        tcv: "$7.2M",
        score: 68,
        emphasis: "Strategic, high commitment",
      },
    ],
    lastModified: "2h ago",
  },
  {
    id: "SOL-2026-011",
    name: "Helios Energy — OT/IT SOC",
    client: "Helios Energy",
    rfp: "RFP-2026-009",
    variants: [
      { label: "A · IT-led with OT pilots", ftes: 18, tcv: "$5.1M", score: 65, emphasis: "Phased" },
      {
        label: "B · Converged with Claroty",
        ftes: 26,
        tcv: "$7.5M",
        score: 88,
        emphasis: "Full convergence",
        recommended: true,
      },
      { label: "C · OT-first standalone", ftes: 19, tcv: "$6.3M", score: 71, emphasis: "OT priority" },
    ],
    lastModified: "yesterday",
  },
];

export default function SolutionCanvasPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="solution canvas"
        title="Solution canvas"
        description="Each design exposes three architecture variants — Cost vs Performance, Risk vs Speed, Build vs Buy — with cited tradeoffs and a recommendation."
        action={
          <Link
            href="/chat?agent=solution"
            className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
          >
            <Plus className="size-4" />
            New solution
          </Link>
        }
      />

      <SectionLabel>{SOLUTIONS.length} active solutions</SectionLabel>

      <div className="space-y-5">
        {SOLUTIONS.map((s) => (
          <section
            key={s.id}
            className="rounded-lg border border-border bg-bg-elevated overflow-hidden"
          >
            <header className="border-b border-border px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="size-4 text-accent shrink-0" />
                  <h3 className="font-medium truncate">{s.name}</h3>
                </div>
                <div className="text-[11px] text-fg-subtle font-mono mt-1">
                  {s.id} · {s.rfp} · updated {s.lastModified}
                </div>
              </div>
              <Link
                href="/chat?agent=solution"
                className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg"
              >
                Open <ArrowRight className="size-3" />
              </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              {s.variants.map((v) => (
                <div
                  key={v.label}
                  className={`p-5 ${v.recommended ? "bg-accent/5" : ""} relative`}
                >
                  {v.recommended && (
                    <div className="absolute top-3 right-3">
                      <StatusPill tone="accent">
                        <CheckCircle2 className="size-2.5" />
                        Recommended
                      </StatusPill>
                    </div>
                  )}
                  <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
                    Variant
                  </div>
                  <h4 className="font-medium text-fg mt-1">{v.label}</h4>
                  <p className="text-xs text-fg-muted mt-1">{v.emphasis}</p>

                  <dl className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle font-mono uppercase tracking-wider text-[10px]">
                        TCV
                      </dt>
                      <dd className="text-fg font-medium tabular-nums">{v.tcv}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle font-mono uppercase tracking-wider text-[10px]">
                        Team size
                      </dt>
                      <dd className="text-fg tabular-nums">{v.ftes} FTE</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-fg-subtle font-mono uppercase tracking-wider text-[10px]">
                        Score
                      </dt>
                      <dd className="text-fg font-medium tabular-nums">{v.score} / 100</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}