import Link from "next/link";
import { PageHeader, SectionLabel } from "@/components/ui/page-shared";
import { ArrowRight, BookOpen, Sparkles, ShieldCheck, Award } from "lucide-react";

export default function GuestPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10 space-y-10">
      <PageHeader
        breadcrumb="guest portal"
        title="UST CyberProof"
        description="Pre-sales partner view — a curated subset of capabilities, case studies, and accreditations. Sensitive deal data and SME profiles are not visible in this view."
      />

      <section className="rounded-xl border border-border bg-bg-elevated overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 lg:p-10 space-y-4">
            <div className="font-mono text-[11px] tracking-widest text-accent uppercase">
              Trusted security operations partner
            </div>
            <h2 className="text-2xl font-medium tracking-tight leading-tight">
              Detection, response, and platform engineering at the scale of the world&apos;s
              largest enterprises.
            </h2>
            <p className="text-fg-muted leading-relaxed">
              CyberProof operates 24×7 security operations centers across three continents,
              with 600+ certified analysts and architects defending more than 130 enterprise
              customers.
            </p>
            <div className="flex gap-3 pt-2">
              <Link
                href="/guest/capabilities"
                className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-4 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
              >
                Explore capabilities
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/guest/case-studies"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-bg-overlay transition-colors"
              >
                Browse case studies
              </Link>
            </div>
          </div>
          <div className="bg-grid border-t lg:border-t-0 lg:border-l border-border p-8 lg:p-10 flex flex-col justify-center gap-5">
            <Stat value="130+" label="Enterprise customers" />
            <Stat value="600+" label="Certified security professionals" />
            <Stat value="24×7" label="SOC coverage across 3 continents" />
            <Stat value="99.97%" label="Service availability SLA" />
          </div>
        </div>
      </section>

      <section>
        <SectionLabel>Why teams choose us</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          <FeatureCard
            icon={Sparkles}
            title="Hyperscaler-aligned"
            description="Microsoft Solutions Partner with all four security designations. AWS Premier with Security competency."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Battle-tested"
            description="Active engagements span BFSI, healthcare, energy, manufacturing, and federal segments."
          />
          <FeatureCard
            icon={Award}
            title="Accredited"
            description="ISO 27001, SOC 2 Type II, FedRAMP Moderate, PCI-DSS certified service operations."
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-bg-elevated p-6 flex items-center gap-4">
        <BookOpen className="size-6 text-accent shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">Need a custom briefing?</h3>
          <p className="text-sm text-fg-muted mt-0.5">
            Your CyberProof account team can prepare an industry-specific deep dive within 48 hours.
          </p>
        </div>
        <a
          href="mailto:partners@cyberproof.com"
          className="inline-flex items-center gap-2 rounded-md bg-fg text-bg px-4 py-2 text-sm font-medium hover:bg-fg/90 transition-colors"
        >
          Contact
        </a>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-medium tracking-tight tabular-nums">{value}</div>
      <div className="text-sm text-fg-muted mt-0.5">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-5">
      <div className="size-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
        <Icon className="size-4 text-accent" />
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
}