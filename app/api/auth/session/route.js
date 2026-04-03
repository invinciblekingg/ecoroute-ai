import { cookies } from "next/headers";
import { getSessionById } from "../../../../lib/ecoroute-store";
import { sessionCookieName } from "../../../../lib/auth";
import { hasGoogleAuth } from "../../../../lib/google-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(sessionCookieName)?.value || "";
  const session = await getSessionById(sessionId);

  if (!session) {
    return Response.json({
      ok: true,
      authenticated: false,
      user: null,
      googleConfigured: hasGoogleAuth(),
    });
  }

  return Response.json({
    ok: true,
    authenticated: true,
    googleConfigured: hasGoogleAuth(),
    user: session.user,
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
    },
  });
}
