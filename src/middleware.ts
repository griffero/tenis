import { NextResponse, type NextRequest } from "next/server";

// Middleware is intentionally lightweight (Edge-safe): we don't resolve the
// full session here, we only check for the presence of the NextAuth session
// cookie. Full auth verification happens inside each server component via
// `await auth()`, which runs on the Node runtime and hits Prisma.
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

const PROTECTED_PREFIXES = ["/dashboard", "/matches", "/leaderboard", "/profile"];

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const hasSession = SESSION_COOKIES.some((c) => req.cookies.has(c));

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !hasSession) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"],
};
