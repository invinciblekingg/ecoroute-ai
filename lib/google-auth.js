const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";

export function hasGoogleAuth() {
  return Boolean(googleClientId && googleClientSecret);
}

export function getGoogleCallbackUrl(origin) {
  return `${origin}/api/auth/google/callback`;
}

export function getGoogleAuthUrl({ origin, state }) {
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: getGoogleCallbackUrl(origin),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    include_granted_scopes: "true",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode({ code, origin }) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: getGoogleCallbackUrl(origin),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error_description || payload?.error || "Google token exchange failed.");
  }

  return payload;
}

export async function getGoogleUserProfile(accessToken) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error_description || payload?.error || "Could not read Google profile.");
  }

  return payload;
}
