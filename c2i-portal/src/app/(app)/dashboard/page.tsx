import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PERSONAS } from "@/lib/personas";
import Link from "next/link";
import { ArrowRight, FileText, GitBranch, Users, Target, MessageSquare } from "lucide-react";

const QUICK_ACTIONS = [
  {
    id: "new-rfp",
    label: "New RFP response",
    description: "Parse an RFP, build compliance matrix, draft skeleton deck.",
    href: "/chat?agent=rfp",
    icon: FileText,
    requiredAgent: "rfp" as const,
  },
  {
    id: "architect",
    label: "Solution architecture",
    description: "Generate A/B/C designs with explicit tradeoffs.",
    href: "/chat?agent=solution",
    icon: GitBranch,
    requiredAgent: "solution" as const,
  },
  {
    id: "sme",
    label: "Find SMEs",
    description: "Match a pursuit team to opportunity needs.",
    href: "/chat?agent=sme",
    icon: Users,
    requiredAgent: "sme" as const,
  },
  {
    id: "qualify",
    label: "Qualify a deal",
    description: "Go/No-Go assessment with historic win/loss evidence.",
    href: "/chat?agent=deal",
    icon: Target,
    requiredAgent: "deal" as const,
  },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  const persona = PERSONAS[session.user.tier];

  const actions = QUICK_ACTIONS.filter((a) => persona.allowedAgents.includes(a.requiredAgent));

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">
      <header className="space-y-2">
        <div className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
          {persona.label}
        </div>
        <h1 className="text-3xl font-medium tracking-tight">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="text-fg-muted max-w-2xl">
          Start a new task below or jump into the chat workspace for free-form pre-sales work.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-fg-muted tracking-wide uppercase">
          Quick actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {actions.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className="group relative rounded-lg border border-border bg-bg-elevated p-5 hover:border-border-strong hover:bg-bg-overlay transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <a.icon className="size-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-fg">{a.label}</h3>
                    <ArrowRight className="size-3.5 text-fg-subtle group-hover:text-fg group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-sm text-fg-muted mt-1 leading-relaxed">{a.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-fg-muted tracking-wide uppercase">
          Continue working
        </h2>
        <div className="rounded-lg border border-border bg-bg-elevated">
          <div className="p-12 text-center bg-grid">
            <MessageSquare className="size-8 mx-auto text-fg-subtle mb-3" />
            <p className="text-sm text-fg-muted mb-4">
              No recent threads. Start a new conversation to begin.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-4 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
            >
              <MessageSquare className="size-4" />
              Open workspace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
