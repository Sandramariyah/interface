# C2I Portal

Intelligent pre-sales platform for UST CyberProof — Phase 1 UI scaffold.

## Stack

| Concern        | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, RSC, Server Actions) + React 19   |
| Language       | TypeScript 5.7 (strict, `noUncheckedIndexedAccess`)       |
| Styling        | Tailwind CSS v4 (CSS-first config) + OKLCH design tokens  |
| Components     | Radix UI primitives + shadcn pattern (no library lock-in) |
| Auth           | Auth.js v5 with Microsoft Entra ID provider               |
| AI orchestration | Vercel AI SDK 4 → Azure OpenAI + Anthropic (Foundry)    |
| Fonts          | Geist Sans + Geist Mono via `next/font`                   |
| Deploy target  | Azure Container Apps (`output: "standalone"`)             |

## Quickstart

```bash
pnpm install
cp .env.example .env.local
# fill in AUTH_SECRET (openssl rand -base64 32) and Entra creds at minimum
pnpm dev
```

Open <http://localhost:3000>.

## Entra ID app registration

1. Create an app registration in your tenant.
2. **Redirect URI** (Web): `http://localhost:3000/api/auth/callback/microsoft-entra-id` (and the prod URL).
3. **Certificates & secrets**: create a client secret; copy to `AUTH_MICROSOFT_ENTRA_ID_SECRET`.
4. **API permissions**: Microsoft Graph delegated:
   - `User.Read`, `GroupMember.Read.All`, `Mail.Send`, `Calendars.ReadWrite`, `ChatMessage.Send`, `Sites.Read.All`, `Files.Read.All`
5. **Token configuration**: add the `groups` optional claim (Security groups, both ID and access tokens). Without this, RBAC will not work.
6. Create AAD security groups for each tier (Tier 1 / Tier 2 / Tier 3 / Guest) and put their object IDs in the `ENTRA_GROUP_*` env vars.

## Project layout

```
src/
├── app/
│   ├── (app)/              ← Authed surface (sidebar shell)
│   │   ├── dashboard/      ← Persona-aware landing
│   │   ├── chat/           ← Streaming chat workspace
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/  ← Auth.js handler
│   │   └── chat/                ← AI SDK streaming endpoint
│   ├── auth/error/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            ← Sign-in / landing
├── auth.ts                 ← Auth.js v5 config
├── middleware.ts           ← Auth gate + tier RBAC
├── components/
│   ├── chat/chat-panel.tsx ← Streaming chat UI
│   └── layout/app-shell.tsx
└── lib/
    ├── ai/foundry-client.ts  ← Foundry agent abstraction (stub)
    ├── config.ts             ← Zod-validated env loader
    ├── personas.ts           ← Tier definitions, RBAC mapping
    └── utils.ts
```

## What's wired up

- ✅ Microsoft Entra SSO with group → tier resolution
- ✅ RBAC middleware (route + agent-level)
- ✅ Persona-aware sidebar nav (Tier 1/2/3/Guest)
- ✅ Streaming chat UI with agent picker (8 specialist agents)
- ✅ Chat endpoint hitting Azure OpenAI (GPT-4o / GPT-4o-mini) via AI SDK
- ✅ Token budget enforcement per tier
- ✅ Audit-friendly: every request flows through `/api/chat` with session check

## What's stubbed (Phase 2)

- 🔲 Foundry Agent Service wiring (currently falls through to Azure OpenAI direct)
- 🔲 AI Search retrieval tool (hybrid + ACL trim)
- 🔲 Cohere Rerank
- 🔲 Cosmos Gremlin graph queries (SME matcher)
- 🔲 Doc generation service (python-pptx/docx microservice)
- 🔲 Brand enforcement post-processor
- 🔲 SharePoint / Confluence ingestion pipeline
- 🔲 CRM (Salesforce/Dynamics) integration
- 🔲 HRMS sync for SME profiles
- 🔲 Feedback capture + win-correlation analytics

## Brand customization

Brand colors live in `src/app/globals.css` as CSS custom properties (`--accent`, `--bg`, `--fg`, etc.) in OKLCH. The Brand Enforcement service will eventually inject these from the brand kit stored in `AZURE_STORAGE_CONTAINER_BRAND`. Until then, edit `globals.css` directly.

## Production notes

- Replace literal secrets in env with Azure Key Vault references: `@Microsoft.KeyVault(SecretUri=https://...)`.
- Deploy to Azure Container Apps with private endpoints to Cosmos, Search, Blob, AOAI.
- Enable Application Insights via `APPLICATIONINSIGHTS_CONNECTION_STRING` — OpenTelemetry traces auto-instrument.
- APIM in front of Container Apps for token capping and request signing.
- Add CSP headers (currently STS + XFO + sniff only) once external CDN allow-list is finalized.

## Useful commands

```bash
pnpm dev          # turbo dev server
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm build        # production build (standalone output)
```
