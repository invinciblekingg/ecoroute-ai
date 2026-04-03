import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createUserSession, upsertOAuthUser } from "../../../../../lib/ecoroute-store";
import {
  exchangeGoogleCode,
  getGoogleUserProfile,
  hasGoogleAuth,
} from "../../../../../lib/google-auth";
import {
  getGoogleStateCookieOptions,
  getSessionCookieOptions,
  googleStateCookieName,
  sessionCookieName,
} from "../../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clearStateCookie(response) {
  response.cookies.set(googleStateCookieName, "", {
    ...getGoogleStateCookieOptions(),
    maxAge: 0,
  });
}

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const redirectUrl = new URL("/", origin);

  if (!hasGoogleAuth()) {
    redirectUrl.searchParams.set("auth", "google-unavailable");
    return NextResponse.redirect(redirectUrl);
  }

  const code = url.searchParams.get("code") || "";
  const returnedState = url.searchParams.get("state") || "";
  const authError = url.searchParams.get("error") || "";
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(googleStateCookieName)?.value || "";

  if (authError) {
    redirectUrl.searchParams.set("auth", authError);
    const response = NextResponse.redirect(redirectUrl);
    clearStateCookie(response);
    return response;
  }

  if (!code || !returnedState || returnedState !== expectedState) {
    redirectUrl.searchParams.set("auth", "google-state-mismatch");
    const response = NextResponse.redirect(redirectUrl);
    clearStateCookie(response);
    return response;
  }

  try {
    const tokens = await exchangeGoogleCode({ code, origin });
    const profile = await getGoogleUserProfile(tokens.access_token);
    const user = await upsertOAuthUser(profile, "google");

    if (!user) {
      throw new Error("Could not create a Google user.");
    }

    const headerStore = await headers();
    const sessionRecord = await createUserSession(user.id, {
      userAgent: headerStore.get("user-agent") || "",
      ipAddress: headerStore.get("x-forwarded-for") || "",
    });

    if (!sessionRecord) {
      throw new Error("Could not create a Google session.");
    }

    redirectUrl.searchParams.set("auth", "google-success");
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(
      sessionCookieName,
      sessionRecord.session.id,
      getSessionCookieOptions(sessionRecord.session.expiresAt)
    );
    clearStateCookie(response);
    return response;
  } catch {
    redirectUrl.searchParams.set("auth", "google-failed");
    const response = NextResponse.redirect(redirectUrl);
    clearStateCookie(response);
    return response;
  }
}
