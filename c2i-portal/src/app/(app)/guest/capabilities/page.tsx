import { PageHeader, SectionLabel } from "@/components/ui/page-shared";
import { Eye, Cloud, Lock, FileCheck, Zap, Users } from "lucide-react";

const PUBLIC_CAPABILITIES = [
  {
    domain: "Detection & Response",
    icon: Eye,
    services: ["24×7 Managed SOC", "Managed Detection & Response", "Threat Hunting", "Incident Response & Forensics"],
  },
  {
    domain: "Platform Engineering",
    icon: Cloud,
    services: ["Microsoft Sentinel Architecture", "SOAR Implementation", "Defender XDR", "SIEM Migration"],
  },
  {
    domain: "Identity & Access",
    icon: Lock,
    services: ["Privileged Access Management", "Identity Governance", "Zero Trust Architecture"],
  },
  {
    domain: "Data & Compliance",
    icon: FileCheck,
    services: ["DLP Modernization", "Information Protection", "Regulatory Mapping (HIPAA, GDPR, PCI)"],
  },
  {
    domain: "Threat Intelligence",
    icon: Zap,
    services: ["Strategic Threat Intelligence Programs", "IOC Feeds", "Brand & Dark Web Monitoring"],
  },
  {
    domain: "Advisory",
    icon: Users,
    services: ["Security Strategy & Roadmap", "Maturity Assessment (NIST CSF)", "Board-level Advisory"],
  },
];

export default function GuestCapabilitiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="guest / capabilities"
        title="Capabilities"
        description="CyberProof's six service domains. Detailed maturity ratings, customer counts, and SME profiles are available under partner NDA — please contact your account team."
      />

      <SectionLabel>Service domains</SectionLabel>

      <div className="grid sm:grid-cols-2 gap-4">
        {PUBLIC_CAPABILITIES.map((c) => {
          const Icon = c.icon;
          return (
            <article
              key={c.domain}
              className="rounded-lg border border-border bg-bg-elevated p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Icon className="size-4 text-accent" />
                </div>
                <h3 className="font-medium">{c.domain}</h3>
              </div>
              <ul className="space-y-2">
                {c.services.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-fg-muted">
                    <span className="text-accent mt-1.5 size-1 rounded-full bg-accent shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-bg-elevated p-5 text-sm text-fg-muted">
        <strong className="text-fg">Want the full picture?</strong> Maturity ratings, active
        engagement counts, named references, and SME profiles are visible to authenticated UST
        team members. Partners with executed NDAs can request a curated view via{" "}
        <a href="mailto:partners@cyberproof.com" className="text-accent hover:underline">
          partners@cyberproof.com
        </a>
        .
      </div>
    </div>
  );
}