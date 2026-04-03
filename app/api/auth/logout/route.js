import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession } from "../../../../lib/ecoroute-store";
import { getSessionCookieOptions, sessionCookieName } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value || "";

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.json({
    ok: true,
    message: "Logged out successfully.",
  });

  response.cookies.set(sessionCookieName, "", getSessionCookieOptions(null));
  return response;
}
