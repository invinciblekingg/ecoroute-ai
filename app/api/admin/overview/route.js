import { getAdminOverview } from "../../../../lib/ecoroute-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const reportsLimit = url.searchParams.get("reportsLimit");
    const notificationsLimit = url.searchParams.get("notificationsLimit");
    const activityLimit = url.searchParams.get("activityLimit");
    const overview = await getAdminOverview({
      reportsLimit,
      notificationsLimit,
      activityLimit,
    });

    return Response.json({
      ok: true,
      ...overview,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error?.message || "Could not load admin overview.",
      },
      { status: 500 }
    );
  }
}
