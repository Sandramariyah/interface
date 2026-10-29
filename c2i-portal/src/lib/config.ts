import { z } from "zod";

/**
 * Typed environment configuration.
 * Validated at boot — fails fast if required vars are missing.
 *
 * In demo mode (NEXT_PUBLIC_ENABLE_DEMO_MODE="true") Entra ID creds
 * become optional so you can run the portal without an Azure tenant.
 */

const demoMode = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";

const requiredInProd = (msg: string) =>
  demoMode ? z.string().optional().default("") : z.string().min(1, msg);

const urlOptional = z.string().url().optional().or(z.literal(""));

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Auth — secret still required (used to sign JWTs even in demo mode)
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 chars"),
  AUTH_TRUST_HOST: z.string().optional(),
  AUTH_URL: z.string().url().optional(),

  // Entra ID — optional in demo mode
  AUTH_MICROSOFT_ENTRA_ID_ID: requiredInProd("Entra client ID required"),
  AUTH_MICROSOFT_ENTRA_ID_SECRET: requiredInProd("Entra client secret required"),
  AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string().url().default("https://login.microsoftonline.com/common/v2.0"),
  ENTRA_TENANT_ID: z.string().default(""),

  // RBAC groups
  ENTRA_GROUP_TIER1_LEADERSHIP: z.string().default(""),
  ENTRA_GROUP_TIER2_PRESALES: z.string().default(""),
  ENTRA_GROUP_TIER3_ADMIN: z.string().default(""),
  ENTRA_GROUP_GUEST: z.string().default(""),

  // Azure OpenAI — optional in demo (chat will return a stub error if not configured)
  AZURE_OPENAI_ENDPOINT: urlOptional,
  AZURE_OPENAI_API_KEY: z.string().optional().default(""),
  AZURE_OPENAI_API_VERSION: z.string().default("2024-10-21"),
  AZURE_OPENAI_DEPLOYMENT_GPT4O: z.string().default("gpt-4o"),
  AZURE_OPENAI_DEPLOYMENT_GPT4O_MINI: z.string().default("gpt-4o-mini"),
  AZURE_OPENAI_DEPLOYMENT_DALLE: z.string().default("dall-e-3"),
  AZURE_OPENAI_DEPLOYMENT_EMBEDDING: z.string().default("text-embedding-3-large"),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL_SONNET: z.string().default("claude-sonnet-4-5"),
  AZURE_FOUNDRY_ANTHROPIC_ENDPOINT: urlOptional,
  AZURE_FOUNDRY_ANTHROPIC_API_KEY: z.string().optional(),

  // Foundry agents
  AZURE_FOUNDRY_PROJECT_CONNECTION_STRING: z.string().optional(),
  AZURE_FOUNDRY_AGENT_ROUTER: z.string().optional(),
  AZURE_FOUNDRY_AGENT_RFP: z.string().optional(),
  AZURE_FOUNDRY_AGENT_SOLUTION: z.string().optional(),
  AZURE_FOUNDRY_AGENT_SME: z.string().optional(),
  AZURE_FOUNDRY_AGENT_DEAL: z.string().optional(),
  AZURE_FOUNDRY_AGENT_PRICING: z.string().optional(),
  AZURE_FOUNDRY_AGENT_COMPLIANCE: z.string().optional(),
  AZURE_FOUNDRY_AGENT_DIAGRAM: z.string().optional(),

  // Cohere
  COHERE_API_KEY: z.string().optional(),
  COHERE_RERANK_MODEL: z.string().default("rerank-3.5"),

  // AI Search
  AZURE_SEARCH_ENDPOINT: urlOptional,
  AZURE_SEARCH_API_KEY: z.string().optional(),
  AZURE_SEARCH_API_VERSION: z.string().default("2024-07-01"),
  AZURE_SEARCH_INDEX_CASE_STUDIES: z.string().default("case-studies"),
  AZURE_SEARCH_INDEX_RFP: z.string().default("rfp-corpus"),
  AZURE_SEARCH_INDEX_ARCHITECTURES: z.string().default("architectures"),
  AZURE_SEARCH_INDEX_SME: z.string().default("sme-profiles"),
  AZURE_SEARCH_INDEX_PARTNERSHIPS: z.string().default("partnerships"),
  AZURE_SEARCH_INDEX_COMPLIANCE: z.string().default("compliance-artifacts"),
  AZURE_SEARCH_INDEX_COLLATERALS: z.string().default("collaterals"),

  // Cosmos
  COSMOS_DB_ENDPOINT: urlOptional,
  COSMOS_DB_KEY: z.string().optional(),
  COSMOS_DB_DATABASE: z.string().default("c2i"),
  COSMOS_DB_CONTAINER_THREADS: z.string().default("threads"),
  COSMOS_DB_CONTAINER_PREFS: z.string().default("user-prefs"),
  COSMOS_DB_CONTAINER_FEEDBACK: z.string().default("feedback"),
  COSMOS_GREMLIN_ENDPOINT: z.string().optional(),
  COSMOS_GREMLIN_DATABASE: z.string().default("c2i"),
  COSMOS_GREMLIN_GRAPH: z.string().default("sme-graph"),

  // Blob
  AZURE_STORAGE_ACCOUNT: z.string().optional(),
  AZURE_STORAGE_ACCOUNT_KEY: z.string().optional(),
  AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),
  AZURE_STORAGE_CONTAINER_RAW: z.string().default("raw-docs"),
  AZURE_STORAGE_CONTAINER_PROCESSED: z.string().default("processed-docs"),
  AZURE_STORAGE_CONTAINER_GENERATED: z.string().default("generated-outputs"),
  AZURE_STORAGE_CONTAINER_BRAND: z.string().default("brand-kit"),

  // Cost guardrails
  MAX_TOKENS_PER_REQUEST_TIER1: z.coerce.number().default(20000),
  MAX_TOKENS_PER_REQUEST_TIER2: z.coerce.number().default(40000),
  MAX_TOKENS_PER_REQUEST_TIER3: z.coerce.number().default(60000),
  MAX_TOKENS_PER_DAY_PER_USER: z.coerce.number().default(500000),

  // Observability
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().default("c2i-portal"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("C2I Portal"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ENABLE_DEMO_MODE: z.string().default("false"),
  NEXT_PUBLIC_FEATURE_GUEST_PORTAL: z.string().default("false"),
  NEXT_PUBLIC_FEATURE_DIAGRAM_AGENT: z.string().default("true"),
  NEXT_PUBLIC_FEATURE_PRICING_AGENT: z.string().default("true"),
  NEXT_PUBLIC_FEATURE_DEAL_QUALIFIER: z.string().default("true"),
});

function parseGroupIds(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

const _server =
  typeof window === "undefined"
    ? serverSchema.parse(process.env)
    : ({} as z.infer<typeof serverSchema>);

const _public = publicSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ENABLE_DEMO_MODE: process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE,
  NEXT_PUBLIC_FEATURE_GUEST_PORTAL: process.env.NEXT_PUBLIC_FEATURE_GUEST_PORTAL,
  NEXT_PUBLIC_FEATURE_DIAGRAM_AGENT: process.env.NEXT_PUBLIC_FEATURE_DIAGRAM_AGENT,
  NEXT_PUBLIC_FEATURE_PRICING_AGENT: process.env.NEXT_PUBLIC_FEATURE_PRICING_AGENT,
  NEXT_PUBLIC_FEATURE_DEAL_QUALIFIER: process.env.NEXT_PUBLIC_FEATURE_DEAL_QUALIFIER,
});

export const env = {
  server: _server,
  public: _public,
  demoMode: _public.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true",
  groups: {
    tier1: parseGroupIds(_server.ENTRA_GROUP_TIER1_LEADERSHIP ?? ""),
    tier2: parseGroupIds(_server.ENTRA_GROUP_TIER2_PRESALES ?? ""),
    tier3: parseGroupIds(_server.ENTRA_GROUP_TIER3_ADMIN ?? ""),
    guest: parseGroupIds(_server.ENTRA_GROUP_GUEST ?? ""),
  },
  features: {
    guestPortal: _public.NEXT_PUBLIC_FEATURE_GUEST_PORTAL === "true",
    diagramAgent: _public.NEXT_PUBLIC_FEATURE_DIAGRAM_AGENT === "true",
    pricingAgent: _public.NEXT_PUBLIC_FEATURE_PRICING_AGENT === "true",
    dealQualifier: _public.NEXT_PUBLIC_FEATURE_DEAL_QUALIFIER === "true",
  },
} as const;

export type Env = typeof env;