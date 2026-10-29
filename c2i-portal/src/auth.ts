import NextAuth, { type DefaultSession } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/config";
import { PERSONAS, resolvePersonaFromGroups, type PersonaTier } from "@/lib/personas";

declare module "next-auth" {
  interface User {
    tier?: PersonaTier;
  }
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      tier: PersonaTier;
      groups: string[];
    } & DefaultSession["user"];
  }
}

// TS2664 ("module 'next-auth/jwt' cannot be found") on the block below means
// TypeScript isn't reading next-auth's subpath `exports`. Set tsconfig
// "moduleResolution" to "bundler" | "node16" | "nodenext" (with a matching
// "module"). If it still errors after that, your installed build doesn't
// re-export `./jwt` — change the specifier to "@auth/core/jwt" instead.
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    tier?: PersonaTier;
    groups?: string[];
    userId?: string;
  }
}

/**
 * Auth.js v5 (NextAuth) configuration.
 *
 * Real auth: Microsoft Entra ID → groups claim → tier resolution.
 * Demo auth: Credentials provider with no password — pick a tier and go.
 *            Enabled only when NEXT_PUBLIC_ENABLE_DEMO_MODE="true".
 *
 * For Entra: configure the app registration's Token configuration to
 * include the `groups` optional claim (security groups, ID + access tokens).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    // --- Demo: tier picker, no password ---
    ...(env.demoMode
      ? [
          Credentials({
            id: "demo",
            name: "Demo persona",
            credentials: {
              tier: { label: "Tier", type: "text" },
            },
            async authorize(credentials) {
              const tier = String(credentials?.tier ?? "");
              if (!(tier in PERSONAS)) return null;
              const persona = PERSONAS[tier as PersonaTier];
              return {
                id: `demo-${tier}`,
                email: `demo-${tier}@c2i.local`,
                name: `Demo · ${persona.label}`,
                tier: tier as PersonaTier,
              };
            },
          }),
        ]
      : []),

    // --- Real: Microsoft Entra ID ---
    ...(env.server.AUTH_MICROSOFT_ENTRA_ID_ID && env.server.AUTH_MICROSOFT_ENTRA_ID_SECRET
      ? [
          MicrosoftEntraID({
            clientId: env.server.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: env.server.AUTH_MICROSOFT_ENTRA_ID_SECRET,
            issuer: env.server.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
            authorization: {
              params: {
                scope: [
                  "openid",
                  "profile",
                  "email",
                  "offline_access",
                  "User.Read",
                  "GroupMember.Read.All",
                ].join(" "),
              },
            },
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Demo (Credentials) sign-in OR persona switch: `user` is set on initial
      // sign-in. `tier` is typed via the next-auth `User` augmentation above,
      // so no local type / cast is needed.
      if (user?.tier) {
        token.tier = user.tier;
        token.groups = [];
        token.userId = user.id ?? `demo-${token.tier}`;
        return token;
      }

      // Entra OAuth
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        const groups = ((profile as Record<string, unknown>)["groups"] as string[]) ?? [];
        token.groups = groups;
        token.tier = resolvePersonaFromGroups(groups, env.groups);
        token.userId = (profile as Record<string, unknown>)["oid"] as string;
      }
      return token;
    },
    async session({ session, token }) {
      // `session` is always defined here — no optional chaining on the LHS.
      session.accessToken = token.accessToken;
      session.user.id = token.userId ?? session.user.id;
      session.user.tier = token.tier ?? "guest";
      session.user.groups = token.groups ?? [];
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
});