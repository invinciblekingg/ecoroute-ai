import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createUserSession, authenticateUser } from "../../../../lib/ecoroute-store";
import { getSessionCookieOptions, sessionCookieName } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  const result = loginSchema.safeParse(payload);
  if (!result.success) {
    return Response.json(
      {
        ok: false,
        message: "Please check your login details.",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const user = await authenticateUser(result.data.email, result.data.password);
  if (!user) {
    return Response.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
  }

  const headerStore = await headers();
  const sessionRecord = await createUserSession(user.id, {
    userAgent: headerStore.get("user-agent") || "",
    ipAddress: headerStore.get("x-forwarded-for") || "",
  });

  if (!sessionRecord) {
    return Response.json({ ok: false, message: "Could not create a session." }, { status: 500 });
  }

  const response = NextResponse.json({
    ok: true,
    message: "Logged in successfully.",
    user: sessionRecord.user,
  });

  response.cookies.set(sessionCookieName, sessionRecord.session.id, getSessionCookieOptions(sessionRecord.session.expiresAt));

  return response;
}
