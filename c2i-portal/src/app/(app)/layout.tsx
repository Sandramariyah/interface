import { auth, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { PERSONAS, type PersonaTier } from "@/lib/personas";
import { env } from "@/lib/config";
import { AppShell } from "@/components/layout/app-shell";

const VALID_TIERS: PersonaTier[] = ["tier1", "tier2", "tier3", "guest"];

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const persona = PERSONAS[session.user.tier];

  return (
    <AppShell
      user={{
        name: session.user.name ?? session.user.email ?? "User",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        tier: session.user.tier,
      }}
      persona={persona}
      isDemoMode={env.demoMode}
      signOutAction={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
      switchPersonaAction={async (formData: FormData) => {
        "use server";
        if (!env.demoMode) return;
        const tier = String(formData.get("tier") ?? "");
        if (!VALID_TIERS.includes(tier as PersonaTier)) return;
        await signIn("demo", {
          tier,
          redirectTo: PERSONAS[tier as PersonaTier].defaultRoute,
        });
      }}
    >
      {children}
    </AppShell>
  );
}