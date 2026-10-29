import { createAzure } from "@ai-sdk/azure";
import { env } from "@/lib/config";
import type { AgentId } from "@/lib/personas";

/**
 * Foundry Agent Service client (stubbed).
 *
 * In production, this wraps the Azure AI Foundry Agent SDK and dispatches
 * to the appropriate specialist agent (RFP, Solution, SME, etc).
 * For now: streams directly from Azure OpenAI so the UI is functional
 * end-to-end before Foundry agents are provisioned.
 */

export const azureOpenAI = createAzure({
  resourceName: new URL(env.server.AZURE_OPENAI_ENDPOINT).hostname.split(".")[0],
  apiKey: env.server.AZURE_OPENAI_API_KEY,
  apiVersion: env.server.AZURE_OPENAI_API_VERSION,
});

export interface AgentInvocation {
  agentId: AgentId;
  threadId?: string;
  userMessage: string;
  userTier: string;
  userId: string;
}

/**
 * Resolve which model to use for a given agent.
 * Claude Sonnet for long-context synthesis (RFP, solution), GPT-4o otherwise.
 */
export function modelForAgent(agentId: AgentId) {
  const longContextAgents: AgentId[] = ["rfp", "solution", "compliance"];
  if (longContextAgents.includes(agentId)) {
    // Once Anthropic provider is wired into Foundry: return anthropicModel(...)
    // For now fall back to GPT-4o
    return azureOpenAI(env.server.AZURE_OPENAI_DEPLOYMENT_GPT4O);
  }
  return azureOpenAI(env.server.AZURE_OPENAI_DEPLOYMENT_GPT4O_MINI);
}

/**
 * System prompt per agent. Real prompts live in a prompt registry
 * (Foundry Promptflow or Langfuse) in production.
 */
export function systemPromptForAgent(agentId: AgentId): string {
  const base =
    "You are a specialist agent for the UST CyberProof C2I pre-sales portal. " +
    "Cite retrieval evidence by case-study ID or RFP ID when making claims. " +
    "Refuse to hallucinate client names or financial figures.";

  const overrides: Record<AgentId, string> = {
    router:
      "Classify the user's intent and either answer directly or describe which specialist agent (rfp, solution, sme, deal, pricing, compliance, diagram) should handle it.",
    rfp: "Parse RFP requirements into a compliance matrix and draft a skeleton response deck with brand-aligned sections.",
    solution:
      "Generate A/B/C architecture options with explicit tradeoffs (Cost vs Performance, Risk vs Speed, Build vs Buy).",
    sme: "Match a pursuit team to opportunity needs. Return ranked candidates with strengths and gaps.",
    deal: "Score Go/No-Go winnability against historic win/loss patterns. Output risk register with evidence.",
    pricing: "Estimate TCV ballpark from scope. Flag margin floor violations. Generate PIP-ready output.",
    compliance:
      "Clause-level legal and regulatory checks. Flag missing NFRs, compliance gaps, and litigation risks.",
    diagram:
      "Generate diagrams as code (Mermaid, draw.io XML) and brand-aligned visual artifacts.",
  };

  return `${base}\n\n${overrides[agentId]}`;
}
