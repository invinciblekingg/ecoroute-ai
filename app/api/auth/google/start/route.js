import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getGoogleAuthUrl, hasGoogleAuth } from "../../../../../lib/google-auth";
import { getGoogleStateCookieOptions, googleStateCookieName } from "../../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const origin = new URL(request.url).origin;
  const redirectUrl = new URL("/", origin);

  if (!hasGoogleAuth()) {
    redirectUrl.searchParams.set("auth", "google-unavailable");
    return NextResponse.redirect(redirectUrl);
  }

  const state = randomUUID();
  const response = NextResponse.redirect(getGoogleAuthUrl({ origin, state }));
  response.cookies.set(googleStateCookieName, state, getGoogleStateCookieOptions());
  return response;
}
