import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const error = searchParams.get("error") || "unknown";
  const message = searchParams.get("message") || "";

  const redirectUrl = new URL("/auth-error", request.url);

  redirectUrl.searchParams.set("error", error);
  if (message) {
    redirectUrl.searchParams.set("message", message);
  }

  return NextResponse.redirect(redirectUrl);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const error = body.error || "unknown";
  const message = body.message || "";

  const redirectUrl = new URL("/auth-error", request.url);

  redirectUrl.searchParams.set("error", error);
  if (message) {
    redirectUrl.searchParams.set("message", message);
  }

  return NextResponse.redirect(redirectUrl);
}
