import { PageHeader, StatusPill, SectionLabel } from "@/components/ui/page-shared";
import { Search, Filter, Mail, Calendar } from "lucide-react";

const SMES = [
  {
    id: "EMP-1041",
    name: "Anjali Mehta",
    title: "Principal Sentinel Architect",
    location: "Bangalore, IN",
    skills: ["Azure Sentinel", "KQL", "MITRE ATT&CK", "Defender XDR"],
    certs: ["MS Cybersecurity Architect Expert", "GCIA"],
    availability: "available",
    years: 14,
  },
  {
    id: "EMP-2287",
    name: "Marcus Chen",
    title: "SOAR Lead Engineer",
    location: "Singapore, SG",
    skills: ["Splunk SOAR", "Sentinel Playbooks", "Logic Apps", "Python"],
    certs: ["Splunk Architect", "GCIH"],
    availability: "partial",
    years: 11,
  },
  {
    id: "EMP-0834",
    name: "Sofia Larsen",
    title: "Cloud Security Architect",
    location: "Stockholm, SE",
    skills: ["AWS Security", "Azure", "Zero Trust", "CSPM"],
    certs: ["AWS Security Specialty", "CCSP"],
    availability: "available",
    years: 12,
  },
  {
    id: "EMP-1592",
    name: "David Okonkwo",
    title: "Threat Hunting Lead",
    location: "London, UK",
    skills: ["Threat hunting", "Splunk ES", "EDR", "Forensics"],
    certs: ["GIAC GCFA", "GCFR"],
    availability: "booked",
    years: 16,
  },
  {
    id: "EMP-3104",
    name: "Priya Raman",
    title: "DLP & Compliance SME",
    location: "Pune, IN",
    skills: ["M365 Purview", "DLP policies", "GDPR", "HIPAA"],
    certs: ["MS Information Protection", "CIPP/E"],
    availability: "available",
    years: 9,
  },
  {
    id: "EMP-0421",
    name: "Carlos Martinez",
    title: "Federal & Public Sector Lead",
    location: "Washington DC, US",
    skills: ["FedRAMP", "NIST 800-53", "Azure Gov", "ATO"],
    certs: ["CISSP", "FedRAMP 3PAO"],
    availability: "partial",
    years: 18,
  },
  {
    id: "EMP-1875",
    name: "Yuki Tanaka",
    title: "OT Security Specialist",
    location: "Tokyo, JP",
    skills: ["Defender for IoT", "Claroty", "Purdue model", "OT/IT"],
    certs: ["GICSP", "ISA/IEC 62443"],
    availability: "available",
    years: 13,
  },
  {
    id: "EMP-2960",
    name: "Ahmed Hassan",
    title: "Identity & PAM Architect",
    location: "Dubai, AE",
    skills: ["CyberArk", "BeyondTrust", "Saviynt", "Azure AD"],
    certs: ["CyberArk Certified Defender", "CISSP"],
    availability: "booked",
    years: 15,
  },
];

const AVAILABILITY_TONE = {
  available: { tone: "success" as const, label: "Available" },
  partial: { tone: "warning" as const, label: "Partial" },
  booked: { tone: "danger" as const, label: "Booked" },
};

export default function SmePage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
      <PageHeader
        breadcrumb="sme directory"
        title="SME directory"
        description="Search by skill, certification, geography, or domain. Ask the SME matcher agent to curate a pursuit team for a specific opportunity."
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search className="size-4 text-fg-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, skill, certification…"
            className="w-full rounded-md border border-border bg-bg-elevated pl-9 pr-3 py-2 text-sm placeholder:text-fg-subtle focus:outline-none focus:border-border-strong"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-fg-subtle mr-1" />
          {["All", "Available", "BFSI", "Healthcare", "OT/IT", "Federal"].map((f, i) => (
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

      <SectionLabel>{SMES.length} subject matter experts</SectionLabel>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SMES.map((s) => {
          const av = AVAILABILITY_TONE[s.availability as keyof typeof AVAILABILITY_TONE];
          return (
            <article
              key={s.id}
              className="rounded-lg border border-border bg-bg-elevated p-4 space-y-3 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-bg-overlay border border-border flex items-center justify-center text-sm font-medium shrink-0">
                  {s.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fg truncate">{s.name}</div>
                  <div className="text-xs text-fg-muted truncate">{s.title}</div>
                  <div className="text-[11px] text-fg-subtle mt-0.5">
                    {s.location} · {s.years}y
                  </div>
                </div>
                <StatusPill tone={av.tone}>{av.label}</StatusPill>
              </div>

              <div className="flex flex-wrap gap-1">
                {s.skills.slice(0, 3).map((sk) => (
                  <StatusPill key={sk}>{sk}</StatusPill>
                ))}
                {s.skills.length > 3 && (
                  <span className="text-[10px] text-fg-subtle font-mono">
                    +{s.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="text-[11px] text-fg-subtle border-t border-border pt-2.5">
                <span className="font-mono">{s.certs.join(" · ")}</span>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs text-fg-muted hover:bg-bg-overlay hover:text-fg transition-colors">
                  <Mail className="size-3" />
                  Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs text-fg-muted hover:bg-bg-overlay hover:text-fg transition-colors">
                  <Calendar className="size-3" />
                  Book
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}