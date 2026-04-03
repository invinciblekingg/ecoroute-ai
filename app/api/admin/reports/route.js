import { getAdminOverview, listReports } from "../../../../lib/ecoroute-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");
    const reports = await listReports({ status, category, limit });
    const overview = await getAdminOverview({ reportsLimit: limit || reports.length });

    return Response.json({
      ok: true,
      count: reports.length,
      reports,
      storage: overview.storage,
      version: overview.version,
      dashboard: overview.dashboard,
      unreadNotifications: overview.unreadNotifications,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error?.message || "Could not load admin reports.",
      },
      { status: 500 }
    );
  }
}
