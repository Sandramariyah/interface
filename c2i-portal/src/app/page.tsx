import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { PERSONAS, type PersonaTier } from "@/lib/personas";
import { env } from "@/lib/config";
import { ArrowRight, Crown, Wrench, ShieldCheck, UserRound } from "lucide-react";

const PERSONA_ICONS: Record<PersonaTier, React.ComponentType<{ className?: string }>> = {
  tier1: Crown,
  tier2: Wrench,
  tier3: ShieldCheck,
  guest: UserRound,
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    const target = callbackUrl ?? PERSONAS[session.user.tier].defaultRoute;
    redirect(target);
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: brand panel */}
        <section className="hidden lg:flex flex-col justify-between p-12 bg-bg-elevated border-r border-border">
          <header className="font-mono text-xs tracking-widest text-fg-subtle">
            UST · CYBERPROOF
          </header>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-accent uppercase">
              <span className="size-1.5 rounded-full bg-accent" />
              {env.public.NEXT_PUBLIC_APP_NAME}
            </div>
            <h1 className="text-5xl font-medium tracking-tight leading-[1.05]">
              The pre-sales <br />
              <span className="text-fg-muted">operator console.</span>
            </h1>
            <p className="text-fg-muted max-w-md leading-relaxed">
              RFP response, solution architecture, SME matching, deal qualification &mdash;
              orchestrated through Foundry Agent Service over your case-study and capability
              corpus.
            </p>
          </div>
          <footer className="font-mono text-[11px] text-fg-subtle tracking-wider">
            v0.1.0 &middot; AZURE EUROPE-WEST
          </footer>
        </section>

        {/* Right: auth */}
        <section className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="lg:hidden font-mono text-xs tracking-widest text-fg-subtle">
              UST &middot; CYBERPROOF
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-medium tracking-tight">Sign in</h2>
              <p className="text-sm text-fg-muted">
                {env.demoMode
                  ? "Pick a persona to demo, or use your UST corporate Entra ID."
                  : "Use your UST corporate Entra ID account."}
              </p>
            </div>

            {/* Demo persona picker */}
            {env.demoMode && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-accent uppercase">
                    Demo mode
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(PERSONAS) as PersonaTier[]).map((tier) => {
                    const persona = PERSONAS[tier];
                    const Icon = PERSONA_ICONS[tier];
                    return (
                      <form
                        key={tier}
                        action={async () => {
                          "use server";
                          await signIn("demo", {
                            tier,
                            redirectTo: persona.defaultRoute,
                          });
                        }}
                      >
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 rounded-lg border border-border bg-bg-elevated hover:border-accent/40 hover:bg-bg-overlay px-4 py-3 transition-all group text-left"
                        >
                          <div className="size-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                            <Icon className="size-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] tracking-wider text-accent uppercase">
                                {tier === "guest" ? "Guest" : tier.toUpperCase()}
                              </span>
                              <span className="text-sm font-medium text-fg truncate">
                                {persona.label}
                              </span>
                            </div>
                            <div className="text-[11px] text-fg-subtle truncate mt-0.5">
                              {persona.description}
                            </div>
                          </div>
                          <ArrowRight className="size-3.5 text-fg-subtle group-hover:text-fg group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Entra ID sign-in — shown only if configured */}
            {env.server.AUTH_MICROSOFT_ENTRA_ID_ID && (
              <>
                {env.demoMode && (
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="font-mono text-[10px] tracking-widest text-fg-subtle uppercase">
                      Or production SSO
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}
                <form
                  action={async () => {
                    "use server";
                    await signIn("microsoft-entra-id", {
                      redirectTo: callbackUrl ?? "/dashboard",
                    });
                  }}
                >
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-3 rounded-md bg-fg text-bg px-4 py-3 text-sm font-medium hover:bg-fg/90 transition-colors"
                  >
                    <MicrosoftLogo className="size-4" />
                    Continue with Microsoft
                  </button>
                </form>
              </>
            )}

            <p className="text-xs text-fg-subtle leading-relaxed">
              {env.demoMode
                ? "Demo mode is enabled (NEXT_PUBLIC_ENABLE_DEMO_MODE). Disable in production."
                : "By signing in you agree to UST's acceptable use policy. Your activity is logged for audit and compliance."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}