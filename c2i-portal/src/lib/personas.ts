/**
 * Persona definitions.
 * Mirrors the Tier 1/2/3 structure from the use case spec.
 *
 * Each persona maps to:
 *   - AAD group IDs (env-driven)
 *   - Allowed agents (which Foundry agents they can invoke)
 *   - Nav items (sidebar)
 *   - Token budget tier
 */

export type PersonaTier = "tier1" | "tier2" | "tier3" | "guest";

export type AgentId =
  | "router"
  | "rfp"
  | "solution"
  | "sme"
  | "deal"
  | "pricing"
  | "compliance"
  | "diagram";

export interface PersonaDefinition {
  tier: PersonaTier;
  label: string;
  description: string;
  /** Agents this tier can invoke */
  allowedAgents: AgentId[];
  /** Default landing route after login */
  defaultRoute: string;
  /** Sidebar nav items */
  navItems: { label: string; href: string; icon: string }[];
}

export const PERSONAS: Record<PersonaTier, PersonaDefinition> = {
  tier1: {
    tier: "tier1",
    label: "Leadership & Sales",
    description: "CXO · Client Partner · Field CTO · Bid Manager · Delivery Heads",
    allowedAgents: ["router", "deal", "sme", "diagram", "pricing"],
    defaultRoute: "/dashboard",
    navItems: [
      { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { label: "Chat", href: "/chat", icon: "MessageSquare" },
      { label: "Case studies", href: "/case-studies", icon: "BookOpen" },
      { label: "Capabilities", href: "/capabilities", icon: "Sparkles" },
      { label: "Deal qualifier", href: "/deal-qualifier", icon: "Target" },
      { label: "SME directory", href: "/sme", icon: "Users" },
    ],
  },
  tier2: {
    tier: "tier2",
    label: "Presales & Delivery",
    description: "Solution Architect · SME · Bid Manager · Presales Lead",
    allowedAgents: [
      "router",
      "rfp",
      "solution",
      "sme",
      "deal",
      "pricing",
      "compliance",
      "diagram",
    ],
    defaultRoute: "/chat",
    navItems: [
      { label: "Workspace", href: "/chat", icon: "MessageSquare" },
      { label: "RFP studio", href: "/rfp", icon: "FileText" },
      { label: "Solution canvas", href: "/solution", icon: "GitBranch" },
      { label: "SME directory", href: "/sme", icon: "Users" },
      { label: "Case studies", href: "/case-studies", icon: "BookOpen" },
      { label: "Architectures", href: "/architectures", icon: "Boxes" },
      { label: "Pricing & PIP", href: "/pricing", icon: "Calculator" },
    ],
  },
  tier3: {
    tier: "tier3",
    label: "Admin",
    description: "Portal Admin · Content Curator",
    allowedAgents: [
      "router",
      "rfp",
      "solution",
      "sme",
      "deal",
      "pricing",
      "compliance",
      "diagram",
    ],
    defaultRoute: "/admin",
    navItems: [
      { label: "Admin", href: "/admin", icon: "Settings" },
      { label: "Knowledge base", href: "/admin/kb", icon: "Database" },
      { label: "Users & roles", href: "/admin/users", icon: "ShieldCheck" },
      { label: "Eval & analytics", href: "/admin/eval", icon: "BarChart3" },
      { label: "Audit log", href: "/admin/audit", icon: "ScrollText" },
      { label: "Chat", href: "/chat", icon: "MessageSquare" },
    ],
  },
  guest: {
    tier: "guest",
    label: "Guest",
    description: "External partner / temporary access",
    allowedAgents: ["router"],
    defaultRoute: "/guest",
    navItems: [
      { label: "Overview", href: "/guest", icon: "LayoutDashboard" },
      { label: "Capabilities", href: "/guest/capabilities", icon: "Sparkles" },
      { label: "Public case studies", href: "/guest/case-studies", icon: "BookOpen" },
    ],
  },
};

/** Resolve persona tier from AAD group membership */
export function resolvePersonaFromGroups(
  userGroupIds: string[],
  groupMap: { tier1: string[]; tier2: string[]; tier3: string[]; guest: string[] },
): PersonaTier {
  const has = (g: string[]) => g.some((id) => userGroupIds.includes(id));
  // Highest privilege wins
  if (has(groupMap.tier3)) return "tier3";
  if (has(groupMap.tier2)) return "tier2";
  if (has(groupMap.tier1)) return "tier1";
  return "guest";
}
