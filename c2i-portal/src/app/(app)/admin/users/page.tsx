import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Search, Filter, MoreVertical, Plus } from "lucide-react";

const USERS = [
  { id: "u-001", name: "Anjali Mehta", email: "anjali.mehta@ust.com", tier: "tier2", lastSeen: "2 min ago", bu: "Presales" },
  { id: "u-002", name: "Marcus Chen", email: "marcus.chen@ust.com", tier: "tier2", lastSeen: "8 min ago", bu: "Presales" },
  { id: "u-003", name: "Priya Raman", email: "priya.raman@ust.com", tier: "tier2", lastSeen: "1h ago", bu: "Compliance" },
  { id: "u-004", name: "Carlos Martinez", email: "carlos.martinez@ust.com", tier: "tier1", lastSeen: "yesterday", bu: "Federal" },
  { id: "u-005", name: "David Okonkwo", email: "david.okonkwo@ust.com", tier: "tier2", lastSeen: "active now", bu: "Threat Hunting" },
  { id: "u-006", name: "Sofia Larsen", email: "sofia.larsen@ust.com", tier: "tier1", lastSeen: "3h ago", bu: "Cloud Security" },
  { id: "u-007", name: "Ahmed Hassan", email: "ahmed.hassan@ust.com", tier: "tier2", lastSeen: "4h ago", bu: "Identity" },
  { id: "u-008", name: "Yuki Tanaka", email: "yuki.tanaka@ust.com", tier: "tier2", lastSeen: "2 days ago", bu: "OT Security" },
  { id: "u-009", name: "Rajesh Kapoor", email: "rajesh.kapoor@ust.com", tier: "tier3", lastSeen: "active now", bu: "Platform" },
  { id: "u-010", name: "Emma Stewart", email: "emma.stewart@ust.com", tier: "tier3", lastSeen: "active now", bu: "Platform" },
  { id: "u-011", name: "Linda Ochoa", email: "linda.ochoa@externalpartner.com", tier: "guest", lastSeen: "1 day ago", bu: "Partner — Microsoft" },
  { id: "u-012", name: "Thomas Wright", email: "thomas.wright@externalpartner.com", tier: "guest", lastSeen: "5 days ago", bu: "Partner — Splunk" },
];

const TIER_META = {
  tier1: { label: "T1 · Leadership", tone: "accent" as const },
  tier2: { label: "T2 · Presales", tone: "success" as const },
  tier3: { label: "T3 · Admin", tone: "warning" as const },
  guest: { label: "Guest", tone: "neutral" as const },
};

export default function UsersPage() {
  const counts = USERS.reduce((acc, u) => {
    acc[u.tier] = (acc[u.tier] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="admin / users"
        title="Users & roles"
        description="Tier assignment is sourced from Entra ID security group membership in production. In demo mode this view is read-only."
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-3.5 py-2 text-sm font-medium hover:bg-fg/90 transition-colors">
            <Plus className="size-4" />
            Invite user
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(TIER_META) as Array<keyof typeof TIER_META>).map((tier) => (
          <div key={tier} className="rounded-lg border border-border bg-bg-elevated p-4">
            <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
              {TIER_META[tier].label}
            </div>
            <div className="mt-1 text-2xl font-medium tabular-nums">{counts[tier] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search className="size-4 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, BU…"
            className="w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 py-2 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-fg-subtle mr-1" />
          {["All tiers", "T1", "T2", "T3", "Guest"].map((f, i) => (
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

      <SectionLabel>{USERS.length} users</SectionLabel>

      <div className="rounded-lg border border-border bg-bg-elevated overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg/40 text-left">
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">User</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Tier</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">BU</th>
              <th className="px-4 py-2.5 font-mono text-[10px] tracking-wider text-fg-subtle uppercase">Last seen</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {USERS.map((u) => (
              <tr key={u.id} className="hover:bg-bg-overlay/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-7 rounded-full bg-bg-overlay border border-border flex items-center justify-center text-[11px] font-medium shrink-0">
                      {u.name.split(" ").map((n) => n.charAt(0)).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-fg truncate">{u.name}</div>
                      <div className="text-[11px] text-fg-subtle font-mono truncate">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusPill tone={TIER_META[u.tier as keyof typeof TIER_META].tone}>
                    {TIER_META[u.tier as keyof typeof TIER_META].label}
                  </StatusPill>
                </td>
                <td className="px-4 py-3 text-sm text-fg-muted">{u.bu}</td>
                <td className="px-4 py-3 text-xs text-fg-muted font-mono">{u.lastSeen}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-fg-muted hover:text-fg">
                    <MoreVertical className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}