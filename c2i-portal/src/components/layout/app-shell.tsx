"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { PERSONAS, type PersonaDefinition, type PersonaTier } from "@/lib/personas";

interface AppShellProps {
  user: { name: string; email: string; image: string | null; tier: PersonaTier };
  persona: PersonaDefinition;
  isDemoMode: boolean;
  signOutAction: () => Promise<void>;
  switchPersonaAction: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

const TIER_LABELS: Record<PersonaTier, string> = {
  tier1: "T1 · Leadership",
  tier2: "T2 · Presales",
  tier3: "T3 · Admin",
  guest: "Guest",
};

const TIER_SHORT: Record<PersonaTier, string> = {
  tier1: "T1",
  tier2: "T2",
  tier3: "T3",
  guest: "G",
};

export function AppShell({
  user,
  persona,
  isDemoMode,
  signOutAction,
  switchPersonaAction,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg text-fg">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-bg-elevated">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="size-6 rounded bg-accent/15 border border-accent/30 flex items-center justify-center">
              <div className="size-2 rounded-sm bg-accent" />
            </div>
            <span className="font-mono text-[11px] tracking-widest text-fg-muted group-hover:text-fg transition-colors">
              C2I PORTAL
            </span>
          </Link>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
            {TIER_LABELS[user.tier]}
          </div>
          <div className="text-sm font-medium text-fg leading-tight">{persona.label}</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {persona.navItems.map((item) => {
            const Icon = (Icons[item.icon as keyof typeof Icons] ??
              Icons.Circle) as React.ComponentType<{ className?: string }>;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-bg-overlay text-fg"
                    : "text-fg-muted hover:bg-bg-overlay hover:text-fg",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User block */}
        <div className="border-t border-border p-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-full flex items-center gap-2.5 rounded-md px-2 py-2 hover:bg-bg-overlay transition-colors"
            >
              <div className="size-7 rounded-full bg-bg-overlay border border-border flex items-center justify-center text-xs font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium text-fg truncate">{user.name}</div>
                <div className="text-[11px] text-fg-subtle truncate">{user.email}</div>
              </div>
              <Icons.ChevronUp
                className={cn(
                  "size-4 text-fg-subtle transition-transform",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-md border border-border bg-bg-elevated p-1 shadow-lg">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-sm text-fg-muted hover:bg-bg-overlay hover:text-fg transition-colors"
                  >
                    <Icons.LogOut className="size-4" />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-bg/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-10">
          <div className="font-mono text-[11px] tracking-wider text-fg-subtle">
            {pathname.split("/").filter(Boolean).join(" / ") || "dashboard"}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isDemoMode && (
              <DemoPersonaSwitcher
                currentTier={user.tier}
                switchAction={switchPersonaAction}
              />
            )}
            <button
              className="size-8 rounded-md hover:bg-bg-overlay flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
              aria-label="Search"
            >
              <Icons.Search className="size-4" />
            </button>
            <button
              className="size-8 rounded-md hover:bg-bg-overlay flex items-center justify-center text-fg-muted hover:text-fg transition-colors"
              aria-label="Notifications"
            >
              <Icons.Bell className="size-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}

/**
 * DemoPersonaSwitcher — visible only when NEXT_PUBLIC_ENABLE_DEMO_MODE=true.
 * Each tier option is a form posting to the switchPersonaAction server action,
 * which re-issues a JWT under the new tier and redirects to that persona's
 * default landing route.
 */
function DemoPersonaSwitcher({
  currentTier,
  switchAction,
}: {
  currentTier: PersonaTier;
  switchAction: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium hover:bg-amber-500/15 transition-colors"
        title="Switch persona (demo mode only)"
      >
        <span className="font-mono text-[10px] tracking-widest text-amber-500/90 uppercase">
          Demo
        </span>
        <span className="text-fg">{TIER_SHORT[currentTier]}</span>
        <Icons.ChevronDown
          className={cn("size-3.5 text-fg-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 rounded-md border border-border bg-bg-elevated p-1 shadow-xl z-20">
          <div className="px-2.5 py-1.5 border-b border-border">
            <div className="font-mono text-[10px] tracking-widest text-fg-subtle uppercase">
              Switch persona
            </div>
            <div className="text-[11px] text-fg-subtle mt-0.5">
              Demo only — disabled in production.
            </div>
          </div>
          <div className="py-1">
            {(Object.keys(PERSONAS) as PersonaTier[]).map((tier) => {
              const persona = PERSONAS[tier];
              const isActive = tier === currentTier;
              return (
                <form key={tier} action={switchAction}>
                  <input type="hidden" name="tier" value={tier} />
                  <button
                    type="submit"
                    disabled={isActive}
                    className={cn(
                      "w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded transition-colors",
                      isActive
                        ? "bg-accent/10 text-fg cursor-default"
                        : "text-fg-muted hover:bg-bg-overlay hover:text-fg",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-wider uppercase shrink-0 w-8",
                        isActive ? "text-accent" : "text-fg-subtle",
                      )}
                    >
                      {TIER_SHORT[tier]}
                    </span>
                    <span className="text-xs truncate flex-1">{persona.label}</span>
                    {isActive && <Icons.Check className="size-3.5 text-accent shrink-0" />}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}