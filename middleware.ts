import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n";
import type { auth } from "./lib/auth";

type Session = typeof auth.$Infer.Session;

const intlMiddleware = createIntlMiddleware(routing);
const admin_emails = process.env.ADMIN_EMAILS?.split(",");

// Admin permission check
async function checkAdminAuth(request: NextRequest) {
  // Fetch session using better-auth's built-in session API
  const sessionResponse = await fetch(
    `${request.nextUrl.origin}/api/auth/get-session`,
    {
      method: "GET",
      headers: {
        Cookie: request.headers.get("Cookie") || "",
      },
    },
  );

  if (!sessionResponse.ok) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    // For page routes, redirect to login page with callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = (await sessionResponse.json()) as Session | null;
  if (!session) {
    // For API routes, return JSON response
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    // For page routes, redirect to login page with callback URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  const user = session.user;
  if (user.banned) {
    // For API routes, return JSON response
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Account is banned" },
        { status: 403 },
      );
    }
    // For page routes, redirect to unauthorized page
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Check if user email is in admin emails list
  if (!admin_emails?.includes(user.email) && user.role !== "admin") {
    // For API routes, return JSON response
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      );
    }
    // For page routes, redirect to unauthorized page
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  return null;
}
export async function middleware(request: NextRequest) {
  // Check admin routes first (both API and page routes)
  if (
    request.nextUrl.pathname.startsWith("/api/admin") ||
    request.nextUrl.pathname.includes("/admin")
  ) {
    const adminCheck = await checkAdminAuth(request);
    if (adminCheck) {
      return adminCheck;
    }
  }

  // Skip internationalization for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Handle internationalization for non-API routes
  const intlResponse = intlMiddleware(request);
  return intlResponse ?? NextResponse.next();
}
export const config = {
  matcher: [
    "/api/admin/(.*)",
    "/(.*)/admin/(.*)",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
