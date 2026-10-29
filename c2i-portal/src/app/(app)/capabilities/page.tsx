import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Sparkles, Cloud, Lock, Eye, Zap, Users, FileCheck } from "lucide-react";

const CAPABILITIES = [
  {
    domain: "Detection & Response",
    icon: Eye,
    services: [
      { name: "Managed SOC (24×7)", maturity: 5, customers: 38 },
      { name: "MDR", maturity: 5, customers: 22 },
      { name: "Threat Hunting", maturity: 4, customers: 17 },
      { name: "Incident Response & Forensics", maturity: 4, customers: 14 },
    ],
  },
  {
    domain: "Platform Engineering",
    icon: Cloud,
    services: [
      { name: "Sentinel Architecture", maturity: 5, customers: 41 },
      { name: "Splunk ES Migration", maturity: 4, customers: 12 },
      { name: "SOAR Implementation", maturity: 5, customers: 19 },
      { name: "Defender XDR", maturity: 4, customers: 16 },
    ],
  },
  {
    domain: "Identity & Access",
    icon: Lock,
    services: [
      { name: "Privileged Access (PAM)", maturity: 5, customers: 24 },
      { name: "Identity Governance", maturity: 4, customers: 18 },
      { name: "Zero Trust Architecture", maturity: 4, customers: 11 },
    ],
  },
  {
    domain: "Data & Compliance",
    icon: FileCheck,
    services: [
      { name: "DLP Modernization", maturity: 4, customers: 9 },
      { name: "Information Protection (Purview)", maturity: 4, customers: 14 },
      { name: "Regulatory Mapping", maturity: 3, customers: 7 },
    ],
  },
  {
    domain: "Threat Intelligence",
    icon: Zap,
    services: [
      { name: "Strategic TI Program", maturity: 4, customers: 11 },
      { name: "Tactical IOC Feeds", maturity: 5, customers: 28 },
      { name: "Brand & Dark Web Monitoring", maturity: 3, customers: 6 },
    ],
  },
  {
    domain: "Advisory & Transformation",
    icon: Users,
    services: [
      { name: "Security Strategy & Roadmap", maturity: 4, customers: 31 },
      { name: "Maturity Assessment (NIST CSF)", maturity: 5, customers: 47 },
      { name: "Board-level Advisory", maturity: 4, customers: 13 },
    ],
  },
];

function MaturityBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`h-1.5 w-3 rounded-sm ${n <= level ? "bg-accent" : "bg-bg-overlay"}`}
        />
      ))}
    </div>
  );
}

export default function CapabilitiesPage() {
  const totalServices = CAPABILITIES.reduce((sum, d) => sum + d.services.length, 0);
  const totalCustomers = CAPABILITIES.reduce(
    (sum, d) => sum + d.services.reduce((s, x) => s + x.customers, 0),
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="capabilities"
        title="Service capabilities"
        description="Maturity-rated service catalogue across the six CyberProof domains. Live counts reflect active engagements."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
            Domains
          </div>
          <div className="mt-1 text-2xl font-medium tabular-nums">{CAPABILITIES.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
            Services
          </div>
          <div className="mt-1 text-2xl font-medium tabular-nums">{totalServices}</div>
        </div>
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
            Active engagements
          </div>
          <div className="mt-1 text-2xl font-medium tabular-nums">{totalCustomers}</div>
        </div>
        <div className="rounded-lg border border-border bg-bg-elevated p-4">
          <div className="font-mono text-[10px] tracking-wider text-fg-subtle uppercase">
            Avg maturity
          </div>
          <div className="mt-1 text-2xl font-medium tabular-nums">4.3 / 5</div>
        </div>
      </div>

      <SectionLabel>Service catalogue</SectionLabel>

      <div className="grid lg:grid-cols-2 gap-4">
        {CAPABILITIES.map((d) => {
          const Icon = d.icon;
          return (
            <section
              key={d.domain}
              className="rounded-lg border border-border bg-bg-elevated overflow-hidden"
            >
              <header className="border-b border-border px-5 py-3 flex items-center gap-3">
                <div className="size-8 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Icon className="size-4 text-accent" />
                </div>
                <h3 className="font-medium">{d.domain}</h3>
                <span className="ml-auto font-mono text-[10px] tracking-wider text-fg-subtle">
                  {d.services.length} services
                </span>
              </header>
              <ul className="divide-y divide-border">
                {d.services.map((s) => (
                  <li key={s.name} className="px-5 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-fg">{s.name}</div>
                      <div className="text-[11px] text-fg-subtle mt-0.5 font-mono">
                        {s.customers} active customers
                      </div>
                    </div>
                    <MaturityBar level={s.maturity} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-fg-subtle">
        <Sparkles className="size-3 text-accent" />
        <span>
          Ask the router agent to build a capability view for a specific client industry × hyperscaler.
        </span>
      </div>
    </div>
  );
}