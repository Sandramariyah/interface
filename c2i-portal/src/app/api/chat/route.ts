import { auth } from "@/auth";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { modelForAgent, systemPromptForAgent } from "@/lib/ai/foundry-client";
import { env } from "@/lib/config";
import { PERSONAS, type AgentId } from "@/lib/personas";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

// In v6 the client (DefaultChatTransport) sends UIMessage[] (parts-based),
// not { role, content }. Validate agentId strictly and trust the SDK shape
// for messages — convertToModelMessages() normalizes them for the model.
const requestSchema = z.object({
  messages: z.array(z.any()),
  agentId: z
    .enum(["router", "rfp", "solution", "sme", "deal", "pricing", "compliance", "diagram"])
    .default("router"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tier = session.user.tier;
  const persona = PERSONAS[tier];

  // Parse + validate
  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await req.json());
  } catch (err) {
    return new Response(`Bad request: ${(err as Error).message}`, { status: 400 });
  }

  const { messages, agentId } = body;

  // RBAC: tier must be allowed to invoke this agent
  if (!persona.allowedAgents.includes(agentId as AgentId)) {
    return new Response(`Tier ${tier} cannot invoke agent ${agentId}`, { status: 403 });
  }

  // Token budget per tier
  const maxOutputTokens =
    tier === "tier3"
      ? env.server.MAX_TOKENS_PER_REQUEST_TIER3
      : tier === "tier2"
        ? env.server.MAX_TOKENS_PER_REQUEST_TIER2
        : env.server.MAX_TOKENS_PER_REQUEST_TIER1;

  const result = streamText({
    model: modelForAgent(agentId as AgentId),
    system: systemPromptForAgent(agentId as AgentId),
    messages: convertToModelMessages(messages as UIMessage[]),
    maxOutputTokens,
    temperature: 0.3,
    // Real wiring: add `tools` here for retrieval (AI Search), graph
    // (Cosmos Gremlin), doc gen, brand enforcement, etc. Tool-call/result
    // parts stream correctly because we return a UI-message stream below.
  });

  // Must match the client transport (DefaultChatTransport expects this format).
  return result.toUIMessageStreamResponse();
}