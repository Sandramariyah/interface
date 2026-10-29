import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PERSONAS, type AgentId } from "@/lib/personas";
import { ChatPanel } from "@/components/chat/chat-panel";

const VALID_AGENTS: AgentId[] = [
  "router",
  "rfp",
  "solution",
  "sme",
  "deal",
  "pricing",
  "compliance",
  "diagram",
];

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const persona = PERSONAS[session.user.tier];
  const { agent } = await searchParams;
  const requestedAgent = (VALID_AGENTS.includes(agent as AgentId) ? agent : "router") as AgentId;

  // Fall back to router if requested agent not permitted
  const initialAgent = persona.allowedAgents.includes(requestedAgent)
    ? requestedAgent
    : "router";

  return (
    <ChatPanel initialAgent={initialAgent} allowedAgents={persona.allowedAgents} />
  );
}
