import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PERSONAS } from "@/lib/personas";

// Routes that don't require auth
const PUBLIC_ROUTES = ["/", "/auth/error"];

// Tier 3 only
const ADMIN_ROUTES = ["/admin"];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;
  const pathname = nextUrl.pathname;

  if (
    PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  if (!isAuth) {
    const signInUrl = new URL("/", nextUrl);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const tier = req.auth!.user.tier;

  if (ADMIN_ROUTES.some((p) => pathname.startsWith(p)) && tier !== "tier3") {
    return NextResponse.redirect(new URL(PERSONAS[tier].defaultRoute, nextUrl));
  }

  if (tier === "guest" && !pathname.startsWith("/guest")) {
    return NextResponse.redirect(new URL(PERSONAS.guest.defaultRoute, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)).*)"],
};