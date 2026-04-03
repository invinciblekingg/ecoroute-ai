import { getAdminActivity } from "../../../../lib/ecoroute-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || 25);
    const payload = await getAdminActivity(limit);

    return Response.json({
      ok: true,
      ...payload,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error?.message || "Could not load admin activity.",
      },
      { status: 500 }
    );
  }
}
